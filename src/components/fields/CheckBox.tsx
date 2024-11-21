/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type SurveyElementInstance,
  type SurveyElement,
  type ElementType,
} from "../SurveyElement";
import * as z from "zod";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import useSurveyBuilder from "@/components/hooks/useSurveyBuilder";
import { CircleX, CirclePlus, CheckSquare } from "lucide-react";
import ClickToEdit from "../ClickToEdit";
import { FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";

const type: ElementType = "CheckBox";

const propertiesSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
});

const properties = {
  label: "Checkbox",
  required: false,
  options: ["Option 1"],
};

export type CustomInstance = SurveyElementInstance & {
  properties: z.infer<typeof propertiesSchema>;
};

const CheckBoxEditorComponent: React.FC<{
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
      <div className="flex w-full flex-col gap-4">
        {element.properties.options.map((option, index) => (
          <div key={index} className="flex w-full items-center gap-2">
            <Checkbox disabled />
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
      </div>
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

const CheckBoxPreviewComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const element = elementInstance as CustomInstance;

  const handleClick = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      <h2 className="text-lg">
        {element.properties.label}
        {element.properties.required && " *"}
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {element.properties.options.map((option, index) => (
          <div
            key={index}
            className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground"
          >
            <Checkbox
              checked={selectedValues.includes(option)}
              onCheckedChange={() => handleClick(option)}
              id={`option-${index}-${option}-${element.id}`}
            />
            <Label
              htmlFor={`option-${index}-${option}-${element.id}`}
              className="w-full cursor-pointer py-2 text-base font-normal"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckBoxSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
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
        <div className="mt-4 flex flex-col gap-4">
          {element.properties.options.map((option, index) => (
            <div
              key={index}
              className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground"
            >
              <Checkbox
                checked={field.value?.includes(option)}
                onCheckedChange={(checked) => {
                  const values = field.value || [];
                  if (checked) {
                    field.onChange([...values, option]);
                  } else {
                    field.onChange(values.filter((v: string) => v !== option));
                  }
                }}
                id={`option-${index}-${option}-${element.id}`}
              />
              <Label
                htmlFor={`option-${index}-${option}-${element.id}`}
                className="w-full cursor-pointer py-2 text-lg font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export const CheckBox: SurveyElement = {
  name: "Checkbox",
  icon: CheckSquare,
  type,
  construct: (id) => ({ id, type, properties }),
  getFormSchema: (element: SurveyElementInstance) => {
    const typedElement = element as CustomInstance;

    return typedElement.properties.required
      ? z.array(z.string()).min(1, "Please select at least one option")
      : z.array(z.string()).optional();
  },
  previewComponent: CheckBoxPreviewComponent,
  surveyComponent: CheckBoxSurveyComponent,
  editorComponent: CheckBoxEditorComponent,
};
