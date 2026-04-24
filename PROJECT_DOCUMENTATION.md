# 📋 BMC OS - Project Documentation

## 1. 🎯 Project Overview

| Field | Details |
|-------|---------|
| **Project Name** | BMC OS (Build. Manage. Connect. Operating System) |
| **App Title** | SaaS Company Portfolio System |
| **Founded Year** | 2024 |
| **CEO & Founder** | AHMED MOHAMED |
| **Contact Email** | 7hmedmohamed12@gmail.com |
| **Frontend Stack** | React 18 + TypeScript + Vite + Tailwind CSS |
| **Animation Library** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts + Custom SVG |
| **Export Tools** | html2canvas + jspdf |

### 🎯 Project Goal
BMC OS is an enterprise SaaS platform revolutionizing healthcare, education, and fitness industries. It serves as a unified AI-powered platform transforming global operations through intelligent software solutions.

### 🌍 Vision
Pioneer the global standard in intelligent operating systems, empowering 1B+ users across 100+ countries – redefining enterprise efficiency with AI-driven innovation.

### 🚀 Mission
Deliver scalable AI-powered SaaS platforms transforming global operations: streamlining Asian hospital workflows, revolutionizing African education, scaling European fitness empires.

---

## 2. 🔗 Supabase Connection

| Field | Value |
|-------|-------|
| **Project URL** | `https://kjrkqfwwixvapkhtssmh.supabase.co` |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcmtxZnd3aXh2YXBraHRzc21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTA1NjYsImV4cCI6MjA4MDM2NjU2Nn0.tdZMt6_M_GjcCjATh-OwTx_14nN2JZutPpmOEw-Nkpc` |
| **Supabase Client** | `@supabase/supabase-js` v2.89.0 |

### Real-time Subscriptions Active:
- `notes` table
- `categories` table
- `workspaces` table

---

## 3. 📊 Database Tables & Schema

### 3.1 `categories`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `number` | Primary key, auto-increment |
| `name` | `string` | Category name (e.g., Work, Personal, Ideas) |

### 3.2 `notes`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `number` | Primary key, auto-increment |
| `title` | `string` | Note title |
| `content` | `string` | Note body/content |
| `image` | `string?` | Optional image URL |
| `video_url` | `string?` | Optional video URL |
| `category_id` | `number` | Foreign key to categories |
| `workspace_id` | `number?` | Foreign key to workspaces |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string?` | ISO timestamp |
| `tags` | `string[]` | Array of tag strings |
| `priority` | `enum` | `low` \| `medium` \| `high` |
| `pinned` | `boolean` | Is note pinned? |
| `template` | `string?` | Optional template name |

### 3.3 `workspaces`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Workspace name |
| `user_id` | `string` | Owner user ID |
| `is_default` | `boolean` | Is default workspace? |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |

### 3.4 `company_info`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `string` | Primary key |
| `name` | `string` | Company name |
| `description` | `string` | Company description |
| `vision` | `string` | Company vision |
| `mission` | `string` | Company mission |
| `founded_year` | `number` | Year founded |

### 3.5 `sectors`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `string` | Primary key (healthcare, education, fitness) |
| `name` | `string` | Sector name |
| `description` | `string` | Sector description |
| `icon` | `string` | Lucide icon name |

### 3.6 `products`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `string` | Primary key |
| `sector_id` | `string` | FK to sectors |
| `name` | `string` | Product name |
| `description` | `string` | Product description |
| `status` | `enum` | `active` \| `planned` \| `development` |
| `vision` | `string` | Product vision |
| `target_market` | `string` | Target audience |
| `launch_date` | `string` | Launch date |
| `planUrl` | `string?` | Plan/documentation URL |

### 3.7 `product_features`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `string` | Primary key |
| `product_id` | `string` | FK to products |
| `feature` | `string` | Feature name |
| `status` | `enum` | `completed` \| `in_progress` \| `planned` |

### 3.8 `team_members`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `string` | Primary key |
| `name` | `string` | Member name |
| `role` | `string` | Job title |
| `sector_id` | `string?` | FK to sector (nullable) |
| `email` | `string` | Email address |
| `joined_date` | `string` | Join date |
| `bio` | `string` | Biography |

### 3.9 `financial_projections`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `string` | Primary key |
| `product_id` | `string` | FK to products |
| `year` | `number` | Projection year |
| `quarter` | `number` | Quarter (1-4) |
| `revenue_projection` | `number` | Projected revenue |
| `user_projection` | `number` | Projected users |

### 3.10 Sector Content Tables (Dynamic)
| Table Name | Sector |
|------------|--------|
| `z_sector_a` | Education |
| `z_sector_b` | Healthcare |
| `z_sector_c` | Fitness |

Each sector content table has:
| Column | Type |
|--------|------|
| `id` | `string` |
| `title` | `string` |
| `content` | `string` |
| `created_at` | `string` |

---

## 4. 🎨 Design System & Colors

### 4.1 Primary Color Palette (Tailwind Config)

#### Slate (Main UI Colors)
| Shade | Hex | Usage |
|-------|-----|-------|
| `slate-50` | `#f8fafc` | Light backgrounds, cards |
| `slate-100` | `#f1f5f9` | Subtle backgrounds, borders |
| `slate-200` | `#e2e8f0` | Borders, dividers |
| `slate-300` | `#cbd5e1` | Disabled states, placeholders |
| `slate-400` | `#94a3b8` | Secondary text |
| `slate-500` | `#64748b` | Muted text |
| `slate-600` | `#475569` | Body text |
| `slate-700` | `#334155` | Headings, primary text |
| `slate-800` | `#1e293b` | Dark UI elements |
| `slate-900` | `#0f172a` | Headers, dark backgrounds |
| `slate-950` | `#020617` | Deepest dark |

#### Gray (Monochrome Palette)
| Shade | Hex | Usage |
|-------|-----|-------|
| `gray-50` | `#f9fafb` | Page backgrounds |
| `gray-100` | `#f3f4f6` | Card backgrounds |
| `gray-200` | `#e5e7eb` | Borders |
| `gray-300` | `#d1d5db` | Disabled |
| `gray-400` | `#9ca3af` | Placeholder text |
| `gray-500` | `#6b7280` | Secondary text |
| `gray-600` | `#4b5563` | Body text |
| `gray-700` | `#374151` | Headings |
| `gray-800` | `#1f2937` | Dark elements |
| `gray-900` | `#111827` | Darkest |
| `gray-950` | `#030712` | Deepest black |

#### Primary (Brand Colors)
| Shade | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#f8fafc` | Light tint |
| `primary-500` | `#334155` | Primary button hover |
| `primary-600` | `#1e293b` | Primary buttons |
| `primary-700` | `#0f172a` | Active states |
| `primary-900` | `#020617` | Deepest |

### 4.2 Accent Colors (Used in Components)
| Color | Hex | Usage |
|-------|-----|-------|
| **Emerald** | `#10b981` | Success, total notes counter, active states |
| **Blue** | `#3b82f6` | Links, interactive elements |
| **Amber** | `#f59e0b` | Warnings, highlights |
| **Red** | `#ef4444` | Errors, high priority, danger |
| **Violet** | `#8b5cf6` | Purple accents |
| **Cyan** | `#06b6d4` | Info accents |
| **Orange** | `#f97316` | Warnings |
| **Pink** | `#ec4899` | Special highlights |

### 4.3 Chart Palette (PieChart)
```
['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899']
```

### 4.4 Priority Badges
| Priority | Classes |
|----------|---------|
| `low` | `bg-green-100 text-green-800 border-green-200` |
| `medium` | `bg-yellow-100 text-yellow-800 border-yellow-200` |
| `high` | `bg-red-100 text-red-800 border-red-200` |

### 4.5 Product Status Colors
| Status | Color |
|--------|-------|
| `active` | Green/Emerald |
| `development` | Blue |
| `planned` | Amber/Yellow |

### 4.6 Feature Status Colors
| Status | Color |
|--------|-------|
| `completed` | Green |
| `in_progress` | Blue |
| `planned` | Gray |

---

## 5. 🏗️ Application Architecture

### 5.1 Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page with company overview |
| `/notes` | `NotesPage` | Notes dashboard with categories |
| `/sectors` | `SectorsComp` | Sector listing |
| `/products` | `Products` | Product portfolio |
| `/team` | `Team` | Team members |
| `/projections` | `Projections` | Financial projections |
| `/workspaces` | `Workspaces` | Workspace management |

### 5.2 Component Structure
```
src/
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Sidebar.tsx          # Side navigation
│   ├── LoginPage.tsx        # Authentication page
│   ├── Overview.tsx         # Company overview dashboard
│   ├── Sectors.tsx          # Sector display
│   ├── Products.tsx         # Product listing
│   ├── Team.tsx             # Team members display
│   ├── Projections.tsx      # Financial charts
│   ├── Workspaces.tsx       # Workspace management
│   ├── CategorySelector.tsx # Category picker
│   ├── NotesList.tsx        # Notes listing with table
│   ├── NotesReportTable.tsx # Detailed notes report
│   ├── NoteModal.tsx        # Note view modal
│   ├── NoteForm.tsx         # Create/edit note form
│   ├── NoteActions.tsx      # Note action buttons
│   ├── NoteModal.tsx        # Note display modal
│   ├── BookReader.tsx       # Book-like reading view
│   ├── BookLikeNoteModal.tsx# Book-style note modal
│   ├── GlobalSearch.tsx     # Global search overlay
│   ├── PieChart.tsx         # Category distribution chart
│   ├── ContentModal.tsx     # Content display modal
│   └── Header.tsx           # App header
├── context/
│   └── AuthContext.tsx      # Authentication context
├── data/
│   └── company.ts           # Static company data
├── hooks/
│   └── useSpeechRecognition.ts # Voice input hook
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── types.ts             # TypeScript interfaces
│   ├── auth.ts              # Auth functions
│   ├── useData.ts           # Company data fetching
│   ├── useNotesData.ts      # Notes data fetching
│   ├── useWorkspaces.ts     # Workspace management
│   └── sectorContent.ts     # Sector content CRUD
```

---

## 6. 🔐 Authentication

### Login Credentials
| Field | Value |
|-------|-------|
| **Username** | `ahmrd` |
| **Password** | `ahmed` |
| **Email** | `ahmedmoham3dceo@gmail.com` |
| **Role** | `admin` |

### Auth Flow
- Simple username/password validation (hardcoded)
- User stored in `localStorage` under key `bmc_auth_user`
- Context-based auth state management
- Logout clears localStorage

---

## 7. 📦 Key Features

### 7.1 Notes System
- ✅ Create, read, update, delete notes
- ✅ Category organization
- ✅ Workspace isolation
- ✅ Priority levels (low/medium/high)
- ✅ Tags support
- ✅ Pinned notes
- ✅ Image & video attachments
- ✅ Templates
- ✅ Global search (Ctrl+K)
- ✅ Sortable table with pagination
- ✅ CSV export
- ✅ Category distribution pie chart
- ✅ Recent activity feed
- ✅ Book-like reading mode
- ✅ Voice input (speech recognition)

### 7.2 Company Portfolio
- ✅ Multi-sector display (Healthcare, Education, Fitness)
- ✅ Product catalog with features
- ✅ Team member directory
- ✅ Financial projections with charts
- ✅ Sector-specific content management

### 7.3 Workspaces
- ✅ Multiple workspaces per user
- ✅ Workspace switching
- ✅ Auto-create default workspace
- ✅ Real-time sync

---

## 8. 🎬 Animations (Tailwind Config)

| Animation | Duration | Usage |
|-----------|----------|-------|
| `fadeInUp` | 0.6s | Card entrances |
| `slideDown` | 0.4s | Dropdown menus |
| `slideInLeft` | 0.5s | Sidebar slides |
| `bounceFloat` | 1.2s | Floating elements |
| `pulseGlow` | 2s | Pulsing highlights |
| `ripple` | 0.6s | Button ripple effects |
| `chipStagger` | 0.6s | Tag chip entrances |

### Framer Motion Transitions
- Page transitions: `opacity` + `scale` + `y`
- Modal animations: `scale` + `opacity`
- List items: staggered fade-in with `x` offset
- Charts: `scale` + `opacity` on mount

---

## 9. 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

### Responsive Patterns
- Mobile-first design
- Stacked layouts on mobile (`flex-col`)
- Side-by-side on desktop (`flex-row`)
- Hidden columns in tables on smaller screens
- Full-width cards on mobile, grid on desktop

---

## 10. 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Type check
npm run typecheck

# Preview production build
npm run preview
```

---

## 11. 📁 File Structure Summary

```
BMS-OS/
├── public/
│   ├── logo.svg
│   └── vite.svg
├── src/
│   ├── components/        # 18 React components
│   ├── context/           # Auth context
│   ├── data/              # Static company data
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities & data fetching
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tailwind.config.js     # Custom theme
├── vite.config.ts
├── tsconfig.json
└── vercel.json            # Deployment config
```

---

## 12. 🌐 Deployment

| Platform | Configuration |
|----------|---------------|
| **Primary** | Vercel (`vercel.json`) |
| **Secondary** | GitHub Pages (`gh-pages` package) |

---

## 13. ⚠️ Important Notes

1. **Auth is hardcoded** - No Supabase Auth used; simple localStorage-based auth
2. **Fallback data** - If Supabase fails, static data from `src/data/company.ts` is used
3. **Workspace filtering** - Notes are filtered by `localStorage.getItem('current_workspace_id')`
4. **Real-time updates** - Active Supabase realtime subscriptions on notes, categories, workspaces
5. **Supabase Dashboard Link**: https://kjrkqfwwixvapkhtssmh.supabase.co

---

*Document generated from codebase analysis. Last updated: 2025*

