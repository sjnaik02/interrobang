import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getSurveyFromId } from "@/server/queries";
import { Save, Eye, Send } from "lucide-react";

const CreateFormPage = async ({ params }: { params: { id: string } }) => {
  const survey = await getSurveyFromId(params.id);
  const currentSurvey = survey;

  return (
    <main className="container mx-auto flex flex-col gap-4 p-4">
      <TopBar name={currentSurvey?.name} />
      <h1 className="text-xl font-bold">Form Number {params.id}</h1>
    </main>
  );
};

export default CreateFormPage;

const TopBar = ({ name }: { name: string | undefined }) => {
  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 py-2 font-mono">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>{name}</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-2">
        <Button variant="outline" className="px-2 py-1 text-sm">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" className="px-2 py-1 text-sm">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button className="bg-gradient-to-r from-red-500 to-blue-500 px-2 py-1 text-sm hover:from-red-600 hover:to-blue-600">
          <Send className="mr-2 h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
};
