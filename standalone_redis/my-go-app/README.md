
# 🚀 Go-Based WhatsApp Campaign Queue System

This project implements a scalable producer-consumer architecture using Go, Redis, and MySQL to manage WhatsApp campaign messages with **deduplication** and **partitioning by ID**.

## 🛠️ Architecture Overview

- **MySQL** stores campaign data.
- **Producers** fetch rows from MySQL and push messages to Redis (partitioned by ID parity).
- **Redis** is used as a job queue (`SET` keys like `job:<id>`).
- **Consumers** read from Redis, send WhatsApp messages, and delete keys upon success.
- **Deduplication** is ensured by checking Redis before inserting.
- **Partitioning**: 
  - Odd IDs → `Producer 1` → `Consumer 1`
  - Even IDs → `Producer 2` → `Consumer 2`

## 🧱 Project Structure

```
.
├── producer_odd.go        # Handles odd ID records
├── producer_even.go       # Handles even ID records
├── consumer_odd.go        # Processes odd ID Redis jobs
├── consumer_even.go       # Processes even ID Redis jobs
├── go.mod
└── README.md
```

## 🔧 Configuration

- MySQL DSN: `root:redhat123@tcp(127.0.0.1:3306)/Avianya_tech`
- Redis: `localhost:6379`
- Target Table: `campaign_master_1`
- WhatsApp Template: `hello_world`

> Edit credentials and config values inside `.go` files as needed.

## ⚙️ Table Structure Example

```sql
CREATE TABLE campaign_master_1 (
  id INT PRIMARY KEY AUTO_INCREMENT,
  column1 VARCHAR(20),     -- Phone number
  column3 TINYINT DEFAULT 1  -- 1 = pending, 0 = processed
);
```

## 🚦 Run Instructions

Start all four services in separate terminals or Docker containers:

```bash
go run producer_odd.go
go run producer_even.go
go run consumer_odd.go
go run consumer_even.go
```

Each service will run in a loop, polling every 5 seconds.

## 🧪 Test Endpoint

Consumers send POST requests to:

```http
POST http://localhost:8080/test_camp
Content-Type: application/json
```

You can mock this using a simple HTTP server or replace with your actual WhatsApp API handler.

## 💡 Features

- 🚫 No duplicate message processing.
- ⚖️ Load balanced via even/odd partitioning.
- 🔁 Auto polling and retry on failure.
- 🧵 Lightweight concurrent consumers with goroutines.

## 🧼 Cleanup

Each consumer deletes the Redis job key after successful delivery:
```go
rdb.Del(ctx, "job:<id>")
```

## 🛡️ Future Improvements

- Add retry logic with exponential backoff.
- Use Redis Streams for more robust queuing.
- Add metrics and logging dashboard.
- Horizontal scale consumers using consistent hashing.

---

### 🧑‍💻 Author

Made with ❤️ by Prasad Hajare

---
