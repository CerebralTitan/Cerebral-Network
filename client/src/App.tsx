import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageLayout from "@/components/layout/PageLayout";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import Portfolio from "@/pages/portfolio";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PageLayout>
        <main className="container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/blog" component={Blog} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/about" component={About} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;