// // package main

// // import (
// // 	"bytes"
// // 	"context"
// // 	"encoding/json"
// // 	"log"
// // 	"net/http"
// // 	"os"
// // 	"os/signal"
// // 	"time"

// // 	"github.com/go-redis/redis/v8"
// // )

// // var ctx, cancel = context.WithCancel(context.Background())

// // // Struct for WhatsApp JSON message
// // type WhatsAppMessage struct {
// // 	MessagingProduct string `json:"messaging_product"`
// // 	To              string `json:"to"`
// // 	Type            string `json:"type"`
// // 	Template        struct {
// // 		Name     string `json:"name"`
// // 		Language struct {
// // 			Code string `json:"code"`
// // 		} `json:"language"`
// // 	} `json:"template"`
// // }

// // const (
// // 	batchSize   = 1000
// // 	pollInterval = 1 * time.Second // Interval for checking Redis jobs
// // )

// // func main() {
// // 	rdb := redis.NewClient(&redis.Options{
// // 		Addr: "localhost:6379",
// // 	})
// // 	defer rdb.Close()

// // 	go handleShutdown()

// // 	log.Println("Job processor started...")

// // 	for {
// // 		select {
// // 		case <-ctx.Done():
// // 			log.Println("Shutting down job processor...")
// // 			return
// // 		default:
// // 			processJobs(rdb)
// // 			time.Sleep(pollInterval)
// // 		}
// // 	}
// // }

// // func processJobs(rdb *redis.Client) {
// // 	jobKeys, err := rdb.Keys(ctx, "job:*").Result()
// // 	if err != nil {
// // 		log.Printf("Error fetching job keys from Redis: %v", err)
// // 		return
// // 	}

// // 	for i := 0; i < len(jobKeys); i += batchSize {
// // 		end := i + batchSize
// // 		if end > len(jobKeys) {
// // 			end = len(jobKeys)
// // 		}
// // 		processBatch(rdb, jobKeys[i:end])
// // 	}
// // }

// // func processBatch(rdb *redis.Client, jobKeys []string) {
// // 	var messages []WhatsAppMessage

// // 	for _, jobKey := range jobKeys {
// // 		jsonData, err := rdb.Get(ctx, jobKey).Result()
// // 		if err != nil {
// // 			log.Printf("Error fetching data for job %s: %v", jobKey, err)
// // 			continue
// // 		}

// // 		var jobData WhatsAppMessage
// // 		if err := json.Unmarshal([]byte(jsonData), &jobData); err != nil {
// // 			log.Printf("Error unmarshaling JSON for job %s: %v", jobKey, err)
// // 			continue
// // 		}
// // 		messages = append(messages, jobData)
// // 	}

// // 	if len(messages) > 0 && sendBulk(messages) {
// // 		rdb.Del(ctx, jobKeys...).Err()
// // 		log.Printf("Successfully sent and removed %d jobs", len(messages))
// // 	} else {
// // 		log.Printf("Failed to send %d jobs, keeping in Redis", len(messages))
// // 	}
// // }

// // func sendBulk(data []WhatsAppMessage) bool {
// // 	url := "http://localhost:8080/test_camp"
// // 	jsonBytes, err := json.Marshal(data)
// // 	if err != nil {
// // 		log.Printf("Error marshaling JSON: %v", err)
// // 		return false
// // 	}

// // 	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonBytes))
// // 	if err == nil && resp.StatusCode >= 200 && resp.StatusCode < 300 {
// // 		log.Printf("Successfully sent batch to %s", url)
// // 		return true
// // 	}

// // 	log.Printf("Error sending batch to %s: %v", url, err)
// // 	return false
// // }

// //	func handleShutdown() {
// //		sigChan := make(chan os.Signal, 1)
// //		signal.Notify(sigChan, os.Interrupt)
// //		<-sigChan
// //		log.Println("Received shutdown signal")
// //		cancel()
// //	}
// package main

// import (
// 	"bytes"
// 	"context"
// 	"encoding/json"
// 	"log"
// 	"net"
// 	"net/http"
// 	"os"
// 	"os/signal"
// 	"sync"
// 	"time"

// 	"github.com/go-redis/redis/v8"
// )

// var (
// 	ctx, cancel = context.WithCancel(context.Background())
// 	rdb         *redis.Client
// 	httpClient  *http.Client
// 	tpsLimit    = 1000              // Max messages per second
// 	batchSize   = 10000             // Number of jobs pulled from Redis at once
// 	jobPrefix   = "job:*"           // Redis job key pattern
// 	pollDelay   = 1 * time.Second   // Delay between job polls
// 	rateDelay   = time.Second / 1000 // 1000 TPS = 1ms delay between sends
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
// 	rdb = redis.NewClient(&redis.Options{Addr: "localhost:6379"})
// 	defer rdb.Close()

// 	// Set up HTTP client with keep-alive
// 	httpClient = &http.Client{
// 		Transport: &http.Transport{
// 			MaxIdleConns:        1000,
// 			MaxConnsPerHost:     1000,
// 			IdleConnTimeout:     90 * time.Second,
// 			DisableCompression:  false,
// 			DialContext: (&net.Dialer{
// 				Timeout:   30 * time.Second,
// 				KeepAlive: 30 * time.Second,
// 			}).DialContext,
// 		},
// 		Timeout: 10 * time.Second,
// 	}

// 	go handleShutdown()

// 	log.Println("High-performance job processor started...")

// 	for {
// 		select {
// 		case <-ctx.Done():
// 			log.Println("Shutdown initiated...")
// 			return
// 		default:
// 			processJobs()
// 			time.Sleep(pollDelay)
// 		}
// 	}
// }

// func processJobs() {
// 	iter := rdb.Scan(ctx, 0, jobPrefix, int64(batchSize)).Iterator()
// 	var jobKeys []string

// 	for iter.Next(ctx) {
// 		jobKeys = append(jobKeys, iter.Val())
// 	}
// 	if err := iter.Err(); err != nil {
// 		log.Printf("Error scanning Redis keys: %v", err)
// 		return
// 	}

// 	if len(jobKeys) == 0 {
// 		log.Println("No jobs found.")
// 		return
// 	}

// 	log.Printf("Processing %d jobs...", len(jobKeys))

// 	var messages []WhatsAppMessage
// 	keyMap := make(map[string]string)

// 	for _, key := range jobKeys {
// 		jsonStr, err := rdb.Get(ctx, key).Result()
// 		if err != nil {
// 			log.Printf("Redis get error for %s: %v", key, err)
// 			continue
// 		}

// 		var msg WhatsAppMessage
// 		if err := json.Unmarshal([]byte(jsonStr), &msg); err != nil {
// 			log.Printf("JSON unmarshal error for %s: %v", key, err)
// 			continue
// 		}

// 		keyMap[msg.To] = key
// 		messages = append(messages, msg)
// 	}

// 	sendMessagesConcurrently(messages, keyMap)
// }

// func sendMessagesConcurrently(messages []WhatsAppMessage, keyMap map[string]string) {
// 	var wg sync.WaitGroup
// 	limiter := time.Tick(rateDelay) // 1000 TPS rate limiter

// 	for _, msg := range messages {
// 		<-limiter // wait for slot
// 		wg.Add(1)

// 		go func(m WhatsAppMessage) {
// 			defer wg.Done()
// 			if sendOne(m) {
// 				rdb.Del(ctx, keyMap[m.To])
// 			} else {
// 				log.Printf("Failed to send to %s", m.To)
// 			}
// 		}(msg)
// 	}
// 	wg.Wait()
// }

// func sendOne(msg WhatsAppMessage) bool {
// 	jsonBytes, err := json.Marshal(msg)
// 	if err != nil {
// 		log.Printf("Marshal error: %v", err)
// 		return false
// 	}

// 	req, err := http.NewRequest("POST", "http://localhost:8080/test_camp", bytes.NewBuffer(jsonBytes))
// 	if err != nil {
// 		log.Printf("Request build error: %v", err)
// 		return false
// 	}
// 	req.Header.Set("Content-Type", "application/json")

// 	resp, err := httpClient.Do(req)
// 	if err != nil {
// 		log.Printf("HTTP error: %v", err)
// 		return false
// 	}
// 	defer resp.Body.Close()

// 	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
// 		log.Printf("✅ Sent to %s", msg.To)
// 		return true
// 	}

// 	log.Printf("❌ HTTP %d for %s", resp.StatusCode, msg.To)
// 	return false
// }

// func handleShutdown() {
// 	sigChan := make(chan os.Signal, 1)
// 	signal.Notify(sigChan, os.Interrupt)
// 	<-sigChan
// 	log.Println("Received shutdown signal")
// 	cancel()
// }

// consumer_odd.go
// consumer_odd.go
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
)

var (
	ctx        = context.Background()
	httpClient = &http.Client{Timeout: 5 * time.Second}
	rdb        = redis.NewClient(&redis.Options{Addr: "localhost:6379"})
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
	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, os.Interrupt)
		<-sig
		log.Println("Shutting down...")
		os.Exit(0)
	}()

	for {
		keys := scanKeys("job:*")
		if len(keys) == 0 {
			time.Sleep(2 * time.Second)
			continue
		}

		var wg sync.WaitGroup
		for _, key := range keys {
			id := extractID(key)
			if id%2 != 1 {
				continue // Only process odd IDs
			}

			val, err := rdb.Get(ctx, key).Result()
			if err != nil {
				continue
			}

			var msg WhatsAppMessage
			if err := json.Unmarshal([]byte(val), &msg); err != nil {
				continue
			}

			wg.Add(1)
			go func(k string, m WhatsAppMessage) {
				defer wg.Done()
				if sendMessage(m) {
					rdb.Del(ctx, k)
				}
			}(key, msg)
		}
		wg.Wait()
	}
}

func scanKeys(pattern string) []string {
	var cursor uint64
	var keys []string
	for {
		var scanKeys []string
		var err error
		scanKeys, cursor, err = rdb.Scan(ctx, cursor, pattern, 1000).Result()
		if err != nil {
			return keys
		}
		keys = append(keys, scanKeys...)
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
		log.Printf("Send error: %v", err)
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode == 200
}

func extractID(key string) int {
	var id int
	fmt.Sscanf(strings.TrimPrefix(key, "job:"), "%d", &id)
	return id
}