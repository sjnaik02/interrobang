"use client";

import { useState, useEffect } from "react";
import useSurveyBuilder from "./hooks/useSurveyBuilder";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { SurveyElements, type SurveyElementInstance } from "./SurveyElement";
import {
  Trash,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Switch } from "./ui/switch";
import ClickToEdit from "./ClickToEdit";
import TopBar from "./TopBar";
import { type Survey } from "@/server/db/schema";
import { toast } from "sonner";
import {
  type PublishSurveyType,
  type SaveChangesToSurveyType,
} from "@/app/actions/survey";
import { type CreateSponsorAdForSurveyType } from "@/app/actions/sponsorAd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import randomId from "@/lib/randomId";
import React from "react";
import useAutosave from "./hooks/useAutosave";
import { AnimatePresence, motion } from "framer-motion";
import SurveyPreview from "./SurveyPreview";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const SurveyBuilder: React.FC<{
  survey: Survey;
  saveChanges: SaveChangesToSurveyType;
  publishSurvey: PublishSurveyType;
  createSponsorAdForSurvey: CreateSponsorAdForSurveyType;
}> = ({ survey, saveChanges, publishSurvey, createSponsorAdForSurvey }) => {
  const [isReady, setIsReady] = useState(false);
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewLinkCopied, setPreviewLinkCopied] = useState(false);
  const [enableSponsorship, setEnableSponsorship] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorCopy, setSponsorCopy] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");

  const {
    elements,
    removeElement,
    setElements,
    updateElement,
    moveElement,
    selectedElement,
    setSelectedElement,
    title,
    setTitle,
    isPublished,
    setIsPublished,
    setSurveyId,
    changeElementType,
  } = useSurveyBuilder();

  useEffect(() => {
    if (isReady) return;
    setTitle(survey.title);
    setIsPublished(survey.isPublished ?? false);
    setSurveyId(survey.id);
    if (survey.questions && survey.questions.length > 0) {
      setElements(survey.questions);
    }
    if (survey.isPublished) {
      setPreview(true);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      const surveyDataToSave = {
        id: survey.id,
        title,
        questions: elements,
        updatedAt: new Date(),
        enableSponsorship,
        sponsorName: enableSponsorship ? sponsorName : undefined,
        sponsorCopy: enableSponsorship ? sponsorCopy : undefined,
        ctaText: enableSponsorship ? ctaText : undefined,
        ctaUrl: enableSponsorship ? ctaUrl : undefined,
      };

      const dataForSaveChanges: {
        id: string;
        title: string;
        questions: SurveyElementInstance[];
        updatedAt: Date;
      } = {
        id: surveyDataToSave.id,
        title: surveyDataToSave.title,
        questions: surveyDataToSave.questions,
        updatedAt: surveyDataToSave.updatedAt,
      };

      await saveChanges(dataForSaveChanges);

      toast.success("Saved survey");
      return true;
    } catch (err) {
      console.error("Autosave failed:", err);
      toast.error("Failed to save survey. Some details may not be persisted.");
      return false;
    }
  };

  const { status, triggerSave } = useAutosave(handleSave);

  useEffect(() => {
    if (!isReady) return;
    if (isPublished) return;
    if (status === "saving") return;
    triggerSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elements,
    title,
    enableSponsorship,
    sponsorName,
    sponsorCopy,
    ctaText,
    ctaUrl,
  ]);

  const handlePublishWithSponsor: PublishSurveyType = async (id) => {
    if (enableSponsorship) {
      await createSponsorAdForSurvey(
        id,
        sponsorName,
        sponsorCopy,
        ctaText,
        ctaUrl,
      );
    }
    return publishSurvey(id);
  };

  return (
    <div
      className="flex min-h-screen flex-col gap-4"
      onClick={() => setSelectedElement(null)}
    >
      <TopBar
        preview={preview}
        setPreview={setPreview}
        saveChanges={saveChanges}
        publishSurvey={handlePublishWithSponsor}
        status={status}
      />
      {/* Preview link section - only show when not published */}
      {!isPublished && (
        <div className="border-muted/40 bg-muted/5 mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-md border pl-2">
          <span className="text-muted-foreground flex items-center text-sm whitespace-nowrap">
            <LinkIcon className="mr-1 h-4 w-4" />
            Preview Link
          </span>
          <Link
            href={`/survey/preview/${survey.id}`}
            className="text-muted-foreground hover:text-foreground inline-block truncate text-sm whitespace-nowrap"
          >
            {`${window.location.origin}/survey/preview/${survey.id}`}
          </Link>

          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${window.location.origin}/survey/preview/${survey.id}`,
              );
              toast.success("Copied preview link to clipboard");
              setPreviewLinkCopied(true);
              setTimeout(() => setPreviewLinkCopied(false), 2000);
            }}
            size="sm"
            variant="default"
            className="hover:bg-muted hover:text-foreground rounded-l-none border-l px-2"
          >
            {previewLinkCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      {/* Published link section */}
      {isPublished ? (
        <div className="border-muted-foreground mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-md border pl-2">
          <span className="flex items-center font-mono whitespace-nowrap">
            <LinkIcon className="mr-1 h-4 w-4" />
            Survey Link:{" "}
          </span>
          <Link
            href={`/survey/${survey.id}`}
            className="hover:text-muted-foreground inline-block truncate font-mono whitespace-nowrap text-black"
          >
            {`${window.location.origin}/survey/${survey.id}`}
          </Link>

          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${window.location.origin}/survey/${survey.id}`,
              );
              toast.success("Copied survey link to clipboard");
              setCopied(true);
            }}
            size="sm"
            className="rounded-l-none"
          >
            {copied ? (
              <Check className="mr-1 h-4 w-4" />
            ) : (
              <Copy className="mr-1 h-4 w-4" />
            )}
            Copy Link
          </Button>
        </div>
      ) : null}
      {preview ? (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-12">
          <SurveyPreview
            survey={{
              id: survey.id,
              title,
              questions: elements,
              isPublished,
              isArchived: survey.isArchived,
              createdBy: survey.createdBy,
              responseCount: survey.responseCount,
              createdAt: survey.createdAt,
              updatedAt: survey.updatedAt,
              sponsorAdId: survey.sponsorAdId,
            }}
          />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-0.5">
          <ClickToEdit
            onSave={(value) => setTitle(value)}
            className="text-3xl font-medium"
          >
            <h1>{title}</h1>
          </ClickToEdit>
          {elements.map((element, idx) => (
            <BuilderElementWrapper
              key={element.id}
              element={element}
              removeElement={removeElement}
              updateElement={updateElement}
              moveElement={moveElement}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              idx={idx}
              length={elements.length}
              changeElementType={changeElementType}
            />
          ))}
        </div>
      )}
      {!preview && (
        <div className="mx-auto mt-8 w-full max-w-2xl space-y-6 border-t border-gray-200 py-6">
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Sponsorship Ad (Optional)
              </h3>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="enable-sponsorship"
                  className="text-sm text-gray-600"
                >
                  Enable
                </Label>
                <Switch
                  id="enable-sponsorship"
                  checked={enableSponsorship}
                  onCheckedChange={setEnableSponsorship}
                />
              </div>
            </div>

            {enableSponsorship && (
              <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
                <div>
                  <Label
                    htmlFor="sponsor-name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Sponsor Name
                  </Label>
                  <Input
                    id="sponsor-name"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    className="mt-1 w-full"
                    placeholder="e.g., Acme Corp"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="sponsor-copy"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Promotional Copy
                  </Label>
                  <Textarea
                    id="sponsor-copy"
                    value={sponsorCopy}
                    onChange={(e) => setSponsorCopy(e.target.value)}
                    maxLength={256}
                    className="mt-1 w-full"
                    placeholder="Briefly describe the sponsor or their offer."
                    rows={3}
                  />
                  <p className="mt-1 text-right text-xs text-gray-500">
                    {sponsorCopy.length} / 256 characters
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="cta-text"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Call to Action Text
                  </Label>
                  <Input
                    id="cta-text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="mt-1 w-full"
                    placeholder="e.g., Learn More, Visit Website"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="cta-url"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Call to Action URL
                  </Label>
                  <Input
                    id="cta-url"
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="mt-1 w-full"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}
            {!enableSponsorship && (
              <p className="mt-4 text-sm text-gray-500">
                Enable this to configure and attach a sponsor advertisement to
                your survey when it&apos;s published.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;

const BuilderElementWrapper: React.FC<{
  element: SurveyElementInstance;
  removeElement: (id: string) => void;
  updateElement: (id: string, element: SurveyElementInstance) => void;
  moveElement: (
    idx: string,
    direction: "up" | "down",
    element: SurveyElementInstance,
  ) => void;
  idx: number;
  length: number;
  selectedElement: SurveyElementInstance | null;
  setSelectedElement: (element: SurveyElementInstance | null) => void;
  changeElementType: (
    idx: string,
    element: SurveyElementInstance,
  ) => SurveyElementInstance;
}> = ({
  element,
  removeElement,
  updateElement,
  moveElement,
  idx,
  length,
  selectedElement,
  setSelectedElement,
  changeElementType,
}) => {
  const EditorComponent = SurveyElements[element.type].editorComponent;
  return (
    <div className="relative flex w-full gap-2" key={element.id}>
      <div className="flex flex-col items-center gap-2 p-2">
        <Button
          variant="ghost"
          onClick={() => moveElement(element.id, "up", element)}
          size="icon"
          disabled={idx === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        <p className="text-muted-foreground font-mono">{idx + 1}</p>

        <Button
          variant="ghost"
          onClick={() => moveElement(element.id, "down", element)}
          size="icon"
          disabled={idx === length - 1}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div
        className={cn(
          "hover:border-primary flex w-full cursor-pointer flex-col items-center gap-2 rounded-md p-4 transition-all duration-100",
          selectedElement?.id === element.id && "border-primary border-2",
        )}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
        }}
        tabIndex={0}
        onFocus={() => setSelectedElement(element)}
        onBlur={() => setSelectedElement(null)}
        role="button"
        aria-pressed={selectedElement?.id === element.id}
      >
        <EditorComponent elementInstance={element} />
        <AnimatePresence>
          {selectedElement?.id === element.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 flex w-full items-center justify-between gap-2"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-mono">
                    {/* render the correct icon */}
                    {React.createElement(SurveyElements[element.type].icon)}
                    {element.type}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-mono">
                  {Object.entries(SurveyElements)
                    .filter(([key]) => key !== element.type)
                    .map(([key, value]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => {
                          const updatedElement = changeElementType(
                            element.id,
                            value.construct(randomId()),
                          );
                          //this makes the new element selected, doesn't work without the setTimeout
                          setTimeout(() => {
                            setSelectedElement(updatedElement);
                          }, 0);
                        }}
                      >
                        <value.icon className="mr-1 h-4 w-4" />
                        {value.name}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() => removeElement(element.id)}
                className="border-destructive text-destructive"
                size="sm"
              >
                <Trash className="mr-1 h-4 w-4" color="red" />
                Remove
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="required" className="font-mono">
                  Required
                </Label>
                <Switch
                  id="required"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  checked={element.properties?.required}
                  onCheckedChange={(checked) => {
                    updateElement(element.id, {
                      id: element.id,
                      type: element.type,
                      properties: {
                        ...element.properties,
                        required: checked,
                      },
                    });
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
