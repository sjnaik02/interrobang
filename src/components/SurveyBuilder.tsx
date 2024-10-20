"use client";

import useSurveyBuilder from "./hooks/useSurveyBuilder";
import { Button } from "./ui/button";
import { TextArea } from "./fields/TextArea";
import { SurveyElements } from "./SurveyElement";

const SurveyBuilder: React.FC = () => {
  const { elements, addElement, removeElement } = useSurveyBuilder();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">SurveyBuilder</h1>
      <Button onClick={() => addElement(0, TextArea.construct(randomId()))}>
        Add TextArea
      </Button>
      <div className="flex flex-col gap-4">
        {elements.map((element) => (
          <div key={element.id} className="flex items-center gap-2">
            {SurveyElements[element.type].editorComponent({
              elementInstance: element,
            })}
            <Button
              variant="destructive"
              onClick={() => removeElement(element.id)}
            >
              Remove
            </Button>
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
