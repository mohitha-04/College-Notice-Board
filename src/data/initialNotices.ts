import { Notice } from '../types/notice';

// Helper to generate ISO strings relative to current date
const now = new Date();
const daysAgo = (days: number, hoursOffset = 0): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hoursOffset);
  return d.toISOString();
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'IMPORTANT: Schedule for End-Semester Theory & Practical Examinations - Fall 2026',
    description: `All undergraduate and postgraduate students are hereby notified that the End-Semester Examinations (Theory and Laboratory practicals) for the Fall 2026 semester will commence from November 20, 2026.\n\nKey Guidelines:\n1. Admit cards will be available on the Student Portal starting November 10, 2026.\n2. Hall tickets must be stamped by respective Department Heads before entry.\n3. Possession of mobile phones, smartwatches, or programmable calculators inside the examination hall is strictly prohibited.\n4. Practical laboratory exams will be conducted between November 14 and November 18.\n\nPlease refer to the attached detailed timetable for branch-wise timings and venue allocations.`,
    department: 'General',
    category: 'Examination',
    publishedDate: daysAgo(0, 2), // Today
    postedBy: 'Office of the Controller of Examinations',
    authorRole: 'Examination Authority',
    isPinned: true,
    attachment: {
      id: 'att-1',
      name: 'End_Sem_Exam_Schedule_Fall2026.pdf',
      size: '1.4 MB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 342,
    createdAt: daysAgo(0, 2)
  },
  {
    id: 'notice-2',
    title: 'Call for Registration: National Level Hackathon "CodeStorm 2026" & Open Source Bootcamp',
    description: `The Department of Computer Science & Engineering (CSE), in collaboration with the ACM Student Chapter, is proud to announce "CodeStorm 2026", an intensive 36-hour offline Hackathon scheduled for November 28-29, 2026.\n\nTracks & Themes:\n- Scalable Cloud & Distributed Systems\n- Next-Gen Autonomous Agents & Web3\n- HealthTech & Sustainable Smart Cities\n- Open Innovation & Developer Tooling\n\nCash prizes totaling $5,000 + mentorship from industry engineering leads. Teams of 2 to 4 members may register through the department portal before November 18, 2026. Registration is free for all enrolled college students.`,
    department: 'CSE',
    category: 'Events',
    publishedDate: daysAgo(0, 5), // Today
    postedBy: 'Dr. Rajesh Sharma, HOD - CSE',
    authorRole: 'Head of Department',
    isPinned: true,
    attachment: {
      id: 'att-2',
      name: 'CodeStorm2026_Brochure_Rules.pdf',
      size: '2.8 MB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 289,
    createdAt: daysAgo(0, 5)
  },
  {
    id: 'notice-3',
    title: 'Distinguished Guest Lecture: Modern Deep Learning Architectures & Multimodal Foundations',
    description: `The Department of Artificial Intelligence & Machine Learning (AIML) cordially invites faculty members, research scholars, and students to a special masterclass on Multimodal Foundation Models and Scalable Inference.\n\nSpeaker: Dr. Elena Vance, Senior Staff AI Research Scientist.\nDate & Time: Tomorrow, 2:30 PM - 4:30 PM\nVenue: Dr. A.P.J. Abdul Kalam Auditorium, Technology Block C.\n\nTopics include Transformer efficiency, Mixture of Experts (MoE), and deployment on edge neural processing units (NPUs). Attendance is mandatory for 3rd and 4th year AIML undergraduates.`,
    department: 'AIML',
    category: 'Academic',
    publishedDate: daysAgo(1, 4), // Yesterday
    postedBy: 'Department of AIML Seminar Committee',
    authorRole: 'Faculty Coordinator',
    isPinned: false,
    attachment: {
      id: 'att-3',
      name: 'AIML_Seminar_Poster_Vance.pdf',
      size: '890 KB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 195,
    createdAt: daysAgo(1, 4)
  },
  {
    id: 'notice-4',
    title: 'Commencement of Embedded Systems & VLSI Design Lab Practical Batches',
    description: `Students of B.Tech ECE (Semester V) are requested to take note of the newly restructured laboratory practical batches for Embedded Systems Lab (EC501P) and VLSI Design Lab (EC502P).\n\nLab batches commence from Monday, November 10. All students are instructed to bring their laboratory record books, verified hardware project components, and university identity cards. Safety guidelines for handling ESD-sensitive chipsets must be strictly adhered to in the Clean Room.`,
    department: 'ECE',
    category: 'Academic',
    publishedDate: daysAgo(2), // 2 days ago
    postedBy: 'Prof. Ananya Sen, Lab In-charge',
    authorRole: 'ECE Faculty',
    isPinned: false,
    attachment: {
      id: 'att-4',
      name: 'ECE_Lab_Batches_Allocation.pdf',
      size: '620 KB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 154,
    createdAt: daysAgo(2)
  },
  {
    id: 'notice-5',
    title: 'Industrial Field Visit to 400kV Grid Substation & Smart Power Management Unit',
    description: `As part of the experiential curriculum for Power Systems & Renewable Grid Integration, an industrial educational visit has been arranged to the State 400kV High Voltage Substation for 3rd year Electrical & Electronics Engineering (EEE) students.\n\nDeparture: November 15, 2026, at 8:00 AM from the College Main Gate.\nReturn: Approximately 5:00 PM.\n\nSafety helmets and shoes are mandatory on-site. Interested students must submit parental consent forms to Room EE-204 by this Friday.`,
    department: 'EEE',
    category: 'Events',
    publishedDate: daysAgo(3), // 3 days ago
    postedBy: 'Prof. V. Ramanathan, EEE Department',
    authorRole: 'Industrial Coordinator',
    isPinned: false,
    attachment: {
      id: 'att-5',
      name: 'EEE_Substation_Visit_Consent_Form.pdf',
      size: '340 KB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 128,
    createdAt: daysAgo(3)
  },
  {
    id: 'notice-6',
    title: 'Hands-on Workshop: Computational Fluid Dynamics (CFD) and Rapid 3D Prototyping',
    description: `The Department of Mechanical Engineering is hosting a 3-day intensive skill development workshop focusing on ANSYS Fluent CFD simulations, SolidWorks modeling, and industrial additive manufacturing (Stereolithography & FDM 3D printing).\n\nParticipants will receive authorized course completion certificates, 1-year student educational licenses, and hands-on printing time for their custom mechanical assemblies.\nSeats are limited to 45 participants on a first-come, first-served basis.`,
    department: 'Mechanical',
    category: 'Academic',
    publishedDate: daysAgo(4), // 4 days ago
    postedBy: 'Dr. Michael Chen, HOD - Mechanical',
    authorRole: 'Head of Department',
    isPinned: false,
    attachment: {
      id: 'att-6',
      name: 'CFD_Workshop_Syllabus_2026.pdf',
      size: '1.1 MB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 110,
    createdAt: daysAgo(4)
  },
  {
    id: 'notice-7',
    title: 'Surveying Camp 2026 Guidelines & Geological Field Site Schedule',
    description: `The annual residential Survey Camp for 3rd Year B.Tech Civil Engineering students will take place from November 22 to November 27 at the Valley Foothills Topographical Base Station.\n\nStudents will receive practical training in Total Station operations, Differential GPS (DGPS), drone aerial photogrammetry, and contour baseline mapping. Medical fitness certificates and emergency contact sheets must be submitted to the Civil Engineering office by November 12.`,
    department: 'Civil',
    category: 'Academic',
    publishedDate: daysAgo(5), // 5 days ago
    postedBy: 'Survey Camp Faculty Committee, Civil Engg',
    authorRole: 'Course Faculty',
    isPinned: false,
    attachment: {
      id: 'att-7',
      name: 'Civil_Survey_Camp_Itinerary.pdf',
      size: '1.9 MB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 142,
    createdAt: daysAgo(5)
  },
  {
    id: 'notice-8',
    title: 'Campus Placement Drive: Top Tier Tech & Engineering Core Companies (Phase 1)',
    description: `The Training & Placement Cell (T&P) invites registered final-year students of CSE, AIML, ECE, EEE, and Mechanical disciplines for Phase-1 On-Campus Placement Drives starting November 16, 2026.\n\nParticipating Organizations:\n- Cloud Infrastructure & Enterprise Software Companies\n- Semiconductor & Hardware Design Firms\n- Automotive & Heavy Robotics Conglomerates\n\nPlease ensure your resume, academic transcripts, and portfolio repositories are updated in the Training & Placement database before November 11. Dress code: Formal university business attire.`,
    department: 'General',
    category: 'Placement',
    publishedDate: daysAgo(6), // 6 days ago
    postedBy: 'Director, Training & Placement Cell',
    authorRole: 'Placement Officer',
    isPinned: true,
    attachment: {
      id: 'att-8',
      name: 'Placement_Drive_Phase1_Eligibility.pdf',
      size: '1.5 MB',
      type: 'pdf',
      url: '#'
    },
    viewsCount: 480,
    createdAt: daysAgo(6)
  },
  {
    id: 'notice-9',
    title: 'Central Library Extended 24/7 Reading Room Hours During Exam Month',
    description: `In view of the approaching End-Semester Examinations, the Central Academic Library will keep the Main Reading Hall and Digital Research Commons open 24 hours a day, 7 days a week, from November 10 to December 15, 2026.\n\nSpecial amenities include:\n- High-speed fiber Wi-Fi throughout the reading zones\n- Overnight cafeteria counter open until 3:00 AM\n- Group discussion study pods bookable via the library reservation portal\n\nPlease maintain absolute silence in the quiet study zones. University ID badges must be shown at the electronic turnstiles after 9:00 PM.`,
    department: 'General',
    category: 'General',
    publishedDate: daysAgo(7), // 7 days ago
    postedBy: 'Chief Librarian & Information Officer',
    authorRole: 'Library Services',
    isPinned: false,
    attachment: null,
    viewsCount: 231,
    createdAt: daysAgo(7)
  }
];
