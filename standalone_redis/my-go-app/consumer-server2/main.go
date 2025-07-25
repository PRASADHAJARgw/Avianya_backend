// // // // consumer_odd.go
// // // package main

// // // import (
// // // 	"bytes"
// // // 	"context"
// // // 	"encoding/json"
// // // 	"fmt"
// // // 	"log"
// // // 	"net/http"
// // // 	"os"
// // // 	"os/signal"
// // // 	"strings"
// // // 	"sync"
// // // 	"time"

// // // 	"github.com/go-redis/redis/v8"
// // // )

// // // var (
// // // 	ctx        = context.Background()
// // // 	httpClient = &http.Client{Timeout: 5 * time.Second}
// // // 	rdb        = redis.NewClient(&redis.Options{Addr: "localhost:6379"})
// // // )

// // // type WhatsAppMessage struct {
// // // 	MessagingProduct string `json:"messaging_product"`
// // // 	To               string `json:"to"`
// // // 	Type             string `json:"type"`
// // // 	Template         struct {
// // // 		Name     string `json:"name"`
// // // 		Language struct {
// // // 			Code string `json:"code"`
// // // 		} `json:"language"`
// // // 	} `json:"template"`
// // // }

// // // func main() {
// // // 	go func() {
// // // 		sig := make(chan os.Signal, 1)
// // // 		signal.Notify(sig, os.Interrupt)
// // // 		<-sig
// // // 		log.Println("Shutting down...")
// // // 		os.Exit(0)
// // // 	}()

// // // 	for {
// // // 		keys := scanKeys("job:*")
// // // 		if len(keys) == 0 {
// // // 			time.Sleep(2 * time.Second)
// // // 			continue
// // // 		}

// // // 		var wg sync.WaitGroup
// // // 		for _, key := range keys {
// // // 			id := extractID(key)
// // // 			if id%2 != 0 {
// // // 				continue // Only process odd IDs
// // // 			}

// // // 			val, err := rdb.Get(ctx, key).Result()
// // // 			if err != nil {
// // // 				continue
// // // 			}

// // // 			var msg WhatsAppMessage
// // // 			if err := json.Unmarshal([]byte(val), &msg); err != nil {
// // // 				continue
// // // 			}

// // // 			wg.Add(1)
// // // 			go func(k string, m WhatsAppMessage) {
// // // 				defer wg.Done()
// // // 				if sendMessage(m) {
// // // 					rdb.Del(ctx, k)
// // // 				}
// // // 			}(key, msg)
// // // 		}
// // // 		wg.Wait()
// // // 	}
// // // }

// // // func scanKeys(pattern string) []string {
// // // 	var cursor uint64
// // // 	var keys []string
// // // 	for {
// // // 		var scanKeys []string
// // // 		var err error
// // // 		scanKeys, cursor, err = rdb.Scan(ctx, cursor, pattern, 1000).Result()
// // // 		if err != nil {
// // // 			return keys
// // // 		}
// // // 		keys = append(keys, scanKeys...)
// // // 		if cursor == 0 {
// // // 			break
// // // 		}
// // // 	}
// // // 	return keys
// // // }

// // // func sendMessage(msg WhatsAppMessage) bool {
// // // 	body, _ := json.Marshal(msg)
// // // 	req, _ := http.NewRequest("POST", "http://localhost:8080/test_camp", bytes.NewBuffer(body))
// // // 	req.Header.Set("Content-Type", "application/json")

// // // 	resp, err := httpClient.Do(req)
// // // 	if err != nil {
// // // 		log.Printf("Send error: %v", err)
// // // 		return false
// // // 	}
// // // 	defer resp.Body.Close()

// // // 	return resp.StatusCode == 200
// // // }

// // // func extractID(key string) int {
// // // 	var id int
// // // 	fmt.Sscanf(strings.TrimPrefix(key, "job:"), "%d", &id)
// // // 	return id
// // // }

// // package main

// // import (
// // 	"bytes"
// // 	"context"
// // 	"encoding/json"
// // 	"fmt"
// // 	"log"
// // 	"net/http"
// // 	"os"
// // 	"os/signal"
// // 	"strings"
// // 	"sync"
// // 	"time"

// // 	"github.com/go-redis/redis/v8"
// // )

// // var (
// // 	ctx        = context.Background()
// // 	httpClient = &http.Client{Timeout: 5 * time.Second}
// // 	rdb        = redis.NewClient(&redis.Options{Addr: "localhost:6379"})
// // )

// // type WhatsAppMessage struct {
// // 	MessagingProduct string `json:"messaging_product"`
// // 	To               string `json:"to"`
// // 	Type             string `json:"type"`
// // 	Template         struct {
// // 		Name     string `json:"name"`
// // 		Language struct {
// // 			Code string `json:"code"`
// // 		} `json:"language"`
// // 	} `json:"template"`
// // }

// // func main() {
// // 	go func() {
// // 		sig := make(chan os.Signal, 1)
// // 		signal.Notify(sig, os.Interrupt)
// // 		<-sig
// // 		log.Println("Shutting down...")
// // 		os.Exit(0)
// // 	}()

// // 	totalProcessed := 0

// // 	for {
// // 		keys := scanKeys("job:*")
// // 		if len(keys) == 0 {
// // 			time.Sleep(2 * time.Second)
// // 			continue
// // 		}

// // 		var wg sync.WaitGroup
// // 		batchCount := 0

// // 		for _, key := range keys {
// // 			id := extractID(key)

// // 			val, err := rdb.Get(ctx, key).Result()
// // 			if err != nil {
// // 				log.Printf("Failed to get key %s: %v", key, err)
// // 				continue
// // 			}

// // 			var msg WhatsAppMessage
// // 			if err := json.Unmarshal([]byte(val), &msg); err != nil {
// // 				log.Printf("Invalid JSON for key %s: %v", key, err)
// // 				continue
// // 			}

// // 			wg.Add(1)
// // 			go func(k string, m WhatsAppMessage, id int) {
// // 				defer wg.Done()
// // 				if sendMessage(m) {
// // 					rdb.Del(ctx, k)
// // 					log.Printf("✅ Processed and deleted job ID: %d", id)
// // 				} else {
// // 					log.Printf("❌ Failed to send message for job ID: %d", id)
// // 				}
// // 			}(key, msg, id)

// // 			batchCount++
// // 		}

// // 		wg.Wait()
// // 		totalProcessed += batchCount
// // 		log.Printf("🔄 Batch complete: %d jobs processed in this cycle | Total processed so far: %d", batchCount, totalProcessed)
// // 		time.Sleep(1 * time.Second)
// // 	}
// // }

// // func scanKeys(pattern string) []string {
// // 	var cursor uint64
// // 	var keys []string
// // 	for {
// // 		scanKeys, newCursor, err := rdb.Scan(ctx, cursor, pattern, 1000).Result()
// // 		if err != nil {
// // 			log.Printf("Error scanning keys: %v", err)
// // 			return keys
// // 		}
// // 		keys = append(keys, scanKeys...)
// // 		cursor = newCursor
// // 		if cursor == 0 {
// // 			break
// // 		}
// // 	}
// // 	return keys
// // }

// // func sendMessage(msg WhatsAppMessage) bool {
// // 	body, _ := json.Marshal(msg)
// // 	req, _ := http.NewRequest("POST", "http://localhost:8080/test_camp", bytes.NewBuffer(body))
// // 	req.Header.Set("Content-Type", "application/json")

// // 	resp, err := httpClient.Do(req)
// // 	if err != nil {
// // 		log.Printf("HTTP request error: %v", err)
// // 		return false
// // 	}
// // 	defer resp.Body.Close()

// // 	return resp.StatusCode == 200
// // }

// // func extractID(key string) int {
// // 	var id int
// // 	fmt.Sscanf(strings.TrimPrefix(key, "job:"), "%d", &id)
// // 	return id
// // }

// package main

// import (
// 	"bytes"
// 	"context"
// 	"encoding/json"
// 	"log"
// 	"net/http"
// 	"os"
// 	"os/signal"
// 	"sync"
// 	"time"

// 	"github.com/go-redis/redis/v8"
// )

// var (
// 	ctx         = context.Background()
// 	httpClient  = &http.Client{Timeout: 3 * time.Second}
// 	rdb         = redis.NewClient(&redis.Options{Addr: "localhost:6379"})
// 	workerLimit = 1000 // Max concurrent workers to achieve 1000 TPS
// 	semaphore   = make(chan struct{}, workerLimit)
// )

// type WhatsAppMessage struct {
// 	MessagingProduct string `json:"messaging_product"`
// 	To               string `json:"to"`
// 	Type             string `json:"type"`
// 	Template         struct {
// 		Name     string `json:"name"`
// 		Language struct {
// 			Code string `json:"code"`
// 		} `json:"language"`
// 	} `json:"template"`
// }

// func main() {
// 	go gracefulShutdown()

// 	totalProcessed := 0

// 	for {
// 		keys := scanKeys("job:*")
// 		if len(keys) == 0 {
// 			log.Println("🟡 No jobs found in Redis")
// 			time.Sleep(500 * time.Millisecond)
// 			continue
// 		}

// 		var wg sync.WaitGroup
// 		batchStart := time.Now()

// 		for _, key := range keys {
// 			semaphore <- struct{}{} // Acquire
// 			wg.Add(1)

// 			go func(k string) {
// 				defer func() {
// 					<-semaphore // Release
// 					wg.Done()
// 				}()

// 				val, err := rdb.Get(ctx, k).Result()
// 				if err != nil {
// 					log.Printf("❌ Redis GET error: %v", err)
// 					return
// 				}

// 				var msg WhatsAppMessage
// 				if err := json.Unmarshal([]byte(val), &msg); err != nil {
// 					log.Printf("❌ JSON parse error: %v", err)
// 					return
// 				}

// 				if sendMessage(msg) {
// 					rdb.Del(ctx, k)
// 					log.Printf("✅ Sent & deleted job: %s", k)
// 				} else {
// 					log.Printf("❌ Send failed for job: %s", k)
// 				}
// 			}(key)
// 		}

// 		wg.Wait()
// 		batchTime := time.Since(batchStart)
// 		totalProcessed += len(keys)
// 		log.Printf("🔁 Processed %d jobs in %.2fs | Total: %d", len(keys), batchTime.Seconds(), totalProcessed)

// 		time.Sleep(100 * time.Millisecond)
// 	}
// }

// func gracefulShutdown() {
// 	sig := make(chan os.Signal, 1)
// 	signal.Notify(sig, os.Interrupt)
// 	<-sig
// 	log.Println("🔌 Shutting down gracefully...")
// 	os.Exit(0)
// }

// func scanKeys(pattern string) []string {
// 	var cursor uint64
// 	var keys []string
// 	for {
// 		scan, newCursor, err := rdb.Scan(ctx, cursor, pattern, 1000).Result()
// 		if err != nil {
// 			log.Printf("Redis SCAN error: %v", err)
// 			return keys
// 		}
// 		keys = append(keys, scan...)
// 		cursor = newCursor
// 		if cursor == 0 {
// 			break
// 		}
// 	}
// 	return keys
// }

// func sendMessage(msg WhatsAppMessage) bool {
// 	body, _ := json.Marshal(msg)
// 	req, _ := http.NewRequest("POST", "http://localhost:8080/test_camp", bytes.NewBuffer(body))
// 	req.Header.Set("Content-Type", "application/json")

// 	resp, err := httpClient.Do(req)
// 	if err != nil {
// 		return false
// 	}
// 	defer resp.Body.Close()
// 	return resp.StatusCode == 200
// }

package main

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
)

var (
	ctx         = context.Background()
	httpClient  = &http.Client{Timeout: 3 * time.Second}
	rdb         = redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	rateLimiter = make(chan struct{}, 500) // Token bucket for 1000 TPS
)

type WhatsAppMessage struct {
	MessagingProduct string `json:"messaging_product"`
	To               string `json:"to"`
	Type             string `json:"type"`
	Template         struct {
		Name     string `json:"name"`
		Language struct {
			Code string `json:"code"`
		} `json:"language"`
	} `json:"template"`
}

func main() {
	go gracefulShutdown()
	go refillRateLimiter() // Start rate limiter refill

	totalProcessed := 0

	for {
		keys := scanKeys("job:*")
		if len(keys) == 0 {
			log.Println("🟡 No jobs found in Redis")
			time.Sleep(200 * time.Millisecond)
			continue
		}

		var wg sync.WaitGroup
		batchStart := time.Now()

		for _, key := range keys {
			<-rateLimiter // Respect 1000 TPS
			wg.Add(1)

			go func(k string) {
				defer wg.Done()

				val, err := rdb.Get(ctx, k).Result()
				if err != nil {
					log.Printf("❌ Redis GET error: %v", err)
					return
				}

				var msg WhatsAppMessage
				if err := json.Unmarshal([]byte(val), &msg); err != nil {
					log.Printf("❌ JSON parse error: %v", err)
					return
				}

				if sendMessage(msg) {
					rdb.Del(ctx, k)
					log.Printf("✅ Sent & deleted job: %s", k)
				} else {
					log.Printf("❌ Send failed for job: %s", k)
				}
			}(key)
		}

		wg.Wait()
		batchTime := time.Since(batchStart)
		totalProcessed += len(keys)
		log.Printf("🔁 Processed %d jobs in %.2fs | Total: %d", len(keys), batchTime.Seconds(), totalProcessed)
	}
}

func gracefulShutdown() {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt)
	<-sig
	log.Println("🔌 Shutting down gracefully...")
	os.Exit(0)
}

func scanKeys(pattern string) []string {
	var cursor uint64
	var keys []string
	for {
		scan, newCursor, err := rdb.Scan(ctx, cursor, pattern, 1000).Result()
		if err != nil {
			log.Printf("Redis SCAN error: %v", err)
			return keys
		}
		keys = append(keys, scan...)
		cursor = newCursor
		if cursor == 0 {
			break
		}
	}
	return keys
}

func sendMessage(msg WhatsAppMessage) bool {
	body, _ := json.Marshal(msg)
	req, _ := http.NewRequest("POST", "http://localhost:8080/test_camp", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode == 200
}

// Refill 1000 tokens every second to ensure strict 1000 TPS
func refillRateLimiter() {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for range ticker.C {
		for i := 0; i < 500; i++ {
			select {
			case rateLimiter <- struct{}{}:
			default:
				// bucket full, discard extra tokens
			}
		}
	}
}