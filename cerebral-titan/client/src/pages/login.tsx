import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth";
import { useLocation, useNavigate } from "react-router-dom"; // Assuming react-router-dom is used
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';


export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Use useNavigate for routing
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    setError(null); // Clear previous errors
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { token } = await response.json();
      localStorage.setItem('adminToken', token);
      navigate('/admin'); // Redirect to /admin
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center font-mono">
            🧠 Cerebral Titan Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            <div>
              <Input
                {...form.register("username")}
                placeholder="Username"
                className="font-mono"
              />
            </div>
            <div>
              <Input
                {...form.register("password")}
                type="password"
                placeholder="Password"
                className="font-mono"
              />
            </div>
            <Button type="submit" className="w-full font-mono bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

