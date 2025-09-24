package main

import (
    "encoding/json"
    "fmt"
    "io"
    "log"
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

func main() {
    http.HandleFunc("/api/workflow", handleSaveWorkflow)
    http.HandleFunc("/templates", handleTemplates)
    http.HandleFunc("/webhook", handleWebhook)

    addr := ":8080"
    log.Printf("Starting server on %s", addr)
    log.Fatal(http.ListenAndServe(addr, nil))
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
            if n == nil { continue }
            if n["type"] == "trigger" {
                data, _ := n["data"].(map[string]interface{})
                if data == nil { continue }
                if data["triggerType"] == "keyword" {
                    kv := fmt.Sprint(data["keyword"])
                    keywords := strings.Split(kv, ",")
                    for i := range keywords { keywords[i] = strings.TrimSpace(keywords[i]) }
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
        if n == nil { continue }
        if n["type"] == "whatsapp-message" {
            data, _ := n["data"].(map[string]interface{})
            if data == nil { continue }
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
                        if cc, ok := lmap["code"]; ok { lang = fmt.Sprint(cc) }
                    }
                    sendWhatsAppTemplate(toPhone, name, lang)
                }
            case "INTERACTIVE":
                if inter, ok := data["interactive"].(map[string]interface{}); ok {
                    itype := fmt.Sprint(inter["type"])
                    if itype == "button" {
                        // build button payload
                        b := ""
                        if body, ok := inter["body"].(map[string]interface{}); ok { b = fmt.Sprint(body["text"]) }
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
                        if body, ok := inter["body"].(map[string]interface{}); ok { b = fmt.Sprint(body["text"]) }
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
        "to": to,
        "type": "text",
        "text": map[string]interface{}{ "body": body },
    }
    postToWhatsApp(phoneID, token, payload)
}

func sendWhatsAppTemplate(to, name, language string) {
    log.Printf("sendWhatsAppTemplate to=%s template=%s lang=%s", to, name, language)
    token := os.Getenv("WA_TOKEN")
    phoneID := os.Getenv("WA_PHONE_ID")
    if token == "" || phoneID == "" { return }
    payload := map[string]interface{}{
        "messaging_product": "whatsapp",
        "to": to,
        "type": "template",
        "template": map[string]interface{}{
            "name": name,
            "language": map[string]string{"code": language},
        },
    }
    postToWhatsApp(phoneID, token, payload)
}

func sendWhatsAppInteractiveButtons(to, body string, buttons []map[string]interface{}) {
    log.Printf("sendWhatsAppInteractiveButtons to=%s body=%s buttons=%v", to, body, buttons)
    token := os.Getenv("WA_TOKEN")
    phoneID := os.Getenv("WA_PHONE_ID")
    if token == "" || phoneID == "" { return }
    action := map[string]interface{}{"buttons": buttons}
    payload := map[string]interface{}{
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": map[string]interface{}{
            "type": "button",
            "body": map[string]string{"text": body},
            "action": action,
        },
    }
    postToWhatsApp(phoneID, token, payload)
}

func sendWhatsAppInteractiveList(to, body string, action interface{}) {
    log.Printf("sendWhatsAppInteractiveList to=%s body=%s action=%v", to, body, action)
    token := os.Getenv("WA_TOKEN")
    phoneID := os.Getenv("WA_PHONE_ID")
    if token == "" || phoneID == "" { return }
    payload := map[string]interface{}{
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": map[string]interface{}{
            "type": "list",
            "body": map[string]string{"text": body},
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

