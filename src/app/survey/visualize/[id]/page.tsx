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
  otherResponses?: { text: string; count: number }[];
};
function processQuestionData(
  questionId: string,
  responses: Response[],
  options: string[],
  type: string,
  allowNone?: boolean,
  allowOther?: boolean,
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

    scores.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    return {
      options,
      optionCounts: scores,
    };
  }

  // Initialize array to store all options including "None of the Above" and "Other"
  const allOptions = [...options];
  if (allowNone) allOptions.push("None of the Above");
  if (allowOther) allOptions.push("Other");

  // Initialize map to collect unique "Other" responses
  const otherResponsesMap = new Map<string, number>();

  const optionCounts = allOptions.map((option) => {
    let count = 0;

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
    } else if (option === "Other") {
      // Count and collect "Other" responses
      responses.forEach((response) => {
        const answer = response.responses?.[questionId];
        if (type === "MultipleChoice") {
          if (typeof answer === "string" && answer.startsWith("Other:")) {
            count++;
            const otherText = answer.replace("Other:", "").trim() || "Empty";
            otherResponsesMap.set(
              otherText,
              (otherResponsesMap.get(otherText) ?? 0) + 1,
            );
          }
        } else if (type === "CheckBox") {
          if (Array.isArray(answer)) {
            const otherAnswers = answer.filter((val) =>
              val.startsWith("Other:"),
            );
            if (otherAnswers.length > 0) {
              count++;
              otherAnswers.forEach((otherAnswer) => {
                const otherText =
                  otherAnswer.replace("Other:", "").trim() || "Empty";
                otherResponsesMap.set(
                  otherText,
                  (otherResponsesMap.get(otherText) ?? 0) + 1,
                );
              });
            }
          }
        }
      });
    } else {
      // For regular options
      count = responses.filter((response) => {
        const answer = response.responses?.[questionId];
        // Handle "None of the Above" exclusion
        if (Array.isArray(answer) && answer.includes("None of the Above")) {
          return false;
        }

        if (type === "MultipleChoice") {
          return answer === option;
        } else if (type === "CheckBox") {
          return Array.isArray(answer) && answer.includes(option);
        }
        return false;
      }).length;
    }

    return {
      option,
      count,
      percentage: (count / totalResponses) * 100,
    };
  });

  // Convert the otherResponses map to an array and sort by count
  const otherResponses = Array.from(otherResponsesMap.entries())
    .map(([text, count]) => ({
      text,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    options: allOptions,
    optionCounts,
    otherResponses: otherResponses.length > 0 ? otherResponses : undefined,
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
          title={survey.title}
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
        title={survey.title}
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
            question.properties.allowOther,
          );

          return (
            <div key={question.id} className="mb-8">
              <Visualizer
                questionLabel={question.properties.label}
                options={processedData.options}
                data={processedData.optionCounts}
                type={question.type}
                otherResponses={processedData.otherResponses}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default VisualizePage;
