import * as z from "zod";
import {
  SurveyElementInstance,
  SurveyElement,
  ElementType,
} from "../SurveyElement";

const type: ElementType = "TextArea";
const properties = {
  label: "",
  placeholder: "Click to edit",
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
  return <div>TextAreaEditorComponent</div>;
};

const TextAreaSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  return <div>TextAreaSurveyComponent</div>;
};

export const TextArea: SurveyElement = {
  type,
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
