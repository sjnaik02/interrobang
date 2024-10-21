import {
  SurveyElementInstance,
  SurveyElement,
  ElementType,
} from "../SurveyElement";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useSurveyBuilder from "@/components/hooks/useSurveyBuilder";
import { CircleX } from "lucide-react";

const type: ElementType = "MultipleChoice";

const propertiesSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
});

const properties = {
  label: "Multiple Choice",
  required: false,
  options: ["Option 1", "Option 2"],
};

type CustomInstance = SurveyElementInstance & {
  properties: z.infer<typeof propertiesSchema>;
};

const MultipleChoiceEditorComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  const { updateElement } = useSurveyBuilder();
  const element = elementInstance as CustomInstance;
  const addOption = (id: string) => {
    element.properties.options.push("");
    updateElement(element.id, element);
  };
  const removeOption = (index: number) => {
    element.properties.options.splice(index, 1);
    updateElement(element.id, element);
  };
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>{element.properties.label}</Label>
      <RadioGroup className="w-full">
        {element.properties.options.map((option, index) => (
          <div className="flex w-full items-center gap-2">
            <RadioGroupItem key={option} value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
            <Button
              variant="secondary"
              size="icon"
              className="ml-auto"
              onClick={() => removeOption(index)}
            >
              <CircleX />
            </Button>
          </div>
        ))}
      </RadioGroup>
      <Button
        variant="secondary"
        className="w-fit"
        onClick={() => addOption(element.id)}
      >
        Add Option
      </Button>
    </div>
  );
};

const MultipleChoiceSurveyComponent: React.FC<{
  elementInstance: SurveyElementInstance;
}> = ({ elementInstance }) => {
  return <div>MultipleChoiceSurveyComponent</div>;
};

export const MultipleChoice: SurveyElement = {
  type,
  construct: (id) => ({ id, type, properties }),
  surveyComponent: MultipleChoiceSurveyComponent,
  editorComponent: MultipleChoiceEditorComponent,
  validate: (surveyElement, value) => true,
};
