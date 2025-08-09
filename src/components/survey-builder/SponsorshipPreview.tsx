/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { SponsorCopyRenderer } from "../editor/SponsorCopyRenderer";
import { type SponsorAd } from "@/server/db/schema";
import { ExternalLinkIcon } from "lucide-react";

// Define Value type locally since it's not exported from the package
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any[];

interface SponsorshipPreviewProps {
  sponsorAd: Pick<SponsorAd, "sponsorName" | "copy" | "ctaText" | "ctaUrl">;
}

const SponsorshipPreview: React.FC<SponsorshipPreviewProps> = ({
  sponsorAd,
}) => {
  return (
    <div className="mx-auto mt-8 w-full max-w-2xl space-y-6 border-t border-gray-200 py-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-green-800">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Published Sponsorship Ad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Sponsor</h4>
            <p className="text-lg font-semibold text-gray-900">{sponsorAd.sponsorName}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Promotional Copy</h4>
            <div className="rounded-md border border-gray-200 bg-white p-3">
              <SponsorCopyRenderer value={sponsorAd.copy as Value} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Call to Action</h4>
              <p className="text-gray-900">{sponsorAd.ctaText}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Target URL</h4>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-auto p-2 text-left justify-start"
              >
                <a
                  href={sponsorAd.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 truncate"
                >
                  <span className="truncate max-w-[200px]">{sponsorAd.ctaUrl}</span>
                  <ExternalLinkIcon className="h-3 w-3 flex-shrink-0" />
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-xs text-gray-600">
              This sponsorship is currently live on your published survey. Changes to sponsorship details are not supported once published.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorshipPreview;