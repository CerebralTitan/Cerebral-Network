import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const initialQuery = searchParams.get("q") || "";
  const initialTag = searchParams.get("tag");

  const form = useForm({
    defaultValues: {
      query: initialQuery,
    },
  });

  const { data: results, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/search", { q: initialQuery || initialTag }],
    enabled: !!(initialQuery || initialTag),
  });

  const onSubmit = form.handleSubmit((data) => {
    setLocation(`/search?q=${encodeURIComponent(data.query)}`);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {initialTag ? `Posts tagged with #${initialTag}` : "Search Posts"}
          </h1>

          {!initialTag && (
            <form onSubmit={onSubmit} className="flex gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  {...form.register("query")}
                  placeholder="Search posts..."
                  className="pl-10"
                />
              </div>
            </form>
          )}
        </div>

        {isLoading ? (
          <div>Searching...</div>
        ) : results?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No posts found {initialTag ? `tagged with #${initialTag}` : "matching your search"}
          </div>
        ) : (
          <div className="grid gap-6">
            {results?.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/category/${post.category}`}>
                        <span className="text-sm text-muted-foreground hover:text-primary">
                          {post.category}
                        </span>
                      </Link>
                      <CardTitle className="mt-2">
                        <Link href={`/posts/${post.slug}`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </div>
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
        )}
      </div>
    </div>
  );
}
