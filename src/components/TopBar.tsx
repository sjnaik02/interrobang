"use client";
import randomId from "@/lib/randomId";
import { SurveyElements } from "@/components/SurveyElement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import useSurveyBuilder from "@/components/hooks/useSurveyBuilder";
import TopNav from "@/app/survey/responses/[id]/TopNav";
import {
  Save,
  Eye,
  Send,
  Plus,
  LayoutDashboard,
  CircleAlert,
} from "lucide-react";
import ClickToEdit from "./ClickToEdit";
import {
  type PublishSurveyType,
  type SaveChangesToSurveyType,
} from "@/app/actions/survey";

const TopBar = ({
  preview,
  setPreview,
  saveChanges,
  publishSurvey,
}: {
  preview: boolean;
  setPreview: (preview: boolean) => void;
  saveChanges: SaveChangesToSurveyType;
  publishSurvey: PublishSurveyType;
}) => {
  const {
    elements,
    surveyId,
    addElement,
    title,
    name: surveyName,
    setName,
    isPublished,
  } = useSurveyBuilder();

  const handleSave = async () => {
    try {
      await saveChanges({
        updatedAt: new Date(),
        id: surveyId,
        title,
        name: surveyName,
        questions: elements,
      });
      toast.success(`Saved "${title}" as "${surveyName}"`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  return isPublished ? (
    <TopNav
      surveyName={surveyName}
      isPublished={isPublished}
      surveyId={surveyId}
    />
  ) : (
    <div className="flex w-full items-center justify-between border-b border-gray-200 py-2 font-mono">
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/dashboard" className="flex items-center">
              <LayoutDashboard className="mr-1 h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <ClickToEdit onSave={(value) => setName(value)}>
                <p>{surveyName}</p>
              </ClickToEdit>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Badge
          className={`ml-2 ${isPublished ? "bg-green-400 hover:bg-green-400" : "bg-yellow-400 hover:bg-yellow-400"} text-black`}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
        <Separator orientation="vertical" className="my-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="px-2 py-1 text-sm"
              size="sm"
              disabled={isPublished}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Element
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.values(SurveyElements).map((element) => (
              <DropdownMenuItem
                key={element.type}
                onClick={() =>
                  addElement(elements.length, element.construct(randomId()))
                }
                className="cursor-pointer font-mono"
              >
                <element.icon className="mr-1 h-4 w-4" />
                {element.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="px-2 py-1 text-sm"
          size="sm"
          disabled={isPublished}
          onClick={async () => {
            await handleSave();
            toast.success(`Saved "${title}" as "${surveyName}"`);
          }}
        >
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>
        <Button
          variant="outline"
          className="px-2 py-1 text-sm"
          size="sm"
          onClick={() => setPreview(!preview)}
          disabled={isPublished}
        >
          <Eye className="mr-1 h-4 w-4" />
          Preview
        </Button>
        <PublishSurveyButton
          surveyId={surveyId}
          publishSurvey={publishSurvey}
          saveChanges={saveChanges}
        />
      </div>
    </div>
  );
};

export default TopBar;

const PublishSurveyButton = ({
  surveyId,
  publishSurvey,
  saveChanges,
}: {
  surveyId: string;
  publishSurvey: PublishSurveyType;
  saveChanges: SaveChangesToSurveyType;
}) => {
  const {
    setIsPublished,
    isPublished,
    title,
    name: surveyName,
    elements,
  } = useSurveyBuilder();
  const handlePublish = async () => {
    await saveChanges({
      updatedAt: new Date(),
      id: surveyId,
      title,
      name: surveyName,
      questions: elements,
    });
    const publishedSurvey = await publishSurvey(surveyId);
    if (!publishedSurvey) {
      toast.error("Failed to publish survey");
    } else {
      setIsPublished(publishedSurvey.isPublished ?? false);
      toast.success(`Published "${publishedSurvey.title}"`);
    }
  };

  const elementsContainsRequired = elements.some(
    (element) => element.properties?.required,
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-red-500 to-blue-500 px-2 py-1 text-sm hover:from-red-600 hover:to-blue-600"
          size="sm"
          disabled={isPublished || elements.length === 0}
        >
          <Send className="mr-1 h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to publish?</AlertDialogTitle>
          <AlertDialogDescription>
            {!elementsContainsRequired && (
              <Alert className="border-yellow-300 bg-yellow-100 text-black">
                <CircleAlert className="mr-1 h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  This survey has no required questions. This will allow
                  respondents to submit empty responses. Are you sure you want
                  to publish?
                </AlertDescription>
              </Alert>
            )}
            Publishing this survey will make it available to respondents. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-gradient-to-r from-red-500 to-blue-500 px-2 py-1 text-sm hover:from-red-600 hover:to-blue-600"
              size="sm"
              onClick={handlePublish}
            >
              <Send className="mr-1 h-4 w-4" />
              Publish
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
