import * as z from "zod";
import {
  SurveyElementInstance,
  SurveyElement,
  ElementType,
} from "../SurveyElement";
import { Text } from "lucide-react";
import ClickToEdit from "../ClickToEdit";
import useSurveyBuilder from "../hooks/useSurveyBuilder";

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
      <div className="flex">
        <ClickToEdit onSave={handleSave}>
          <Label className="text-lg">{label}</Label>
        </ClickToEdit>
        {required && "*"}
      </div>
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
  name: "Long Answer",
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
