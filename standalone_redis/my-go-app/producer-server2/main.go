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
	pollInterval = 5 * time.Second
	jobKeyPrefix = "job:"
	templateName = "hello_world"
	templateLang = "en_US"
)

func main() {
	db, _ := sql.Open("mysql", mysqlDSN)
	defer db.Close()

	rdb := redis.NewClient(&redis.Options{Addr: redisAddr})
	defer rdb.Close()

	for {
		rows, err := db.Query(fmt.Sprintf(
			"SELECT id, column1 FROM campaign_master_1 WHERE column3=1 AND MOD(id, 2)=0 LIMIT %d", batchSize))
		if err != nil {
			log.Println("MySQL query error:", err)
			time.Sleep(pollInterval)
			continue
		}

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
		rows.Close()

		if len(data) > 0 {
			pipe := rdb.Pipeline()
			for k, v := range data {
				pipe.Set(ctx, k, v, 0)
			}
			pipe.Exec(ctx)
			log.Printf("🔁 Pushed %d odd jobs\n", len(data))
			updateProcessedJobs(db, jobIDs)
		} else {
			log.Println("No odd jobs")
		}

		time.Sleep(pollInterval)
	}
}

func updateProcessedJobs(db *sql.DB, ids []int) {
	if len(ids) == 0 {
		return
	}
	placeholders := strings.Repeat("?,", len(ids))
	placeholders = placeholders[:len(placeholders)-1]
	query := fmt.Sprintf("UPDATE campaign_master_1 SET column3=0 WHERE id IN (%s)", placeholders)

	args := make([]interface{}, len(ids))
	for i, id := range ids {
		args[i] = id
	}
	db.Exec(query, args...)
}