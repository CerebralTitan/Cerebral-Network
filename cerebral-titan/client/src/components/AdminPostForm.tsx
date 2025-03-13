
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';

// Import admin token directly 
const ADMIN_TOKEN = "cerebral-titan-admin-token-2024";

interface PostFormData {
  title: string;
  content: string;
  slug: string;
  categoryId: number;
  excerpt?: string;
  category?: string;
  tags?: string[];
}

interface Post {
  id: number;
  title: string;
  slug: string;
}

export function AdminPostForm() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setLocation] = useLocation();
  const form = useForm<PostFormData>({
    defaultValues: {
      title: 'Cerebral Titan',
      content: '# Welcome to Cerebral Titan\n\nThis is your first post!',
      slug: 'cerebral-titan',
      categoryId: 1,
      category: 'Python Basics',
      excerpt: 'Introduction to the Cerebral Titan blog',
      tags: ['welcome', 'introduction']
    }
  });

  // Fetch existing posts
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  const onSubmit = async (data: PostFormData) => {
    try {
      // Ensure the category is set
      if (!data.category) {
        data.category = 'Python Basics';
      }

      // Ensure tags is an array
      if (typeof data.tags === 'string') {
        data.tags = (data.tags as string).split(',').map(tag => tag.trim());
      }
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        alert('Post created successfully!');
        form.reset();
        // Navigate to the post
        setLocation(`/posts/${data.slug}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to create post: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      });
      
      if (response.ok) {
        alert('Post deleted successfully!');
        setPosts(posts.filter(post => post.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post.');
    }
  };

  return (
    <div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input {...form.register("title")} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <Input {...form.register("slug")} required placeholder="url-friendly-slug" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input {...form.register("category")} required defaultValue="Python Basics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <Input {...form.register("excerpt")} placeholder="Brief description" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <Input {...form.register("tags")} placeholder="tag1, tag2, tag3" defaultValue="welcome, introduction" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
              <Textarea {...form.register("content")} rows={10} required />
            </div>
            <Button type="submit">Create Post</Button>
          </form>
        </CardContent>
      </Card>
      
      {posts && posts.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Manage Existing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {posts.map(post => (
                <div key={post.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{post.title}</span>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation(`/posts/${post.slug}`)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
