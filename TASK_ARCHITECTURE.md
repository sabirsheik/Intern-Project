# 🏗️ Task Management - Architecture & Components

## Component Hierarchy

```
TaskManagementPage (Main Page)
│
├── Header Section
│   ├── Title "Task Management"
│   └── "+ Create Task" Button
│
├── Search & Filter Bar
│   ├── Search Input (by title)
│   └── Priority Filter Dropdown
│
├── Tasks Grid
│   ├── TaskCard #1
│   │   ├── Priority Badge
│   │   ├── Three-Dot Menu (…)
│   │   │   └── Dropdown Menu
│   │   │       ├── View
│   │   │       ├── Edit
│   │   │       └── Delete
│   │   ├── Title & Description
│   │   ├── Category Badge
│   │   ├── Stats (Date, Duration, Assigned, Points)
│   │   └── Actions
│   │
│   ├── TaskCard #2
│   ├── TaskCard #3
│   └── ... More Cards
│
└── CreateTaskModal (when visible)
    ├── Modal Backdrop
    └── Modal Form
        ├── Task Title Input
        ├── Description Textarea
        ├── Domain Dropdown
        ├── Priority Dropdown
        ├── Due Date Picker
        ├── Max Score Input
        ├── Est. Hours Input
        └── Buttons (Cancel, Create)
```

---

## Data Flow

```
User Actions:
│
├─ "Search Tasks"
│  └─> Filter displayed tasks by title
│      └─> Update component state
│
├─ "Select Priority Filter"
│  └─> Filter tasks by priority
│      └─> Update component state
│
├─ "Click Create Task Button"
│  └─> Show CreateTaskModal
│      └─> Set showCreateModal = true
│
├─ "Fill Form + Submit"
│  └─> Validate input
│      └─> Add to tasks array
│      └─> Close modal
│      └─> Show success toast
│
├─ "Click Three-Dot Menu"
│  └─> Show/Hide dropdown
│      └─> Set showMenu = true/false
│
└─ "Click View/Edit/Delete"
   └─> handleViewTask/handleEditTask/handleDeleteTask
       └─> Show appropriate UI
```

---

## File Implementation Details

### TaskManagementPage.jsx
**Purpose**: Main container component
**State**:
- `tasks` - Array of all tasks
- `filterPriority` - Current priority filter
- `searchQuery` - Current search text
- `showCreateModal` - Modal visibility

**Functions**:
- `handleDeleteTask(id)` - Remove task from list
- `handleEditTask(id)` - Show edit toast (placeholder)
- `handleViewTask(id)` - Show view toast (placeholder)
- `handleCreateTask(newTask)` - Add new task

**Renders**:
- Header with title and create button
- Search and filter inputs
- TaskCard components in grid
- CreateTaskModal when showCreateModal is true

---

### TaskCard.jsx
**Purpose**: Individual task display with interactions
**Props**:
- `task` - Task object
- `onDelete` - Delete callback
- `onEdit` - Edit callback
- `onView` - View callback
- `index` - Animation index

**State**:
- `showMenu` - Three-dot menu visibility

**Features**:
- Priority badge with dynamic styling
- Three-dot menu with dropdown
- Task details display
- Hover animations

**Renders**:
- Priority badge
- Three-dot menu button
- Dropdown menu (when showMenu=true)
- Task information cards
- Footer with stats

---

### CreateTaskModal.jsx
**Purpose**: Modal form for creating new tasks
**Props**:
- `onClose` - Close callback
- `onCreate` - Create callback

**State**:
- `formData` - Form field values
- `isSubmitting` - Submit state

**Form Fields**:
- title (text)
- description (textarea)
- category (select)
- priority (select)
- date (date)
- maxScore (number)
- estimatedHours (number)

**Functions**:
- `handleChange(e)` - Update form field
- `handleSubmit(e)` - Validate and submit
- `handleCancel()` - Close and reset form

**Renders**:
- Backdrop overlay
- Modal container
- Form inputs
- Submit/Cancel buttons

---

## Styling System

### Tailwind Classes Used

**Responsive Grid**
```css
grid grid-cols-1          /* Mobile: 1 column */
md:grid-cols-2            /* Tablet: 2 columns */
lg:grid-cols-3            /* Desktop: 3 columns */
gap-6                     /* Spacing between cards */
```

**Priority Badges**
```css
/* High/Urgent */
bg-red-100 text-red-700

/* Medium */
bg-slate-900 text-white

/* Low */
bg-slate-100 text-slate-700
```

**Interactive Elements**
```css
hover:shadow-xl            /* Card hover */
hover:bg-slate-50          /* Button/input hover */
focus:border-cyan-400      /* Focus state */
focus:ring-2 focus:ring-cyan-100
transition                 /* Smooth changes */
cursor-not-allowed         /* Disabled state */
opacity-70                 /* Disabled opacity */
```

---

## Animation Details

### Framer Motion Used

**Page Entry**
```javascript
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

**Card Stagger**
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ 
  duration: 0.3, 
  delay: index * 0.05 
}}
```

**Menu Dropdown**
```javascript
initial={{ opacity: 0, scale: 0.9, y: -10 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9, y: -10 }}
transition={{ duration: 0.15 }}
```

**Modal Entry**
```javascript
initial={{ opacity: 0, scale: 0.9, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9, y: 20 }}
transition={{ duration: 0.3 }}
```

**Button Interactions**
```javascript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## State Management Flow

```
TaskManagementPage
│
├─ tasks → Array of task objects
│  └─ Updated by: handleCreateTask, handleDeleteTask
│
├─ filterPriority → "All Priorities" | "high" | "urgent" | "medium" | "low"
│  └─ Updated by: setFilterPriority
│  └─ Used in: filteredTasks computation
│
├─ searchQuery → User search text
│  └─ Updated by: setSearchQuery
│  └─ Used in: filteredTasks computation
│
├─ showCreateModal → boolean
│  └─ Updated by: setShowCreateModal
│  └─ Controls: CreateTaskModal visibility
│
└─ filteredTasks → Computed from tasks + filters
   └─ Rendered in: Grid layout
```

---

## Event Handlers

### Search Bar
```javascript
onChange={(e) => setSearchQuery(e.target.value)}
// Filters tasks real-time as user types
```

### Priority Filter
```javascript
onChange={(e) => setFilterPriority(e.target.value)}
// Updates selected priority
```

### Create Task Button
```javascript
onClick={() => setShowCreateModal(true)}
// Shows modal
```

### Three-Dot Menu
```javascript
onClick={() => setShowMenu(!showMenu)}
// Toggles dropdown visibility
```

### Menu Actions
```javascript
onView(task.id)     // Shows toast
onEdit(task.id)     // Shows toast
onDelete(task.id)   // Confirms then removes
```

### CreateTaskModal Buttons
```javascript
onClose()           // Closes modal, resets form
onCreate(newTask)   // Adds task, shows notification
```

---

## Validation Rules

**Create Task Form**
```javascript
✓ Title: Required, non-empty
✓ Description: Required, non-empty
✓ Date: Required, must be date format
✓ Category: Preset options
✓ Priority: Preset options
✓ Max Score: Number 10-1000
✓ Est. Hours: Number 1-100
```

---

## UI States

### Normal State
```
- All tasks displayed
- Search and filter visible
- Create Task button active
- No modals shown
```

### Filtered State
```
- Tasks matching criteria shown
- Search term highlighted
- Priority filter selected
- "No tasks found" if empty
```

### Modal Open State
```
- Backdrop overlay visible
- Modal form focused
- Main page blurred (backdrop)
- Create Task button disabled
```

### Menu Open State
```
- Task card highlighted
- Dropdown menu visible
- Other menus closed
- Click-outside closes
```

---

## Responsive Behavior

### Mobile (< 768px)
```
- 1 column grid
- Full width cards
- Larger touch targets
- Modal fullscreen
- Dropdown repositioned
```

### Tablet (768px - 1024px)
```
- 2 column grid
- Medium cards
- Adjusted padding
- Modal centered
- Menu positioned right
```

### Desktop (> 1024px)
```
- 3 column grid
- Standard cards
- Normal spacing
- Modal centered with max-width
- Menu positioned precisely
```

---

## Integration Points

### Backend Ready
- Replace demo tasks with API calls
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Authentication
- Uses `useAuth()` to verify user
- Only authenticated users access page
- Role-based access (all roles can view)

### Notifications
- Uses `toast` from "sonner"
- Success messages on create
- Error messages on validation
- Confirmation dialogs on delete

