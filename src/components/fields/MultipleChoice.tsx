import {
  SurveyElementInstance,
  SurveyElement,
  ElementType,
} from "../SurveyElement";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import useSurveyBuilder from "@/components/hooks/useSurveyBuilder";
import { CircleX, CirclePlus, CheckCircle } from "lucide-react";
import ClickToEdit from "../ClickToEdit";

const type: ElementType = "MultipleChoice";

const propertiesSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
});

const properties = {
  label: "Multiple Choice",
  required: false,
  options: ["Option 1"],
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  const addOption = (focus: boolean = false) => {
    const newOptions = [...element.properties.options, ""];
    updateElement(element.id, {
      ...element,
      properties: { ...element.properties, options: newOptions },
    });
    if (focus) {
      setEditingIndex(newOptions.length - 1);
      setEditingValue("");
    }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingIndex !== null) {
        const newOptions = [...element.properties.options];
        newOptions[editingIndex] = editingValue;
        newOptions.push("");
        updateElement(element.id, {
          ...element,
          properties: { ...element.properties, options: newOptions },
        });
        setEditingIndex(newOptions.length - 1);
        setEditingValue("");
      }
    } else if (e.key === "Escape") {
      cancelEdit();
      if (editingValue === "") {
        removeOption(editingIndex || 0);
      }
    }
  };

  const handleSave = (value: string) => {
    updateElement(element.id, {
      ...element,
      properties: { ...element.properties, label: value },
    });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex">
        <ClickToEdit onSave={handleSave}>
          <Label className="text-lg">{element.properties.label}</Label>
        </ClickToEdit>
        {element.properties.required && " *"}
      </div>
      <RadioGroup className="w-full">
        {element.properties.options.map((option, index) => (
          <div key={index} className="flex w-full items-center gap-2">
            <RadioGroupItem value={option} id={`option-${index}`} />
            {editingIndex === index ? (
              <Input
                ref={inputRef}
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                placeholder="Click to edit, Enter to save"
                className="w-full rounded-none border-0 px-0 text-base focus-visible:border-b-2 focus-visible:border-b-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <Label
                htmlFor={`option-${index}`}
                onClick={() => startEditing(index)}
                className="w-full cursor-pointer py-2 text-base font-normal"
              >
                {option}
              </Label>
            )}
            <Button
              variant="outline"
              size="icon"
              className="ml-auto"
              onClick={() => removeOption(index)}
            >
              <CircleX className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </RadioGroup>
      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => addOption()}
      >
        <CirclePlus className="mr-1 h-4 w-4" /> Add Option
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
  name: "Multiple Choice",
  icon: CheckCircle,
  type,
  construct: (id) => ({ id, type, properties }),
  surveyComponent: MultipleChoiceSurveyComponent,
  editorComponent: MultipleChoiceEditorComponent,
  validate: (surveyElement, value) => true,
};
