
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Post } from '@shared/schema';

const ADMIN_TOKEN = "cerebral-titan-admin-token-2024";

export function AdminPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      });
      
      if (response.ok) {
        setMessage('Post deleted successfully!');
        setIsError(false);
        fetchPosts(); // Refresh the list
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete post: ${errorData.message || 'Unknown error'}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage('An error occurred while deleting the post.');
      setIsError(true);
    }
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Manage Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div className={`p-3 mb-4 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p>No posts found. Create your first post above.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unpublished'} | 
                    <Link href={`/posts/${post.slug}`} className="ml-2 text-blue-500 hover:underline">
                      View
                    </Link>
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
