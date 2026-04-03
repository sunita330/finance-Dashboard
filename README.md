# 💹 FinanceOS — Finance Dashboard UI

> A premium, interactive personal finance dashboard 

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat-square&logo=javascript)
![CSS](https://img.shields.io/badge/CSS-Glassmorphism-1572B6?style=flat-square&logo=css3)
![No Dependencies](https://img.shields.io/badge/Extra%20Dependencies-None-brightgreen?style=flat-square)

---

## ✨ Live Features

| Feature | Status |
|---|---|
| Dashboard overview with summary cards | ✅ |
| Time-based bar chart (6-month trend) | ✅ |
| Categorical donut chart with hover | ✅ |
| Full transactions table | ✅ |
| Search, filter, and multi-column sort | ✅ |
| Role-based UI (Admin / Viewer) | ✅ |
| Add / Edit / Delete transactions (Admin) | ✅ |
| Insights section with smart observations | ✅ |
| Dark / Light mode toggle | ✅ |
| CSV export | ✅ |
| Toast notifications | ✅ |
| Animated gradient background + glassmorphism | ✅ |
| Fully responsive layout | ✅ |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Create a new Vite React project (if you don't have one)
npm create vite@latest finance-dashboard -- --template react
cd finance-dashboard

# 2. Replace src/App.jsx with FinanceDashboard.jsx
cp FinanceDashboard.jsx src/App.jsx

# 3. Install dependencies & run
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **No additional npm packages required.** The app uses only React 18 and Google Fonts (loaded via CSS @import).

---

## 🏗️ Project Structure

```
src/
└── App.jsx          ← Entire application (single-file architecture)
    ├── DARK / LIGHT  Theme token objects
    ├── Mock data      Transactions, monthly stats, category colors
    ├── Sparkline      SVG micro-chart component
    ├── BarChart       SVG 6-month income vs expense chart
    ├── DonutChart     Interactive SVG donut with hover states
    ├── SummaryCard    KPI card with sparkline + trend indicator
    └── App            Main component with all tabs and state
```

---

## 🎨 Design Decisions

### Glassmorphism + Gradient Background
Cards use `backdrop-filter: blur(20px) saturate(160%)` for a premium frosted-glass effect. Three animated radial gradient "orbs" float in the background using pure CSS keyframe animations — no canvas or WebGL needed.

### Dual Theme System
Two complete token objects (`DARK`, `LIGHT`) are swapped at runtime. Every colour, glass opacity, shadow, and orb tint adapts instantly with a single `useState` toggle.

### Typography
**Outfit** (display + body) paired with **JetBrains Mono** (numbers/amounts). Both loaded from Google Fonts for a distinctive, readable aesthetic that avoids overused defaults.

### Custom SVG Charts
All charts (bar, donut, sparkline) are hand-rolled SVG — no charting library dependency. This keeps the bundle tiny and gives full visual control.

### Animations
- Orb float: `@keyframes orbFloat` — 12s infinite with staggered delays per orb
- Card entrance: `@keyframes cardIn` — staggered per card (50ms apart)
- Bar growth: `@keyframes fillBar` — bars grow from base on render
- Sparkline draw: `stroke-dashoffset` animation draws lines left-to-right
- Button shine: CSS `::after` pseudo-element sweeps on hover

---

## 🔐 Role-Based UI

Switch roles using the dropdown in the top-right navbar.

| Capability | Viewer | Admin |
|---|:---:|:---:|
| View dashboard overview | ✅ | ✅ |
| Browse & filter transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add new transaction | ❌ | ✅ |
| Edit existing transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |
| Export CSV | ✅ | ✅ |

Roles are simulated on the frontend via `useState` — no backend or auth required.

---

## 📊 Core Requirements Coverage

### 1. Dashboard Overview
- **Summary cards**: Total Balance, Monthly Income, Expenses, Savings Rate — each with sparkline and MoM delta
- **Time-based visualization**: Animated SVG bar chart showing 6-month income vs. expenses
- **Categorical visualization**: Interactive donut chart with per-slice hover showing name, value, and percentage

### 2. Transactions Section
- Full table with Date, Description, Category, Type, Amount columns
- **Search**: Live text filter across description and category
- **Filter**: By type (income/expense) and by category
- **Sort**: Click any column header to sort ascending/descending
- Empty state shown when no results match

### 3. Role-Based UI
- Viewer: Read-only access
- Admin: Full CRUD — inline add form, per-row edit and delete buttons
- Role toggle in navbar with visual badge indicator

### 4. Insights Section
- Highest spending category with amount
- Best savings month across 6 months
- Average monthly expenses
- Month-over-month expense comparison
- Category breakdown with animated progress bars and percentages

### 5. State Management
All state is managed with React's built-in hooks:
- `useState` for transactions, filters, role, theme, form, active tab, toast
- `useMemo` for derived/filtered data (avoids unnecessary recalculation)
- `useEffect` for CSS injection and scrollbar theming

### 6. UI & UX
- Responsive grid (`auto-fit minmax`) adapts from 1 to 4 columns
- Empty state with illustration for no-results
- Toast notifications for all CRUD actions
- Hover animations on rows and cards
- Live indicator badge in page header

---

## 🌟 Optional Enhancements Implemented

- ✅ **Dark mode** — full dual-theme system with one-click toggle
- ✅ **Animations & transitions** — entrance animations, hover lifts, chart draw-on-render
- ✅ **Export functionality** — CSV download of current filtered view
- ✅ **Advanced filtering** — type + category + search combined

---

## 📝 Notes

- All data is **static/mock** — no backend calls or localStorage dependency
- The app is **not production-ready** by design (per assignment spec)
- Single-file architecture makes it easy to review end-to-end
- Tested in Chrome, Firefox, and Safari

---

