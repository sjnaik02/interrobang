"use client";

import useSurveyBuilder from "./hooks/useSurveyBuilder";
import { Button } from "./ui/button";
import { TextArea } from "./fields/TextArea";
import { MultipleChoice } from "./fields/MultipleChoice";
import { SurveyElements, SurveyElementInstance } from "./SurveyElement";
import { Trash, CirclePlus, ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "./ui/switch";

const SurveyBuilder: React.FC = () => {
  const { elements, addElement, removeElement, updateElement, moveElement } =
    useSurveyBuilder();

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h1 className="text-2xl">Survey Builder</h1>
        {elements.map((element, idx) => (
          <BuilderElementWrapper
            element={element}
            removeElement={removeElement}
            updateElement={updateElement}
            moveElement={moveElement}
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
}> = ({ element, removeElement, updateElement, moveElement, idx, length }) => {
  return (
    <div className="flex w-full gap-2" key={element.id}>
      <div className="flex flex-col items-center gap-2 p-2">
        <Button
          variant="outline"
          onClick={() => moveElement(element.id, "up", element)}
          size="icon"
          disabled={idx === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        <p className="font-mono text-muted-foreground">{idx + 1}</p>

        <Button
          variant="outline"
          onClick={() => moveElement(element.id, "down", element)}
          size="icon"
          disabled={idx === length - 1}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex w-full flex-col items-center gap-2 border-2 border-muted p-4">
        {SurveyElements[element.type].editorComponent({
          elementInstance: element,
        })}

        <div className="flex w-full items-center justify-between gap-2">
          <Button
            variant="destructive"
            onClick={() => removeElement(element.id)}
            className="px-2 py-1"
          >
            <Trash className="mr-1 h-4 w-4" />
            Remove
          </Button>
          <Switch
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
      </div>
    </div>
  );
};
