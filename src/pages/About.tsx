import Navbar from "@/components/Navbar";
import { GraduationCap, Target, AlertTriangle, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 sm:mb-4">
              About <span className="gradient-text">CADLearn</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-2">
              An educational tool built to help students learn CAD modeling
            </p>
          </div>

          {/* Mission */}
          <section className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-4 sm:mb-8 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Student-Built for Students</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  CADLearn was created by mechanical engineering students who understand 
                  the challenges of learning CAD software for the first time. Our goal 
                  is to bridge the gap between seeing a physical object and understanding 
                  how to model it in 3D.
                </p>
              </div>
            </div>
          </section>

          {/* Purpose */}
          <section className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-4 sm:mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Focus on Learning, Not Automation</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  This tool is designed to teach you the CAD modeling workflow, not to 
                  replace your learning. By analyzing images and breaking them down into 
                  steps, you'll develop the mental framework for approaching any 3D 
                  modeling challenge.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    Understand the order of operations in CAD
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    Learn which tools to use and when
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    Build confidence with beginner-friendly guidance
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-4 sm:mb-8 border-primary/30 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Important Disclaimer</h2>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Approximate Guidance Only:</strong> The 
                    AI provides estimated dimensions and general modeling steps. These are 
                    meant to guide your learning, not for precision engineering.
                  </p>
                  <p>
                    <strong className="text-foreground">No CAD Files Generated:</strong> This 
                    tool teaches you how to model, it doesn't create files for you. You'll 
                    need to follow the steps in your own CAD software.
                  </p>
                  <p>
                    <strong className="text-foreground">Educational Purpose:</strong> Best 
                    suited for simple mechanical objects like brackets, plates, and basic 
                    holders. Complex assemblies may require additional learning resources.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Built With */}
          <section className="text-center animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span>for engineering education</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
