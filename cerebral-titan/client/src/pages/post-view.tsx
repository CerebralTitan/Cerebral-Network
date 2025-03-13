import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Post } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import NoteRenderer from "@/components/note-renderer";

export default function PostView() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: [`/api/posts/${slug}`],
  });

  const { data: relatedPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts", { category: post?.category, limit: 3 }],
    enabled: !!post,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Link href={`/category/${post.category}`}>
                <span className="text-sm text-muted-foreground hover:text-primary">
                  {post.category}
                </span>
              </Link>
              <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
            </div>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/posts/${post.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <time>
              {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
            </time>
            <div className="flex gap-2">
              {post.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tag=${tag}`}
                  className="hover:text-primary"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <NoteRenderer content={post.content} />
          </div>
        </div>

        {relatedPosts?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.filter(p => p.id !== post.id).map((relatedPost) => (
                <Card key={relatedPost.id}>
                  <CardContent className="p-4">
                    <Link href={`/posts/${relatedPost.slug}`}>
                      <h3 className="font-semibold hover:text-primary">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-2">
                      {relatedPost.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
