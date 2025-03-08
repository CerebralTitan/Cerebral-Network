import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Route } from "wouter";
import BlogCard from "@/components/blog/BlogCard";
import SearchBar from "@/components/blog/SearchBar";
import BlogPostForm from "@/components/blog/BlogPostForm";
import BlogPostView from "@/components/blog/BlogPostView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import type { BlogPost } from "@shared/schema";

// API request function to interact with the backend
const apiRequest = async (method: string, url: string, data: any = null) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};


const Blog = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"],
  });

  // Filter posts based on search query
  const filteredPosts = posts?.filter((post) => {
    const searchContent = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  }) ?? [];

  const handleTogglePin = async (postId: number) => {
    await apiRequest("POST", `/api/posts/${postId}/toggle-pin`, {});
    queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Blog
          </h1>
          <p className="text-muted-foreground">
            Thoughts, tutorials, and insights about design and development.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20">
              <PlusCircle className="h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogPostForm onSuccess={() => {
              setIsDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-md">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid gap-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading posts...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onTogglePin={() => handleTogglePin(post.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found matching your search.</p>
          </div>
        )}
      </div>

      {/* Route for individual blog posts */}
      <Route path="/blog/:slug" component={BlogPostView} />
    </div>
  );
};

export default Blog;