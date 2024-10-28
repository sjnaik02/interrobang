/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as z from "zod";
import {
  type SurveyElementInstance,
  type SurveyElement,
  type ElementType,
} from "../SurveyElement";
import { Text } from "lucide-react";
import ClickToEdit from "../ClickToEdit";
import useSurveyBuilder from "../hooks/useSurveyBuilder";

import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";

const type: ElementType = "TextArea";
const properties = {
  label: "Text Area",
  placeholder: "Type here...",
  required: false,
};

const propertiesSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  required: z.boolean(),
});

type CustomInstance = SurveyElementInstance & {
  properties: z.infer<typeof propertiesSchema>;
};

const TextAreaEditorComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const { updateElement } = useSurveyBuilder();
  const element = elementInstance as CustomInstance;
  const { label, placeholder, required } = element.properties;

  const handleSave = (value: string) => {
    updateElement(elementInstance.id, {
      ...elementInstance,
      properties: { ...element.properties, label: value },
    });
  };
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="">
        <ClickToEdit onSave={handleSave}>
          <Label className="text-lg">{label}</Label>
        </ClickToEdit>
        {element.properties.required ? (
          <p className="px-2 font-mono text-sm text-red-500">Required</p>
        ) : null}
      </div>
      <Textarea placeholder={placeholder} readOnly id={elementInstance.id} />
    </div>
  );
};

const TextAreaPreviewComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const element = elementInstance as CustomInstance;
  const { label, placeholder, required } = element.properties;
  return (
    <div className="w-full">
      <h2 className="text-lg">
        {label}
        {required && " *"}
      </h2>
      <Textarea
        placeholder={placeholder}
        id={elementInstance.id}
        className="mt-4 w-full"
      />
    </div>
  );
};

// Text Area Survey Component
const TextAreaSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
  field: any;
  index: number;
}> = ({ elementInstance, field, index }) => {
  const element = elementInstance as CustomInstance;

  return (
    <FormItem className="space-y-4">
      <FormLabel className="text-xl font-normal">
        {index + 1}. {element.properties.label}
        {element.properties.required && " *"}
      </FormLabel>
      <FormControl>
        <Textarea
          placeholder={element.properties.placeholder}
          {...field}
          className="w-full text-lg placeholder:text-lg"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export const TextArea: SurveyElement = {
  type,
  name: "Long Answer",
  icon: Text,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  getFormSchema: (element: SurveyElementInstance) => {
    const typedElement = element as CustomInstance;

    // If required, must have some text
    return typedElement.properties.required
      ? z.string().min(1, "This question is required")
      : z.string().optional();
  },
  editorComponent: TextAreaEditorComponent,
  previewComponent: TextAreaPreviewComponent,
  surveyComponent: TextAreaSurveyComponent,
};
