import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="rounded-t-full min-h-screen bg-blue-100 dark:bg-blue-950 transition-colors duration-500">
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* App Showcase Section */}
      <HowItWorksSection />
      {/* Testimonials Section */}
      <Testimonials />
      {/* CTA Section */}
      <CTASection />
      {/* Elegant Footer */}
      <Footer />
    </div>
  );
}
