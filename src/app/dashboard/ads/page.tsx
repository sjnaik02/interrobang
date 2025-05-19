import React from "react";
import { db } from "@/server/db";
import { surveys } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import {
  getSponsorAdBySurveyId,
  getSponsorAdImpressions,
  getSponsorAdClicks,
} from "@/server/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLinkIcon } from "lucide-react";

export default async function AdsPage() {
  // Fetch recent surveys with sponsorAdId
  const rows = await db
    .select({
      id: surveys.id,
      title: surveys.title,
      sponsorAdId: surveys.sponsorAdId,
      createdAt: surveys.createdAt,
    })
    .from(surveys)
    .orderBy(desc(surveys.createdAt))
    .limit(100);
  const sponsoredRows = rows.filter((r) => r.sponsorAdId !== null);

  const adsData = await Promise.all(
    sponsoredRows.map(async (row) => {
      const ad = await getSponsorAdBySurveyId(row.id);
      if (!ad) return null;
      const impressions = await getSponsorAdImpressions(ad.id);
      const clicks = await getSponsorAdClicks(ad.id);
      return {
        surveyId: row.id,
        title: row.title,
        sponsorName: ad.sponsorName,
        impressions,
        clicks,
        ctaUrl: ad.ctaUrl,
      };
    }),
  );

  const validAds = adsData.filter((x): x is NonNullable<typeof x> => !!x);
  const latest = validAds[0]; // latest is the first

  // All ads including the latest one for the table view
  const allAdsForTable = validAds;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-medium tracking-tight">
        Ads Dashboard
      </h1>

      {latest && (
        <section className="mb-8">
          <h2 className="mb-2 text-2xl">Latest Sponsored Survey</h2>
          <Link
            href={`/survey/${latest.surveyId}`}
            className="group mb-1 block text-xl font-semibold text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {latest.title}
            <ExternalLinkIcon className="mb-1 ml-1.5 inline-block h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <p className="text-muted-foreground mb-6 text-sm">
            Sponsored by {latest.sponsorName}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-base font-medium">
                  Impressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{latest.impressions}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-base font-medium">
                  Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{latest.clicks}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-base font-medium">
                  CTR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {latest.impressions > 0
                    ? ((latest.clicks / latest.impressions) * 100).toFixed(2) +
                      "%"
                    : "0.00%"}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-2xl">All Sponsored Surveys</h2>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Survey Title</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAdsForTable.length > 0 ? (
                  allAdsForTable.map((ad) => (
                    <TableRow key={ad.surveyId}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/survey/${ad.surveyId}`}
                          className="group text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ad.title}
                          <ExternalLinkIcon className="mb-1 ml-1.5 inline-block h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </TableCell>
                      <TableCell>{ad.sponsorName}</TableCell>
                      <TableCell className="text-right">
                        {ad.impressions}
                      </TableCell>
                      <TableCell className="text-right">{ad.clicks}</TableCell>
                      <TableCell className="text-right">
                        {ad.impressions > 0
                          ? ((ad.clicks / ad.impressions) * 100).toFixed(2) +
                            "%"
                          : "0.00%"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground text-center"
                    >
                      No sponsored surveys found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
