package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Global MongoDB client
var mongoClient *mongo.Client

// Data represents the structure of the payload
type Data struct {
	ID    string `json:"id,omitempty" bson:"id,omitempty"`
	Name  string `json:"name" bson:"name"`
	Value string `json:"value" bson:"value"`
}

// connectToMongoDB establishes a connection to the MongoDB server
func connectToMongoDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	log.Println("Connected to MongoDB")
	mongoClient = client
}

// uploadDataHandler handles POST requests to upload data to MongoDB
func uploadDataHandler(w http.ResponseWriter, r *http.Request) {
	var data Data

	// Decode JSON from request body
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Insert data into MongoDB
	collection := mongoClient.Database("testdb").Collection("testcollection")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, bson.M{
		"id":    data.ID,
		"name":  data.Name,
		"value": data.Value,
	})
	if err != nil {
		http.Error(w, "Failed to insert data into MongoDB", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Data inserted successfully"})
}

func main() {
	// Connect to MongoDB
	connectToMongoDB()
	defer func() {
		if err := mongoClient.Disconnect(context.Background()); err != nil {
			log.Fatalf("Failed to disconnect MongoDB: %v", err)
		}
	}()

	// Set up the HTTP server and routes
	router := mux.NewRouter()
	router.HandleFunc("/upload", uploadDataHandler).Methods("POST")

	server := &http.Server{
		Handler:      router,
		Addr:         ":8080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Server is running at http://localhost:8080")
	log.Fatal(server.ListenAndServe())
}