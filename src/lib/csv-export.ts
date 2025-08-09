import type { Survey, Response } from "@/server/db/schema";

export function convertSurveyResponsesToCSV(
  survey: Survey,
  responses: Response[],
): string {
  if (!survey.questions || survey.questions.length === 0) {
    return "No questions found in survey";
  }

  const headers = [
    "Sr. No",
    ...survey.questions.map(
      (q) => (q.properties?.label as string) ?? "Untitled Question",
    ),
  ];

  const rows = responses.map((response, index) => {
    const row = [
      (index + 1).toString(),
      ...survey.questions!.map((question) => {
        const answer = response.responses?.[question.id];
        if (Array.isArray(answer)) {
          return answer.join(", ");
        }
        return answer?.toString() ?? "";
      }),
    ];
    return row;
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell);
          return cellStr.includes(",") ||
            cellStr.includes('"') ||
            cellStr.includes("\n")
            ? `"${cellStr.replace(/"/g, '""')}"` // Escape quotes and wrap in quotes
            : cellStr;
        })
        .join(","),
    )
    .join("\n");

  return csvContent;
}
