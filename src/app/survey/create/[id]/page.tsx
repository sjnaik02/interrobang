import { getSurveyFromId } from "@/server/queries";
import SurveyBuilder from "@/components/SurveyBuilder";
import TopBar from "./TopBar";

const CreateFormPage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  const currentSurvey = survey;

  return (
    <main className="container mx-auto flex flex-col gap-4 p-4">
      <TopBar name={currentSurvey?.name} />
      <SurveyBuilder />
    </main>
  );
};

export default CreateFormPage;
