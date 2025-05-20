import { getSurveyFromId, getSponsorAdBySurveyId } from "@/server/queries";
import { submitSurvey } from "@/app/actions/survey";
import { notFound } from "next/navigation";
import SurveySubmitPage from "@/components/SurveySubmitPage";
import { z } from "zod";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function SurveyPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
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

  // Preload sponsor ad if exists
  const sponsorAd = survey.sponsorAdId
    ? await getSponsorAdBySurveyId(survey.id)
    : null;

  return (
    <SurveySubmitPage
      survey={survey}
      submitSurvey={submitSurvey}
      sponsorAd={sponsorAd ? { ...sponsorAd, updatedAt: null } : null}
    />
  );
}
