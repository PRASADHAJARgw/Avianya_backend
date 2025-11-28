package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type Workflow struct {
	Name    string          `json:"name"`
	Flow    json.RawMessage `json:"flow_json"`
	Created time.Time       `json:"created_at"`
}

var (
	storeMu   sync.RWMutex
	workflows = map[string]Workflow{}
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from localhost:3003 (frontend) and localhost:3000
		origin := r.Header.Get("Origin")
		allowedOrigins := []string{
			"http://localhost:3000",
			"http://localhost:8080",
			"http://localhost:3002",
			"http://localhost:3003",
		}
		
		// Check if the origin is in the allowed list
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}
		
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// loadEnv loads environment variables from .env file
func loadEnv() {
	file, err := os.Open(".env")
	if err != nil {
		log.Printf("Warning: .env file not found, using system environment variables")
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		
		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		
		// Split on first =
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		
		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		
		// Only set if not already set in system env
		if os.Getenv(key) == "" {
			os.Setenv(key, value)
		}
	}
	
	if err := scanner.Err(); err != nil {
		log.Printf("Error reading .env file: %v", err)
	}
}

// postOnly wraps a handler to allow only POST requests
func postOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		next(w, r)
	}
}

func main() {
	// Load environment variables from .env file
	loadEnv()
	
	// Log if WhatsApp credentials are loaded
	if token := os.Getenv("WA_TOKEN"); token != "" {
		log.Printf("WhatsApp credentials loaded successfully")
	} else {
		log.Printf("Warning: WA_TOKEN not set, messages will only be logged")
	}
	
	http.HandleFunc("/api/workflow", corsMiddleware(postOnly(handleSaveWorkflow)))
	http.HandleFunc("/api/sendMessage", corsMiddleware(postOnly(handleSendMessage)))
	http.HandleFunc("/templates", corsMiddleware(postOnly(handleTemplates)))
	http.HandleFunc("/webhook", corsMiddleware(postOnly(handleWebhook)))

	addr := ":8080"
	log.Printf("Starting server on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func handleSendMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form data
	err := r.ParseMultipartForm(32 << 20) // 32MB max
	if err != nil {
		log.Printf("Error parsing form: %v", err)
		http.Error(w, "error parsing form data", http.StatusBadRequest)
		return
	}

	// Get form values
	to := r.FormValue("to")
	message := r.FormValue("message")
	template := r.FormValue("template")

	if to == "" {
		http.Error(w, "missing 'to' field", http.StatusBadRequest)
		return
	}

	// Check if a file is being uploaded
	uploadedFile, header, fileErr := r.FormFile("file")
	hasFile := fileErr == nil
	if hasFile {
		defer uploadedFile.Close()
	}

	log.Printf("Send message request: to=%s, message=%s, template=%s, hasFile=%v", to, message, template, hasFile)

	// Handle template messages
	if template != "" {
		var templateData map[string]interface{}
		if err := json.Unmarshal([]byte(template), &templateData); err != nil {
			log.Printf("Error parsing template: %v", err)
			http.Error(w, "invalid template data", http.StatusBadRequest)
			return
		}
		
		templateName, _ := templateData["name"].(string)
		language := "en_US"
		if lang, ok := templateData["language"].(map[string]interface{}); ok {
			if code, ok := lang["code"].(string); ok {
				language = code
			}
		}
		
		log.Printf("Sending template message: %s in %s to %s", templateName, language, to)
		
		// Save template message to Supabase
		saveMessageToSupabase(to, map[string]interface{}{
			"type": "template",
			"to": to,
			"template": templateData,
		})
		
		sendWhatsAppTemplate(to, templateName, language)
	} else if message != "" {
		// Handle regular text messages
		log.Printf("Sending text message: %s to %s", message, to)
		
		// Save text message to Supabase
		saveMessageToSupabase(to, map[string]interface{}{
			"type": "text",
			"to": to,
			"text": map[string]interface{}{
				"body": message,
			},
		})
		
		sendWhatsAppText(to, message)
	} else if !hasFile {
		// Only return error if there's no file and no message
		http.Error(w, "missing message content or file", http.StatusBadRequest)
		return
	}

	// Handle file uploads if present
	if hasFile {
		fileType := r.FormValue("fileType")
		log.Printf("File uploaded: %s (type: %s, size: %d bytes)", header.Filename, fileType, header.Size)
		
		// Determine the media type based on fileType
		mediaType := fileType
		if fileType == "photos" {
			mediaType = "image"
		} else if fileType == "videos" {
			mediaType = "video"
		} else if fileType == "documents" {
			mediaType = "document"
		}
		
		// Read file data
		fileData, err := io.ReadAll(uploadedFile)
		if err != nil {
			log.Printf("Error reading file: %v", err)
		} else {
			// Upload to WhatsApp and get media ID
			mediaID := uploadMediaToWhatsApp(fileData, header.Filename, mediaType)
			
			if mediaID != "" {
				// Send media message via WhatsApp
				caption := message // Use message as caption if present
				sendWhatsAppMedia(to, mediaID, mediaType, caption)
				
				// Upload to Supabase Storage for display in UI
				supabaseMediaPath := uploadToSupabaseStorage(fileData, header.Filename, mediaType)
				
				// Save media message to Supabase with storage path
				messagePayload := map[string]interface{}{
					"type": mediaType,
					"to":   to,
				}
				
				mediaData := map[string]interface{}{
					"caption": message,
					"id":      mediaID,
				}
				
				if supabaseMediaPath != "" {
					mediaData["link"] = supabaseMediaPath
				} else {
					mediaData["filename"] = header.Filename
				}
				
				messagePayload[mediaType] = mediaData
				saveMessageToSupabase(to, messagePayload)
			} else {
				// Save without media URL if upload failed
				saveMessageToSupabase(to, map[string]interface{}{
					"type": mediaType,
					"to": to,
					mediaType: map[string]interface{}{
						"caption":  message,
						"filename": header.Filename,
					},
				})
			}
		}
		
		log.Printf("Media message processed (type: %s)", mediaType)
	}

	// Return success response
	response := map[string]interface{}{
		"success": true,
		"message": "Message sent successfully",
		"to":      to,
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleSaveWorkflow(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var payload map[string]json.RawMessage
	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	name := "unnamed"
	if n, ok := payload["name"]; ok {
		var s string
		_ = json.Unmarshal(n, &s)
		name = s
	}
	flow, ok := payload["flow_json"]
	if !ok {
		http.Error(w, "missing flow_json", http.StatusBadRequest)
		return
	}

	id := fmt.Sprintf("wf_%d", time.Now().UnixNano())
	storeMu.Lock()
	workflows[id] = Workflow{Name: name, Flow: flow, Created: time.Now()}
	storeMu.Unlock()

	resp := map[string]string{"id": id}
	b, _ := json.Marshal(resp)
	w.Header().Set("Content-Type", "application/json")
	w.Write(b)
}

// A simple templates endpoint that returns demo templates.
func handleTemplates(w http.ResponseWriter, r *http.Request) {
	// Only allow POST (enforced by postOnly)
	templates := []map[string]interface{}{
		{"id": "welcome_1", "temp_title": "Welcome Template", "name": "welcome_template"},
		{"id": "promo_1", "temp_title": "Promo Template", "name": "promo_template"},
	}
	b, _ := json.Marshal(templates)
	w.Header().Set("Content-Type", "application/json")
	w.Write(b)
}

// Simple webhook that expects JSON { "from": "+123", "text": "hi" }
// It will look up saved workflows and match trigger nodes with triggerType=keyword and keyword list.
func handleWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var ev map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&ev); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	text := ""
	from := ""
	if t, ok := ev["text"]; ok {
		text = fmt.Sprint(t)
	}
	if f, ok := ev["from"]; ok {
		from = fmt.Sprint(f)
	}

	// iterate workflows and try to match triggers
	storeMu.RLock()
	defer storeMu.RUnlock()
	for id, wf := range workflows {
		var flowObj map[string]interface{}
		if err := json.Unmarshal(wf.Flow, &flowObj); err != nil {
			log.Printf("invalid flow in %s: %v", id, err)
			continue
		}
		nodes, _ := flowObj["nodes"].([]interface{})
		for _, nobj := range nodes {
			n, _ := nobj.(map[string]interface{})
			if n == nil {
				continue
			}
			if n["type"] == "trigger" {
				data, _ := n["data"].(map[string]interface{})
				if data == nil {
					continue
				}
				if data["triggerType"] == "keyword" {
					kv := fmt.Sprint(data["keyword"])
					keywords := strings.Split(kv, ",")
					for i := range keywords {
						keywords[i] = strings.TrimSpace(keywords[i])
					}
					for _, k := range keywords {
						if strings.EqualFold(k, text) {
							log.Printf("workflow %s matched keyword '%s' from %s", id, k, from)
							// find connected whatsapp-message nodes and executeSend
							executeWorkflowSend(flowObj, from, text)
							w.WriteHeader(http.StatusOK)
							w.Write([]byte("ok"))
							return
						}
					}
				}
			}
		}
	}
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("no match"))
}

// executeWorkflowSend finds whatsapp-message nodes and sends/logs messages
func executeWorkflowSend(flowObj map[string]interface{}, toPhone string, incomingText string) {
	nodes, _ := flowObj["nodes"].([]interface{})
	for _, nobj := range nodes {
		n, _ := nobj.(map[string]interface{})
		if n == nil {
			continue
		}
		if n["type"] == "whatsapp-message" {
			data, _ := n["data"].(map[string]interface{})
			if data == nil {
				continue
			}
			// choose based on messageType
			mt := fmt.Sprint(data["messageType"])
			switch mt {
			case "SESSIONAL":
				if textObj, ok := data["text"].(map[string]interface{}); ok {
					body := fmt.Sprint(textObj["body"])
					sendWhatsAppText(toPhone, body)
				}
			case "TEMPLATE":
				// send template name + language; backend could render components
				if tpl, ok := data["template"].(map[string]interface{}); ok {
					name := fmt.Sprint(tpl["name"])
					lang := "en_US"
					if lmap, ok := tpl["language"].(map[string]interface{}); ok {
						if cc, ok := lmap["code"]; ok {
							lang = fmt.Sprint(cc)
						}
					}
					sendWhatsAppTemplate(toPhone, name, lang)
				}
			case "INTERACTIVE":
				if inter, ok := data["interactive"].(map[string]interface{}); ok {
					itype := fmt.Sprint(inter["type"])
					if itype == "button" {
						// build button payload
						b := ""
						if body, ok := inter["body"].(map[string]interface{}); ok {
							b = fmt.Sprint(body["text"])
						}
						buttons := []map[string]interface{}{}
						if action, ok := inter["action"].(map[string]interface{}); ok {
							if bs, ok := action["buttons"].([]interface{}); ok {
								for _, bi := range bs {
									buttons = append(buttons, map[string]interface{}{"raw": bi})
								}
							}
						}
						sendWhatsAppInteractiveButtons(toPhone, b, buttons)
					} else if itype == "list" {
						// build list payload
						b := ""
						if body, ok := inter["body"].(map[string]interface{}); ok {
							b = fmt.Sprint(body["text"])
						}
						action := inter["action"]
						sendWhatsAppInteractiveList(toPhone, b, action)
					}
				}
			default:
				log.Printf("unknown messageType: %s", mt)
			}
		}
	}
}

// The following send* functions attempt to POST to WhatsApp Cloud API if env vars present,
// otherwise they just log the payload. This keeps the example safe to run locally.

func sendWhatsAppText(to string, body string) {
	log.Printf("sendWhatsAppText to=%s body=%s", to, body)
	// Build request if credentials provided
	token := os.Getenv("WA_TOKEN")
	phoneID := os.Getenv("WA_PHONE_ID")
	if token == "" || phoneID == "" {
		log.Printf("WA_TOKEN or WA_PHONE_ID not set; skipping real send")
		return
	}
	payload := map[string]interface{}{
		"messaging_product": "whatsapp",
		"to":                to,
		"type":              "text",
		"text":              map[string]interface{}{"body": body},
	}
	postToWhatsApp(phoneID, token, payload)
}

func sendWhatsAppTemplate(to, name, language string) {
	log.Printf("sendWhatsAppTemplate to=%s template=%s lang=%s", to, name, language)
	token := os.Getenv("WA_TOKEN")
	phoneID := os.Getenv("WA_PHONE_ID")
	if token == "" || phoneID == "" {
		return
	}
	payload := map[string]interface{}{
		"messaging_product": "whatsapp",
		"to":                to,
		"type":              "template",
		"template": map[string]interface{}{
			"name":     name,
			"language": map[string]string{"code": language},
		},
	}
	postToWhatsApp(phoneID, token, payload)
}

func sendWhatsAppInteractiveButtons(to, body string, buttons []map[string]interface{}) {
	log.Printf("sendWhatsAppInteractiveButtons to=%s body=%s buttons=%v", to, body, buttons)
	token := os.Getenv("WA_TOKEN")
	phoneID := os.Getenv("WA_PHONE_ID")
	if token == "" || phoneID == "" {
		return
	}
	action := map[string]interface{}{"buttons": buttons}
	payload := map[string]interface{}{
		"messaging_product": "whatsapp",
		"to":                to,
		"type":              "interactive",
		"interactive": map[string]interface{}{
			"type":   "button",
			"body":   map[string]string{"text": body},
			"action": action,
		},
	}
	postToWhatsApp(phoneID, token, payload)
}

func sendWhatsAppInteractiveList(to, body string, action interface{}) {
	log.Printf("sendWhatsAppInteractiveList to=%s body=%s action=%v", to, body, action)
	token := os.Getenv("WA_TOKEN")
	phoneID := os.Getenv("WA_PHONE_ID")
	if token == "" || phoneID == "" {
		return
	}
	payload := map[string]interface{}{
		"messaging_product": "whatsapp",
		"to":                to,
		"type":              "interactive",
		"interactive": map[string]interface{}{
			"type":   "list",
			"body":   map[string]string{"text": body},
			"action": action,
		},
	}
	postToWhatsApp(phoneID, token, payload)
}

func postToWhatsApp(phoneID, token string, payload interface{}) {
	url := fmt.Sprintf("https://graph.facebook.com/v17.0/%s/messages", phoneID)
	b, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPost, url, strings.NewReader(string(b)))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("postToWhatsApp error: %v", err)
		return
	}
	defer resp.Body.Close()
	rb, _ := io.ReadAll(resp.Body)
	log.Printf("WA response: %s", string(rb))
}

// saveMessageToSupabase saves a sent message to the Supabase database
func saveMessageToSupabase(chatID string, messagePayload map[string]interface{}) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	// Try SERVICE_ROLE key first (for backend), fallback to ANON key
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if supabaseKey == "" {
		supabaseKey = os.Getenv("SUPABASE_ANON_KEY")
		log.Printf("Warning: Using ANON_KEY instead of SERVICE_ROLE_KEY. This may fail due to RLS policies.")
	}
	
	if supabaseURL == "" || supabaseKey == "" {
		log.Printf("SUPABASE_URL or SUPABASE key not set; skipping database save")
		return
	}
	
	// Create the message record to insert
	messageRecord := map[string]interface{}{
		"chat_id":     chatID,
		"message":     messagePayload,
		"is_received": false, // This is a sent message, not received
		"wam_id":      fmt.Sprintf("sent_%d", time.Now().UnixNano()),
	}
	
	// Convert to JSON
	jsonData, err := json.Marshal(messageRecord)
	if err != nil {
		log.Printf("Error marshaling message data: %v", err)
		return
	}
	
	// Make request to Supabase
	url := fmt.Sprintf("%s/rest/v1/messages", supabaseURL)
	req, err := http.NewRequest(http.MethodPost, url, strings.NewReader(string(jsonData)))
	if err != nil {
		log.Printf("Error creating Supabase request: %v", err)
		return
	}
	
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=minimal")
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error saving message to Supabase: %v", err)
		return
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Failed to save message to Supabase (status %d): %s", resp.StatusCode, string(body))
		return
	}
	
	log.Printf("Message saved to Supabase successfully")
}

// uploadMediaToWhatsApp uploads a media file to WhatsApp and returns the media ID
func uploadMediaToWhatsApp(fileData []byte, filename string, mediaType string) string {
	token := os.Getenv("WA_TOKEN")
	phoneID := os.Getenv("WA_PHONE_ID")
	
	if token == "" || phoneID == "" {
		log.Printf("WA_TOKEN or WA_PHONE_ID not set; skipping media upload")
		return ""
	}
	
	// Determine MIME type based on file extension
	mimeType := "application/octet-stream"
	if strings.HasSuffix(strings.ToLower(filename), ".png") {
		mimeType = "image/png"
	} else if strings.HasSuffix(strings.ToLower(filename), ".jpg") || strings.HasSuffix(strings.ToLower(filename), ".jpeg") {
		mimeType = "image/jpeg"
	} else if strings.HasSuffix(strings.ToLower(filename), ".gif") {
		mimeType = "image/gif"
	} else if strings.HasSuffix(strings.ToLower(filename), ".webp") {
		mimeType = "image/webp"
	} else if strings.HasSuffix(strings.ToLower(filename), ".mp4") {
		mimeType = "video/mp4"
	} else if strings.HasSuffix(strings.ToLower(filename), ".3gpp") || strings.HasSuffix(strings.ToLower(filename), ".3gp") {
		mimeType = "video/3gpp"
	} else if strings.HasSuffix(strings.ToLower(filename), ".pdf") {
		mimeType = "application/pdf"
	} else if strings.HasSuffix(strings.ToLower(filename), ".doc") {
		mimeType = "application/msword"
	} else if strings.HasSuffix(strings.ToLower(filename), ".docx") {
		mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	} else if strings.HasSuffix(strings.ToLower(filename), ".xls") {
		mimeType = "application/vnd.ms-excel"
	} else if strings.HasSuffix(strings.ToLower(filename), ".xlsx") {
		mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	}
	
	log.Printf("Uploading media: %s (MIME: %s)", filename, mimeType)
	
	// Create multipart form data with proper buffer
	var bodyBuffer strings.Builder
	writer := multipart.NewWriter(&bodyBuffer)
	
	// Add messaging_product field
	writer.WriteField("messaging_product", "whatsapp")
	
	// Add file field with proper headers
	h := make(map[string][]string)
	h["Content-Type"] = []string{mimeType}
	part, err := writer.CreatePart(map[string][]string{
		"Content-Disposition": {fmt.Sprintf(`form-data; name="file"; filename="%s"`, filename)},
		"Content-Type":        {mimeType},
	})
	if err != nil {
		log.Printf("Error creating form file: %v", err)
		return ""
	}
	_, err = part.Write(fileData)
	if err != nil {
		log.Printf("Error writing file data: %v", err)
		return ""
	}
	
	writer.Close()
	
	// Upload to WhatsApp
	url := fmt.Sprintf("https://graph.facebook.com/v17.0/%s/media", phoneID)
	req, err := http.NewRequest(http.MethodPost, url, strings.NewReader(bodyBuffer.String()))
	if err != nil {
		log.Printf("Error creating upload request: %v", err)
		return ""
	}
	
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error uploading media: %v", err)
		return ""
	}
	defer resp.Body.Close()
	
	responseBody, _ := io.ReadAll(resp.Body)
	log.Printf("Media upload response: %s", string(responseBody))
	
	// Parse response to get media ID
	var result map[string]interface{}
	if err := json.Unmarshal(responseBody, &result); err == nil {
		if id, ok := result["id"].(string); ok {
			log.Printf("Media uploaded successfully, ID: %s", id)
			return id
		}
	}
	
	return ""
}

// sendWhatsAppMedia sends a media message via WhatsApp
func sendWhatsAppMedia(to, mediaID, mediaType, caption string) {
	log.Printf("sendWhatsAppMedia to=%s mediaID=%s type=%s caption=%s", to, mediaID, mediaType, caption)
	
	token := os.Getenv("WA_TOKEN")
	phoneID := os.Getenv("WA_PHONE_ID")
	
	if token == "" || phoneID == "" {
		log.Printf("WA_TOKEN or WA_PHONE_ID not set; skipping media send")
		return
	}
	
	// Build media payload
	mediaPayload := map[string]interface{}{
		"id": mediaID,
	}
	
	if caption != "" {
		mediaPayload["caption"] = caption
	}
	
	payload := map[string]interface{}{
		"messaging_product": "whatsapp",
		"recipient_type":    "individual",
		"to":                to,
		"type":              mediaType,
		mediaType:           mediaPayload,
	}
	
	postToWhatsApp(phoneID, token, payload)
}

// getWhatsAppMediaURL retrieves the download URL for a media ID
func getWhatsAppMediaURL(mediaID string) string {
	token := os.Getenv("WA_TOKEN")
	
	if token == "" || mediaID == "" {
		return ""
	}
	
	// Get media URL from WhatsApp
	url := fmt.Sprintf("https://graph.facebook.com/v17.0/%s", mediaID)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Printf("Error creating media URL request: %v", err)
		return ""
	}
	
	req.Header.Set("Authorization", "Bearer "+token)
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error getting media URL: %v", err)
		return ""
	}
	defer resp.Body.Close()
	
	responseBody, _ := io.ReadAll(resp.Body)
	
	// Parse response to get media URL
	var result map[string]interface{}
	if err := json.Unmarshal(responseBody, &result); err == nil {
		if mediaURL, ok := result["url"].(string); ok {
			log.Printf("Got media URL for ID %s", mediaID)
			return mediaURL
		}
	}
	
	return ""
}

// uploadToSupabaseStorage uploads a file to Supabase Storage and returns the path
func uploadToSupabaseStorage(fileData []byte, filename string, mediaType string) string {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if supabaseKey == "" {
		supabaseKey = os.Getenv("SUPABASE_ANON_KEY")
	}
	
	if supabaseURL == "" || supabaseKey == "" {
		log.Printf("Supabase credentials not set; skipping storage upload")
		return ""
	}
	
	// Create a unique filename with timestamp
	timestamp := time.Now().UnixNano()
	storagePath := fmt.Sprintf("%s/%d_%s", mediaType, timestamp, filename)
	
	// Upload to Supabase Storage
	url := fmt.Sprintf("%s/storage/v1/object/media/%s", supabaseURL, storagePath)
	req, err := http.NewRequest(http.MethodPost, url, strings.NewReader(string(fileData)))
	if err != nil {
		log.Printf("Error creating storage upload request: %v", err)
		return ""
	}
	
	// Determine content type
	contentType := "application/octet-stream"
	if strings.HasSuffix(strings.ToLower(filename), ".png") {
		contentType = "image/png"
	} else if strings.HasSuffix(strings.ToLower(filename), ".jpg") || strings.HasSuffix(strings.ToLower(filename), ".jpeg") {
		contentType = "image/jpeg"
	} else if strings.HasSuffix(strings.ToLower(filename), ".gif") {
		contentType = "image/gif"
	} else if strings.HasSuffix(strings.ToLower(filename), ".webp") {
		contentType = "image/webp"
	} else if strings.HasSuffix(strings.ToLower(filename), ".mp4") {
		contentType = "video/mp4"
	} else if strings.HasSuffix(strings.ToLower(filename), ".pdf") {
		contentType = "application/pdf"
	}
	
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", contentType)
	req.Header.Set("apikey", supabaseKey)
	
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error uploading to Supabase Storage: %v", err)
		return ""
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		responseBody, _ := io.ReadAll(resp.Body)
		log.Printf("Failed to upload to Supabase Storage (status %d): %s", resp.StatusCode, string(responseBody))
		return ""
	}
	
	log.Printf("File uploaded to Supabase Storage: %s", storagePath)
	return storagePath
}
