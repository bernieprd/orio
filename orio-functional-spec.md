# Orio MVP — Functional Specification for Prototype

## Overview

Build a high-fidelity, interactive React prototype for **Orio**, a fictional access management platform. The prototype demonstrates the MVP: **Role-Based Access Templates + One-Click Onboarding Provisioning**.

This is a design challenge deliverable, not a production app. All data is mocked. The goal is to showcase product thinking through a polished, believable UI.

---

## Visual Design Direction

**Style: Warm & friendly enterprise SaaS** — inspired by Factorial HR's UI aesthetic.

- **Typography**: Use `Nunito Sans` (or similar rounded, warm sans-serif). Friendly but professional.
- **Color palette**: Warm neutrals with a vibrant primary accent. Think soft grays, warm whites (#FAFAF8), and a strong brand color (e.g., coral/salmon #FF6B6B or teal #2EC4B6). Avoid cold blues.
- **Border radius**: Generous (8–12px). Cards, buttons, inputs should feel soft.
- **Spacing**: Comfortable, not cramped. 16px base grid. Generous padding in cards and sections.
- **Shadows**: Subtle, warm-toned box-shadows. No harsh dark shadows.
- **Icons**: Use Lucide icons. Consistent 20px size.
- **Tone**: The UI should feel like a tool you actually enjoy using — approachable, clear, no unnecessary complexity.

**Layout**: Standard enterprise SaaS shell:
- Fixed left sidebar (220px) with navigation
- Top bar with breadcrumbs and user avatar
- Main content area with max-width ~1100px, centered

---

## Global Shell & Navigation

### Sidebar Navigation
The sidebar represents Orio's existing platform. Most items are non-functional (they establish context).

```
[Orio logo]

── Dashboard        (dimmed, non-functional)
── Employees        (dimmed, non-functional)
── Applications     (dimmed, non-functional)
── Billing          (dimmed, non-functional)

── AUTOMATION (section label)
   ├── Templates    ← ACTIVE (functional)
   ├── Onboarding   ← ACTIVE (functional)
   └── Activity     ← ACTIVE (functional)

── Settings         (dimmed, non-functional)
```

The "AUTOMATION" section should feel visually distinct — perhaps a subtle badge or accent indicating it's new.

### Top Bar
- Left: Breadcrumb trail (e.g., "Automation / Templates / Product Designer")
- Right: Notification bell icon + User avatar with name "Alex M." and role "IT Admin"

---

## Screen 1: Templates List

**Route**: `/templates`

### What the user sees
A list of existing access templates displayed as cards in a grid (2–3 columns).

### Template Card
Each card shows:
- **Template name** (e.g., "Product Designer") — prominent, bold
- **Department tag** (e.g., "Design") — colored chip/badge
- **App count** (e.g., "5 apps") — subtle text
- **App icon row** — show the first 4–5 app icons (small, 24px), with "+N" if more
- **Last edited** — relative timestamp (e.g., "Edited 2 days ago")
- **Three-dot menu** → Edit, Duplicate, Delete (can be non-functional)

### Empty State
If no templates exist, show a friendly illustration or icon with:
- "No templates yet"
- "Create your first access template to speed up onboarding."
- [+ New Template] button

### Actions
- **Primary CTA**: "+ New Template" button in the top-right corner
- Clicking a card opens the Template Editor (Screen 2)
- Clicking "+ New Template" opens Screen 2 in blank state

### Mock Data — Pre-populated Templates
```json
[
  {
    "id": "tpl-1",
    "name": "Product Designer",
    "department": "Design",
    "apps": [
      {"name": "Figma", "icon": "figma"},
      {"name": "Notion", "icon": "notion"},
      {"name": "Slack", "icon": "slack"},
      {"name": "Jira", "icon": "jira"},
      {"name": "Linear", "icon": "linear"}
    ],
    "editedAt": "2 days ago"
  },
  {
    "id": "tpl-2",
    "name": "Frontend Engineer",
    "department": "Engineering",
    "apps": [
      {"name": "GitHub", "icon": "github"},
      {"name": "VS Code", "icon": "vscode"},
      {"name": "Slack", "icon": "slack"},
      {"name": "Jira", "icon": "jira"},
      {"name": "Notion", "icon": "notion"},
      {"name": "AWS", "icon": "aws"},
      {"name": "Datadog", "icon": "datadog"},
      {"name": "Linear", "icon": "linear"}
    ],
    "editedAt": "1 week ago"
  },
  {
    "id": "tpl-3",
    "name": "Account Executive",
    "department": "Sales",
    "apps": [
      {"name": "Salesforce", "icon": "salesforce"},
      {"name": "Slack", "icon": "slack"},
      {"name": "Notion", "icon": "notion"},
      {"name": "Gong", "icon": "gong"},
      {"name": "HubSpot", "icon": "hubspot"},
      {"name": "Google Workspace", "icon": "google"}
    ],
    "editedAt": "3 days ago"
  },
  {
    "id": "tpl-4",
    "name": "People Operations",
    "department": "HR",
    "apps": [
      {"name": "BambooHR", "icon": "bamboohr"},
      {"name": "Slack", "icon": "slack"},
      {"name": "Notion", "icon": "notion"},
      {"name": "Google Workspace", "icon": "google"},
      {"name": "Lattice", "icon": "lattice"}
    ],
    "editedAt": "5 days ago"
  }
]
```

---

## Screen 2: Template Editor

**Route**: `/templates/:id` or `/templates/new`

### Layout
Two-column layout:
- **Left column (60%)**: Template configuration form
- **Right column (40%)**: Live preview / app list

### Left Column — Configuration

**Template Name** (text input)
- Placeholder: "e.g., Product Designer"
- Large text, editable inline or in a standard input

**Department** (dropdown/select)
- Options: Design, Engineering, Sales, Marketing, HR, Finance, Operations, Support
- Shown as a colored tag after selection

**Description** (optional textarea)
- Placeholder: "Describe when this template should be used..."
- 2–3 lines max

**Apps Section**
- Section header: "Applications" with count badge (e.g., "5 apps")
- **"+ Add App" button** → opens an app search modal/dropdown
- Each added app appears as a row:
  - App icon (32px) + App name
  - Remove button (X icon, subtle)
  - The rows should be draggable for reordering (optional — nice-to-have)

### App Search Modal/Dropdown
When "+ Add App" is clicked:
- A modal or inline dropdown with a search input
- Shows a filterable list of available apps (from Orio's catalog)
- Each row: app icon + name + category tag
- Click to add → app appears in the template's app list
- Already-added apps show a checkmark and are slightly dimmed

**Available apps catalog** (mock data):
```
Figma, Notion, Slack, Jira, Linear, GitHub, GitLab, VS Code, AWS, Google Workspace, Salesforce, HubSpot, Gong, Datadog, Sentry, BambooHR, Lattice, Loom, Miro, Confluence, 1Password, Zoom, Intercom, Zendesk, Asana, Monday.com, Airtable, Postman, Docker, Terraform
```

### Right Column — Live Preview

A card that mirrors what the template looks like "from the outside":
- Template name
- Department badge
- List of apps with icons
- Total app count
- "This is what IT admins will see when selecting this template during onboarding."

### Actions
- **"Save Template"** button (bottom of the form, primary style)
- **"Cancel"** link (secondary, returns to list)
- On save: show a toast notification "Template saved successfully" and redirect to the templates list

---

## Screen 3: Onboarding Flow

**Route**: `/onboarding` (list) → `/onboarding/new` (flow)

### 3a. Onboarding List (brief)
Similar structure to templates list but shows recent onboarding events:
- Employee name + avatar
- Role/department
- Date provisioned
- Status badge (Completed / In Progress / Partial Failure)
- App count

**Primary CTA**: "+ New Onboarding" button

### 3b. New Onboarding Flow

This is a **multi-step flow** (not a single form). Steps should feel lightweight — think a stepper or a progressive disclosure pattern, not a heavy wizard.

#### Step 1: Employee Details
- **Name** (text input) — required
- **Email** (text input) — required
- **Department** (dropdown) — required
- **Role** (text input) — required
- **Start Date** (date picker) — required

On filling Department + Role, the system should suggest a matching template (if one exists). Show a subtle inline message: "✨ We found a matching template: **Product Designer** — 5 apps"

**CTA**: "Next: Review Access" →

#### Step 2: Access Review
This is the core screen — what the IT admin sees before provisioning.

**Header area**:
- Employee summary: Name, Email, Department, Role, Start Date (compact, in a summary card)
- Template used: "[Template name]" with option to "Change template"

**App list** (the access package):
Each app displayed as a card/row:
- App icon (32px) + App name
- Status: "Will be provisioned" (default state, green text or badge)
- Remove button (X) — to exclude an app from this specific onboarding
- No granular permissions in MVP (just grant/revoke at app level)

**"+ Add App" button** — same search modal as the template editor, allows adding apps beyond the template for this specific onboarding

**Summary bar** (sticky at bottom or as a visible section):
- "5 apps will be provisioned for Maria Santos"
- [Provision Access] button — primary, prominent

**CTA**: "Provision Access" →

#### Step 3: Provisioning Status (Live)
After clicking "Provision Access":

**Confirmation modal** first:
- "You're about to grant access to 5 apps for Maria Santos. This will create accounts and send invitation emails."
- [Confirm] [Cancel]

Then, the provisioning status screen:

- Employee name at the top
- A list of apps, each with a real-time status indicator:
  - ⏳ Provisioning... (loading spinner)
  - ✅ Provisioned (green check, with time: "0.8s")
  - ❌ Failed (red X, with "Retry" button)
- Animate the statuses appearing sequentially (stagger them 0.5–1s apart to simulate real provisioning)
- Once all complete, show a summary:
  - "✅ 5/5 apps provisioned for Maria Santos"
  - "Completed in 4.2 seconds"
  - [View in Activity Log] [Onboard Another Employee]

**Error state** (show for one app to demonstrate awareness):
For the demo, make one app (e.g., Jira) fail on first attempt. Show:
- ❌ Jira — "Connection timed out" — [Retry]
- On clicking Retry, animate it going to ⏳ then ✅
- Final summary: "5/5 apps provisioned (1 retry)"

---

## Screen 4: Activity Dashboard

**Route**: `/activity`

### Summary Stats (top of page)
4 stat cards in a row:
- **Employees onboarded** — "12" (this month)
- **Apps provisioned** — "47" (this month)
- **Avg. time to provision** — "38 seconds"
- **Failed provisions** — "2" (with subtle warning color)

### Activity Feed
A chronological list (most recent first) of provisioning events.

Each entry:
- **Employee avatar + name**
- **Action**: "Onboarded with template: Product Designer"
- **App count**: "5 apps provisioned"
- **Status badge**: ✅ Completed / ⚠️ Partial / ❌ Failed
- **Timestamp**: "2 minutes ago", "Yesterday at 3:45 PM", etc.
- **Provisioned by**: "Alex M."

Clicking an entry opens a **detail drawer** (slide-in from right):
- Full employee info
- Template used
- Per-app breakdown: app icon + name + status + time taken
- "Provisioned by Alex M. on Mar 22, 2026 at 10:15 AM"

### Mock Activity Data
```json
[
  {
    "employee": "Maria Santos",
    "template": "Product Designer",
    "apps": 5,
    "status": "completed",
    "time": "2 minutes ago",
    "provisionedBy": "Alex M.",
    "duration": "4.2s"
  },
  {
    "employee": "João Pereira",
    "template": "Frontend Engineer",
    "apps": 8,
    "status": "completed",
    "time": "Yesterday",
    "provisionedBy": "Alex M.",
    "duration": "6.8s"
  },
  {
    "employee": "Ana Costa",
    "template": "Account Executive",
    "apps": 6,
    "status": "partial",
    "time": "Mar 19",
    "provisionedBy": "Alex M.",
    "duration": "5.1s",
    "note": "1 app failed — Salesforce (retried successfully)"
  },
  {
    "employee": "Carlos Mendes",
    "template": "People Operations",
    "apps": 5,
    "status": "completed",
    "time": "Mar 18",
    "provisionedBy": "Alex M.",
    "duration": "3.5s"
  },
  {
    "employee": "Sofia Ribeiro",
    "template": "Frontend Engineer",
    "apps": 8,
    "status": "completed",
    "time": "Mar 15",
    "provisionedBy": "Alex M.",
    "duration": "7.2s"
  }
]
```

---

## Interactions & Animations

- **Page transitions**: Smooth fade or slide when navigating between routes
- **Provisioning status**: Staggered animation — each app status resolves 0.5–1s after the previous one
- **Toast notifications**: Slide in from top-right, auto-dismiss after 4s
- **Modal animations**: Fade in with subtle scale (0.95 → 1.0)
- **Card hovers**: Gentle lift (translate-y -2px) with shadow increase
- **Button states**: Clear hover, active, and disabled states
- **Loading states**: Subtle skeleton screens or spinners where appropriate

---

## Technical Requirements

- **Framework**: React (single .jsx file for the artifact, or a small multi-file project)
- **Styling**: Tailwind CSS utility classes
- **Routing**: Use React state to simulate routing (useState for currentView), or React Router if multi-file
- **Data**: All data is hardcoded/mocked — no API calls
- **App icons**: Use colored circles with the first letter of the app name as a fallback, or use Lucide icons where applicable. For well-known apps, you can use simple SVG logos or emoji representations.
- **Responsiveness**: Desktop-only is fine (1280px+ viewport). This is an enterprise admin tool.

---

## File Structure (if multi-file)
```
/src
  App.jsx            — Main app shell, routing, sidebar
  /components
    Sidebar.jsx       — Navigation sidebar
    TopBar.jsx        — Breadcrumbs + user info
    TemplateCard.jsx  — Card component for template list
    AppRow.jsx        — App row with icon, name, remove
    AppSearchModal.jsx — Searchable app catalog
    StatusIndicator.jsx — Provisioning status (loading/success/fail)
    StatCard.jsx      — Dashboard stat card
    ActivityEntry.jsx — Activity feed row
    DetailDrawer.jsx  — Slide-in detail panel
  /data
    mockData.js       — All mock templates, apps, employees, activity
  /views
    TemplatesList.jsx
    TemplateEditor.jsx
    OnboardingList.jsx
    OnboardingFlow.jsx
    ActivityDashboard.jsx
```

---

## What Success Looks Like

The prototype should feel like a real product, not a wireframe. Someone reviewing it should:

1. **Understand the concept immediately** — "Oh, you create templates of apps per role, then use them to onboard people."
2. **Feel the time savings** — The provisioning animation makes the speed tangible.
3. **Trust the system** — The review step, status feedback, and activity log convey reliability.
4. **See the path forward** — The sidebar hints at broader platform features; the design feels extensible.
5. **Want to use it** — The UI is warm, clear, and pleasant. It doesn't feel like enterprise drudgery.
