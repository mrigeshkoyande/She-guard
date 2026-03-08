import { motion } from "framer-motion";
import { Shield, MapPin, Bell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroCity from "@/assets/hero-city.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden flex items-center">
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img src={heroCity} alt="Smart city with safety shield" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 pt-20 lg:pt-16 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">AI-Powered Safety • Real-time Protection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Making Every City{" "}
            <span className="text-gradient">Safer for Women</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            SheGuard City uses AI-powered safety maps, real-time monitoring, and community reporting to create safer urban spaces for women everywhere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/app" className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg shadow-glow-primary hover:opacity-90 transition-all flex items-center gap-2">
              Open Mobile App <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/dashboard" className="glass px-8 py-4 rounded-2xl font-semibold text-lg text-foreground hover:bg-card transition-all">
              View Dashboard
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16 glass rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Shield, label: "Active Users", value: "2.4M+" },
              { icon: MapPin, label: "Cities Covered", value: "150+" },
              { icon: Bell, label: "Alerts Resolved", value: "98.7%" },
              { icon: Shield, label: "Safety Score", value: "A+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
