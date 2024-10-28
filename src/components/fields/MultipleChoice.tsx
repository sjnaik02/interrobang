/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type SurveyElementInstance,
  type SurveyElement,
  type ElementType,
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
import { FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";

const type: ElementType = "MultipleChoice";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const addOption = (focus = false) => {
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
    setEditingValue(element.properties.options[index] ?? "");
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
        removeOption(editingIndex ?? 0);
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
      <div className="">
        <ClickToEdit onSave={handleSave}>
          <Label className="text-lg">{element.properties.label}</Label>
        </ClickToEdit>
        {element.properties.required ? (
          <p className="px-2 font-mono text-sm text-red-500">Required</p>
        ) : null}
      </div>
      <RadioGroup className="w-full" disabled={true}>
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

const MultipleChoicePreviewComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const element = elementInstance as CustomInstance;

  const handleClick = (value: string) => {
    if (selectedValue === value) {
      setSelectedValue(null);
    } else {
      setSelectedValue(value);
    }
  };
  return (
    <div>
      <h2 className="text-lg">
        {element.properties.label}
        {element.properties.required && " *"}
      </h2>
      <RadioGroup className="mt-4">
        {element.properties.options.map((option, index) => (
          <div
            key={index}
            className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground"
          >
            <RadioGroupItem
              key={index}
              value={option}
              id={`option-${index}`}
              checked={selectedValue === option}
              onClick={() => handleClick(option)}
            />
            <Label
              htmlFor={`option-${index}`}
              className="w-full cursor-pointer py-2 text-base font-normal"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

// Multiple Choice Survey Component
const MultipleChoiceSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  index: number;
}> = ({ elementInstance, field, index }) => {
  const element = elementInstance as CustomInstance;

  return (
    <FormItem>
      <FormLabel className="text-xl font-normal">
        {index + 1}. {element.properties.label}
        {element.properties.required && " *"}
      </FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="mt-4"
        >
          {element.properties.options.map((option, index) => (
            <div
              key={index}
              className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground"
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="w-full cursor-pointer py-2 text-lg font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export const MultipleChoice: SurveyElement = {
  name: "Multiple Choice",
  icon: CheckCircle,
  type,
  construct: (id) => ({ id, type, properties }),
  getFormSchema: (element: SurveyElementInstance) => {
    const typedElement = element as CustomInstance;

    // If required, must pick one of the options
    return typedElement.properties.required
      ? z.enum(typedElement.properties.options as [string, ...string[]], {
          required_error: "This question is required",
        })
      : z
          .enum(typedElement.properties.options as [string, ...string[]])
          .optional();
  },
  previewComponent: MultipleChoicePreviewComponent,
  surveyComponent: MultipleChoiceSurveyComponent,
  editorComponent: MultipleChoiceEditorComponent,
};
