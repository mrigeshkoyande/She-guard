import { Shield, Menu, X, Home, Sparkles, Map, MessageCircle, Users, LayoutDashboard, Smartphone, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { label: "Home", href: "#", icon: Home },
  { label: "Features", href: "#features", icon: Sparkles },
  { label: "Safety Map", href: "#safety-map", icon: Map },
  { label: "Wellness Chat", href: "#wellness-chat", icon: MessageCircle },
  { label: "Community", href: "#community", icon: Users },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Sidebar — always dark-themed */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 h-screen w-64 flex-col glass-dark border-r border-border/20">
        <div className="p-5 border-b border-border/20">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-xl">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-white">SheGuard City</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-white/40 px-4 pt-3 pb-2">Navigation</p>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}

          <p className="text-[10px] uppercase tracking-widest text-white/40 px-4 pt-6 pb-2">Platform</p>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/app"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <Smartphone className="h-4 w-4" />
            Mobile App
          </Link>
        </nav>

        <div className="p-4 space-y-3 border-t border-border/20">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 theme-toggle" />
            ) : (
              <Sun className="h-4 w-4 theme-toggle text-warning" />
            )}
            {theme === "light" ? "Night Mode" : "Light Mode"}
          </button>

          <Link
            to="/app"
            className="gradient-primary text-primary-foreground w-full py-3 rounded-xl text-sm font-semibold shadow-glow-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Get the App
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary p-1.5 rounded-lg">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">SheGuard</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors"
          >
            {theme === "light" ? <Moon className="h-4 w-4 theme-toggle" /> : <Sun className="h-4 w-4 theme-toggle text-warning" />}
          </button>
          <button onClick={() => setOpen(true)} className="text-foreground p-1">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile overlay sidebar — always dark-themed */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 z-[70] h-screen w-72 flex flex-col glass-dark"
            >
              <div className="p-5 flex items-center justify-between border-b border-border/20">
                <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <div className="gradient-primary p-2 rounded-xl">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-white">SheGuard City</span>
                </Link>
                <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                <p className="text-[10px] uppercase tracking-widest text-white/40 px-4 pt-3 pb-2">Navigation</p>
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}

                <p className="text-[10px] uppercase tracking-widest text-white/40 px-4 pt-6 pb-2">Platform</p>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/app"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile App
                </Link>
              </nav>

              <div className="p-4 space-y-3 border-t border-border/20">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  {theme === "light" ? <Moon className="h-4 w-4 theme-toggle" /> : <Sun className="h-4 w-4 theme-toggle text-warning" />}
                  {theme === "light" ? "Night Mode" : "Light Mode"}
                </button>
                <Link
                  to="/app"
                  onClick={() => setOpen(false)}
                  className="gradient-primary text-primary-foreground w-full py-3 rounded-xl text-sm font-semibold shadow-glow-primary flex items-center justify-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Get the App
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
