import { motion } from "framer-motion";
import { MapPin, Shield, Bell, Users, Navigation, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "AI Safety Map",
    desc: "Machine learning analyzes crime data, lighting, foot traffic to generate real-time safety scores for every street.",
    color: "gradient-primary",
    link: "#safety-map",
    isAnchor: true,
  },
  {
    icon: Navigation,
    title: "Safe Route Navigation",
    desc: "Get the safest walking routes, not just the shortest. Avoid poorly-lit areas and known hotspots.",
    color: "gradient-safe",
    link: "/app",
    screen: "route",
    isAnchor: false,
  },
  {
    icon: Bell,
    title: "Emergency SOS",
    desc: "One-tap SOS alerts your guardians, shares live location, and notifies nearby community members.",
    color: "gradient-danger",
    link: "/app",
    screen: "sos",
    isAnchor: false,
  },
  {
    icon: Users,
    title: "Community Reports",
    desc: "Crowdsourced safety reports from women in your area. See verified incidents and safety tips.",
    color: "gradient-warning",
    link: "/app",
    screen: "report",
    isAnchor: false,
  },
  {
    icon: MapPin,
    title: "Safe Spots Network",
    desc: "Find verified safe havens: open stores, police stations, and community-designated safe spots.",
    color: "gradient-primary",
    link: "/app",
    screen: "map",
    isAnchor: false,
  },
  {
    icon: Shield,
    title: "City Analytics",
    desc: "Comprehensive dashboard for city officials to monitor safety trends and allocate resources.",
    color: "gradient-safe",
    link: "/dashboard",
    isAnchor: false,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Platform Features</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Complete Safety <span className="text-gradient">Ecosystem</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A comprehensive platform combining AI, community, and real-time data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const inner = (
              <>
                <div className={`${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </>
            );

            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {f.isAnchor ? (
                  <a
                    href={f.link}
                    className="block glass rounded-2xl p-6 hover:shadow-elevated transition-all group cursor-pointer"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    to={f.link}
                    className="block glass rounded-2xl p-6 hover:shadow-elevated transition-all group cursor-pointer"
                  >
                    {inner}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
