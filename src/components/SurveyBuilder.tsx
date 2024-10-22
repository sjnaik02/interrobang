"use client";

import useSurveyBuilder from "./hooks/useSurveyBuilder";
import { Button } from "./ui/button";
import { TextArea } from "./fields/TextArea";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { MultipleChoice } from "./fields/MultipleChoice";
import { SurveyElements, SurveyElementInstance } from "./SurveyElement";
import { Trash, CirclePlus, ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "./ui/switch";
import { escape } from "querystring";

const SurveyBuilder: React.FC = () => {
  const {
    elements,
    addElement,
    removeElement,
    updateElement,
    moveElement,
    selectedElement,
    setSelectedElement,
  } = useSurveyBuilder();

  return (
    <div
      className="flex min-h-screen flex-col gap-4"
      onClick={() => setSelectedElement(null)}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h1 className="text-2xl">Survey Builder</h1>
        {elements.map((element, idx) => (
          <BuilderElementWrapper
            element={element}
            removeElement={removeElement}
            updateElement={updateElement}
            moveElement={moveElement}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            idx={idx}
            length={elements.length}
          />
        ))}
        <Button
          onClick={() =>
            addElement(elements.length, TextArea.construct(randomId()))
          }
          variant="secondary"
          className="flex w-fit items-center border-2 border-dashed text-lg"
        >
          <CirclePlus className="mr-1 h-8 w-8" />
          Add Text Field
        </Button>
        <Button
          onClick={() =>
            addElement(elements.length, MultipleChoice.construct(randomId()))
          }
          variant="secondary"
          className="flex w-fit items-center border-2 border-dashed text-lg"
        >
          <CirclePlus className="mr-1 h-8 w-8" />
          Add Multiple Choice
        </Button>
      </div>
    </div>
  );
};

export default SurveyBuilder;

const randomId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 15);
};

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
}> = ({
  element,
  removeElement,
  updateElement,
  moveElement,
  idx,
  length,
  selectedElement,
  setSelectedElement,
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
          "flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-muted p-4 transition-all duration-100 hover:border-primary",
          selectedElement?.id === element.id && "border-primary",
        )}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
        }}
      >
        {SurveyElements[element.type].editorComponent({
          elementInstance: element,
        })}
        {selectedElement?.id === element.id && (
          <div className="mt-4 flex w-full items-center justify-between gap-2">
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
              <Switch
                id="required"
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
              <Label htmlFor="required" className="font-mono">
                Required
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
