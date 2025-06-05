import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ShieldCheck, LogIn, AlertTriangle, KeyRound } from 'lucide-react'; // Icons

// For react-hook-form
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);

  console.log('LoginPage loaded');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    setLoginError(null);
    console.log('Login attempt with:', data);
    // Simulate API call
    if (data.email === "user@example.com" && data.password === "password123") {
      console.log('Login successful');
      // In a real app, you'd set auth tokens here
      navigate('/accounts-dashboard');
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password action triggered");
    // Logic for forgot password (e.g., send reset email)
    setShowForgotPasswordDialog(false);
    // Potentially show a toast message here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Welcome Back</h1>
          <p className="text-gray-600">Securely access your TSB account.</p>
        </div>

        {loginError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between text-sm">
              <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="link" type="button" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-500">
                    Forgot Password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Password Recovery</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recovery-email" className="text-right">
                        Email
                      </Label>
                      <Input id="recovery-email" type="email" placeholder="you@example.com" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowForgotPasswordDialog(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleForgotPassword}>Send Instructions</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging in...' : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          {/* Placeholder for biometric login prompt/button */}
          {/* <Button variant="outline" className="mt-4 w-full">
            <Fingerprint className="mr-2 h-5 w-5" /> Sign in with Biometrics
          </Button> */}
          <p className="mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-500" onClick={() => alert('Sign up functionality not implemented.')}>
              Sign Up
            </Button>
          </p>
        </div>
         <p className="text-center text-xs text-gray-500 mt-4">
            For demo: user@example.com / password123
        </p>
      </div>
    </div>
  );
};

export default LoginPage;