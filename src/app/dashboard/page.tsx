import { currentUser } from "@clerk/nextjs/server";
import { getAllSurveys } from "@/server/queries";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MoreHorizontal } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  const surveys = await getAllSurveys();
  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <header className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-orange-500" />
        <p className="font-mono text-lg font-light uppercase tracking-tight">
          Welcome back, <span className="">{user?.firstName}</span>
        </p>
      </header>

      <Table className="w-full text-base">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Responses</TableHead>
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
                  {survey.name}
                  <ExternalLink className="h-4 w-4" />
                  {new Date().getTime() - new Date(survey.createdAt).getTime() <
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
              <TableCell className="truncate">{survey.title}</TableCell>
              <TableCell className="text-sm">
                {new Date(survey.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {survey.responseCount}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
