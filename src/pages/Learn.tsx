import Navbar from "@/components/Navbar";
import { Pencil, Box, Scissors, Circle, Dot } from "lucide-react";

const Learn = () => {
  const cadTools = [
    {
      icon: Pencil,
      name: "Sketch",
      description:
        "A Sketch is a 2D drawing on a plane. It's the foundation of most 3D models. You draw shapes like rectangles, circles, and lines that define the profile of your part.",
      tips: [
        "Start on a flat plane (Top, Front, or Side)",
        "Use constraints to lock dimensions",
        "Close all shapes before extruding",
      ],
    },
    {
      icon: Box,
      name: "Extrude",
      description:
        "Extrude takes your 2D sketch and pushes it into 3D space. Think of it like pushing a cookie cutter through dough - the shape extends outward to create depth.",
      tips: [
        "Select a closed sketch profile",
        "Enter the distance in mm or inches",
        "Use symmetric extrude for centered parts",
      ],
    },
    {
      icon: Scissors,
      name: "Cut (Extrude Cut)",
      description:
        "A Cut removes material from your 3D model. You draw a sketch on the surface and extrude it inward to carve out material. Great for slots, pockets, and cutouts.",
      tips: [
        "Create a sketch on an existing face",
        "Use 'Cut' or 'Subtract' operation",
        "You can cut through the entire part",
      ],
    },
    {
      icon: Circle,
      name: "Fillet",
      description:
        "A Fillet rounds off sharp edges. It's used for aesthetics, reducing stress concentrations, and making parts safer to handle. You select edges and specify a radius.",
      tips: [
        "Select one or multiple edges",
        "Start with small radii (1-3mm)",
        "Apply to internal corners for strength",
      ],
    },
    {
      icon: Dot,
      name: "Hole",
      description:
        "The Hole tool creates circular holes in your model. It's specialized for creating standard holes with options for counterbore, countersink, and threads.",
      tips: [
        "Place a point in your sketch first",
        "Select hole type (simple, counterbore, etc.)",
        "Use standard sizes for screws/bolts",
      ],
    },
  ];

  const beginnerTips = [
    {
      title: "Start Simple",
      content:
        "Begin with basic shapes like L-brackets or flat plates. Master simple geometry before attempting complex parts.",
    },
    {
      title: "Think in Steps",
      content:
        "Break down any object into basic shapes. A bracket is just a rectangle with holes cut out. A handle is a cylinder with rounded ends.",
    },
    {
      title: "Use References",
      content:
        "Measure real objects or use photos. Approximate dimensions are fine for learning - precision comes with practice.",
    },
    {
      title: "Save Often",
      content:
        "Save your work frequently. CAD software can be resource-intensive, and crashes happen. Create versions as you progress.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 sm:mb-4">
              Learn <span className="gradient-text">CAD Basics</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Master the fundamental tools used in Fusion 360 and AutoDesk Inventor.
              These five operations are the building blocks of almost every 3D model.
            </p>
          </div>

          {/* CAD Tools */}
          <section className="mb-10 sm:mb-16">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </span>
              Essential CAD Tools
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {cadTools.map((tool, index) => (
                <div
                  key={tool.name}
                  className="glass-card-hover rounded-xl p-4 sm:p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <tool.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 sm:mb-4">{tool.description}</p>
                      <div className="bg-secondary/30 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm font-medium text-foreground/80 mb-2">
                          Quick Tips:
                        </p>
                        <ul className="space-y-1">
                          {tool.tips.map((tip, i) => (
                            <li
                              key={i}
                              className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-primary mt-0.5 sm:mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Beginner Tips */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Tips for Beginners</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {beginnerTips.map((tip, index) => (
                <div
                  key={tip.title}
                  className="glass-card rounded-xl p-4 sm:p-5 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">{tip.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{tip.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Learn;
