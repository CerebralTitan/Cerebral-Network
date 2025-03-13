import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, PenSquare } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-16 px-4">
        <div className="flex h-full items-center justify-between">
          {/* Logo and Main Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
                🧠 Cerebral Titan
              </h1>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-mono bg-transparent data-[state=open]:bg-violet-500/10 hover:bg-violet-500/10">
                    📚 Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 font-mono bg-popover rounded-lg border shadow-lg">
                      <Link 
                        href="/category/python-basics" 
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-violet-500/10 transition-colors"
                      >
                        <span className="text-xl">🐍</span>
                        <div>
                          <div className="font-medium">Python Basics</div>
                          <div className="text-sm text-muted-foreground">Core concepts and fundamentals</div>
                        </div>
                      </Link>
                      <Link 
                        href="/category/advanced-python"
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-violet-500/10 transition-colors"
                      >
                        <span className="text-xl">🚀</span>
                        <div>
                          <div className="font-medium">Advanced Python</div>
                          <div className="text-sm text-muted-foreground">Deep dives and advanced topics</div>
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about">
                    <Button 
                      variant="ghost" 
                      className="font-mono bg-transparent hover:bg-violet-500/10"
                    >
                      ℹ️ About
                    </Button>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/search">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-violet-500/10"
                title="Search posts"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin/post">
              <Button 
                size="icon"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-200 hover:scale-105"
                title="Create new post"
              >
                <PenSquare className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}