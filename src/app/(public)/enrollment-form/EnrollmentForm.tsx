// src/app/(public)/enrollment-form/EnrollmentForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnrollmentForm, type EnrollmentFormState } from './actions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react";
import { type Course } from '@/components/shared/CourseCard';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialState: EnrollmentFormState = {
  message: "",
  isSuccess: false,
};

const preferredDaysOptions = ["Saturdays", "Sundays", "Both"];
const preferredTimeOptions = ["Morning", "Afternoon", "Evening"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Processing..." : <>Complete Enrollment <CreditCard className="ml-2 h-4 w-4"/></>}
    </Button>
  );
}

type EnrollmentFormProps = {
  course?: Course;
};

export default function EnrollmentForm({ course }: EnrollmentFormProps) {
  const [state, formAction] = useActionState(submitEnrollmentForm, initialState);

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl text-primary">Secure Your Spot Now</CardTitle>
        {course ? 
            <CardDescription>You're enrolling in: <strong>{course.title}</strong>.</CardDescription>
            : <CardDescription>Fill out your details to join our next TEF/TCF batch.</CardDescription>
        }
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <input type="hidden" name="courseId" value={course?.id || 'general-enrollment'} />
          <input type="hidden" name="courseName" value={course?.title || 'General Enrollment'} />

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-foreground mb-2">1. Personal Information</legend>
            <div className="grid md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Your Phone Number" required/>
                {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" placeholder="Your Age" required/>
                {state.errors?.age && <p className="text-sm text-destructive mt-1">{state.errors.age.join(', ')}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country of Residence</Label>
              <Input id="country" name="country" placeholder="e.g., Canada" required/>
              {state.errors?.country && <p className="text-sm text-destructive mt-1">{state.errors.country.join(', ')}</p>}
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t pt-6">
             <legend className="text-lg font-semibold text-foreground mb-2">2. French Learning Background</legend>
              <div>
                <Label htmlFor="currentLevel">Current French Level</Label>
                <Input id="currentLevel" name="currentLevel" placeholder="e.g., Complete Beginner, A2, B1" required />
                {state.errors?.currentLevel && <p className="text-sm text-destructive mt-1">{state.errors.currentLevel.join(', ')}</p>}
              </div>
              <div>
                <Label htmlFor="learningGoal">Primary Learning Goal</Label>
                <Input id="learningGoal" name="learningGoal" placeholder="e.g., TEF Canada for PR, Professional Fluency" required />
                {state.errors?.learningGoal && <p className="text-sm text-destructive mt-1">{state.errors.learningGoal.join(', ')}</p>}
              </div>
               <div>
                <Label htmlFor="previousExperience">Previous Learning Experience</Label>
                <Textarea id="previousExperience" name="previousExperience" placeholder="e.g., Studied in high school, used Duolingo, etc." rows={3} />
              </div>
          </fieldset>

           <fieldset className="space-y-4 border-t pt-6">
            <legend className="text-lg font-semibold text-foreground mb-2">3. Schedule Preferences</legend>
            <div className="space-y-2">
                <Label>Preferred Days</Label>
                <RadioGroup name="preferredDays" className="flex flex-wrap gap-4">
                  {preferredDaysOptions.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <RadioGroupItem value={day} id={`day-${day}`} />
                      <Label htmlFor={`day-${day}`} className="font-normal">{day}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {state.errors?.preferredDays && <p className="text-sm text-destructive mt-1">{state.errors.preferredDays.join(', ')}</p>}
            </div>
             <div className="space-y-2">
                <Label>Preferred Time (EST)</Label>
                 <RadioGroup name="preferredTime" className="flex flex-wrap gap-4">
                  {preferredTimeOptions.map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <RadioGroupItem value={time} id={`time-${time}`} />
                      <Label htmlFor={`time-${time}`} className="font-normal">{time}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {state.errors?.preferredTime && <p className="text-sm text-destructive mt-1">{state.errors.preferredTime.join(', ')}</p>}
            </div>
           </fieldset>

            <fieldset className="space-y-4 border-t pt-6">
                <legend className="text-lg font-semibold text-foreground mb-2">4. Payment & Terms</legend>
                <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium text-foreground">Payment Information</h4>
                    <p className="text-sm text-muted-foreground">Your selected monthly fee will be based on your chosen plan (1:1 or Group). We accept Credit/Debit Card, and Interac e-Transfer. Payment details will be provided via email after enrollment confirmation.</p>
                </div>
                <div className="flex items-start space-x-2 pt-2">
                    <Checkbox id="terms" name="terms" required />
                    <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="terms" className="font-normal">
                        I acknowledge and agree to the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </Label>
                    {state.errors?.terms && <p className="text-sm text-destructive">{state.errors.terms.join(', ')}</p>}
                    </div>
                </div>
            </fieldset>

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
                </AlertDescription>
                </Alert>
            )}
            <p className="text-center text-sm text-muted-foreground">Not ready to commit? <Link href="/book-demo" className="text-primary hover:underline">Try our FREE demo class first!</Link></p>
           </div>
        </CardFooter>
      </form>
    </Card>
  );
}
