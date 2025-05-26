// src/app/(public)/enroll/[courseId]/EnrollmentForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // If needed for other fields
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useFormState, useFormStatus } from 'react-dom';
import { submitEnrollmentForm, type EnrollmentFormState } from './actions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react";


const initialState: EnrollmentFormState = {
  message: "",
  isSuccess: false,
};

const availabilityOptions = [
  { id: "weekdayMornings", label: "Weekday Mornings", value: "Weekday Mornings" },
  { id: "weekdayAfternoons", label: "Weekday Afternoons", value: "Weekday Afternoons" },
  { id: "weekdayEvenings", label: "Weekday Evenings", value: "Weekday Evenings" },
  { id: "weekendMornings", label: "Weekend Mornings", value: "Weekend Mornings" },
  { id: "weekendAfternoons", label: "Weekend Afternoons", value: "Weekend Afternoons" },
  { id: "flexibleContact", label: "Flexible - Contact Me", value: "Flexible - Contact Me" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Processing..." : <>Proceed to Payment <CreditCard className="ml-2 h-4 w-4"/></>}
    </Button>
  );
}

type EnrollmentFormProps = {
  courseName: string;
  courseId: string;
};

export default function EnrollmentForm({ courseName, courseId }: EnrollmentFormProps) {
  const [state, formAction] = useFormState(submitEnrollmentForm, initialState);

  // TODO: Pre-fill from authenticated user profile if available

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl text-primary">Enrollment Details</CardTitle>
        <CardDescription>Confirm your information for: <strong>{courseName}</strong>.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="courseName" value={courseName} />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" placeholder="Your Full Name" required />
              {state.errors?.fullName && <p className="text-sm text-destructive mt-1">{state.errors.fullName.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
              {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email.join(', ')}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" placeholder="Your Phone Number" required/>
            {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
          </div>

          <fieldset className="space-y-3 pt-2">
            <legend className="text-sm font-medium text-foreground mb-1">Address (Optional - for Billing)</legend>
            <div>
              <Label htmlFor="streetAddress" className="sr-only">Street Address</Label>
              <Input id="streetAddress" name="streetAddress" placeholder="Street Address" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="sr-only">City</Label>
                <Input id="city" name="city" placeholder="City" />
              </div>
              <div>
                <Label htmlFor="province" className="sr-only">Province</Label>
                <Input id="province" name="province" placeholder="Province/State" />
              </div>
              <div>
                <Label htmlFor="postalCode" className="sr-only">Postal Code</Label>
                <Input id="postalCode" name="postalCode" placeholder="Postal/Zip Code" />
              </div>
            </div>
             {state.errors?.streetAddress && <p className="text-sm text-destructive mt-1">{state.errors.streetAddress.join(', ')}</p>}
             {state.errors?.city && <p className="text-sm text-destructive mt-1">{state.errors.city.join(', ')}</p>}
             {state.errors?.province && <p className="text-sm text-destructive mt-1">{state.errors.province.join(', ')}</p>}
             {state.errors?.postalCode && <p className="text-sm text-destructive mt-1">{state.errors.postalCode.join(', ')}</p>}
          </fieldset>

          <div>
            <Label>Preferred Batch Timing/Availability</Label>
            <div className="space-y-2 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {availabilityOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox id={option.id} name="availability" value={option.value} />
                  <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                </div>
              ))}
            </div>
            {state.errors?.availability && <p className="text-sm text-destructive mt-1">{state.errors.availability.join(', ')}</p>}
          </div>

          <fieldset className="space-y-3 pt-2">
            <legend className="text-sm font-medium text-foreground mb-1">Emergency Contact (Optional)</legend>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="emergencyContactName" className="sr-only">Emergency Contact Name</Label>
                    <Input id="emergencyContactName" name="emergencyContactName" placeholder="Emergency Contact Name" />
                </div>
                <div>
                    <Label htmlFor="emergencyContactPhone" className="sr-only">Emergency Contact Phone</Label>
                    <Input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" placeholder="Emergency Contact Phone" />
                </div>
            </div>
            {state.errors?.emergencyContactName && <p className="text-sm text-destructive mt-1">{state.errors.emergencyContactName.join(', ')}</p>}
            {state.errors?.emergencyContactPhone && <p className="text-sm text-destructive mt-1">{state.errors.emergencyContactPhone.join(', ')}</p>}
          </fieldset>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" name="terms" required />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms" className="font-normal">
                I acknowledge and agree to the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link>.
              </Label>
              {state.errors?.terms && <p className="text-sm text-destructive">{state.errors.terms.join(', ')}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
           <div className="w-full space-y-4">
            <SubmitButton />
            {state.message && (
                <Alert variant={state.isSuccess ? "default" : "destructive"}>
                {state.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{state.isSuccess ? "Success!" : "Error!"}</AlertTitle>
                <AlertDescription>
                    {state.message}
                    {state.isSuccess && state.redirectUrl && (
                        <Link href={state.redirectUrl} className="font-semibold underline ml-1">Proceed to Payment.</Link>
                    )}
                </AlertDescription>
                </Alert>
            )}
           </div>
        </CardFooter>
      </form>
    </Card>
  );
}
