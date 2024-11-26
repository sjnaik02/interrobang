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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

type ProcessedQuestionData = {
  options: string[];
  optionCounts: {
    option: string;
    count: number;
    percentage: number;
    score?: number;
  }[];
};

function processQuestionData(
  questionId: string,
  responses: Response[],
  options: string[],
  type: string,
  allowNone?: boolean, // New parameter
): ProcessedQuestionData {
  const totalResponses = responses.length;

  if (type === "Ranking") {
    // Ranking logic stays the same...
    const scores = options.map((option) => {
      let totalScore = 0;
      let firstPlaceCount = 0;

      responses.forEach((response) => {
        const rankings = response.responses?.[questionId];
        if (Array.isArray(rankings)) {
          const position = rankings.indexOf(option);
          if (position !== -1) {
            const score = options.length - position;
            totalScore += score;
            if (position === 0) firstPlaceCount++;
          }
        }
      });

      const averageScore = totalScore / totalResponses;

      return {
        option,
        count: firstPlaceCount,
        score: averageScore,
        percentage: 0,
      };
    });

    scores.sort((a, b) => b.score - a.score);

    return {
      options,
      optionCounts: scores,
    };
  }

  // Handle "None of the Above" responses for CheckBox type
  if (type === "CheckBox" && allowNone) {
    const allOptions = [...options, "None of the Above"];

    const optionCounts = allOptions.map((option) => {
      let count;

      if (option === "None of the Above") {
        // Count responses where "None of the Above" is the only selected option
        count = responses.filter((response) => {
          const answer = response.responses?.[questionId];
          return (
            Array.isArray(answer) &&
            answer.length === 1 &&
            answer[0] === "None of the Above"
          );
        }).length;
      } else {
        // For regular options, only count if "None of the Above" wasn't selected
        count = responses.filter((response) => {
          const answer = response.responses?.[questionId];
          return (
            Array.isArray(answer) &&
            answer.includes(option) &&
            !answer.includes("None of the Above")
          );
        }).length;
      }

      return {
        option,
        count,
        percentage: (count / totalResponses) * 100,
      };
    });

    return {
      options: allOptions,
      optionCounts,
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
    return (
      <div className="flex min-h-screen flex-col px-4">
        <TopNav
          surveyName={survey.name}
          isPublished={survey.isPublished ?? false}
          surveyId={survey.id}
        />
        <main className="container mx-auto">
          <h1 className="mb-4 mt-8 text-2xl">
            No questions found for{" "}
            <span className="underline underline-offset-4">{survey.title}</span>
          </h1>
          <Alert variant="destructive" className="max-w-2xl">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              Please contact Shourya (shourya@readtangle.com). Include the
              following id in your message: {survey.id}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
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
            question.properties.allowNone,
          );

          return (
            <div key={question.id} className="mb-8">
              <Visualizer
                questionLabel={question.properties.label}
                options={processedData.options}
                data={processedData.optionCounts}
                type={question.type}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default VisualizePage;
