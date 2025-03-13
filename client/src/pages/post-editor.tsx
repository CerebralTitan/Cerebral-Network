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
      metadata: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/posts", data, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Make sure you have admin access.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent mb-8">
          ✍️ Create New Post
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
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