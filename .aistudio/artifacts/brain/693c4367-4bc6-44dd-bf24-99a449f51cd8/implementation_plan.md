# Master Development Plan: The Mont Uni Pre Cadet Academy

## Phase 1 & 2 Completed: Reviewable First-Stage Implementation

### 1. Visual Identity & Brand Styling
- **Official Name**: **The Mont Uni Pre Cadet Academy**
- **Location**: Chakwal area, Punjab, Pakistan (Official Coordinates: `32.834662° N, 72.999090° E`).
- **Brand Palette**:
  - Primary Forest Green: `#0F5132`
  - Secondary Academic Blue: `#1E40AF`
  - Accent Gold: `#D4AF37`
  - Main Background: `#F8FAF7` (warm off-white/ivory)
  - Light Accent Green: `#EAF2EB`
  - Light Accent Blue: `#EDF3FA`
  - Neutral Borders: `#E2E8F0`
- **Removed**: Cyberpunk dark styling, laser glows, AI dashboard slop, floating particles, and robotic terminology.
- **Preserved Assets**: Official school crest logo (`the-mount-uni-logo.png`) and authentic school reference photographs (corridors, classrooms, B2 library door plaque, library alcove motto, bulletin greenery).

---

### 2. Website Structure & 8 Concise Sections

1. **Header & Navigation (`Navbar.tsx`)**:
   - Official logo on the left with full title: *The Mont Uni Pre Cadet Academy* (Classes 1–10 · Chakwal, Punjab).
   - Clean, direct top-level navigation: *Home, About Us, Academics, AI & Digital, School Life, Admissions, Contact*.
   - Quick action buttons: **School Portal** (opens SMS) and **Enquire About Admissions** (Forest Green `#0F5132`).
   - Smooth mobile navigation drawer with accessible open/close transitions.

2. **Hero Section (`Home.tsx`)**:
   - **Headline**: “Building Knowledge. Shaping Character. Preparing for the Future.”
   - **Supporting Copy**: “Welcome to The Mont Uni Pre Cadet Academy, where academic learning, confidence, discipline and character development support students as they prepare for the future.”
   - Primary button: “Explore Our School” (`#about`).
   - Secondary button: “Enquire About Admissions” (`#admissions`).
   - Tertiary button: “SMS Dashboard Preview”.
   - Authentic photograph frame featuring the central brick colonnade corridor in Chakwal.

3. **About The Mont Uni (`#about`)**:
   - Approved copy: “At The Mont Uni Pre Cadet Academy, education is about more than academic learning. We aim to support students in developing knowledge, confidence, discipline, responsibility and positive character in a supportive learning environment.”
   - Regional context for Chakwal and Kot Raja families.
   - Four core pillars: Structured Academic Mastery, Pre-Cadet Discipline & Routine, Character Building & Moral Ethics, and Authentic Pakistani Heritage.

4. **Academics: Classes 1–10 (`#academics`)**:
   - Two balanced, high-contrast academic cards:
     - **Classes 1 to 5 (Primary School)**: Foundational learning, English & Urdu reading literacy, arithmetic reasoning, general science curiosity, ethics, caring teacher supervision.
     - **Classes 6 to 10 (Middle & Secondary School)**: Analytical development, pre-cadet leadership, general science progression, computer literacy, board examination readiness in Science and Humanities groups.
   - Authentic classroom photography showing spacious student seating with natural ventilation.

5. **AI & Digital Learning (`#digital-learning`)**:
   - Grounded, non-sci-fi curriculum component titled: “Preparing Students for a Digital Future”.
   - Four educational focus areas: Digital Literacy & Fundamentals, Responsible Use of AI, Online Safety & Ethics, and Creative Problem-Solving.

6. **School Life and Character Building (`#school-life`)**:
   - Authentic 4-photo gallery:
     - `#002 · Classrooms`: Spacious sunlit student seating.
     - `#003 · Library Entrance`: B2 Reading Room & Library door plaque.
     - `#004 · Library Motto`: Inscribed wall motto *"A library is a hospital for the mind"*.
     - `#005 · Notice Board`: Hallway circulars and botanical greenery.
   - Supporting highlight: **“Speak with Confidence”** (Spoken English, active listening, clear pronunciation, everyday conversational fluency, and morning assembly presentations).
   - Pre-Cadet discipline, uniform inspections, and student responsibility.

7. **Admissions & Contact (`#admissions`, `#contact`)**:
   - Verified Admissions Enquiry Form: Parent / Guardian Full Name, Contact Phone Number, Desired Class (Class 1–10 selector), and Message.
   - Real-time Firestore synchronization saving directly to the `applications` collection with instant validation and confirmation message.
   - Verified campus location details, GPS coordinates, one-click Yandex Maps directions link, and official school office hours.

8. **Footer**:
   - Official logo, institution name, short mission description, quick navigation links, location coordinates, School Management System portal launcher, and copyright notice.

---

### 3. School Management System (SMS) Preview (`SchoolManagementSystem.tsx`)

A dedicated data-oriented application area featuring role-based views:
- **Administrator View**:
  - Executive KPI Cards: Total Student Body (340), Today's Attendance Rate (calculated live), Active Faculty (22), and Academic Progress.
  - Student Directory: Searchable and filterable by Class 1–10, with student roll numbers, parents' names, and dossier inspection.
  - Daily Attendance Register: Class and date selectors, Present / Absent / Late / Leave toggles, and instant register saving.
  - Academic Marks Entry: Subject selection, term mark entry, automatic percentage, and letter grade calculation.
  - Teacher Daily Activity Reports: Review logged lesson plans and homework assignments.
  - School Announcements: Directly connected to live Firestore `announcements`, updating the public website ticker in real time.
- **Teacher View**:
  - Assigned class roster and rapid attendance marker.
  - Gradebook and test score entry.
  - Submit daily teaching activity reports to the administration.
- **Parent View**:
  - Student dossier: Muhammad Rayan (Class 8 Pre-Cadet Section A).
  - Attendance summary and term progress report card.
  - School announcements and discipline records.

---

### 4. Implementation Status Matrix

| Module / Feature | Status | Details |
| :--- | :--- | :--- |
| **Pakistani School Branding** | **Completed** | Forest Green `#0F5132`, Academic Blue `#1E40AF`, Gold `#D4AF37`, Ivory `#F8FAF7`. |
| **Official Logo & Assets** | **Completed** | Original crest logo and 5 authentic school photographs deployed as static assets. |
| **Desktop Homepage (8 Sections)** | **Completed** | Fully responsive, high-contrast, professional typography. |
| **Mobile Homepage & Drawer** | **Completed** | Tested at 375×812 viewport with smooth mobile navigation drawer. |
| **Classes 1–10 Academics** | **Completed** | Primary (1–5) and Middle/Secondary (6–10) balanced academic cards. |
| **AI & Digital Learning** | **Completed** | Grounded digital literacy, ethical AI use, and online safety. |
| **Admissions Enquiry Form** | **Completed** | Live validation, form fields, and Firestore `applications` collection persistence. |
| **Campus Location & Coordinates** | **Completed** | 32.834662° N, 72.999090° E with live Yandex Maps directions. |
| **SMS Executive Overview** | **Completed** | Key metrics, active class strengths, and recent teacher activity logs. |
| **SMS Student Directory** | **Completed** | Searchable directory, filter by Class 1–10, enroll new student modal. |
| **SMS Daily Attendance Register** | **Completed** | Class roster, status toggles (Present/Absent/Late/Leave), and persistence. |
| **SMS Academic Marks Entry** | **Completed** | Subject selector, score entry, grade calculation, and progress preview. |
| **SMS Teacher Reports** | **Completed** | Daily activity submission form and archive log. |
| **SMS Live Announcements** | **Completed** | Live bidirectional Firestore synchronization with public ticker. |
| **Cadet Student Dossier Modal** | **Completed** | Profile, House assignment, pre-cadet conduct ratings, attendance %, remarks, and quick actions. |
| **Printable Academic Progress Report Card** | **Completed** | Official crest, subject scores breakdown, division, percentage, remarks, and 3 signature blocks. |
| **3-Part Bank Fee Challan Voucher** | **Completed** | Standard Bank Copy, School Copy, and Student Copy in PKR for Chakwal branch. |
| **Morning Parade Roll Call Sheet** | **Completed** | Printable daily parade attendance sheet with cadet signature and drill master review. |
| **Parent Portal Document Services** | **Completed** | One-click access to dossier, report card, fee voucher, and absence slip submission. |
| **Automated Unit Test Suite** | **Completed** | 17 unit tests passing across calculation, grading, navigation, and fee utilities. |

