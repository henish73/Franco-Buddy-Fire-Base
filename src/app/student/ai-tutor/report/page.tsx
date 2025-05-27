// src/app/student/ai-tutor/report/page.tsx
import { getAssessmentHistoryAction, type HistoricalAssessment } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, AlertCircle, BookOpen, Headphones, MessageSquareText, Mic, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const getScoreVariant = (score: number): "default" | "secondary" | "destructive" => {
  if (score >= 70) return "default"; // Success-like (green)
  if (score >= 50) return "secondary"; // Warning-like (yellow)
  return "destructive"; // Error-like (red)
};

export default async function AITutorReportPage() {
  const assessmentHistory = await getAssessmentHistoryAction();

  const assessmentsByType = {
    Speaking: assessmentHistory.filter(a => a.assessmentType === "Speaking"),
    Writing: assessmentHistory.filter(a => a.assessmentType === "Writing"),
    Reading: assessmentHistory.filter(a => a.assessmentType === "Reading"),
    Listening: assessmentHistory.filter(a => a.assessmentType === "Listening"),
  };

  const renderAssessmentTable = (assessments: HistoricalAssessment[], type: string) => {
    if (!assessments || assessments.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          <p>No {type.toLowerCase()} assessments found yet.</p>
        </div>
      );
    }
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Prompt/Topic</TableHead>
              <TableHead className="text-right">Score</TableHead>
              {/* <TableHead className="text-center">Details</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.timestamp)}</TableCell>
                <TableCell>{item.promptTopicOrId}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={getScoreVariant(item.score)}>{item.score}/100</Badge>
                </TableCell>
                {/* <TableCell className="text-center">
                  <Button variant="outline" size="sm" disabled>View</Button> 
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">AI Tutor Progress Report</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track your performance and identify areas for improvement.
        </p>
      </header>

      {/* Placeholder for Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Overall Summary</CardTitle>
          <CardDescription>Your average performance across all skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed overall summary and graphical trends will be available soon.</p>
          {/* Example:
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><strong>Speaking Avg:</strong> 70/100</div>
            <div><strong>Writing Avg:</strong> 78/100</div>
          </div> */}
        </CardContent>
      </Card>

      <Tabs defaultValue="speaking" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="speaking"><Mic className="mr-2 h-4 w-4"/>Speaking</TabsTrigger>
          <TabsTrigger value="writing"><MessageSquareText className="mr-2 h-4 w-4"/>Writing</TabsTrigger>
          <TabsTrigger value="reading"><BookOpen className="mr-2 h-4 w-4"/>Reading</TabsTrigger>
          <TabsTrigger value="listening"><Headphones className="mr-2 h-4 w-4"/>Listening</TabsTrigger>
        </TabsList>

        <TabsContent value="speaking" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Speaking Assessment History</CardTitle></CardHeader>
            <CardContent>{renderAssessmentTable(assessmentsByType.Speaking, "Speaking")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="writing" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Writing Assessment History</CardTitle></CardHeader>
            <CardContent>{renderAssessmentTable(assessmentsByType.Writing, "Writing")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Reading Assessment History</CardTitle></CardHeader>
            <CardContent>{renderAssessmentTable(assessmentsByType.Reading, "Reading")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listening" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Listening Assessment History</CardTitle></CardHeader>
            <CardContent>{renderAssessmentTable(assessmentsByType.Listening, "Listening")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {assessmentHistory.length === 0 && (
         <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Assessment Data</AlertTitle>
          <AlertDescription>
            You haven&apos;t completed any AI Tutor assessments yet. Start practicing to see your progress here!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}