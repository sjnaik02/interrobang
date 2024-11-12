import Visualizer from "@/components/Visualizer";
import { getResponsesFromSurveyId, getSurveyFromId } from "@/server/queries";
import { type Response, type Survey } from "@/server/db/schema";
import { notFound } from "next/navigation";
import { type CustomInstance as MultipleChoiceInstance } from "@/components/fields/MultipleChoice";
import { type CustomInstance as TextAreaInstance } from "@/components/fields/TextArea";
import TopNav from "../../responses/[id]/TopNav";
import TextResponseTable from "@/components/TextResponseTable";

function getQuestions(
  survey: Survey,
): (MultipleChoiceInstance | TextAreaInstance)[] {
  return (
    survey.questions?.filter(
      (q): q is MultipleChoiceInstance | TextAreaInstance =>
        q.type === "MultipleChoice" || q.type === "TextArea",
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

type RenderTextAreaResponse = {
  createdAt: Date;
  text: string;
};

function processTextAreaResponses(
  questionId: string,
  responses: Response[],
): { answers: RenderTextAreaResponse[] } {
  return {
    answers: responses
      .map((r) => ({
        createdAt: r.createdAt,
        text: r.responses?.[questionId],
      }))
      .filter(
        (response): response is RenderTextAreaResponse =>
          typeof response.text === "string" && response.text !== undefined,
      ),
  };
}

const VisualizePage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    notFound();
  }
  const responses = await getResponsesFromSurveyId(survey.id);

  const questions = getQuestions(survey);

  if (questions.length === 0) {
    return <div>No questions found</div>;
  }

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
        {questions.map((question, index) => {
          const processedData =
            question.type === "MultipleChoice"
              ? processQuestionResponses(question.id, responses)
              : processTextAreaResponses(question.id, responses);
          return (
            <div key={question.id} className="mb-8">
              {question.type === "MultipleChoice" && (
                <Visualizer
                  questionLabel={`${index + 1}. ${(question as MultipleChoiceInstance).properties.label}`}
                  options={
                    (question as MultipleChoiceInstance).properties.options
                  }
                  answers={processedData.answers as string[]}
                />
              )}
              {question.type === "TextArea" && (
                <TextResponseTable
                  questionLabel={`${index + 1}. ${(question as TextAreaInstance).properties.label}`}
                  responses={processedData.answers as RenderTextAreaResponse[]}
                />
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default VisualizePage;
