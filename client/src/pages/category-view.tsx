import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Post, Category } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function CategoryView() {
  const { slug } = useParams<{ slug: string }>();

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts", { category: slug }],
  });

  if (categoryLoading || postsLoading) return <div>Loading...</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-lg text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        <div className="grid gap-6">
          {posts?.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>
                    <Link href={`/posts/${post.slug}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <time className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                  </time>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 flex gap-2">
                  {post.tags?.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?tag=${tag}`}
                      className="text-sm px-2 py-1 bg-secondary rounded-full hover:bg-primary/10"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
