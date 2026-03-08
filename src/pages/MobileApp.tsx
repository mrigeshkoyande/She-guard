import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Shield, MapPin, Bell, Users, Navigation, Phone, Heart,
  AlertTriangle, ChevronRight, Search, Plus, ArrowLeft,
  Mic, Camera, X, Check, Star, Sun, Moon, MessageCircle,
  PhoneCall, Send, Zap, Clock, Eye, Volume2, Sparkles,
  ChevronDown, Activity, Compass, Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

type Screen = "onboarding" | "home" | "sos" | "routes" | "map" | "guardians" | "report";

const MobileApp = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center py-20 px-4">
      <div className="fixed top-6 left-6 flex items-center gap-2 z-50">
        <Link to="/" className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-foreground font-medium text-sm hover:bg-card transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <button onClick={toggleTheme} className="glass p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors">
          {theme === "light" ? <Moon className="h-4 w-4 theme-toggle" /> : <Sun className="h-4 w-4 theme-toggle text-warning" />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="phone-frame bg-background">
          <div className="phone-notch" />
          <div className="h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              {screen === "onboarding" && <OnboardingScreen key="onboard" onNavigate={setScreen} />}
              {screen === "home" && <HomeScreen key="home" onNavigate={setScreen} />}
              {screen === "sos" && <SOSScreen key="sos" onNavigate={setScreen} />}
              {screen === "routes" && <RoutesScreen key="routes" onNavigate={setScreen} />}
              {screen === "map" && <MapScreen key="map" onNavigate={setScreen} />}
              {screen === "guardians" && <GuardiansScreen key="guardians" onNavigate={setScreen} />}
              {screen === "report" && <ReportScreen key="report" onNavigate={setScreen} />}
            </AnimatePresence>
          </div>
          {/* Bottom nav */}
          {screen !== "onboarding" && screen !== "sos" && (
            <div className="absolute bottom-0 left-0 right-0 glass border-t border-border/50 flex justify-around py-2 px-1 z-20">
              {([
                { id: "home" as Screen, icon: Shield, label: "Home" },
                { id: "routes" as Screen, icon: Compass, label: "Routes" },
                { id: "sos" as Screen, icon: Bell, label: "SOS" },
                { id: "map" as Screen, icon: MapPin, label: "Map" },
                { id: "guardians" as Screen, icon: Users, label: "Contacts" },
              ]).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                    screen === item.id ? "text-primary" : "text-muted-foreground"
                  } ${item.id === "sos" ? "" : ""}`}
                >
                  {item.id === "sos" ? (
                    <div className="w-10 h-10 -mt-5 rounded-full gradient-sos flex items-center justify-center shadow-glow-danger">
                      <Bell className="h-5 w-5 text-primary-foreground" />
                    </div>
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                  <span className="text-[9px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Screen selector */}
        <div className="flex flex-col gap-3 w-64">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">App Screens</h3>
          {([
            { id: "onboarding", label: "Onboarding", icon: Star },
            { id: "home", label: "Home Dashboard", icon: Shield },
            { id: "sos", label: "Emergency SOS", icon: Bell },
            { id: "routes", label: "Safe Routes", icon: Navigation },
            { id: "map", label: "Live Safety Map", icon: MapPin },
            { id: "guardians", label: "Guardian Contacts", icon: Users },
            { id: "report", label: "Report Location", icon: AlertTriangle },
          ] as { id: Screen; label: string; icon: any }[]).map((s) => (
            <button
              key={s.id}
              onClick={() => setScreen(s.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                screen === s.id
                  ? "gradient-primary text-primary-foreground shadow-glow-primary"
                  : "glass text-foreground hover:bg-card"
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="h-full"
  >
    {children}
  </motion.div>
);

/* ===== ONBOARDING ===== */
const OnboardingScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const [step, setStep] = useState(0);
  const slides = [
    { icon: Shield, title: "Welcome to SheGuard", desc: "Your AI-powered safety companion for navigating cities safely.", color: "gradient-primary" },
    { icon: Navigation, title: "Smart Routes", desc: "AI analyzes real-time data to find the safest path for you.", color: "gradient-safe" },
    { icon: Bell, title: "Instant SOS", desc: "One tap to alert guardians, share location & record evidence.", color: "gradient-sos" },
  ];

  return (
    <ScreenWrapper>
      <div className="h-full flex flex-col items-center justify-center p-6 text-center gradient-hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <div className={`${slides[step].color} w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-glow-primary`}>
              {(() => { const Icon = slides[step].icon; return <Icon className="h-10 w-10 text-primary-foreground" />; })()}
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">{slides[step].title}</h2>
            <p className="text-muted-foreground text-sm mb-8">{slides[step].desc}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
          ))}
        </div>
        <button
          onClick={() => step < 2 ? setStep(step + 1) : onNavigate("home")}
          className="gradient-primary text-primary-foreground w-full py-3 rounded-xl font-semibold text-sm shadow-glow-primary active:scale-95 transition-transform"
        >
          {step < 2 ? "Next" : "Get Started"}
        </button>
        {step < 2 && (
          <button onClick={() => onNavigate("home")} className="text-muted-foreground text-xs mt-3">Skip</button>
        )}
      </div>
    </ScreenWrapper>
  );
};

/* ===== HOME ===== */
const HomeScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const [safetyScore] = useState(87);
  const [showNotif, setShowNotif] = useState(false);
  const [likedAlerts, setLikedAlerts] = useState<number[]>([]);

  const alerts = [
    { text: "Poorly lit area reported on 5th Ave", time: "2m ago", type: "warning" },
    { text: "Community patrol active near Central Park", time: "15m ago", type: "safe" },
    { text: "New streetlights installed on Oak St", time: "1h ago", type: "safe" },
  ];

  return (
    <ScreenWrapper>
      <div className="p-4 pt-10 pb-20 gradient-hero min-h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground">Good evening</p>
            <h2 className="font-display text-lg font-bold text-foreground">Sarah Chen</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotif(!showNotif)} className="relative w-9 h-9 rounded-full glass flex items-center justify-center">
              <Bell className="h-4 w-4 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[8px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">SC</div>
          </div>
        </div>

        {/* Notification dropdown */}
        <AnimatePresence>
          {showNotif && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="glass rounded-xl p-3 mb-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                <button onClick={() => setShowNotif(false)}><X className="h-3 w-3 text-muted-foreground" /></button>
              </div>
              {["SOS drill reminder", "New safe route available", "Guardian accepted invite"].map((n, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-t border-border/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] text-foreground">{n}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Safety Score - animated */}
        <motion.div className="glass rounded-2xl p-4 mb-4" whileTap={{ scale: 0.98 }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Your Area Safety</span>
            <motion.span
              className="text-xs font-semibold text-safe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Safe Zone
            </motion.span>
          </div>
          <div className="flex items-end gap-2">
            <motion.span
              className="font-display text-3xl font-bold text-foreground"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {safetyScore}
            </motion.span>
            <span className="text-xs text-muted-foreground mb-1">/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted mt-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-safe"
              initial={{ width: 0 }}
              animate={{ width: `${safetyScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* SOS Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("sos")}
          className="w-full gradient-sos text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-glow-danger mb-4 flex items-center justify-center gap-2"
        >
          <Bell className="h-5 w-5" /> Emergency SOS
        </motion.button>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: Navigation, label: "Safe Routes", screen: "routes" as Screen, desc: "AI-powered" },
            { icon: MapPin, label: "Safety Map", screen: "map" as Screen, desc: "Live data" },
            { icon: Users, label: "Guardians", screen: "guardians" as Screen, desc: "3 active" },
            { icon: AlertTriangle, label: "Report", screen: "report" as Screen, desc: "Contribute" },
          ].map((a, i) => (
            <motion.button
              key={a.label}
              onClick={() => onNavigate(a.screen)}
              className="glass rounded-xl p-3 text-left"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <a.icon className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-semibold text-foreground block">{a.label}</span>
              <span className="text-[9px] text-muted-foreground">{a.desc}</span>
            </motion.button>
          ))}
        </div>

        {/* Recent alerts - interactive */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1">
            <Activity className="h-3 w-3 text-primary" /> Recent Alerts
          </h3>
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 mb-3 last:mb-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.type === "warning" ? "bg-warning" : "bg-safe"}`} />
              <div className="flex-1">
                <p className="text-xs text-foreground">{alert.text}</p>
                <p className="text-[10px] text-muted-foreground">{alert.time}</p>
              </div>
              <button
                onClick={() => setLikedAlerts(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                className="mt-0.5"
              >
                <Heart className={`h-3 w-3 transition-colors ${likedAlerts.includes(i) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ===== SOS ===== */
const SOSScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setHolding(true);
    setProgress(0);
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(intervalRef.current!);
        setActivated(true);
      }
    }, 60);
  };

  const endHold = () => {
    setHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!activated) setProgress(0);
  };

  useEffect(() => {
    if (activated && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [activated, countdown]);

  return (
    <ScreenWrapper>
      <div className="h-full flex flex-col items-center justify-center p-6 bg-background relative">
        <button onClick={() => onNavigate("home")} className="absolute top-12 left-4 glass rounded-full p-2 z-20">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: activated ? "hsla(0, 80%, 55%, 0.15)" : holding ? "hsla(0, 80%, 55%, 0.08)" : "hsla(0, 80%, 55%, 0.03)" }}
        />
        <div className="relative z-10 text-center">
          {!activated ? (
            <>
              <div className="relative mx-auto mb-6">
                {/* Progress ring */}
                <svg className="absolute -inset-2 w-40 h-40" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="72" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <motion.circle
                    cx="80" cy="80" r="72" fill="none"
                    stroke="hsl(0, 80%, 55%)" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * progress) / 100}
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <motion.button
                  onPointerDown={startHold}
                  onPointerUp={endHold}
                  onPointerLeave={endHold}
                  className="w-36 h-36 rounded-full gradient-sos flex items-center justify-center shadow-glow-danger mx-auto select-none cursor-pointer"
                  animate={{ scale: holding ? 0.92 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Bell className="h-16 w-16 text-primary-foreground" />
                </motion.button>
                <div className="absolute inset-0 w-36 h-36 rounded-full border-2 border-destructive/30 pulse-ring mx-auto" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Emergency SOS</h2>
              <p className="text-xs text-muted-foreground mb-6">
                {holding ? `Hold... ${Math.min(100, progress)}%` : "Press and hold to activate"}
              </p>
            </>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-20 h-20 rounded-full bg-destructive flex items-center justify-center mx-auto mb-4">
                <motion.span
                  className="font-display text-3xl font-bold text-primary-foreground"
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {countdown > 0 ? countdown : "!"}
                </motion.span>
              </div>
              <h2 className="font-display text-xl font-bold text-destructive mb-1">
                {countdown > 0 ? "SOS Activating..." : "SOS Activated!"}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {countdown > 0 ? "Tap cancel to abort" : "Guardians have been notified"}
              </p>
              {countdown > 0 && (
                <button
                  onClick={() => { setActivated(false); setProgress(0); setCountdown(3); }}
                  className="glass px-6 py-2 rounded-xl text-xs font-semibold text-foreground"
                >
                  Cancel
                </button>
              )}
            </motion.div>
          )}

          <div className="glass rounded-xl p-3 text-xs text-muted-foreground mt-4 text-left">
            {[
              { icon: Users, text: "Alert 3 guardians" },
              { icon: MapPin, text: "Share live location" },
              { icon: Mic, text: "Record audio evidence" },
              { icon: Zap, text: "Notify nearby community" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 py-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: activated && countdown === 0 ? 1 : 0.7, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <item.icon className={`h-3 w-3 ${activated && countdown === 0 ? "text-safe" : "text-muted-foreground"}`} />
                <span>{activated && countdown === 0 ? "✓ " : ""}{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ===== ROUTES ===== */
const RoutesScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [navigating, setNavigating] = useState(false);

  const routes = [
    { name: "Safest Route", time: "18 min", score: 94, color: "gradient-safe", details: "Well-lit streets, CCTV coverage, active patrols" },
    { name: "Balanced Route", time: "14 min", score: 78, color: "gradient-warning", details: "Mix of main roads and side streets" },
    { name: "Fastest Route", time: "10 min", score: 52, color: "gradient-danger", details: "Some poorly lit areas, limited surveillance" },
  ];

  return (
    <ScreenWrapper>
      <div className="p-4 pt-10 pb-20 gradient-hero min-h-full">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Safe Route Finder</h2>
        <div className="glass rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-safe" />
            <input className="text-xs bg-transparent text-foreground w-full outline-none placeholder:text-muted-foreground" placeholder="Current location" defaultValue="123 Main St" />
          </div>
          <div className="w-px h-4 bg-border ml-1.5" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <input className="text-xs bg-transparent text-foreground w-full outline-none placeholder:text-muted-foreground" placeholder="Destination" defaultValue="Central Library" />
          </div>
        </div>

        {routes.map((r, i) => (
          <motion.button
            key={r.name}
            className={`glass rounded-xl p-3 mb-3 w-full text-left transition-all ${selected === i ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelected(i)}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                {selected === i && <Check className="h-3 w-3 text-primary" />}
                {r.name}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${r.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
              <span className="text-xs font-bold text-foreground">{r.score}</span>
            </div>
            <AnimatePresence>
              {selected === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-[10px] text-muted-foreground overflow-hidden"
                >
                  {r.details}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}

        {selected !== null && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setNavigating(!navigating)}
            className={`w-full py-3 rounded-xl font-semibold text-sm text-primary-foreground shadow-glow-primary transition-all ${navigating ? "gradient-safe" : "gradient-primary"}`}
          >
            {navigating ? (
              <span className="flex items-center justify-center gap-2"><Compass className="h-4 w-4 animate-spin" /> Navigating...</span>
            ) : (
              <span className="flex items-center justify-center gap-2"><Navigation className="h-4 w-4" /> Start Navigation</span>
            )}
          </motion.button>
        )}
      </div>
    </ScreenWrapper>
  );
};

/* ===== MAP ===== */
const MapScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const zones = [
    { safety: "safe", label: "Park Ave", score: 92 },
    { safety: "safe", label: "Main St", score: 88 },
    { safety: "warning", label: "5th Ave", score: 64 },
    { safety: "danger", label: "Back Alley", score: 32 },
    { safety: "safe", label: "Central Sq", score: 95 },
    { safety: "warning", label: "Elm St", score: 58 },
  ];

  const colorMap: Record<string, string> = { safe: "bg-safe/40", warning: "bg-warning/40", danger: "bg-destructive/40" };
  const colorMapActive: Record<string, string> = { safe: "bg-safe/70", warning: "bg-warning/70", danger: "bg-destructive/70" };

  return (
    <ScreenWrapper>
      <div className="p-4 pt-10 pb-20 min-h-full relative bg-secondary/20">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Live Safety Map</h2>
        <div className="rounded-2xl overflow-hidden relative mb-4 bg-secondary/30 border border-border">
          <div className="grid grid-cols-3 grid-rows-2 gap-1 p-2">
            {zones.map((z, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedZone(selectedZone === i ? null : i)}
                className={`h-24 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                  selectedZone === i ? colorMapActive[z.safety] + " ring-2 ring-primary" : colorMap[z.safety]
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-[9px] font-semibold text-foreground">{z.label}</span>
                <span className="text-[8px] text-muted-foreground">{z.score}/100</span>
              </motion.button>
            ))}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-glow-primary border-2 border-primary-foreground pointer-events-none z-10" />
        </div>

        <AnimatePresence>
          {selectedZone !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-xl p-3 mb-3 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">{zones[selectedZone].label}</span>
                <span className={`text-[10px] font-bold ${zones[selectedZone].safety === "safe" ? "text-safe" : zones[selectedZone].safety === "warning" ? "text-warning" : "text-destructive"}`}>
                  Score: {zones[selectedZone].score}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">
                {zones[selectedZone].safety === "safe" ? "Well-lit area with active CCTV and regular patrols." : zones[selectedZone].safety === "warning" ? "Some reports of poor lighting. Exercise caution." : "Multiple safety reports. Avoid after dark."}
              </p>
              <div className="flex gap-2">
                <button onClick={() => onNavigate("routes")} className="text-[9px] px-3 py-1 rounded-full gradient-primary text-primary-foreground font-medium">Navigate Here</button>
                <button onClick={() => onNavigate("report")} className="text-[9px] px-3 py-1 rounded-full glass text-foreground font-medium">Report Issue</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass rounded-xl p-3 mb-3">
          <h3 className="text-xs font-semibold text-foreground mb-2">Legend</h3>
          <div className="flex gap-4">
            {[
              { color: "bg-safe", label: "Safe" },
              { color: "bg-warning", label: "Caution" },
              { color: "bg-destructive", label: "Avoid" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                <span className="text-[10px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> AI Insights</h3>
          <p className="text-[10px] text-muted-foreground">Safety conditions improving in your area. 12% fewer incidents this week compared to last.</p>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ===== GUARDIANS ===== */
const GuardiansScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const guardians = [
    { name: "Mom", phone: "+1 555-0123", status: "Active", emoji: "👩" },
    { name: "Emily (Sister)", phone: "+1 555-0456", status: "Active", emoji: "👧" },
    { name: "Officer Martinez", phone: "+1 555-0789", status: "On Duty", emoji: "👮" },
  ];

  return (
    <ScreenWrapper>
      <div className="p-4 pt-10 pb-20 gradient-hero min-h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">Guardians</h2>
          <motion.button
            whileTap={{ scale: 0.9, rotate: 90 }}
            onClick={() => setShowAdd(!showAdd)}
            className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center"
          >
            <Plus className={`h-4 w-4 text-primary-foreground transition-transform ${showAdd ? "rotate-45" : ""}`} />
          </motion.button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-xl p-3 mb-3 overflow-hidden"
            >
              <label className="text-[10px] text-muted-foreground mb-1 block">Add Guardian</label>
              <input className="w-full text-xs bg-transparent text-foreground border-b border-border pb-1 mb-2 outline-none placeholder:text-muted-foreground" placeholder="Name" />
              <input className="w-full text-xs bg-transparent text-foreground border-b border-border pb-1 mb-3 outline-none placeholder:text-muted-foreground" placeholder="Phone number" />
              <button
                onClick={() => { setShowAdd(false); toast({ title: "Guardian Added", description: "Invitation sent!" }); }}
                className="gradient-primary text-primary-foreground w-full py-2 rounded-lg text-xs font-semibold"
              >
                Send Invite
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {guardians.map((g, i) => (
          <motion.div
            key={i}
            className={`glass rounded-xl p-3 mb-3 transition-all ${expanded === i ? "ring-1 ring-primary/30" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex items-center gap-3 w-full text-left">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg">{g.emoji}</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">{g.name}</p>
                <p className="text-[10px] text-muted-foreground">{g.phone}</p>
              </div>
              <span className="text-[10px] text-safe font-medium">{g.status}</span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                    <button
                      onClick={() => toast({ title: "Calling...", description: `Calling ${g.name}` })}
                      className="flex-1 glass rounded-lg py-2 flex items-center justify-center gap-1 text-[10px] font-medium text-foreground"
                    >
                      <PhoneCall className="h-3 w-3 text-safe" /> Call
                    </button>
                    <button
                      onClick={() => toast({ title: "Message Sent", description: `Quick check-in sent to ${g.name}` })}
                      className="flex-1 glass rounded-lg py-2 flex items-center justify-center gap-1 text-[10px] font-medium text-foreground"
                    >
                      <MessageCircle className="h-3 w-3 text-primary" /> Message
                    </button>
                    <button
                      onClick={() => toast({ title: "Location Shared", description: `Live location shared with ${g.name}` })}
                      className="flex-1 glass rounded-lg py-2 flex items-center justify-center gap-1 text-[10px] font-medium text-foreground"
                    >
                      <MapPin className="h-3 w-3 text-warning" /> Share
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        <div className="glass rounded-xl p-3 mt-4">
          <p className="text-[10px] text-muted-foreground text-center">
            Guardians are notified instantly during SOS with your live location.
          </p>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ===== REPORT ===== */
const ReportScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Poor Lighting"]);
  const [description, setDescription] = useState("Dimly lit alley between buildings, no visible security cameras...");
  const [submitted, setSubmitted] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleType = (t: string) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  if (submitted) {
    return (
      <ScreenWrapper>
        <div className="h-full flex flex-col items-center justify-center p-6 gradient-hero text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full gradient-safe flex items-center justify-center mb-4 shadow-glow-safe"
          >
            <Check className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Report Submitted!</h2>
          <p className="text-xs text-muted-foreground mb-6">Thank you for making the community safer. Your report will be reviewed shortly.</p>
          <button onClick={() => { setSubmitted(false); onNavigate("home"); }} className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm">
            Back to Home
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <div className="p-4 pt-10 pb-20 gradient-hero min-h-full">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Report Unsafe Location</h2>

        <div className="glass rounded-xl p-3 mb-3">
          <label className="text-[10px] text-muted-foreground mb-1 block">Location</label>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs text-foreground">5th Avenue & Park Lane</span>
            <Target className="h-3 w-3 text-muted-foreground ml-auto" />
          </div>
        </div>

        <div className="glass rounded-xl p-3 mb-3">
          <label className="text-[10px] text-muted-foreground mb-2 block">Issue Type (tap to select)</label>
          <div className="flex flex-wrap gap-2">
            {["Poor Lighting", "Harassment", "Suspicious Activity", "No CCTV", "Broken Path", "Isolation"].map((t) => (
              <motion.button
                key={t}
                onClick={() => toggleType(t)}
                whileTap={{ scale: 0.9 }}
                className={`text-[10px] px-2.5 py-1 rounded-full transition-all ${
                  selectedTypes.includes(t) ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {selectedTypes.includes(t) && "✓ "}{t}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-3 mb-3">
          <label className="text-[10px] text-muted-foreground mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-xs text-foreground bg-transparent w-full h-16 outline-none resize-none placeholder:text-muted-foreground"
            placeholder="Describe the safety concern..."
          />
          <div className="text-[9px] text-muted-foreground text-right">{description.length}/500</div>
        </div>

        <div className="flex gap-2 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setAttachments(prev => [...prev, "📷"]); toast({ title: "Photo attached" }); }}
            className="glass rounded-xl p-3 flex-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground"
          >
            <Camera className="h-3 w-3" /> Photo {attachments.filter(a => a === "📷").length > 0 && `(${attachments.filter(a => a === "📷").length})`}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setAttachments(prev => [...prev, "🎙️"]); toast({ title: "Audio attached" }); }}
            className="glass rounded-xl p-3 flex-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground"
          >
            <Mic className="h-3 w-3" /> Audio {attachments.filter(a => a === "🎙️").length > 0 && `(${attachments.filter(a => a === "🎙️").length})`}
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSubmitted(true)}
          className="gradient-primary text-primary-foreground w-full py-3 rounded-xl font-semibold text-sm shadow-glow-primary flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" /> Submit Report
        </motion.button>
      </div>
    </ScreenWrapper>
  );
};

export default MobileApp;
