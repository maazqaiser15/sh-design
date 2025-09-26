# Trailer & Films Card Flow Documentation

## Overview
The "Trailer & Films" card manages trailer assignments and logistics tracking. It has multiple states based on trailer assignment and completion status.

## Card States

### 1. **No Trailer Assigned State**
**Visual:** Full card with trailer assignment section and logistics table
- **Header:** "Trailer & Films" with count summary
- **Trailer Section:** Shows "No trailer assigned yet" with "Add trailer" button
- **Logistics Table:** Shows Required/In Trailer/Need to Ship columns for first 4 film types
- **Receipt Section:** File attachment area for receipts

### 2. **Trailer Assigned State**
**Visual:** Full card with assigned trailer and logistics table
- **Header:** "Trailer & Films" with count summary
- **Trailer Section:** Shows trailer name with "Change trailer" button
- **Logistics Table:** Shows Required/In Trailer/Need to Ship columns for first 4 film types
- **Receipt Section:** File attachment area for receipts
- **Completion Section:** Mark as complete button

### 3. **Completed State**
**Visual:** Full card with completion status
- **Header:** "Trailer & Films" with count summary
- **Trailer Section:** Shows trailer name with "Change trailer" button
- **Logistics Table:** Shows Required/In Trailer/Need to Ship columns for first 4 film types
- **Receipt Section:** File attachment area for receipts
- **Completion Section:** Shows completion status with green checkmark

## Detailed Flow States

### State 1: No Trailer Assigned
```
┌─────────────────────────────────────┐
│ Trailer & Films                     │
│ 13 required • 0 in trailer          │
│                                     │
│ 🚛 No trailer assigned yet          │
│                            [Add]    │
│                                     │
│ Required  In Trailer  Need to Ship  │
│ SW600BR   0 sheets    1 sheets      │
│ SW600RC+  0 sheets    2 sheets      │
│ SW600RC   0 sheets    3 sheets      │
│ SW440RC   0 sheets    1 sheets      │
│ ...4 more film types                │
│                                     │
│ 📄 No receipt attached yet          │
│                            [Add]    │
└─────────────────────────────────────┘
```

**Triggers:** New project or no trailer assigned
**Actions:** 
- Click "Add trailer" → Open AssignTrailerModal
- Click "Add attachment" → File picker

### State 2: Trailer Assigned
```
┌─────────────────────────────────────┐
│ Trailer & Films                     │
│ 13 required • 8 in trailer          │
│                                     │
│ 🚛 Trailer-001                      │
│                            [Change] │
│                                     │
│ Required  In Trailer  Need to Ship  │
│ SW600BR   1 sheets    0 sheets      │
│ SW600RC+  2 sheets    0 sheets      │
│ SW600RC   3 sheets    0 sheets      │
│ SW440RC   1 sheets    0 sheets      │
│ ...4 more film types                │
│                                     │
│ 📄 2 file(s) attached               │
│                            [Add]    │
│                                     │
│ ✅ Ready to mark as complete        │
│                    [Mark Complete]  │
└─────────────────────────────────────┘
```

**Triggers:** Trailer assigned
**Actions:**
- Click "Change trailer" → Open AssignTrailerModal
- Click "Add attachment" → File picker
- Click "Mark Complete" → Mark section as completed

### State 3: Completed
```
┌─────────────────────────────────────┐
│ Trailer & Films                     │
│ 13 required • 8 in trailer          │
│                                     │
│ 🚛 Trailer-001                      │
│                            [Change] │
│                                     │
│ Required  In Trailer  Need to Ship  │
│ SW600BR   1 sheets    0 sheets      │
│ SW600RC+  2 sheets    0 sheets      │
│ SW600RC   3 sheets    0 sheets      │
│ SW440RC   1 sheets    0 sheets      │
│ ...4 more film types                │
│                                     │
│ 📄 2 file(s) attached               │
│                            [Add]    │
│                                     │
│ ✅ Trailer & Films completed        │
│                    [Completed]      │
└─────────────────────────────────────┘
```

**Triggers:** User clicked "Mark Complete"
**Visual Changes:** Green checkmark, "Completed" badge instead of button

## Modal Flows

### AssignTrailerModal Flow
```
Open Modal → View Available Trailers → Select Trailer → Assign → Close Modal → Update Card State
```

**Features:**
- List of available trailers with inventory details
- Filter/search capabilities
- Assignment confirmation

## Data Flow

### Props Interface
```typescript
interface TrailerLogisticsCardProps {
  assignedTrailer?: TrailerForAssignment | null;
  onAssignTrailer: (trailer: TrailerForAssignment) => void;
  onAddAttachment?: (files: File[]) => void;
  onMarkComplete?: () => void;
  filmTypes?: FilmType[];
  hasReceipt?: boolean;
  isCompleted?: boolean;
  availableTrailers?: TrailerForAssignment[];
  attachedFiles?: File[];
}
```

### State Management
- **assignedTrailer:** Controls trailer assignment state
- **isCompleted:** Controls completion state
- **filmTypes:** Array of film requirements with quantities
- **uploadedFiles:** Array of attached receipt files

## Key Features

1. **Progressive Disclosure:** Only shows relevant sections based on current state
2. **Visual Hierarchy:** Clear status indicators and action buttons
3. **File Management:** Drag-and-drop file attachments with preview
4. **Inventory Tracking:** Real-time calculation of required vs available quantities
5. **State Persistence:** Maintains state across page refreshes
6. **Responsive Design:** Adapts to different screen sizes

## Error States

- **No Available Trailers:** Shows appropriate message in AssignTrailerModal
- **File Upload Errors:** Shows error messages for invalid file types
- **Network Errors:** Graceful handling of API failures
- **Validation Errors:** Form validation with clear error messages

## Accessibility

- **Keyboard Navigation:** Full keyboard support for all interactions
- **Screen Reader Support:** Proper ARIA labels and descriptions
- **Focus Management:** Logical tab order and focus indicators
- **Color Contrast:** Meets WCAG guidelines for text and background colors
