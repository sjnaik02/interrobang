import { getSurveyFromId, getResponsesFromSurveyId } from "@/server/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TopNav from "./TopNav";

const SurveyResponsesPage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    throw new Error("Survey not found");
  }
  const responses = await getResponsesFromSurveyId(params.id);

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <TopNav
        surveyName={survey.name}
        isPublished={survey.isPublished ?? false}
      />
      <h1 className="mt-8 text-2xl">
        Responses for:{" "}
        <span className="underline underline-offset-4">{survey.title}</span>
      </h1>
      <Table className="mt-4">
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
              <TableCell>{index + 1}</TableCell>
              {survey.questions?.map((question) => (
                <TableCell key={question.id}>
                  {response.responses?.[question.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SurveyResponsesPage;
