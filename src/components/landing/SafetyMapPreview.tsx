import { motion } from "framer-motion";
import { useState } from "react";
import { Brain, Eye, Clock, MapPin, AlertTriangle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const zones = [
  { id: 1, x: 10, y: 15, w: 25, h: 30, risk: "low", name: "Residential North", score: 92 },
  { id: 2, x: 38, y: 10, w: 28, h: 25, risk: "medium", name: "Market District", score: 64 },
  { id: 3, x: 70, y: 12, w: 25, h: 28, risk: "low", name: "University Area", score: 88 },
  { id: 4, x: 8, y: 50, w: 30, h: 25, risk: "high", name: "Downtown East", score: 34 },
  { id: 5, x: 42, y: 40, w: 22, h: 30, risk: "low", name: "Central Park", score: 91 },
  { id: 6, x: 68, y: 45, w: 28, h: 28, risk: "medium", name: "Transit Hub", score: 58 },
  { id: 7, x: 15, y: 78, w: 30, h: 18, risk: "low", name: "Tech Campus", score: 95 },
  { id: 8, x: 50, y: 75, w: 25, h: 20, risk: "high", name: "Industrial Zone", score: 29 },
  { id: 9, x: 78, y: 78, w: 18, h: 18, risk: "medium", name: "Harbor Area", score: 55 },
];

const incidents = [
  { x: 48, y: 18, type: "alert" },
  { x: 18, y: 58, type: "sos" },
  { x: 55, y: 82, type: "sos" },
  { x: 72, y: 52, type: "alert" },
];

const SafetyMapPreview = () => {
  const [mode, setMode] = useState<"live" | "historical">("live");
  const [selectedZone, setSelectedZone] = useState<typeof zones[0] | null>(null);

  const riskColor = (risk: string) => {
    if (risk === "low") return "hsla(150, 60%, 50%, 0.35)";
    if (risk === "medium") return "hsla(40, 90%, 55%, 0.35)";
    return "hsla(0, 80%, 55%, 0.35)";
  };

  const riskStroke = (risk: string) => {
    if (risk === "low") return "hsl(150, 60%, 50%)";
    if (risk === "medium") return "hsl(40, 90%, 55%)";
    return "hsl(0, 80%, 55%)";
  };

  return (
    <section id="safety-map" className="py-24 relative">
      <div className="absolute inset-0 gradient-hero opacity-30" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Live Safety Map</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Real-Time City <span className="text-gradient">Intelligence</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            AI-powered safety mapping with live incident tracking and predictive analytics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-4 gap-6"
        >
          {/* Map */}
          <div className="lg:col-span-3 glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-bold text-foreground">Interactive Safety Map</h3>
                <span className="flex items-center gap-1.5 text-xs text-safe">
                  <span className="w-2 h-2 rounded-full bg-safe animate-pulse" /> Live
                </span>
              </div>
              <div className="flex gap-1">
                {(["live", "historical"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      mode === m ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "live" ? <><Eye className="h-3 w-3 inline mr-1" />Live</> : <><Clock className="h-3 w-3 inline mr-1" />Historical</>}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-muted/50 to-muted p-2">
              <svg viewBox="0 0 100 100" className="w-full h-[400px]" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <g key={i}>
                    <line x1={i * 10} y1={0} x2={i * 10} y2={100} stroke="var(--map-grid)" strokeWidth="0.15" />
                    <line x1={0} y1={i * 10} x2={100} y2={i * 10} stroke="var(--map-grid)" strokeWidth="0.15" />
                  </g>
                ))}

                {/* Roads */}
                <line x1="0" y1="40" x2="100" y2="40" stroke="var(--map-road)" strokeWidth="0.6" />
                <line x1="0" y1="72" x2="100" y2="72" stroke="var(--map-road)" strokeWidth="0.6" />
                <line x1="35" y1="0" x2="35" y2="100" stroke="var(--map-road)" strokeWidth="0.6" />
                <line x1="65" y1="0" x2="65" y2="100" stroke="var(--map-road)" strokeWidth="0.6" />

                {/* Zones */}
                {zones.map((z) => (
                  <g key={z.id} onClick={() => setSelectedZone(z)} className="cursor-pointer">
                    <rect
                      x={z.x} y={z.y} width={z.w} height={z.h}
                      rx="1.5"
                      fill={riskColor(z.risk)}
                      stroke={riskStroke(z.risk)}
                      strokeWidth={selectedZone?.id === z.id ? "0.6" : "0.25"}
                      className="transition-all hover:opacity-80"
                    />
                    <text
                      x={z.x + z.w / 2} y={z.y + z.h / 2}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="2.2" fill="var(--map-text)" fontWeight="600" fontFamily="var(--font-display)"
                    >
                      {z.name}
                    </text>
                    <text
                      x={z.x + z.w / 2} y={z.y + z.h / 2 + 4}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="1.8" fill="var(--map-text-secondary)"
                    >
                      Score: {z.score}
                    </text>
                  </g>
                ))}

                {/* Pulse incidents */}
                {mode === "live" && incidents.map((inc, i) => (
                  <g key={i}>
                    <circle cx={inc.x} cy={inc.y} r="2.5" fill={inc.type === "sos" ? "hsl(0, 80%, 55%)" : "hsl(40, 90%, 55%)"} opacity="0.3">
                      <animate attributeName="r" from="1.5" to="4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={inc.x} cy={inc.y} r="1.2" fill={inc.type === "sos" ? "hsl(0, 80%, 55%)" : "hsl(40, 90%, 55%)"} />
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 glass rounded-xl p-3 flex gap-4">
                {[
                  { color: "bg-safe", label: "Safe Zone" },
                  { color: "bg-warning", label: "Caution" },
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

          {/* Sidebar */}
          <div className="space-y-4">
            {selectedZone ? (
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-display font-bold text-foreground">{selectedZone.name}</h4>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Safety Score</span>
                    <span className={`font-bold ${selectedZone.score > 70 ? "text-safe" : selectedZone.score > 50 ? "text-warning" : "text-danger"}`}>
                      {selectedZone.score}/100
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${selectedZone.score > 70 ? "gradient-safe" : selectedZone.score > 50 ? "gradient-warning" : "gradient-danger"}`}
                      style={{ width: `${selectedZone.score}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Lighting</span><span className="text-foreground">{selectedZone.score > 60 ? "Good" : "Poor"}</span></div>
                  <div className="flex justify-between"><span>Foot Traffic</span><span className="text-foreground">{selectedZone.score > 50 ? "Moderate" : "Low"}</span></div>
                  <div className="flex justify-between"><span>Patrol Frequency</span><span className="text-foreground">{selectedZone.score > 70 ? "High" : "Low"}</span></div>
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-2xl p-5 text-center">
                <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click a zone on the map to see details</p>
              </div>
            )}

            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-primary" />
                <h4 className="font-display font-bold text-sm text-foreground">AI Risk Score</h4>
              </div>
              {[
                { label: "Downtown East", score: 34, trend: "↑ Rising" },
                { label: "Transit Hub", score: 58, trend: "→ Stable" },
                { label: "Tech Campus", score: 95, trend: "↑ Improving" },
              ].map((z) => (
                <div key={z.label} className="flex items-center justify-between text-xs mb-2 last:mb-0">
                  <span className="text-muted-foreground">{z.label}</span>
                  <span className={`font-semibold ${z.score > 70 ? "text-safe" : z.score > 50 ? "text-warning" : "text-danger"}`}>
                    {z.score} {z.trend}
                  </span>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h4 className="font-display font-bold text-sm text-foreground">Active Incidents</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  <span className="text-muted-foreground">SOS — Downtown East</span>
                  <span className="text-danger ml-auto">2m ago</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                  <span className="text-muted-foreground">Alert — Market District</span>
                  <span className="text-warning ml-auto">5m ago</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  <span className="text-muted-foreground">SOS — Industrial Zone</span>
                  <span className="text-danger ml-auto">8m ago</span>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="gradient-primary text-primary-foreground w-full py-3 rounded-xl font-semibold text-sm shadow-glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" /> View Full Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SafetyMapPreview;
