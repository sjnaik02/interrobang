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
import { toast } from "sonner";
import useSurveyBuilder from "@/components/hooks/useSurveyBuilder";
import { Save, Eye, Send, Plus, LayoutDashboard } from "lucide-react";
import ClickToEdit from "./ClickToEdit";
import { saveChangesToSurvey, publishSurvey } from "@/server/queries";

const TopBar = ({
  preview,
  setPreview,
}: {
  preview: boolean;
  setPreview: (preview: boolean) => void;
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
      await saveChangesToSurvey({
        updatedAt: new Date(),
        id: surveyId,
        title,
        name: surveyName,
        questions: elements,
      });
      toast.success(`Saved "${title}" as "${surveyName}"`);
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };
  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 py-2 font-mono">
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center">
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
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
        <PublishSurveyButton surveyId={surveyId} />
      </div>
    </div>
  );
};

export default TopBar;

const PublishSurveyButton = ({ surveyId }: { surveyId: string }) => {
  const { setIsPublished, isPublished } = useSurveyBuilder();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-red-500 to-blue-500 px-2 py-1 text-sm hover:from-red-600 hover:to-blue-600"
          size="sm"
          disabled={isPublished}
        >
          <Send className="mr-1 h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to publish?</AlertDialogTitle>
          <AlertDialogDescription>
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
              onClick={async () => {
                const publishedSurvey = await publishSurvey(surveyId);
                if (!publishedSurvey) {
                  toast.error("Failed to publish survey");
                  return;
                }
                setIsPublished(publishedSurvey.isPublished ?? false);
                toast.success(`Published "${publishedSurvey.title}"`);
              }}
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
