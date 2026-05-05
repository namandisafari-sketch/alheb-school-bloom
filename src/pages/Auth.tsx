import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, role, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      if (role === "parent") {
        navigate("/parent", { replace: true });
      } else if (role === "admin" || role === "head_teacher" || role === "accountant") {
        navigate("/", { replace: true });
      } else if (role) {
        navigate(from, { replace: true });
      } else {
        // Logged in but no role assigned yet
        navigate("/", { replace: true });
      }
    }
  }, [user, role, navigate, from]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    const { error } = await signIn(values.email, values.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please ensure your account has been created by administration using the standard format (name@alheib.role)."
          : error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Alheib Mixed Day & Boarding School
          </h1>
          <p className="text-muted-foreground text-lg">
            School Management System - Uganda New Curriculum
          </p>
          <div className="mt-12 space-y-4 text-left">
            <div className="rounded-lg bg-background/50 p-4 border-l-4 border-primary">
              <h3 className="font-semibold">For Parents</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Track your child's attendance, grades, and communicate with teachers
              </p>
            </div>
            <div className="rounded-lg bg-background/50 p-4 border-l-4 border-blue-500">
              <h3 className="font-semibold">For Teachers</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage classes, take attendance, and record learner progress
              </p>
            </div>
            <div className="rounded-lg bg-background/50 p-4 border-l-4 border-purple-500">
              <h3 className="font-semibold">For Administration</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Full access to manage all school operations and staff
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="text-muted-foreground mt-2">
              Sign in to access the school management system
            </p>
          </div>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>New to the system?</strong><br />
              Parent accounts are created when you register your child at the school office. 
              Staff accounts are created by administration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
