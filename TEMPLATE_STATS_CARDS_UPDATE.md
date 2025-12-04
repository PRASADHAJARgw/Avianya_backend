# Template Stats Cards Update

## Changes Made

Added a 4th stats card to display **Rejected Templates** count.

## Stats Cards Layout

The template list page now displays **4 stats cards** in a responsive grid:

### 1. 📄 Total Templates
- Shows total count of all templates
- Color: Emerald/Green
- Icon: FileText

### 2. ✅ Approved
- Counts templates with status:
  - `approved`
  - `APPROVED`
  - `Active`
- Color: Green
- Icon: CheckCircle

### 3. 🟠 Pending
- Counts templates with status:
  - `PENDING`
  - `pending_meta_submission`
  - `meta_submitted`
- Color: Orange
- Icon: Clock

### 4. 🔴 Rejected (NEW!)
- Counts templates with status:
  - `rejected`
  - `REJECTED`
  - `meta_submission_failed`
  - `failed`
- Color: Red
- Icon: AlertCircle

## Layout Updates

- Changed grid from 3 columns to 4 columns: `grid-cols-1 md:grid-cols-4`
- All cards maintain consistent styling and spacing
- Fully responsive: stacks to single column on mobile

## Visual Preview

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total       │ Approved    │ Pending     │ Rejected    │
│ Templates   │             │             │             │
│     5       │     2       │     1       │     2       │
│ 📄          │ ✅          │ 🟠          │ 🔴          │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## Files Updated

- `/src/pages/whatsapp/TemplatesList.tsx`
  - Changed stats grid to 4 columns
  - Added Rejected stats card with red color theme
  - Includes all failed/rejected status variants in count

## Result

Users can now see at a glance:
- ✅ How many templates are approved and ready to use
- 🟠 How many templates are pending approval
- 🔴 How many templates were rejected or failed (need attention!)
- 📄 Total templates across all statuses

---
**Updated:** December 5, 2025
**Cards:** 4 total (Total, Approved, Pending, Rejected)
