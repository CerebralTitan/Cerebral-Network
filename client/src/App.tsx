import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import PostEditor from "@/pages/post-editor";
import PostView from "@/pages/post-view";
import CategoryView from "@/pages/category-view";
import SearchPage from "@/pages/search";
import AboutPage from "@/pages/about";
import Navbar from "@/components/navbar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/posts/:slug" component={PostView} />
          <Route path="/category/:slug" component={CategoryView} />
          <Route path="/search" component={SearchPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/admin/post" component={PostEditor} />
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