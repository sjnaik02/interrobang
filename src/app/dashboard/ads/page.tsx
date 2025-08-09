"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";

interface AdData {
  surveyId: string;
  title: string;
  sponsorName: string;
  impressions: number;
  clicks: number;
  ctaUrl: string;
}

interface SponsorGroupData {
  sponsorName: string;
  totalImpressions: number;
  totalClicks: number;
  surveyCount: number;
  surveys: AdData[];
}

export default function AdsPage() {
  const [adsData, setAdsData] = useState<AdData[]>([]);
  const [viewMode, setViewMode] = useState<"survey" | "sponsor">("survey");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/ads-data");
        const data = (await response.json()) as AdData[];
        setAdsData(data);
      } catch (error) {
        console.error("Failed to fetch ads data:", error);
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="mb-6 text-3xl font-medium tracking-tight">
          Ads Dashboard
        </h1>
        <p>Loading...</p>
      </main>
    );
  }

  const latest = adsData[0];

  // Group ads by sponsor
  const groupedBySponsor = adsData.reduce((acc, ad) => {
    const existing = acc.find((group) => group.sponsorName === ad.sponsorName);
    if (existing) {
      existing.totalImpressions += Number(ad.impressions);
      existing.totalClicks += Number(ad.clicks);
      existing.surveyCount += 1;
      existing.surveys.push(ad);
    } else {
      acc.push({
        sponsorName: ad.sponsorName,
        totalImpressions: Number(ad.impressions),
        totalClicks: Number(ad.clicks),
        surveyCount: 1,
        surveys: [ad],
      });
    }
    return acc;
  }, [] as SponsorGroupData[]);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-medium tracking-tight">Ads Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "survey" ? "default" : "outline"}
            onClick={() => setViewMode("survey")}
          >
            By Survey
          </Button>
          <Button
            variant={viewMode === "sponsor" ? "default" : "outline"}
            onClick={() => setViewMode("sponsor")}
          >
            By Sponsor
          </Button>
        </div>
      </div>

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
        <h2 className="mb-4 text-2xl">
          {viewMode === "survey" ? "All Sponsored Surveys" : "Stats by Sponsor"}
        </h2>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {viewMode === "survey" ? (
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
                  {adsData.length > 0 ? (
                    adsData.map((ad) => (
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
                        <TableCell className="text-right">
                          {ad.clicks}
                        </TableCell>
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
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">Sponsor Name</TableHead>
                    <TableHead className="text-right">Surveys</TableHead>
                    <TableHead className="text-right">
                      Total Impressions
                    </TableHead>
                    <TableHead className="text-right">Total Clicks</TableHead>
                    <TableHead className="text-right">Average CTR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedBySponsor.length > 0 ? (
                    groupedBySponsor.map((sponsor) => (
                      <TableRow key={sponsor.sponsorName}>
                        <TableCell className="font-medium">
                          {sponsor.sponsorName}
                        </TableCell>
                        <TableCell className="text-right">
                          {sponsor.surveyCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {sponsor.totalImpressions}
                        </TableCell>
                        <TableCell className="text-right">
                          {sponsor.totalClicks}
                        </TableCell>
                        <TableCell className="text-right">
                          {sponsor.totalImpressions > 0
                            ? (
                                (sponsor.totalClicks /
                                  sponsor.totalImpressions) *
                                100
                              ).toFixed(2) + "%"
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
                        No sponsors found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
