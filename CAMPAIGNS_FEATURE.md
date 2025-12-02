# WhatsApp Campaigns Feature

## 🚀 Overview
A comprehensive campaign management system for WhatsApp Business API with modern glassmorphism UI design.

## 📍 Location
**URL**: `http://localhost:3000/wa/campaigns`

**File**: `/src/pages/whatsapp/Campaigns.tsx`

## ✨ Features

### 1. **Campaign Dashboard**
- Real-time statistics cards showing:
  - Total Campaigns
  - Active Campaigns
  - Messages Sent
  - Total Recipients
- Modern glassmorphism header with backdrop blur effect
- Responsive grid layout

### 2. **Create New Campaign**
- Modal-based campaign creation
- **Campaign Name**: Custom name for your campaign
- **Template Selection**: Choose from approved WhatsApp message templates
- **Excel Upload**: Upload recipient list with variables

### 3. **Excel File Upload**
The system accepts Excel files (`.xlsx`, `.xls`) with the following structure:

#### Required Columns:
```
| phone_number  | variable1 | variable2 | variable3 | ... |
|---------------|-----------|-----------|-----------|-----|
| +1234567890   | John      | Doe       | Sample    | ... |
| +0987654321   | Jane      | Smith     | Example   | ... |
```

#### Sample Template Download
Click "Download Sample Template" in the upload modal to get a pre-formatted Excel file.

### 4. **Campaign Management Actions**

#### Status-Based Actions:
- **Draft**: 
  - ✅ Send Campaign
  - 🗑️ Delete Campaign
  
- **Active**:
  - ⏸️ Pause Campaign
  - 🛑 Stop Campaign
  - 👁️ View Details
  - 🗑️ Delete Campaign
  
- **Paused**:
  - ▶️ Resume Campaign
  - 🛑 Stop Campaign
  - 👁️ View Details
  - 🗑️ Delete Campaign
  
- **Completed/Stopped**:
  - 👁️ View Details
  - 🗑️ Delete Campaign

### 5. **Campaign Table Columns**
- Name
- Template Used
- Status Badge (with color coding)
- Recipients Count
- Sent Count
- Delivered Count
- Failed Count
- Created Date
- Action Buttons

### 6. **Status Badges**
Color-coded status indicators:
- 🟢 **Active**: Green (sending in progress)
- 🟡 **Paused**: Amber (temporarily stopped)
- 🔵 **Completed**: Blue (all messages sent)
- 🔴 **Stopped**: Red (manually stopped)
- ⚪ **Draft**: Gray (not yet sent)

## 🎨 Design Features
- **Glassmorphism**: Translucent header with backdrop blur
- **Modern UI**: Clean, professional design matching Dashboard
- **Responsive**: Mobile-friendly layout
- **Smooth Animations**: Hover effects and transitions
- **Color Scheme**: Emerald green primary color
- **Typography**: Bold headings with slate color palette

## 🔌 API Endpoints (Backend Required)

### Fetch Campaigns
```http
POST http://localhost:8080/campaigns
Content-Type: application/json

{
  "user_id": "user_id_here"
}
```

### Create Campaign
```http
POST http://localhost:8080/campaigns/create
Content-Type: application/json

{
  "user_id": "user_id_here",
  "name": "Campaign Name",
  "template_id": "template_id",
  "recipients": [
    {
      "phone_number": "+1234567890",
      "variable1": "John",
      "variable2": "Doe"
    }
  ]
}
```

### Send Campaign
```http
POST http://localhost:8080/campaigns/{campaign_id}/send
Content-Type: application/json

{
  "user_id": "user_id_here"
}
```

### Pause Campaign
```http
POST http://localhost:8080/campaigns/{campaign_id}/pause
Content-Type: application/json

{
  "user_id": "user_id_here"
}
```

### Stop Campaign
```http
POST http://localhost:8080/campaigns/{campaign_id}/stop
Content-Type: application/json

{
  "user_id": "user_id_here"
}
```

### Delete Campaign
```http
DELETE http://localhost:8080/campaigns/{campaign_id}
Content-Type: application/json

{
  "user_id": "user_id_here"
}
```

## 📦 Dependencies
- `xlsx`: Excel file parsing library
- `lucide-react`: Icon library
- `react-router-dom`: Navigation
- `@/contexts/AuthContext`: User authentication

## 🚦 Getting Started

1. **Navigate to Campaigns**:
   ```
   http://localhost:3000/wa/campaigns
   ```

2. **Create Your First Campaign**:
   - Click "New Campaign" button
   - Enter campaign name
   - Select an approved template
   - Download sample Excel template
   - Fill in recipient data
   - Upload Excel file
   - Click "Create Campaign"

3. **Send Campaign**:
   - Find your draft campaign in the table
   - Click "Send" button
   - Campaign status changes to "Active"

4. **Monitor Progress**:
   - View sent, delivered, and failed counts in real-time
   - Track campaign status

5. **Control Campaign**:
   - Pause to temporarily stop sending
   - Resume to continue
   - Stop to permanently end campaign

## 🔐 Authentication
Requires user login. The campaign will automatically use the logged-in user's ID for all operations.

## ⚠️ Important Notes

1. **Templates**: Must have at least one approved WhatsApp template before creating campaigns
2. **Excel Format**: Phone numbers must be in international format (e.g., +1234567890)
3. **Variables**: Excel column names (variable1, variable2, etc.) should match template variables
4. **File Size**: No explicit limit, but consider performance for very large recipient lists
5. **Backend**: All features require proper backend API implementation

## 🐛 Error Handling
- File upload errors are displayed with descriptive messages
- API errors show in red alert boxes with close button
- Empty states guide users to create their first campaign
- Confirmation dialogs for destructive actions (delete, stop)

## 📱 Responsive Breakpoints
- Mobile: < 768px (single column layout)
- Tablet: 768px - 1024px (2 column stats)
- Desktop: > 1024px (4 column stats, full table)

## 🎯 Future Enhancements
- Campaign scheduling
- A/B testing
- Advanced analytics
- Campaign templates
- Recipient list management
- Campaign duplication
- Export campaign reports
- Real-time progress tracking
- Campaign preview before sending

## 🛠️ Troubleshooting

### Campaign Not Sending
1. Check template approval status
2. Verify phone numbers are in correct format
3. Ensure WABA connection is active
4. Check backend logs for errors

### Excel Upload Fails
1. Ensure file is `.xlsx` or `.xls` format
2. Verify phone_number column exists
3. Check for special characters in data
4. Download and use sample template

### Actions Not Working
1. Check user authentication
2. Verify backend API is running
3. Check browser console for errors
4. Ensure proper user permissions

---

**Created**: December 3, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Testing
