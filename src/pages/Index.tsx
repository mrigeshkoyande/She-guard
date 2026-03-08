import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WellnessChatbot from "@/components/landing/WellnessChatbot";
import SafetyMapPreview from "@/components/landing/SafetyMapPreview";
import Testimonials from "@/components/landing/Testimonials";
import StatsSection from "@/components/landing/StatsSection";
import { Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Main content offset for desktop sidebar */}
      <div className="lg:ml-64">
        <HeroSection />
        <FeaturesSection />
        <WellnessChatbot />
        <SafetyMapPreview />
        <StatsSection />
        <Testimonials />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="container relative z-10 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-primary">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Ready to Make Your City <span className="text-gradient">Safer?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join millions of women who trust SheGuard City for their daily safety.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/app" className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg shadow-glow-primary hover:opacity-90 transition-all">
                  Try Mobile App
                </Link>
                <Link to="/dashboard" className="glass px-8 py-4 rounded-2xl font-semibold text-lg text-foreground hover:bg-card transition-all">
                  Explore Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span>by SheGuard City Team</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
