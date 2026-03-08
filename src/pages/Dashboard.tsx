import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, MapPin, Bell, Users, TrendingUp, AlertTriangle,
  ArrowLeft, Activity, Eye, BarChart3, FileText, Brain,
  ChevronDown, Clock, CheckCircle, XCircle, Filter,
  Download, Calendar, Sun, Moon
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

type Tab = "heatmap" | "analytics" | "alerts" | "reports" | "trends";

const Dashboard = () => {
  const [tab, setTab] = useState<Tab>("heatmap");
  const [clock, setClock] = useState(new Date());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "heatmap", label: "Safety Heatmap", icon: MapPin },
    { id: "analytics", label: "Crime Analytics", icon: BarChart3 },
    { id: "alerts", label: "Emergency Alerts", icon: Bell },
    { id: "reports", label: "Community Reports", icon: FileText },
    { id: "trends", label: "Safety Trends", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border glass-dark sticky top-0 h-screen">
        <div className="p-5 border-b border-border/30">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-xl">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-primary-foreground">SheGuard</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "gradient-primary text-primary-foreground shadow-glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border/30">
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-border glass sticky top-0 z-50">
          <div className="px-6 flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="lg:hidden flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="lg:hidden flex items-center gap-2">
                <div className="gradient-primary p-1.5 rounded-lg">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-foreground">SheGuard</span>
              </div>
              <h1 className="hidden lg:block font-display font-bold text-foreground text-lg">City Safety Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground font-mono">
                {clock.toLocaleTimeString()}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors"
              >
                {theme === "light" ? <Moon className="h-4 w-4 theme-toggle" /> : <Sun className="h-4 w-4 theme-toggle text-warning" />}
              </button>
              <button className="glass px-3 py-1.5 rounded-lg text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
                <Download className="h-3 w-3" /> Export
              </button>
            </div>
          </div>
        </header>

        {/* Mobile tabs */}
        <div className="lg:hidden flex gap-2 p-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? "gradient-primary text-primary-foreground shadow-glow-primary"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6">
          {/* Top stats */}
          <LiveStats />

          {/* Content */}
          <div className="mt-6">
            {tab === "heatmap" && <HeatmapPanel />}
            {tab === "analytics" && <AnalyticsPanel />}
            {tab === "alerts" && <AlertsPanel />}
            {tab === "reports" && <ReportsPanel />}
            {tab === "trends" && <TrendsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveStats = () => {
  const [stats, setStats] = useState([
    { label: "Active Alerts", value: 23, change: "-12%", icon: Bell, color: "text-danger" },
    { label: "Safety Score", value: 78.4, change: "+5.2%", icon: Shield, color: "text-safe" },
    { label: "Reports Today", value: 156, change: "+8%", icon: FileText, color: "text-primary" },
    { label: "Active Patrols", value: 42, change: "+3", icon: Users, color: "text-secondary" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((s) => ({
          ...s,
          value: s.label === "Safety Score"
            ? Math.round((s.value + (Math.random() - 0.5) * 0.4) * 10) / 10
            : Math.max(0, Math.round(s.value + (Math.random() - 0.5) * 3)),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <span className={`text-xs font-medium ${s.change.startsWith("+") && s.label !== "Active Alerts" ? "text-safe" : s.change.startsWith("-") ? "text-safe" : "text-danger"}`}>{s.change}</span>
          </div>
          <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const heatmapZones = [
  { id: 1, x: 5, y: 5, w: 28, h: 28, risk: "low", name: "Residential North", score: 89 },
  { id: 2, x: 36, y: 5, w: 28, h: 28, risk: "medium", name: "Market District", score: 64 },
  { id: 3, x: 67, y: 5, w: 28, h: 28, risk: "low", name: "University Area", score: 88 },
  { id: 4, x: 5, y: 36, w: 28, h: 28, risk: "high", name: "Downtown East", score: 34 },
  { id: 5, x: 36, y: 36, w: 28, h: 28, risk: "low", name: "Central Park", score: 91 },
  { id: 6, x: 67, y: 36, w: 28, h: 28, risk: "medium", name: "Transit Hub", score: 58 },
  { id: 7, x: 5, y: 67, w: 28, h: 28, risk: "low", name: "Tech Campus", score: 95 },
  { id: 8, x: 36, y: 67, w: 28, h: 28, risk: "high", name: "Industrial Zone", score: 29 },
  { id: 9, x: 67, y: 67, w: 28, h: 28, risk: "medium", name: "Harbor Area", score: 55 },
];

const HeatmapPanel = () => {
  const [selected, setSelected] = useState<typeof heatmapZones[0] | null>(null);

  const riskFill = (risk: string) => {
    if (risk === "low") return "hsla(150, 60%, 50%, 0.35)";
    if (risk === "medium") return "hsla(40, 90%, 55%, 0.35)";
    return "hsla(0, 80%, 55%, 0.4)";
  };

  const riskStroke = (risk: string) => {
    if (risk === "low") return "hsl(150, 60%, 50%)";
    if (risk === "medium") return "hsl(40, 90%, 55%)";
    return "hsl(0, 80%, 55%)";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold text-foreground">City Safety Heatmap</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> Live — Updated every 30s
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-muted/50 to-muted p-4">
          <svg viewBox="0 0 100 100" className="w-full h-[420px]" preserveAspectRatio="xMidYMid meet">
            {Array.from({ length: 11 }).map((_, i) => (
              <g key={i}>
                <line x1={i * 10} y1={0} x2={i * 10} y2={100} stroke="var(--map-grid)" strokeWidth="0.15" />
                <line x1={0} y1={i * 10} x2={100} y2={i * 10} stroke="var(--map-grid)" strokeWidth="0.15" />
              </g>
            ))}
            <line x1="0" y1="34" x2="100" y2="34" stroke="var(--map-road)" strokeWidth="0.4" strokeDasharray="1" />
            <line x1="0" y1="65" x2="100" y2="65" stroke="var(--map-road)" strokeWidth="0.4" strokeDasharray="1" />
            <line x1="34" y1="0" x2="34" y2="100" stroke="var(--map-road)" strokeWidth="0.4" strokeDasharray="1" />
            <line x1="65" y1="0" x2="65" y2="100" stroke="var(--map-road)" strokeWidth="0.4" strokeDasharray="1" />

            {heatmapZones.map((z) => (
              <g key={z.id} onClick={() => setSelected(z)} className="cursor-pointer">
                <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="2" fill={riskFill(z.risk)} stroke={riskStroke(z.risk)} strokeWidth={selected?.id === z.id ? "0.8" : "0.3"} className="hover:opacity-80 transition-all" />
                <text x={z.x + z.w / 2} y={z.y + z.h / 2 - 2} textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="var(--map-text)" fontWeight="700" fontFamily="var(--font-display)">{z.name}</text>
                <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 4} textAnchor="middle" dominantBaseline="middle" fontSize="2" fill="var(--map-text-secondary)">Score: {z.score}</text>
                {z.risk === "high" && (
                  <circle cx={z.x + z.w - 4} cy={z.y + 4} r="1.5" fill="hsl(0, 80%, 55%)">
                    <animate attributeName="r" from="1" to="3" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            ))}
          </svg>
          <div className="absolute bottom-6 left-6 glass rounded-xl p-3 flex gap-4">
            {[
              { color: "bg-safe", label: "Safe" },
              { color: "bg-warning", label: "Moderate" },
              { color: "bg-danger", label: "High Risk" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                <span className="text-xs text-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selected && (
          <motion.div key={selected.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <h4 className="font-display font-bold text-foreground">{selected.name}</h4>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Safety Score</span>
                <span className={`font-bold ${selected.score > 70 ? "text-safe" : selected.score > 50 ? "text-warning" : "text-danger"}`}>{selected.score}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted">
                <div className={`h-full rounded-full ${selected.score > 70 ? "gradient-safe" : selected.score > 50 ? "gradient-warning" : "gradient-danger"}`} style={{ width: `${selected.score}%` }} />
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Lighting</span><span className="text-foreground">{selected.score > 60 ? "Good" : "Poor"}</span></div>
              <div className="flex justify-between"><span>Foot Traffic</span><span className="text-foreground">{selected.score > 50 ? "Moderate" : "Low"}</span></div>
              <div className="flex justify-between"><span>Patrol Coverage</span><span className="text-foreground">{selected.score > 70 ? "High" : "Low"}</span></div>
            </div>
          </motion.div>
        )}

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-display font-bold text-foreground">AI Insights</h3>
          </div>
          {[
            "Downtown district safety improved 15% this week",
            "Park area incidents peak between 8-11 PM",
            "New lighting on 3rd St reduced reports by 40%",
          ].map((insight, i) => (
            <div key={i} className="flex items-start gap-2 mb-3 last:mb-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{insight}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-display font-bold text-foreground mb-4">Hotspot Zones</h3>
          {[
            { zone: "Downtown East", score: 34, risk: "High" },
            { zone: "Park District", score: 62, risk: "Moderate" },
            { zone: "Residential North", score: 89, risk: "Low" },
          ].map((z) => (
            <div key={z.zone} className="mb-3 last:mb-0">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-foreground font-medium">{z.zone}</span>
                <span className={`text-xs font-semibold ${z.score > 70 ? "text-safe" : z.score > 50 ? "text-warning" : "text-danger"}`}>{z.risk}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted">
                <div className={`h-full rounded-full ${z.score > 70 ? "gradient-safe" : z.score > 50 ? "gradient-warning" : "gradient-danger"}`} style={{ width: `${z.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const crimeData = [
  { name: "Harassment", value: 35, fill: "hsl(0, 80%, 55%)" },
  { name: "Theft", value: 25, fill: "hsl(40, 90%, 55%)" },
  { name: "Poor Lighting", value: 20, fill: "hsl(330, 80%, 56%)" },
  { name: "Stalking", value: 12, fill: "hsl(280, 70%, 55%)" },
  { name: "Other", value: 8, fill: "hsl(270, 10%, 55%)" },
];

const timelineData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  incidents: [4, 2, 1, 1, 0, 1, 3, 5, 8, 12, 15, 11, 9, 7, 6, 8, 10, 14, 18, 16, 12, 9, 7, 5][i],
}));

const AnalyticsPanel = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground">Crime Type Distribution</h3>
        <button className="glass px-3 py-1 rounded-lg text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" /> This Month
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={crimeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
            {crimeData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "12px", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground">Incident Timeline (24h)</h3>
        <button className="glass px-3 py-1 rounded-lg text-xs text-muted-foreground flex items-center gap-1">
          <Download className="h-3 w-3" /> Export
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--map-grid)" />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "var(--map-text-secondary)" }} interval={5} />
          <YAxis tick={{ fontSize: 10, fill: "var(--map-text-secondary)" }} />
          <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "12px", fontSize: "12px" }} />
          <Bar dataKey="incidents" radius={[4, 4, 0, 0]} fill="hsl(330, 80%, 56%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-display font-bold text-foreground">AI Predictions</h3>
      </div>
      <div className="space-y-3">
        {[
          { area: "Market Street", prediction: "Risk increase expected 8-10 PM tonight", confidence: 87 },
          { area: "University District", prediction: "Safe conditions expected through weekend", confidence: 92 },
          { area: "Transit Hub", prediction: "Elevated risk during late hours", confidence: 78 },
        ].map((p) => (
          <div key={p.area} className="glass rounded-xl p-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">{p.area}</span>
              <span className="text-xs text-primary">{p.confidence}% confidence</span>
            </div>
            <p className="text-xs text-muted-foreground">{p.prediction}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="glass rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-4">Response Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Avg Response", value: "4.2 min" },
          { label: "Resolution Rate", value: "94.7%" },
          { label: "False Alarms", value: "3.2%" },
          { label: "Active Responders", value: "128" },
        ].map((m) => (
          <div key={m.label} className="text-center glass rounded-xl p-3">
            <div className="font-display text-xl font-bold text-foreground">{m.value}</div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([
    { id: "ALT-2847", type: "SOS Triggered", location: "5th Ave & Main St", time: "2 min ago", status: "active", priority: "critical" },
    { id: "ALT-2846", type: "Harassment Report", location: "Central Park East", time: "8 min ago", status: "responding", priority: "high" },
    { id: "ALT-2845", type: "Unsafe Area Alert", location: "Industrial District", time: "15 min ago", status: "resolved", priority: "medium" },
    { id: "ALT-2844", type: "SOS Triggered", location: "University Campus", time: "23 min ago", status: "resolved", priority: "critical" },
    { id: "ALT-2843", type: "Suspicious Activity", location: "Transit Station B", time: "31 min ago", status: "resolved", priority: "high" },
  ]);

  useEffect(() => {
    const locations = ["Midtown Plaza", "South Park", "River District", "Tech Hub", "Harbor Bridge"];
    const types = ["SOS Triggered", "Harassment Report", "Suspicious Activity", "Unsafe Area Alert"];
    const interval = setInterval(() => {
      const newAlert = {
        id: `ALT-${2848 + Math.floor(Math.random() * 1000)}`,
        type: types[Math.floor(Math.random() * types.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: "Just now",
        status: "active" as const,
        priority: Math.random() > 0.5 ? "critical" : "high" as const,
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 6)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Emergency Alerts Monitor</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
          <span className="text-xs text-muted-foreground">Real-time</span>
        </div>
      </div>

      {alerts.map((alert, i) => (
        <motion.div
          key={alert.id + i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`glass rounded-2xl p-4 border-l-4 ${
            alert.priority === "critical" ? "border-l-danger" : alert.priority === "high" ? "border-l-warning" : "border-l-primary"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground">{alert.id}</span>
              <span className="text-sm font-semibold text-foreground">{alert.type}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              alert.status === "active" ? "bg-danger/10 text-danger" :
              alert.status === "responding" ? "bg-warning/10 text-warning" :
              "bg-safe/10 text-safe"
            }`}>{alert.status}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {alert.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.time}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const ReportsPanel = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-display text-lg font-bold text-foreground">Community Report Moderation</h3>
      <button className="glass px-3 py-1.5 rounded-lg text-xs text-muted-foreground flex items-center gap-1">
        <Filter className="h-3 w-3" /> Filter
      </button>
    </div>

    {[
      { user: "Sarah C.", report: "Poorly lit alley between 3rd and 4th street, no security cameras visible", type: "Poor Lighting", status: "pending", votes: 12 },
      { user: "Priya M.", report: "Group of individuals harassing women near the bus stop at night", type: "Harassment", status: "verified", votes: 34 },
      { user: "Maria L.", report: "Broken streetlights on Park Avenue for over a week", type: "Infrastructure", status: "pending", votes: 8 },
      { user: "Aisha K.", report: "Safe café that stays open late and welcomes anyone who feels unsafe", type: "Safe Spot", status: "verified", votes: 56 },
    ].map((r, i) => (
      <div key={i} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {r.user[0]}
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">{r.user}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                r.type === "Safe Spot" ? "bg-safe/10 text-safe" : "bg-primary/10 text-primary"
              }`}>{r.type}</span>
            </div>
          </div>
          <span className={`text-xs font-medium ${r.status === "verified" ? "text-safe" : "text-warning"}`}>
            {r.status === "verified" ? <CheckCircle className="h-4 w-4 inline" /> : <Clock className="h-4 w-4 inline" />} {r.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{r.report}</p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">👍 {r.votes} community votes</span>
          {r.status === "pending" && (
            <div className="flex gap-2 ml-auto">
              <button className="gradient-safe text-primary-foreground px-3 py-1 rounded-lg text-xs font-medium">Approve</button>
              <button className="bg-muted text-muted-foreground px-3 py-1 rounded-lg text-xs font-medium">Dismiss</button>
            </div>
          )}
        </div>
      </div>
    ))}
  </motion.div>
);

const trendData = [65, 68, 64, 70, 72, 69, 73, 75, 71, 74, 78, 76, 79, 77, 80, 78, 82, 81, 83, 80, 84, 82, 85, 83, 86, 84, 87, 85, 88, 87].map((v, i) => ({
  day: i + 1,
  score: v,
}));

const TrendsPanel = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground">Safety Score Trends (30 Days)</h3>
        <button className="glass px-3 py-1 rounded-lg text-xs text-muted-foreground flex items-center gap-1">
          <Download className="h-3 w-3" /> Export
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(330, 80%, 56%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(330, 80%, 56%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--map-grid)" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--map-text-secondary)" }} />
          <YAxis domain={[60, 95]} tick={{ fontSize: 10, fill: "var(--map-text-secondary)" }} />
          <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "12px", fontSize: "12px" }} />
          <Area type="monotone" dataKey="score" stroke="hsl(330, 80%, 56%)" strokeWidth={2} fill="url(#scoreFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="glass rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-4">Monthly Comparison</h3>
      <div className="space-y-3">
        {[
          { month: "This Month", incidents: 234, resolved: 228, score: 87 },
          { month: "Last Month", incidents: 278, resolved: 261, score: 82 },
          { month: "2 Months Ago", incidents: 312, resolved: 289, score: 76 },
        ].map((m) => (
          <div key={m.month} className="glass rounded-xl p-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{m.month}</span>
              <span className="text-sm font-bold text-primary">{m.score}/100</span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{m.incidents} incidents</span>
              <span className="text-safe">{m.resolved} resolved</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="lg:col-span-2 glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-display font-bold text-foreground">AI Safety Forecast</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { period: "Next 24 Hours", forecast: "Stable conditions expected citywide. Minor risk elevation in downtown area during evening hours.", risk: "Low" },
          { period: "This Weekend", forecast: "Increased activity expected near entertainment district. Additional patrols recommended.", risk: "Moderate" },
          { period: "Next Week", forecast: "Continued improvement trend. New lighting installations on 5th Ave should reduce incident reports.", risk: "Low" },
        ].map((f) => (
          <div key={f.period} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{f.period}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                f.risk === "Low" ? "bg-safe/10 text-safe" : "bg-warning/10 text-warning"
              }`}>{f.risk} Risk</span>
            </div>
            <p className="text-xs text-muted-foreground">{f.forecast}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
