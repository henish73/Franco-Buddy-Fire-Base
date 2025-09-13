// src/app/admin/site-management/settings/SiteSettingsForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { updateSiteSettings, type SiteSettingsFormState } from "./actions";

const siteSettingsSchema = z.object({
  adminContactEmail: z.string().email({ message: "Invalid admin email address." }),
  studentsHelpedCount: z.coerce.number().int().min(0, { message: "Must be a positive number." }),
  successRateCLB7: z.coerce.number().int().min(0).max(100, { message: "Must be between 0 and 100." }),
});

export type InitialSiteSettings = z.infer<typeof siteSettingsSchema>;

const initialState: SiteSettingsFormState = {
  message: "",
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Settings"}
    </Button>
  );
}

type SiteSettingsFormProps = {
  initialData: InitialSiteSettings;
};

export default function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateSiteSettings, initialState);

  const { register, handleSubmit, formState: { errors } } = useForm<InitialSiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialData,
  });

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Global Site Metrics</CardTitle>
            <CardDescription>Update the numbers and contact info displayed publicly across the site.</CardDescription>
        </CardHeader>
        <form action={formAction}>
            <CardContent className="space-y-6">
                 <div>
                    <Label htmlFor="adminContactEmail">Admin Contact Email</Label>
                    <Input id="adminContactEmail" type="email" defaultValue={initialData.adminContactEmail} name="adminContactEmail" />
                    {state.errors?.adminContactEmail && <p className="text-sm text-destructive mt-1">{state.errors.adminContactEmail.join(', ')}</p>}
                </div>
                 <div>
                    <Label htmlFor="studentsHelpedCount">Students Helped Count</Label>
                    <Input id="studentsHelpedCount" type="number" defaultValue={initialData.studentsHelpedCount} name="studentsHelpedCount" />
                    {state.errors?.studentsHelpedCount && <p className="text-sm text-destructive mt-1">{state.errors.studentsHelpedCount.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="successRateCLB7">Success Rate (CLB 7+)</Label>
                    <Input id="successRateCLB7" type="number" defaultValue={initialData.successRateCLB7} name="successRateCLB7" />
                    {state.errors?.successRateCLB7 && <p className="text-sm text-destructive mt-1">{state.errors.successRateCLB7.join(', ')}</p>}
                </div>
                <SubmitButton/>
                {state.message && (
                    <p className={`text-sm ${state.isSuccess ? 'text-green-500' : 'text-destructive'}`}>{state.message}</p>
                )}
            </CardContent>
        </form>
    </Card>
  );
}
