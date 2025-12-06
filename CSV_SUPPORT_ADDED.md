# CSV Support Added to Campaign Upload ✅

## What Was Changed

### 1. File Upload Handler Updated
**File:** `src/pages/whatsapp/Campaigns.tsx`

The `handleFileUpload` function now supports both **Excel** (.xlsx, .xls) and **CSV** (.csv) formats:

```typescript
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setExcelFile(file);
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const data = event.target?.result;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // Handle CSV files
      if (fileExtension === 'csv') {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData);
        console.log('✅ CSV data loaded:', jsonData.length, 'rows');
      } 
      // Handle Excel files (.xlsx, .xls)
      else {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData);
        console.log('✅ Excel data loaded:', jsonData.length, 'rows');
      }
    } catch (err) {
      console.error('❌ Error parsing file:', err);
      setError('Failed to parse file. Please ensure it\'s a valid Excel or CSV file.');
    }
  };
  
  reader.readAsBinaryString(file);
};
```

### 2. File Input Updated
**Accept Attribute:** Now accepts `.xlsx`, `.xls`, and `.csv` files

```tsx
<input
  type="file"
  accept=".xlsx,.xls,.csv"
  onChange={handleFileUpload}
  className="hidden"
  id="excel-upload"
/>
```

### 3. UI Labels Updated
- Changed from "Upload Recipients (Excel)" to **"Upload Recipients (Excel/CSV)"**
- Updated button text from "Click to upload Excel file" to **"Click to upload Excel or CSV file"**

### 4. CSV Download Added
Added new function `downloadSampleCSV()` to generate CSV templates:

```typescript
const downloadSampleCSV = () => {
  // Extracts template variables
  // Creates CSV with proper headers
  // Downloads as .csv file
};
```

### 5. Download Buttons Updated
Now shows **TWO** download options:

```
[📥 Download Excel] | [📥 Download CSV]
```

- **Download Excel** - Downloads .xlsx file (green button)
- **Download CSV** - Downloads .csv file (blue button)

## Features

### Supported File Formats
✅ **Excel files:**
  - `.xlsx` (Excel 2007+)
  - `.xls` (Excel 97-2003)

✅ **CSV files:**
  - `.csv` (Comma-separated values)

### How It Works

1. **Select a template** from the dropdown
2. **Download sample file** in your preferred format:
   - Click "Download Excel" for .xlsx
   - Click "Download CSV" for .csv
3. **Fill in recipient data** in the downloaded file
4. **Upload the file** (drag & drop or click to browse)
5. **Create campaign** - system processes both formats the same way

### File Format Requirements

Both Excel and CSV files must have the same structure:

**Required Columns:**
- `country_code` - e.g., +91
- `phone_number` - e.g., 7755991051

**Dynamic Columns** (based on template variables):
- `header_param_1`, `header_param_2`, etc. (if template has header variables)
- `body_param_1`, `body_param_2`, etc. (if template has body variables)
- `button_url_param` (if template has dynamic button URL)

### Example CSV Format

```csv
country_code,phone_number,body_param_1,body_param_2
+91,7755991051,John,Booking123
+91,9876543210,Sarah,Booking456
```

### Example Excel Format

Same structure as CSV, but in Excel spreadsheet format.

## Benefits of CSV Support

1. **Lighter files** - CSV files are smaller than Excel
2. **Easy editing** - Can edit in any text editor, Excel, Google Sheets, Numbers
3. **Better version control** - CSV files work better with Git
4. **Universal format** - Supported by all spreadsheet applications
5. **No special software needed** - Can create/edit with notepad, TextEdit, etc.

## Testing

### Upload CSV File
1. Go to http://localhost:3000/wa/campaigns
2. Click "Create New Campaign"
3. Select a template
4. Click "Download CSV"
5. Open the downloaded CSV in Excel/Google Sheets/Text Editor
6. Add recipient data
7. Save as CSV
8. Upload the file
9. ✅ You should see "X recipients loaded"

### Upload Excel File
1. Same process as above, but click "Download Excel"
2. Edit in Excel
3. Upload .xlsx file
4. ✅ Works the same way

## Technical Details

### CSV Parsing
Uses the **xlsx** library (which handles both Excel and CSV):
- `XLSX.read(data, { type: 'binary' })` - Reads both formats
- `XLSX.utils.sheet_to_json()` - Converts to JSON array
- Same processing for both CSV and Excel

### CSV Generation
Uses native JavaScript to create CSV:
- Joins column headers with commas
- Joins data rows with commas
- Creates downloadable blob
- Triggers browser download

## What's Next

You can now use either format:
- **CSV** - For quick editing, version control, lightweight files
- **Excel** - For formatted data, formulas, multiple sheets

Both formats work identically for campaign creation! 🚀

---

**Files Changed:**
- `src/pages/whatsapp/Campaigns.tsx`
  - Updated `handleFileUpload()` function
  - Added `downloadSampleCSV()` function
  - Updated file input accept attribute
  - Updated UI labels and buttons
