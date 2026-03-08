import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Shield, Users, MapPin, Clock, TrendingUp, AlertTriangle } from "lucide-react";

const stats = [
  { icon: Users, value: 2400000, suffix: "+", label: "Women Protected", format: true },
  { icon: MapPin, value: 150, suffix: "+", label: "Cities Worldwide", format: false },
  { icon: Shield, value: 98.7, suffix: "%", label: "Incidents Resolved", format: false },
  { icon: Clock, value: 4.2, suffix: " min", label: "Avg Response Time", format: false },
  { icon: TrendingUp, value: 40, suffix: "%", label: "Crime Reduction", format: false },
  { icon: AlertTriangle, value: 12000, suffix: "+", label: "Daily SOS Handled", format: true },
];

function AnimatedCounter({ value, suffix, format, inView }: { value: number; suffix: string; format: boolean; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const display = format
    ? count >= 1000000
      ? `${(count / 1000000).toFixed(1)}M`
      : count >= 1000
      ? `${Math.floor(count / 1000)}K`
      : Math.floor(count).toString()
    : Number.isInteger(value)
    ? Math.floor(count).toString()
    : count.toFixed(1);

  return <span>{display}{suffix}</span>;
}

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Impact</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Our Global <span className="text-gradient">Impact</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5 text-center hover:shadow-elevated transition-shadow"
            >
              <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground mb-1">
                <AnimatedCounter value={s.value} suffix={s.suffix} format={s.format} inView={inView} />
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
