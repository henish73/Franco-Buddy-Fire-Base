// src/app/admin/enrollments/page.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";

// Placeholder data type for enrollments
type Enrollment = {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  courseId: string;
  enrollmentDate: string;
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  enrollmentStatus: "Active" | "Cancelled" | "Completed";
};

// Mock initial enrollments data
const mockEnrollments: Enrollment[] = [
  { id: "enr001", studentName: "John Doe", studentEmail: "john@example.com", courseName: "TEF Pro - CLB 7+", courseId: "tef-pro-clb7", enrollmentDate: new Date(Date.now() - 86400000 * 2).toISOString(), paymentStatus: "Paid", enrollmentStatus: "Active" },
  { id: "enr002", studentName: "Jane Smith", studentEmail: "jane@example.com", courseName: "TEF Foundation", courseId: "tef-foundation", enrollmentDate: new Date(Date.now() - 86400000 * 5).toISOString(), paymentStatus: "Pending", enrollmentStatus: "Active" },
  { id: "enr003", studentName: "Mike Brown", studentEmail: "mike@example.com", courseName: "TEF Pro - CLB 7+", courseId: "tef-pro-clb7", enrollmentDate: new Date(Date.now() - 86400000 * 1).toISOString(), paymentStatus: "Failed", enrollmentStatus: "Cancelled" },
];

// Helper to format date
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

// Helper for status badge variant
const getPaymentStatusVariant = (status: Enrollment["paymentStatus"]): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Paid': return 'default'; // Green or primary
    case 'Pending': return 'secondary'; // Yellow or secondary
    case 'Failed': return 'destructive';
    case 'Refunded': return 'outline'; // Blue or outline
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
  // In a real app, fetch enrollments from Firestore
  const enrollments = mockEnrollments;

  const handleUpdatePaymentStatus = (enrollmentId: string, newStatus: Enrollment["paymentStatus"]) => {
    // Server action to update Firestore
    console.log(`Updating payment status for ${enrollmentId} to ${newStatus}`);
  };

  const handleCancelEnrollment = (enrollmentId: string) => {
    // Server action to update Firestore
    console.log(`Cancelling enrollment ${enrollmentId}`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Enrollment Management</h1>
      
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
                  <div>{enrollment.studentName}</div>
                  <div className="text-xs text-muted-foreground">{enrollment.studentEmail}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Link href={`/admin/courses?edit=${enrollment.courseId}`} className="hover:underline text-primary">
                    {enrollment.courseName}
                  </Link>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(enrollment.enrollmentDate)}</TableCell>
                <TableCell>
                  <Badge variant={getPaymentStatusVariant(enrollment.paymentStatus)}>{enrollment.paymentStatus}</Badge>
                </TableCell>
                 <TableCell>
                  <Badge variant={getEnrollmentStatusVariant(enrollment.enrollmentStatus)}>{enrollment.enrollmentStatus}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/admin/students?edit=${enrollment.studentEmail}`} className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" /> View Student
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(enrollment.id, "Paid")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(enrollment.id, "Pending")}>
                        <MoreHorizontal className="mr-2 h-4 w-4 text-yellow-500" /> Mark as Pending
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(enrollment.id, "Failed")}>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Mark as Failed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleCancelEnrollment(enrollment.id)} className="text-destructive">
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
       {enrollments.length === 0 && <p className="text-center text-muted-foreground py-8">No enrollments found.</p>}
    </div>
  );
}
