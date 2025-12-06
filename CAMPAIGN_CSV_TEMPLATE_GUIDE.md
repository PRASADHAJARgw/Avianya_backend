# Campaign Manager - CSV Template Generation Guide

## Overview
The Campaign Manager now includes intelligent CSV template generation based on the selected WhatsApp template's structure.

## How It Works

### 1. Create New Campaign
Users follow these steps:
1. Enter **Campaign Name**
2. Select **Template** from approved templates
3. Click **Download Sample Template** to get a custom CSV
4. Fill the CSV with recipient data
5. Upload the completed CSV
6. Launch the campaign

### 2. Dynamic CSV Column Generation

The system analyzes the selected template and automatically generates CSV columns based on:

#### Fixed Columns (Always Present)
- `country_code` - Phone country code (e.g., +1, +91)
- `phone_number` - Recipient phone number (without country code)

#### Dynamic Columns (Based on Template Components)

##### Header Parameters
If template has header with variables like `{{1}}`:
- Column: `header_param_1`
- Example value: "Sample header 1"

##### Body Parameters
If template has body text with `{{1}}`, `{{2}}`, etc.:
- Columns: `body_param_1`, `body_param_2`, etc.
- Example values: "Sample body 1", "Sample body 2"

##### Button Parameters
If template has dynamic URL buttons:
- Column: `button_url_param`
- Example value: "sample-url-param"

### 3. Template Structure Examples

#### Example 1: Simple Template
```json
{
  "components": [
    {
      "type": "body",
      "text": "Hi {{1}}! Your order {{2}} is ready."
    }
  ]
}
```

**Generated CSV:**
```
country_code,phone_number,body_param_1,body_param_2
+1,1234567890,John,ORD123
+91,9876543210,Jane,ORD456
```

#### Example 2: Complex Template
```json
{
  "components": [
    {
      "type": "header",
      "text": "Hello {{1}}",
      "example": {
        "header_text": [["John"]]
      }
    },
    {
      "type": "body",
      "text": "Your booking {{1}} for {{2}} is confirmed.",
      "example": {
        "body_text": [["BK123", "2025-12-10"]]
      }
    },
    {
      "type": "button",
      "sub_type": "url",
      "parameters": [{
        "type": "text",
        "text": "{{1}}"
      }]
    }
  ]
}
```

**Generated CSV:**
```
country_code,phone_number,header_param_1,body_param_1,body_param_2,button_url_param
+1,1234567890,John,BK123,2025-12-10,booking-id-123
+91,9876543210,Jane,BK456,2025-12-11,booking-id-456
```

### 4. CSV Format Requirements

#### Standard Format
1. **First Row**: Column headers (auto-generated)
2. **Subsequent Rows**: Recipient data
3. **Encoding**: UTF-8
4. **File Extension**: .xlsx (Excel format)

#### Column Rules
- `country_code`: Must include + sign (e.g., +1, +91, +44)
- `phone_number`: Numbers only, no spaces or special characters
- Parameter columns: Match the order in the template exactly

### 5. WhatsApp Send Payload Generation

The backend will transform CSV data into WhatsApp API payloads:

```json
{
  "messaging_product": "whatsapp",
  "to": "<country_code><phone_number>",
  "type": "template",
  "template": {
    "name": "template_name",
    "language": {
      "code": "en_US"
    },
    "components": [
      {
        "type": "header",
        "parameters": [
          {
            "type": "text",
            "text": "<value_from_header_param_1>"
          }
        ]
      },
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "<value_from_body_param_1>"
          },
          {
            "type": "text",
            "text": "<value_from_body_param_2>"
          }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          {
            "type": "text",
            "text": "<value_from_button_url_param>"
          }
        ]
      }
    ]
  }
}
```

### 6. Parameter Mapping Logic

#### Component Type Detection
- **Header**: `component.type === "header"`
- **Body**: `component.type === "body"`
- **Button**: `component.type === "button"`

#### Variable Extraction
- Template variables: `{{1}}`, `{{2}}`, etc.
- Regex pattern: `/\{\{(\d+)\}\}/g`
- Maps to CSV column: `<component_type>_param_<number>`

#### Button Handling
- URL buttons with dynamic suffixes
- Sub-type determines column name
- Example: `button_url_param` for URL buttons

## Frontend Features

### Smart Button State
- **Disabled** when no template selected
- **Tooltip** guidance for users
- **Color coding**: Green (active), Gray (disabled)

### Template Selection Flow
1. User opens "Create Campaign" modal
2. Selects template from dropdown
3. "Download Sample Template" button becomes active
4. Click generates custom CSV with exact columns needed
5. User fills CSV with real data
6. Upload CSV to create campaign

## Backend Requirements

### Campaign Creation Endpoint
```
POST /campaigns/create
```

**Request:**
```json
{
  "user_id": "uuid",
  "name": "Campaign Name",
  "template_id": "template_id",
  "recipients": [
    {
      "country_code": "+1",
      "phone_number": "1234567890",
      "body_param_1": "John",
      "body_param_2": "Value"
    }
  ]
}
```

### Message Sending Logic
1. For each recipient in CSV
2. Build WhatsApp payload with template structure
3. Replace {{1}}, {{2}} with CSV column values
4. Send via WhatsApp Business API
5. Track delivery status

## Error Handling

### CSV Validation
- Check required columns exist
- Validate phone number format
- Ensure parameter counts match template
- Validate country codes

### Common Errors
- Missing required columns → Show which columns are missing
- Invalid phone format → Highlight problematic rows
- Template mismatch → Show expected vs actual columns

## Best Practices

### For Users
1. Always download sample template AFTER selecting template
2. Don't modify column headers
3. Fill all parameter columns (empty values may cause errors)
4. Test with 2-3 recipients before large campaigns

### For Developers
1. Cache template structure for performance
2. Validate CSV structure before campaign creation
3. Log parameter mapping for debugging
4. Implement retry logic for failed sends

---
**Updated:** December 5, 2025
**Feature:** Dynamic CSV Template Generation
**Status:** Frontend Complete, Backend Integration Pending
