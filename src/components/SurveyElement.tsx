import { TextArea } from "./fields/TextArea";

export type ElementType = "TextArea";

export type SubmitFunction = (key: string, value: string) => void;

export type SurveyElement = {
  type: ElementType;
  construct: (id: string) => SurveyElementInstance;
  surveyComponent: React.FC<{
    elementInstance: SurveyElementInstance;
    submitValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  editorComponent: React.FC<{
    elementInstance: SurveyElementInstance;
  }>;
  validate: (surveyElement: SurveyElementInstance, value: string) => boolean;
};

export type SurveyElementInstance = {
  id: string;
  type: ElementType;
  properties?: Record<string, any>;
};

type SurveyElementsType = {
  [key in ElementType]: SurveyElement;
};

export const SurveyElements: SurveyElementsType = {
  TextArea: TextArea,
};
