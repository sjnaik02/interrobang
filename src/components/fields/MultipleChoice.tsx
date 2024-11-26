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
import { CircleX, CirclePlus, CheckCircle, GripVertical } from "lucide-react";
import ClickToEdit from "../ClickToEdit";
import { FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Reorder, useDragControls } from "framer-motion";

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

export type CustomInstance = SurveyElementInstance & {
  properties: z.infer<typeof propertiesSchema>;
};

// ReorderableItem component to handle individual items
const ReorderableItem = ({
  option,
  index,
  editingIndex,
  editingValue,
  inputRef,
  startEditing,
  setEditingValue,
  saveEdit,
  handleKeyDown,
  removeOption,
}: {
  option: string;
  index: number;
  editingIndex: number | null;
  editingValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  startEditing: (index: number) => void;
  setEditingValue: (value: string) => void;
  saveEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeOption: (index: number) => void;
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={option}
      dragListener={false}
      dragControls={dragControls}
      className="flex w-full select-none items-center gap-2"
    >
      <div
        onPointerDown={(event) => dragControls.start(event)}
        className="cursor-grab touch-none active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <RadioGroupItem value={option} disabled />
      <Input
        ref={index === editingIndex ? inputRef : undefined}
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
  );
};

const MultipleChoiceEditorComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const { updateElement } = useSurveyBuilder();
  const element = elementInstance as CustomInstance;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState(element.properties.options);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    updateElement(element.id, {
      ...element,
      properties: { ...element.properties, options },
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
        <Reorder.Group
          axis="y"
          values={options}
          onReorder={setOptions}
          className="flex w-full flex-col gap-4"
        >
          {options.map((option, index) => (
            <ReorderableItem
              key={option}
              option={option}
              index={index}
              {...{
                editingIndex,
                editingValue,
                inputRef,
                startEditing,
                setEditingValue,
                saveEdit,
                handleKeyDown,
                removeOption,
              }}
            />
          ))}
        </Reorder.Group>
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
    <div className="flex w-full flex-col space-y-2">
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
              id={`option-${index}-${option}-${element.id}`}
              checked={selectedValue === option}
              onClick={() => handleClick(option)}
            />
            <Label
              htmlFor={`option-${index}-${option}-${element.id}`}
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
              <RadioGroupItem
                value={option}
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
