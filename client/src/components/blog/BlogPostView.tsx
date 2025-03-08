import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPostView = () => {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <p className="text-muted-foreground mt-2">
          The post you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(post.date), 'MMMM dd, yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </CardContent>
    </Card>
  );
};

export default BlogPostView;
