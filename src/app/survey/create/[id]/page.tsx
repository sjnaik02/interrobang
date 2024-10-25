import { getSurveyFromId } from "@/server/queries";
import SurveyBuilder from "@/components/SurveyBuilder";

const CreateFormPage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  if (!survey) {
    throw Error("No survey of this id exists");
  }

  return (
    <main className="container mx-auto flex flex-col gap-4 p-4">
      <SurveyBuilder survey={survey} />
    </main>
  );
};

export default CreateFormPage;
