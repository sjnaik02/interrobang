"use client";

import useSurveyBuilder from "./hooks/useSurveyBuilder";
import { Button } from "./ui/button";
import { TextArea } from "./fields/TextArea";
import { SurveyElements } from "./SurveyElement";
import { Trash } from "lucide-react";
import { Switch } from "./ui/switch";

const SurveyBuilder: React.FC = () => {
  const { elements, addElement, removeElement, updateElement } =
    useSurveyBuilder();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">Survey Builder</h1>
      <Button onClick={() => addElement(0, TextArea.construct(randomId()))}>
        Add TextArea
      </Button>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {elements.map((element) => (
          <div key={element.id} className="flex flex-col items-center gap-2">
            {SurveyElements[element.type].editorComponent({
              elementInstance: element,
            })}
            <div className="flex w-full justify-between gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeElement(element.id)}
              >
                <Trash className="h-4 w-4" />
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
        ))}
      </div>
    </div>
  );
};

export default SurveyBuilder;

const randomId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 15);
};
