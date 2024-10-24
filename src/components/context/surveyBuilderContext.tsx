"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { SurveyElementInstance } from "../SurveyElement";

type SurveyBuilderContextType = {
  elements: SurveyElementInstance[];
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
};

export const SurveyBuilderContext =
  createContext<SurveyBuilderContextType | null>(null);

export const SurveyBuilderContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [elements, setElements] = useState<SurveyElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<SurveyElementInstance | null>(null);

  const addElement = (idx: number, element: SurveyElementInstance) => {
    setElements((prev) => [...prev.slice(0, idx), element, ...prev.slice(idx)]);
  };

  const removeElement = (idx: string) => {
    setElements((prev) => prev.filter((element) => element.id !== idx));
  };

  const updateElement = (idx: string, element: SurveyElementInstance) => {
    setElements((prev) => prev.map((e) => (e.id === idx ? element : e)));
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
      }}
    >
      {children}
    </SurveyBuilderContext.Provider>
  );
};
