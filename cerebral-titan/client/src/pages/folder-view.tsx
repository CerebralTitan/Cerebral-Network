import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Folder } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FolderOpen } from "lucide-react";

export default function FolderView() {
  const [, params] = useRoute("/folders/*");
  const path = params || "/";

  const { data: folderStructure, isLoading } = useQuery<Folder>({
    queryKey: ["/api/folders"],
  });

  if (isLoading) return <div>Loading...</div>;

  // Find current folder in structure
  function findFolder(folder: Folder, targetPath: string): Folder | null {
    if (folder.path === targetPath) return folder;
    
    for (const child of folder.children) {
      if ('children' in child) {
        const found = findFolder(child, targetPath);
        if (found) return found;
      }
    }
    
    return null;
  }

  const currentFolder = folderStructure && findFolder(folderStructure, `/${path}`);
  
  if (!currentFolder) return <div>Folder not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{currentFolder.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentFolder.children.map((item) => (
          'children' in item ? (
            // Folder
            <Card key={item.path}>
              <CardContent className="p-4">
                <Link 
                  href={`/folders${item.path}`}
                  className="flex items-center hover:text-primary"
                >
                  <FolderOpen className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              </CardContent>
            </Card>
          ) : (
            // Note
            <Card key={item.path}>
              <CardContent className="p-4">
                <Link 
                  href={`/notes/${item.path}`}
                  className="flex items-center hover:text-primary"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {item.title}
                </Link>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
}
