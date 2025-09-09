// src/app/student/profile/ProfileForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, User, Lock } from "lucide-react";
import { updateProfileDetails, changePassword, type ProfileFormState } from "./actions";
import { useEffect, useRef } from "react";

const initialDetailsState: ProfileFormState = { message: "", isSuccess: false };
const initialPasswordState: ProfileFormState = { message: "", isSuccess: false };

// Placeholder data for current user
const currentUser = {
  firstName: "Aisha",
  lastName: "K.",
  email: "aisha@example.com", // Display only
  phone: "555-1234",
};

function SubmitButton({ children, pendingText = "Saving..." }: { children: React.ReactNode, pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}

export default function ProfileForm() {
  const [detailsState, detailsFormAction] = useActionState(updateProfileDetails, initialDetailsState);
  const [passwordState, passwordFormAction] = useActionState(changePassword, initialPasswordState);
  
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (passwordState.isSuccess) {
      passwordFormRef.current?.reset();
    }
  }, [passwordState.isSuccess]);


  return (
    <div className="space-y-10">
      {/* Profile Details Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><User className="h-5 w-5 text-primary"/> Personal Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <form action={detailsFormAction}>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={currentUser.firstName} required />
                {detailsState.errors?.firstName && <p className="text-sm text-destructive mt-1">{detailsState.errors.firstName.join(', ')}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={currentUser.lastName} required />
                {detailsState.errors?.lastName && <p className="text-sm text-destructive mt-1">{detailsState.errors.lastName.join(', ')}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email_display">Email (Cannot be changed)</Label>
              <Input id="email_display" name="email_display" type="email" value={currentUser.email} disabled />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={currentUser.phone} />
              {detailsState.errors?.phone && <p className="text-sm text-destructive mt-1">{detailsState.errors.phone.join(', ')}</p>}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full space-y-2">
                <SubmitButton>Save Changes</SubmitButton>
                {detailsState.message && detailsState.updatedField === 'details' && (
                <Alert variant={detailsState.isSuccess ? "default" : "destructive"}>
                    {detailsState.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{detailsState.isSuccess ? "Success!" : "Error!"}</AlertTitle>
                    <AlertDescription>{detailsState.message}</AlertDescription>
                </Alert>
                )}
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Change Password Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Lock className="h-5 w-5 text-primary"/> Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <form action={passwordFormAction} ref={passwordFormRef}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
              {passwordState.errors?.currentPassword && <p className="text-sm text-destructive mt-1">{passwordState.errors.currentPassword.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" required />
              {passwordState.errors?.newPassword && <p className="text-sm text-destructive mt-1">{passwordState.errors.newPassword.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
              {passwordState.errors?.confirmPassword && <p className="text-sm text-destructive mt-1">{passwordState.errors.confirmPassword.join(', ')}</p>}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
             <div className="w-full space-y-2">
                <SubmitButton>Change Password</SubmitButton>
                {passwordState.message && passwordState.updatedField === 'password' && (
                <Alert variant={passwordState.isSuccess ? "default" : "destructive"}>
                    {passwordState.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{passwordState.isSuccess ? "Success!" : "Error!"}</AlertTitle>
                    <AlertDescription>{passwordState.message}</AlertDescription>
                </Alert>
                )}
             </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
