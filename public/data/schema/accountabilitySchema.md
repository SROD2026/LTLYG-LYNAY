# accountabilityschema.md

## PROJECT SUMMARY

Name: Accountable vs Violent  
Type: React application  
Architecture: React UI with mixed data sources:
- modular JSON in `/public/data/...`
- source-driven datasets in `src/data/...`
- shared reusable UI primitives and modal flows

Primary flows:
- nonviolent grid
- violent grid
- gratitude / positive check-in
- communication sins
- needs + theology reference
- emotional prayer grid
- logging
- purpose launcher

Primary hook:
- `src/hooks/useAppData.js`

Primary modals:
- `src/components/emotion/EmotionModal.jsx`
- `src/components/checkin/PositiveCheckInModal.jsx`
- `src/components/prayer/PrayerModal.jsx`
- `src/components/needs/NeedModal.jsx`

Primary shared grid:
- `src/components/grid/EmotionGrid.jsx`

---

## CURRENT ARCHITECTURE SNAPSHOT

- Entry point: `src/main.jsx` renders `App` and loads `src/index.css`.
- Router model: `src/App.jsx` uses hash routing:
  - `#/`
  - `#/grid`
  - `#/violent`
  - `#/checkin`
  - `#/needs`
  - `#/prayer`
  - `#/log`
  - `#/communication-sins`
- Home / launcher route: `src/pages/PurposePage.jsx`
- Nonviolent route: page inside `App.jsx` using `EmotionGrid.jsx` + `EmotionModal.jsx`
- Violent route: `src/pages/ViolentPage.jsx` using `EmotionGrid.jsx` + `EmotionModal.jsx`
- Positive check-in route: `src/pages/CheckInPage.jsx` using `EmotionGrid.jsx` + `PositiveCheckInModal.jsx`
- Needs reference route: `src/pages/NeedsPage.jsx` using `src/components/needs/NeedModal.jsx`
- Emotional prayer route: `src/pages/PrayerPage.jsx` using `EmotionGrid.jsx` + `PrayerModal.jsx`
- Log route: `src/pages/LogPage.jsx`
- Communication education route: `src/pages/CommunicationSinPage.jsx`
- Shared nav/header UI:
  - `src/components/layout/Header.jsx`
  - `src/components/layout/TopNav.jsx`
- Shared UI atoms live under:
  - `src/components/ui/`

---

## CURRENT INTERACTION / UI NOTES

### EmotionGrid
`src/components/grid/EmotionGrid.jsx` is now doing more than static rendering:
- responsive tile sizing
- fit-to-width scaling
- touch-aware behavior
- zoom / pan support via `react-zoom-pan-pinch`
- desktop wheel zoom testing support was enabled during this session
- current UX state is intentionally simple:
  - grid fits on initial load
  - pinch zoom works
  - panning works
  - outer-edge emotions remain directly tappable
- the previous “tap twice / armed” behavior was discussed and partially targeted for removal, but current preferred direction is to keep the present direct-tap behavior unless there is a strong reason to revisit it

### Modal behavior
Recent modal cleanup direction:
- make all modals feel more like the prayer modal / grid modals
- avoid inner scrollbars where possible
- allow backdrop-click close
- support Escape-key close globally
- increase mobile tap-out gutters
- reduce iPhone lag by avoiding full-page zoom and reducing expensive blur on mobile

### iPhone / mobile performance
Recent direction:
- disable whole-page pinch zoom through viewport meta
- let the grid become the zoom surface instead of Safari page zoom
- remove / reduce mobile backdrop blur
- continue tuning for:
  - modal lag
  - font legibility
  - tap accuracy
  - mobile spacing
  - mobile header wrapping

---

## DATA SOURCE PATTERN

This app is mixed-source, not purely public-JSON-driven.

### Public modular JSON still in active use
Examples:
- `/data/accountability/communicationSins.json`
- `/data/content/purposeDropdown.json`
- `/data/grids/...`
- `/data/meta/...`

### Source-driven data currently in active use
Examples:
- `src/data/prayerGridData.js`
- `src/data/needsDetails.js`
- `src/data/needsPageContent.json`

### Important note
Do not assume all behavior lives in `/public/data/...`.
This project currently mixes:
- fetched public JSON
- imported JS datasets
- inline constants in React files

Before changing behavior, determine whether it is:
- source-code driven
- public-data driven
- or mixed

---

## SPECIAL ARCHITECTURE NOTES

### 1) Communication sins page
`src/pages/CommunicationSinPage.jsx` is highly data-sensitive.
It depends on `/data/accountability/communicationSins.json`.

Recent changes introduced richer sections such as:
- empathy / unseen impact
- repair steps
- reflection questions
- request-flow needs
- conversation application
- theological foundations panel

Important schema caveat:
- some UI sections were temporarily out of sync with JSON key shapes
- especially:
  - `conversation_application`
  - `empathy_visibility`
- before editing this page again, verify the exact shape of the runtime JSON

### 2) Needs page
Needs page is mid-polish but functional.
Key files:
- `src/pages/NeedsPage.jsx`
- `src/components/needs/NeedModal.jsx`
- `src/data/needsDetails.js`
- `src/data/needsPageContent.json`

Current direction:
- preserve the prayer-style modal behavior
- continue mobile spacing cleanup
- continue content refinement

### 3) Accountability / master protocols layer
There is still a legacy / compatibility layer around master protocol loading.
Important files:
- `src/utils/data.js`
- `src/utils/validateMaster.js`
- `src/components/emotion/AccountabilityBlock.jsx`

`data.js` still references legacy loader paths like `/NNM.json`, `/VIOLENT1.json`, `/emotion_meta.json`, `/NEEDS_SUPPLEMENT.json`, and `MASTER_PROTOCOLS.json`, while other parts of the app conceptually reference `/public/data/...`. Inspect actual runtime imports and fetches before refactoring anything here.

### 4) Request-flow support files
There are request-flow data files in the working set:
- `requestFlows.js`
These may become relevant if future work connects communication sins / needs / suggested requests more tightly.

---

## AI HANDOFF HEADER — READ FIRST

This project often uses a **partial uploaded working set**, not always the full repo.

Before making edits, future chats should:
1. Read this file first.
2. Inspect the uploaded source files already available in the project.
3. Check whether the requested task also depends on non-uploaded files.
4. Pull in any missing dependencies from the repo paths listed below before rewriting code.
5. Treat this app as mixed-source and data-driven.

## Important rule
Do not assume the currently uploaded files are the whole app.

---

## WHERE TO LOOK FOR ADDITIONAL FILES

### Additional source files that may need to be pulled
- `src/utils/exportHelpers.js`
- `src/utils/exportZip.js`
- `src/utils/masterSelectors.js`
- `src/utils/validateMaster.js`
- `src/utils/prayerColor.js`
- `src/utils/checkinColor.js`
- `src/utils/color.js`
- `src/utils/pageThemes.js`
- `src/utils/data.js`
- `src/data/prayerGridData.js`
- `src/data/needsDetails.js`
- `src/data/needsPageContent.json`
- `src/components/emotion/AccountabilityBlock.jsx`
- `src/components/checkin/GratitudeFlowBlock.jsx`
- `src/components/purpose/PurposeDropdown.jsx`
- `src/components/prayer/PrayerModal.jsx`
- `src/components/needs/NeedModal.jsx`
- `src/components/grid/EmotionGrid.jsx`
- `src/components/ui/ScriptureRotator.jsx`
- `src/index.css`

### Public data files that may drive behavior
- `/data/grids/nnmGrid.json`
- `/data/grids/violentGrid.json`
- `/data/grids/checkinGrid.json`
- `/data/meta/emotionMeta.json`
- `/data/meta/checkinMeta.json`
- `/data/meta/needsSupplement.json`
- `/data/meta/violentCauseMap.json`
- `/data/accountability/violations.json`
- `/data/accountability/protocols.json`
- `/data/accountability/promises.json`
- `/data/accountability/theology.json`
- `/data/accountability/communicationSins.json`
- `/data/content/purposeDropdown.json`

### Legacy / compatibility paths still worth checking
- `/NNM.json`
- `/VIOLENT1.json`
- `/VIOLENT2.json`
- `/emotion_meta.json`
- `/NEEDS_SUPPLEMENT.json`
- `/MASTER_PROTOCOLS.json`

---

## HOW TO THINK ABOUT THIS PROJECT

- `App.jsx` handles routing and page selection.
- `useAppData.js` assembles runtime data for the main app flow.
- Pages pass data into modals and shared components.
- `EmotionModal.jsx`, `PositiveCheckInModal.jsx`, `PrayerModal.jsx`, and `NeedModal.jsx` each own substantial interaction logic.
- `EmotionGrid.jsx` is now a key performance-sensitive component because it handles layout + interaction + zoom.
- App behavior may depend on both React files and data files.

## BEFORE EDITING

Check imports first.  
Check fetched JSON paths second.  
Then decide whether the task is:
- source-code driven
- data-driven
- mixed
- or performance / CSS driven

---

# HANDOFF REQUIREMENTS

Before ending a work session, future chats should do all of the following:

## 1) Update this schema file
Revise this file so it reflects:
- newly added files
- removed files
- renamed files
- changed data paths
- changed routing
- changed component ownership
- newly required dependencies for future work
- major interaction changes (especially modals and EmotionGrid)

## 2) Create a handoff summary
The handoff should include:
- what was completed
- what is partially completed
- what should be worked on next
- what files were changed
- what files still need to be pulled from the repo if the next task depends on them

## 3) Create a file update list before handoff
List every file that was changed in the session and every related file that still needs updating for consistency.

Use this format:

### Files updated this session
- `...`

### Files likely needing follow-up update
- `...`

### Public JSON/data files needing sync
- `...`

### Schema file updated?
- yes / no

### Handoff complete?
- yes / no

---

# PRE-HANDOFF FILE CHECKLIST

## Core app / routing
- `src/App.jsx`
- `src/main.jsx`
- `src/App.css`
- `src/index.css`

## Pages
- `src/pages/PurposePage.jsx`
- `src/pages/ViolentPage.jsx`
- `src/pages/CheckInPage.jsx`
- `src/pages/LogPage.jsx`
- `src/pages/CommunicationSinPage.jsx`
- `src/pages/NeedsPage.jsx`
- `src/pages/PrayerPage.jsx`

## Core components
- `src/components/emotion/EmotionModal.jsx`
- `src/components/emotion/AccountabilityBlock.jsx`
- `src/components/grid/EmotionGrid.jsx`
- `src/components/checkin/PositiveCheckInModal.jsx`
- `src/components/checkin/GratitudeFlowBlock.jsx`
- `src/components/prayer/PrayerModal.jsx`
- `src/components/needs/NeedModal.jsx`
- `src/components/interoception/InteroStickFigure.jsx`
- `src/components/layout/Header.jsx`
- `src/components/layout/TopNav.jsx`
- `src/components/purpose/PurposeDropdown.jsx`

## UI primitives
- `src/components/ui/Panel.jsx`
- `src/components/ui/Select.jsx`
- `src/components/ui/Chips.jsx`
- `src/components/ui/GridBoard.jsx`
- `src/components/ui/SegmentedTabs.jsx`
- `src/components/ui/ScriptureRotator.jsx`

## Hooks / utils
- `src/hooks/useAppData.js`
- `src/utils/color.js`
- `src/utils/checkinColor.js`
- `src/utils/pageThemes.js`
- `src/utils/data.js`
- `src/utils/exportHelpers.js`
- `src/utils/exportZip.js`
- `src/utils/masterSelectors.js`
- `src/utils/validateMaster.js`
- `src/utils/prayerColor.js`
- `src/data/prayerGridData.js`
- `src/data/needsDetails.js`
- `src/data/needsPageContent.json`

## Public JSON / content
- `/data/grids/nnmGrid.json`
- `/data/grids/violentGrid.json`
- `/data/grids/checkinGrid.json`
- `/data/meta/emotionMeta.json`
- `/data/meta/checkinMeta.json`
- `/data/meta/needsSupplement.json`
- `/data/meta/violentCauseMap.json`
- `/data/accountability/violations.json`
- `/data/accountability/protocols.json`
- `/data/accountability/promises.json`
- `/data/accountability/theology.json`
- `/data/accountability/communicationSins.json`
- `/data/content/purposeDropdown.json`

## Project documentation
- `accountabilityschema.md`

---

# SESSION UPDATE — 2026-03-12

Completed in this session:
- Continued mobile-first cleanup across multiple pages.
- Confirmed and preserved the current direct-tap interaction model on the zoomed emotion grids.
- Added / tested grid-only zoom direction in `EmotionGrid.jsx` using `react-zoom-pan-pinch`.
- Updated mobile viewport strategy to stop whole-page zoom and shift toward grid-surface zoom.
- Reduced modal lag direction by removing mobile backdrop blur in CSS.
- Improved communication sins page structure and data alignment direction, especially around richer section content.
- Confirmed needs modal should behave like the prayer/grid modals rather than using an internal scrollbar.
- Continued work on global modal-close consistency, including Escape-key direction and modal class/header consistency.
- Added / maintained needs data files and needs modal flow as active parts of the project.

Partially completed:
- `EmotionGrid.jsx` zoom / pan behavior is improved and promising, but still needs careful cleanup / validation before calling it final.
- Communication sins rich sections were being aligned with runtime JSON, but this area is still easy to break if the JSON shape changes.
- Mobile typography and compact spacing still need another pass.

What should be worked on next:
1. Tune phone UI on narrow widths.
2. Check for any remaining lag on iPhone.
3. Clean up fonts and text sizing across pages and modals.
4. Add / refine more emotions and text content.
5. Continue trimming and polishing JSON content.
6. Re-check communication sins sections against the real runtime JSON after any content edits.
7. Keep `EmotionGrid.jsx` stable; avoid overcomplicating the zoom interaction unless a clear mobile problem remains.

### Files updated this session
- `src/components/grid/EmotionGrid.jsx`
- `src/index.css`
- `src/pages/CommunicationSinPage.jsx`
- `public/data/accountability/communicationSins.json`
- `src/components/needs/NeedModal.jsx`
- `index.html`
- likely related mobile UI files already in active rotation:
  - `src/pages/NeedsPage.jsx`
  - `src/pages/PrayerPage.jsx`
  - `src/pages/CheckInPage.jsx`
  - `src/pages/PurposePage.jsx`

### Files likely needing follow-up update
- `src/components/grid/EmotionGrid.jsx`
- `src/index.css`
- `src/pages/CommunicationSinPage.jsx`
- `public/data/accountability/communicationSins.json`
- `src/components/needs/NeedModal.jsx`
- `src/components/prayer/PrayerModal.jsx`
- `src/components/emotion/EmotionModal.jsx`
- `src/components/checkin/PositiveCheckInModal.jsx`

### Public JSON/data files needing sync
- `/data/accountability/communicationSins.json`
- any grid/meta JSON if new emotions are added next
- `src/data/prayerGridData.js` if prayer emotions are expanded from source-driven data
