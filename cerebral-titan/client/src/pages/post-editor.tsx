import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Import the admin token from auth
import { ADMIN_TOKEN } from "../../../server/auth";

export default function PostEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      slug: "",
      excerpt: "",
      category: "python-basics",
      tags: [],
      metadata: {},
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        ...data,
        categoryId: parseInt(data.categoryId || "1"),
        tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
        metadata: data.metadata || {}
      };
      
      console.log("Submitting post data:", formattedData);
      
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Post creation error:", error);
      toast({
        title: "Error",
        description: `Failed to create post: ${error?.message || "Please check your post data."}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="An Awesome Python Tutorial" className="font-mono" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">URL Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="awesome-python-tutorial" className="font-mono" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="A brief description of your post..."
                      className="font-mono h-20"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Content (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write your post content in Markdown... Use [[note-name]] for linking to other posts!"
                      className="font-mono min-h-[400px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 font-mono"
              >
                {mutation.isPending ? "Creating..." : "✨ Create Post"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/")}
                className="font-mono"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}