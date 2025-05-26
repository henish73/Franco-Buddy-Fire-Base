import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, StickyNote, MessageSquare } from "lucide-react";
import Link from "next/link";

// Placeholder data - In a real app, this would come from Firestore
const demoRequests = [
  { id: "dr001", name: "Aisha Khan", email: "aisha@example.com", phone: "555-1234", tefGoal: "Express Entry CLB 7", frenchLevel: "Intermediate", availability: ["Weekday Evenings", "Weekend Mornings"], submittedAt: new Date().toISOString(), status: "New", notes: "" },
  { id: "dr002", name: "Ben Carter", email: "ben@example.com", phone: "555-5678", tefGoal: "Work Permit", frenchLevel: "Beginner", availability: ["Weekend Afternoons"], submittedAt: new Date(Date.now() - 86400000).toISOString(), status: "Contacted", notes: "Sent initial email." },
];

const contactSubmissions = [
  { id: "cs001", name: "Carlos Ray", email: "carlos@example.com", subject: "Question about 1:1 pricing", message: "...", submittedAt: new Date().toISOString(), status: "New", notes: "" },
  { id: "cs002", name: "Diana Prince", email: "diana@example.com", subject: "TEF Foundation course details", message: "...", submittedAt: new Date(Date.now() - 172800000).toISOString(), status: "Responded", notes: "Provided course brochure." },
];

// Helper to format date
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

// Helper for status badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'new': return 'default'; // Primary color
    case 'contacted': return 'secondary';
    case 'demo scheduled': return 'outline'; // Use outline for progress
    case 'closed': return 'destructive'; // Muted or destructive
    case 'responded': return 'secondary';
    default: return 'outline';
  }
};

export default function AdminLeadsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Lead Management</h1>
      
      <Tabs defaultValue="demo_requests">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="demo_requests">Demo Requests ({demoRequests.length})</TabsTrigger>
          <TabsTrigger value="contact_submissions">Contact Submissions ({contactSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="demo_requests" className="mt-6">
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">TEF Goal</TableHead>
                  <TableHead className="hidden lg:table-cell">French Level</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoRequests.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.tefGoal}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.frenchLevel}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(lead.submittedAt)}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge></TableCell>
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
                          <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" />View/Edit Details</DropdownMenuItem>
                          <DropdownMenuItem><StickyNote className="mr-2 h-4 w-4" />Update Status/Notes</DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem asChild>
                            <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp Chat
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {demoRequests.length === 0 && <p className="text-center text-muted-foreground py-8">No demo requests found.</p>}
        </TabsContent>

        <TabsContent value="contact_submissions" className="mt-6">
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactSubmissions.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.subject}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(lead.submittedAt)}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge></TableCell>
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
                          <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" />View/Edit Details</DropdownMenuItem>
                          <DropdownMenuItem><StickyNote className="mr-2 h-4 w-4" />Update Status/Notes</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {contactSubmissions.length === 0 && <p className="text-center text-muted-foreground py-8">No contact submissions found.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
