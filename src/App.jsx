import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── SVG ICON LIBRARY ─────────────────────────────────────────────────────────
const I = ({ n, size = 16, color = "currentColor", style = {} }) => {
  const d = {
    elevator: <><rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.5" fill="none" /><line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" /><polyline points="9,8 12,5 15,8" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" /><polyline points="9,16 12,19 15,16" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none" /></>,
    wrench: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="1.5" fill="none" /></>,
    chart: <><polyline points="3 17 8 12 13 15 21 7" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /><line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.2" /></>,
    reports: <><rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none" /><line x1="7" y1="8" x2="17" y2="8" stroke={color} strokeWidth="1.4" strokeLinecap="round" /><line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1.4" strokeLinecap="round" /><line x1="7" y1="16" x2="13" y2="16" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="1.5" fill="none" /><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="17" r="0.8" fill={color} /></>,
    check: <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
    play: <><polygon points="5 3 19 12 5 21 5 3" stroke={color} strokeWidth="1.5" fill={color} strokeLinejoin="round" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" /></>,
    chevLeft: <><polyline points="15 18 9 12 15 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    chevRight: <><polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    chevDown: <><polyline points="6 9 12 15 18 9" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    chevUp: <><polyline points="18 15 12 9 6 15" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.5" fill="none" /><circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" fill="none" /></>,
    admin: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="1.5" fill="none" /></>,
    tech: <><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none" /><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.3" /></>,
    mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="1.5" fill="none" /><circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" fill="none" /></>,
    speed: <><path d="M12 2a10 10 0 1 0 10 10" stroke={color} strokeWidth="1.5" fill="none" /><line x1="12" y1="12" x2="16" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="12" r="2" fill={color} /></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" stroke={color} strokeWidth="1.5" fill="none" /><polyline points="2 17 12 22 22 17" stroke={color} strokeWidth="1.5" fill="none" /><polyline points="2 12 12 17 22 12" stroke={color} strokeWidth="1.5" fill="none" /></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    dot: <><circle cx="12" cy="12" r="4" fill={color} /></>,
    building: <><rect x="3" y="2" width="18" height="20" rx="1" stroke={color} strokeWidth="1.5" fill="none" /><line x1="3" y1="8" x2="21" y2="8" stroke={color} strokeWidth="1.2" /><rect x="8" y="12" width="3" height="3" stroke={color} strokeWidth="1.2" fill="none" /><rect x="13" y="12" width="3" height="3" stroke={color} strokeWidth="1.2" fill="none" /><rect x="9" y="18" width="6" height="4" stroke={color} strokeWidth="1.2" fill="none" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.5" fill="none" /><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...style }}>{d[n]}</svg>;
};

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = ({ collapsed = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    {/* SVG Logo Mark */}
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
      {/* Shaft */}
      <rect x="18" y="6" width="4" height="28" rx="1" fill="rgba(255,255,255,0.15)" />
      {/* Cabin */}
      <rect x="13" y="14" width="14" height="10" rx="2" fill="white" />
      {/* Arrow up */}
      <polyline points="17,18 20,15 23,18" stroke="#1d4ed8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrow down */}
      <polyline points="17,22 20,25 23,22" stroke="#1d4ed8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Rail lines */}
      <line x1="15" y1="6" x2="15" y2="38" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="25" y1="6" x2="25" y2="38" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
    </svg>
    {!collapsed && (
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em", color: "#f1f5f9", lineHeight: 1.1 }}>
          ELEVATOR<span style={{ color: "#818cf8", fontWeight: 300 }}>PRO</span>
        </div>
        <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.2em", fontFamily: "'Outfit', sans-serif", fontWeight: 400, marginTop: 2 }}>
          GESTIÓN DE ASCENSORES
        </div>
      </div>
    )}
  </div>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ELEVATORS = [
  { id: 1, name: "Ascensor A", building: "Torre Costanera", floors: 32, currentFloor: 18, status: "operativo", brand: "ThyssenKrupp", model: "Synergy 300", serial: "TK-2021-001", lastMaint: "2024-11-15", nextMaint: "2025-02-15", technician: "Roberto Silva", load: 72, speed: 2.5, trips: 1243, location: "Santiago Centro" },
  { id: 2, name: "Ascensor B", building: "Hospital San José", floors: 8, currentFloor: 3, status: "mantencion", brand: "Otis", model: "Gen2", serial: "OT-2019-051", lastMaint: "2024-12-01", nextMaint: "2025-01-01", technician: "Juan Pérez", load: 0, speed: 0, trips: 5821, location: "Independencia" },
  { id: 3, name: "Ascensor C", building: "Mall Plaza Oriente", floors: 5, currentFloor: 2, status: "operativo", brand: "Kone", model: "MonoSpace 500", serial: "KN-2020-112", lastMaint: "2024-10-20", nextMaint: "2025-01-20", technician: "María Torres", load: 45, speed: 1.6, trips: 9102, location: "Las Condes" },
  { id: 4, name: "Ascensor D", building: "Torre Central", floors: 20, currentFloor: 20, status: "alerta", brand: "Schindler", model: "3300", serial: "SC-2018-033", lastMaint: "2024-09-10", nextMaint: "2024-12-10", technician: "Carlos Muñoz", load: 60, speed: 1.8, trips: 14320, location: "Providencia" },
  { id: 5, name: "Ascensor E", building: "Clínica Las Condes", floors: 12, currentFloor: 7, status: "operativo", brand: "Mitsubishi", model: "NEXWAY", serial: "MT-2022-077", lastMaint: "2024-11-28", nextMaint: "2025-02-28", technician: "Ana Rivas", load: 88, speed: 2.0, trips: 3210, location: "Las Condes" },
  { id: 6, name: "Ascensor F", building: "Parque Arauco", floors: 4, currentFloor: 1, status: "fuera", brand: "OTIS", model: "Infinity", serial: "OT-2017-009", lastMaint: "2024-08-01", nextMaint: "2024-11-01", technician: "Pedro López", load: 0, speed: 0, trips: 22100, location: "Las Condes" },
];

const MAINTENANCES_INIT = [
  {
    id: 1, elevatorId: 2, type: "correctiva", status: "en_progreso", title: "Falla en sistema de puertas", building: "Hospital San José", technician: "Juan Pérez", date: "2024-12-03",
    checklist: [{ item: "Revisión motor puerta", done: true }, { item: "Calibración sensores", done: true }, { item: "Test apertura/cierre", done: true }, { item: "Revisión cables", done: false }, { item: "Limpieza rieles", done: false }, { item: "Lubricación guías", done: false }, { item: "Test de seguridad", done: false }, { item: "Documentación técnica", done: false }, { item: "Revisión final", done: false }, { item: "Firma del técnico", done: false }]
  },
  { id: 2, elevatorId: 6, type: "correctiva", status: "programada", title: "Reparación — Equipo fuera de servicio", building: "Parque Arauco", technician: "Pedro López", date: "2024-12-04", checklist: Array(10).fill(0).map((_, i) => ({ item: `Tarea de reparación ${i + 1}`, done: false })) },
  { id: 3, elevatorId: 1, type: "preventiva", status: "programada", title: "Mantención preventiva mensual", building: "Torre Costanera", technician: "Roberto Silva", date: "2025-02-15", checklist: Array(10).fill(0).map((_, i) => ({ item: `Revisión preventiva ${i + 1}`, done: false })) },
  { id: 4, elevatorId: 3, type: "preventiva", status: "completada", title: "Mantención preventiva trimestral", building: "Mall Plaza Oriente", technician: "María Torres", date: "2024-10-20", checklist: Array(10).fill(0).map((_, i) => ({ item: `Revisión ${i + 1}`, done: true })) },
];

const MONTHLY = [
  { mes: "Jul", mantenciones: 4, alertas: 1, operativos: 5 }, { mes: "Ago", mantenciones: 6, alertas: 2, operativos: 5 },
  { mes: "Sep", mantenciones: 3, alertas: 0, operativos: 6 }, { mes: "Oct", mantenciones: 7, alertas: 3, operativos: 4 },
  { mes: "Nov", mantenciones: 5, alertas: 1, operativos: 5 }, { mes: "Dic", mantenciones: 8, alertas: 2, operativos: 3 },
];

const SC = {
  operativo: { label: "Operativo", color: "#34d399", bg: "rgba(52,211,153,0.08)", glow: "rgba(52,211,153,0.3)" },
  mantencion: { label: "En Mantención", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", glow: "rgba(251,191,36,0.3)" },
  alerta: { label: "Alerta", color: "#f87171", bg: "rgba(248,113,113,0.08)", glow: "rgba(248,113,113,0.3)" },
  fuera: { label: "Fuera de Servicio", color: "#94a3b8", bg: "rgba(148,163,184,0.06)", glow: "rgba(148,163,184,0.2)" },
};

// ─── RIPPLE BUTTON ─────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", small = false, disabled = false, style = {} }) {
  const [ripples, setRipples] = useState([]);
  const [pressed, setPressed] = useState(false);
  const ref = useRef(null);

  const V = {
    primary: { bg: "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", shadow: "0 4px 20px rgba(79,70,229,0.45), inset 0 1px 0 rgba(255,255,255,0.12)" },
    success: { bg: "linear-gradient(135deg,#065f46,#10b981)", color: "#fff", border: "none", shadow: "0 4px 20px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.12)" },
    danger: { bg: "linear-gradient(135deg,#991b1b,#ef4444)", color: "#fff", border: "none", shadow: "0 4px 20px rgba(239,68,68,0.4),  inset 0 1px 0 rgba(255,255,255,0.12)" },
    amber: { bg: "linear-gradient(135deg,#92400e,#f59e0b)", color: "#fff", border: "none", shadow: "0 4px 20px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.12)" },
    ghost: { bg: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", shadow: "none" },
    outline: { bg: "transparent", color: "#818cf8", border: "1px solid rgba(129,140,248,0.35)", shadow: "none" },
  }[variant] || {};

  const fire = e => {
    if (disabled) return;
    const r = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples(p => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples(p => p.filter(rr => rr.id !== id)), 650);
    onClick && onClick(e);
  };

  return (
    <button ref={ref} onClick={fire}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      disabled={disabled}
      style={{
        position: "relative", overflow: "hidden", cursor: disabled ? "not-allowed" : "pointer",
        padding: small ? "7px 16px" : "10px 22px",
        background: disabled ? "rgba(255,255,255,0.03)" : V.bg,
        color: disabled ? "#334155" : V.color,
        border: V.border, borderRadius: 10,
        fontSize: small ? 11 : 13,
        fontWeight: 600, letterSpacing: "0.04em",
        fontFamily: "'Outfit', sans-serif",
        boxShadow: disabled ? "none" : V.shadow,
        transform: pressed ? "scale(0.955) translateY(1px)" : "scale(1)",
        transition: "transform 0.1s ease, box-shadow 0.2s ease, filter 0.15s ease",
        filter: pressed ? "brightness(0.86)" : "brightness(1)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        userSelect: "none", ...style,
      }}>
      {ripples.map(r => (
        <span key={r.id} style={{
          position: "absolute", left: r.x - 60, top: r.y - 60,
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          transform: "scale(0)", animation: "rpl 0.65s ease-out forwards", pointerEvents: "none",
        }} />
      ))}
      {children}
    </button>
  );
}

// ─── ELEVATOR SHAFT ────────────────────────────────────────────────────────────
function Shaft({ elev, large = false }) {
  const [floor, setFloor] = useState(elev.currentFloor);
  const [moving, setMoving] = useState(false);
  const maxF = Math.min(elev.floors, large ? 14 : 10);
  const fh = large ? 32 : 27;
  const H = maxF * fh;
  const cfg = SC[elev.status];
  const cabY = H - (floor / elev.floors) * H - fh;

  useEffect(() => {
    if (elev.status !== "operativo") return;
    const t = setInterval(() => {
      const next = Math.floor(Math.random() * elev.floors) + 1;
      setMoving(true);
      setTimeout(() => { setFloor(next); setMoving(false); }, 2200);
    }, 4500);
    return () => clearInterval(t);
  }, [elev.status, elev.floors]);

  const w = large ? 66 : 48;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{ fontSize: 10, color: cfg.color, fontFamily: "'Roboto Mono', monospace", letterSpacing: 2, fontWeight: 600 }}>
        {String(floor).padStart(2, "0")} / {String(elev.floors).padStart(2, "0")}
      </div>
      <div style={{ position: "relative", width: w, height: H, background: "linear-gradient(180deg,rgba(0,0,0,0.55),rgba(5,10,22,0.75))", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden", boxShadow: "inset 0 0 18px rgba(0,0,0,0.5)" }}>
        {Array.from({ length: maxF }).map((_, i) => (
          <div key={i} style={{ position: "absolute", width: "100%", height: 1, background: i % 5 === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.025)", bottom: i * fh }} />
        ))}
        <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
        <div style={{ position: "absolute", right: 7, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
        <div style={{ position: "absolute", width: 1.5, background: `linear-gradient(180deg,${cfg.color}66,transparent)`, left: "50%", transform: "translateX(-50%)", top: 0, height: Math.max(0, cabY + 4), transition: "height 2.2s cubic-bezier(0.4,0,0.2,1)" }} />
        <div style={{
          position: "absolute", left: 9, right: 9, height: fh - 5,
          background: elev.status === "operativo" ? "linear-gradient(135deg,#1e3a5f,#1d4ed8)" : elev.status === "mantencion" ? "linear-gradient(135deg,#78350f,#b45309)" : elev.status === "alerta" ? "linear-gradient(135deg,#7f1d1d,#dc2626)" : "linear-gradient(135deg,#1c2433,#374151)",
          borderRadius: 3, bottom: cabY,
          transition: "bottom 2.2s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 16px ${cfg.glow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <I n="elevator" size={large ? 14 : 11} color="rgba(255,255,255,0.7)" />
        </div>
        {moving && <div style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%", background: "#34d399", animation: "blink 0.45s infinite alternate" }} />}
      </div>
      <div style={{ fontSize: 9, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}28`, borderRadius: 20, padding: "2px 10px", fontWeight: 600, letterSpacing: "0.12em", fontFamily: "'Outfit', sans-serif" }}>
        {cfg.label.toUpperCase()}
      </div>
    </div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, sub }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "linear-gradient(145deg,#080e1c,#0d1628)",
      border: `1px solid ${hov ? color + "40" : color + "16"}`,
      borderRadius: 16, padding: "22px 24px",
      position: "relative", overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      transform: hov ? "translateY(-4px)" : "translateY(0)",
      boxShadow: hov ? `0 18px 38px ${color}16` : "0 2px 8px rgba(0,0,0,0.35)",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, opacity: hov ? 0.08 : 0.04, transition: "opacity 0.3s", transform: hov ? "scale(1.2)" : "scale(1)" }}>
        <I n={icon} size={72} color={color} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: `linear-gradient(90deg,transparent,${color})`, transition: "width 0.45s ease", width: hov ? "100%" : "0%", borderRadius: "0 0 16px 16px" }} />
      <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 46, fontWeight: 700, color, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#334155", marginTop: 8, fontFamily: "'Outfit', sans-serif" }}>{sub}</div>}
    </div>
  );
}

// ─── ELEVATOR CARD ─────────────────────────────────────────────────────────────
function ElevCard({ elev, onClick }) {
  const [hov, setHov] = useState(false);
  const cfg = SC[elev.status];
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onClick(elev)} style={{
      background: "linear-gradient(145deg,#080e1c,#0d1628)",
      border: `1px solid ${hov ? cfg.color + "50" : cfg.color + "1a"}`,
      borderRadius: 18, padding: 22, cursor: "pointer",
      transform: hov ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
      boxShadow: hov ? `0 24px 50px ${cfg.glow}, 0 0 0 1px ${cfg.color}0d` : "0 2px 10px rgba(0,0,0,0.4)",
      transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle,${cfg.color}0f,transparent 70%)`, opacity: hov ? 1 : 0.5, transition: "opacity 0.3s" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,${cfg.color}77,transparent)`, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.02em", marginBottom: 3 }}>{elev.name}</div>
          <div style={{ fontSize: 12, color: "#475569", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            <I n="building" size={11} color="#334155" /> {elev.building}
          </div>
        </div>
        <div style={{ background: cfg.bg, border: `1px solid ${cfg.color}38`, borderRadius: 8, padding: "4px 12px", fontSize: 10, color: cfg.color, fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif", boxShadow: hov ? `0 0 12px ${cfg.glow}` : "none", transition: "box-shadow 0.3s" }}>
          {cfg.label.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: "#1e3a5f", marginBottom: 14, fontFamily: "'Outfit', sans-serif" }}>{elev.brand} · {elev.model}</div>
          <div style={{ display: "flex", gap: 20 }}>
            {[["CARGA", `${elev.load}%`, cfg.color], ["PISOS", elev.floors, "#64748b"], ["VIAJES", elev.trips.toLocaleString(), "#64748b"]].map(([lbl, val, clr]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: clr, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 9, color: "#1e3a5f", letterSpacing: "0.15em", marginTop: 3, fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <Shaft elev={elev} />
      </div>
    </div>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────────
function Modal({ elev, onClose }) {
  const cfg = SC[elev.status];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", border: `1px solid ${cfg.color}30`, borderRadius: 22, padding: 32, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: `0 48px 96px rgba(0,0,0,0.8), 0 0 48px ${cfg.glow}`, animation: "slideUp 0.32s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.03em" }}>{elev.name}</div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 4, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
              <I n="mapPin" size={12} color="#475569" /> {elev.building} · {elev.location}
            </div>
          </div>
          <Btn variant="ghost" small onClick={onClose}><I n="x" size={14} color="#94a3b8" /></Btn>
        </div>

        <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
          <Shaft elev={elev} large />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              ["Marca", elev.brand, "layers"],
              ["Modelo", elev.model, "layers"],
              ["N° Serie", elev.serial, "reports"],
              ["Técnico", elev.technician, "tech"],
              ["Velocidad", `${elev.speed} m/s`, "speed"],
              ["Total viajes", elev.trips.toLocaleString(), "activity"],
            ].map(([k, v, ic]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", background: "rgba(255,255,255,0.025)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 11, color: "#475569", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                  <I n={ic} size={11} color="#334155" /> {k}
                </span>
                <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", fontFamily: "'Outfit', sans-serif" }}>CARGA DEL SISTEMA</span>
            <span style={{ fontSize: 13, color: cfg.color, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{elev.load}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${elev.load}%`, background: `linear-gradient(90deg,${cfg.color}55,${cfg.color})`, borderRadius: 4, boxShadow: `0 0 10px ${cfg.glow}`, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Última mantención", elev.lastMaint, "wrench"], ["Próxima mantención", elev.nextMaint, "calendar"]].map(([l, v, ic]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 6, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                <I n={ic} size={11} color="#334155" /> {l}
              </div>
              <div style={{ fontSize: 15, color: "#f1f5f9", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAINTENANCE CARD ──────────────────────────────────────────────────────────
function MaintCard({ maint, onUpdate }) {
  const [open, setOpen] = useState(false);
  const done = maint.checklist.filter(c => c.done).length;
  const pct = Math.round(done / maint.checklist.length * 100);
  const tc = maint.type === "preventiva" ? "#60a5fa" : "#f87171";
  const sc = { en_progreso: "#fbbf24", completada: "#34d399", programada: "#94a3b8" }[maint.status];
  const sl = { en_progreso: "En Progreso", completada: "Completada", programada: "Programada" }[maint.status];

  return (
    <div style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: 22 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[[tc, maint.type], [sc, sl]].map(([c, lbl]) => (
            <span key={lbl} style={{ fontSize: 10, background: `${c}12`, color: c, border: `1px solid ${c}28`, borderRadius: 6, padding: "3px 11px", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif" }}>{lbl.toUpperCase()}</span>
          ))}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{maint.title}</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#475569", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            <I n="building" size={11} color="#334155" /> {maint.building}
          </div>
          <div style={{ fontSize: 12, color: "#475569", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            <I n="tech" size={11} color="#334155" /> {maint.technician}
          </div>
          <div style={{ fontSize: 12, color: "#475569", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            <I n="calendar" size={11} color="#334155" /> {maint.date}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "#334155", letterSpacing: "0.12em", fontFamily: "'Outfit', sans-serif" }}>CHECKLIST DE VERIFICACIÓN</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#34d399" : "#f1f5f9", fontFamily: "'Outfit', sans-serif" }}>{done} / {maint.checklist.length}</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "linear-gradient(90deg,#065f46,#34d399)" : "linear-gradient(90deg,#1e3a8a,#6366f1)", borderRadius: 3, transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: pct === 100 ? "0 0 10px rgba(52,211,153,0.45)" : "0 0 10px rgba(99,102,241,0.4)" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setOpen(!open)} style={{ flex: 1 }}>
            <I n={open ? "chevUp" : "chevDown"} size={14} color="#64748b" />
            {open ? "Cerrar verificación" : "Ver verificación"}
          </Btn>
          {maint.status === "programada" && <Btn variant="primary" onClick={() => onUpdate(maint.id, "iniciar")} style={{ flex: 1 }}><I n="play" size={13} color="#fff" /> Iniciar</Btn>}
          {maint.status === "en_progreso" && <Btn variant="success" onClick={() => onUpdate(maint.id, "completar")} style={{ flex: 1 }}><I n="check" size={14} color="#fff" /> Completar</Btn>}
          {maint.status === "completada" && <Btn variant="ghost" disabled style={{ flex: 1, opacity: 0.4 }}><I n="check" size={14} color="#34d399" /> Finalizada</Btn>}
        </div>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "4px 22px 22px" }}>
          <div style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            {maint.checklist.map((item, idx) => (
              <div key={idx} onClick={() => onUpdate(maint.id, "toggle", idx)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: item.done ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)",
                borderRadius: 10, cursor: "pointer",
                border: `1px solid ${item.done ? "rgba(52,211,153,0.16)" : "rgba(255,255,255,0.04)"}`,
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  background: item.done ? "linear-gradient(135deg,#065f46,#34d399)" : "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${item.done ? "#34d399" : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: item.done ? "0 0 10px rgba(52,211,153,0.4)" : "none",
                  transform: item.done ? "scale(1.08)" : "scale(1)",
                }}>
                  {item.done && <I n="check" size={10} color="#fff" />}
                </div>
                <span style={{ fontSize: 13, color: item.done ? "#6ee7b7" : "#64748b", textDecoration: item.done ? "line-through" : "none", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s" }}>{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION TITLE ─────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 500, color: "#1e3a5f", letterSpacing: "0.18em", marginBottom: 16, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
      {children}
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [selected, setSelected] = useState(null);
  const [maints, setMaints] = useState(MAINTENANCES_INIT);
  const [elevs, setElevs] = useState(ELEVATORS);
  const [filter, setFilter] = useState("todos");
  const [sideOpen, setSideOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notif, setNotif] = useState(null);
  const [nm, setNm] = useState({ title: "", building: "", technician: "", type: "preventiva", date: "" });

  const ops = elevs.filter(e => e.status === "operativo").length;
  const mant = elevs.filter(e => e.status === "mantencion").length;
  const alrt = elevs.filter(e => e.status === "alerta").length;
  const fuera = elevs.filter(e => e.status === "fuera").length;

  const toast = (msg, color = "#34d399") => { setNotif({ msg, color }); setTimeout(() => setNotif(null), 3200); };

  const updateMaint = (id, action, idx) => setMaints(prev => prev.map(m => {
    if (m.id !== id) return m;
    if (action === "toggle") { const cl = [...m.checklist]; cl[idx] = { ...cl[idx], done: !cl[idx].done }; return { ...m, checklist: cl }; }
    if (action === "iniciar") { toast("Mantención iniciada correctamente."); return { ...m, status: "en_progreso" }; }
    if (action === "completar") { toast("Mantención completada con éxito."); setElevs(p => p.map(e => e.id === m.elevatorId ? { ...e, status: "operativo" } : e)); return { ...m, status: "completada" }; }
    return m;
  }));

  const addMaint = () => {
    if (!nm.title || !nm.building) return;
    setMaints(p => [{ id: Date.now(), elevatorId: 1, type: nm.type, status: "programada", title: nm.title, building: nm.building, technician: nm.technician || "Sin asignar", date: nm.date || "2025-01-01", checklist: Array(10).fill(0).map((_, i) => ({ item: `Tarea ${i + 1}`, done: false })) }, ...p]);
    setShowForm(false); setNm({ title: "", building: "", technician: "", type: "preventiva", date: "" });
    toast("Mantención registrada correctamente.");
  };

  const filteredElevs = filter === "todos" ? elevs : elevs.filter(e => e.status === filter);
  const pieData = [{ name: "Operativos", value: ops, color: "#34d399" }, { name: "Mantención", value: mant, color: "#fbbf24" }, { name: "Alerta", value: alrt, color: "#f87171" }, { name: "Fuera", value: fuera, color: "#94a3b8" }];
  const NAV = role === "admin"
    ? [{ id: "dashboard", icon: "dashboard", lbl: "Panel General" }, { id: "elevadores", icon: "elevator", lbl: "Ascensores" }, { id: "mantenciones", icon: "wrench", lbl: "Mantenciones" }, { id: "informes", icon: "reports", lbl: "Informes" }]
    : [{ id: "dashboard", icon: "dashboard", lbl: "Mi Panel" }, { id: "mantenciones", icon: "wrench", lbl: "Mis Tareas" }, { id: "elevadores", icon: "elevator", lbl: "Equipos" }];

  const inp = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif", transition: "border-color 0.2s" };

  const viewTitles = { dashboard: role === "admin" ? "Panel General" : "Mi Panel", elevadores: "Ascensores", mantenciones: role === "admin" ? "Mantenciones" : "Mis Tareas", informes: "Informes" };

  return (
    <div style={{ minHeight: "100vh", background: "#050a14", color: "#f1f5f9", fontFamily: "'Outfit','Segoe UI',sans-serif", display: "flex", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1a263d;border-radius:2px}
        @keyframes rpl     {to{transform:scale(4);opacity:0}}
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        @keyframes slideUp {from{opacity:0;transform:translateY(26px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes blink   {from{opacity:1}to{opacity:0.1}}
        @keyframes toastIn {from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse   {0%,100%{opacity:1}50%{opacity:0.55}}
        input::placeholder{color:#1e3a5f}
        input:focus{border-color:rgba(99,102,241,0.45)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1)!important}
      `}</style>

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.008) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.008) 1px,transparent 1px)", backgroundSize: "56px 56px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "8%", left: "18%", width: 700, height: 700, background: "radial-gradient(circle,rgba(30,64,175,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "8%", right: "12%", width: 550, height: 550, background: "radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 65%)", pointerEvents: "none" }} />

      {/* ── SIDEBAR ── */}
      <div style={{ width: sideOpen ? 240 : 68, minHeight: "100vh", background: "linear-gradient(180deg,#030810 0%,#060c18 100%)", borderRight: "1px solid rgba(255,255,255,0.04)", transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0, zIndex: 100, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Logo */}
        <div style={{ padding: sideOpen ? "22px 18px 18px" : "22px 14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "padding 0.3s" }}>
          <Logo collapsed={!sideOpen} />
        </div>

        {/* Role toggle */}
        <div style={{ padding: "14px 11px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {sideOpen ? (
            <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
              {["admin", "tecnico"].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "7px 0", border: "none", borderRadius: 8, cursor: "pointer", background: r === role ? "linear-gradient(135deg,#1e3a8a,#4f46e5)" : "transparent", color: r === role ? "#fff" : "#334155", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", transition: "all 0.25s", fontFamily: "'Outfit',sans-serif" }}>
                  {r === "admin" ? "ADMINISTRADOR" : "TÉCNICO"}
                </button>
              ))}
            </div>
          ) : (
            <div onClick={() => setRole(r => r === "admin" ? "tecnico" : "admin")} title={role === "admin" ? "Administrador" : "Técnico"} style={{ width: 42, height: 42, background: role === "admin" ? "rgba(79,70,229,0.12)" : "rgba(251,191,36,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <I n={role === "admin" ? "admin" : "tech"} size={17} color={role === "admin" ? "#818cf8" : "#fbbf24"} />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {NAV.map(item => {
            const act = view === item.id;
            return (
              <div key={item.id} onClick={() => { setView(item.id); setSideOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 11px", borderRadius: 11, cursor: "pointer", marginBottom: 3, background: act ? "linear-gradient(135deg,rgba(30,58,138,0.45),rgba(79,70,229,0.22))" : "transparent", border: act ? "1px solid rgba(79,70,229,0.28)" : "1px solid transparent", transition: "all 0.22s ease", boxShadow: act ? "0 4px 16px rgba(79,70,229,0.2)" : "none" }}
                onMouseEnter={e => !act && (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => !act && (e.currentTarget.style.background = "transparent")}
              >
                <I n={item.icon} size={17} color={act ? "#818cf8" : "#334155"} style={{ filter: act ? "drop-shadow(0 0 6px rgba(129,140,248,0.7))" : "none", transition: "filter 0.2s" }} />
                {sideOpen && <span style={{ fontSize: 13, fontWeight: 500, color: act ? "#c7d2fe" : "#334155", whiteSpace: "nowrap", fontFamily: "'Outfit',sans-serif" }}>{item.lbl}</span>}
              </div>
            );
          })}
        </nav>

        {/* Collapse */}
        <div style={{ padding: "14px 8px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <button onClick={() => setSideOpen(!sideOpen)} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, color: "#1e3a5f", cursor: "pointer", fontSize: 13, transition: "all 0.2s", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#64748b"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.color = "#1e3a5f"; }}
          >
            <I n={sideOpen ? "chevLeft" : "chevRight"} size={14} color="#334155" />
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {/* Topbar */}
        <div style={{ padding: "15px 32px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(5,10,20,0.92)", backdropFilter: "blur(18px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit',sans-serif", letterSpacing: "0.04em", color: "#f1f5f9" }}>{viewTitles[view]}</div>
            <div style={{ fontSize: 11, color: "#1e3a5f", marginTop: 3, fontFamily: "'Outfit',sans-serif", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
              <I n={role === "admin" ? "admin" : "tech"} size={11} color="#1e3a5f" />
              {role === "admin" ? "Administrador" : "Técnico"} · {new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {alrt > 0 && (
              <div style={{ background: "rgba(248,113,113,0.09)", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#f87171", fontWeight: 600, display: "flex", gap: 6, alignItems: "center", fontFamily: "'Outfit',sans-serif", letterSpacing: "0.08em", animation: "pulse 2.5s infinite" }}>
                <I n="alert" size={12} color="#f87171" />
                {alrt} ALERTA{alrt > 1 ? "S" : ""} ACTIVA{alrt > 1 ? "S" : ""}
              </div>
            )}
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#1e3a8a,#4f46e5)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(79,70,229,0.4)" }}>
              <I n={role === "admin" ? "admin" : "tech"} size={16} color="#fff" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 32, flex: 1 }}>

          {/* ── DASHBOARD ── */}
          {view === "dashboard" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard label="Total Ascensores" value={elevs.length} icon="elevator" color="#6366f1" sub="en sistema" />
                <StatCard label="Operativos" value={ops} icon="check" color="#34d399" sub={`${Math.round(ops / elevs.length * 100)}% del parque`} />
                <StatCard label="En Mantención" value={mant} icon="wrench" color="#fbbf24" sub="en proceso" />
                <StatCard label="Alertas Activas" value={alrt} icon="alert" color="#f87171" sub="requieren atención" />
                {role === "admin" && <StatCard label="Fuera Servicio" value={fuera} icon="x" color="#94a3b8" sub="sin operación" />}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 22 }}>
                <div style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.04)" }}>
                  <SectionTitle>Mantenciones por Mes</SectionTitle>
                  <ResponsiveContainer width="100%" height={175}>
                    <BarChart data={MONTHLY} barSize={14} barGap={4}>
                      <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="mes" tick={{ fill: "#1e3a5f", fontSize: 11, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#1e3a5f", fontSize: 11, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#080e1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#f1f5f9", fontFamily: "Outfit", fontSize: 12 }} />
                      <Bar dataKey="mantenciones" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="alertas" fill="#f87171" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.04)" }}>
                  <SectionTitle>Estado del Parque</SectionTitle>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <ResponsiveContainer width={145} height={145}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={64} dataKey="value" strokeWidth={0}>
                          {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
                      {pieData.map(d => (
                        <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                            <span style={{ fontSize: 12, color: "#475569", fontFamily: "'Outfit',sans-serif" }}>{d.name}</span>
                          </div>
                          <span style={{ fontSize: 16, fontWeight: 700, color: d.color, fontFamily: "'Outfit',sans-serif" }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.04)", marginBottom: 22 }}>
                <SectionTitle>Tendencia de Operatividad</SectionTitle>
                <ResponsiveContainer width="100%" height={145}>
                  <LineChart data={MONTHLY}>
                    <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="mes" tick={{ fill: "#1e3a5f", fontSize: 11, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#1e3a5f", fontSize: 11, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#080e1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#f1f5f9", fontFamily: "Outfit", fontSize: 12 }} />
                    <Line type="monotone" dataKey="operativos" stroke="#34d399" strokeWidth={2.5} dot={{ fill: "#34d399", r: 4, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="mantenciones" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.04)" }}>
                <SectionTitle>Equipos que Requieren Atención</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {elevs.filter(e => e.status !== "operativo").map(e => {
                    const cfg = SC[e.status];
                    return (
                      <div key={e.id} onClick={() => setSelected(e)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 11, border: `1px solid ${cfg.color}14`, cursor: "pointer", transition: "all 0.22s" }}
                        onMouseEnter={ev => { ev.currentTarget.style.background = cfg.bg; ev.currentTarget.style.borderColor = `${cfg.color}38`; ev.currentTarget.style.transform = "translateX(5px)"; }}
                        onMouseLeave={ev => { ev.currentTarget.style.background = "rgba(255,255,255,0.02)"; ev.currentTarget.style.borderColor = `${cfg.color}14`; ev.currentTarget.style.transform = "translateX(0)"; }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif" }}>{e.name} · {e.building}</div>
                          <div style={{ fontSize: 11, color: "#334155", fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>{e.brand} {e.model} · {e.location}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ background: cfg.bg, border: `1px solid ${cfg.color}38`, borderRadius: 7, padding: "3px 12px", fontSize: 10, color: cfg.color, fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'Outfit',sans-serif" }}>{cfg.label.toUpperCase()}</div>
                          <I n="eye" size={14} color="#334155" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── ASCENSORES ── */}
          {view === "elevadores" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {[["todos", `Todos (${elevs.length})`], ["operativo", `Operativos (${ops})`], ["mantencion", `Mantención (${mant})`], ["alerta", `Alerta (${alrt})`], ["fuera", `Fuera (${fuera})`]].map(([s, lbl]) => (
                  <button key={s} onClick={() => setFilter(s)} style={{
                    padding: "7px 18px", borderRadius: 8, border: filter === s ? "1px solid rgba(79,70,229,0.4)" : "1px solid rgba(255,255,255,0.07)", cursor: "pointer",
                    background: filter === s ? "linear-gradient(135deg,#1e3a8a,#4f46e5)" : "rgba(255,255,255,0.03)",
                    color: filter === s ? "#fff" : "#334155",
                    fontSize: 12, fontWeight: 500, fontFamily: "'Outfit',sans-serif",
                    transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: filter === s ? "scale(1.04)" : "scale(1)",
                    boxShadow: filter === s ? "0 4px 16px rgba(79,70,229,0.4)" : "none",
                  }}
                    onMouseEnter={e => filter !== s && (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                    onMouseLeave={e => filter !== s && (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  >{lbl}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
                {filteredElevs.map(e => <ElevCard key={e.id} elev={e} onClick={setSelected} />)}
              </div>
            </div>
          )}

          {/* ── MANTENCIONES ── */}
          {view === "mantenciones" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <div style={{ fontSize: 12, color: "#1e3a5f", letterSpacing: "0.12em", fontFamily: "'Outfit',sans-serif" }}>{maints.length} REGISTROS</div>
                {role === "admin" && <Btn variant="primary" onClick={() => setShowForm(true)}><I n="plus" size={14} color="#fff" /> Nueva Mantención</Btn>}
              </div>

              {showForm && (
                <div style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", borderRadius: 16, padding: 24, marginBottom: 22, border: "1px solid rgba(99,102,241,0.2)", animation: "slideUp 0.3s ease" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: "#c7d2fe", fontFamily: "'Outfit',sans-serif", letterSpacing: "0.05em" }}>NUEVA MANTENCIÓN</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <input style={inp} placeholder="Título de la mantención" value={nm.title} onChange={e => setNm(p => ({ ...p, title: e.target.value }))} />
                    <input style={inp} placeholder="Edificio / Instalación" value={nm.building} onChange={e => setNm(p => ({ ...p, building: e.target.value }))} />
                    <input style={inp} placeholder="Técnico asignado" value={nm.technician} onChange={e => setNm(p => ({ ...p, technician: e.target.value }))} />
                    <input style={{ ...inp, colorScheme: "dark" }} type="date" value={nm.date} onChange={e => setNm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    {["preventiva", "correctiva"].map(t => (
                      <button key={t} onClick={() => setNm(p => ({ ...p, type: t }))} style={{ padding: "7px 18px", borderRadius: 8, cursor: "pointer", background: nm.type === t ? (t === "preventiva" ? "rgba(99,102,241,0.2)" : "rgba(248,113,113,0.18)") : "rgba(255,255,255,0.03)", color: nm.type === t ? "#fff" : "#334155", border: nm.type === t ? (t === "preventiva" ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(248,113,113,0.4)") : "1px solid transparent", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", transition: "all 0.2s", fontFamily: "'Outfit',sans-serif" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                    ))}
                    <div style={{ flex: 1 }} />
                    <Btn variant="ghost" small onClick={() => setShowForm(false)}>Cancelar</Btn>
                    <Btn variant="success" small onClick={addMaint}><I n="check" size={13} color="#fff" /> Guardar</Btn>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {maints.map(m => <MaintCard key={m.id} maint={m} onUpdate={updateMaint} />)}
              </div>
            </div>
          )}

          {/* ── INFORMES ── */}
          {view === "informes" && role === "admin" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginBottom: 28 }}>
                {[
                  { title: "Tasa de Operatividad", value: `${Math.round(ops / elevs.length * 100)}%`, desc: `${ops} de ${elevs.length} ascensores activos`, color: "#34d399", icon: "chart" },
                  { title: "Mantenciones Este Mes", value: "8", desc: "3 correctivas · 5 preventivas", color: "#6366f1", icon: "wrench" },
                  { title: "Tiempo Prom. Resolución", value: "4.2h", desc: "Mantenciones correctivas", color: "#fbbf24", icon: "speed" },
                  { title: "Equipos con Alerta", value: alrt + fuera, desc: "Requieren atención urgente", color: "#f87171", icon: "alert" },
                ].map(r => (
                  <div key={r.title} style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", border: `1px solid ${r.color}14`, borderRadius: 16, padding: 26, transition: "all 0.3s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 22px 44px ${r.color}12`; e.currentTarget.style.borderColor = `${r.color}30`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${r.color}14`; }}>
                    <I n={r.icon} size={24} color={r.color} style={{ marginBottom: 14, opacity: 0.8 }} />
                    <div style={{ fontSize: 10, color: "#334155", letterSpacing: "0.14em", fontWeight: 500, marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>{r.title.toUpperCase()}</div>
                    <div style={{ fontSize: 44, fontWeight: 700, color: r.color, fontFamily: "'Outfit',sans-serif", lineHeight: 1 }}>{r.value}</div>
                    <div style={{ fontSize: 12, color: "#1e3a5f", marginTop: 8, fontFamily: "'Outfit',sans-serif" }}>{r.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(145deg,#080e1c,#0d1628)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.04)" }}>
                <SectionTitle>Resumen por Edificio</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {[...new Set(elevs.map(e => e.building))].map(b => {
                    const be = elevs.filter(e => e.building === b);
                    const bo = be.filter(e => e.status === "operativo").length;
                    return (
                      <div key={b} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 11, border: "1px solid rgba(255,255,255,0.03)", transition: "all 0.22s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateX(5px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <I n="building" size={14} color="#1e3a5f" />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif" }}>{b}</div>
                            <div style={{ fontSize: 11, color: "#1e3a5f", fontFamily: "'Outfit',sans-serif" }}>{be.length} ascensor{be.length > 1 ? "es" : ""}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 7 }}>
                          {be.map(e => { const c = SC[e.status]; return <div key={e.id} style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, boxShadow: `0 0 7px ${c.glow}` }} />; })}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: bo === be.length ? "#34d399" : "#fbbf24", fontFamily: "'Outfit',sans-serif" }}>{bo} / {be.length} Activos</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && <Modal elev={selected} onClose={() => setSelected(null)} />}

      {/* Toast */}
      {notif && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, background: "linear-gradient(135deg,#080e1c,#0d1628)", border: `1px solid ${notif.color}38`, borderRadius: 14, padding: "14px 22px", boxShadow: `0 24px 48px rgba(0,0,0,0.65), 0 0 24px ${notif.color}14`, animation: "toastIn 0.38s cubic-bezier(0.34,1.56,0.64,1)", fontSize: 13, fontWeight: 500, color: notif.color, fontFamily: "'Outfit',sans-serif", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: 10 }}>
          <I n="check" size={15} color={notif.color} />
          {notif.msg}
        </div>
      )}
    </div>
  );
}