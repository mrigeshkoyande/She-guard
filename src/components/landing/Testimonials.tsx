import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "College Student, Delhi",
    text: "SheGuard City literally saved me one night. The SOS feature alerted my guardians and nearby community members within seconds. I felt safe knowing help was on the way.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Sarah Mitchell",
    role: "Night Shift Nurse, Chicago",
    text: "The safe route navigation is a game changer for my late-night commutes. I no longer have to guess which streets are safe — the app shows me the safest path every time.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Maria Rodriguez",
    role: "Community Organizer, NYC",
    text: "As a community leader, the reporting feature helps us identify and address unsafe areas quickly. The city dashboard gives our team actionable data to make real change.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Aisha Okonkwo",
    role: "Business Owner, Lagos",
    text: "The AI safety map helped me choose a safe location for my business. Knowing the safety scores of different areas gave me confidence in my decision.",
    rating: 4,
    avatar: "AO",
  },
];

const Testimonials = () => {
  return (
    <section id="community" className="py-24 relative">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">Community</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Trusted by <span className="text-gradient">Millions</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Real stories from women who feel safer every day with SheGuard City.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative group hover:shadow-elevated transition-shadow"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-display font-bold text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`h-4 w-4 ${s < t.rating ? "text-warning fill-warning" : "text-muted"}`} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
