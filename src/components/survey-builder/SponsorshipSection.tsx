/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { type SponsorshipState } from "../hooks/useSponsorshipState";
import { SponsorCopyEditor } from "../editor/SponsorCopyEditor";

interface SponsorshipSectionProps {
  sponsorshipState: SponsorshipState;
}

const SponsorshipSection: React.FC<SponsorshipSectionProps> = ({
  sponsorshipState,
}) => {
  const {
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
  } = sponsorshipState;

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl space-y-6 border-t border-gray-200 py-6">
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Sponsorship Ad (Optional)
          </h3>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="enable-sponsorship"
              className="text-sm text-gray-600"
            >
              Enable
            </Label>
            <Switch
              id="enable-sponsorship"
              checked={enableSponsorship}
              onCheckedChange={setEnableSponsorship}
            />
          </div>
        </div>

        {enableSponsorship && (
          <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
            <div>
              <Label
                htmlFor="sponsor-name"
                className="block text-sm font-medium text-gray-600"
              >
                Sponsor Name
              </Label>
              <Input
                id="sponsor-name"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                className="mt-1 w-full"
                placeholder="e.g., Acme Corp"
              />
            </div>
            <div>
              <Label
                htmlFor="sponsor-copy"
                className="block text-sm font-medium text-gray-600"
              >
                Promotional Copy
              </Label>
              <div className="mt-1">
                <SponsorCopyEditor
                  value={sponsorCopy}
                  onChange={setSponsorCopy}
                  placeholder="Briefly describe the sponsor or their offer."
                  maxLength={256}
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="cta-text"
                className="block text-sm font-medium text-gray-600"
              >
                Call to Action Text
              </Label>
              <Input
                id="cta-text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="mt-1 w-full"
                placeholder="e.g., Learn More, Visit Website"
              />
            </div>
            <div>
              <Label
                htmlFor="cta-url"
                className="block text-sm font-medium text-gray-600"
              >
                Call to Action URL
              </Label>
              <Input
                id="cta-url"
                type="url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className="mt-1 w-full"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )}
        {!enableSponsorship && (
          <p className="mt-4 text-sm text-gray-500">
            Enable this to configure and attach a sponsor advertisement to your
            survey when it&apos;s published.
          </p>
        )}
      </div>
    </div>
  );
};

export default SponsorshipSection;
