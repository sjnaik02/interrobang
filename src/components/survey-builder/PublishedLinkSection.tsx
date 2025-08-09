"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Link as LinkIcon, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface PublishedLinkSectionProps {
  surveyId: string;
}

const PublishedLinkSection: React.FC<PublishedLinkSectionProps> = ({
  surveyId,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPublishedLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/survey/${surveyId}`,
    );
    toast.success("Copied survey link to clipboard");
    setCopied(true);
  };

  return (
    <div className="border-muted-foreground mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-md border pl-2">
      <span className="flex items-center font-mono whitespace-nowrap">
        <LinkIcon className="mr-1 h-4 w-4" />
        Survey Link:{" "}
      </span>
      <Link
        href={`/survey/${surveyId}`}
        className="hover:text-muted-foreground inline-block truncate font-mono whitespace-nowrap text-black"
      >
        {`${window.location.origin}/survey/${surveyId}`}
      </Link>

      <Button
        onClick={handleCopyPublishedLink}
        size="sm"
        className="rounded-l-none"
      >
        {copied ? (
          <Check className="mr-1 h-4 w-4" />
        ) : (
          <Copy className="mr-1 h-4 w-4" />
        )}
        Copy Link
      </Button>
    </div>
  );
};

export default PublishedLinkSection;
