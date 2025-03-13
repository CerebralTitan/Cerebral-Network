import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Folder } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, FileText, FolderOpen, Search, Plus 
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { data: folderStructure } = useQuery<Folder>({
    queryKey: ["/api/folders"],
  });

  return (
    <div className="w-64 border-r bg-sidebar">
      <div className="p-4 border-b">
        <Link href="/">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Python Vault
          </h1>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/notes/new">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>

          <div className="pt-4">
            <h2 className="mb-2 px-2 text-sm font-semibold">Folders</h2>
            <nav className="space-y-1">
              {folderStructure?.children.map((item) => (
                'path' in item ? (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location === `/folders${item.path}` && "bg-accent"
                    )}
                    asChild
                  >
                    <Link href={`/folders${item.path}`}>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                ) : null
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
