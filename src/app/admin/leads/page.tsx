// src/app/admin/leads/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, StickyNote, MessageSquare, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getLeadsAction, updateLeadStatusAction, type DemoRequestLead, type ContactLead } from './actions';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'new': return 'default';
    case 'contacted': return 'secondary';
    case 'demo scheduled': return 'outline';
    case 'converted': return 'default';
    case 'closed': return 'destructive';
    case 'responded': return 'secondary';
    default: return 'outline';
  }
};

export default function AdminLeadsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [demoRequests, setDemoRequests] = useState<DemoRequestLead[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactLead[]>([]);

  const fetchLeads = () => {
    startTransition(async () => {
      const result = await getLeadsAction();
      if (result.isSuccess) {
        setDemoRequests(result.data?.demoRequests || []);
        setContactSubmissions(result.data?.contactSubmissions || []);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = (leadId: string, leadType: 'demo' | 'contact', newStatus: string) => {
    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, leadType, newStatus);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        fetchLeads();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Lead Management</h1>
         <Button onClick={fetchLeads} variant="outline" size="icon" aria-label="Refresh Leads" disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
      </div>
      
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
                    <TableCell className="hidden lg:table-cell">{lead.goals}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(lead.submittedAt)}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'demo', 'Contacted')}>Mark as Contacted</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'demo', 'Demo Scheduled')}>Demo Scheduled</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'demo', 'Converted')}>Mark as Converted</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'demo', 'Closed')} className="text-destructive">Close Lead</DropdownMenuItem>
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
           {demoRequests.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No demo requests found.</p>}
        </TabsContent>

        <TabsContent value="contact_submissions" className="mt-6">
          <div className="rounded-lg border shadow-sm">
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Inquiry Type</TableHead>
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
                    <TableCell className="hidden lg:table-cell">{lead.inquiryType}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(lead.submittedAt)}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'contact', 'Responded')}>Mark as Responded</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'contact', 'Closed')} className="text-destructive">Close Lead</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {contactSubmissions.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No contact submissions found.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
