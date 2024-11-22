/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Visualizer from "@/components/Visualizer";
import { getAllResponsesFromSurveyId, getSurveyFromId } from "@/server/queries";
import { type Response, type Survey } from "@/server/db/schema";
import { notFound } from "next/navigation";
import { type CustomInstance as MultipleChoiceInstance } from "@/components/fields/MultipleChoice";
import { type CustomInstance as TextAreaInstance } from "@/components/fields/TextArea";
import { type CustomInstance as CheckboxInstance } from "@/components/fields/CheckBox";
import TopNav from "../../responses/[id]/TopNav";
import TextResponseTable from "@/components/TextResponseTable";

function getQuestions(
  survey: Survey,
): (MultipleChoiceInstance | TextAreaInstance | CheckboxInstance)[] {
  return (
    survey.questions?.filter(
      (q): q is MultipleChoiceInstance | TextAreaInstance | CheckboxInstance =>
        q.type === "MultipleChoice" ||
        q.type === "TextArea" ||
        q.type === "CheckBox",
    ) ?? []
  );
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
interface ProcessedQuestionData {
  options: string[];
  optionCounts: {
    option: string;
    count: number;
    percentage: number;
  }[];
}

function processQuestionData(
  questionId: string,
  responses: Response[],
  options: string[],
): ProcessedQuestionData {
  const totalResponses = responses.length;
  const optionCounts = options.map((option) => {
    const count = responses.filter((response) => {
      const answer = response.responses?.[questionId];
      if (Array.isArray(answer)) {
        return answer.includes(option);
      }
      return answer === option;
    }).length;

    return {
      option,
      count,
      percentage: (count / totalResponses) * 100,
    };
  });

  return {
    options,
    optionCounts,
  };
}

const VisualizePage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    notFound();
  }
  if (!survey.isPublished) {
    notFound();
  }
  const responses = await getAllResponsesFromSurveyId(survey.id);
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
          if (question.type === "TextArea") {
            const processedData = processTextAreaResponses(
              question.id,
              responses,
            );
            return (
              <div key={question.id} className="mb-8">
                <TextResponseTable
                  questionLabel={`${index + 1}. ${question.properties.label}`}
                  responses={processedData.answers}
                />
              </div>
            );
          }

          const processedData = processQuestionData(
            question.id,
            responses,
            question.properties.options,
          );

          return (
            <div key={question.id} className="mb-8">
              <Visualizer
                questionLabel={`${index + 1}. ${question.properties.label}`}
                options={processedData.options}
                data={processedData.optionCounts}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default VisualizePage;
