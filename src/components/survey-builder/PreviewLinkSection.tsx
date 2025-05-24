"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Link as LinkIcon, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface PreviewLinkSectionProps {
  surveyId: string;
}

const PreviewLinkSection: React.FC<PreviewLinkSectionProps> = ({
  surveyId,
}) => {
  const [previewLinkCopied, setPreviewLinkCopied] = useState(false);

  const handleCopyPreviewLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/survey/preview/${surveyId}`,
    );
    toast.success("Copied preview link to clipboard");
    setPreviewLinkCopied(true);
    setTimeout(() => setPreviewLinkCopied(false), 2000);
  };

  return (
    <div className="border-muted/40 bg-muted/5 mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-md border pl-2">
      <span className="text-muted-foreground flex items-center text-sm whitespace-nowrap">
        <LinkIcon className="mr-1 h-4 w-4" />
        Preview Link
      </span>
      <Link
        href={`/survey/preview/${surveyId}`}
        className="text-muted-foreground hover:text-foreground inline-block truncate text-sm whitespace-nowrap"
      >
        {`${window.location.origin}/survey/preview/${surveyId}`}
      </Link>

      <Button
        onClick={handleCopyPreviewLink}
        size="sm"
        variant="default"
        className="hover:bg-muted hover:text-foreground rounded-l-none border-l px-2"
      >
        {previewLinkCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default PreviewLinkSection;
