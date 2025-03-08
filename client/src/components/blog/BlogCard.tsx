import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Pinned, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  onTogglePin?: (id: string) => void;
}

const BlogCard = ({ post, featured = false, onTogglePin }: BlogCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        featured
          ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-1"
          : "col-span-2 md:col-span-1"
      )}
    >
      {post.pinned && (
        <div className="absolute right-2 top-2 z-20">
          <Badge
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTogglePin?.(post.id);
            }}
            className="cursor-pointer bg-primary/80 px-2 py-1 text-xs font-semibold uppercase text-primary-foreground backdrop-blur-sm hover:bg-primary/70"
          >
            <Pinned className="mr-1 h-3 w-3" />
            Pinned
          </Badge>
        </div>
      )}

      <a href={`/blog/${post.slug}`} className="block h-full w-full">
        <CardContent className="flex h-full flex-col justify-between p-5">
          <div>
            <div className="space-x-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-primary/20 bg-primary/5 text-xs text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight md:text-2xl">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-5 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {timeAgo}
          </div>
          <div>
            {!post.pinned && onTogglePin && (
              <Badge
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTogglePin(post.id);
                }}
                variant="outline"
                className="cursor-pointer px-2 py-0 text-xs hover:bg-accent/50"
              >
                <Pinned className="mr-1 h-3 w-3" />
                Pin
              </Badge>
            )}
          </div>
        </CardFooter>
      </a>
    </Card>
  );
};

export default BlogCard;