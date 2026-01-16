import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Box, BookOpen, Info, Upload, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home", icon: Box },
    { path: "/upload", label: "Start Learning", icon: Upload },
    { path: "/learn", label: "Learn CAD", icon: BookOpen },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Box className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="font-display font-semibold text-base sm:text-lg text-foreground">
              CAD<span className="text-primary">Learn</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* Mobile Hamburger Menu */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-card border-border/50 w-[280px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Box className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-display font-semibold">
                      CAD<span className="text-primary">Learn</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`w-full justify-start gap-3 h-12 text-base ${
                            isActive
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          }`}
                        >
                          <link.icon className="w-5 h-5" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
