/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type SurveyElementInstance,
  type SurveyElement,
  type ElementType,
} from "../SurveyElement";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { CirclePlus, CircleX, GripVertical, ListOrdered } from "lucide-react";
import useSurveyBuilder from "../hooks/useSurveyBuilder";
import ClickToEdit from "../ClickToEdit";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
const type: ElementType = "Ranking";

const propertiesSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
});

const properties = {
  label: "Ranking",
  required: false,
  options: ["Option 1"],
};

export type CustomInstance = SurveyElementInstance & {
  properties: z.infer<typeof propertiesSchema>;
};

const RankingEditorComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const typedElement = elementInstance as CustomInstance;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState(typedElement.properties.options);
  const { updateElement } = useSurveyBuilder();

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    updateElement(typedElement.id, {
      ...typedElement,
      properties: { ...typedElement.properties, options },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const addOption = (focus = false) => {
    const newOptions = [...options, ""];
    setOptions(newOptions);
    if (focus) {
      setEditingIndex(newOptions.length - 1);
      setEditingValue("");
    }
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(options[index] ?? "");
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newOptions = [...options];
      newOptions[editingIndex] = editingValue;
      setOptions(newOptions);
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
        const newOptions = [...options];
        newOptions[editingIndex] = editingValue;
        newOptions.push("");
        setOptions(newOptions);
        setEditingIndex(newOptions.length - 1);
        setEditingValue("");
      }
    } else if (e.key === "Escape") {
      cancelEdit();
      if (editingValue === "") {
        removeOption(editingIndex ?? 0);
      }
    }
    if (e.key === "Backspace" && editingIndex === options.length - 1) {
      removeOption(options.length - 1);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = (value: string) => {
    updateElement(typedElement.id, {
      ...typedElement,
      properties: { ...typedElement.properties, label: value },
    });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <ClickToEdit onSave={handleSave}>
        <Label>{typedElement.properties.label}</Label>
      </ClickToEdit>
      {typedElement.properties.required ? (
        <p className="px-2 font-mono text-sm text-red-500">Required</p>
      ) : null}
      <Reorder.Group
        axis="y"
        values={options}
        onReorder={setOptions}
        className="flex w-full flex-col gap-4"
      >
        {options.map((option, index) => (
          <Reorder.Item
            key={option}
            value={option}
            className="flex w-full items-center gap-2"
          >
            <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
            <Input
              ref={editingIndex === index ? inputRef : undefined}
              value={editingIndex === index ? editingValue : option}
              onFocus={() => startEditing(index)}
              onChange={(e) =>
                editingIndex === index && setEditingValue(e.target.value)
              }
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
              placeholder="Enter option text"
              className={`w-full rounded-none border-0 px-0 text-base ${
                editingIndex === index
                  ? "focus-visible:border-b-2 focus-visible:border-b-primary"
                  : "border-transparent"
              } focus-visible:outline-none focus-visible:ring-0`}
            />
            <Button
              variant="outline"
              size="icon"
              className="ml-auto"
              onClick={() => removeOption(index)}
            >
              <CircleX className="h-4 w-4" />
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
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

const RankingPreviewComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const element = elementInstance as CustomInstance;
  const [options, setOptions] = useState(element.properties.options);
  return (
    <div className="flex w-full flex-col space-y-2">
      <h2 className="text-lg">
        {element.properties.label}
        {element.properties.required && " *"}
      </h2>
      <Reorder.Group
        axis="y"
        values={element.properties.options}
        className="flex w-full flex-col gap-2"
        onReorder={setOptions}
      >
        {options.map((option, index) => (
          <Reorder.Item
            key={option}
            value={option}
            className="flex w-full items-center gap-2 border border-dashed border-transparent bg-background px-2 py-1 hover:border-solid hover:border-muted-foreground"
          >
            <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
            {option}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

const RankingSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
  field: any;
  index: number;
}> = ({ elementInstance, field, index }) => {
  const typedElement = elementInstance as CustomInstance;
  const [initialized, setInitialized] = useState(false);

  // Initialize the field value once
  useEffect(() => {
    if (!initialized && !field.value) {
      field.onChange(typedElement.properties.options);
      setInitialized(true);
    }
  }, [initialized, field, typedElement.properties.options]);

  const currentValue = field.value || typedElement.properties.options;

  return (
    <FormItem className="flex w-full flex-col gap-2">
      <FormLabel className="text-xl font-normal">
        {index + 1}. {typedElement.properties.label}
        {typedElement.properties.required && " *"}
      </FormLabel>
      <FormControl>
        <Reorder.Group
          axis="y"
          values={currentValue}
          className="flex w-full flex-col gap-2"
          onReorder={field.onChange}
        >
          {currentValue.map((option: string, optionIndex: number) => (
            <Reorder.Item
              key={option}
              value={option}
              className="flex w-full items-center gap-2 border border-dashed border-transparent bg-background px-2 py-1 hover:border-solid hover:border-muted-foreground"
            >
              <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
              {optionIndex + 1}. {option}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export const RankingFormElement: SurveyElement = {
  type,
  name: "Ranking",
  icon: ListOrdered,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  editorComponent: RankingEditorComponent,
  previewComponent: RankingPreviewComponent,
  surveyComponent: RankingSurveyComponent,
  getFormSchema: (element: SurveyElementInstance) => {
    const typedElement = element as CustomInstance;
    return z.array(z.string()).default(typedElement.properties.options);
  },
};
