## MVP Flow

### 1. Survey Creator (Interrobang User) Experience

1. **Open Survey Builder**  
   You proceed through your normal question-and-answer setup.

2. **Enable Sponsorship**

   - At the bottom of the builder sidebar (or footer), toggle **“Enable Sponsorship”** on.
   - When off, nothing changes; when on, the next fields appear.

3. **Enter Sponsor Details**

   - **Sponsor Name** (single-line text)
   - **Copy** (plaintext textarea, up to ~200 characters)
   - **CTA Text** (e.g. “Learn More”) & **CTA URL** (full link)

4. **Save & Publish**

   - Saving or publishing does two things in a single transaction:
     1. Creates a new **Sponsor Ad** record.
     2. Updates the survey’s `sponsor_ad_id` to point at that new ad.
   - Your dashboard list now shows a “Sponsored ✔” badge next to that survey.

5. **Preview Thank-You**
   - Click **“Preview Thank-You”** to verify copy, button, and link behavior.
   - Close the preview and publish when you’re satisfied.

---

### 2. Survey Respondent Experience

1. **Complete the Survey**  
   The respondent answers all questions and clicks **Submit**.

2. **Thank-You Page with Sponsor**  
   Renders:

   > “This survey was brought to you by **[Sponsor Name]**”  
   > **[Copy]** > **[CTA Text button]** → navigates to the provided URL

3. **Event Tracking (Behind the Scenes)**
   - **On render** of the thank-you page → log an `impression` event.
   - **On CTA click** → log a `click` event and redirect the user.

---

### 3. Explicit Next Steps

1. **Data Model & Schema**

   - **Surveys**
     - Add a nullable field `sponsor_ad_id` referencing `SponsorAds.id`.
   - **SponsorAds**
     - Fields: `id`, `sponsor_name`, `copy`, `cta_text`, `cta_url`, `created_at`.
   - **SponsorAdEvents**
     - Fields: `id`, `sponsor_ad_id` (FK), `event_type` (enum: “impression” or “click”), `timestamp`.

2. **Backend Logic**

   - Extend the survey-save routine to:
     1. Insert into `SponsorAds` when sponsorship data is provided.
     2. Update `Surveys.sponsor_ad_id`.
   - Add endpoints or server actions to record `impression` and `click` events.

3. **Builder UI**

   - Add the **“Enable Sponsorship”** toggle and inline sponsor fields in the survey creator.
   - Implement a **“Preview Thank-You”** modal.

4. **Thank-You Page Update**

   - Join `Surveys` → `SponsorAds` via `sponsor_ad_id`, then render the sponsored message and CTA button.
   - Ensure event-logging calls fire correctly on page render and button click.

5. **Ads Dashboard (basic)**
   - Create an **Ads** page listing recent sponsored surveys as cards, each displaying:
     - Survey title
     - Sponsor name
     - Total responses
     - Total clicks
     - Calculated CTR (clicks ÷ impressions)
   - Below, include a simple list/table for older sponsored surveys.

**NOTE** Ensure you warn users if a survey is sponsored but has empty sponsor name, copy, cta fields, etc. Do not allow publishing if they're empty. Let the user edit the ad even after publishing the survey
