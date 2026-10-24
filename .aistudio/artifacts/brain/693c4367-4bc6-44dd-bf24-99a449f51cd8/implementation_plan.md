# Fix Report: Cross-Device School Photograph Loading

## 1. Problem Diagnosis
- **Root Cause Identified**: Several image paths across `src/data/monographData.ts`, `src/components/Home.tsx`, and `src/components/MegaMenuDropdown.tsx` were hardcoded with a `/public/` prefix (e.g. `/public/assets/aistudio/download__1__6132a32c.jpg`).
- While the Vite development server provides internal dev middleware that occasionally resolved `/public/` locally on the author's browser, in the production build (`npm run build`) Vite places public files directly at the root (`dist/assets/...`, `dist/school-images/...`). As a result, when remote devices visited the site, all requests to `/public/...` returned `404` or the fallback `index.html` shell, resulting in broken image icons.

## 2. Solution Implemented
1. **Organized Asset Directory**:
   - Created `public/school-images/` containing physical copies of all authentic school reference photographs and the official school logo with clear, stable, semantic filenames:
     - `campus-corridor-colonnade.jpg` (Central Academic Corridor & Brick Colonnade)
     - `classroom-daylight-desks.jpg` (Classrooms with natural lighting & study desks)
     - `library-reading-room-entrance.jpg` (B2 Reading Room & Library door plaque)
     - `library-hospital-for-mind.jpg` (Library study alcove & "Hospital for the mind" wall motto)
     - `hallway-bulletin-greenery.jpg` (Academic notice bulletin & potted botanical flora)
     - `the-mount-uni-logo.png` (Official The Mount Uni crest logo)
2. **Updated Image References**:
   - Updated `src/data/monographData.ts`, `src/components/Home.tsx`, `src/components/MegaMenuDropdown.tsx`, `src/components/CampusLife.tsx`, `src/components/VirtualTourModal.tsx`, `src/components/Navbar.tsx`, and `src/components/MobileDrawer.tsx` to reference stable root-relative paths (`/school-images/...`).
3. **Dual Compatibility Aliases**:
   - Maintained original files in `public/assets/aistudio/` and established `public/public/` symlink aliases so both legacy and new paths resolve with `200 OK image/jpeg` / `200 image/png` in development and in the `dist/` production bundle.
4. **Unit Tests Updated**:
   - Updated assertion in `src/utils/monograph.test.ts` to accept `/school-images/`. All 12 unit tests pass.

## 3. Verification
- **HTTP Header Inspection**: Verified with curl that all image URLs return `HTTP/1.1 200 OK` with proper MIME types (`image/jpeg`, `image/png`) and correct byte payloads.
- **Production Build**: `npm run build` completed cleanly, bundling all images into `dist/school-images/` and `dist/assets/`.
- **Live In-Browser Verification**: Used headless Chromium via Playwright to inspect rendered `<img>` elements. Verified `complete: true` and positive `naturalWidth` / `naturalHeight` across all reference photographs.
- **Responsive Testing**: Verified visual layout and rendering in both mobile viewport (375x812) and desktop viewport (1440x900).
