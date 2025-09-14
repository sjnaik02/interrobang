# Fix: Sponsor Ad Data Persistence for Unpublished Surveys

## Problem
When users create sponsor ad data in unpublished surveys, navigate away, and return, the ad data disappears. This happens because sponsor ads are only created/loaded for published surveys.

## Root Cause
- Sponsor ads only created when survey is published (`handlePublishWithSponsor`)
- Page loader only loads sponsor ads if `survey.isPublished` is true
- Draft sponsorship data is collected but never persisted

## Solution
Allow creating and persisting sponsor ads for unpublished surveys as draft content.

## Required Changes

### 1. Update Page Loader
**File**: `src/app/survey/create/[id]/page.tsx:14-16`

```typescript
// Remove isPublished condition
const sponsorAd = survey.sponsorAdId
  ? await getSponsorAdBySurveyId(survey.id)
  : null;
```

### 2. Add Create/Update Function
**File**: `src/app/actions/sponsorAd.ts`

Add `createOrUpdateSponsorAdForSurvey` function that:
- Updates existing sponsor ad if `survey.sponsorAdId` exists
- Creates new sponsor ad and links to survey if none exists

### 3. Update Save Handler
**File**: `src/components/SurveyBuilder.tsx:92-136`

Modify `handleSave` to call `createOrUpdateSponsorAdForSurvey` when `sponsorshipState.enableSponsorship` is true.

### 4. Initialize Sponsorship State
**File**: `src/components/SurveyBuilder.tsx:55-68`

In the initialization useEffect, populate sponsorship state with `existingSponsorAd` data if present.

### 5. Update Publish Flow
**File**: `src/components/SurveyBuilder.tsx:160-173`

Update `handlePublishWithSponsor` to use the same create/update function.

## Result
- Sponsor ad data persists across navigation for unpublished surveys
- Maintains existing publish behavior
- No database schema changes needed