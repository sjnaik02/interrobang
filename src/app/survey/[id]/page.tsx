import { getSurveyFromId } from "@/server/queries";
import { submitSurvey } from "@/app/actions/survey";
import { notFound } from "next/navigation";
import SurveySubmitPage from "@/components/SurveySubmitPage";
import { z } from "zod";

export default async function SurveyPage({
  params,
}: {
  params: { id: string };
}) {
  const uuidSchema = z.string().uuid();
  const parsedId = uuidSchema.safeParse(params.id);
  if (!parsedId.success) {
    notFound();
  }
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    notFound();
  }
  if (survey.isArchived || !survey.isPublished) {
    notFound();
  }

  return <SurveySubmitPage survey={survey} submitSurvey={submitSurvey} />;
}
