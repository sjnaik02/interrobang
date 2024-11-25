/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Visualizer from "@/components/Visualizer";
import { getAllResponsesFromSurveyId, getSurveyFromId } from "@/server/queries";
import { type Response, type Survey } from "@/server/db/schema";
import { notFound } from "next/navigation";
import { type CustomInstance as MultipleChoiceInstance } from "@/components/fields/MultipleChoice";
import { type CustomInstance as TextAreaInstance } from "@/components/fields/TextArea";
import { type CustomInstance as CheckboxInstance } from "@/components/fields/CheckBox";
import { type CustomInstance as RankingInstance } from "@/components/fields/Ranking";
import TopNav from "@/components/TopNav";
import TextResponseTable from "@/components/TextResponseTable";

type getQuestionProps =
  | MultipleChoiceInstance
  | TextAreaInstance
  | CheckboxInstance
  | RankingInstance;

function getQuestions(survey: Survey): getQuestionProps[] {
  return (
    survey.questions?.filter(
      (q): q is getQuestionProps =>
        q.type === "MultipleChoice" ||
        q.type === "TextArea" ||
        q.type === "CheckBox" ||
        q.type === "Ranking",
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
  type: string,
): ProcessedQuestionData {
  const totalResponses = responses.length;

  if (type === "Ranking") {
    // Count how many times each option got first place
    const firstPlaceCounts = options.map((option) => {
      const count = responses.filter((response) => {
        const answer = response.responses?.[questionId];
        if (Array.isArray(answer)) {
          return answer[0] === option; // Check if option is in first position
        }
        return false;
      }).length;

      return {
        option,
        count,
        percentage: (count / totalResponses) * 100,
      };
    });

    // Sort by count in descending order
    firstPlaceCounts.sort((a, b) => b.count - a.count);

    return {
      options,
      optionCounts: firstPlaceCounts,
    };
  }

  // Original processing for other question types
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
          Visualize <span className="font-mono">{responses.length}</span>{" "}
          Responses for{" "}
          <span className="underline underline-offset-4">{survey.title}</span>
        </h1>
        {questions.map((question) => {
          if (question.type === "TextArea") {
            const processedData = processTextAreaResponses(
              question.id,
              responses,
            );
            return (
              <div key={question.id} className="mb-8">
                <TextResponseTable
                  questionLabel={question.properties.label}
                  responses={processedData.answers}
                />
              </div>
            );
          }

          const processedData = processQuestionData(
            question.id,
            responses,
            question.properties.options,
            question.type,
          );

          return (
            <div key={question.id} className="mb-8">
              <Visualizer
                questionLabel={question.properties.label}
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
