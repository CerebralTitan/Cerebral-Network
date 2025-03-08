import { Link, useLocation } from "wouter";
import { Menu, Code2, Sparkles, BookText, User, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/shared/ThemeToggle";

const Navigation = () => {
  const [location] = useLocation();

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) => (
    <Link href={href}>
      <a className="relative group py-2 px-3 rounded-lg hover:bg-primary/5 transition-all duration-300">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="text-primary"
          >
            <Icon className="w-4 h-4" />
          </motion.div>
          <span className={`font-medium ${location === href ? "text-primary" : "text-foreground group-hover:text-primary transition-colors"}`}>
            {children}
          </span>
        </div>
        <AnimatePresence>
          {location === href && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-primary/80 to-primary"
              initial={{ opacity: 0, width: "0%" }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: "0%" }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </a>
    </Link>
  );

  const NavLinks = () => (
    <>
      <NavLink href="/" icon={Sparkles}>✨ Home</NavLink>
      <NavLink href="/blog" icon={BookText}>📝 Blog</NavLink>
      <NavLink href="/portfolio" icon={Code2}>💻 Portfolio</NavLink>
      <NavLink href="/about" icon={User}>👋 About</NavLink>
    </>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="relative group flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="bg-primary/10 p-2 rounded-lg"
              >
                <div className="hexagon-container">
                  <img
                    src="https://i.ytimg.com/vi/9skTZuF0Zwc/maxresdefault.jpg"
                    alt="Profile"
                    className="w-8 h-8 object-cover clip-hexagon"
                  />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Future Imperfect
                </span>
                <span className="text-xs text-muted-foreground">Design • Develop • Create</span>
              </div>
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary/50 to-primary"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            <div className="w-px h-6 bg-primary/20 mx-2" />
            <motion.div whileHover={{ scale: 1.05 }}>
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col space-y-6 mt-8"
                >
                  <NavLinks />
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;