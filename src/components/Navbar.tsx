import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Box, BookOpen, Info, Upload } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: Box },
    { path: "/upload", label: "Start Learning", icon: Upload },
    { path: "/learn", label: "Learn CAD", icon: BookOpen },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Box className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-semibold text-lg text-foreground">
              CAD<span className="text-primary">Learn</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="icon"
                    className={`w-9 h-9 ${
                      isActive ? "bg-secondary" : "text-muted-foreground"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
