"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { type SurveyElementInstance } from "../SurveyElement";

type SurveyBuilderContextType = {
  elements: SurveyElementInstance[];
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  surveyId: string;
  setSurveyId: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  isPublished: boolean;
  setIsPublished: Dispatch<SetStateAction<boolean>>;
  setElements: Dispatch<SetStateAction<SurveyElementInstance[]>>;
  selectedElement: SurveyElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<SurveyElementInstance | null>>;
  addElement: (idx: number, element: SurveyElementInstance) => void;
  removeElement: (idx: string) => void;
  updateElement: (idx: string, element: SurveyElementInstance) => void;
  moveElement: (
    idx: string,
    direction: "up" | "down",
    element: SurveyElementInstance,
  ) => void;
  changeElementType: (
    idx: string,
    element: SurveyElementInstance,
  ) => SurveyElementInstance;
};

export const SurveyBuilderContext =
  createContext<SurveyBuilderContextType | null>(null);

export const SurveyBuilderContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [elements, setElements] = useState<SurveyElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<SurveyElementInstance | null>(null);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [surveyId, setSurveyId] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const addElement = (idx: number, element: SurveyElementInstance) => {
    setElements((prev) => [...prev.slice(0, idx), element, ...prev.slice(idx)]);
  };

  const removeElement = (idx: string) => {
    setElements((prev) => prev.filter((element) => element.id !== idx));
  };

  const updateElement = (idx: string, element: SurveyElementInstance) => {
    setElements((prev) => prev.map((e) => (e.id === idx ? element : e)));
  };

  const changeElementType = (
    idx: string,
    element: SurveyElementInstance,
  ): SurveyElementInstance => {
    const updatedElement = { ...element };
    setElements((prev) =>
      prev.map((e) => {
        if (e.id === idx) {
          // Transfer common properties
          updatedElement.properties = {
            ...updatedElement.properties,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: e.properties?.label ?? "",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            required: e.properties?.required ?? false,
          };

          // Transfer options if both elements support them
          if (
            (e.type === "MultipleChoice" || e.type === "CheckBox") &&
            (updatedElement.type === "MultipleChoice" ||
              updatedElement.type === "CheckBox")
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            updatedElement.properties.options = e.properties?.options ?? [];
          }

          return updatedElement;
        }
        return e;
      }),
    );
    return updatedElement;
  };

  const moveElement = (
    idx: string,
    direction: "up" | "down",
    element: SurveyElementInstance,
  ) => {
    setElements((prev) => {
      const index = prev.findIndex((e) => e.id === idx);
      const newElements = [...prev];
      newElements.splice(index, 1);
      newElements.splice(index + (direction === "up" ? -1 : 1), 0, element);
      return newElements;
    });
  };

  return (
    <SurveyBuilderContext.Provider
      value={{
        elements,
        setElements,
        selectedElement,
        setSelectedElement,
        addElement,
        removeElement,
        updateElement,
        moveElement,
        title,
        setTitle,
        name,
        setName,
        surveyId,
        setSurveyId,
        isPublished,
        setIsPublished,
        changeElementType,
      }}
    >
      {children}
    </SurveyBuilderContext.Provider>
  );
};
