import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Layers, Sparkles, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Upload an image and get instant step-by-step CAD modeling instructions.",
    },
    {
      icon: Layers,
      title: "Beginner-Friendly Steps",
      description: "Clear instructions using basic CAD tools: Sketch, Extrude, Cut, Fillet, and Hole.",
    },
    {
      icon: BookOpen,
      title: "Learn by Doing",
      description: "Follow along in Fusion 360 or AutoDesk Inventor to build real models.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Learning</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-slide-up">
            Learn CAD <span className="gradient-text">Step-by-Step</span>
            <br />Using AI
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Upload an image of any simple mechanical object and get clear, 
            beginner-friendly CAD modeling instructions you can follow in Fusion 360 or Inventor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link to="/upload">
              <Button size="lg" className="gap-2 glow-primary text-lg px-8">
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/learn">
              <Button variant="secondary" size="lg" className="gap-2 text-lg px-8">
                <BookOpen className="w-5 h-5" />
                Learn CAD Basics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card-hover rounded-xl p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center glow-primary">
            <Box className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Ready to Build Your First 3D Model?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Upload a photo of a simple bracket, plate, or holder, and let AI 
              guide you through the modeling process step by step.
            </p>
            <Link to="/upload">
              <Button size="lg" className="gap-2 text-lg px-8">
                Upload an Image
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Built for engineering students learning CAD modeling</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
