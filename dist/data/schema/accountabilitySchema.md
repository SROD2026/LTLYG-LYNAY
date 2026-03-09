IMPORTANT: Before doing any work, read the file `accountabilityschema.md` in the project. 
It contains the architecture overview, missing file locations, and required handoff update rules.

## PROJECT SUMMARY

Name: Accountable vs Violent  
Type: React application  
Architecture: Data-driven UI with JSON configuration

Primary flows:
- nonviolent grid
- violent grid
- gratitude check-in
- communication sins
- needs + theology reference
- emotional prayer grid
- logging
- purpose launcher

Primary hook:
- src/hooks/useAppData.js

Primary modals:
- EmotionModal.jsx
- PositiveCheckInModal.jsx
- PrayerModal.jsx

Primary grids:
- EmotionGrid.jsx


## CURRENT ARCHITECTURE SNAPSHOT

- Entry point: `src/main.jsx` renders `App` and loads `index.css`.
- Router model: `src/App.jsx` uses hash routing (`#/`, `#/grid`, `#/violent`, `#/checkin`, `#/needs`, `#/prayer`, `#/log`, `#/communication-sins`).
- Home / launcher route: `PurposePage.jsx`.
- Nonviolent grid route: HomePage inside `App.jsx`, using `EmotionGrid.jsx` + `EmotionModal.jsx` in `mode="blameless"`.
- Violent route: `ViolentPage.jsx`, using `EmotionGrid.jsx` + `EmotionModal.jsx` in `mode="violent"`.
- Positive check-in / gratitude route: `CheckInPage.jsx`, using `EmotionGrid.jsx` + `PositiveCheckInModal.jsx`.
- Needs reference route: `NeedsPage.jsx`.
- Emotional prayer route: `PrayerPage.jsx`, using `EmotionGrid.jsx` + `PrayerModal.jsx`.
- Log route: `LogPage.jsx`.
- Communication education route: `CommunicationSinPage.jsx`.
- Primary runtime data loader: `src/hooks/useAppData.js`.
- Runtime data source pattern: modular JSON fetched from `/data/...` in `public`.
- Core shared modal for nonviolent + violent flows: `src/components/emotion/EmotionModal.jsx`.
- Core gratitude modal: `src/components/checkin/PositiveCheckInModal.jsx`.
- Shared grid renderer: `src/components/grid/EmotionGrid.jsx`.
- Shared navigation/header UI: `Header.jsx`, `TopNav.jsx`, and UI atoms under `src/components/ui/`.
- Nonviolent page background logic: `getGridPageBackground()` in `src/utils/pageThemes.js`.
- Violent page background logic: `getViolentPageBackground()` in `src/utils/pageThemes.js`.
- Log page background logic: `getLogPageBackground()` in `src/utils/pageThemes.js`.
- Needs page background logic: `getNeedsPageBackground()` in `src/utils/pageThemes.js`.
- Prayer page background logic: `getPrayerPageBackground()` in `src/utils/pageThemes.js`.
- Nonviolent grid color engine: `cellColor()` in `src/utils/color.js`.
- Positive check-in color engine: `checkinColor()` in `src/utils/checkinColor.js`.
- Emotional prayer color engine: `prayerColor()` in `src/utils/prayerColor.js`.
- If behavior seems missing, inspect imports first, then inspect fetched `/data/...` JSON paths, then pull any non-uploaded dependencies listed below.


# AI HANDOFF HEADER — READ FIRST

This project uses a **partial uploaded working set**, not the full repo.

Before making edits, future chats should:
1. Read this file first.
2. Inspect the uploaded source files already available in the project.
3. Check whether the requested task also depends on non-uploaded files.
4. Pull in any missing dependencies from the repo paths listed below before rewriting code.
5. Treat this app as **data-driven**: behavior may come from React files, JSON files, or both.

## Important rule
Do not assume the currently uploaded files are the whole app.

## Where to look for additional files

### Additional source files that may need to be pulled
- `src/utils/exportHelpers.js`
- `src/utils/exportZip.js`
- `src/utils/masterSelectors.js`
- `src/utils/validateMaster.js`
- `src/utils/prayerColor.js`
- `src/data/prayerGridData.js`
- `src/components/emotion/AccountabilityBlock.jsx`
- `src/components/checkin/GratitudeFlowBlock.jsx`
- `src/components/purpose/PurposeDropdown.jsx`
- `src/components/prayer/PrayerModal.jsx`
- `src/data/prayerGridData.js`
- `src/utils/prayerColor.js`
- `src/index.css`

### Public data files that may drive the behavior
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

## How to think about this project
- `App.jsx` handles routing and page selection.
- `useAppData.js` loads modular JSON and assembles runtime data.
- Pages pass data into modals/components.
- `EmotionModal.jsx` and `PositiveCheckInModal.jsx` hold much of the interaction flow.
- Grid behavior is rendered through `EmotionGrid.jsx`.
- App behavior may depend on both uploaded source files and public JSON data.

## Before editing
Check imports first.
Check fetched JSON paths second.
Then decide whether the task is:
- source-code driven,
- data-driven,
- or both.


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

# SESSION UPDATE — 2026-03-08

Completed in this session:
- Added `NeedsPage.jsx` routing support in `App.jsx` if it was missing.
- Added new emotional prayer route `#/prayer`.
- Added `PrayerPage.jsx` and `PrayerModal.jsx`.
- Added `prayerGridData.js` (100-cell prayer grid + prayer metadata).
- Added `prayerColor.js` for the four-quadrant prayer grid palette.
- Updated `TopNav.jsx` to support needs, prayer, and communication buttons.
- Updated `PurposePage.jsx` and `App.css` hub layout to include needs and prayer launcher tiles.
- Updated `pageThemes.js` with needs/prayer page backgrounds.

### Files updated this session
- `src/App.jsx`
- `src/App.css`
- `src/components/layout/TopNav.jsx`
- `src/pages/PurposePage.jsx`
- `src/pages/ViolentPage.jsx`
- `src/pages/CheckInPage.jsx`
- `src/pages/CommunicationSinPage.jsx`
- `src/pages/LogPage.jsx`
- `src/pages/NeedsPage.jsx`
- `src/pages/PrayerPage.jsx`
- `src/components/prayer/PrayerModal.jsx`
- `src/utils/pageThemes.js`
- `src/utils/prayerColor.js`
- `src/data/prayerGridData.js`
- `accountabilitySchema.md`

### Files likely needing follow-up update
- `src/hooks/useAppData.js` if prayer data is later moved from source file into `/public/data/...` modular JSON
- `src/pages/PurposePage.jsx` if launcher wording/order changes again
- `src/components/layout/TopNav.jsx` if button count needs simplification on mobile

### Public JSON/data files needing sync
- none required for this prayer feature in the current implementation (the prayer grid is source-driven via `prayerGridData.js`)

### Schema file updated?
- yes

### Handoff complete?
- yes
