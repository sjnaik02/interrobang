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

const SurveyBuilder: React.FC<{
  survey: Survey;
  saveChanges: SaveChangesToSurveyType;
  publishSurvey: PublishSurveyType;
}> = ({ survey, saveChanges, publishSurvey }) => {
  const [isReady, setIsReady] = useState(false);
  const [preview, setPreview] = useState(false);

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
    setName,
    setSurveyId,
    changeElementType,
  } = useSurveyBuilder();

  useEffect(() => {
    if (isReady) return;
    setTitle(survey.title);
    setName(survey.name);
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
      await saveChanges({
        id: survey.id,
        title,
        name: survey.name,
        questions: elements,
        updatedAt: new Date(),
      });

      toast.success("Saved survey");
      return true;
    } catch (err) {
      console.error("Autosave failed:", err);
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
  }, [elements, title]);

  return (
    <div
      className="flex min-h-screen flex-col gap-4"
      onClick={() => setSelectedElement(null)}
    >
      <TopBar
        preview={preview}
        setPreview={setPreview}
        saveChanges={saveChanges}
        publishSurvey={publishSurvey}
        status={status}
      />
      {/* if published, display link to access survey with a copy button */}
      {isPublished ? (
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-md border border-muted-foreground pl-2">
          <span className="flex items-center whitespace-nowrap font-mono">
            <LinkIcon className="mr-1 h-4 w-4" />
            Survey Link:{" "}
          </span>
          <Link
            href={`/survey/${survey.id}`}
            className="inline-block truncate whitespace-nowrap font-mono text-black hover:text-muted-foreground"
          >
            {`${window.location.origin}/survey/${survey.id}`}
          </Link>

          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${window.location.origin}/survey/${survey.id}`,
              );
              toast.success("Copied survey link to clipboard");
            }}
            size="sm"
            className="rounded-l-none"
          >
            <Copy className="mr-1 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      ) : null}
      {preview ? (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-12">
          <SurveyPreview />
        </div>
      ) : (
        <div className="mx-auto mb-24 flex w-full max-w-2xl flex-col gap-4">
          <ClickToEdit onSave={(value) => setTitle(value)} className="text-2xl">
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

        <p className="font-mono text-muted-foreground">{idx + 1}</p>

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
          "flex w-full cursor-pointer flex-col items-center gap-2 rounded-md p-4 transition-all duration-100 hover:border-primary",
          selectedElement?.id === element.id && "border-2 border-primary",
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
        {SurveyElements[element.type].editorComponent({
          elementInstance: element,
        })}
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

const SurveyPreview = () => {
  const { title, elements } = useSurveyBuilder();
  return (
    <>
      <h1 className="text-2xl">{title}</h1>
      {elements.map((element, idx) => (
        <div key={idx + element.type} className="flex w-full">
          <p className="mr-2 text-lg">{idx + 1}. </p>
          {SurveyElements[element.type].previewComponent({
            elementInstance: element,
          })}
        </div>
      ))}
      <Button variant="default" className="mt-4 w-fit">
        Submit
      </Button>
    </>
  );
};
