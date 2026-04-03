import { useState, useMemo, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────────────────────────────────────────── */
const DARK = {
  mode: "dark",
  bg1: "#060818", bg2: "#0d1130", bg3: "#111827",
  orb1: "#3b4fd8", orb2: "#7c3aed", orb3: "#0ea5e9",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.10)",
  glassFocus: "rgba(255,255,255,0.16)",
  surface: "rgba(255,255,255,0.06)",
  surfaceHover: "rgba(255,255,255,0.09)",
  text: "#f0f4ff", textSub: "#94a3c8", textMuted: "#4b5a82",
  accent: "#6d8cff", accentB: "#a78bfa",
  green: "#34d9a5", greenDim: "#0d4a38",
  red: "#f47186", redDim: "#4a0d1a",
  amber: "#fbbf24", amberDim: "#4a3000",
  purple: "#c084fc",
  teal: "#22d3ee",
  gradText: "linear-gradient(135deg,#6d8cff,#c084fc,#34d9a5)",
  navBg: "rgba(6,8,24,0.75)",
  cardShadow: "0 8px 32px rgba(0,0,0,0.45)",
  inputBg: "rgba(255,255,255,0.05)",
  scrollbar: "#1e2a4a",
};
const LIGHT = {
  mode: "light",
  bg1: "#f0f4ff", bg2: "#e8eeff", bg3: "#dde6ff",
  orb1: "#6d8cff", orb2: "#a78bfa", orb3: "#38bdf8",
  glass: "rgba(255,255,255,0.55)",
  glassBorder: "rgba(100,120,220,0.20)",
  glassFocus: "rgba(100,120,220,0.30)",
  surface: "rgba(255,255,255,0.65)",
  surfaceHover: "rgba(255,255,255,0.85)",
  text: "#0f172a", textSub: "#3d4f7a", textMuted: "#8898bb",
  accent: "#4060e8", accentB: "#7c3aed",
  green: "#059669", greenDim: "#d1fae5",
  red: "#e02060", redDim: "#ffe4ed",
  amber: "#d97706", amberDim: "#fef3c7",
  purple: "#7c3aed",
  teal: "#0891b2",
  gradText: "linear-gradient(135deg,#4060e8,#7c3aed,#059669)",
  navBg: "rgba(240,244,255,0.80)",
  cardShadow: "0 8px 32px rgba(80,100,200,0.13)",
  inputBg: "rgba(255,255,255,0.75)",
  scrollbar: "#c7d2fe",
};

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────────────────── */
const CATEGORIES = ["Housing","Food","Transport","Entertainment","Health","Salary","Freelance","Investment"];
const CAT_ICONS = { Housing:"🏠", Food:"🍔", Transport:"🚌", Entertainment:"🎬", Health:"💊", Salary:"💼", Freelance:"💻", Investment:"📈" };
const CAT_COLORS = {
  Housing:"#6d8cff", Food:"#34d9a5", Transport:"#fbbf24",
  Entertainment:"#c084fc", Health:"#f47186", Salary:"#34d9a5",
  Freelance:"#22d3ee", Investment:"#fbbf24",
};
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun"];
const MONTHLY_INCOME   = [3800,4200,4200,4700,4800,5000];
const MONTHLY_EXPENSES = [2900,3100,3400,3200,3600,3500];

const BASE_TRANSACTIONS = [
  {id:1,  date:"2025-06-01", desc:"June Salary",       cat:"Salary",        type:"income",  amt:4200},
  {id:2,  date:"2025-06-01", desc:"Rent Payment",      cat:"Housing",       type:"expense", amt:1200},
  {id:3,  date:"2025-06-03", desc:"Grocery Run",       cat:"Food",          type:"expense", amt:140},
  {id:4,  date:"2025-06-05", desc:"Netflix",           cat:"Entertainment", type:"expense", amt:18},
  {id:5,  date:"2025-06-06", desc:"Metro Card",        cat:"Transport",     type:"expense", amt:90},
  {id:6,  date:"2025-06-07", desc:"Pharmacy",          cat:"Health",        type:"expense", amt:42},
  {id:7,  date:"2025-06-09", desc:"Freelance Project", cat:"Freelance",     type:"income",  amt:800},
  {id:8,  date:"2025-06-11", desc:"Dinner Out",        cat:"Food",          type:"expense", amt:68},
  {id:9,  date:"2025-06-13", desc:"Gym Membership",    cat:"Health",        type:"expense", amt:35},
  {id:10, date:"2025-06-15", desc:"Spotify",           cat:"Entertainment", type:"expense", amt:10},
  {id:11, date:"2025-06-17", desc:"Uber Ride",         cat:"Transport",     type:"expense", amt:24},
  {id:12, date:"2025-06-19", desc:"Index Fund",        cat:"Investment",    type:"income",  amt:200},
  {id:13, date:"2025-06-21", desc:"Coffee & Snacks",   cat:"Food",          type:"expense", amt:54},
  {id:14, date:"2025-06-23", desc:"Amazon Order",      cat:"Entertainment", type:"expense", amt:88},
  {id:15, date:"2025-06-25", desc:"Doctor Visit",      cat:"Health",        type:"expense", amt:60},
  {id:16, date:"2025-05-01", desc:"May Salary",        cat:"Salary",        type:"income",  amt:4200},
  {id:17, date:"2025-05-01", desc:"Rent Payment",      cat:"Housing",       type:"expense", amt:1200},
  {id:18, date:"2025-05-05", desc:"Grocery",           cat:"Food",          type:"expense", amt:160},
  {id:19, date:"2025-05-08", desc:"Cinema Night",      cat:"Entertainment", type:"expense", amt:30},
  {id:20, date:"2025-05-10", desc:"Bus Pass",          cat:"Transport",     type:"expense", amt:80},
  {id:21, date:"2025-05-15", desc:"Freelance Project", cat:"Freelance",     type:"income",  amt:600},
  {id:22, date:"2025-05-18", desc:"Restaurant",        cat:"Food",          type:"expense", amt:75},
  {id:23, date:"2025-05-22", desc:"Health Checkup",    cat:"Health",        type:"expense", amt:50},
  {id:24, date:"2025-04-01", desc:"April Salary",      cat:"Salary",        type:"income",  amt:4200},
  {id:25, date:"2025-04-01", desc:"Rent Payment",      cat:"Housing",       type:"expense", amt:1200},
  {id:26, date:"2025-04-07", desc:"Grocery",           cat:"Food",          type:"expense", amt:130},
  {id:27, date:"2025-04-12", desc:"Freelance",         cat:"Freelance",     type:"income",  amt:500},
  {id:28, date:"2025-04-18", desc:"Transport Pass",    cat:"Transport",     type:"expense", amt:95},
  {id:29, date:"2025-04-25", desc:"Entertainment",     cat:"Entertainment", type:"expense", amt:45},
];

const fmt = (n) => "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0 });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { overflow-x: hidden; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { border-radius: 99px; }

.fin-app { font-family: 'Outfit', system-ui, sans-serif; min-height: 100vh; transition: background 0.4s ease; }

/* animated gradient orbs */
.orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; animation: orbFloat 12s ease-in-out infinite; }
.orb1 { width: 520px; height: 520px; top: -160px; left: -160px; animation-delay: 0s; }
.orb2 { width: 420px; height: 420px; bottom: -120px; right: -100px; animation-delay: -4s; }
.orb3 { width: 300px; height: 300px; top: 40%; left: 55%; animation-delay: -8s; }

@keyframes orbFloat {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(24px,-32px) scale(1.06); }
  66%      { transform: translate(-16px,24px) scale(0.95); }
}

/* glass card */
.glass {
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-radius: 18px;
  transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
}
.glass:hover { transform: translateY(-2px); }

/* tab active bar */
.tab-active::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 50%; transform: translateX(-50%);
  width: 24px; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg,#6d8cff,#c084fc);
}

/* row hover */
.txn-row { transition: background 0.15s ease; }

/* gradient text */
.grad-text {
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

/* badge pulse */
@keyframes pulseDot { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

/* card entrance */
@keyframes cardIn {
  from { opacity:0; transform: translateY(16px); }
  to   { opacity:1; transform: translateY(0); }
}
.card-in { animation: cardIn 0.45s cubic-bezier(.22,.68,0,1.1) both; }
.card-in-1 { animation-delay: 0.05s; }
.card-in-2 { animation-delay: 0.12s; }
.card-in-3 { animation-delay: 0.19s; }
.card-in-4 { animation-delay: 0.26s; }
.card-in-5 { animation-delay: 0.33s; }

/* progress bar fill */
@keyframes fillBar { from { width: 0; } }
.bar-fill { animation: fillBar 0.9s cubic-bezier(.22,.68,0,1) both; }

/* sparkline path draw */
@keyframes drawLine { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }

/* toast slide */
@keyframes toastIn { from { opacity:0; transform: translateY(16px) scale(.96); } to { opacity:1; transform:none; } }
.fin-toast { animation: toastIn 0.3s cubic-bezier(.22,.68,0,1) both; }

/* number font */
.mono { font-family: 'JetBrains Mono', monospace; }

/* button shine sweep */
.btn-primary { position: relative; overflow: hidden; }
.btn-primary::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
  transition: left 0.5s ease;
}
.btn-primary:hover::after { left: 150%; }

/* select arrow reset */
select { appearance: none; -webkit-appearance: none; }
`;

function injectGlobalCss() {
  if (document.getElementById("fin-global-css")) return;
  const el = document.createElement("style");
  el.id = "fin-global-css";
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────────────────────────────────────── */
function Sparkline({ data, color, w = 110, h = 38 }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return [x.toFixed(1), y.toFixed(1)];
  });
  const linePts = pts.map(p => p.join(",")).join(" ");
  const fillPts = [
    `0,${h}`, ...pts.map(p => p.join(",")), `${w},${h}`
  ].join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sg-${color.replace("#","")})`}/>
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ strokeDasharray: 200, animation: "drawLine 1.2s ease both" }}/>
      {pts.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i===data.length-1?3:0} fill={color} opacity={i===data.length-1?1:0}/>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BAR CHART (SVG)
───────────────────────────────────────────────────────────────────────────── */
function BarChart({ income, expenses, T }) {
  const max = Math.max(...income, ...expenses);
  const W = 500, H = 150, barW = 22, gap = 6, groupW = barW * 2 + gap + 20;
  return (
    <svg viewBox={`0 0 ${W} ${H + 32}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="bar-inc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.green}/>
          <stop offset="100%" stopColor={T.teal} stopOpacity="0.6"/>
        </linearGradient>
        <linearGradient id="bar-exp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.red}/>
          <stop offset="100%" stopColor="#f47186" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75,1].map(f => (
        <line key={f} x1="8" y1={H*(1-f)} x2={W-8} y2={H*(1-f)}
          stroke={T.glassBorder} strokeWidth="0.5" strokeDasharray="4,4"/>
      ))}
      {income.map((inc, i) => {
        const exp = expenses[i];
        const x = i * groupW + 18;
        const incH = (inc / max) * H;
        const expH = (exp / max) * H;
        return (
          <g key={i}>
            <rect x={x} y={H - incH} width={barW} height={incH} rx="5"
              fill="url(#bar-inc)"
              style={{ transformOrigin: `${x}px ${H}px`, animation: `fillBar 0.8s ${i*0.08}s cubic-bezier(.22,.68,0,1) both` }}/>
            <rect x={x + barW + gap} y={H - expH} width={barW} height={expH} rx="5"
              fill="url(#bar-exp)"
              style={{ transformOrigin: `${x+barW+gap}px ${H}px`, animation: `fillBar 0.8s ${i*0.08+0.05}s cubic-bezier(.22,.68,0,1) both` }}/>
            <text x={x + barW + gap/2} y={H + 20} textAnchor="middle"
              fill={T.textMuted} fontSize="11" fontFamily="Outfit,sans-serif">{MONTHS[i]}</text>
          </g>
        );
      })}
      <line x1="16" y1={H} x2={W-8} y2={H} stroke={T.glassBorder} strokeWidth="1"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DONUT CHART
───────────────────────────────────────────────────────────────────────────── */
function DonutChart({ data, total, T }) {
  const [hov, setHov] = useState(null);
  let angle = -Math.PI / 2;
  const R = 72, r = 46, cx = 95, cy = 95;
  const slices = data.map((d, idx) => {
    const sweep = (d.value / (total || 1)) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle), y2 = cy + R * Math.sin(angle);
    const ix1 = cx + r * Math.cos(angle - sweep), iy1 = cy + r * Math.sin(angle - sweep);
    const ix2 = cx + r * Math.cos(angle), iy2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix2.toFixed(2)} ${iy2.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${ix1.toFixed(2)} ${iy1.toFixed(2)} Z`;
    return { ...d, path, pct: Math.round((d.value / (total||1)) * 100), idx };
  });
  const active = hov !== null ? slices[hov] : null;
  return (
    <svg viewBox="0 0 190 190" width="170" height="170" style={{ flexShrink: 0 }}>
      <defs>
        {slices.map(s => (
          <filter key={s.idx} id={`glow-${s.idx}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={s.color} floodOpacity="0.7"/>
          </filter>
        ))}
      </defs>
      {slices.map((s) => (
        <path key={s.idx} d={s.path}
          fill={s.color}
          opacity={hov===null || hov===s.idx ? 0.92 : 0.35}
          filter={hov===s.idx ? `url(#glow-${s.idx})` : undefined}
          transform={hov===s.idx ? `translate(${(Math.cos(angle-(Math.PI/2))*4).toFixed(1)},${(Math.sin(angle-(Math.PI/2))*4).toFixed(1)})` : undefined}
          style={{ cursor: "pointer", transition: "opacity .2s, filter .2s" }}
          onMouseEnter={() => setHov(s.idx)}
          onMouseLeave={() => setHov(null)}/>
      ))}
      <circle cx={cx} cy={cy} r={r - 2} fill={T.glass} style={{ backdropFilter: "blur(8px)" }}/>
      {active ? (
        <>
          <text x={cx} y={cy - 10} textAnchor="middle" fill={active.color} fontSize="13" fontWeight="700" fontFamily="Outfit">{active.cat}</text>
          <text x={cx} y={cy + 8}  textAnchor="middle" fill={T.text}       fontSize="16" fontWeight="700" fontFamily="JetBrains Mono,monospace">{fmt(active.value)}</text>
          <text x={cx} y={cy + 24} textAnchor="middle" fill={T.textMuted}  fontSize="11" fontFamily="Outfit">{active.pct}%</text>
        </>
      ) : (
        <>
          <text x={cx} y={cy - 6}  textAnchor="middle" fill={T.text}      fontSize="18" fontWeight="700" fontFamily="JetBrains Mono,monospace">{fmt(total)}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={T.textMuted} fontSize="11" fontFamily="Outfit">total spend</text>
        </>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUMMARY CARD
───────────────────────────────────────────────────────────────────────────── */
function SummaryCard({ label, value, delta, color, spark, icon, idx, T }) {
  const pos = delta >= 0;
  const delayClass = `card-in card-in-${idx}`;
  return (
    <div className={`glass ${delayClass}`} style={{
      background: T.glass, border: `1px solid ${T.glassBorder}`,
      boxShadow: T.cardShadow, padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden"
    }}>
      {/* top shimmer line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,${color}60,transparent)` }}/>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.08em",
            textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{label}</div>
          <div className="mono grad-text" style={{
            fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em",
            background: `linear-gradient(135deg,${color},${color}aa)`
          }}>{value}</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}20`, border: `1px solid ${color}40`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0
        }}>{icon}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {delta !== undefined ? (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 18, height: 18, borderRadius: "50%",
              background: pos ? T.greenDim : T.redDim,
              fontSize: 10, color: pos ? T.green : T.red
            }}>{pos ? "▲" : "▼"}</span>
            <span style={{ fontSize: 12, color: pos ? T.green : T.red, fontWeight: 600 }}>
              {Math.abs(delta)}% vs last mo
            </span>
          </div>
        ) : <div/>}
        {spark && <Sparkline data={spark} color={color} T={T}/>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => { injectGlobalCss(); }, []);

  const [darkMode, setDarkMode]     = useState(true);
  const [tab, setTab]               = useState("overview");
  const [role, setRole]             = useState("viewer");
  const [search, setSearch]         = useState("");
  const [filterType, setFilter]     = useState("all");
  const [filterCat, setFilterCat]   = useState("all");
  const [sortField, setSort]        = useState("date");
  const [sortDir, setSortDir]       = useState("desc");
  const [showAddForm, setShowAdd]   = useState(false);
  const [transactions, setTxns]     = useState(BASE_TRANSACTIONS);
  const [form, setForm]             = useState({ date:"",desc:"",cat:"Food",type:"expense",amt:"" });
  const [editId, setEditId]         = useState(null);
  const [toast, setToast]           = useState(null);

  const C = darkMode ? DARK : LIGHT;
  const isAdmin = role === "admin";

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  /* Scrollbar colour injection */
  useEffect(() => {
    const el = document.getElementById("fin-scrollbar-style") || (() => {
      const s = document.createElement("style"); s.id = "fin-scrollbar-style";
      document.head.appendChild(s); return s;
    })();
    el.textContent = `::-webkit-scrollbar-thumb { background: ${C.scrollbar}; }`;
  }, [darkMode]);

  /* ── Derived ── */
  const juneTxns   = transactions.filter(t => t.date.startsWith("2025-06"));
  const totalIncome  = juneTxns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amt,0);
  const totalExpense = juneTxns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amt,0);
  const balance      = totalIncome - totalExpense;
  const savingsRate  = totalIncome ? Math.round((balance/totalIncome)*100) : 0;

  const catSpend = useMemo(()=>{
    const m={};
    juneTxns.filter(t=>t.type==="expense").forEach(t=>{ m[t.cat]=(m[t.cat]||0)+t.amt; });
    return Object.entries(m).map(([cat,value])=>({cat,value,color:CAT_COLORS[cat]||C.textMuted}))
      .sort((a,b)=>b.value-a.value);
  }, [transactions]);

  const filtered = useMemo(()=>{
    let rows = [...transactions];
    if (search)          rows = rows.filter(t=>t.desc.toLowerCase().includes(search.toLowerCase())||t.cat.toLowerCase().includes(search.toLowerCase()));
    if (filterType!=="all") rows = rows.filter(t=>t.type===filterType);
    if (filterCat!=="all")  rows = rows.filter(t=>t.cat===filterCat);
    rows.sort((a,b)=>{
      let va=sortField==="amt"?a.amt:sortField==="date"?new Date(a.date):a[sortField];
      let vb=sortField==="amt"?b.amt:sortField==="date"?new Date(b.date):b[sortField];
      return sortDir==="asc"?(va>vb?1:-1):(va<vb?1:-1);
    });
    return rows;
  }, [transactions,search,filterType,filterCat,sortField,sortDir]);

  const handleSort = (f) => { if (sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else {setSort(f);setSortDir("desc");} };

  const handleAdd = () => {
    if (!form.date||!form.desc||!form.amt) { showToast("⚠ Please fill all fields"); return; }
    if (editId) {
      setTxns(ts=>ts.map(t=>t.id===editId?{...t,...form,amt:+form.amt}:t));
      showToast("✓ Transaction updated"); setEditId(null);
    } else {
      setTxns(ts=>[{...form,id:Date.now(),amt:+form.amt},...ts]);
      showToast("✓ Transaction added");
    }
    setForm({date:"",desc:"",cat:"Food",type:"expense",amt:""}); setShowAdd(false);
  };

  const handleEdit = (t) => { setForm({date:t.date,desc:t.desc,cat:t.cat,type:t.type,amt:t.amt}); setEditId(t.id); setShowAdd(true); };
  const handleDelete = (id) => { setTxns(ts=>ts.filter(t=>t.id!==id)); showToast("🗑 Transaction deleted"); };

  const exportCSV = () => {
    const rows = filtered.map(t=>`${t.date},"${t.desc}",${t.cat},${t.type},${t.amt}`);
    const blob = new Blob([["Date,Description,Category,Type,Amount",...rows].join("\n")],{type:"text/csv"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="transactions.csv"; a.click();
  };

  /* ── Style helpers ── */
  const glassCard = (extra={}) => ({
    background: C.glass, border: `1px solid ${C.glassBorder}`,
    boxShadow: C.cardShadow, borderRadius: 18, backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)", ...extra
  });

  const inp = {
    background: C.inputBg, border: `1px solid ${C.glassBorder}`,
    color: C.text, borderRadius: 10, padding: "9px 14px",
    fontSize: 13, outline: "none", width: "100%",
    backdropFilter: "blur(8px)", fontFamily: "Outfit,sans-serif",
    transition: "border-color 0.2s"
  };
  const sel = { ...inp, width: "auto", cursor: "pointer", paddingRight: 28 };

  const btn = (bg, col="#fff") => ({
    background: bg, color: col, border: "none",
    borderRadius: 10, padding: "9px 20px", fontSize: 13,
    fontWeight: 600, cursor: "pointer", fontFamily: "Outfit,sans-serif",
    transition: "opacity .15s, transform .15s",
  });
  const btnGhost = {
    background: "transparent", border: `1px solid ${C.glassBorder}`,
    color: C.textSub, borderRadius: 10, padding: "9px 16px",
    fontSize: 13, cursor: "pointer", fontFamily: "Outfit,sans-serif",
    transition: "background .15s, color .15s",
  };

  const juneExpDelta = Math.round(((MONTHLY_EXPENSES[5]-MONTHLY_EXPENSES[4])/MONTHLY_EXPENSES[4])*100);
  const juneIncDelta = Math.round(((MONTHLY_INCOME[5]-MONTHLY_INCOME[4])/MONTHLY_INCOME[4])*100);

  /* ─── OVERVIEW ─── */
  const renderOverview = () => (
    <>
      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:16, marginBottom:24 }}>
        <SummaryCard label="Total Balance"  value={fmt(balance)}      delta={8}           color={C.green}  icon="💰" spark={MONTHLY_INCOME.map((v,i)=>v-MONTHLY_EXPENSES[i])} idx={1} T={C}/>
        <SummaryCard label="Monthly Income" value={fmt(totalIncome)}  delta={juneIncDelta} color={C.accent} icon="📥" spark={MONTHLY_INCOME}  idx={2} T={C}/>
        <SummaryCard label="Expenses"       value={fmt(totalExpense)} delta={juneExpDelta} color={C.red}    icon="📤" spark={MONTHLY_EXPENSES} idx={3} T={C}/>
        <SummaryCard label="Savings Rate"   value={savingsRate+"%"}   delta={3}            color={C.purple} icon="🎯" spark={MONTHLY_INCOME.map((v,i)=>Math.round((v-MONTHLY_EXPENSES[i])/v*100))} idx={4} T={C}/>
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.55fr 1fr", gap:16, marginBottom:24 }}>
        {/* Bar chart card */}
        <div className="glass card-in card-in-5" style={{ ...glassCard(), padding:"24px 28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Income vs Expenses</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>6-month overview</div>
            </div>
            <div style={{ display:"flex", gap:14 }}>
              {[{l:"Income",c:C.green},{l:"Expenses",c:C.red}].map(({l,c})=>(
                <span key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSub }}>
                  <span style={{ width:10,height:10,borderRadius:3,background:c,display:"inline-block" }}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <BarChart income={MONTHLY_INCOME} expenses={MONTHLY_EXPENSES} T={C}/>
        </div>

        {/* Donut card */}
        <div className="glass card-in card-in-5" style={{ ...glassCard(), padding:"24px" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Spending Breakdown</div>
          <div style={{ fontSize:12, color:C.textMuted, marginBottom:16 }}>June 2025</div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <DonutChart data={catSpend} total={totalExpense} T={C}/>
            <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:0, flex:1 }}>
              {catSpend.slice(0,5).map(d => (
                <div key={d.cat} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, minWidth:0 }}>
                    <span style={{ width:7,height:7,borderRadius:"50%",background:d.color,flexShrink:0 }}/>
                    <span style={{ fontSize:12, color:C.textSub, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.cat}</span>
                  </div>
                  <span className="mono" style={{ fontSize:12, fontWeight:600, color:C.text, flexShrink:0 }}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass" style={{ ...glassCard(), padding:"24px 28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Recent Transactions</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>Latest activity in June</div>
          </div>
          <button onClick={()=>setTab("transactions")} style={{ ...btnGhost, fontSize:12 }}>View all →</button>
        </div>
        {juneTxns.slice(0,6).map((t, i) => (
          <div key={t.id} className="txn-row" style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 14px", borderRadius:12, margin:"0 -14px",
            transition:"background .15s",
          }}
            onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHover}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{
                width:40,height:40,borderRadius:12,
                background:`${CAT_COLORS[t.cat]||C.accent}22`,
                border:`1px solid ${CAT_COLORS[t.cat]||C.accent}44`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18
              }}>{CAT_ICONS[t.cat]||"•"}</div>
              <div>
                <div style={{ fontWeight:600, color:C.text, fontSize:14 }}>{t.desc}</div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{fmtDate(t.date)} · {t.cat}</div>
              </div>
            </div>
            <span className="mono" style={{ fontWeight:700, fontSize:15, color:t.type==="income"?C.green:C.red }}>
              {t.type==="income"?"+":"-"}{fmt(t.amt)}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  /* ─── TRANSACTIONS ─── */
  const renderTransactions = () => (
    <>
      {/* Toolbar */}
      <div style={{ ...glassCard(), padding:"16px 20px", marginBottom:16, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1 1 180px", minWidth:160 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15, color:C.textMuted }}>🔍</span>
          <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ ...inp, paddingLeft:36 }}/>
        </div>
        <select value={filterType} onChange={e=>setFilter(e.target.value)} style={sel}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={sel}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <button onClick={exportCSV} style={btnGhost}>⬇ CSV</button>
          {isAdmin && (
            <button className="btn-primary" onClick={()=>{setShowAdd(v=>!v);setEditId(null);setForm({date:"",desc:"",cat:"Food",type:"expense",amt:""});}}
              style={{ ...btn(`linear-gradient(135deg,${C.accent},${C.accentB})`), minWidth:80 }}>
              {showAddForm?"✕ Close":"+ Add"}
            </button>
          )}
        </div>
      </div>

      {/* Add form */}
      {showAddForm && isAdmin && (
        <div className="glass" style={{ ...glassCard(), padding:"20px 24px", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>
            {editId ? "Edit Transaction" : "New Transaction"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10 }}>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}/>
            <input placeholder="Description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={inp}/>
            <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} style={{...sel,width:"100%"}}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{...sel,width:"100%"}}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input type="number" placeholder="Amount" value={form.amt} onChange={e=>setForm({...form,amt:e.target.value})} style={inp}/>
            <button className="btn-primary" onClick={handleAdd}
              style={{ ...btn(`linear-gradient(135deg,${C.green},${C.teal})`), alignSelf:"flex-end" }}>
              {editId ? "Save" : "Add"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ ...glassCard(), padding:"64px 0", textAlign:"center", color:C.textMuted }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
          <div style={{ fontSize:15, fontWeight:600 }}>No transactions found</div>
          <div style={{ fontSize:13, marginTop:6 }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div className="glass" style={{ ...glassCard(), overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:C.surface }}>
                  {[["date","Date"],["desc","Description"],["cat","Category"],["type","Type"],["amt","Amount"]].map(([f,l])=>(
                    <th key={f} onClick={()=>handleSort(f)} style={{
                      padding:"12px 16px", textAlign:"left", fontSize:11,
                      color:C.textMuted, fontWeight:600, letterSpacing:"0.06em",
                      textTransform:"uppercase", whiteSpace:"nowrap",
                      cursor:"pointer", userSelect:"none",
                      borderBottom:`1px solid ${C.glassBorder}`,
                      transition:"color .15s"
                    }}>
                      {l} <span style={{ opacity:0.5 }}>{sortField===f?(sortDir==="asc"?"↑":"↓"):"↕"}</span>
                    </th>
                  ))}
                  {isAdmin && <th style={{ padding:"12px 16px", fontSize:11, color:C.textMuted, fontWeight:600, borderBottom:`1px solid ${C.glassBorder}`, textTransform:"uppercase", letterSpacing:"0.06em" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className="txn-row"
                    onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHover}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    style={{ transition:"background .15s" }}>
                    <td style={{ padding:"13px 16px", color:C.textSub, fontSize:13, borderBottom:`1px solid ${C.glassBorder}40`, whiteSpace:"nowrap" }}>{fmtDate(t.date)}</td>
                    <td style={{ padding:"13px 16px", borderBottom:`1px solid ${C.glassBorder}40` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:16 }}>{CAT_ICONS[t.cat]||"•"}</span>
                        <span style={{ fontWeight:600, color:C.text, fontSize:13 }}>{t.desc}</span>
                      </div>
                    </td>
                    <td style={{ padding:"13px 16px", borderBottom:`1px solid ${C.glassBorder}40` }}>
                      <span style={{
                        background:`${CAT_COLORS[t.cat]||C.accent}22`,
                        color:CAT_COLORS[t.cat]||C.accent,
                        border:`1px solid ${CAT_COLORS[t.cat]||C.accent}44`,
                        borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600
                      }}>{t.cat}</span>
                    </td>
                    <td style={{ padding:"13px 16px", borderBottom:`1px solid ${C.glassBorder}40` }}>
                      <span style={{
                        background:t.type==="income"?C.greenDim:C.redDim,
                        color:t.type==="income"?C.green:C.red,
                        borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600
                      }}>{t.type}</span>
                    </td>
                    <td style={{ padding:"13px 16px", borderBottom:`1px solid ${C.glassBorder}40` }}>
                      <span className="mono" style={{ fontWeight:700, fontSize:14, color:t.type==="income"?C.green:C.red }}>
                        {t.type==="income"?"+":"-"}{fmt(t.amt)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding:"13px 16px", borderBottom:`1px solid ${C.glassBorder}40` }}>
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={()=>handleEdit(t)} style={{ ...btnGhost, padding:"4px 12px", fontSize:12 }}>Edit</button>
                          <button onClick={()=>handleDelete(t.id)} style={{ ...btnGhost, padding:"4px 12px", fontSize:12, color:C.red, borderColor:`${C.red}44` }}>Del</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"12px 20px", color:C.textMuted, fontSize:12, borderTop:`1px solid ${C.glassBorder}` }}>
            Showing {filtered.length} of {transactions.length} records
          </div>
        </div>
      )}
    </>
  );

  /* ─── INSIGHTS ─── */
  const renderInsights = () => {
    const avgExp = Math.round(MONTHLY_EXPENSES.reduce((s,v)=>s+v,0)/6);
    const savings = MONTHLY_INCOME.map((v,i)=>v-MONTHLY_EXPENSES[i]);
    const bestIdx = savings.indexOf(Math.max(...savings));
    const topCat = catSpend[0];
    const expDelta = Math.round(((MONTHLY_EXPENSES[5]-MONTHLY_EXPENSES[4])/MONTHLY_EXPENSES[4])*100);

    const insightCards = [
      { icon:"🏆", label:"Top spending category", value:topCat?.cat||"—", sub:`${fmt(topCat?.value||0)} in June`, color:C.red },
      { icon:"⭐", label:"Best savings month",     value:MONTHS[bestIdx],  sub:`${fmt(savings[bestIdx])} saved`,   color:C.green },
      { icon:"📊", label:"Avg monthly expenses",   value:fmt(avgExp),       sub:"Over 6 months",                   color:C.amber },
      { icon:"📈", label:"MoM expense change",     value:`${expDelta>0?"+":""}${expDelta}%`, sub:"vs May 2025",   color:expDelta>0?C.red:C.green },
    ];

    return (
      <>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:16, marginBottom:24 }}>
          {insightCards.map((card, i) => (
            <div key={i} className={`glass card-in card-in-${i+1}`} style={{
              ...glassCard(), padding:"22px 24px",
              borderTop:`2px solid ${card.color}60`, position:"relative", overflow:"hidden"
            }}>
              <div style={{ position:"absolute", top:-30, right:-20, fontSize:64, opacity:.06, pointerEvents:"none" }}>{card.icon}</div>
              <div style={{ fontSize:24, marginBottom:10 }}>{card.icon}</div>
              <div style={{ fontSize:11, color:C.textMuted, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600, marginBottom:6 }}>{card.label}</div>
              <div className="mono" style={{ fontSize:22, fontWeight:700, color:card.color }}>{card.value}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:6 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ ...glassCard(), padding:"24px 28px" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Category Breakdown</div>
          <div style={{ fontSize:12, color:C.textMuted, marginBottom:22 }}>June 2025 — spending by category</div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {catSpend.map(d => {
              const pct = Math.round((d.value/totalExpense)*100);
              return (
                <div key={d.cat}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:16 }}>{CAT_ICONS[d.cat]||"•"}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{d.cat}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span className="mono" style={{ fontSize:13, color:C.textSub }}>{fmt(d.value)}</span>
                      <span style={{ fontSize:12, color:d.color, fontWeight:700, minWidth:34, textAlign:"right" }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height:7, background:C.surface, borderRadius:99, overflow:"hidden" }}>
                    <div className="bar-fill" style={{
                      height:"100%", width:`${pct}%`, borderRadius:99,
                      background:`linear-gradient(90deg,${d.color},${d.color}99)`,
                      boxShadow:`0 0 8px ${d.color}55`
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  /* ─── NAV TABS ─── */
  const tabs = [["overview","Overview","📊"],["transactions","Transactions","📋"],["insights","Insights","💡"]];

  /* ─── RENDER ─── */
  return (
    <div className="fin-app" style={{ background:`linear-gradient(135deg,${C.bg1} 0%,${C.bg2} 50%,${C.bg3} 100%)`, color:C.text, position:"relative" }}>
      {/* Animated orbs */}
      <div className="orb orb1" style={{ background:`radial-gradient(circle,${C.orb1}55,transparent 70%)` }}/>
      <div className="orb orb2" style={{ background:`radial-gradient(circle,${C.orb2}44,transparent 70%)` }}/>
      <div className="orb orb3" style={{ background:`radial-gradient(circle,${C.orb3}33,transparent 70%)` }}/>

      {/* Navbar */}
      <nav style={{
        background:C.navBg, backdropFilter:"blur(20px) saturate(180%)",
        WebkitBackdropFilter:"blur(20px) saturate(180%)",
        borderBottom:`1px solid ${C.glassBorder}`,
        padding:"0 28px", display:"flex", alignItems:"center",
        justifyContent:"space-between", height:60,
        position:"sticky", top:0, zIndex:100,
      }}>
        {/* Brand */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:`linear-gradient(135deg,${C.accent},${C.accentB})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, boxShadow:`0 4px 14px ${C.accent}55`
          }}>💹</div>
          <div>
            <span className="grad-text" style={{
              fontSize:17, fontWeight:800, letterSpacing:"-0.03em",
              background:C.gradText
            }}>FinanceOS</span>
            <span style={{ fontSize:10, color:C.textMuted, marginLeft:8, fontWeight:500 }}>PREMIUM</span>
          </div>
        </div>

        {/* Tabs (desktop) */}
        <div style={{ display:"flex", gap:2 }}>
          {tabs.map(([k,l,ic])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              background:tab===k?C.surface:"transparent",
              color:tab===k?C.text:C.textMuted,
              border:"none", borderRadius:10, padding:"7px 18px",
              fontSize:13, fontWeight:tab===k?700:500,
              cursor:"pointer", display:"flex", alignItems:"center", gap:6,
              transition:"all .18s", position:"relative",
            }}>
              <span>{ic}</span>{l}
              {tab===k&&<div style={{ position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",width:20,height:2,borderRadius:2,background:`linear-gradient(90deg,${C.accent},${C.accentB})` }}/>}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Dark/light toggle */}
          <button onClick={()=>setDarkMode(v=>!v)} style={{
            background:C.surface, border:`1px solid ${C.glassBorder}`,
            borderRadius:99, padding:"6px 12px", cursor:"pointer",
            display:"flex", alignItems:"center", gap:6, fontSize:13, color:C.textSub,
            transition:"all .2s"
          }}>
            <span style={{ fontSize:15 }}>{darkMode?"☀️":"🌙"}</span>
            <span style={{ fontWeight:500 }}>{darkMode?"Light":"Dark"}</span>
          </button>

          {/* Role badge */}
          <div style={{
            background:isAdmin?`${C.purple}22`:`${C.accent}18`,
            border:`1px solid ${isAdmin?C.purple:C.accent}44`,
            borderRadius:8, padding:"4px 10px",
            fontSize:11, fontWeight:700,
            color:isAdmin?C.purple:C.accent, letterSpacing:"0.05em"
          }}>
            {isAdmin?"⚡ ADMIN":"👁 VIEWER"}
          </div>

          {/* Role select */}
          <div style={{ position:"relative" }}>
            <select value={role} onChange={e=>setRole(e.target.value)} style={{ ...sel, paddingRight:28, fontSize:12 }}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <span style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fontSize:10,color:C.textMuted }}>▼</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth:1160, margin:"0 auto", padding:"28px 20px", position:"relative", zIndex:1 }}>
        {/* Page header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.2 }}>
            <span className="grad-text" style={{ background:C.gradText }}>
              {tab==="overview"?"Dashboard Overview":tab==="transactions"?"All Transactions":"Spending Insights"}
            </span>
          </h1>
          <p style={{ color:C.textMuted, fontSize:13, marginTop:6 }}>
            {isAdmin
              ? "Admin mode — full edit access enabled."
              : "Viewer mode — read-only. Switch to Admin for full control."}
            <span style={{ marginLeft:12, background:`${C.green}18`, color:C.green,
              borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
              <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%",
                background:C.green, marginRight:5, animation:"pulseDot 1.8s infinite" }}/>
              Live
            </span>
          </p>
        </div>

        {tab==="overview"     && renderOverview()}
        {tab==="transactions" && renderTransactions()}
        {tab==="insights"     && renderInsights()}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fin-toast" style={{
          position:"fixed", bottom:28, right:24,
          background:C.glass, border:`1px solid ${C.glassBorder}`,
          backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          color:C.text, padding:"13px 22px", borderRadius:12,
          fontSize:13, fontWeight:600, zIndex:999,
          boxShadow:C.cardShadow,
        }}>{toast}</div>
      )}
    </div>
  );
}




