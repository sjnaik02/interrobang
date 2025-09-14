# Plan: Add Sponsorship Preview Button

## Overview
Add a "Preview Sponsorship" button to the SponsorshipSection component that allows users to see how their sponsorship ad will look before publishing.

## Implementation Steps

### 1. Add Preview State Management
- Add a `showPreview` state to the SurveyBuilder component
- Add functions to toggle the preview on/off

### 2. Update SponsorshipSection Component
- Add a "Preview Sponsorship" button next to the Enable switch
- Button should be enabled only when:
  - Sponsorship is enabled
  - Required fields are filled (sponsorName, ctaText, ctaUrl)
- Pass the preview toggle function as a prop

### 3. Create Preview Modal/Section
- Option A: Create a modal dialog showing the sponsorship preview
- Option B: Show/hide the preview inline below the form
- Use the existing `SponsorshipPreview` component but adapt it for draft content
- Show it with a different styling (e.g., "Draft Preview" instead of "Published")

### 4. Integrate with SurveyBuilder
- Pass sponsorship state data to the preview component
- Ensure preview updates when sponsorship form data changes
- Add preview toggle functionality to the builder interface

### 5. Style and UX Improvements
- Use appropriate button styling (secondary/outline variant)
- Add loading states if needed
- Ensure responsive design
- Add close button for modal or collapse functionality

## Technical Notes
- Reuse existing `SponsorshipPreview` component with minor modifications
- Convert sponsorship state data to the format expected by the preview component
- Ensure preview works for both published and unpublished surveys
- Consider validation to prevent preview with incomplete data