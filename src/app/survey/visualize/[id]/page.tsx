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

  const firstQuestion = mcQuestions[0];
  if (!firstQuestion) {
    throw new Error("No multiple choice questions found");
  }

  const processedData = processQuestionResponses(firstQuestion.id, responses);

  return (
    <div className="flex min-h-screen flex-col px-4">
      <TopNav
        surveyName={survey.name}
        isPublished={survey.isPublished ?? false}
        surveyId={survey.id}
      />
      <main className="container mx-auto">
        <h1 className="mb-4 mt-8 text-2xl">
          Visualize Responses for{" "}
          <span className="underline underline-offset-4">{survey.title}</span>
        </h1>
        <Visualizer
          questionLabel={firstQuestion.properties.label}
          options={firstQuestion.properties.options}
          answers={processedData.answers}
        />
      </main>
    </div>
  );
};

export default VisualizePage;
