export interface MonographVignette {
  serial: string; // e.g. "#001"
  rawIndex: string; // e.g. "001"
  title: string;
  classification: string;
  year: string;
  architecturalStyle: string;
  coordinates: string;
  image: string;
  leadArch: string;
  summary: string;
  specifications: string[];
  historicalNote: string;
}

export const MONOGRAPH_VIGNETTES: MonographVignette[] = [
  {
    serial: '#001',
    rawIndex: '001',
    title: 'Central Academic Corridor & Brick Colonnade',
    classification: 'Campus Architecture & Hallway Wing',
    year: 'Campus Main Wing',
    architecturalStyle: 'Red-Brick Structural Pillars, Terrazzo Flooring with Tactile Guide Path',
    coordinates: '32.834662° N, 72.999090° E',
    image: '/school-images/campus-corridor-colonnade.jpg',
    leadArch: 'School Campus Architecture',
    summary:
      'A spacious, naturally illuminated academic corridor lined with classic red-brick structural columns and smooth stone terrazzo flooring. Designed with an open-air lateral gallery that brings in fresh breeze and daylight across all primary and secondary classrooms.',
    specifications: [
      'Reinforced red-brick exterior colonnade',
      'Continuous tactile guidance pathway for student safety',
      'Generous corridor width allowing orderly class transitions',
    ],
    historicalNote:
      'Serving as the central circulatory artery of the school, connecting academic wings, the library, and administrative offices.',
  },
  {
    serial: '#002',
    rawIndex: '002',
    title: 'Spacious Classrooms with Natural Lighting',
    classification: 'Learning Environment for Classes 1–10',
    year: 'Classroom Wing',
    architecturalStyle: 'High-Ceiling Ventilated Rooms with Multi-Pane Greenery Windows',
    coordinates: '32.834662° N, 72.999090° E',
    image: '/school-images/classroom-daylight-desks.jpg',
    leadArch: 'Instructional Space Design',
    summary:
      'Spacious, clutter-free classrooms featuring rows of durable dual-seater student study desks, overhead ventilation fans, and large panoramic gridded windows that look out onto lush outdoor trees. Built to foster deep concentration and lively learning for Classes 1 through 10.',
    specifications: [
      'Dual-bench student seating with integrated bag racks',
      'Expansive cross-ventilation windows facing natural tree canopy',
      'Even daylight distribution reducing eye strain during study',
    ],
    historicalNote:
      'Every classroom is oriented towards outdoor greenery, ensuring students learn in a calm, wholesome, and airy atmosphere.',
  },
  {
    serial: '#003',
    rawIndex: '003',
    title: 'B2 Reading Room & Library Wing',
    classification: 'School Library & Literacy Sanctuary',
    year: 'Dedicated Academic Facility',
    architecturalStyle: 'Classic Black and Gold Lacquered Signage with Polished Timber Frame',
    coordinates: '32.834662° N, 72.999090° E',
    image: '/school-images/library-reading-room-entrance.jpg',
    leadArch: 'School Library Wing',
    summary:
      'Marked by the official B2 Reading Room and Library door plaque in traditional gold-leaf lettering. This dedicated sanctuary preserves a quiet, respectful learning space for students across all grade levels to read, research, and complete assignments.',
    specifications: [
      'Official lacquered black and gold door identification signage',
      'Solid wooden framing with glass observation windows',
      'Direct hallway access adjacent to primary and middle classrooms',
    ],
    historicalNote:
      'The B2 Reading Room serves as the academic cornerstone where young readers develop independent study discipline and a love for books.',
  },
  {
    serial: '#004',
    rawIndex: '004',
    title: 'Library Study Alcove & Mind Sanctuary',
    classification: 'Independent Study & Reading Culture',
    year: 'Library Interior',
    architecturalStyle: 'Inscribed Literacy Wall Mural with Dedicated Study Carrels',
    coordinates: '32.834662° N, 72.999090° E',
    image: '/school-images/library-hospital-for-mind.jpg',
    leadArch: 'Academic Resource Center',
    summary:
      'The interior of our school reading room features the timeless guiding motto inscribed boldly on the wall: “A library is a hospital for the mind.” Wooden study carrels and comfortable desks support students during quiet research, reading periods, and examination review.',
    specifications: [
      'Inscribed literacy quote: “A library is a hospital for the mind.”',
      'Individual study desks and reading stations',
      'Calm, focused environment for student academic revision',
    ],
    historicalNote:
      'Reminding every student that reading is not merely an academic task, but nourishment and healing for developing young minds.',
  },
  {
    serial: '#005',
    rawIndex: '005',
    title: 'Academic Notice Bulletin & Hallway Botanical Greenery',
    classification: 'Student Life & Institutional Communication',
    year: 'Active School Hallway',
    architecturalStyle: 'Felt Notice Board Flanked by Potted Tropical Flora',
    coordinates: '32.834662° N, 72.999090° E',
    image: '/school-images/hallway-bulletin-greenery.jpg',
    leadArch: 'Student Life & Hallway Management',
    summary:
      'The department bulletin board serves as the informational hub for the school community, displaying examination timetables, mission circulars, and student notices. Fresh indoor greenery including potted palms and dieffenbachia adds vitality and natural warmth to the corridor.',
    specifications: [
      'Central felt notice board with protected glass-case circulars',
      'Potted indoor botanical plants maintaining clean, vibrant air',
      'Polished stone floor with high-contrast wall clock',
    ],
    historicalNote:
      'Keeping students, parents, and teachers connected with daily school events, achievements, and academic announcements.',
  },
];
