import { getSurveys, getTotalSurveyCount } from "@/server/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SurveyActionsDropdown from "../SurveyActionsDropdown";
import { archiveSurvey } from "@/app/actions/survey";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const SurveysPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [surveys, totalCount] = await Promise.all([
    getSurveys(skip, pageSize),
    getTotalSurveyCount(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Surveys</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
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
              <TableCell>{survey.name}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "mr-0.5 uppercase text-black hover:text-black",
                    survey.isPublished
                      ? "bg-green-400 hover:bg-green-400"
                      : "bg-yellow-400 hover:bg-yellow-400",
                  )}
                >
                  {survey.isPublished ? "Published" : "Draft"}
                </Badge>
                {survey.isArchived && (
                  <Badge className="bg-red-400 uppercase text-black hover:bg-red-400">
                    Archived
                  </Badge>
                )}
              </TableCell>
              <TableCell>{survey.title}</TableCell>
              <TableCell>{survey.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                {survey.responseCount}
              </TableCell>
              <TableCell className="">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/survey/responses/${survey.id}`}>
                    <MessageSquareQuote className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
              <TableCell className="">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/survey/visualise/${survey.id}`}>
                    <BarChart className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <SurveyActionsDropdown
                  id={survey.id}
                  archiveSurvey={archiveSurvey}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 1 && (
                <PaginationPrevious
                  href={`?page=${page - 1}`}
                  aria-disabled={page <= 1}
                />
              )}
            </PaginationItem>

            {page > 2 && (
              <PaginationItem>
                <PaginationLink href="?page=1">1</PaginationLink>
              </PaginationItem>
            )}

            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {page > 1 && (
              <PaginationItem>
                <PaginationLink href={`?page=${page - 1}`}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink href={`?page=${page}`} isActive>
                {page}
              </PaginationLink>
            </PaginationItem>

            {page < totalPages && (
              <PaginationItem>
                <PaginationLink href={`?page=${page + 1}`}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink href={`?page=${totalPages}`}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPages
                    ? `?page=${page + 1}`
                    : new URLSearchParams().toString()
                }
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default SurveysPage;
