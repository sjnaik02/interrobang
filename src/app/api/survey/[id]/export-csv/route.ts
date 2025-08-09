import { getSurveyFromId, getAllResponsesFromSurveyId } from "@/server/queries";
import { convertSurveyResponsesToCSV } from "@/lib/csv-export";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const survey = await getSurveyFromId(id);
    if (!survey) {
      return notFound();
    }

    if (!survey.isPublished) {
      return notFound();
    }

    const responses = await getAllResponsesFromSurveyId(id);
    const csvContent = convertSurveyResponsesToCSV(survey, responses);

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${survey.title.replace(/[^a-zA-Z0-9]/g, '_')}-responses.csv"`
      }
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}