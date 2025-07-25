package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	_ "github.com/go-sql-driver/mysql"
)

var ctx = context.Background()

const (
	mysqlDSN     = "root:redhat123@tcp(127.0.0.1:3306)/Avianya_tech"
	redisAddr    = "localhost:6379"
	batchSize    = 1000
    pollInterval = 100 * time.Millisecond
	jobKeyPrefix = "job:"
	templateName = "hello_world"
	templateLang = "en_US"
)

func main() {
	db, err := sql.Open("mysql", mysqlDSN)
	if err != nil {
		log.Fatalf("❌ MySQL connection failed: %v", err)
	}
	defer db.Close()

	rdb := redis.NewClient(&redis.Options{Addr: redisAddr})
	defer rdb.Close()

	for {
		jobIDs, jobData, err := markAsInProgress(db)
		if err != nil {
			log.Println("⚠️ Error selecting jobs:", err)
			time.Sleep(pollInterval)
			continue
		}

		if len(jobData) == 0 {
			log.Println("⏳ No new jobs found.")
			time.Sleep(pollInterval)
			continue
		}

		pipe := rdb.Pipeline()
		for key, value := range jobData {
			pipe.Set(ctx, key, value, 0)
		}
		_, err = pipe.Exec(ctx)

		if err != nil {
			log.Println("🚨 Redis pipeline error, resetting jobs:", err)
			resetInProgress(db, jobIDs)
			continue
		}

		markAsSent(db, jobIDs)
		log.Printf("✅ Successfully pushed %d jobs\n", len(jobIDs))
		time.Sleep(pollInterval)
	}
}

func markAsInProgress(db *sql.DB) ([]int, map[string]string, error) {
	// Drop the view if it exists
	// Drop both table or view if exists (safe way)
_, _ = db.Exec(`DROP VIEW IF EXISTS selected_rows1`)
_, _ = db.Exec(`DROP TABLE IF EXISTS selected_rows1`)

	// Create view for partitioned selection
	_, err := db.Exec(`
		CREATE TABLE selected_rows1 AS
		WITH quartiles AS (
			SELECT *, NTILE(4) OVER (ORDER BY id) AS quartile
			FROM campaign_master_1
		)
		SELECT id, column1 FROM quartiles
		WHERE quartile = 1 AND column3 = 1  LIMIT ?`, batchSize)
	if err != nil {
		return nil, nil, fmt.Errorf("TABLE creation failed: %w", err)
	}

	// Select from the view
	rows, err := db.Query("SELECT id, column1 FROM selected_rows1")
	if err != nil {
		return nil, nil, fmt.Errorf("failed to select from view: %w", err)
	}
	defer rows.Close()

	var jobIDs []int
	data := make(map[string]string)

	for rows.Next() {
		var id int
		var contact string
		if err := rows.Scan(&id, &contact); err != nil {
			log.Println("Scan error:", err)
			continue
		}
		jobIDs = append(jobIDs, id)

		key := fmt.Sprintf("%s%d", jobKeyPrefix, id)
		msg := map[string]interface{}{
			"messaging_product": "whatsapp",
			"to":                contact,
			"type":              "template",
			"template": map[string]interface{}{
				"name": templateName,
				"language": map[string]string{
					"code": templateLang,
				},
			},
		}
		val, _ := json.Marshal(msg)
		data[key] = string(val)
	}

	// Mark selected rows as in-progress (column3 = 2)
	if len(jobIDs) > 0 {
		err := updateColumn3(db, jobIDs, 2)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to mark as in-progress: %w", err)
		}
	}

	return jobIDs, data, nil
}

func markAsSent(db *sql.DB, ids []int) {
	err := updateColumn3(db, ids, 0)
	if err != nil {
		log.Println("❗ Error marking as sent:", err)
	}
}

func resetInProgress(db *sql.DB, ids []int) {
	err := updateColumn3(db, ids, 1)
	if err != nil {
		log.Println("⚠️ Failed to rollback in-progress jobs:", err)
	}
}

func updateColumn3(db *sql.DB, ids []int, value int) error {
	if len(ids) == 0 {
		return nil
	}
	placeholders := strings.Repeat("?,", len(ids))
	placeholders = placeholders[:len(placeholders)-1]

	args := make([]interface{}, len(ids)+1)
	args[0] = value
	for i, id := range ids {
		args[i+1] = id
	}

	query := fmt.Sprintf("UPDATE campaign_master_1 SET column3=? WHERE id IN (%s)", placeholders)
	_, err := db.Exec(query, args...)
	return err
}