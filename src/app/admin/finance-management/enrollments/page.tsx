// src/app/admin/finance-management/enrollments/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, Eye, RefreshCw, Clock } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { getEnrollmentsAction, updateEnrollmentStatusAction, type Enrollment } from '../actions';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

const getPaymentStatusVariant = (status: Enrollment["paymentStatus"]): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Pending': return 'secondary';
    case 'Failed': return 'destructive';
    case 'Refunded': return 'outline';
    default: return 'outline';
  }
};

const getEnrollmentStatusVariant = (status: Enrollment["enrollmentStatus"]): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active': return 'default';
    case 'Completed': return 'secondary';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
};

export default function AdminEnrollmentsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const fetchEnrollments = async () => {
    startTransition(async () => {
      const result = await getEnrollmentsAction();
      if (result.isSuccess && Array.isArray(result.data)) {
        setEnrollments(result.data);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUpdateStatus = (enrollmentId: string, newStatus: Enrollment["enrollmentStatus"]) => {
    startTransition(async () => {
      const result = await updateEnrollmentStatusAction(enrollmentId, newStatus);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        fetchEnrollments(); // Refetch data
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Enrollment Management</h2>
         <Button onClick={fetchEnrollments} variant="outline" size="icon" aria-label="Refresh Enrollments" disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead className="hidden lg:table-cell">Enrollment Date</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Enrollment Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell className="font-medium">
                  <div>{enrollment.fullName}</div>
                  <div className="text-xs text-muted-foreground">{enrollment.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{enrollment.courseName}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(enrollment.date)}</TableCell>
                <TableCell>
                  <Badge variant={getPaymentStatusVariant(enrollment.paymentStatus)}>{enrollment.paymentStatus}</Badge>
                </TableCell>
                 <TableCell>
                  <Badge variant={getEnrollmentStatusVariant(enrollment.enrollmentStatus)}>{enrollment.enrollmentStatus}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/student-management?edit=${enrollment.studentId}`} className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" /> View Student
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Enrollment Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(enrollment.id, "Active")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark as Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(enrollment.id, "Completed")}>
                        <Clock className="mr-2 h-4 w-4 text-blue-500" /> Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(enrollment.id, "Cancelled")} className="text-destructive">
                        <XCircle className="mr-2 h-4 w-4" /> Cancel Enrollment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {enrollments.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No enrollments found.</p>}
    </div>
  );
}
