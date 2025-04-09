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
			if id%2 != 0 {
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