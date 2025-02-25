import { currentUser } from "@clerk/nextjs/server";
import { getDashboardData } from "@/server/queries";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  archiveSurvey,
  deleteSurvey,
  renameSurvey,
  duplicateSurvey,
} from "@/app/actions/survey";
import { ResponsesChart } from "./ResponsesChart";
import SurveyActionsDropdown from "./SurveyActionsDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MessageSquareQuote, BarChart } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  const { requestedSurveys: surveys, responseCount } = await getDashboardData(
    4,
    14,
  );
  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <header className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-orange-500" />
        <p className="font-mono text-lg font-light uppercase tracking-tight">
          Welcome back, <span className="">{user?.firstName}</span>
        </p>
      </header>
      <ResponsesChart responseCount={responseCount} />
      <Card>
        <CardHeader>
          <CardTitle>Your latest surveys</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full text-base">
            <TableHeader className="text-sm">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right"># of responses</TableHead>
                <TableHead className="">Responses</TableHead>
                <TableHead className="">Visualize</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>
                    <Link
                      href={`/survey/create/${survey.id}`}
                      className="flex w-full items-center gap-2 hover:underline"
                    >
                      {survey.title}
                      <ExternalLink className="h-4 w-4" />
                      {new Date().getTime() -
                        new Date(survey.createdAt).getTime() <
                        1000 * 60 * 60 * 12 && (
                        <Badge className="self-end bg-green-400 text-black no-underline hover:bg-green-300">
                          New
                        </Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${survey.isPublished ? "bg-green-400 hover:bg-green-400" : "bg-yellow-400 hover:bg-yellow-400"} text-black`}
                    >
                      {survey.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(survey.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {survey.responseCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {survey.isPublished ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        disabled={!survey.isPublished}
                      >
                        <Link
                          href={`/survey/responses/${survey.id}`}
                          className="inline-flex items-center gap-2 hover:underline"
                        >
                          <MessageSquareQuote className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <MessageSquareQuote className="h-4 w-4" />
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {survey.isPublished ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        disabled={!survey.isPublished}
                      >
                        <Link
                          href={`/survey/visualize/${survey.id}`}
                          className="inline-flex items-center gap-2 p-2 hover:underline"
                        >
                          <BarChart className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <BarChart className="h-4 w-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <SurveyActionsDropdown
                      id={survey.id}
                      archiveSurvey={archiveSurvey}
                      deleteSurvey={deleteSurvey}
                      isArchived={survey.isArchived ?? false}
                      renameSurvey={renameSurvey}
                      surveyName={survey.title}
                      duplicateSurvey={duplicateSurvey}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
