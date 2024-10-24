import * as z from "zod";
import {
  SurveyElementInstance,
  SurveyElement,
  ElementType,
} from "../SurveyElement";
import { Text } from "lucide-react";

import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

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
  const element = elementInstance as CustomInstance;
  const { label, placeholder, required } = element.properties;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-lg">
        {label}
        {required && "*"}
      </Label>
      <Textarea placeholder={placeholder} readOnly id={elementInstance.id} />
    </div>
  );
};

const TextAreaSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  return <div>TextAreaSurveyComponent</div>;
};

export const TextArea: SurveyElement = {
  type,
  name: "Text Area",
  icon: Text,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  editorComponent: TextAreaEditorComponent,
  surveyComponent: TextAreaSurveyComponent,
  validate: (surveyElement: SurveyElementInstance, value: string) => {
    const element = surveyElement as CustomInstance;
    if (element.properties.required) {
      return value.length > 0;
    }
    return true;
  },
};
