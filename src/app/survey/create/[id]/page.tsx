import { saveChangesToSurvey, publishSurvey } from "@/app/actions/survey";
import { createSponsorAdForSurvey, createOrUpdateSponsorAdForSurvey } from "@/app/actions/sponsorAd";
import SurveyBuilder from "@/components/SurveyBuilder";
import { getSurveyFromId, getSponsorAdBySurveyId } from "@/server/queries";

const CreateFormPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    throw Error("No survey of this id exists");
  }

  // Load sponsor ad if it exists
  const sponsorAd = survey.sponsorAdId
    ? await getSponsorAdBySurveyId(survey.id)
    : null;

  return (
    <main className="mx-auto flex flex-col gap-4 px-4">
      <SurveyBuilder
        survey={survey}
        saveChanges={saveChangesToSurvey}
        publishSurvey={publishSurvey}
        createSponsorAdForSurvey={createSponsorAdForSurvey}
        createOrUpdateSponsorAdForSurvey={createOrUpdateSponsorAdForSurvey}
        existingSponsorAd={sponsorAd}
      />
    </main>
  );
};

export default CreateFormPage;
