import { useState } from "react";

export interface SponsorshipState {
  enableSponsorship: boolean;
  sponsorName: string;
  sponsorCopy: string;
  ctaText: string;
  ctaUrl: string;
  setEnableSponsorship: (enabled: boolean) => void;
  setSponsorName: (name: string) => void;
  setSponsorCopy: (copy: string) => void;
  setCtaText: (text: string) => void;
  setCtaUrl: (url: string) => void;
}

export const useSponsorshipState = (): SponsorshipState => {
  const [enableSponsorship, setEnableSponsorship] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorCopy, setSponsorCopy] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");

  return {
    enableSponsorship,
    sponsorName,
    sponsorCopy,
    ctaText,
    ctaUrl,
    setEnableSponsorship,
    setSponsorName,
    setSponsorCopy,
    setCtaText,
    setCtaUrl,
  };
};
