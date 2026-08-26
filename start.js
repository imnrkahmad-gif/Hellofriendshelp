const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "nursestudy-data.json");
const UPI_ID = "7763082034@kotak";

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   DATABASE
========================================================= */

const emptyDB = {
  students: [],
  community: [],
  donors: [],
  bloodRequests: [],
  quizResults: [],
  prizeClaims: [],
  bookRequests: []
};

function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
      );

      return {
        ...emptyDB,
        ...data
      };
    }
  } catch (e) {
    console.log("Database error:", e.message);
  }

  return { ...emptyDB };
}

let db = loadDB();

function saveDB() {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(db, null, 2),
      "utf8"
    );
  } catch (e) {
    console.log("Save error:", e.message);
  }
}

function id(prefix) {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

function clean(v, max = 500) {
  return String(v || "")
    .trim()
    .slice(0, max);
}

function esc(v) {
  return String(v || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   STUDY DATA
========================================================= */

const STUDY = {
  "1st Semester": [
    {
      name: "Anatomy",
      theory: "Study of the structure of the human body.",
      easy: "Anatomy me body ke different parts aur unki structure padhi jati hai.",
      practical: "Skeleton par skull, clavicle, scapula, humerus, radius, ulna, ribs, pelvis, femur, tibia aur fibula identify karein.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Human_skeleton_front_en.svg"
    },
    {
      name: "Physiology",
      theory: "Study of normal functions of the human body.",
      easy: "Physiology me body ke organs normally kaise kaam karte hain ye padte hain.",
      practical: "Pulse, respiration, blood pressure aur basic observations practice karein.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Diagram_of_the_human_heart.svg"
    },
    {
      name: "Fundamentals of Nursing",
      theory: "Basic principles and skills required for safe patient care.",
      easy: "Nursing ki basic foundation aur patient care skills.",
      practical: "Hand washing, bed making, positioning aur vital signs practice karein.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hand_washing.svg"
    },
    {
      name: "Nutrition",
      theory: "Study of nutrients required for health, growth and energy.",
      easy: "Body ko required food aur nutrients dena nutrition ka main concept hai.",
      practical: "Balanced diet aur food groups ka chart banayein.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/MyPlate.svg"
    },
    {
      name: "Psychology",
      theory: "Study of behaviour and mental processes.",
      easy: "Human thinking, emotions aur behaviour ka study.",
      practical: "Observation aur communication practice karein.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg"
    },
    {
      name: "Sociology",
      theory: "Study of society and social relationships.",
      easy: "Family, society aur culture ka study.",
      practical: "Family assessment aur community observation.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Family_Portrait.svg"
    }
  ],

  "2nd Semester": [
    {
      name: "Microbiology",
      theory: "Study of microorganisms such as bacteria, viruses and fungi.",
      easy: "Germs aur microorganisms ka study.",
      practical: "Microscope, specimen handling aur infection control.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bacteria.svg"
    },
    {
      name: "Pharmacology",
      theory: "Study of medicines and their actions.",
      easy: "Medicines ka action, dose, route aur precautions.",
      practical: "Medication safety aur routes of administration.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pills.jpg"
    },
    {
      name: "Pathology",
      theory: "Study of disease processes and changes in tissues.",
      easy: "Disease ki wajah se body me hone wale changes ka study.",
      practical: "Specimen collection aur reports samajhna.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Red_White_Blood_cells.jpg"
    },
    {
      name: "Health Assessment",
      theory: "Systematic collection of information about patient health.",
      easy: "Patient ki condition ko step-by-step check karna.",
      practical: "General examination aur vital signs.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_pressure_measurement.jpg"
    },
    {
      name: "First Aid",
      theory: "Immediate care given before definitive treatment.",
      easy: "Emergency me immediate safe help dena first aid hai.",
      practical: "CPR principles, bleeding control aur recovery position.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/CPR_training.jpg"
    }
  ],

  "3rd Semester": [
    {
      name: "Medical Surgical Nursing",
      theory: "Nursing care of adults with medical and surgical conditions.",
      easy: "Adult patients ki diseases aur surgeries me nursing care.",
      practical: "Assessment, medication, wound care aur monitoring.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nurse_patient.jpg"
    },
    {
      name: "Hypertension",
      theory: "Persistent elevation of blood pressure.",
      easy: "Blood pressure repeatedly high rehna hypertension hai.",
      practical: "Correct BP measurement aur recording.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_pressure_monitor.jpg"
    },
    {
      name: "Diabetes Mellitus",
      theory: "Metabolic disorder involving elevated blood glucose.",
      easy: "Blood sugar control me problem hona diabetes hai.",
      practical: "Glucometer, foot care aur patient education.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_glucose_meter.jpg"
    },
    {
      name: "Pneumonia",
      theory: "Infection or inflammation of lung tissue.",
      easy: "Lungs me infection ke saath cough, fever aur breathing problem ho sakti hai.",
      practical: "Respiratory assessment, oxygen safety aur prescribed nebulization principles.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg"
    },
    {
      name: "COPD",
      theory: "Chronic respiratory condition causing airflow limitation.",
      easy: "Long-term breathing problem aur airflow limitation.",
      practical: "Respiratory assessment aur inhaler teaching.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg"
    },
    {
      name: "Myocardial Infarction",
      theory: "Acute injury to heart muscle due to inadequate blood supply.",
      easy: "Heart muscle ko blood supply kam hone se serious injury.",
      practical: "Emergency assessment, ECG awareness aur vital monitoring.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Diagram_of_the_human_heart.svg"
    }
  ],

  "4th Semester": [
    {
      name: "Child Health Nursing",
      theory: "Nursing care of infants, children and adolescents.",
      easy: "Bachchon ki physical, mental aur developmental needs ka care.",
      practical: "Growth chart, pediatric assessment aur immunization history.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Child_growth_chart.svg"
    },
    {
      name: "Pneumonia in Children",
      theory: "Infection of the lower respiratory tract or lungs in children.",
      easy: "Child me cough, fever aur fast breathing ho sakti hai.",
      practical: "Respiratory assessment aur danger signs.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg"
    },
    {
      name: "Acute Bronchitis",
      theory: "Inflammation of the bronchial tubes.",
      easy: "Bronchi me inflammation se cough aur mucus ho sakta hai.",
      practical: "Respiratory assessment aur warning signs.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg"
    },
    {
      name: "Kangaroo Mother Care",
      theory: "Skin-to-skin contact between newborn and mother or caregiver.",
      easy: "Baby ko mother ke chest par skin-to-skin rakhna.",
      practical: "Safe positioning, warmth aur breastfeeding support.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kangaroo_mother_care.jpg"
    },
    {
      name: "IMNCI",
      theory: "Integrated approach for common childhood illnesses.",
      easy: "Childhood illness ko assess, classify aur manage karna.",
      practical: "Assessment, classification aur caregiver counselling.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Child_health.jpg"
    },
    {
      name: "Spina Bifida",
      theory: "Congenital neural tube defect affecting spinal development.",
      easy: "Spine development se related congenital condition.",
      practical: "Newborn assessment aur neurological observation.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Spina_bifida.jpg"
    }
  ],

  "5th Semester": [
    {
      name: "Community Health Nursing",
      theory: "Nursing focused on health promotion and disease prevention in communities.",
      easy: "Poori community ki health improve karna community nursing ka focus hai.",
      practical: "Home visit, family survey, health education aur community diagnosis.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Community_health_workers.jpg"
    },
    {
      name: "Communicable Diseases",
      theory: "Diseases that can spread through infectious agents.",
      easy: "Infection ke through ek person se doosre tak spread hone wali diseases.",
      practical: "Chain of infection, hand hygiene, PPE aur isolation.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Influenza_virus_particles.jpg"
    },
    {
      name: "Non Communicable Diseases",
      theory: "Diseases that generally do not spread from person to person.",
      easy: "Hypertension aur diabetes jaise diseases generally spread nahi hoti.",
      practical: "Screening, risk assessment aur lifestyle counselling.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Heart_disease.jpg"
    },
    {
      name: "Mental Health Nursing",
      theory: "Safe and therapeutic care for people with mental health problems.",
      easy: "Mental health problems wale patients ko safe aur respectful care.",
      practical: "Mental status examination aur therapeutic communication.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg"
    },
    {
      name: "Schizophrenia",
      theory: "Serious mental disorder affecting thinking, perception and functioning.",
      easy: "Thinking, perception aur behaviour me disturbance ho sakti hai.",
      practical: "Mental status assessment aur safety precautions.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg"
    },
    {
      name: "Depression",
      theory: "Persistent low mood or loss of interest with associated symptoms.",
      easy: "Long time tak sadness ya interest kam hona.",
      practical: "Mood assessment aur suicide-risk awareness.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg"
    }
  ],

  "6th Semester": [
    {
      name: "Nursing Research",
      theory: "Systematic investigation used to improve nursing knowledge and practice.",
      easy: "Evidence ke through nursing care ko better banana.",
      practical: "Research problem, objectives, sampling aur data collection.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Researcher_at_work.jpg"
    },
    {
      name: "Research Methodology",
      theory: "Methods and procedures used to conduct research.",
      easy: "Research practically kaise karni hai.",
      practical: "Research design, variables, validity and reliability.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Research_methods.jpg"
    },
    {
      name: "Nursing Education",
      theory: "Teaching and learning processes related to nursing.",
      easy: "Students ya patients ko effectively sikhana.",
      practical: "Lesson plan, teaching methods aur evaluation.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Classroom.jpg"
    },
    {
      name: "Leadership",
      theory: "Ability to guide people toward common goals.",
      easy: "Team ko direction dekar goal achieve karna.",
      practical: "Communication, delegation aur teamwork.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Teamwork.jpg"
    },
    {
      name: "Professional Ethics",
      theory: "Principles guiding professional nursing behaviour.",
      easy: "Patient privacy, dignity, rights aur safety protect karna.",
      practical: "Consent, confidentiality and ethical decisions.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Doctor_patient.jpg"
    }
  ],

  "7th Semester": [
    {
      name: "Advanced Nursing Practice",
      theory: "Advanced assessment and evidence-based clinical care.",
      easy: "Detailed assessment aur evidence ke basis par nursing decisions.",
      practical: "Advanced assessment, clinical reasoning and care planning.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nurse_patient.jpg"
    },
    {
      name: "Nursing Administration",
      theory: "Management of nursing services and resources.",
      easy: "Nursing staff aur resources ko manage karna.",
      practical: "Planning, staffing, supervision and delegation.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hospital_nurse_station.jpg"
    },
    {
      name: "Case Presentation",
      theory: "Structured presentation of patient clinical information.",
      easy: "Patient ki complete case ko systematic order me present karna.",
      practical: "History, examination, investigations, diagnosis and care plan.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Medical_record.jpg"
    },
    {
      name: "Clinical Practice",
      theory: "Application of nursing knowledge and skills in healthcare settings.",
      easy: "Theory ko actual patient care me safely apply karna.",
      practical: "Assessment, procedures, documentation and patient safety.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nurse_patient.jpg"
    },
    {
      name: "Exam Revision",
      theory: "Focused revision of important nursing concepts.",
      easy: "Exam ke important topics systematically revise karna.",
      practical: "Viva, MCQ, OSCE aur procedure practice.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nursing_students.jpg"
    }
  ]
};

/* =========================================================
   QUIZ
========================================================= */

const QUIZ = [
  {
    q: "First step of nursing process is:",
    o: ["Planning", "Implementation", "Assessment", "Evaluation"],
    a: 2
  },
  {
    q: "Normal adult pulse rate is approximately:",
    o: ["20–40/min", "60–100/min", "120–160/min", "160–200/min"],
    a: 1
  },
  {
    q: "Hand hygiene mainly helps prevent:",
    o: ["Infection transmission", "Fracture", "Hypertension", "Diabetes"],
    a: 0
  },
  {
    q: "Which is generally non-communicable?",
    o: ["Tuberculosis", "Measles", "Hypertension", "Chickenpox"],
    a: 2
  },
  {
    q: "Kangaroo Mother Care mainly includes:",
    o: ["Cold bathing", "Skin-to-skin contact", "Isolation", "Bed rest"],
    a: 1
  },
  {
    q: "Blood pressure is commonly measured using:",
    o: ["Thermometer", "Sphygmomanometer", "Glucometer", "Pulse oximeter"],
    a: 1
  },
  {
    q: "Which may occur in schizophrenia?",
    o: ["Hallucinations", "Fracture", "Diarrhoea only", "Fever only"],
    a: 0
  },
  {
    q: "Research helps nursing practice become more:",
    o: ["Evidence based", "Random", "Unsafe", "Unplanned"],
    a: 0
  },
  {
    q: "Patient confidentiality means:",
    o: ["Sharing records publicly", "Protecting private patient information", "Ignoring records", "Posting records online"],
    a: 1
  },
  {
    q: "A care plan mainly helps nurses to:",
    o: ["Organize patient care", "Avoid assessment", "Hide information", "Avoid evaluation"],
    a: 0
  }
];

/* =========================================================
   OFFICIAL LINKS
========================================================= */

const LINKS = [
  {
    title: "National Scholarship Portal",
    category: "Scholarship",
    url: "https://scholarships.gov.in/",
    description: "Government scholarship information."
  },
  {
    title: "Baba Farid University of Health Sciences",
    category: "University",
    url: "https://bfuhs.ac.in/",
    description: "Official BFUHS website."
  },
  {
    title: "AIIMS Examinations",
    category: "Nursing Vacancy",
    url: "https://www.aiimsexams.ac.in/",
    description: "Official AIIMS examination information."
  },
  {
    title: "National Health Mission",
    category: "Government Jobs",
    url: "https://nhm.gov.in/",
    description: "Official health programme information."
  },
  {
    title: "Employment News",
    category: "Government Jobs",
    url: "https://employmentnews.gov.in/",
    description: "Government employment information."
  }
];

/* =========================================================
   API
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "NurseStudy",
    status: "running",
    time: new Date().toISOString()
  });
});

app.get("/api/semesters", (req, res) => {
  res.json({
    success: true,
    semesters: Object.keys(STUDY)
  });
});

app.get("/api/semester/:semester", (req, res) => {
  const semester = decodeURIComponent(req.params.semester);
  const topics = STUDY[semester];

  if (!topics) {
    return res.status(404).json({
      success: false,
      error: "Semester not found"
    });
  }

  res.json({
    success: true,
    semester,
    topics
  });
});

app.get("/api/topics", (req, res) => {
  const q = clean(req.query.q, 150).toLowerCase();
  const result = [];

  for (const semester of Object.keys(STUDY)) {
    for (const topic of STUDY[semester]) {
      const text = (
        semester +
        " " +
        topic.name +
        " " +
        topic.theory +
        " " +
        topic.easy +
        " " +
        topic.practical
      ).toLowerCase();

      if (!q || text.includes(q)) {
        result.push({
          semester,
          ...topic
        });
      }
    }
  }

  res.json({
    success: true,
    topics: result.slice(0, 100)
  });
});

/* STUDENTS */

app.post("/api/students", (req, res) => {
  const student = {
    id: id("student"),
    name: clean(req.body.name, 80),
    phone: clean(req.body.phone, 30),
    university: clean(req.body.university, 150),
    college: clean(req.body.college, 150),
    semester: clean(req.body.semester, 50),
    city: clean(req.body.city, 80),
    createdAt: new Date().toISOString()
  };

  if (!student.name || !student.semester) {
    return res.status(400).json({
      success: false,
      error: "Name and semester are required."
    });
  }

  db.students.push(student);
  saveDB();

  res.json({
    success: true,
    message: "Student profile created successfully.",
    student: {
      id: student.id,
      name: student.name,
      university: student.university,
      college: student.college,
      semester: student.semester,
      city: student.city
    }
  });
});

app.get("/api/students", (req, res) => {
  const q = clean(req.query.q, 100).toLowerCase();

  let list = db.students;

  if (q) {
    list = list.filter(s =>
      (
        s.name +
        " " +
        s.university +
        " " +
        s.college +
        " " +
        s.semester +
        " " +
        s.city
      )
      .toLowerCase()
      .includes(q)
    );
  }

  res.json({
    success: true,
    students: list.slice(-100).reverse()
  });
});

/* COMMUNITY */

app.get("/api/community", (req, res) => {
  res.json({
    success: true,
    posts: db.community.slice(-100).reverse()
  });
});

app.post("/api/community", (req, res) => {
  const post = {
    id: id("post"),
    name: clean(req.body.name, 80),
    university: clean(req.body.university, 150),
    semester: clean(req.body.semester, 50),
    topic: clean(req.body.topic, 150),
    message: clean(req.body.message, 1000),
    createdAt: new Date().toISOString()
  };

  if (!post.name || !post.message) {
    return res.status(400).json({
      success: false,
      error: "Name and message are required."
    });
  }

  db.community.push(post);
  saveDB();

  res.json({
    success: true,
    message: "Question posted successfully.",
    post
  });
});

/* BLOOD DONOR */

app.post("/api/blood-donor", (req, res) => {
  const donor = {
    id: id("donor"),
    name: clean(req.body.name, 80),
    bloodGroup: clean(req.body.bloodGroup, 10).toUpperCase(),
    city: clean(req.body.city, 80),
    phone: clean(req.body.phone, 30),
    availability: clean(req.body.availability, 100),
    createdAt: new Date().toISOString()
  };

  const groups = [
    "A+", "A-", "B+", "B-",
    "AB+", "AB-", "O+", "O-"
  ];

  if (
    !donor.name ||
    !groups.includes(donor.bloodGroup) ||
    !donor.city ||
    !donor.phone
  ) {
    return res.status(400).json({
      success: false,
      error: "Name, valid blood group, city and phone are required."
    });
  }

  db.donors.push(donor);
  saveDB();

  res.json({
    success: true,
    message: "Blood donor registration submitted."
  });
});

app.get("/api/blood-donors", (req, res) => {
  const group = clean(req.query.group, 10).toUpperCase();
  const city = clean(req.query.city, 80).toLowerCase();

  let list = db.donors;

  if (group) {
    list = list.filter(x => x.bloodGroup === group);
  }

  if (city) {
    list = list.filter(x =>
      x.city.toLowerCase().includes(city)
    );
  }

  res.json({
    success: true,
    donors: list.slice(-100).reverse()
  });
});

/* BLOOD REQUEST */

app.post("/api/blood-request", (req, res) => {
  const request = {
    id: id("blood"),
    name: clean(req.body.name, 80),
    bloodGroup: clean(req.body.bloodGroup, 10).toUpperCase(),
    city: clean(req.body.city, 80),
    hospital: clean(req.body.hospital, 150),
    phone: clean(req.body.phone, 30),
    urgency: clean(req.body.urgency, 30),
    details: clean(req.body.details, 600),
    status: "open",
    createdAt: new Date().toISOString()
  };

  if (
    !request.name ||
    !request.bloodGroup ||
    !request.city ||
    !request.phone
  ) {
    return res.status(400).json({
      success: false,
      error: "Name, blood group, city and phone are required."
    });
  }

  db.bloodRequests.push(request);
  saveDB();

  res.json({
    success: true,
    message: "Blood request posted successfully."
  });
});

app.get("/api/blood-requests", (req, res) => {
  res.json({
    success: true,
    requests: db.bloodRequests
      .filter(x => x.status === "open")
      .slice(-100)
      .reverse()
  });
});

/* QUIZ */

app.get("/api/quiz", (req, res) => {
  res.json({
    success: true,
    questions: QUIZ.map((x, i) => ({
      id: i,
      question: x.q,
      options: x.o
    }))
  });
});

app.post("/api/quiz/submit", (req, res) => {
  const name = clean(req.body.name, 80);
  const answers = Array.isArray(req.body.answers)
    ? req.body.answers
    : [];

  if (!name) {
    return res.status(400).json({
      success: false,
      error: "Name is required."
    });
  }

  let score = 0;

  QUIZ.forEach((q, i) => {
    if (Number(answers[i]) === q.a) {
      score++;
    }
  });

  const result = {
    id: id("quiz"),
    name,
    score,
    total: QUIZ.length,
    percentage: Math.round(
      (score * 100) / QUIZ.length
    ),
    createdAt: new Date().toISOString()
  };

  db.quizResults.push(result);
  saveDB();

  res.json({
    success: true,
    result,
    message:
      result.percentage >= 80
        ? "Excellent score! Prize claim can be submitted for verification."
        : "Good attempt! Keep practicing."
  });
});

app.get("/api/leaderboard", (req, res) => {
  const list = [...db.quizResults]
    .sort(
      (a, b) =>
        b.percentage - a.percentage ||
        b.score - a.score
    )
    .slice(0, 20);

  res.json({
    success: true,
    leaderboard: list
  });
});

/* PRIZE */

app.post("/api/prize-claim", (req, res) => {
  const claim = {
    id: id("prize"),
    name: clean(req.body.name, 80),
    contact: clean(req.body.contact, 60),
    quizId: clean(req.body.quizId, 100),
    message: clean(req.body.message, 600),
    createdAt: new Date().toISOString()
  };

  if (!claim.name || !claim.contact) {
    return res.status(400).json({
      success: false,
      error: "Name and contact are required."
    });
  }

  db.prizeClaims.push(claim);
  saveDB();

  res.json({
    success: true,
    message: "Prize claim submitted for verification."
  });
});

/* BOOK HELP */

app.post("/api/book-request", (req, res) => {
  const request = {
    id: id("book"),
    name: clean(req.body.name, 80),
    semester: clean(req.body.semester, 50),
    book: clean(req.body.book, 200),
    contact: clean(req.body.contact, 50),
    message: clean(req.body.message, 600),
    createdAt: new Date().toISOString()
  };

  if (!request.name || !request.book) {
    return res.status(400).json({
      success: false,
      error: "Name and subject/book are required."
    });
  }

  db.bookRequests.push(request);
  saveDB();

  res.json({
    success: true,
    message: "Study help request submitted."
  });
});

/* LINKS */

app.get("/api/opportunities", (req, res) => {
  res.json({
    success: true,
    opportunities: LINKS
  });
});

app.get("/api/donation", (req, res) => {
  res.json({
    success: true,
    upi: UPI_ID,
    name: "NurseStudy",
    currency: "INR"
  });
});

/* =========================================================
   WEBSITE
========================================================= */

function page() {

  const semesters = Object.keys(STUDY);

  return `
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>NurseStudy</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#f3f8fa;
  color:#243b53;
}

header{
  background:white;
  position:sticky;
  top:0;
  z-index:50;
  border-bottom:1px solid #d9e2ec;
}

.nav{
  max-width:1100px;
  margin:auto;
  min-height:65px;
  padding:10px 20px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.logo{
  font-size:23px;
  font-weight:900;
  color:#0f766e;
}

nav a{
  margin:5px;
  text-decoration:none;
  color:#243b53;
  font-weight:bold;
  font-size:13px;
}

.container{
  width:92%;
  max-width:1100px;
  margin:auto;
}

.hero{
  padding:65px 0;
  background:linear-gradient(
    180deg,
    #e4faf6,
    #f3f8fa
  );
}

.badge{
  display:inline-block;
  background:#d8f5ef;
  color:#08645e;
  padding:7px 12px;
  border-radius:30px;
  font-weight:bold;
  font-size:12px;
}

h1{
  font-size:clamp(40px,8vw,70px);
  line-height:1;
  margin:20px 0;
}

h2{
  color:#102a43;
}

section{
  padding:45px 0;
}

.card,
.topic{
  background:white;
  border:1px solid #d9e2ec;
  border-radius:18px;
  padding:20px;
  margin:15px 0;
  box-shadow:0 5px 20px #102a430b;
}

.grid{
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(280px,1fr));
  gap:16px;
}

input,
select,
textarea{
  width:100%;
  padding:12px;
  border:1px solid #d9e2ec;
  border-radius:10px;
  margin:6px 0;
  font:inherit;
}

textarea{
  min-height:110px;
}

button,
.btn{
  display:inline-block;
  border:0;
  border-radius:10px;
  padding:11px 15px;
  margin:4px;
  background:#0f766e;
  color:white;
  font-weight:bold;
  cursor:pointer;
  text-decoration:none;
}

button:hover,
.btn:hover{
  opacity:.9;
}

.light{
  background:#e5f7f4;
  color:#08645e;
}

.tabs{
  display:flex;
  flex-wrap:wrap;
  gap:7px;
  margin:20px 0;
}

.tab{
  background:white;
  color:#0f766e;
  border:1px solid #cbd5e1;
}

.tab.active{
  background:#0f766e;
  color:white;
}

.topic-layout{
  display:grid;
  grid-template-columns:
    minmax(220px,350px) 1fr;
  gap:20px;
}

.topic-image{
  width:100%;
  max-height:320px;
  object-fit:contain;
  border:1px solid #d9e2ec;
  border-radius:14px;
  background:white;
  padding:8px;
}

.easy{
  background:#effcf8;
  border:1px solid #b9eadf;
  padding:14px;
  border-radius:12px;
}

.practical{
  background:#eef4ff;
  border:1px solid #c8d8ff;
  padding:14px;
  border-radius:12px;
  margin-top:12px;
}

.result{
  background:white;
  padding:14px;
  margin:8px 0;
  border:1px solid #d9e2ec;
  border-radius:12px;
}

.success{
  background:#effcf8;
  padding:12px;
  border-radius:10px;
  border:1px solid #b9eadf;
  margin-top:10px;
}

.error{
  background:#fff0f0;
  padding:12px;
  border-radius:10px;
  border:1px solid #efb0b0;
  margin-top:10px;
}

.quiz{
  background:white;
  padding:15px;
  border:1px solid #d9e2ec;
  border-radius:14px;
  margin:12px 0;
}

.option{
  display:block;
  padding:10px;
  border:1px solid #d9e2ec;
  border-radius:8px;
  margin:7px 0;
}

footer{
  background:#102a43;
  color:white;
  padding:40px 0;
}

.upi{
  font-size:22px;
  font-weight:bold;
  color:#0f766e;
  margin:10px 0;
}

@media(max-width:700px){

  nav{
    display:none;
  }

  .topic-layout{
    grid-template-columns:1fr;
  }

}

</style>

</head>

<body>

<header>

<div class="nav">

<div class="logo">
🩺 NurseStudy
</div>

<nav>
<a href="#study">Study</a>
<a href="#community">Community</a>
<a href="#blood">Blood</a>
<a href="#quiz">Quiz</a>
<a href="#jobs">Jobs</a>
<a href="#donate">Donate</a>
</nav>

</div>

</header>

<section class="hero">

<div class="container">

<span class="badge">
🎓 Nursing Semester 1–7
</span>

<h1>
Learn Nursing.<br>
<span style="color:#0f766e">
Understand Practically.
</span>
</h1>

<p>
Theory + Easy Hindi/English + Practical +
Images + Viva + MCQ + Student Community
</p>

<input
id="search"
placeholder="Search Pneumonia, Anatomy, Diabetes..."
>

<button onclick="searchTopic()">
🔎 Search
</button>

<div id="searchResult"></div>

</div>

</section>

<section id="study">

<div class="container">

<h2>📚 Semester 1–7 Study Centre</h2>

<div class="tabs">

${semesters.map((s,i)=>`
<button
class="tab ${i===0?"active":""}"
onclick="semester(this,'${encodeURIComponent(s)}')"
>
${esc(s)}
</button>
`).join("")}

</div>

<div id="topics"></div>

</div>

</section>

<section id="community">

<div class="container">

<h2>👥 Nursing Student Community</h2>

<div class="grid">

<div class="card">

<h3>Create Student Profile</h3>

<input id="sn" placeholder="Name">
<input id="sp" placeholder="Phone">
<input id="su" placeholder="University">
<input id="sc" placeholder="College">
<input id="ss" placeholder="Semester">
<input id="sci" placeholder="City">

<button onclick="createStudent()">
Create Profile
</button>

<div id="studentMsg"></div>

</div>

<div class="card">

<h3>Find Students</h3>

<input
id="studentSearch"
placeholder="Name / College / City"
>

<button onclick="findStudents()">
Search
</button>

<div id="students"></div>

</div>

</div>

<div class="card">

<h3>💬 Ask Nursing Question</h3>

<input id="pn" placeholder="Name">
<input id="pu" placeholder="University">
<input id="ps" placeholder="Semester">
<input id="pt" placeholder="Topic">

<textarea
id="pm"
placeholder="Write your question..."
></textarea>

<button onclick="postQuestion()">
Post Question
</button>

<div id="postMsg"></div>

</div>

<div class="card">

<h3>Recent Questions</h3>

<div id="posts"></div>

</div>

</div>

</section>

<section id="blood">

<div class="container">

<h2>🩸 Blood Donor</h2>

<div class="grid">

<div class="card">

<h3>❤️ Become a Donor</h3>

<input id="dn" placeholder="Name">

<select id="dg">
<option value="">Blood Group</option>
<option>A+</option>
<option>A-</option>
<option>B+</option>
<option>B-</option>
<option>AB+</option>
<option>AB-</option>
<option>O+</option>
<option>O-</option>
</select>

<input id="dc" placeholder="City">
<input id="dp" placeholder="Phone">
<input id="da" placeholder="Availability">

<button onclick="donor()">
Register
</button>

<div id="donorMsg"></div>

</div>

<div class="card">

<h3>🔎 Find Donor</h3>

<select id="fg">
<option value="">Any Blood Group</option>
<option>A+</option>
<option>A-</option>
<option>B+</option>
<option>B-</option>
<option>AB+</option>
<option>AB-</option>
<option>O+</option>
<option>O-</option>
</select>

<input id="fc" placeholder="City">

<button onclick="findDonor()">
Find
</button>

<div id="donors"></div>

</div>

</div>

<div class="card">

<h3>🚨 Need Blood?</h3>

<input id="bn" placeholder="Patient / Requester Name">
<input id="bg" placeholder="Required Blood Group">
<input id="bc" placeholder="City">
<input id="bh" placeholder="Hospital">
<input id="bp" placeholder="Contact">

<select id="bu">
<option>Normal</option>
<option>Urgent</option>
<option>Emergency</option>
</select>

<textarea
id="bd"
placeholder="Additional details"
></textarea>

<button onclick="bloodRequest()">
Post Blood Request
</button>

<div id="bloodMsg"></div>

</div>

</div>

</section>

<section id="quiz">

<div class="container">

<h2>🎮 Nursing MCQ Quiz</h2>

<div class="card">

<input id="quizName" placeholder="Your Name">

<div id="quiz"></div>

<button onclick="submitQuiz()">
🏆 Submit Quiz
</button>

<div id="quizResult"></div>

</div>

<div class="card">

<h3>🏆 Leaderboard</h3>

<div id="leaderboard"></div>

</div>

</div>

</section>

<section id="jobs">

<div class="container">

<h2>🎓 Scholarships & 👩‍⚕️ Nursing Jobs</h2>

<div id="jobs" class="grid"></div>

</div>

</section>

<section id="donate">

<div class="container">

<h2>💰 Support NurseStudy</h2>

<div class="card">

<p>
Voluntary support ke liye UPI:
</p>

<div class="upi">
${UPI_ID}
</div>

<button onclick="copyUPI()">
📋 Copy UPI
</button>

<button onclick="openUPI()" class="light">
📱 Open UPI
</button>

<div id="upiMsg"></div>

</div>

</div>

</section>

<section>

<div class="container">

<h2>📚 Book / Study Help</h2>

<div class="card">

<input id="bookName" placeholder="Your Name">
<input id="bookSem" placeholder="Semester">
<input id="book" placeholder="Book / Subject">
<input id="bookContact" placeholder="Contact">

<textarea
id="bookMessage"
placeholder="What help do you need?"
></textarea>

<button onclick="bookHelp()">
Send Request
</button>

<div id="bookMsg"></div>

</div>

</div>

</section>

<footer>

<div class="container">

<h2>🩺 NurseStudy</h2>

<p>
Nursing Education • Practical Learning • Student Community
</p>

<p>
© 2026 NurseStudy
</p>

</div>

</footer>

<script>

let quizData=[];
let profile=null;

async function api(url,options={}){

  try{

    const r=await fetch(url,{
      ...options,
      headers:{
        "Content-Type":"application/json",
        ...(options.headers||{})
      }
    });

    return await r.json();

  }catch(e){

    return {
      success:false,
      error:"Server connection problem."
    };

  }

}

function msg(id,ok,text){

  const el=document.getElementById(id);

  if(!el)return;

  el.innerHTML=
    '<div class="'+
    (ok?"success":"error")+
    '">'+
    esc(text||"Something went wrong.")+
    '</div>';

}

async function loadSemester(s){

  const r=await api(
    "/api/semester/"+
    encodeURIComponent(s)
  );

  if(!r.success)return;

  document.getElementById("topics").innerHTML=
    r.topics.map((t,i)=>`

<article class="topic">

<h3>
${i+1}. ${esc(t.name)}
</h3>

<div class="topic-layout">

<div>

<img
class="topic-image"
src="${t.image}"
alt="${esc(t.name)}"
onerror="this.style.display='none'"
>

</div>

<div>

<p>
<b>📖 Theory:</b>
${esc(t.theory)}
</p>

<div class="easy">

<b>🗣️ Easy Hindi/English</b>

<p>
${esc(t.easy)}
</p>

</div>

<div class="practical">

<b>🧪 Practical</b>

<p>
${esc(t.practical)}
</p>

</div>

<br>

<button
class="light"
onclick="viva('${esc(t.name)}')"
>
🎤 Viva
</button>

<button
class="light"
onclick="revision('${esc(t.name)}')"
>
🧠 Revision
</button>

</div>

</div>

</article>

`).join("");

}

function semester(btn,s){

  document
    .querySelectorAll(".tab")
    .forEach(x=>x.classList.remove("active"));

  btn.classList.add("active");

  loadSemester(
    decodeURIComponent(s)
  );

}

async function searchTopic(){

  const q=document
    .getElementById("search")
    .value
    .trim();

  if(!q){
    document.getElementById("searchResult").innerHTML="";
    return;
  }

  const r=await api(
    "/api/topics?q="+
    encodeURIComponent(q)
  );

  if(!r.success)return;

  document.getElementById("searchResult").innerHTML=
    "<h3>🔎 Search Results</h3>"+
    (
      r.topics.length
      ?
      r.topics.map(t=>`

<div class="result">

<span class="badge">
${esc(t.semester)}
</span>

<h3>${esc(t.name)}</h3>

<p>
<b>Theory:</b>
${esc(t.theory)}
</p>

<div class="easy">
<b>Easy:</b>
${esc(t.easy)}
</div>

<div class="practical">
<b>Practical:</b>
${esc(t.practical)}
</div>

</div>

`).join("")
      :
      "<div class='result'>No topic found.</div>"
    );

}

function viva(topic){

  alert(
`VIVA REVISION

Topic: ${topic}

1. Define the topic.
2. Causes / risk factors?
3. Signs and symptoms?
4. Diagnosis?
5. Treatment?
6. Nursing management?
7. Complications?
8. Patient education?`
  );

}

function revision(topic){

  alert(
`QUICK REVISION

${topic}

Definition
Causes / Risk Factors
Signs & Symptoms
Diagnosis
Treatment
Nursing Management
Complications
Health Education`
  );

}

async function createStudent(){

  const r=await api(
    "/api/students",
    {
      method:"POST",
      body:JSON.stringify({
        name:document.getElementById("sn").value,
        phone:document.getElementById("sp").value,
        university:document.getElementById("su").value,
        college:document.getElementById("sc").value,
        semester:document.getElementById("ss").value,
        city:document.getElementById("sci").value
      })
    }
  );

  msg(
    "studentMsg",
    r.success,
    r.message||r.error
  );

  if(r.success){
    profile=r.student;
    localStorage.setItem(
      "nurseStudyProfile",
      JSON.stringify(profile)
    );
  }

}

async function findStudents(){

  const q=document
    .getElementById("studentSearch")
    .value;

  const r=await api(
    "/api/students?q="+
    encodeURIComponent(q)
  );

  const el=document.getElementById("students");

  if(!r.success)return;

  el.innerHTML=
    r.students.length
    ?
    r.students.map(s=>`

<div class="result">

<b>👤 ${esc(s.name)}</b>

<p>
${esc(s.university||"")}
<br>
${esc(s.college||"")}
<br>
${esc(s.semester||"")}
•
${esc(s.city||"")}
</p>

</div>

`).join("")
    :
    "<div class='result'>No students found.</div>";

}

async function postQuestion(){

  const r=await api(
    "/api/community",
    {
      method:"POST",
      body:JSON.stringify({
        name:document.getElementById("pn").value,
        university:document.getElementById("pu").value,
        semester:document.getElementById("ps").value,
        topic:document.getElementById("pt").value,
        message:document.getElementById("pm").value
      })
    }
  );

  msg(
    "postMsg",
    r.success,
    r.message||r.error
  );

  if(r.success){

    document.getElementById("pm").value="";

    loadPosts();

  }

}

async function loadPosts(){

  const r=await api("/api/community");

  if(!r.success)return;

  document.getElementById("posts").innerHTML=
    r.posts.length
    ?
    r.posts.map(p=>`

<div class="result">

<b>
${esc(p.name)}
</b>

<p>
<b>
${esc(p.topic||"Question")}
</b>
</p>

<p>
${esc(p.message)}
</p>

</div>

`).join("")
    :
    "<div class='result'>No questions yet.</div>";

}

async function donor(){

  const r=await api(
    "/api/blood-donor",
    {
      method:"POST",
      body:JSON.stringify({
        name:document.getElementById("dn").value,
        bloodGroup:document.getElementById("dg").value,
        city:document.getElementById("dc").value,
        phone:document.getElementById("dp").value,
        availability:document.getElementById("da").value
      })
    }
  );

  msg(
    "donorMsg",
    r.success,
    r.message||r.error
  );

}

async function findDonor(){

  const g=document.getElementById("fg").value;
  const c=document.getElementById("fc").value;

  const r=await api(
    "/api/blood-donors?group="+
    encodeURIComponent(g)+
    "&city="+
    encodeURIComponent(c)
  );

  if(!r.success)return;

  document.getElementById("donors").innerHTML=
    r.donors.length
    ?
    r.donors.map(d=>`

<div class="result">

<b>
🩸 ${esc(d.bloodGroup)}
</b>

<p>
${esc(d.name)}
<br>
${esc(d.city)}
</p>

</div>

`).join("")
    :
    "<div class='result'>No donor found.</div>";

}

async function bloodRequest(){

  const r=await api(
    "/api/blood-request",
    {
      method:"POST",
      body:JSON.stringify({
        name:document.getElementById("bn").value,
        bloodGroup:document.getElementById("bg").value,
        city:document.getElementById("bc").value,
        hospital:document.getElementById("bh").value,
        phone:document.getElementById("bp").value,
        urgency:document.getElementById("bu").value,
        details:document.getElementById("bd").value
      })
    }
  );

  msg(
    "bloodMsg",
    r.success,
    r.message||r.error
  );

}

async function loadQuiz(){

  const r=await api("/api/quiz");

  if(!r.success)return;

  quizData=r.questions;

  document.getElementById("quiz").innerHTML=
    quizData.map((q,i)=>`

<div class="quiz">

<b>
${i+1}. ${esc(q.question)}
</b>

${q.options.map((o,j)=>`

<label class="option">

<input
type="radio"
name="q${i}"
value="${j}"
>

${esc(o)}

</label>

`).join("")}

</div>

`).join("");

}

async function submitQuiz(){

  const name=document
    .getElementById("quizName")
    .value
    .trim();

  if(!name){
    alert("Pehle name enter karo.");
    return;
  }

  const answers=quizData.map((q,i)=>{

    const x=document.querySelector(
      'input[name="q'+i+'"]:checked'
    );

    return x?Number(x.value):-1;

  });

  const r=await api(
    "/api/quiz/submit",
    {
      method:"POST",
      body:JSON.stringify({
        name,
        answers
      })
    }
  );

  if(!r.success){
    msg(
      "quizResult",
      false,
      r.error
    );
    return;
  }

  document.getElementById("quizResult").innerHTML=`

<div class="success">

🏆 <b>
Score:
${r.result.score}/${r.result.total}
</b>

<br>

Percentage:
${r.result.percentage}%

<br><br>

${esc(r.message)}

<br><br>

Quiz Result ID:
<b>${esc(r.result.id)}</b>

</div>

`;

  loadLeaderboard();

}

async function loadLeaderboard(){

  const r=await api(
    "/api/leaderboard"
  );

  if(!r.success)return;

  document.getElementById("leaderboard").innerHTML=
    r.leaderboard.length
    ?
    r.leaderboard.map((x,i)=>`

<div class="result">

<b>
#${i+1} ${esc(x.name)}
</b>

<br>

${x.score}/${x.total}
•
${x.percentage}%

</div>

`).join("")
    :
    "<div class='result'>No results yet.</div>";

}

async function loadJobs(){

  const r=await api(
    "/api/opportunities"
  );

  if(!r.success)return;

  document.getElementById("jobs").innerHTML=
    r.opportunities.map(x=>`

<div class="card">

<span class="badge">
${esc(x.category)}
</span>

<h3>
${esc(x.title)}
</h3>

<p>
${esc(x.description)}
</p>

<a
class="btn"
href="${x.url}"
target="_blank"
rel="noopener noreferrer"
>
🌐 Official Website
</a>

</div>

`).join("");

}

function copyUPI(){

  if(navigator.clipboard){
    navigator.clipboard.writeText(
      "${UPI_ID}"
    );
  }

  document.getElementById("upiMsg").innerHTML=
    '<div class="success">UPI ID copied: <b>'+
    "${UPI_ID}"+
    '</b></div>';

}

function openUPI(){

  location.href=
    "upi://pay?pa=${UPI_ID}&pn=NurseStudy&cu=INR";

}

async function bookHelp(){

  const r=await api(
    "/api/book-request",
    {
      method:"POST",
      body:JSON.stringify({
        name:document.getElementById("bookName").value,
        semester:document.getElementById("bookSem").value,
        book:document.getElementById("book").value,
        contact:document.getElementById("bookContact").value,
        message:document.getElementById("bookMessage").value
      })
    }
  );

  msg(
    "bookMsg",
    r.success,
    r.message||r.error
  );

}

function esc(v){

  return String(v||"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}

/* START */

try{

  const p=
    localStorage.getItem(
      "nurseStudyProfile"
    );

  if(p){
    profile=JSON.parse(p);
  }

}catch(e){}

loadSemester(
  "${encodeURIComponent(semesters[0])}"
);

loadPosts();
loadQuiz();
loadLeaderboard();
loadJobs();

</script>

</body>
</html>
`;
}

/* =========================================================
   WEBSITE ROUTE
========================================================= */

app.get("/", (req, res) => {
  res.send(page());
});

/* STATUS */

app.get("/status", (req, res) => {
  res.json({
    success: true,
    service: "NurseStudy",
    status: "running"
  });
});

/* API 404 */

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found"
  });
});

/* =========================================================
   SERVER START
========================================================= */

app.listen(PORT, "0.0.0.0", () => {

  console.log("=================================");
  console.log("🩺 NurseStudy Started");
  console.log("PORT:", PORT);
  console.log("=================================");

});