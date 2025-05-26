// src/app/admin/settings/SiteSettingsForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { updateSiteSettings, type SiteSettingsFormState } from "./actions";

// This type should match the structure of your Firestore document if you're fetching initial values
export type InitialSiteSettings = {
  adminContactEmail: string;
  studentsHelpedCount: number;
  successRateCLB7: number;
};

const initialState: SiteSettingsFormState = {
  message: "",
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Settings"}
    </Button>
  );
}

type SiteSettingsFormProps = {
  initialData: InitialSiteSettings; // Pass initial data fetched from server component
};

export default function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const [state, formAction] = useFormState(updateSiteSettings, initialState);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Site Configuration</CardTitle>
        <CardDescription>Manage general site settings and homepage statistics.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="adminContactEmail">Admin Contact Email</Label>
            <Input 
              id="adminContactEmail" 
              name="adminContactEmail" 
              type="email" 
              defaultValue={initialData.adminContactEmail} 
              required 
            />
            {state.errors?.adminContactEmail && <p className="text-sm text-destructive mt-1">{state.errors.adminContactEmail.join(', ')}</p>}
            <p className="text-xs text-muted-foreground mt-1">Email for receiving site notifications (e.g., new leads).</p>
          </div>

          <h3 className="text-lg font-semibold text-foreground border-t pt-4">Homepage Quick Stats</h3>
          <div>
            <Label htmlFor="studentsHelpedCount">Students Helped Count</Label>
            <Input 
              id="studentsHelpedCount" 
              name="studentsHelpedCount" 
              type="number" 
              defaultValue={initialData.studentsHelpedCount}
              required 
            />
            {state.errors?.studentsHelpedCount && <p className="text-sm text-destructive mt-1">{state.errors.studentsHelpedCount.join(', ')}</p>}
            <p className="text-xs text-muted-foreground mt-1">Number displayed on the homepage (e.g., &quot;150+&quot;).</p>
          </div>
          <div>
            <Label htmlFor="successRateCLB7">CLB 7+ Success Rate (%)</Label>
            <Input 
              id="successRateCLB7" 
              name="successRateCLB7" 
              type="number" 
              min="0" 
              max="100" 
              defaultValue={initialData.successRateCLB7}
              required 
            />
            {state.errors?.successRateCLB7 && <p className="text-sm text-destructive mt-1">{state.errors.successRateCLB7.join(', ')}</p>}
            <p className="text-xs text-muted-foreground mt-1">Percentage displayed on the homepage (e.g., &quot;92%&quot;).</p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="flex flex-col w-full gap-4">
            <SubmitButton />
            {state.message && (
              <Alert variant={state.isSuccess ? "default" : "destructive"}>
                {state.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{state.isSuccess ? "Success!" : "Error!"}</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
