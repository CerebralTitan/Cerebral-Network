import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNoteSchema, type Note } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import NoteRenderer from "@/components/note-renderer";

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isNew = id === "new";

  const { data: note, isLoading } = useQuery<Note>({
    queryKey: [`/api/notes/${id}`],
    enabled: !isNew,
  });

  const form = useForm({
    resolver: zodResolver(insertNoteSchema),
    defaultValues: note || {
      title: "",
      content: "",
      path: "/",
      tags: [],
      metadata: {},
      linkedNotes: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      if (isNew) {
        return apiRequest("POST", "/api/notes", data);
      } else {
        return apiRequest("PATCH", `/api/notes/${id}`, data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Note ${isNew ? "created" : "updated"} successfully`,
      });
      if (isNew) setLocation("/");
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[400px] font-mono"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="submit" disabled={mutation.isPending}>
                {isNew ? "Create" : "Update"} Note
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <NoteRenderer content={form.watch("content")} />
      </div>
    </div>
  );
}
