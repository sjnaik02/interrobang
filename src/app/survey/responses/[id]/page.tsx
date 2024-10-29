import { getSurveyFromId, getResponsesFromSurveyId } from "@/server/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SurveyResponsesPage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    throw new Error("Survey not found");
  }
  const responses = await getResponsesFromSurveyId(params.id);

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <TopNav />
      SurveyResponsesPage: {survey.title}
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

const TopNav = () => {
  return (
    <div className="flex w-full items-center justify-between">
      This is a placeholder for the top nav
    </div>
  );
};
