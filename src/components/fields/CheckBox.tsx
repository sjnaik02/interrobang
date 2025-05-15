/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { CircleX, CirclePlus, CheckSquare, GripVertical } from "lucide-react";
import ClickToEdit from "../ClickToEdit";
import { FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Reorder, useDragControls } from "framer-motion";
import { Switch } from "../ui/switch";

const type: ElementType = "CheckBox";

const propertiesSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
  allowNone: z.boolean(),
  allowOther: z.boolean(),
});

const properties = {
  label: "Checkbox",
  required: false,
  options: ["Option 1"],
  allowNone: false,
  allowOther: false,
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
  inputRef: React.RefObject<HTMLInputElement | null>;
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
      <Checkbox disabled />
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

const CheckBoxEditorComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const { updateElement } = useSurveyBuilder();
  const element = elementInstance as CustomInstance;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [options, setOptions] = useState(element.properties.options);
  const inputRef = useRef<HTMLInputElement>(null);

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
      {/* if allow none is true, add a "None of the Above" option which is not reorderable but has the same styling as the other options */}
      {element.properties.allowNone && (
        <div className="mb-2 flex w-full items-center gap-2 bg-background">
          <GripVertical className="h-4 w-4 opacity-0" />
          <Checkbox disabled />
          <Label className="w-full cursor-pointer py-2 text-base font-normal text-foreground disabled:text-foreground">
            None of the Above
          </Label>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto"
            onClick={() =>
              updateElement(element.id, {
                ...element,
                properties: { ...element.properties, allowNone: false },
              })
            }
          >
            <CircleX className="h-4 w-4" />
          </Button>
        </div>
      )}
      {element.properties.allowOther && (
        <div className="mb-2 flex w-full items-center gap-2 bg-background">
          <GripVertical className="h-4 w-4 opacity-0" />
          <Checkbox disabled />
          <Label className="w-full cursor-pointer py-2 text-base font-normal text-foreground disabled:text-foreground">
            Other
          </Label>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto"
            onClick={() =>
              updateElement(element.id, {
                ...element,
                properties: { ...element.properties, allowOther: false },
              })
            }
          >
            <CircleX className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => addOption()}
        >
          <CirclePlus className="mr-1 h-4 w-4" /> Add Option
        </Button>
        <Switch
          checked={element.properties.allowNone}
          onCheckedChange={(checked) =>
            updateElement(element.id, {
              ...element,
              properties: { ...element.properties, allowNone: checked },
            })
          }
          id="allow-none"
        />
        <Label htmlFor="allow-none">Allow None of the Above</Label>
        <Switch
          checked={element.properties.allowOther}
          onCheckedChange={(checked) =>
            updateElement(element.id, {
              ...element,
              properties: { ...element.properties, allowOther: checked },
            })
          }
          id="allow-other"
        />
        <Label htmlFor="allow-other">Allow Other</Label>
      </div>
    </div>
  );
};

const CheckBoxPreviewComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState("");
  const element = elementInstance as CustomInstance;

  const handleClick = (value: string) => {
    if (value === "None of the Above") {
      // If none is selected, clear other selections and lock it
      setSelectedValues(["None of the Above"]);
    } else {
      setSelectedValues((prev) => {
        // If none is selected, don't allow other selections
        if (prev.includes("None of the Above")) {
          return prev;
        }
        // Normal toggle behavior
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      });
    }
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
              disabled={selectedValues.includes("None of the Above")}
            />
            <Label
              htmlFor={`option-${index}-${option}-${element.id}`}
              className="w-full cursor-pointer py-2 text-base font-normal"
            >
              {option}
            </Label>
          </div>
        ))}
        {element.properties.allowNone && (
          <div className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground">
            <Checkbox
              checked={selectedValues.includes("None of the Above")}
              onCheckedChange={() => {
                if (selectedValues.includes("None of the Above")) {
                  setSelectedValues([]);
                } else {
                  setSelectedValues(["None of the Above"]);
                }
              }}
              id={`none-${element.id}`}
            />
            <Label
              htmlFor={`none-${element.id}`}
              className="w-full cursor-pointer py-2 text-base font-normal text-foreground"
            >
              None of the Above
            </Label>
          </div>
        )}
        {element.properties.allowOther && (
          <>
            <div className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground">
              <Checkbox
                checked={selectedValues.includes("Other")}
                onClick={() => {
                  if (selectedValues.includes("Other")) {
                    setSelectedValues(
                      selectedValues.filter((v) => v !== "Other"),
                    );
                  } else {
                    setSelectedValues([...selectedValues, "Other"]);
                  }
                }}
                id={`other-${element.id}`}
                disabled={selectedValues.includes("None of the Above")}
              />
              <Label
                htmlFor={`other-${element.id}`}
                className="w-full cursor-pointer py-2 text-base font-normal"
              >
                Other
              </Label>
            </div>
            <Input
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              className={`${
                selectedValues.includes("Other") ? "block" : "hidden"
              }`}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const CheckBoxSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
  field: any;
  index: number;
}> = ({ elementInstance, field, index }) => {
  const element = elementInstance as CustomInstance;
  const [otherText, setOtherText] = useState("");

  // Initialize form values if "Other" is selected
  useEffect(() => {
    if (field.value?.includes("Other")) {
      const otherValue = field.value.find((v: string) =>
        v.startsWith("Other:"),
      );
      if (otherValue) {
        setOtherText(otherValue.replace("Other:", "").trim());
      }
    }
  }, [field.value]);

  // Handle checkbox changes
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValues = field.value || [];
    let newValues: string[];

    if (option === "None of the Above") {
      newValues = checked ? ["None of the Above"] : [];
    } else if (checked) {
      if (currentValues.includes("None of the Above")) {
        newValues = [option];
      } else {
        newValues = [...currentValues, option];
      }
    } else {
      newValues = currentValues.filter(
        (v: string) => !v.startsWith(option) && v !== "Other",
      );
    }

    field.onChange(newValues);
  };

  // Handle "Other" text input changes
  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field.value?.includes("None of the Above")) {
      return;
    }

    const text = e.target.value.slice(0, 255); // Limit to 255 characters
    setOtherText(text);

    const currentValues =
      field.value?.filter((v: string) => !v.startsWith("Other:")) || [];

    if (text.trim()) {
      field.onChange([...currentValues, `Other:${text}`]);
    } else {
      field.onChange(currentValues);
    }
  };

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
                onCheckedChange={(checked) =>
                  handleCheckboxChange(option, !!checked)
                }
                id={`option-${index}-${option}-${element.id}`}
                disabled={field.value?.includes("None of the Above")}
              />
              <Label
                htmlFor={`option-${index}-${option}-${element.id}`}
                className="w-full cursor-pointer py-2 text-lg font-normal"
              >
                {option}
              </Label>
            </div>
          ))}

          {element.properties.allowNone && (
            <div className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground">
              <Checkbox
                checked={field.value?.includes("None of the Above")}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("None of the Above", !!checked)
                }
                id={`none-${element.id}`}
              />
              <Label
                htmlFor={`none-${element.id}`}
                className="w-full cursor-pointer py-2 text-lg font-normal"
              >
                None of the Above
              </Label>
            </div>
          )}

          {element.properties.allowOther && (
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full items-center gap-2 border border-transparent px-2 hover:border hover:border-dashed hover:border-muted-foreground">
                <Checkbox
                  checked={field.value?.some((v: string) =>
                    v.startsWith("Other:"),
                  )}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      const newValues =
                        field.value?.filter(
                          (v: string) => !v.startsWith("Other:"),
                        ) || [];
                      field.onChange(newValues);
                      setOtherText("");
                    } else {
                      const newValues = [...(field.value || []), "Other:"];
                      field.onChange(newValues);
                    }
                  }}
                  id={`other-${element.id}`}
                  disabled={field.value?.includes("None of the Above")}
                />
                <Label
                  htmlFor={`other-${element.id}`}
                  className="w-full cursor-pointer py-2 text-lg font-normal"
                >
                  Other
                </Label>
              </div>
              {field.value?.some((v: string) => v.startsWith("Other:")) && (
                <Input
                  value={otherText}
                  onChange={handleOtherTextChange}
                  placeholder="Please specify"
                  className="ml-8 w-[calc(100%-2rem)]"
                  disabled={field.value?.includes("None of the Above")}
                />
              )}
            </div>
          )}
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
