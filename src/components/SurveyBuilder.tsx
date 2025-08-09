"use client";

import { useState, useEffect, useMemo } from "react";
import useSurveyBuilder from "./hooks/useSurveyBuilder";
import { type SurveyElementInstance } from "./SurveyElement";
import TopBar from "./TopBar";
import { type Survey } from "@/server/db/schema";
import { toast } from "sonner";
import {
  type PublishSurveyType,
  type SaveChangesToSurveyType,
} from "@/app/actions/survey";
import { type CreateSponsorAdForSurveyType } from "@/app/actions/sponsorAd";
import React from "react";
import useAutosave from "./hooks/useAutosave";
import SurveyPreview from "./SurveyPreview";
import ClickToEdit from "./ClickToEdit";
import PreviewLinkSection from "@/components/survey-builder/PreviewLinkSection";
import PublishedLinkSection from "@/components/survey-builder/PublishedLinkSection";
import SponsorshipSection from "@/components/survey-builder/SponsorshipSection";
import SponsorshipPreview from "@/components/survey-builder/SponsorshipPreview";
import BuilderElementWrapper from "@/components/survey-builder/BuilderElementWrapper";
import { useSponsorshipState } from "@/components/hooks/useSponsorshipState";
import { type SponsorAd } from "@/server/db/schema";

const SurveyBuilder: React.FC<{
  survey: Survey;
  saveChanges: SaveChangesToSurveyType;
  publishSurvey: PublishSurveyType;
  createSponsorAdForSurvey: CreateSponsorAdForSurveyType;
  existingSponsorAd?: Pick<SponsorAd, "sponsorName" | "copy" | "ctaText" | "ctaUrl"> | null;
}> = ({ survey, saveChanges, publishSurvey, createSponsorAdForSurvey, existingSponsorAd }) => {
  const [isReady, setIsReady] = useState(false);
  const [preview, setPreview] = useState(false);
  const [currentSponsorAd, setCurrentSponsorAd] = useState<Pick<SponsorAd, "sponsorName" | "copy" | "ctaText" | "ctaUrl"> | null>(existingSponsorAd ?? null);

  const {
    elements,
    removeElement,
    setElements,
    updateElement,
    moveElement,
    selectedElement,
    setSelectedElement,
    title,
    setTitle,
    isPublished,
    setIsPublished,
    setSurveyId,
    changeElementType,
  } = useSurveyBuilder();

  const sponsorshipState = useSponsorshipState();

  useEffect(() => {
    if (isReady) return;
    setTitle(survey.title);
    setIsPublished(survey.isPublished ?? false);
    setSurveyId(survey.id);
    if (survey.questions && survey.questions.length > 0) {
      setElements(survey.questions);
    }
    if (survey.isPublished) {
      setPreview(true);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-switch to preview mode when survey gets published
  useEffect(() => {
    if (isPublished && !preview) {
      setPreview(true);
    }
  }, [isPublished, preview]);

  // Function to fetch sponsor ad data
  const fetchSponsorAd = async (surveyId: string) => {
    try {
      const response = await fetch(`/api/sponsor-ad?surveyId=${surveyId}`);
      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const sponsorAd = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setCurrentSponsorAd(sponsorAd);
      }
    } catch (error) {
      console.error("Failed to fetch sponsor ad:", error);
    }
  };

  const handleSave = async () => {
    try {
      const surveyDataToSave = {
        id: survey.id,
        title,
        questions: elements,
        updatedAt: new Date(),
        enableSponsorship: sponsorshipState.enableSponsorship,
        sponsorName: sponsorshipState.enableSponsorship
          ? sponsorshipState.sponsorName
          : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sponsorCopy: sponsorshipState.enableSponsorship
          ? sponsorshipState.sponsorCopy
          : undefined,
        ctaText: sponsorshipState.enableSponsorship
          ? sponsorshipState.ctaText
          : undefined,
        ctaUrl: sponsorshipState.enableSponsorship
          ? sponsorshipState.ctaUrl
          : undefined,
      };

      const dataForSaveChanges: {
        id: string;
        title: string;
        questions: SurveyElementInstance[];
        updatedAt: Date;
      } = {
        id: surveyDataToSave.id,
        title: surveyDataToSave.title,
        questions: surveyDataToSave.questions,
        updatedAt: surveyDataToSave.updatedAt,
      };

      await saveChanges(dataForSaveChanges);

      toast.success("Saved survey");
      return true;
    } catch (err) {
      console.error("Autosave failed:", err);
      toast.error("Failed to save survey. Some details may not be persisted.");
      return false;
    }
  };

  const { status, triggerSave } = useAutosave(handleSave);

  // Extract sponsorCopy serialization for stable comparison
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const sponsorCopySerialized = useMemo(() => JSON.stringify(sponsorshipState.sponsorCopy), [sponsorshipState.sponsorCopy]);

  useEffect(() => {
    if (!isReady) return;
    if (isPublished) return;
    if (status === "saving") return;
    triggerSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elements,
    title,
    sponsorshipState.enableSponsorship,
    sponsorshipState.sponsorName,
    sponsorCopySerialized,
    sponsorshipState.ctaText,
    sponsorshipState.ctaUrl,
  ]);

  const handlePublishWithSponsor: PublishSurveyType = async (id) => {
    if (sponsorshipState.enableSponsorship) {
      await createSponsorAdForSurvey(
        id,
        sponsorshipState.sponsorName,
        sponsorshipState.sponsorCopy,
        sponsorshipState.ctaText,
        sponsorshipState.ctaUrl,
      );
      // Fetch the newly created sponsor ad
      await fetchSponsorAd(id);
    }
    return publishSurvey(id);
  };

  const surveyElementsProps = {
    elements,
    removeElement,
    updateElement,
    moveElement,
    selectedElement,
    setSelectedElement,
    changeElementType,
  };

  return (
    <div
      className="flex min-h-screen flex-col gap-4"
      onClick={() => setSelectedElement(null)}
    >
      <TopBar
        preview={preview}
        setPreview={setPreview}
        saveChanges={saveChanges}
        publishSurvey={handlePublishWithSponsor}
        status={status}
      />

      {!isPublished && <PreviewLinkSection surveyId={survey.id} />}

      {isPublished && <PublishedLinkSection surveyId={survey.id} />}

      {preview ? (
        <PreviewContent
          survey={survey}
          title={title}
          elements={elements}
          isPublished={isPublished}
          existingSponsorAd={currentSponsorAd}
        />
      ) : (
        <BuilderContent
          title={title}
          setTitle={setTitle}
          sponsorshipState={sponsorshipState}
          isPublished={isPublished}
          {...surveyElementsProps}
        />
      )}
    </div>
  );
};

const PreviewContent: React.FC<{
  survey: Survey;
  title: string;
  elements: SurveyElementInstance[];
  isPublished: boolean;
  existingSponsorAd?: Pick<SponsorAd, "sponsorName" | "copy" | "ctaText" | "ctaUrl"> | null;
}> = ({ survey, title, elements, isPublished, existingSponsorAd }) => (
  <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-12">
    <SurveyPreview
      survey={{
        id: survey.id,
        title,
        questions: elements,
        isPublished,
        isArchived: survey.isArchived,
        createdBy: survey.createdBy,
        responseCount: survey.responseCount,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
        sponsorAdId: survey.sponsorAdId,
      }}
    />
    {isPublished && existingSponsorAd && <SponsorshipPreview sponsorAd={existingSponsorAd} />}
  </div>
);

const BuilderContent: React.FC<{
  title: string;
  setTitle: (title: string) => void;
  elements: SurveyElementInstance[];
  removeElement: (id: string) => void;
  updateElement: (id: string, element: SurveyElementInstance) => void;
  moveElement: (
    idx: string,
    direction: "up" | "down",
    element: SurveyElementInstance,
  ) => void;
  selectedElement: SurveyElementInstance | null;
  setSelectedElement: (element: SurveyElementInstance | null) => void;
  changeElementType: (
    idx: string,
    element: SurveyElementInstance,
  ) => SurveyElementInstance;
  sponsorshipState: ReturnType<typeof useSponsorshipState>;
  isPublished: boolean;
}> = ({
  title,
  setTitle,
  elements,
  removeElement,
  updateElement,
  moveElement,
  selectedElement,
  setSelectedElement,
  changeElementType,
  sponsorshipState,
  isPublished,
}) => (
  <>
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-0.5">
      <ClickToEdit
        onSave={(value) => setTitle(value)}
        className="text-3xl font-medium"
      >
        <h1>{title}</h1>
      </ClickToEdit>
      {elements.map((element, idx) => (
        <BuilderElementWrapper
          key={element.id}
          element={element}
          removeElement={removeElement}
          updateElement={updateElement}
          moveElement={moveElement}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          idx={idx}
          length={elements.length}
          changeElementType={changeElementType}
        />
      ))}
    </div>
    {!isPublished && <SponsorshipSection sponsorshipState={sponsorshipState} />}
  </>
);

export default SurveyBuilder;
