import Visualizer from "@/components/Visualizer";
import { getResponsesFromSurveyId, getSurveyFromId } from "@/server/queries";
import { type Response, type Survey } from "@/server/db/schema";
import { notFound } from "next/navigation";
import { type CustomInstance as MultipleChoiceInstance } from "@/components/fields/MultipleChoice";
import TopNav from "../../responses/[id]/TopNav";

function getMultipleChoiceQuestions(survey: Survey): MultipleChoiceInstance[] {
  return (
    survey.questions?.filter(
      (q): q is MultipleChoiceInstance => q.type === "MultipleChoice",
    ) ?? []
  );
}

function processQuestionResponses(
  questionId: string,
  responses: Response[],
): {
  answers: string[];
} {
  const answers = responses
    .map((r) => r.responses?.[questionId])
    .filter(
      (answer): answer is string =>
        typeof answer === "string" && answer !== undefined,
    );

  return { answers };
}

const VisualizePage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    notFound();
  }
  const responses = await getResponsesFromSurveyId(survey.id);

  const mcQuestions = getMultipleChoiceQuestions(survey);

  if (mcQuestions.length === 0) {
    return <div>No multiple choice questions found</div>;
  }

  // No need for type assertion or additional check since
  // getMultipleChoiceQuestions already returns MultipleChoiceInstance[]
  const firstQuestion = mcQuestions[0];
  if (!firstQuestion) {
    throw new Error("No multiple choice questions found");
  }

  const processedData = processQuestionResponses(firstQuestion.id, responses);

  return (
    <div className="flex flex-col gap-4 p-4">
      <TopNav
        surveyName={survey.name}
        isPublished={survey.isPublished ?? false}
      />
      <Visualizer
        questionLabel={firstQuestion.properties.label}
        options={firstQuestion.properties.options}
        answers={processedData.answers}
      />
    </div>
  );
};

export default VisualizePage;
