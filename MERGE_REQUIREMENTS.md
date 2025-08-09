# Merge Requirements for Sponsor Ads Feature

## 🚨 Critical Issues - Must Fix Before Merge

### 1. TypeScript Build Errors
**File:** `src/app/dashboard/ads/page.tsx`
**Lines:** 43-51

```typescript
// Current broken code:
const data = await response.json(); // 'any' type
setAdsData(data); // unsafe assignment
fetchData(); // missing await

// Fix required:
const data = await response.json() as AdData[];
setAdsData(data);
void fetchData(); // or await fetchData()
```

### 2. Database Migration Required
**Before deploy, run:**
```bash
npm run db:push
```

**New tables being added:**
- `sponsorAds` - Main sponsor ad data
- `sponsorAdEvents` - Impression/click tracking
- `surveys.sponsorAdId` - Foreign key reference

## ⚠️ Major Dependency Conflicts

### Current Version Mismatch
| Package | Main Branch | Feature Branch | Impact |
|---------|-------------|----------------|---------|
| Next.js | 14.2.4 | 15.3.2 | Breaking changes |
| React | 18.3.1 | 19.1.0 | Breaking changes |
| Clerk | 5.7.3 | 6.19.3 | Auth API changes |
| Tailwind | 3.4.3 | 4.1.6 | Config format changed |

### Resolution Options

#### Option A: Separate Dependency Upgrade (Recommended)
1. Create separate branch for framework upgrades
2. Revert feature branch to main's dependency versions
3. Merge ads feature first, then upgrade dependencies

#### Option B: Full Integration
1. Test all existing components with new versions
2. Update main branch dependencies to match
3. Create Tailwind v4 configuration

## 🔧 Configuration Issues

### Missing Tailwind Configuration
**Problem:** `tailwind.config.ts` deleted but no v4 config created
**Fix:** Either:
- Restore v3 config: `git checkout main -- tailwind.config.ts`
- Or create proper v4 config in `postcss.config.cjs`

### PostCSS Configuration
Current v4 config may be incomplete:
```javascript
// postcss.config.cjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

## 🛡️ Security Considerations

### New API Endpoints Need Review
- `/api/sponsor-ad` - Input validation required
- `/api/sponsor-event` - Consider rate limiting
- `/api/ads-data` - Verify access controls

### Event Logging Cleanup
No retention policy for `sponsorAdEvents` table - consider adding cleanup job.

## 📋 Pre-Merge Checklist

### Required Fixes
- [ ] Fix TypeScript errors in ads dashboard
- [ ] Run database migration
- [ ] Resolve dependency version conflicts
- [ ] Fix/create Tailwind configuration

### Testing Required
- [ ] Existing surveys still work
- [ ] User authentication still works
- [ ] All existing pages render correctly
- [ ] New ads feature functions properly

### Performance/Security
- [ ] Add rate limiting to event logging API
- [ ] Add input validation to sponsor ad creation
- [ ] Consider ads data retention policy

## 🚀 Deployment Steps

1. **Pre-deployment:**
   ```bash
   npm install
   npm run build  # Must pass
   npm run lint   # Must pass
   ```

2. **Database migration:**
   ```bash
   npm run db:push
   ```

3. **Verify functionality:**
   - Test existing surveys
   - Test new ads dashboard
   - Verify auth flows

## 📊 Impact Assessment

### Breaking Changes
- Framework upgrades affect entire application
- Tailwind config changes affect all styling
- Database schema changes require migration

### New Features Added
- Sponsor ad creation and management
- Event tracking (impressions/clicks)
- Ads analytics dashboard
- Rich text editor for ad copy

**Recommendation:** Fix critical TypeScript errors first, then decide on dependency upgrade strategy.