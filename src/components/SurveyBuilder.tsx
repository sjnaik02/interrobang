"use client";

import useSurveyBuilder from "./hooks/useSurveyBuilder";
import { Button } from "./ui/button";
import { TextArea } from "./fields/TextArea";
import { MultipleChoice } from "./fields/MultipleChoice";
import { SurveyElements, SurveyElementInstance } from "./SurveyElement";
import { Trash, CirclePlus } from "lucide-react";
import { Switch } from "./ui/switch";

const SurveyBuilder: React.FC = () => {
  const { elements, addElement, removeElement, updateElement } =
    useSurveyBuilder();

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h1 className="text-2xl">Survey Builder</h1>
        {elements.map((element) => (
          <BuilderElementWrapper
            element={element}
            removeElement={removeElement}
            updateElement={updateElement}
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
}> = ({ element, removeElement, updateElement }) => {
  return (
    <div
      key={element.id}
      className="flex flex-col items-center gap-2 border-2 border-muted p-4"
    >
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
  );
};
