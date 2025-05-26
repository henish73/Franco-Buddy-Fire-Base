// src/app/(public)/login/LoginForm.tsx
"use client";

import { useEffect } from "react";
import { useActionState } from "react"; // Updated import
import { useFormStatus } from "react-dom"; // Corrected import
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, LogIn } from "lucide-react";
import { handleLogin, type LoginFormState } from "./actions";

const initialState: LoginFormState = {
  message: "",
  isSuccess: false,
  redirectUrl: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Logging in..." : <><LogIn className="mr-2 h-4 w-4" /> Login</>}
    </Button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(handleLogin, initialState); // Renamed hook
  const router = useRouter();

  useEffect(() => {
    if (state.isSuccess && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state.isSuccess, state.redirectUrl, router]);

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
            {state.errors?.password && <p className="text-sm text-destructive mt-1">{state.errors.password.join(', ')}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          {state.message && !state.isSuccess && (
            <Alert variant={state.isSuccess ? "default" : "destructive"} className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          {/* Success message is handled by redirect, so not explicitly shown here unless redirect fails */}
           {state.message && state.isSuccess && !state.redirectUrl && (
             <Alert variant="default" className="w-full">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{state.message} (Redirect might have failed)</AlertDescription>
            </Alert>
           )}
        </CardFooter>
      </form>
    </Card>
  );
}
