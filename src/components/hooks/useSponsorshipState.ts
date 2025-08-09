/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
// import type { Value } from "@udecode/plate/react";

// Define Value type locally since it's not exported from the package
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any[];

export interface SponsorshipState {
  enableSponsorship: boolean;
  sponsorName: string;
  sponsorCopy: Value;
  ctaText: string;
  ctaUrl: string;
  setEnableSponsorship: (enabled: boolean) => void;
  setSponsorName: (name: string) => void;
  setSponsorCopy: (copy: Value) => void;
  setCtaText: (text: string) => void;
  setCtaUrl: (url: string) => void;
}

// Default rich text value for empty sponsor copy
const defaultSponsorCopyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

export const useSponsorshipState = (): SponsorshipState => {
  const [enableSponsorship, setEnableSponsorship] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorCopy, setSponsorCopy] = useState<Value>(defaultSponsorCopyValue);
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
