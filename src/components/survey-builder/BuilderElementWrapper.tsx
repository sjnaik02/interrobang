import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { SurveyElements, type SurveyElementInstance } from "../SurveyElement";
import {
  Trash,
  ChevronUp,
  ChevronDown,
  ChevronDown as DropdownChevron,
} from "lucide-react";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import randomId from "@/lib/randomId";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BuilderElementWrapperProps {
  element: SurveyElementInstance;
  removeElement: (id: string) => void;
  updateElement: (id: string, element: SurveyElementInstance) => void;
  moveElement: (
    idx: string,
    direction: "up" | "down",
    element: SurveyElementInstance,
  ) => void;
  idx: number;
  length: number;
  selectedElement: SurveyElementInstance | null;
  setSelectedElement: (element: SurveyElementInstance | null) => void;
  changeElementType: (
    idx: string,
    element: SurveyElementInstance,
  ) => SurveyElementInstance;
}

const BuilderElementWrapper: React.FC<BuilderElementWrapperProps> = ({
  element,
  removeElement,
  updateElement,
  moveElement,
  idx,
  length,
  selectedElement,
  setSelectedElement,
  changeElementType,
}) => {
  const EditorComponent = SurveyElements[element.type].editorComponent;
  const isSelected = selectedElement?.id === element.id;

  const handleElementTypeChange = (newElementType: string) => {
    const newElement =
      SurveyElements[newElementType as keyof typeof SurveyElements];
    const updatedElement = changeElementType(
      element.id,
      newElement.construct(randomId()),
    );
    // This makes the new element selected, doesn't work without the setTimeout
    setTimeout(() => {
      setSelectedElement(updatedElement);
    }, 0);
  };

  const handleRequiredToggle = (checked: boolean) => {
    updateElement(element.id, {
      id: element.id,
      type: element.type,
      properties: {
        ...element.properties,
        required: checked,
      },
    });
  };

  return (
    <div className="relative flex w-full gap-2" key={element.id}>
      <ElementControls
        element={element}
        moveElement={moveElement}
        idx={idx}
        length={length}
      />

      <div
        className={cn(
          "hover:border-primary flex w-full cursor-pointer flex-col items-center gap-2 rounded-md p-4 transition-all duration-100",
          isSelected && "border-primary border-2",
        )}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
        }}
        tabIndex={0}
        onFocus={() => setSelectedElement(element)}
        onBlur={() => setSelectedElement(null)}
        role="button"
        aria-pressed={isSelected}
      >
        <EditorComponent elementInstance={element} />

        <AnimatePresence>
          {isSelected && (
            <ElementActions
              element={element}
              removeElement={removeElement}
              onElementTypeChange={handleElementTypeChange}
              onRequiredToggle={handleRequiredToggle}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ElementControls: React.FC<{
  element: SurveyElementInstance;
  moveElement: (
    idx: string,
    direction: "up" | "down",
    element: SurveyElementInstance,
  ) => void;
  idx: number;
  length: number;
}> = ({ element, moveElement, idx, length }) => (
  <div className="flex flex-col items-center gap-2 p-2">
    <Button
      variant="ghost"
      onClick={() => moveElement(element.id, "up", element)}
      size="icon"
      disabled={idx === 0}
    >
      <ChevronUp className="h-4 w-4" />
    </Button>

    <p className="text-muted-foreground font-mono">{idx + 1}</p>

    <Button
      variant="ghost"
      onClick={() => moveElement(element.id, "down", element)}
      size="icon"
      disabled={idx === length - 1}
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  </div>
);

const ElementActions: React.FC<{
  element: SurveyElementInstance;
  removeElement: (id: string) => void;
  onElementTypeChange: (newType: string) => void;
  onRequiredToggle: (checked: boolean) => void;
}> = ({ element, removeElement, onElementTypeChange, onRequiredToggle }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="mt-4 flex w-full items-center justify-between gap-2"
  >
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="font-mono">
          {React.createElement(SurveyElements[element.type].icon)}
          {element.type}
          <DropdownChevron className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-mono">
        {Object.entries(SurveyElements)
          .filter(([key]) => key !== element.type)
          .map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onElementTypeChange(key)}
            >
              <value.icon className="mr-1 h-4 w-4" />
              {value.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <Button
      variant="outline"
      onClick={() => removeElement(element.id)}
      className="border-destructive text-destructive"
      size="sm"
    >
      <Trash className="mr-1 h-4 w-4" color="red" />
      Remove
    </Button>

    <div className="flex items-center gap-2">
      <Label htmlFor="required" className="font-mono">
        Required
      </Label>
      <Switch
        id="required"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        checked={element.properties?.required}
        onCheckedChange={onRequiredToggle}
      />
    </div>
  </motion.div>
);

export default BuilderElementWrapper;
