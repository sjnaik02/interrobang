import {
  SurveyElementInstance,
  SurveyElement,
  ElementType,
} from "../SurveyElement";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import useSurveyBuilder from "@/components/hooks/useSurveyBuilder";
import { CircleX } from "lucide-react";

const type: ElementType = "MultipleChoice";

const propertiesSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
});

const properties = {
  label: "Multiple Choice",
  required: false,
  options: ["Option 1", "Option 2"],
};

type CustomInstance = SurveyElementInstance & {
  properties: z.infer<typeof propertiesSchema>;
};

const MultipleChoiceEditorComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const { updateElement } = useSurveyBuilder();
  const element = elementInstance as CustomInstance;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addOption = () => {
    const newOptions = [...element.properties.options, "New Option"];
    updateElement(element.id, {
      ...element,
      properties: { ...element.properties, options: newOptions },
    });
  };

  const removeOption = (index: number) => {
    const newOptions = element.properties.options.filter((_, i) => i !== index);
    updateElement(element.id, {
      ...element,
      properties: { ...element.properties, options: newOptions },
    });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(element.properties.options[index] || "");
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newOptions = [...element.properties.options];
      newOptions[editingIndex] = editingValue;
      updateElement(element.id, {
        ...element,
        properties: { ...element.properties, options: newOptions },
      });
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-lg">{element.properties.label}</Label>
      <RadioGroup className="w-full">
        {element.properties.options.map((option, index) => (
          <div key={index} className="flex w-full items-center gap-2">
            <RadioGroupItem value={option} id={`option-${index}`} />
            {editingIndex === index ? (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveEdit();
                  }
                  if (e.key === "Escape") {
                    cancelEdit();
                  }
                }}
                autoFocus
                className="w-full rounded-lg px-2 py-2 text-base font-normal"
              />
            ) : (
              <Label
                htmlFor={`option-${index}`}
                onClick={() => startEditing(index)}
                className="w-full cursor-pointer rounded-lg px-2 py-2 text-base font-normal hover:bg-blue-200 hover:underline"
              >
                {option}
              </Label>
            )}
            <Button
              variant="outline"
              size="icon"
              className="ml-auto border-destructive bg-background"
              onClick={() => removeOption(index)}
            >
              <CircleX color="red" />
            </Button>
          </div>
        ))}
      </RadioGroup>
      <Button variant="secondary" className="w-fit" onClick={addOption}>
        Add Option
      </Button>
    </div>
  );
};

const MultipleChoiceSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  return <div>MultipleChoiceSurveyComponent</div>;
};

export const MultipleChoice: SurveyElement = {
  type,
  construct: (id) => ({ id, type, properties }),
  surveyComponent: MultipleChoiceSurveyComponent,
  editorComponent: MultipleChoiceEditorComponent,
  validate: (surveyElement, value) => true,
};
