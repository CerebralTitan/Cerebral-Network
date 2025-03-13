import { useQuery } from "@tanstack/react-query";
import { Note, Folder } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import { FileText, FolderOpen } from "lucide-react";

export default function Dashboard() {
  const { data: folderStructure, isLoading } = useQuery<Folder>({
    queryKey: ["/api/folders"]
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Python Learning Vault</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Folders */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {folderStructure?.children.map((item) => (
                'path' in item ? (
                  <Link 
                    key={item.path}
                    href={`/folders${item.path}`}
                    className="flex items-center p-2 hover:bg-accent rounded-md"
                  >
                    <FolderOpen className="w-5 h-5 mr-2" />
                    {item.name}
                  </Link>
                ) : (
                  <Link
                    key={item.id}
                    href={`/notes/${item.id}`}
                    className="flex items-center p-2 hover:bg-accent rounded-md"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    {item.title}
                  </Link>
                )
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link 
                href="/notes/new?template=gratitude"
                className="block p-3 hover:bg-accent rounded-md"
              >
                Template Gratitude
              </Link>
              <Link 
                href="/notes/new?template=recall"
                className="block p-3 hover:bg-accent rounded-md"
              >
                Template Recall
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {/* Add recent notes here */}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
