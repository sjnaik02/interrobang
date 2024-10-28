import { saveChangesToSurvey, publishSurvey } from "@/app/actions/survey";
import SurveyBuilder from "@/components/SurveyBuilder";
import { getSurveyFromId } from "@/server/queries";

const CreateFormPage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    throw Error("No survey of this id exists");
  }

  return (
    <main className="container mx-auto flex flex-col gap-4 p-4">
      <SurveyBuilder
        survey={survey}
        saveChanges={saveChangesToSurvey}
        publishSurvey={publishSurvey}
      />
    </main>
  );
};

export default CreateFormPage;
