// // package main

// // import (
// // 	"context"
// // 	"database/sql"
// // 	"encoding/json"
// // 	"fmt"
// // 	"log"
// // 	"time"

// // 	"github.com/go-redis/redis/v8"
// // 	_ "github.com/go-sql-driver/mysql"
// // )

// // var ctx = context.Background()

// // func main() {
// //     // Connect to MySQL
// //     db, err := sql.Open("mysql", "root:redhat123@tcp(127.0.0.1:3306)/Avianya_tech")
// //     if err != nil {
// //         log.Fatal(err)
// //     }
// //     defer db.Close()

// //     // Connect to Redis
// //     rdb := redis.NewClient(&redis.Options{
// //         Addr: "localhost:6379",
// //     })
// //     defer rdb.Close()

// //     for {
// //         fmt.Println("Checking for new data...")

// //         // Fetch data where column3 = 1
// //         rows, err := db.Query("SELECT id, column1 FROM `campaign_master_1` WHERE column3=1")
// //         if err != nil {
// //             log.Println("Error querying database:", err)
// //             time.Sleep(10 * time.Second) // Wait before retrying
// //             continue
// //         }

// //         hasData := false

// //         for rows.Next() {
// //             hasData = true
// //             var jobID int
// //             var contactNo string

// //             if err := rows.Scan(&jobID, &contactNo); err != nil {
// //                 log.Println("Error scanning row:", err)
// //                 continue
// //             }

// //             // Create the exact JSON format required
// //             messageData := map[string]interface{}{
// //                 "messaging_product": "whatsapp",
// //                 "to":                contactNo,
// //                 "type":              "template",
// //                 "template": map[string]interface{}{
// //                     "name": "hello_world",
// //                     "language": map[string]string{
// //                         "code": "en_US",
// //                     },
// //                 },
// //             }

// //             jsonData, err := json.Marshal(messageData)
// //             if err != nil {
// //                 log.Println("Error marshalling JSON:", err)
// //                 continue
// //             }

// //             // Store the JSON in Redis with key as job_id
// //             err = rdb.Set(ctx, fmt.Sprintf("job:%d", jobID), jsonData, 0).Err()
// //             if err != nil {
// //                 log.Println("Error storing in Redis:", err)
// //                 continue
// //             }

// //             fmt.Printf("Pushed job_id %d with contact_no %s to Redis\n", jobID, contactNo)

// //             // Update column3 to 0 after processing
// //             _, err = db.Exec("UPDATE `campaign_master_1` SET column3=0 WHERE id=?", jobID)
// //             if err != nil {
// //                 log.Println("Error updating database:", err)
// //                 continue
// //             }
// //         }

// //         rows.Close()

// //         if !hasData {
// //             fmt.Println("No new data. Waiting...")
// //             time.Sleep(10 * time.Second) // Wait before checking again
// //         } else {
// //             // Check if all column3 values are 0, then truncate table
// //             var count int
// //             err = db.QueryRow("SELECT COUNT(*) FROM `campaign_master_1` WHERE column3=1").Scan(&count)
// //             if err != nil {
// //                 log.Println("Error counting rows:", err)
// //                 continue
// //             }

// //             if count == 0 {
// //                 _, err = db.Exec("TRUNCATE TABLE `campaign_master_1`")
// //                 if err != nil {
// //                     log.Println("Error truncating table:", err)
// //                     continue
// //                 }
// //                 fmt.Println("Table truncated as all column3 values were 0")
// //             }
// //         }
// //     }
// // }

// package main

// import (
// 	"context"
// 	"database/sql"
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"strings"
// 	"time"

// 	"github.com/go-redis/redis/v8"
// 	_ "github.com/go-sql-driver/mysql"
// )

// var ctx = context.Background()

// const (
// 	batchSize     = 1000
// 	pollInterval  = 5 * time.Second
// 	redisKeyTTL   = 0 // no expiry
// 	mysqlDSN      = "root:redhat123@tcp(127.0.0.1:3306)/Avianya_tech"
// 	redisAddr     = "localhost:6379"
// 	jobKeyPrefix  = "job:"
// 	templateName  = "hello_world"
// 	templateLang  = "en_US"
// )

// func main() {
// 	db, err := sql.Open("mysql", mysqlDSN)
// 	if err != nil {
// 		log.Fatal("Error connecting to MySQL:", err)
// 	}
// 	defer db.Close()
// 	db.SetMaxOpenConns(10)

// 	rdb := redis.NewClient(&redis.Options{Addr: redisAddr})
// 	defer rdb.Close()

// 	for {
// 		rows, err := db.Query(fmt.Sprintf("SELECT id, column1 FROM campaign_master_1 WHERE column3=1 LIMIT %d", batchSize))
// 		if err != nil {
// 			log.Println("MySQL query error:", err)
// 			time.Sleep(pollInterval)
// 			continue
// 		}

// 		var (
// 			jobIDs []int
// 			data   = make(map[string]string)
// 		)

// 		for rows.Next() {
// 			var id int
// 			var contact string
// 			if err := rows.Scan(&id, &contact); err != nil {
// 				log.Println("Row scan error:", err)
// 				continue
// 			}

// 			jobIDs = append(jobIDs, id)
// 			key := fmt.Sprintf("%s%d", jobKeyPrefix, id)

// 			msg := map[string]interface{}{
// 				"messaging_product": "whatsapp",
// 				"to":                contact,
// 				"type":              "template",
// 				"template": map[string]interface{}{
// 					"name": templateName,
// 					"language": map[string]string{
// 						"code": templateLang,
// 					},
// 				},
// 			}

// 			jsonVal, err := json.Marshal(msg)
// 			if err != nil {
// 				log.Println("JSON marshal error for ID", id, ":", err)
// 				continue
// 			}

// 			data[key] = string(jsonVal)
// 		}
// 		rows.Close()

// 		if len(data) == 0 {
// 			log.Println("No new jobs. Waiting...")
// 			time.Sleep(pollInterval)
// 			continue
// 		}

// 		// Bulk insert into Redis
// 		pipe := rdb.Pipeline()
// 		for key, val := range data {
// 			pipe.Set(ctx, key, val, redisKeyTTL)
// 		}
// 		_, err = pipe.Exec(ctx)
// 		if err != nil {
// 			log.Println("Redis pipeline error:", err)
// 			continue
// 		}
// 		log.Printf("✅ Pushed %d jobs to Redis\n", len(data))

// 		// Bulk update MySQL to mark jobs as processed
// 		err = updateProcessedJobs(db, jobIDs)
// 		if err != nil {
// 			log.Println("MySQL batch update error:", err)
// 		}

// 		// Truncate if all jobs are processed
// 		truncateIfComplete(db)
// 	}
// }

// func updateProcessedJobs(db *sql.DB, ids []int) error {
// 	if len(ids) == 0 {
// 		return nil
// 	}
// 	placeholders := strings.Repeat("?,", len(ids))
// 	placeholders = placeholders[:len(placeholders)-1]
// 	query := fmt.Sprintf("UPDATE campaign_master_1 SET column3=0 WHERE id IN (%s)", placeholders)

// 	args := make([]interface{}, len(ids))
// 	for i, id := range ids {
// 		args[i] = id
// 	}

// 	_, err := db.Exec(query, args...)
// 	return err
// }

// func truncateIfComplete(db *sql.DB) {
// 	var count int
// 	err := db.QueryRow("SELECT COUNT(*) FROM campaign_master_1 WHERE column3=1").Scan(&count)
// 	if err != nil {
// 		log.Println("Count query error:", err)
// 		return
// 	}

// 	if count == 0 {
// 		_, err = db.Exec("TRUNCATE TABLE campaign_master_1")
// 		if err != nil {
// 			log.Println("Truncate error:", err)
// 			return
// 		}
// 		log.Println("✅ Table truncated (all jobs processed)")
// 	}
// }

// producer_odd.go
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
			"SELECT id, column1 FROM campaign_master_1 WHERE column3=1 AND MOD(id, 2)=1 LIMIT %d", batchSize))
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