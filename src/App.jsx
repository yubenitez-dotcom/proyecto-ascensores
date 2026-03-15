import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const I = ({ n, size = 16, color = "currentColor", style = {} }) => {
  const d = {
    elevator:  <><rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="1.2" strokeDasharray="2 2"/><polyline points="9,8 12,5 15,8" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="9,16 12,19 15,16" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" fill="none"/></>,
    wrench:    <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="1.5" fill="none"/></>,
    chart:     <><polyline points="3 17 8 12 13 15 21 7" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.2"/></>,
    reports:   <><rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><line x1="7" y1="8" x2="17" y2="8" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><line x1="7" y1="16" x2="13" y2="16" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></>,
    alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="1.5" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="17" r="0.8" fill={color}/></>,
    check:     <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></>,
    play:      <><polygon points="5 3 19 12 5 21 5 3" stroke={color} strokeWidth="1.5" fill={color} strokeLinejoin="round"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    chevL:     <><polyline points="15 18 9 12 15 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    chevR:     <><polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    chevD:     <><polyline points="6 9 12 15 18 9" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    chevU:     <><polyline points="18 15 12 9 6 15" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" fill="none"/></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.5" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="1.5" fill="none"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="1.5" fill="none"/></>,
    star:      <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="1.5" fill="none"/></>,
    tech:      <><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.3"/></>,
    pin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" fill="none"/></>,
    speed:     <><path d="M12 2a10 10 0 1 0 10 10" stroke={color} strokeWidth="1.5" fill="none"/><line x1="12" y1="12" x2="16" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill={color}/></>,
    building:  <><rect x="3" y="2" width="18" height="20" rx="1" stroke={color} strokeWidth="1.5" fill="none"/><line x1="3" y1="8" x2="21" y2="8" stroke={color} strokeWidth="1.2"/><rect x="8" y="12" width="3" height="3" stroke={color} strokeWidth="1.2" fill="none"/><rect x="13" y="12" width="3" height="3" stroke={color} strokeWidth="1.2" fill="none"/><rect x="9" y="18" width="6" height="4" stroke={color} strokeWidth="1.2" fill="none"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="1.5" fill="none"/><polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    lock:      <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth="1.5" fill="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="1.5" fill="none"/></>,
    mail:      <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth="1.5" fill="none"/><polyline points="22,6 12,13 2,6" stroke={color} strokeWidth="1.5" fill="none"/></>,
    bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.5" fill="none"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.5" fill="none"/></>,
    trending:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="17 6 23 6 23 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth="1.5" fill="none"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke={color} strokeWidth="1.5" fill="none"/></>,
    activity:  <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    layers:    <><polygon points="12 2 2 7 12 12 22 7 12 2" stroke={color} strokeWidth="1.5" fill="none"/><polyline points="2 17 12 22 22 17" stroke={color} strokeWidth="1.5" fill="none"/><polyline points="2 12 12 17 22 12" stroke={color} strokeWidth="1.5" fill="none"/></>,
    edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="1.5" fill="none"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="1.5" fill="none"/></>,
    trash:     <><polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke={color} strokeWidth="1.5" fill="none"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></>,
    search:    <><circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...style }}>{d[n]}</svg>;
};

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = ({ collapsed = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
      <rect width="40" height="40" rx="10" fill="url(#lg)"/>
      <rect x="18" y="5" width="4" height="30" rx="1" fill="rgba(255,255,255,0.12)"/>
      <rect x="11" y="13" width="18" height="12" rx="2" fill="white"/>
      <polyline points="16,18 20,14 24,18" stroke="#1d4ed8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16,22 20,26 24,22" stroke="#1d4ed8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="14" y1="5" x2="14" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <line x1="26" y1="5" x2="26" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <defs><linearGradient id="lg" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stopColor="#1e40af"/><stop offset="100%" stopColor="#6d28d9"/></linearGradient></defs>
    </svg>
    {!collapsed && (
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif", letterSpacing: "0.06em", color: "#f1f5f9", lineHeight: 1.1 }}>
          SAS<span style={{ color: "#818cf8", fontWeight: 300 }}> CHILE</span>
        </div>
        <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.18em", fontFamily: "'Outfit',sans-serif", fontWeight: 400, marginTop: 2 }}>GESTIÓN DE ASCENSORES</div>
      </div>
    )}
  </div>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
// NOTE: Now using Firebase for real authentication. Users are matched by email to these roles.
// New registered users will default to "cliente".
const USERS = [
  { email: "admin@saschile.cl",   name: "Administrador Fijo",  role: "administrador", cargo: "Jefe de Operaciones" },
  { email: "tecnico@saschile.cl", name: "Técnico Fijo",        role: "tecnico",       cargo: "Técnico de Terreno" },
];

const ELEVATORS_DATA = [
  { id: 1, name: "Ascensor A-01", building: "Torre Costanera",    client: "Costanera S.A.",    floors: 32, currentFloor: 18, status: "operativo",  brand: "ThyssenKrupp", model: "Synergy 300",   serial: "TK-2021-001", lastMaint: "2024-11-15", nextMaint: "2025-02-15", technician: "Roberto Silva", load: 72, speed: 2.5, trips: 1243,  location: "Santiago Centro" },
  { id: 2, name: "Ascensor B-01", building: "Hospital San José",  client: "Red Salud Norte",  floors: 8,  currentFloor: 3,  status: "mantencion", brand: "Otis",         model: "Gen2",           serial: "OT-2019-051", lastMaint: "2024-12-01", nextMaint: "2025-01-01", technician: "Juan Pérez",   load: 0,  speed: 0,   trips: 5821,  location: "Independencia"   },
  { id: 3, name: "Ascensor C-01", building: "Mall Plaza Oriente", client: "Mall Corp",        floors: 5,  currentFloor: 2,  status: "operativo",  brand: "Kone",         model: "MonoSpace 500", serial: "KN-2020-112", lastMaint: "2024-10-20", nextMaint: "2025-01-20", technician: "Roberto Silva",load: 45, speed: 1.6, trips: 9102,  location: "Las Condes"      },
  { id: 4, name: "Ascensor D-01", building: "Torre Central",      client: "Costanera S.A.",   floors: 20, currentFloor: 20, status: "alerta",     brand: "Schindler",    model: "3300",           serial: "SC-2018-033", lastMaint: "2024-09-10", nextMaint: "2024-12-10", technician: "Carlos Muñoz",load: 60, speed: 1.8, trips: 14320, location: "Providencia"     },
  { id: 5, name: "Ascensor E-01", building: "Clínica Las Condes", client: "Clínica LC SpA",   floors: 12, currentFloor: 7,  status: "operativo",  brand: "Mitsubishi",   model: "NEXWAY",         serial: "MT-2022-077", lastMaint: "2024-11-28", nextMaint: "2025-02-28", technician: "Ana Rivas",    load: 88, speed: 2.0, trips: 3210,  location: "Las Condes"      },
  { id: 6, name: "Ascensor F-01", building: "Parque Arauco",      client: "Mall Corp",        floors: 4,  currentFloor: 1,  status: "fuera",      brand: "OTIS",         model: "Infinity",       serial: "OT-2017-009", lastMaint: "2024-08-01", nextMaint: "2024-11-01", technician: "Pedro López",  load: 0,  speed: 0,   trips: 22100, location: "Las Condes"      },
];

const CLIENTS_DATA = [
  { id: 1, name: "Costanera S.A.",   rut: "76.123.456-7", contact: "Ana González",  email: "ana@costanera.cl",  phone: "+56 9 8765 4321", buildings: 2, elevators: 2, status: "activo",   contract: "2025-12-31", zone: "Santiago Centro" },
  { id: 2, name: "Red Salud Norte",  rut: "77.234.567-8", contact: "Pedro Morales", email: "pedro@rsn.cl",      phone: "+56 9 7654 3210", buildings: 1, elevators: 1, status: "activo",   contract: "2025-06-30", zone: "Independencia"   },
  { id: 3, name: "Mall Corp",        rut: "78.345.678-9", contact: "Luis Torres",   email: "luis@mallcorp.cl",  phone: "+56 9 6543 2109", buildings: 2, elevators: 2, status: "activo",   contract: "2024-12-15", zone: "Las Condes"      },
  { id: 4, name: "Clínica LC SpA",   rut: "79.456.789-0", contact: "María Fuentes", email: "mfuentes@clc.cl",   phone: "+56 9 5432 1098", buildings: 1, elevators: 1, status: "activo",   contract: "2025-09-30", zone: "Las Condes"      },
];

const TECHNICIANS_DATA = [
  { id: 1, name: "Roberto Silva",  rut: "15.123.456-7", email: "rsilva@saschile.cl",  phone: "+56 9 1111 2222", zone: "Santiago Centro / Las Condes", tasks: 12, completed: 10, status: "activo" },
  { id: 2, name: "Juan Pérez",     rut: "16.234.567-8", email: "jperez@saschile.cl",  phone: "+56 9 2222 3333", zone: "Independencia",               tasks: 8,  completed: 7,  status: "activo" },
  { id: 3, name: "Carlos Muñoz",   rut: "17.345.678-9", email: "cmunoz@saschile.cl",  phone: "+56 9 3333 4444", zone: "Providencia",                 tasks: 15, completed: 12, status: "activo" },
  { id: 4, name: "Ana Rivas",      rut: "18.456.789-0", email: "arivas@saschile.cl",  phone: "+56 9 4444 5555", zone: "Las Condes",                  tasks: 10, completed: 9,  status: "activo" },
  { id: 5, name: "Pedro López",    rut: "19.567.890-1", email: "plopez@saschile.cl",  phone: "+56 9 5555 6666", zone: "Las Condes / Maipú",          tasks: 6,  completed: 4,  status: "activo" },
];

const MAINTENANCES_DATA = [
  { id: 1, elevatorId: 2, type: "correctiva", status: "en_progreso", title: "Falla en sistema de puertas",          building: "Hospital San José",  client: "Red Salud Norte", technician: "Juan Pérez",    date: "2024-12-03", priority: "alta",
    checklist: [{item:"Revisión motor puerta",done:true},{item:"Calibración sensores",done:true},{item:"Test apertura/cierre",done:true},{item:"Revisión cables",done:false},{item:"Limpieza rieles",done:false},{item:"Lubricación guías",done:false},{item:"Test de seguridad",done:false},{item:"Documentación",done:false},{item:"Revisión final",done:false},{item:"Firma del técnico",done:false}] },
  { id: 2, elevatorId: 6, type: "correctiva", status: "programada",  title: "Reparación — Equipo fuera de servicio", building: "Parque Arauco",      client: "Mall Corp",       technician: "Pedro López",   date: "2024-12-04", priority: "alta",   checklist: Array(10).fill(0).map((_,i)=>({item:`Tarea de reparación ${i+1}`,done:false})) },
  { id: 3, elevatorId: 1, type: "preventiva", status: "programada",  title: "Mantención preventiva mensual",         building: "Torre Costanera",    client: "Costanera S.A.",  technician: "Roberto Silva", date: "2025-02-15", priority: "normal", checklist: Array(10).fill(0).map((_,i)=>({item:`Revisión preventiva ${i+1}`,done:false})) },
  { id: 4, elevatorId: 3, type: "preventiva", status: "completada",  title: "Mantención preventiva trimestral",      building: "Mall Plaza Oriente", client: "Mall Corp",       technician: "Roberto Silva", date: "2024-10-20", priority: "normal", checklist: Array(10).fill(0).map((_,i)=>({item:`Revisión ${i+1}`,done:true})) },
];

const ALERTS_DATA = [
  { id: 1, elevatorId: 4, type: "vencimiento_mantencion", title: "Mantención vencida",          building: "Torre Central",      message: "La mantención preventiva venció el 2024-12-10. Programar con urgencia.", severity: "alta",   read: false, date: "2024-12-11" },
  { id: 2, elevatorId: 6, type: "fuera_servicio",         title: "Equipo fuera de servicio",    building: "Parque Arauco",      message: "El ascensor F-01 lleva 3 días fuera de servicio sin reparación iniciada.", severity: "alta",   read: false, date: "2024-12-10" },
  { id: 3, elevatorId: 2, type: "mantencion_activa",      title: "Mantención en progreso",      building: "Hospital San José",  message: "Mantención correctiva en progreso. Checklist al 30% de avance.", severity: "media",  read: true,  date: "2024-12-09" },
  { id: 4, elevatorId: 1, type: "proxima_mantencion",     title: "Próxima mantención en 30 días", building: "Torre Costanera",  message: "El ascensor A-01 tiene mantención programada para el 2025-02-15.", severity: "baja",   read: true,  date: "2024-12-08" },
];

const MONTHLY = [
  {mes:"Jul",mantenciones:4,alertas:1,operativos:5},{mes:"Ago",mantenciones:6,alertas:2,operativos:5},
  {mes:"Sep",mantenciones:3,alertas:0,operativos:6},{mes:"Oct",mantenciones:7,alertas:3,operativos:4},
  {mes:"Nov",mantenciones:5,alertas:1,operativos:5},{mes:"Dic",mantenciones:8,alertas:2,operativos:3},
];

const SC = {
  operativo:  { label:"Operativo",         color:"#34d399", bg:"rgba(52,211,153,0.08)",  glow:"rgba(52,211,153,0.3)"  },
  mantencion: { label:"En Mantención",     color:"#fbbf24", bg:"rgba(251,191,36,0.08)",  glow:"rgba(251,191,36,0.3)"  },
  alerta:     { label:"Alerta",            color:"#f87171", bg:"rgba(248,113,113,0.08)", glow:"rgba(248,113,113,0.3)" },
  fuera:      { label:"Fuera de Servicio", color:"#94a3b8", bg:"rgba(148,163,184,0.06)", glow:"rgba(148,163,184,0.2)" },
};

// ─── RIPPLE BUTTON ─────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", small=false, disabled=false, style={} }) {
  const [ripples,setRipples]=useState([]);
  const [pressed,setPressed]=useState(false);
  const ref=useRef(null);
  const V={
    primary:{ bg:"linear-gradient(135deg,#1e40af,#4f46e5)", color:"#fff",    border:"none",                            shadow:"0 4px 20px rgba(79,70,229,0.45),inset 0 1px 0 rgba(255,255,255,0.12)" },
    success:{ bg:"linear-gradient(135deg,#065f46,#10b981)", color:"#fff",    border:"none",                            shadow:"0 4px 20px rgba(16,185,129,0.4),inset 0 1px 0 rgba(255,255,255,0.12)" },
    danger: { bg:"linear-gradient(135deg,#991b1b,#ef4444)", color:"#fff",    border:"none",                            shadow:"0 4px 20px rgba(239,68,68,0.4),inset 0 1px 0 rgba(255,255,255,0.12)"  },
    amber:  { bg:"linear-gradient(135deg,#92400e,#f59e0b)", color:"#fff",    border:"none",                            shadow:"0 4px 20px rgba(245,158,11,0.4),inset 0 1px 0 rgba(255,255,255,0.12)" },
    ghost:  { bg:"rgba(255,255,255,0.04)",                   color:"#94a3b8", border:"1px solid rgba(255,255,255,0.08)", shadow:"none" },
    outline:{ bg:"transparent",                              color:"#818cf8", border:"1px solid rgba(129,140,248,0.35)", shadow:"none" },
  }[variant]||{};
  const fire=e=>{
    if(disabled)return;
    const r=ref.current.getBoundingClientRect();
    const id=Date.now();
    setRipples(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(()=>setRipples(p=>p.filter(rr=>rr.id!==id)),650);
    onClick&&onClick(e);
  };
  return (
    <button ref={ref} onClick={fire} onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)} onMouseLeave={()=>setPressed(false)} disabled={disabled}
      style={{ position:"relative",overflow:"hidden",cursor:disabled?"not-allowed":"pointer", padding:small?"7px 16px":"10px 22px", background:disabled?"rgba(255,255,255,0.03)":V.bg, color:disabled?"#334155":V.color, border:V.border,borderRadius:10, fontSize:small?11:13, fontWeight:600,letterSpacing:"0.04em",fontFamily:"'Outfit',sans-serif", boxShadow:disabled?"none":V.shadow, transform:pressed?"scale(0.955) translateY(1px)":"scale(1)", transition:"transform 0.1s ease,box-shadow 0.2s ease,filter 0.15s ease", filter:pressed?"brightness(0.86)":"brightness(1)", display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7, userSelect:"none",...style }}>
      {ripples.map(r=>(<span key={r.id} style={{position:"absolute",left:r.x-60,top:r.y-60,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.18)",transform:"scale(0)",animation:"rpl 0.65s ease-out forwards",pointerEvents:"none"}}/>))}
      {children}
    </button>
  );
}

// ─── ELEVATOR SHAFT ────────────────────────────────────────────────────────────
function Shaft({ elev, large=false }) {
  const [floor,setFloor]=useState(elev.currentFloor);
  const [moving,setMoving]=useState(false);
  const maxF=Math.min(elev.floors,large?14:10);
  const fh=large?32:27; const H=maxF*fh;
  const cfg=SC[elev.status];
  const cabY=H-(floor/elev.floors)*H-fh;
  useEffect(()=>{
    if(elev.status!=="operativo")return;
    const t=setInterval(()=>{ const n=Math.floor(Math.random()*elev.floors)+1; setMoving(true); setTimeout(()=>{setFloor(n);setMoving(false);},2200); },4500);
    return()=>clearInterval(t);
  },[elev.status,elev.floors]);
  const w=large?66:48;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <div style={{fontSize:10,color:cfg.color,fontFamily:"'Roboto Mono',monospace",letterSpacing:2,fontWeight:600}}>{String(floor).padStart(2,"0")} / {String(elev.floors).padStart(2,"0")}</div>
      <div style={{position:"relative",width:w,height:H,background:"linear-gradient(180deg,rgba(0,0,0,0.55),rgba(5,10,22,0.75))",border:"1px solid rgba(255,255,255,0.07)",borderRadius:6,overflow:"hidden",boxShadow:"inset 0 0 18px rgba(0,0,0,0.5)"}}>
        {Array.from({length:maxF}).map((_,i)=>(<div key={i} style={{position:"absolute",width:"100%",height:1,background:i%5===0?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.025)",bottom:i*fh}}/>))}
        <div style={{position:"absolute",left:7,top:0,bottom:0,width:2,background:"rgba(255,255,255,0.06)",borderRadius:1}}/>
        <div style={{position:"absolute",right:7,top:0,bottom:0,width:2,background:"rgba(255,255,255,0.06)",borderRadius:1}}/>
        <div style={{position:"absolute",width:1.5,background:`linear-gradient(180deg,${cfg.color}66,transparent)`,left:"50%",transform:"translateX(-50%)",top:0,height:Math.max(0,cabY+4),transition:"height 2.2s cubic-bezier(0.4,0,0.2,1)"}}/>
        <div style={{position:"absolute",left:9,right:9,height:fh-5,background:elev.status==="operativo"?"linear-gradient(135deg,#1e3a5f,#1d4ed8)":elev.status==="mantencion"?"linear-gradient(135deg,#78350f,#b45309)":elev.status==="alerta"?"linear-gradient(135deg,#7f1d1d,#dc2626)":"linear-gradient(135deg,#1c2433,#374151)",borderRadius:3,bottom:cabY,transition:"bottom 2.2s cubic-bezier(0.4,0,0.2,1)",boxShadow:`0 0 16px ${cfg.glow}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I n="elevator" size={large?14:11} color="rgba(255,255,255,0.7)"/>
        </div>
        {moving&&<div style={{position:"absolute",top:5,right:5,width:5,height:5,borderRadius:"50%",background:"#34d399",animation:"blink 0.45s infinite alternate"}}/>}
      </div>
      <div style={{fontSize:9,color:cfg.color,background:cfg.bg,border:`1px solid ${cfg.color}28`,borderRadius:20,padding:"2px 10px",fontWeight:600,letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>{cfg.label.toUpperCase()}</div>
    </div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({label,value,icon,color,sub}){
  const[hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",border:`1px solid ${hov?color+"40":color+"16"}`,borderRadius:16,padding:"22px 24px",position:"relative",overflow:"hidden",transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",transform:hov?"translateY(-4px)":"translateY(0)",boxShadow:hov?`0 18px 38px ${color}16`:"0 2px 8px rgba(0,0,0,0.35)"}}>
      <div style={{position:"absolute",top:-20,right:-20,opacity:hov?0.08:0.04,transition:"opacity 0.3s",transform:hov?"scale(1.2)":"scale(1)"}}><I n={icon} size={72} color={color}/></div>
      <div style={{position:"absolute",bottom:0,left:0,height:2,background:`linear-gradient(90deg,transparent,${color})`,transition:"width 0.45s ease",width:hov?"100%":"0%",borderRadius:"0 0 16px 16px"}}/>
      <div style={{fontSize:10,color:"#475569",letterSpacing:"0.15em",fontWeight:500,marginBottom:10,fontFamily:"'Outfit',sans-serif"}}>{label.toUpperCase()}</div>
      <div style={{fontSize:46,fontWeight:700,color,fontFamily:"'Outfit',sans-serif",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:"#334155",marginTop:8,fontFamily:"'Outfit',sans-serif"}}>{sub}</div>}
    </div>
  );
}

// ─── SECTION TITLE ─────────────────────────────────────────────────────────────
function ST({children}){
  return(
    <div style={{fontSize:10,fontWeight:500,color:"#1e3a5f",letterSpacing:"0.18em",marginBottom:16,fontFamily:"'Outfit',sans-serif",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:1,background:"rgba(255,255,255,0.04)"}}/>
      {children}
      <div style={{flex:1,height:1,background:"rgba(255,255,255,0.04)"}}/>
    </div>
  );
}

// ─── TABLE ─────────────────────────────────────────────────────────────────────
function Table({headers,rows,onRowClick}){
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            {headers.map(h=>(
              <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:600,color:"#334155",letterSpacing:"0.14em",fontFamily:"'Outfit',sans-serif"}}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} onClick={()=>onRowClick&&onRowClick(row)} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:onRowClick?"pointer":"default",transition:"background 0.15s"}}
              onMouseEnter={e=>onRowClick&&(e.currentTarget.style.background="rgba(255,255,255,0.03)")}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              {row.map((cell,j)=>(
                <td key={j} style={{padding:"12px 14px",fontSize:13,color:j===0?"#f1f5f9":"#64748b",fontFamily:"'Outfit',sans-serif",fontWeight:j===0?600:400}}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── BADGE ─────────────────────────────────────────────────────────────────────
function Badge({label,color}){
  return <span style={{fontSize:10,background:`${color}12`,color,border:`1px solid ${color}28`,borderRadius:6,padding:"3px 10px",fontWeight:600,letterSpacing:"0.1em",fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap"}}>{label.toUpperCase()}</span>;
}

// ─── MAINTENANCE CARD ──────────────────────────────────────────────────────────
function MaintCard({maint,onUpdate,readOnly=false, role, user}){
  const[open,setOpen]=useState(false);
  const done=maint.checklist.filter(c=>c.done).length;
  const pct=Math.round(done/maint.checklist.length*100);
  const tc=maint.type==="preventiva"?"#60a5fa":maint.type==="correctiva"?"#f87171":"#fbbf24";
  const sc={en_progreso:"#fbbf24",completada:"#34d399",programada:"#94a3b8"}[maint.status];
  const sl={en_progreso:"En Progreso",completada:"Completada",programada:"Programada"}[maint.status];
  const pc=maint.priority==="alta"?"#f87171":"#94a3b8";

  // Technician can update if it's their task OR Admin can update anything
  const canUpdate = role === "administrador" || (role === "tecnico" && maint.technician === user.name);

  return(
    <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:16,overflow:"hidden"}}>
      <div style={{padding:22}}>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <Badge label={maint.type} color={tc}/>
          <Badge label={sl} color={sc}/>
          <Badge label={maint.priority==="alta"?"Alta Prioridad":"Normal"} color={pc}/>
        </div>
        <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",marginBottom:6,fontFamily:"'Outfit',sans-serif"}}>{maint.title}</div>
        <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{fontSize:12,color:"#475569",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}><I n="building" size={11} color="#334155"/>{maint.building}</div>
          <div style={{fontSize:12,color:"#475569",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}><I n="tech" size={11} color="#334155"/>{maint.technician}</div>
          <div style={{fontSize:12,color:"#475569",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}><I n="calendar" size={11} color="#334155"/>{maint.date}</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:10,color:"#334155",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>VERIFICACIÓN</span>
            <span style={{fontSize:12,fontWeight:700,color:pct===100?"#34d399":"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>{done} / {maint.checklist.length}</span>
          </div>
          <div style={{height:6,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct===100?"linear-gradient(90deg,#065f46,#34d399)":"linear-gradient(90deg,#1e3a8a,#6366f1)",borderRadius:3,transition:"width 0.6s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:pct===100?"0 0 10px rgba(52,211,153,0.45)":"0 0 10px rgba(99,102,241,0.4)"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="ghost" onClick={()=>setOpen(!open)} style={{flex:1}}><I n={open?"chevU":"chevD"} size={14} color="#64748b"/>{open?"Cerrar":"Ver Checklist"}</Btn>
          {!readOnly && canUpdate && maint.status==="programada"  &&<Btn variant="primary" onClick={()=>onUpdate(maint.id,"iniciar")}   style={{flex:1}}><I n="play" size={13} color="#fff"/>Iniciar</Btn>}
          {!readOnly && canUpdate && maint.status==="en_progreso" &&<Btn variant="success" onClick={()=>onUpdate(maint.id,"completar")} style={{flex:1}}><I n="check" size={14} color="#fff"/>Completar</Btn>}
          {maint.status==="completada"             &&<Btn variant="ghost" disabled style={{flex:1,opacity:0.4}}><I n="check" size={14} color="#34d399"/>Finalizada</Btn>}
        </div>
      </div>
      {open&&(
        <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",padding:"4px 22px 22px"}}>
          <div style={{paddingTop:14,display:"flex",flexDirection:"column",gap:6}}>
            {maint.checklist.map((item,idx)=>(
              <div key={idx} onClick={()=>!readOnly&&maint.status!=="completada"&&canUpdate&&onUpdate(maint.id,"toggle",idx)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:item.done?"rgba(52,211,153,0.06)":"rgba(255,255,255,0.02)",borderRadius:10,cursor:(readOnly||maint.status==="completada"||!canUpdate)?"default":"pointer",border:`1px solid ${item.done?"rgba(52,211,153,0.16)":"rgba(255,255,255,0.04)"}`,transition:"all 0.2s ease"}}
                onMouseEnter={e=>!readOnly&&canUpdate&&(e.currentTarget.style.transform="translateX(4px)")}
                onMouseLeave={e=>e.currentTarget.style.transform="translateX(0)"}
              >
                <div style={{width:20,height:20,borderRadius:6,flexShrink:0,background:item.done?"linear-gradient(135deg,#065f46,#34d399)":"rgba(255,255,255,0.05)",border:`1.5px solid ${item.done?"#34d399":"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:item.done?"0 0 10px rgba(52,211,153,0.4)":"none",transform:item.done?"scale(1.08)":"scale(1)"}}>
                  {item.done&&<I n="check" size={10} color="#fff"/>}
                </div>
                <span style={{fontSize:13,color:item.done?"#6ee7b7":"#64748b",textDecoration:item.done?"line-through":"none",fontFamily:"'Outfit',sans-serif",transition:"all 0.2s"}}>{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CARDS ────────────────────────────────────────────────────────────────────
function ElevCard({e, onClick, role}){
  const stColor=SC[e.status].color;
  return(
    <div onClick={onClick} style={{background:"linear-gradient(145deg,#0a1120,#0f172a)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",position:"relative",overflow:"hidden",transition:"all 0.3s cubic-bezier(0.25,0.8,0.25,1)",boxShadow:"0 10px 30px rgba(0,0,0,0.3)"}}
      onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-4px)";ev.currentTarget.style.borderColor="rgba(99,102,241,0.3)";ev.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.1)";}}
      onMouseLeave={ev=>{ev.currentTarget.style.transform="translateY(0)";ev.currentTarget.style.borderColor="rgba(255,255,255,0.06)";ev.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,0.3)";}}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",marginBottom:4}}>{e.name}</div>
          <div style={{fontSize:13,color:"#64748b",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:6}}><I n="pin" size={13}/>{e.building}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Badge label={SC[e.status].label} color={stColor}/>
          {role === "administrador" && (
            <div style={{padding:6,background:"rgba(255,255,255,0.05)",borderRadius:8,color:"#94a3b8",cursor:"pointer"}}><I n="edit" size={16}/></div>
          )}
        </div>
      </div>
      <div style={{fontSize:11,color:"#334155",fontFamily:"'Outfit',sans-serif",marginTop:2}}>{e.brand} {e.model} · {e.location}</div>
    </div>
  );
}

// ─── MODAL WRAPPER ─────────────────────────────────────────────────────────────
function Modal({title,children,onClose,maxW=520}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(14px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.2s ease"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:22,padding:32,width:"100%",maxWidth:maxW,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 48px 96px rgba(0,0,0,0.8)",animation:"slideUp 0.32s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontSize:18,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.03em"}}>{title}</div>
          <Btn variant="ghost" small onClick={onClose}><I n="x" size={14} color="#94a3b8"/></Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function LoginScreen({setGlobalError}){
  const[isLogin,setIsLogin]=useState(true);
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[name,setName]=useState("");
  const[error,setError]=useState("");
  const[loading,setLoading]=useState(false);

  const handleSubmit=async ()=>{
    if(!email||!pass) {setError("Por favor completa todos los campos.");return;}
    if(!isLogin&&!name) {setError("Por favor ingresa tu nombre.");return;}
    if(pass.length<6) {setError("La contraseña debe tener al menos 6 caracteres.");return;}

    setError(""); setLoading(true);
    try {
      if(isLogin){
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        // En una app real de producción, guardaríamos el nombre en una base de datos (Firestore).
        // Por ahora, solo lo registramos en Auth.
        await createUserWithEmailAndPassword(auth, email, pass);
      }
    } catch(err) {
      if(err.code==="auth/invalid-credential"||err.code==="auth/user-not-found"||err.code==="auth/wrong-password"){
         setError("Correo o contraseña incorrectos.");
      } else if(err.code==="auth/email-already-in-use"){
         setError("Este correo ya está registrado.");
      } else {
         setError("Ocurrió un error. Intenta nuevamente.");
      }
    }
    setLoading(false);
  };

  const inp={width:"100%",padding:"13px 16px 13px 44px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#e2e8f0",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif",transition:"border-color 0.2s"};

  return(
    <div style={{minHeight:"100vh",background:"#050a14",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.55}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        input::placeholder{color:#1e3a5f}
        input:focus{border-color:rgba(99,102,241,0.5)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.12)!important}
      `}</style>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.008) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.008) 1px,transparent 1px)",backgroundSize:"56px 56px",pointerEvents:"none"}}/>
      <div style={{position:"fixed",top:"10%",left:"15%",width:600,height:600,background:"radial-gradient(circle,rgba(30,64,175,0.08) 0%,transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:"10%",right:"10%",width:500,height:500,background:"radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 65%)",pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:440,zIndex:10}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none" style={{animation:"float 4s ease-in-out infinite"}}>
              <rect width="40" height="40" rx="12" fill="url(#loginGrad)"/>
              <rect x="18" y="5" width="4" height="30" rx="1" fill="rgba(255,255,255,0.12)"/>
              <rect x="11" y="13" width="18" height="12" rx="2" fill="white"/>
              <polyline points="16,18 20,14 24,18" stroke="#1d4ed8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16,22 20,26 24,22" stroke="#1d4ed8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="14" y1="5" x2="14" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <line x1="26" y1="5" x2="26" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <defs><linearGradient id="loginGrad" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stopColor="#1e40af"/><stop offset="100%" stopColor="#6d28d9"/></linearGradient></defs>
            </svg>
          </div>
          <div style={{fontSize:28,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.04em",lineHeight:1}}>SAS <span style={{color:"#818cf8",fontWeight:300}}>CHILE</span></div>
          <div style={{fontSize:12,color:"#334155",marginTop:6,letterSpacing:"0.16em",fontFamily:"'Outfit',sans-serif"}}>GESTIÓN DE ASCENSORES</div>
        </div>

        <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:20,padding:32,border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 32px 64px rgba(0,0,0,0.5)"}}>
          
          <div style={{display:"flex",marginBottom:24,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4}}>
            <button onClick={()=>{setIsLogin(true);setError("");}} style={{flex:1,padding:"10px 0",border:"none",borderRadius:8,background:isLogin?"linear-gradient(135deg,#1e3a8a,#4f46e5)":"transparent",color:isLogin?"#fff":"#64748b",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all 0.2s"}}>{isLogin?"Iniciar Sesión":"Entrar"}</button>
            <button onClick={()=>{setIsLogin(false);setError("");}} style={{flex:1,padding:"10px 0",border:"none",borderRadius:8,background:!isLogin?"linear-gradient(135deg,#1e3a8a,#4f46e5)":"transparent",color:!isLogin?"#fff":"#64748b",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all 0.2s"}}>{!isLogin?"Registrarse":"Crear Cuenta"}</button>
          </div>

          {!isLogin&&<div style={{marginBottom:18}}>
            <label style={{fontSize:11,color:"#475569",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif",display:"block",marginBottom:8}}>NOMBRE COMPLETO</label>
            <div style={{position:"relative"}}>
              <I n="user" size={16} color="#334155" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)"}}/>
              <input style={inp} type="text" placeholder="Ej. Ana González" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
          </div>}

          <div style={{marginBottom:18}}>
            <label style={{fontSize:11,color:"#475569",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif",display:"block",marginBottom:8}}>CORREO ELECTRÓNICO</label>
            <div style={{position:"relative"}}>
              <I n="mail" size={16} color="#334155" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)"}}/>
              <input style={inp} type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <label style={{fontSize:11,color:"#475569",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif",display:"block",marginBottom:8}}>CONTRASEÑA {!isLogin&&"(Mín. 6 caracteres)"}</label>
            <div style={{position:"relative"}}>
              <I n="lock" size={16} color="#334155" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)"}}/>
              <input style={inp} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
          </div>

          {error&&<div style={{fontSize:13,color:"#f87171",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:18,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:8}}><I n="alert" size={14} color="#f87171"/>{error}</div>}

          <Btn variant="primary" onClick={handleSubmit} style={{width:"100%",padding:"13px 0",fontSize:14}} disabled={loading}>
            {loading?<><span style={{animation:"pulse 0.8s infinite"}}>{isLogin?"Verificando...":"Registrando..."}</span></>:<><I n="check" size={15} color="#fff"/>{isLogin?"Ingresar al Sistema":"Completar Registro"}</>}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[firebaseUser,setFirebaseUser]=useState(null);
  const[authLoading,setAuthLoading]=useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setFirebaseUser(u);
      setAuthLoading(false);
    });
    return ()=>unsub();
  },[]);

  // Rest of state
  const[user,setUser]=useState(null);
  const[view,setView]=useState("dashboard");
  const[sideOpen,setSideOpen]=useState(false);

  // Sync Firebase Auth with App State
  useEffect(()=>{
    if(firebaseUser){
      const email = firebaseUser.email.toLowerCase();
      
      // SOLO estos correos específicos tendrán los roles especiales.
      // Cualquier otro correo que se registre será Cliente.
      let assignedRole = "cliente";
      let assignedCargo = "Residente / Administrador Comunidad";

      if (email === "administrador@saschile.cl" || email === "admin@saschile.cl") {
        assignedRole = "administrador";
        assignedCargo = "Jefe de Operaciones";
      } else if (email === "tecnico@saschile.cl" || email === "tecnico1@saschile.cl") {
        assignedRole = "tecnico";
        assignedCargo = "Técnico de Terreno";
      }

      // Generar un nombre a partir del correo si no hay nombre guardado
      const rawName = email.split("@")[0];
      const fallbackName = rawName.charAt(0).toUpperCase() + rawName.slice(1).replace(/[0-9._]/g, ' ');

      setUser({
        email: email, 
        name: firebaseUser.displayName || fallbackName, 
        role: assignedRole, 
        cargo: assignedCargo
      });
    } else {
      setUser(null);
    }
  },[firebaseUser]);

  const handleLogout = () => {
    signOut(auth);
  };

  const[elevs,setElevs]=useState(ELEVATORS_DATA);
  const[maints,setMaints]=useState(MAINTENANCES_DATA);
  const[clients,setClients]=useState(CLIENTS_DATA);
  const[techs,setTechs]=useState(TECHNICIANS_DATA);
  const[alerts,setAlerts]=useState(ALERTS_DATA);
  const[notif,setNotif]=useState(null);
  const[selected,setSelected]=useState(null);
  const[modalType,setModalType]=useState(null);
  const[filter,setFilter]=useState("todos");
  const[showForm,setShowForm]=useState(false);
  const[nm,setNm]=useState({title:"",building:"",technician:"",type:"preventiva",date:"",priority:"normal"});

  if(authLoading) {
    return <div style={{height:"100vh",background:"#050a14",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"'Outfit'"}}>Cargando sistema seguro...</div>;
  }

  if(!user) return <LoginScreen />;

  const toast=(msg,color="#34d399")=>{setNotif({msg,color});setTimeout(()=>setNotif(null),3200);};
  const role=user.role;

  const ops=elevs.filter(e=>e.status==="operativo").length;
  const mant=elevs.filter(e=>e.status==="mantencion").length;
  const alrt=elevs.filter(e=>e.status==="alerta").length;
  const fuera=elevs.filter(e=>e.status==="fuera").length;
  const unreadAlerts=alerts.filter(a=>!a.read).length;

  // --- NAVIGATION (RBAC filters) ---
  const NAV=[
    {id:"dashboard",icon:"chart",label:"Panel General"},
    {id:"ascensores",icon:"elevator",label:"Ascensores"},
    {id:"mantenciones",icon:"wrench",label:"Mantenciones"},
    {id:"alertas",icon:"bell",label:"Alertas", badge:unreadAlerts},
    ...(role !== "cliente" ? [{id:"informes",icon:"reports",label:"Informes"}] : []),
    ...(role === "administrador" ? [{id:"clientes",icon:"building",label:"Clientes"}] : []),
    ...(role === "administrador" ? [{id:"tecnicos",icon:"users",label:"Técnicos"}] : []),
  ];

  const viewTitle={
    dashboard:    role==="administrador"?"Panel General":role==="tecnico"?"Mi Panel":"Mi Panel",
    ascensores:   role==="cliente"?"Mis Ascensores":"Ascensores",
    mantenciones: role==="tecnico"?"Mis Tareas":role==="cliente"?"Historial":"Mantenciones",
    clientes:     "Gestión de Clientes",
    tecnicos:     "Gestión de Técnicos",
    alertas:      "Centro de Alertas",
    informes:     "Informes",
  }[view]||"Panel";

  const filteredElevs=filter==="todos"?elevs:elevs.filter(e=>e.status===filter);
  const pieData=[{name:"Operativos",value:ops,color:"#34d399"},{name:"Mantención",value:mant,color:"#fbbf24"},{name:"Alerta",value:alrt,color:"#f87171"},{name:"Fuera",value:fuera,color:"#94a3b8"}];
  const inp2={width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,color:"#e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif"};

  // My tasks for technician
  const myMaints=role==="tecnico"?maints.filter(m=>m.technician===user.name):maints;
  // Client elevators
  const myElevs=role==="cliente"?elevs.filter(e=>e.client===clients.find(c=>c.contact===user.name)?.name):elevs;

  const updateMaint=(id,action,idx)=>setMaints(prev=>prev.map(m=>{
    if(m.id!==id)return m;
    if(action==="toggle"){const cl=[...m.checklist];cl[idx]={...cl[idx],done:!cl[idx].done};return{...m,checklist:cl};}
    if(action==="iniciar"){toast("Mantención iniciada correctamente.");setElevs(p=>p.map(e=>e.id===m.elevatorId?{...e,status:"en_progreso"}:e));return{...m,status:"en_progreso"};}
    if(action==="completar"){toast("Mantención completada con éxito.");setElevs(p=>p.map(e=>e.id===m.elevatorId?{...e,status:"operativo"}:e));return{...m,status:"completada"};}
    return m;
  }));

  const addMaint=()=>{
    if(!nm.title||!nm.building)return;
    setMaints(p=>[{id:Date.now(),elevatorId:1,type:nm.type,status:"programada",title:nm.title,building:nm.building,client:"—",technician:nm.technician||"Sin asignar",date:nm.date||"2025-01-01",priority:nm.priority,checklist:Array(10).fill(0).map((_,i)=>({item:`Tarea ${i+1}`,done:false}))}, ...p]);
    setShowForm(false);setNm({title:"",building:"",technician:"",type:"preventiva",date:"",priority:"normal"});
    toast("Mantención registrada correctamente.");
  };

  const markAlertRead=(id)=>setAlerts(prev=>prev.map(a=>a.id===id?{...a,read:true}:a));

  return(
    <div style={{minHeight:"100vh",background:"#050a14",color:"#f1f5f9",fontFamily:"'Outfit','Segoe UI',sans-serif",display:"flex",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1a263d;border-radius:2px}
        @keyframes rpl{to{transform:scale(4);opacity:0}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(26px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes blink{from{opacity:1}to{opacity:0.1}}
        @keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.55}}
        input::placeholder{color:#1e3a5f}
        input:focus{border-color:rgba(99,102,241,0.45)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1)!important}
        select{outline:none;cursor:pointer}
      `}</style>

      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.008) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.008) 1px,transparent 1px)",backgroundSize:"56px 56px",pointerEvents:"none"}}/>
      <div style={{position:"fixed",top:"8%",left:"18%",width:700,height:700,background:"radial-gradient(circle,rgba(30,64,175,0.05) 0%,transparent 65%)",pointerEvents:"none"}}/>

      {/* ── SIDEBAR ── */}
      <div style={{width:sideOpen?240:68,minHeight:"100vh",background:"linear-gradient(180deg,#030810 0%,#060c18 100%)",borderRight:"1px solid rgba(255,255,255,0.04)",transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",flexShrink:0,zIndex:100,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:sideOpen?"22px 18px 18px":"22px 14px 18px",borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"padding 0.3s"}}>
          <Logo collapsed={!sideOpen}/>
        </div>

        {/* User profile */}
        <div style={{padding:"13px 11px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:"linear-gradient(135deg,#1e3a8a,#4f46e5)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <I n={role==="administrador"?"star":role==="tecnico"?"tech":"user"} size={16} color="#fff"/>
            </div>
            {sideOpen&&<div>
              <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:150}}>{user.name}</div>
              <div style={{fontSize:10,color:"#334155",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.08em"}}>{role.toUpperCase()}</div>
            </div>}
          </div>
        </div>

        <nav style={{flex:1,padding:"10px 8px"}}>
          {NAV.map(item=>{
            const act=view===item.id;
            return(
              <div key={item.id} onClick={()=>{setView(item.id);setSideOpen(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 11px",borderRadius:11,cursor:"pointer",marginBottom:3,background:act?"linear-gradient(135deg,rgba(30,58,138,0.45),rgba(79,70,229,0.22))":"transparent",border:act?"1px solid rgba(79,70,229,0.28)":"1px solid transparent",transition:"all 0.22s ease",boxShadow:act?"0 4px 16px rgba(79,70,229,0.2)":"none",position:"relative"}}
                onMouseEnter={e=>!act&&(e.currentTarget.style.background="rgba(255,255,255,0.04)")}
                onMouseLeave={e=>!act&&(e.currentTarget.style.background="transparent")}
              >
                <I n={item.icon} size={17} color={act?"#818cf8":"#334155"} style={{filter:act?"drop-shadow(0 0 6px rgba(129,140,248,0.7))":"none",transition:"filter 0.2s"}}/>
                {sideOpen&&<span style={{fontSize:13,fontWeight:500,color:act?"#c7d2fe":"#334155",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif"}}>{item.label}</span>}
                {item.badge>0&&<div style={{position:"absolute",top:8,right:sideOpen?12:8,width:16,height:16,background:"#ef4444",borderRadius:"50%",fontSize:9,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{item.badge}</div>}
              </div>
            );
          })}
        </nav>

        <div style={{padding:"14px 8px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
          <div onClick={handleLogout} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 11px",borderRadius:11,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
          >
            <I n="logout" size={17} color="#475569"/>
            {sideOpen&&<span style={{fontSize:13,fontWeight:500,color:"#475569",fontFamily:"'Outfit',sans-serif"}}>Cerrar Sesión</span>}
          </div>
          <button onClick={()=>setSideOpen(!sideOpen)} style={{width:"100%",padding:"8px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,color:"#1e3a5f",cursor:"pointer",fontSize:13,transition:"all 0.2s",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",marginTop:6}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.color="#64748b";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.color="#1e3a5f";}}
          ><I n={sideOpen?"chevL":"chevR"} size={14} color="#334155"/></button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"auto"}}>
        {/* Topbar */}
        <div style={{padding:"15px 32px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(5,10,20,0.92)",backdropFilter:"blur(18px)",position:"sticky",top:0,zIndex:50}}>
          <div>
            <div style={{fontSize:20,fontWeight:700,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.04em",color:"#f1f5f9"}}>{viewTitle}</div>
            <div style={{fontSize:11,color:"#1e3a5f",marginTop:3,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:6}}>
              <I n={role==="administrador"?"star":role==="tecnico"?"tech":"user"} size={11} color="#1e3a5f"/>
              {user.name} · {user.cargo} · {new Date().toLocaleDateString("es-CL",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {alrt>0&&<div style={{background:"rgba(248,113,113,0.09)",border:"1px solid rgba(248,113,113,0.22)",borderRadius:8,padding:"6px 14px",fontSize:11,color:"#f87171",fontWeight:600,display:"flex",gap:6,alignItems:"center",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.08em",animation:"pulse 2.5s infinite"}}><I n="alert" size={12} color="#f87171"/>{alrt} ALERTA{alrt>1?"S":""}</div>}
            <div style={{width:38,height:38,background:"linear-gradient(135deg,#1e3a8a,#4f46e5)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 16px rgba(79,70,229,0.4)"}}>
              <I n={role==="administrador"?"star":role==="tecnico"?"tech":"user"} size={16} color="#fff"/>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{padding:32,flex:1}}>

          {/* ── DASHBOARD ── */}
          {view==="dashboard"&&(
            <div style={{animation:"fadeIn 0.4s ease"}}>
              {/* Greeting */}
              <div style={{background:"linear-gradient(135deg,rgba(30,64,175,0.15),rgba(99,102,241,0.1))",borderRadius:18,padding:"24px 28px",marginBottom:24,border:"1px solid rgba(99,102,241,0.15)"}}>
                <div style={{fontSize:22,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>Bienvenido, {user.name.split(" ")[0]}</div>
                <div style={{fontSize:13,color:"#64748b",marginTop:4,fontFamily:"'Outfit',sans-serif"}}>{user.cargo} · SAS Chile Gestión de Ascensores</div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16,marginBottom:28}}>
                {role!=="cliente"&&<>
                  <StatCard label="Total Ascensores" value={elevs.length} icon="elevator" color="#6366f1" sub="en sistema"/>
                  <StatCard label="Operativos"       value={ops}         icon="check"    color="#34d399" sub={`${Math.round(ops/elevs.length*100)}% del parque`}/>
                  <StatCard label="En Mantención"    value={mant}        icon="wrench"   color="#fbbf24" sub="en proceso"/>
                  <StatCard label="Alertas Activas"  value={alrt}        icon="alert"    color="#f87171" sub="requieren atención"/>
                </>}
                {role==="administrador"&&<StatCard label="Clientes Activos" value={clients.length} icon="building" color="#60a5fa" sub="en cartera"/>}
                {role==="tecnico"&&<StatCard label="Mis Tareas" value={myMaints.filter(m=>m.status!=="completada").length} icon="clipboard" color="#fbbf24" sub="pendientes"/>}
                {role==="cliente"&&<>
                  <StatCard label="Mis Ascensores" value={myElevs.length} icon="elevator" color="#6366f1" sub="en contrato"/>
                  <StatCard label="Operativos" value={myElevs.filter(e=>e.status==="operativo").length} icon="check" color="#34d399" sub="funcionando"/>
                  <StatCard label="Con Alerta" value={myElevs.filter(e=>e.status!=="operativo").length} icon="alert" color="#f87171" sub="requieren atención"/>
                </>}
              </div>

              {role!=="cliente"&&<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:22}}>
                  <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,0.04)"}}>
                    <ST>Mantenciones por Mes</ST>
                    <ResponsiveContainer width="100%" height={175}>
                      <BarChart data={MONTHLY} barSize={14} barGap={4}>
                        <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)"/>
                        <XAxis dataKey="mes" tick={{fill:"#1e3a5f",fontSize:11,fontFamily:"Outfit"}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:"#1e3a5f",fontSize:11,fontFamily:"Outfit"}} axisLine={false} tickLine={false}/>
                        <Tooltip contentStyle={{background:"#080e1c",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#f1f5f9",fontFamily:"Outfit",fontSize:12}}/>
                        <Bar dataKey="mantenciones" fill="#4f46e5" radius={[4,4,0,0]}/>
                        <Bar dataKey="alertas"      fill="#f87171" radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,0.04)"}}>
                    <ST>Estado del Parque</ST>
                    <div style={{display:"flex",alignItems:"center",gap:20}}>
                      <ResponsiveContainer width={145} height={145}>
                        <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={64} dataKey="value" strokeWidth={0}>{pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart>
                      </ResponsiveContainer>
                      <div style={{flex:1,display:"flex",flexDirection:"column",gap:11}}>
                        {pieData.map(d=>(<div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:d.color,boxShadow:`0 0 6px ${d.color}`}}/><span style={{fontSize:12,color:"#475569",fontFamily:"'Outfit',sans-serif"}}>{d.name}</span></div>
                          <span style={{fontSize:16,fontWeight:700,color:d.color,fontFamily:"'Outfit',sans-serif"}}>{d.value}</span>
                        </div>))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts summary */}
                <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,0.04)"}}>
                  <ST>Equipos que Requieren Atención</ST>
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    {elevs.filter(e=>e.status!=="operativo").map(e=>{
                      const cfg=SC[e.status];
                      return(
                        <div key={e.id} onClick={()=>{setSelected(e);setModalType("elevator");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",background:"rgba(255,255,255,0.02)",borderRadius:11,border:`1px solid ${cfg.color}14`,cursor:"pointer",transition:"all 0.22s"}}
                          onMouseEnter={ev=>{ev.currentTarget.style.background=cfg.bg;ev.currentTarget.style.borderColor=`${cfg.color}38`;ev.currentTarget.style.transform="translateX(5px)";}}
                          onMouseLeave={ev=>{ev.currentTarget.style.background="rgba(255,255,255,0.02)";ev.currentTarget.style.borderColor=`${cfg.color}14`;ev.currentTarget.style.transform="translateX(0)";}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>{e.name} · {e.building}</div>
                            <div style={{fontSize:11,color:"#334155",fontFamily:"'Outfit',sans-serif",marginTop:2}}>{e.brand} {e.model} · {e.location}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <Badge label={cfg.label} color={cfg.color}/>
                            <I n="eye" size={14} color="#334155"/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>}

              {/* Tecnico: my tasks summary */}
              {role==="tecnico"&&(
                <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,0.04)"}}>
                  <ST>Mis Tareas Pendientes</ST>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    {myMaints.filter(m=>m.status!=="completada").slice(0,3).map(m=>(
                      <MaintCard key={m.id} maint={m} onUpdate={updateMaint} role={role} user={user}/>
                    ))}
                    {myMaints.filter(m=>m.status!=="completada").length===0&&<div style={{textAlign:"center",padding:"24px 0",color:"#334155",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>No tienes tareas pendientes.</div>}
                  </div>
                </div>
              )}

              {/* Cliente: mis ascensores summary */}
              {role==="cliente"&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
                  {myElevs.map(e=>{
                    const cfg=SC[e.status];
                    return(
                      <div key={e.id} onClick={()=>{setSelected(e);setModalType("elevator");}} style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",border:`1px solid ${cfg.color}20`,borderRadius:18,padding:22,cursor:"pointer",transition:"all 0.3s"}}
                        onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-4px)";ev.currentTarget.style.boxShadow=`0 20px 40px ${cfg.glow}`;}}
                        onMouseLeave={ev=>{ev.currentTarget.style.transform="translateY(0)";ev.currentTarget.style.boxShadow="none";}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                          <div>
                            <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>{e.name}</div>
                            <div style={{fontSize:12,color:"#475569",fontFamily:"'Outfit',sans-serif",marginTop:2}}>{e.building}</div>
                          </div>
                          <Badge label={cfg.label} color={cfg.color}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                          <div style={{fontSize:11,color:"#334155",fontFamily:"'Outfit',sans-serif"}}>{e.brand} · {e.model}</div>
                          <Shaft elev={e}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ASCENSORES ── */}
          {view==="ascensores"&&(
            <div style={{animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[["todos",`Todos (${elevs.length})`],["operativo",`Operativos (${ops})`],["mantencion",`Mantención (${mant})`],["alerta",`Alerta (${alrt})`],["fuera",`Fuera (${fuera})`]].map(([s,lbl])=>(
                    <button key={s} onClick={()=>setFilter(s)} style={{padding:"7px 16px",borderRadius:8,border:filter===s?"1px solid rgba(79,70,229,0.4)":"1px solid rgba(255,255,255,0.07)",cursor:"pointer",background:filter===s?"linear-gradient(135deg,#1e3a8a,#4f46e5)":"rgba(255,255,255,0.03)",color:filter===s?"#fff":"#334155",fontSize:12,fontWeight:500,fontFamily:"'Outfit',sans-serif",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",transform:filter===s?"scale(1.04)":"scale(1)",boxShadow:filter===s?"0 4px 16px rgba(79,70,229,0.4)":"none"}}
                      onMouseEnter={e=>filter!==s&&(e.currentTarget.style.background="rgba(255,255,255,0.06)")}
                      onMouseLeave={e=>filter!==s&&(e.currentTarget.style.background="rgba(255,255,255,0.03)")}
                    >{lbl}</button>
                  ))}
                </div>
                {role==="administrador"&&<Btn variant="primary" onClick={()=>toast("Funcionalidad: agregar nuevo ascensor")}><I n="plus" size={14} color="#fff"/>Nuevo Ascensor</Btn>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:20}}>
                {filteredElevs
                  .filter(e => role === "cliente" ? e.client === clients.find(c => c.contact === user.name)?.name : true)
                  .map(e=>{
                  const cfg=SC[e.status];
                  return(
                    <div key={e.id} onClick={()=>{setSelected(e);setModalType("elevator");}} style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",border:`1px solid ${cfg.color}20`,borderRadius:20,padding:22,cursor:"pointer",transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",position:"relative",overflow:"hidden"}}
                      onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-6px) scale(1.01)";ev.currentTarget.style.boxShadow=`0 24px 50px ${cfg.glow}`;ev.currentTarget.style.borderColor=`${cfg.color}50`;}}
                      onMouseLeave={ev=>{ev.currentTarget.style.transform="translateY(0) scale(1)";ev.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.4)";ev.currentTarget.style.borderColor=`${cfg.color}20`;}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                        <div>
                          <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",marginBottom:3}}>{e.name}</div>
                          <div style={{fontSize:12,color:"#475569",fontFamily:"'Outfit',sans-serif"}}>{e.building}</div>
                        </div>
                        <Badge label={cfg.label} color={cfg.color}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                        <div>
                          <div style={{fontSize:11,color:"#1e3a5f",marginBottom:12,fontFamily:"'Outfit',sans-serif"}}>{e.brand} · {e.model}</div>
                          <div style={{display:"flex",gap:18}}>
                            {[["CARGA",`${e.load}%`,cfg.color],["PISOS",e.floors,"#64748b"],["VIAJES",e.trips.toLocaleString(),"#64748b"]].map(([l,v,c])=>(
                              <div key={l} style={{textAlign:"center"}}>
                                <div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"'Outfit',sans-serif",lineHeight:1}}>{v}</div>
                                <div style={{fontSize:9,color:"#1e3a5f",letterSpacing:"0.15em",marginTop:3,fontFamily:"'Outfit',sans-serif",fontWeight:500}}>{l}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Shaft elev={e}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── MANTENCIONES ── */}
          {view==="mantenciones"&&(
            <div style={{animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <div style={{fontSize:12,color:"#1e3a5f",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>{(role==="tecnico"?myMaints:maints).length} REGISTROS</div>
                {role === "administrador" && <Btn variant="primary" onClick={()=>setShowForm(true)}><I n="plus" size={14} color="#fff"/>Nueva Mantención</Btn>}
              </div>
              {showForm&&role==="administrador"&&(
                <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:24,marginBottom:22,border:"1px solid rgba(99,102,241,0.2)",animation:"slideUp 0.3s ease"}}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:18,color:"#c7d2fe",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.05em"}}>NUEVA MANTENCIÓN</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                    <input style={inp2} placeholder="Título de la mantención" value={nm.title}      onChange={e=>setNm(p=>({...p,title:e.target.value}))}/>
                    <input style={inp2} placeholder="Edificio / Instalación"  value={nm.building}   onChange={e=>setNm(p=>({...p,building:e.target.value}))}/>
                    <input style={inp2} placeholder="Técnico asignado"        value={nm.technician} onChange={e=>setNm(p=>({...p,technician:e.target.value}))}/>
                    <input style={{...inp2,colorScheme:"dark"}} type="date"   value={nm.date}       onChange={e=>setNm(p=>({...p,date:e.target.value}))}/>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                    {["preventiva","correctiva"].map(t=>(<button key={t} onClick={()=>setNm(p=>({...p,type:t}))} style={{padding:"7px 18px",borderRadius:8,cursor:"pointer",background:nm.type===t?(t==="preventiva"?"rgba(99,102,241,0.2)":"rgba(248,113,113,0.18)"):"rgba(255,255,255,0.03)",color:nm.type===t?"#fff":"#334155",border:nm.type===t?(t==="preventiva"?"1px solid rgba(99,102,241,0.4)":"1px solid rgba(248,113,113,0.4)"):"1px solid transparent",fontSize:12,fontWeight:600,letterSpacing:"0.08em",transition:"all 0.2s",fontFamily:"'Outfit',sans-serif"}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>))}
                    <div style={{flex:1}}/>
                    <Btn variant="ghost" small onClick={()=>setShowForm(false)}>Cancelar</Btn>
                    <Btn variant="success" small onClick={addMaint}><I n="check" size={13} color="#fff"/>Guardar</Btn>
                  </div>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {maints
                  .filter(m => {
                    if (role === "cliente") {
                      const clientElevators = myElevs.map(e => e.id);
                      return clientElevators.includes(m.elevatorId);
                    }
                    if (role === "tecnico") {
                      return m.technician === user.name;
                    }
                    return true;
                  })
                  .map(m=><MaintCard key={m.id} maint={m} onUpdate={updateMaint} readOnly={role==="cliente"} role={role} user={user}/>)}
              </div>
            </div>
          )}

          {/* ── CLIENTES (solo admin) ── */}
          {view==="clientes"&&role==="administrador"&&(
            <div style={{animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <div style={{fontSize:12,color:"#1e3a5f",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>{clients.length} CLIENTES EN CARTERA</div>
                <Btn variant="primary" onClick={()=>toast("Funcionalidad: agregar nuevo cliente")}><I n="plus" size={14} color="#fff"/>Nuevo Cliente</Btn>
              </div>
              <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,border:"1px solid rgba(255,255,255,0.04)",overflow:"hidden"}}>
                <Table
                  headers={["Cliente","RUT","Contacto","Edificios","Ascensores","Zona","Estado","Contrato"]}
                  rows={clients.map(c=>[
                    c.name,c.rut,c.contact,c.buildings,c.elevators,c.zone,
                    <Badge label={c.status} color={c.status==="activo"?"#34d399":"#f87171"}/>,
                    c.contract
                  ])}
                  onRowClick={c=>toast(`Cliente: ${clients[c]?.name||"—"}`)}
                />
              </div>
            </div>
          )}

          {/* ── TÉCNICOS (solo admin) ── */}
          {view==="tecnicos"&&role==="administrador"&&(
            <div style={{animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <div style={{fontSize:12,color:"#1e3a5f",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>{techs.length} TÉCNICOS REGISTRADOS</div>
                <Btn variant="primary" onClick={()=>toast("Funcionalidad: agregar nuevo técnico")}><I n="plus" size={14} color="#fff"/>Nuevo Técnico</Btn>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
                {techs.map(t=>(
                  <div key={t.id} style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:22,border:"1px solid rgba(255,255,255,0.05)",transition:"all 0.3s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 32px rgba(0,0,0,0.4)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                      <div style={{width:44,height:44,background:"linear-gradient(135deg,#1e3a8a,#4f46e5)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <I n="tech" size={20} color="#fff"/>
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>{t.name}</div>
                        <div style={{fontSize:11,color:"#475569",fontFamily:"'Outfit',sans-serif"}}>{t.email}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {[["RUT",t.rut],["Teléfono",t.phone],["Zona",t.zone]].map(([k,v])=>(
                        <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,fontFamily:"'Outfit',sans-serif"}}>
                          <span style={{color:"#475569"}}>{k}</span>
                          <span style={{color:"#94a3b8",fontWeight:500}}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:10,color:"#334155",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>COMPLETADAS</span>
                        <span style={{fontSize:12,fontWeight:700,color:"#34d399",fontFamily:"'Outfit',sans-serif"}}>{t.completed}/{t.tasks}</span>
                      </div>
                      <div style={{height:5,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${Math.round(t.completed/t.tasks*100)}%`,background:"linear-gradient(90deg,#065f46,#34d399)",borderRadius:3}}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ALERTAS ── */}
          {view==="alertas"&&(
            <div style={{animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <div style={{fontSize:12,color:"#1e3a5f",letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>{alerts.length} ALERTAS · {unreadAlerts} SIN LEER</div>
                {unreadAlerts>0&&<Btn variant="ghost" small onClick={()=>setAlerts(p=>p.map(a=>({...a,read:true})))}><I n="check" size={13} color="#64748b"/>Marcar todas como leídas</Btn>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {alerts.map(a=>{
                  const sc={alta:"#f87171",media:"#fbbf24",baja:"#60a5fa"}[a.severity];
                  return(
                    <div key={a.id} onClick={()=>markAlertRead(a.id)} style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:14,padding:20,border:`1px solid ${a.read?"rgba(255,255,255,0.04)":`${sc}28`}`,cursor:"pointer",opacity:a.read?0.6:1,transition:"all 0.22s"}}
                      onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.borderColor=`${sc}44`;}}
                      onMouseLeave={e=>{e.currentTarget.style.opacity=a.read?"0.6":"1";e.currentTarget.style.borderColor=a.read?"rgba(255,255,255,0.04)":`${sc}28`;}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          {!a.read&&<div style={{width:8,height:8,borderRadius:"50%",background:sc,boxShadow:`0 0 8px ${sc}`,animation:"blink 1.5s infinite alternate",flexShrink:0}}/>}
                          <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>{a.title}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <Badge label={a.severity} color={sc}/>
                          <span style={{fontSize:11,color:"#334155",fontFamily:"'Outfit',sans-serif"}}>{a.date}</span>
                        </div>
                      </div>
                      <div style={{fontSize:12,color:"#475569",fontFamily:"'Outfit',sans-serif",marginBottom:6}}>{a.building}</div>
                      <div style={{fontSize:13,color:"#64748b",fontFamily:"'Outfit',sans-serif"}}>{a.message}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── INFORMES ── */}
          {view==="informes"&&(
            <div style={{animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18,marginBottom:28}}>
                {[
                  {title:"Tasa de Operatividad",   value:`${Math.round(ops/elevs.length*100)}%`, desc:`${ops} de ${elevs.length} ascensores activos`, color:"#34d399",icon:"chart"},
                  {title:"Mantenciones Este Mes",   value:"8",    desc:"3 correctivas · 5 preventivas",    color:"#6366f1",icon:"wrench"},
                  {title:"Tiempo Prom. Resolución", value:"4.2h", desc:"Mantenciones correctivas",          color:"#fbbf24",icon:"speed"},
                  {title:"Equipos con Alerta",      value:alrt+fuera, desc:"Requieren atención urgente",  color:"#f87171",icon:"alert"},
                ].map(r=>(
                  <div key={r.title} style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",border:`1px solid ${r.color}14`,borderRadius:16,padding:26,transition:"all 0.3s",cursor:"default"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 22px 44px ${r.color}12`;e.currentTarget.style.borderColor=`${r.color}30`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=`${r.color}14`;}}>
                    <I n={r.icon} size={24} color={r.color} style={{marginBottom:14,opacity:0.8}}/>
                    <div style={{fontSize:10,color:"#334155",letterSpacing:"0.14em",fontWeight:500,marginBottom:4,fontFamily:"'Outfit',sans-serif"}}>{r.title.toUpperCase()}</div>
                    <div style={{fontSize:44,fontWeight:700,color:r.color,fontFamily:"'Outfit',sans-serif",lineHeight:1}}>{r.value}</div>
                    <div style={{fontSize:12,color:"#1e3a5f",marginTop:8,fontFamily:"'Outfit',sans-serif"}}>{r.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,0.04)",marginBottom:22}}>
                <ST>Tendencia de Operatividad</ST>
                <ResponsiveContainer width="100%" height={145}>
                  <LineChart data={MONTHLY}>
                    <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)"/>
                    <XAxis dataKey="mes" tick={{fill:"#1e3a5f",fontSize:11,fontFamily:"Outfit"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#1e3a5f",fontSize:11,fontFamily:"Outfit"}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{background:"#080e1c",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#f1f5f9",fontFamily:"Outfit",fontSize:12}}/>
                    <Line type="monotone" dataKey="operativos"   stroke="#34d399" strokeWidth={2.5} dot={{fill:"#34d399",r:4,strokeWidth:0}}/>
                    <Line type="monotone" dataKey="mantenciones" stroke="#6366f1" strokeWidth={2.5} dot={{fill:"#6366f1",r:4,strokeWidth:0}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{background:"linear-gradient(145deg,#080e1c,#0d1628)",borderRadius:16,padding:24,border:"1px solid rgba(255,255,255,0.04)"}}>
                <ST>Resumen por Edificio</ST>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {[...new Set(elevs.map(e=>e.building))].map(b=>{
                    const be=elevs.filter(e=>e.building===b);
                    const bo=be.filter(e=>e.status==="operativo").length;
                    return(
                      <div key={b} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",background:"rgba(255,255,255,0.02)",borderRadius:11,border:"1px solid rgba(255,255,255,0.03)",transition:"all 0.22s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.transform="translateX(5px)";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.transform="translateX(0)";}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <I n="building" size={14} color="#1e3a5f"/>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>{b}</div>
                            <div style={{fontSize:11,color:"#1e3a5f",fontFamily:"'Outfit',sans-serif"}}>{be.length} ascensor{be.length>1?"es":""}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:7}}>{be.map(e=>{const c=SC[e.status];return<div key={e.id} style={{width:10,height:10,borderRadius:"50%",background:c.color,boxShadow:`0 0 7px ${c.glow}`}}/>;})}</div>
                        <div style={{fontSize:14,fontWeight:700,color:bo===be.length?"#34d399":"#fbbf24",fontFamily:"'Outfit',sans-serif"}}>{bo}/{be.length} Activos</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ELEVATOR DETAIL MODAL ── */}
      {selected&&modalType==="elevator"&&(
        <Modal title={selected.name} onClose={()=>{setSelected(null);setModalType(null);}}>
          {(()=>{
            const cfg=SC[selected.status];
            return(
              <>
                <div style={{fontSize:13,color:"#475569",marginBottom:20,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:6}}><I n="pin" size={12} color="#475569"/>{selected.building} · {selected.location}</div>
                <div style={{display:"flex",gap:20,marginBottom:22}}>
                  <Shaft elev={selected} large/>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
                    {[["Marca",selected.brand],["Modelo",selected.model],["N° Serie",selected.serial],["Técnico",selected.technician],["Velocidad",`${selected.speed} m/s`],["Total viajes",selected.trips.toLocaleString()]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 13px",background:"rgba(255,255,255,0.025)",borderRadius:9,border:"1px solid rgba(255,255,255,0.04)"}}>
                        <span style={{fontSize:11,color:"#475569",fontFamily:"'Outfit',sans-serif"}}>{k}</span>
                        <span style={{fontSize:12,color:"#e2e8f0",fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:10,color:"#475569",letterSpacing:"0.15em",fontFamily:"'Outfit',sans-serif"}}>CARGA DEL SISTEMA</span>
                    <span style={{fontSize:13,color:cfg.color,fontWeight:700,fontFamily:"'Outfit',sans-serif"}}>{selected.load}%</span>
                  </div>
                  <div style={{height:8,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${selected.load}%`,background:`linear-gradient(90deg,${cfg.color}55,${cfg.color})`,borderRadius:4,boxShadow:`0 0 10px ${cfg.glow}`,transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)"}}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[["Última mantención",selected.lastMaint],["Próxima mantención",selected.nextMaint]].map(([l,v])=>(
                    <div key={l} style={{background:"rgba(255,255,255,0.025)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.04)"}}>
                      <div style={{fontSize:11,color:"#334155",marginBottom:6,fontFamily:"'Outfit',sans-serif"}}>{l}</div>
                      <div style={{fontSize:15,color:"#f1f5f9",fontWeight:700,fontFamily:"'Outfit',sans-serif"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </Modal>
      )}

      {/* Toast */}
      {notif&&(
        <div style={{position:"fixed",bottom:28,right:28,zIndex:2000,background:"linear-gradient(135deg,#080e1c,#0d1628)",border:`1px solid ${notif.color}38`,borderRadius:14,padding:"14px 22px",boxShadow:`0 24px 48px rgba(0,0,0,0.65),0 0 24px ${notif.color}14`,animation:"toastIn 0.38s cubic-bezier(0.34,1.56,0.64,1)",fontSize:13,fontWeight:500,color:notif.color,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.03em",display:"flex",alignItems:"center",gap:10}}>
          <I n="check" size={15} color={notif.color}/>{notif.msg}
        </div>
      )}
    </div>
  );
}
