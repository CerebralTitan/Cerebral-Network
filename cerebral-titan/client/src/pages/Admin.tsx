import React from 'react';
import { AdminPostForm } from '@/components/AdminPostform';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Admin() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h2 className="font-bold text-indigo-800 dark:text-indigo-300">Admin Quick Guide</h2>
        <ul className="list-disc list-inside mt-2 text-indigo-700 dark:text-indigo-300">
          <li>Create new posts using the form below</li>
          <li>Delete unwanted posts from the management section</li>
          <li>Posts are automatically saved and displayed on the homepage</li>
          <li>The default post is "Cerebral Titan" (pre-filled in the form)</li>
        </ul>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Post Management</h2>
        <div className="space-x-2">
          <Link href="/">
            <Button variant="outline">Return to Homepage</Button>
          </Link>
        </div>
      </div>

      <AdminPostForm />
    </div>
  );
}