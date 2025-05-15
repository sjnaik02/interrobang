import { getSurveyFromId, getResponsesFromSurveyId } from "@/server/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TopNav from "@/components/TopNav";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { notFound } from "next/navigation";

const ITEMS_PER_PAGE = 100;

const SurveyResponsesPage = async (
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page?: string }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    notFound();
  }
  if (!survey.isPublished) {
    notFound();
  }
  const responses = await getResponsesFromSurveyId(
    params.id,
    skip,
    ITEMS_PER_PAGE,
  );

  return (
    <div className="flex min-h-screen w-full flex-col px-4">
      <TopNav
        title={survey.title}
        isPublished={survey.isPublished ?? false}
        surveyId={survey.id}
      />
      <main className="container mx-auto pb-12">
        <h1 className="mb-4 mt-8 text-2xl">
          Responses for:{" "}
          <span className="underline underline-offset-4">{survey.title}</span>
        </h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No</TableHead>
              {survey.questions?.map((question) => (
                <TableHead key={question.id}>
                  {question.properties?.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index) => (
              <TableRow key={response.id}>
                <TableCell>{skip + index + 1}</TableCell>
                {survey.questions?.map((question) => (
                  <TableCell key={question.id}>
                    {Array.isArray(response.responses?.[question.id])
                      ? (response.responses[question.id] as string[]).join(", ")
                      : response.responses?.[question.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${currentPage - 1}`}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`?page=${currentPage}`} isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`?page=${currentPage + 1}`}
                  className={
                    responses.length < ITEMS_PER_PAGE
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
};

export default SurveyResponsesPage;
