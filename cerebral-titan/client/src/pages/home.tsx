import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Post, Category } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function HomePage() {
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (postsLoading || categoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-mono font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              🚀 Latest Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-mono">
              Explore my latest thoughts and learnings about Python programming
            </p>
          </div>

          <div className="grid gap-6">
          {posts?.sort((a, b) => {
              // Sort by title to put "Cerebral Titan" at the top
              if (a.title.includes("Cerebral Titan")) return -1;
              if (b.title.includes("Cerebral Titan")) return 1;
              // Then sort by date
              return new Date(b.publishedAt || Date.now()).getTime() - new Date(a.publishedAt || Date.now()).getTime();
            }).map((post) => (
              <Card key={post.id} className="border-purple-200 dark:border-purple-900 hover:border-purple-400 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/category/${post.category}`}>
                        <span className="text-sm font-mono text-purple-500 hover:text-pink-500">
                          📚 {post.category}
                        </span>
                      </Link>
                      <CardTitle className="mt-2 font-mono">
                        <Link href={`/posts/${post.slug}`} className="hover:text-purple-500 transition-colors">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <time className="text-sm text-muted-foreground font-mono">
                      ⏱️ {formatDistanceToNow(new Date(post.publishedAt || Date.now()), { addSuffix: true })}
                    </time>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-mono">{post.excerpt}</p>
                  <div className="mt-4 flex gap-2">
                    {post.tags?.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?tag=${tag}`}
                        className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors font-mono"
                      >
                        #️⃣ {tag}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="font-mono">📚 Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-md font-mono transition-colors"
                  >
                    🔖 {category.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}