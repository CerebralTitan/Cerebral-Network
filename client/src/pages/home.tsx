import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blog-posts";

const Home = () => {
  // Get the latest blog post for the featured section
  const featuredPost = blogPosts[0];
  // Get the next 3 posts for the recent posts section
  const recentPosts = blogPosts.slice(1, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to Future Imperfect
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A minimalist blog and portfolio template showcasing clean design and thoughtful content presentation.
        </p>
      </section>

      {/* Featured Post Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Featured Post</h2>
          <Link href="/blog">
            <Button variant="ghost">View All Posts →</Button>
          </Link>
        </div>
        <BlogCard post={featuredPost} featured={true} />
      </section>

      {/* Recent Posts Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Recent Posts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 py-12">
        <h2 className="text-2xl font-bold">Want to see more?</h2>
        <p className="text-muted-foreground">
          Check out my portfolio to see my latest projects and work.
        </p>
        <Link href="/portfolio">
          <Button size="lg">View Portfolio</Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
