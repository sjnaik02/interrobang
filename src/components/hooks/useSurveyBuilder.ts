"use client";

import { useContext } from "react";
import { SurveyBuilderContext } from "../context/surveyBuilderContext";

const useSurveyBuilder = () => {
  const context = useContext(SurveyBuilderContext);

  if (!context) {
    throw new Error(
      "useSurveyBuilder must be used within a SurveyBuilderContextProvider",
    );
  }

  return context;
};

export default useSurveyBuilder;
