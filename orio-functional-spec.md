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

> **Implemented as 3-column grid.**

### Template Card
Each card shows:
- **Template name** (e.g., "Product Designer") — prominent, bold
- **Department tag** (e.g., "Design") — colored chip/badge
- **App count** (e.g., "5 apps") — subtle text
- **App icon row** — show the first 4–5 app icons (small, 24px), with "+N" if more
- **Last edited** — relative timestamp (e.g., "Edited 2 days ago")
- **Three-dot menu** → Edit, Duplicate, Delete (can be non-functional)

> **Changed: Three-dot menu is fully functional** (not just decorative):
> - **Edit** → opens Template Editor
> - **Duplicate** → creates a copy prefixed "Copy of [name]", flagged with a "Review and save" amber badge below the app icon row. The copy is hidden from the Onboarding flow until reviewed and saved.
> - **Delete** → inline confirm-before-delete state within the menu; removes the template.
>
> **Changed: "Design" department renamed to "Product"** across templates and department selectors.
>
> **Added: `needsAttention` flag** on duplicated templates. These cards show a "Review and save" amber pill badge (replacing last-edited timestamp in the footer). No special border or top badge — just the footer pill.

### Sorting & Grouping

> **Added: Toolbar above the grid (left-aligned) with two controls:**
> - **Sort dropdown**: "Last edited" (default) | "A → Z"
>   - ~~"Most accessed" was considered and removed~~
>   - Sort is applied to the full list before rendering
>   - Each template stores `editedAtMs` (numeric timestamp) for accurate sort; new saves and duplicates stamp `Date.now()`
> - **"Group by dept" toggle button**: when active, breaks the grid into department sections with a colored department pill header and template count per section; sections sorted alphabetically

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

> **Changed: "Design" → "Product" department on tpl-1.**
> **Added: `editedAtMs` (numeric timestamp) and `accessCount` fields** to all templates for sort support.

```json
[
  {
    "id": "tpl-1",
    "name": "Product Designer",
    "department": "Product",
    "apps": ["Figma", "Notion", "Slack", "Jira", "Linear"],
    "editedAt": "2 days ago",
    "editedAtMs": "<Date.now() - 2 days>",
    "accessCount": 1
  },
  {
    "id": "tpl-2",
    "name": "Frontend Engineer",
    "department": "Engineering",
    "apps": ["GitHub", "VS Code", "Slack", "Jira", "Notion", "AWS", "Datadog", "Linear"],
    "editedAt": "1 week ago",
    "editedAtMs": "<Date.now() - 7 days>",
    "accessCount": 2
  },
  {
    "id": "tpl-3",
    "name": "Account Executive",
    "department": "Sales",
    "apps": ["Salesforce", "Slack", "Notion", "Gong", "HubSpot", "Google Workspace"],
    "editedAt": "3 days ago",
    "editedAtMs": "<Date.now() - 3 days>",
    "accessCount": 1
  },
  {
    "id": "tpl-4",
    "name": "People Operations",
    "department": "HR",
    "apps": ["BambooHR", "Slack", "Notion", "Google Workspace", "Lattice"],
    "editedAt": "5 days ago",
    "editedAtMs": "<Date.now() - 5 days>",
    "accessCount": 1
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

> **Changed: Department rendered as pill tags** (not a dropdown). User taps a pill to select a department; selected pill gets colored background matching the department color.
> **Changed: "Design" option renamed to "Product".**

- Shown as a colored tag after selection

**Description** (optional textarea)
- Placeholder: "Describe when this template should be used..."
- 2–3 lines max

> **Added: "Show more / Show less" toggle** in the live preview when description overflows.

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

> **Changed: Navigation to templates list happens immediately on save** (no delay). Toast message is carried via `viewParams` and rendered by TemplatesList on mount.
> **Changed: Toast has no checkmark icon** — the icon alone is sufficient.
> **Changed: Saving a template clears `needsAttention`** and stamps `editedAt: "just now"` + `editedAtMs: Date.now()`.

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

> **Changed: List is live** — new onboardings completed in the flow are prepended to this list.
> **Removed: "Template removed" warning** on rows where the source template was deleted (originally planned, later removed to keep the list clean).

**Primary CTA**: "+ New Onboarding" button

### 3b. New Onboarding Flow

This is a **multi-step flow** (not a single form). Steps should feel lightweight — think a stepper or a progressive disclosure pattern, not a heavy wizard.

#### Step 1: Employee Details
- **Name** (text input) — required

> **Changed: Name split into First Name + Last Name** (two separate inputs in a 2-column grid).

- **Email** (text input) — required

> **Added: Email auto-generation** from `firstName.lastName@company.com`. Auto-populates as the user types their name. Stops auto-updating once the user manually edits the email field.

- **Department** (dropdown) — required

> **Changed: Department rendered as pill tags**, consistent with the Template Editor. Uses the same department color system.

- **Role** (text input) — required

> **Added: Template suggestion chips** below the role input when a department is selected. Shows all templates for that department as clickable chips (name + app count). Clicking a chip fills the role field and pre-selects that template for Step 2. Chips are styled with a sparkle (✨) "Suggested:" label.

- **Start Date** (date picker) — required

> **Changed: Custom calendar date picker** (no library). Month navigation grid with coral highlight on selected day and a today indicator.

On filling Department + Role, the system should suggest a matching template (if one exists). Show a subtle inline message: "✨ We found a matching template: **Product Designer** — 5 apps"

**CTA**: "Next: Review Access" →

#### Step 2: Access Review
This is the core screen — what the IT admin sees before provisioning.

**Header area**:
- Employee summary: Name, Email, Department, Role, Start Date (compact, in a summary card)
- Template used: "[Template name]" with option to "Change template"

> **Added: "Change template" opens a modal** listing all ready templates (filtered — `needsAttention` templates excluded). Selecting a template replaces the app list with that template's apps.
> **Note: Templates with `needsAttention: true` are excluded from the entire onboarding flow** (both suggestions in Step 1 and the template picker in Step 2). They become available only after being reviewed and saved.

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

> **Changed: The failing app is always the app at index 2** (not specifically Jira — whichever app is third in the list for that onboarding). This makes the error state work regardless of the template selected.

For the demo, make one app fail on first attempt. Show:
- ❌ [App] — "Connection timed out" — [Retry]
- On clicking Retry, animate it going to ⏳ then ✅
- Final summary: "5/5 apps provisioned (1 retry)"

> **Added: Completed onboarding is saved to the Onboarding List.** Uses a `savedRef` guard to ensure the save fires exactly once. Status is `"partial"` if any app required a retry, `"completed"` otherwise.

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

> **Status: Not yet built.** ActivityDashboard.jsx currently shows a placeholder. Mock data (`activityFeed`) is in `mockData.js` with full `appBreakdown` per entry.

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

- **Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS v3 utility classes

> **Note: Tailwind JIT limitation** — dynamically constructed class strings (e.g. `space-y-${n}`) are not generated at build time. Workaround: use inline `style={{}}` for dynamic spacing values and add a `safelist` regex in `tailwind.config.js` to pre-generate spacing utilities.

- **Routing**: Use React state to simulate routing (`useState` for `currentView` + `viewParams` in App.jsx)
- **Data**: All data is hardcoded/mocked — no API calls

> **State architecture**: `templates` and `onboardingHistory` are lifted to `App.jsx`, seeded from `mockData.js` constants. Mutation handlers (`saveTemplate`, `duplicateTemplate`, `deleteTemplate`, `addOnboarding`) are defined in App and passed down as props.

- **App icons**: Colored squares (not circles) with first letter of the app name, using a deterministic color map in `appColors` (mockData.js)
- **Responsiveness**: Desktop-only is fine (1280px+ viewport). This is an enterprise admin tool.

---

## File Structure (actual)
```
/src
  App.jsx                — Main app shell, routing, all lifted state, mutation handlers
  /components
    Sidebar.jsx          — Navigation sidebar
    TopBar.jsx           — Breadcrumbs + user info
    TemplateCard.jsx     — Card component for template list (with ThreeDotMenu inline)
    AppSearchModal.jsx   — Searchable app catalog modal
    Toast.jsx            — Fixed top-right toast, slide-in, auto-dismiss 4s
  /data
    mockData.js          — templates, appsCatalog, onboardingHistory, activityFeed,
                           departmentColors, appColors
  /views
    TemplatesList.jsx    — Grid + sort/group toolbar
    TemplateEditor.jsx   — Two-column editor with live preview
    OnboardingList.jsx   — Table of past onboardings
    OnboardingFlow.jsx   — 3-step flow (EmployeeStep, ReviewStep, ProvisioningStep)
    ActivityDashboard.jsx — Placeholder (not yet built)
```

> **Note: Several components from the original spec were not created as separate files** (AppRow, StatusIndicator, StatCard, ActivityEntry, DetailDrawer) — their logic was inlined into the relevant view components.

---

## What Success Looks Like

The prototype should feel like a real product, not a wireframe. Someone reviewing it should:

1. **Understand the concept immediately** — "Oh, you create templates of apps per role, then use them to onboard people."
2. **Feel the time savings** — The provisioning animation makes the speed tangible.
3. **Trust the system** — The review step, status feedback, and activity log convey reliability.
4. **See the path forward** — The sidebar hints at broader platform features; the design feels extensible.
5. **Want to use it** — The UI is warm, clear, and pleasant. It doesn't feel like enterprise drudgery.
