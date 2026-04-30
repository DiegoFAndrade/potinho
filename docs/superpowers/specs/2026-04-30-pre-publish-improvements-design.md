# Potinho - Pre-Publish Improvements Design

## Overview

Four improvements to prepare Potinho for Google Play publication and revenue generation.

---

## 1. Firebase Analytics

**Goal:** Replace the TODO in `analyticsService.ts` with real Firebase Analytics.

**Dependencies:** `@react-native-firebase/app`, `@react-native-firebase/analytics`

**Setup:**
- Create Firebase project and download `google-services.json`
- Add Firebase Expo plugin to `app.json`
- Update `analyticsService.ts`: call `analytics().logEvent(event, params)` in production, keep `console.log` in `__DEV__`

**Events (already defined, no changes):** `FIRST_SESSION`, `ONBOARDING_COMPLETED`, `TASK_ADDED`, `DRAW_STARTED`, `DRAW_ACCEPTED`, `TASK_COMPLETED`, `TASK_SKIPPED`, `MILESTONE_REACHED`, `PAYWALL_OPENED`, `PURCHASE_ATTEMPTED`, `PURCHASE_COMPLETED`, `PURCHASE_FAILED`, `PURCHASE_RESTORED`, `AD_BANNER_SHOWN`, `INTERSTITIAL_SHOWN`

**Files changed:** `analyticsService.ts`, `app.json`, `package.json`

---

## 2. Theme System via CSS Variables

**Goal:** Make the theme switcher actually work by replacing hardcoded colors with CSS variables consumed via Tailwind tokens.

**Approach:** CSS variables in `global.css` + Tailwind semantic tokens + theme class on root view.

**Semantic tokens:**

| Token | Usage | Default value |
|---|---|---|
| `surface` | Main background | `#F8EFD9` |
| `surface-hi` | Card backgrounds | `#FFFBEF` |
| `ink` | Primary text | `#231208` |
| `ink-soft` | Secondary text | `#4A2E1E` |
| `brand` | CTA, highlights | `#E8503D` |
| `brand-dark` | Brand pressed state | `#B8321E` |
| `sage` | Streak, success | `#89A47C` |
| `muted` | Disabled text | `#8A7868` |
| `accent` | Decorative details | `#D9A520` |
| `jar` | Pot color | `#E8D5B7` |

**Theme overrides (CSS classes on root):**
- `.theme-pastel-blue`: brand `#8AB4D8`, brand-dark `#5E8CB3`
- `.theme-pastel-pink`: brand `#E8A6B6`, brand-dark `#C77A8D`
- `.theme-pastel-green`: brand `#9FC9A3`, brand-dark `#6FA075`
- `.theme-dark`: surface `#2B231C`, surface-hi `#3B2F26`, ink `#FFF8EF`, muted `#A89680`

**Implementation:**
1. Define CSS variables in `global.css` (`:root` + theme classes)
2. Update `tailwind.config.js` to use `var(--color-*)` tokens
3. Replace hardcoded hex values in all components/screens with Tailwind classes
4. Apply theme class on root view in `_layout.tsx` based on `appStore.theme`
5. Remove `src/theme/colors.ts`

**Files changed:** `global.css`, `tailwind.config.js`, all components (~6), all screens (~8), `_layout.tsx`. Remove `src/theme/colors.ts`.

---

## 3. i18n (Portuguese + English)

**Goal:** Detect device language automatically, serve PT or EN, fallback to PT.

**Dependencies:** `expo-localization`, `i18next`, `react-i18next`

**Structure:**
```
src/locales/
  pt.json     -- Portuguese (base language)
  en.json     -- English
  index.ts    -- i18next configuration
```

**Configuration (`src/locales/index.ts`):**
- Detect device locale via `expo-localization`
- Initialize i18next with `pt` and `en` resources
- Fallback language: `pt`

**Key namespace structure:**
- `home.*` -- Home screen strings
- `settings.*` -- Settings screen strings
- `onboarding.*` -- Onboarding screen strings
- `tasks.*` -- Task list screen strings
- `paywall.*` -- Paywall screen strings
- `stats.*` -- Stats screen strings
- `common.*` -- Shared strings (buttons, labels)

**Pluralization:** Use i18next `_one`/`_other` suffixes (e.g., `taskCount_one`, `taskCount_other`).

**What is NOT translated:** User content (task names, jar names).

**No language selector in settings** -- follows device language automatically.

**Initialization:** Import `src/locales` in `_layout.tsx` before any render.

**Files changed:** new `src/locales/` directory, `_layout.tsx`, all screens (~8), `package.json`

---

## 4. Data Export/Import

**Goal:** Let users backup and restore their data via JSON file.

**Dependencies:** `expo-file-system`, `expo-sharing`, `expo-document-picker`

**Export format (`potinho-backup.json`):**
```json
{
  "version": 1,
  "exportedAt": "ISO-8601 timestamp",
  "app": {
    "streak": { "count": 0, "lastDrawDate": "" },
    "soundEnabled": true,
    "hapticsEnabled": true,
    "theme": "default"
  },
  "jars": [],
  "tasks": []
}
```

**Excluded from export:** `isPremium` (comes from IAP restore), `lastDrawId`, `lastDrawAccepted`, `drawsSinceLastInterstitial`, `onboardingDone` (session state).

**Export flow:**
1. User taps "Export data" in Settings
2. `backupService.exportData()` reads all 3 stores, writes temp JSON via `expo-file-system`
3. Opens native share sheet via `expo-sharing`

**Import flow:**
1. User taps "Import data" in Settings
2. `expo-document-picker` opens, filtered to `.json`
3. App reads and validates file (checks `version`, structure)
4. Alert confirmation: "This will replace all your data. Continue?"
5. If confirmed, overwrites app/jar/task stores

**New service:** `src/services/backupService.ts` with `exportData()` and `importData(uri: string)`

**Validation:** Check that `version` field exists and equals 1, that `jars` and `tasks` are arrays.

**Files changed:** new `src/services/backupService.ts`, `settings.tsx` (2 new rows), `package.json`
