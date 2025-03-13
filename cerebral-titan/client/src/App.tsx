import React from 'react';
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PostEditor from "@/pages/post-editor";
import PostView from "@/pages/post-view";
import CategoryView from "@/pages/category-view";
import SearchPage from "@/pages/search";
import AboutPage from "@/pages/about";
import Navbar from "@/components/navbar";
import Admin from "@/pages/Admin";

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main className="container mx-auto px-4 py-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/posts/:slug" component={PostView} />
          <Route path="/categories/:slug" component={CategoryView} />
          <Route path="/search" component={SearchPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/admin/post" component={PostEditor} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;