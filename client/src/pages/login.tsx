import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      await login(data.username, data.password);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
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
