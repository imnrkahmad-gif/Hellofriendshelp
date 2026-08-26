const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const UPI_ID = "7763082034@kotak";
const DATA_FILE = path.join(__dirname, "nursestudy-data.json");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   DATABASE
========================= */

const emptyDB = {
  students: [],
  community: [],
  donors: [],
  bloodRequests: [],
  quizResults: [],
  prizeClaims: [],
  contacts: [],
  bookRequests: []
};

function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return {
        ...emptyDB,
        ...JSON.parse(
          fs.readFileSync(DATA_FILE, "utf8")
        )
      };
    }
  } catch (e) {
    console.log("DB read error:", e.message);
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
    console.log("DB save error:", e.message);
  }
}

function id(prefix) {
  return (
    prefix +
    "_" +
    crypto.randomBytes(6).toString("hex")
  );
}

function clean(value, max = 500) {
  return String(value || "")
    .trim()
    .slice(0, max);
}


/* =========================
   STUDY DATA
========================= */

const STUDY = {

  "1st Semester": [
    {
      name: "Anatomy",
      theory:
        "Anatomy is the study of the structure of the human body.",
      easy:
        "Anatomy me body ke different parts aur unki structure ko samjha jata hai.",
      practical:
        "Skeleton par skull, clavicle, scapula, humerus, radius, ulna, ribs, pelvis, femur, tibia aur fibula identify karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Human_skeleton_front_en.svg",
      labels: [
        "Skull",
        "Clavicle",
        "Scapula",
        "Humerus",
        "Radius",
        "Ulna",
        "Ribs",
        "Pelvis",
        "Femur",
        "Tibia",
        "Fibula"
      ]
    },
    {
      name: "Physiology",
      theory:
        "Physiology is the study of normal functions of the human body.",
      easy:
        "Body ke organs normally kaise kaam karte hain, ye Physiology hai.",
      practical:
        "Pulse, respiration, blood pressure aur basic physiological observations practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Diagram_of_the_human_heart.svg",
      labels: [
        "Heart",
        "Blood flow",
        "Circulation"
      ]
    },
    {
      name: "Fundamentals of Nursing",
      theory:
        "Fundamentals of Nursing covers basic principles and skills required for safe patient care.",
      easy:
        "Nursing ki basic foundation aur patient-care skills.",
      practical:
        "Hand hygiene, bed making, positioning, vital signs aur documentation.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hand_washing.svg",
      labels: [
        "Hand Hygiene",
        "Patient Safety",
        "PPE"
      ]
    },
    {
      name: "Nutrition",
      theory:
        "Nutrition is the study of nutrients required for energy, growth and repair.",
      easy:
        "Body ko required food aur nutrients dena Nutrition hai.",
      practical:
        "Balanced diet chart aur nutritional assessment.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/MyPlate.svg",
      labels: [
        "Protein",
        "Carbohydrate",
        "Fat",
        "Vitamins",
        "Minerals"
      ]
    }
  ],

  "2nd Semester": [
    {
      name: "Microbiology",
      theory:
        "Microbiology is the study of microorganisms.",
      easy:
        "Bacteria, viruses aur fungi jaise microorganisms ka study.",
      practical:
        "Specimen handling, microscope principles aur infection control.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Bacteria.svg",
      labels: [
        "Bacteria",
        "Virus",
        "Fungi"
      ]
    },
    {
      name: "Pharmacology",
      theory:
        "Pharmacology is the study of medicines and their effects.",
      easy:
        "Medicines kya karti hain aur unki safety ka study.",
      practical:
        "Medication safety, routes aur basic drug calculations.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Pills.jpg",
      labels: [
        "Tablet",
        "Capsule",
        "Dose",
        "Route"
      ]
    },
    {
      name: "Pathology",
      theory:
        "Pathology is the study of disease processes.",
      easy:
        "Disease ki wajah se body me kya changes hote hain.",
      practical:
        "Specimen collection aur laboratory reports.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Red_White_Blood_cells.jpg",
      labels: [
        "RBC",
        "WBC",
        "Specimen"
      ]
    }
  ],

  "3rd Semester": [
    {
      name: "Medical Surgical Nursing",
      theory:
        "Medical Surgical Nursing deals with nursing care of adults with medical and surgical conditions.",
      easy:
        "Adult patients ki diseases aur surgery me nursing care.",
      practical:
        "Assessment, medication, wound care aur monitoring.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Nurse_patient.jpg",
      labels: [
        "Assessment",
        "Care Plan",
        "Monitoring"
      ]
    },
    {
      name: "Hypertension",
      theory:
        "Hypertension means persistently elevated blood pressure.",
      easy:
        "Blood pressure repeatedly high rehna hypertension hai.",
      practical:
        "Correct BP measurement aur recording.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_pressure_monitor.jpg",
      labels: [
        "Systolic",
        "Diastolic",
        "Cuff"
      ]
    },
    {
      name: "Diabetes Mellitus",
      theory:
        "Diabetes mellitus is a metabolic disorder involving elevated blood glucose.",
      easy:
        "Blood sugar control me problem hona diabetes hai.",
      practical:
        "Glucometer, foot care aur medication safety.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_glucose_meter.jpg",
      labels: [
        "Glucometer",
        "Blood Glucose",
        "Foot Care"
      ]
    },
    {
      name: "Pneumonia",
      theory:
        "Pneumonia is infection or inflammation of lung tissue.",
      easy:
        "Lungs me infection ki wajah se cough, fever aur breathing problem ho sakti hai.",
      practical:
        "Respiratory assessment, oxygen safety aur prescribed nebulization principles.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg",
      labels: [
        "Trachea",
        "Bronchi",
        "Lungs"
      ]
    }
  ],

  "4th Semester": [
    {
      name: "Child Health Nursing",
      theory:
        "Child Health Nursing focuses on infants, children and adolescents.",
      easy:
        "Bachchon ki physical, mental aur developmental needs ka care.",
      practical:
        "Growth chart, pediatric assessment aur immunization history.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Child_growth_chart.svg",
      labels: [
        "Growth",
        "Development",
        "Immunization"
      ]
    },
    {
      name: "Pneumonia in Children",
      theory:
        "Childhood pneumonia affects the lower respiratory tract.",
      easy:
        "Bachche me pneumonia ke saath cough, fever aur fast breathing ho sakti hai.",
      practical:
        "Respiratory assessment aur danger signs.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg",
      labels: [
        "Lungs",
        "Breathing",
        "Chest"
      ]
    },
    {
      name: "Community Health Nursing",
      theory:
        "Community Health Nursing focuses on prevention and health promotion.",
      easy:
        "Community ki health improve aur disease prevent karna.",
      practical:
        "Home visit, survey aur health education.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Community_health_workers.jpg",
      labels: [
        "Community",
        "Family",
        "Home Visit"
      ]
    }
  ],

  "5th Semester": [
    {
      name: "Community Health Nursing",
      theory:
        "Community Health Nursing includes assessment, planning, implementation and evaluation of community care.",
      easy:
        "Community ki health needs identify karke prevention aur health promotion karna.",
      practical:
        "Home visit, family folder, survey aur health talk.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Community_health_workers.jpg",
      labels: [
        "Home Visit",
        "Family",
        "Health Education"
      ]
    },
    {
      name: "Communicable Diseases",
      theory:
        "Communicable diseases can spread through infectious agents.",
      easy:
        "Infectious diseases different transmission routes se spread ho sakti hain.",
      practical:
        "Chain of infection, PPE, isolation aur prevention.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Influenza_virus_particles.jpg",
      labels: [
        "Agent",
        "Transmission",
        "Host"
      ]
    },
    {
      name: "Mental Health Nursing",
      theory:
        "Mental Health Nursing provides safe and therapeutic care.",
      easy:
        "Mental health problems wale patient ko safe aur therapeutic care.",
      practical:
        "Mental status examination aur therapeutic communication.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg",
      labels: [
        "Mood",
        "Thought",
        "Perception"
      ]
    },
    {
      name: "Schizophrenia",
      theory:
        "Schizophrenia is a serious mental disorder affecting thinking and perception.",
      easy:
        "Thinking, perception aur behaviour me significant disturbance ho sakti hai.",
      practical:
        "Mental status assessment aur safety precautions.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg",
      labels: [
        "Thought",
        "Hallucination",
        "Delusion"
      ]
    },
    {
      name: "Depression",
      theory:
        "Depression involves persistent low mood or loss of interest.",
      easy:
        "Long time tak sadness ya interest kam hona depression ka feature ho sakta hai.",
      practical:
        "Mood assessment, therapeutic communication aur suicide-risk awareness.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg",
      labels: [
        "Mood",
        "Sleep",
        "Interest"
      ]
    }
  ],

  "6th Semester": [
    {
      name: "Nursing Research",
      theory:
        "Nursing research systematically investigates nursing-related questions.",
      easy:
        "Nursing problems ka scientific answer dhundhna.",
      practical:
        "Research problem, objectives, sampling aur data collection.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Researcher_at_work.jpg",
      labels: [
        "Research",
        "Sample",
        "Data"
      ]
    },
    {
      name: "Nursing Education",
      theory:
        "Nursing education involves teaching and learning processes.",
      easy:
        "Nursing students ya patients ko effective tarike se sikhana.",
      practical:
        "Lesson plan, teaching method aur evaluation.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Classroom.jpg",
      labels: [
        "Teaching",
        "Learning",
        "Evaluation"
      ]
    },
    {
      name: "Leadership",
      theory:
        "Leadership is the ability to guide people toward common goals.",
      easy:
        "Team ko direction dena aur goal achieve karwana.",
      practical:
        "Delegation, communication aur teamwork.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Teamwork.jpg",
      labels: [
        "Leader",
        "Team",
        "Delegation"
      ]
    }
  ],

  "7th Semester": [
    {
      name: "Advanced Nursing Practice",
      theory:
        "Advanced nursing practice involves advanced assessment and evidence-based care.",
      easy:
        "Detailed assessment aur evidence ke basis par advanced nursing care.",
      practical:
        "Advanced assessment, clinical reasoning aur care planning.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Nurse_patient.jpg",
      labels: [
        "Assessment",
        "Clinical Reasoning",
        "Care Plan"
      ]
    },
    {
      name: "Nursing Administration",
      theory:
        "Nursing administration involves management of nursing services.",
      easy:
        "Nursing staff, resources aur services ko manage karna.",
      practical:
        "Planning, staffing, supervision aur delegation.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hospital_nurse_station.jpg",
      labels: [
        "Planning",
        "Staffing",
        "Supervision"
      ]
    },
    {
      name: "Clinical Practice",
      theory:
        "Clinical practice applies nursing knowledge and skills in healthcare settings.",
      easy:
        "Theory ko actual patient care me safely apply karna.",
      practical:
        "Assessment, procedures, documentation aur patient safety.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Nurse_patient.jpg",
      labels: [
        "Procedure",
        "Safety",
        "Documentation"
      ]
    }
  ]

};


/* =========================
   QUIZ
========================= */

const QUIZ = [
  {
    q: "Normal adult pulse rate is approximately?",
    options: [
      "20–40/min",
      "60–100/min",
      "120–160/min",
      "180–220/min"
    ],
    answer: 1
  },
  {
    q: "Anatomy is the study of?",
    options: [
      "Body structure",
      "Weather",
      "Food prices",
      "Only medicines"
    ],
    answer: 0
  },
  {
    q: "Pneumonia mainly affects the?",
    options: [
      "Lungs",
      "Hair",
      "Nails",
      "Teeth"
    ],
    answer: 0
  },
  {
    q: "Which is important for infection prevention?",
    options: [
      "Hand hygiene",
      "Ignoring PPE",
      "Sharing needles",
      "Skipping cleaning"
    ],
    answer: 0
  },
  {
    q: "Hallucination means?",
    options: [
      "Perception without external stimulus",
      "High BP",
      "Fracture",
      "Fever"
    ],
    answer: 0
  },
  {
    q: "Which is a non-communicable disease?",
    options: [
      "Tuberculosis",
      "Measles",
      "Hypertension",
      "Chickenpox"
    ],
    answer: 2
  },
  {
    q: "Kangaroo Mother Care mainly includes?",
    options: [
      "Skin-to-skin contact",
      "Cold bathing",
      "Isolation",
      "Bed rest"
    ],
    answer: 0
  },
  {
    q: "Patient confidentiality means?",
    options: [
      "Sharing records publicly",
      "Protecting private information",
      "Posting records online",
      "Ignoring records"
    ],
    answer: 1
  }
];


/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {

  res.json({
    success: true,
    status: "running",
    service: "NurseStudy",
    time: new Date().toISOString()
  });

});


/* =========================
   STUDY API
========================= */

app.get("/api/semesters", (req, res) => {

  res.json({
    success: true,
    semesters: Object.keys(STUDY)
  });

});


app.get("/api/semester/:semester", (req, res) => {

  const semester =
    decodeURIComponent(req.params.semester);

  if (!STUDY[semester]) {

    return res.status(404).json({
      success: false,
      error: "Semester not found"
    });

  }

  res.json({
    success: true,
    semester,
    topics: STUDY[semester]
  });

});


app.get("/api/topics", (req, res) => {

  const q =
    clean(req.query.q, 100).toLowerCase();

  const results = [];

  Object.keys(STUDY).forEach(semester => {

    STUDY[semester].forEach(topic => {

      const text = (
        semester +
        " " +
        topic.name +
        " " +
        topic.theory +
        " " +
        topic.easy +
        " " +
        topic.practical +
        " " +
        topic.labels.join(" ")
      ).toLowerCase();

      if (!q || text.includes(q)) {

        results.push({
          semester,
          ...topic
        });

      }

    });

  });

  res.json({
    success: true,
    topics: results.slice(0, 100)
  });

});


/* =========================
   STUDENT PROFILE
========================= */

app.post("/api/students", (req, res) => {

  const student = {

    id: id("student"),

    name: clean(req.body.name, 80),

    phone: clean(req.body.phone, 30),

    university:
      clean(req.body.university, 150),

    college:
      clean(req.body.college, 150),

    semester:
      clean(req.body.semester, 50),

    city:
      clean(req.body.city, 80),

    createdAt:
      new Date().toISOString()

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
    message: "Student profile created.",
    student
  });

});


app.get("/api/students", (req, res) => {

  const q =
    clean(req.query.q, 100).toLowerCase();

  let list = db.students;

  if (q) {

    list = list.filter(student => {

      const text = (
        student.name +
        " " +
        student.university +
        " " +
        student.college +
        " " +
        student.semester +
        " " +
        student.city
      ).toLowerCase();

      return text.includes(q);

    });

  }

  res.json({
    success: true,
    students:
      list
        .slice(-100)
        .reverse()
  });

});


/* =========================
   COMMUNITY
========================= */

app.get("/api/community", (req, res) => {

  res.json({
    success: true,
    posts:
      db.community
        .slice(-100)
        .reverse()
  });

});


app.post("/api/community", (req, res) => {

  const post = {

    id: id("post"),

    name:
      clean(req.body.name, 80),

    university:
      clean(req.body.university, 150),

    semester:
      clean(req.body.semester, 50),

    topic:
      clean(req.body.topic, 150),

    message:
      clean(req.body.message, 1000),

    createdAt:
      new Date().toISOString()

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
    message: "Question posted.",
    post
  });

});


/* =========================
   CONTACT
========================= */

app.post("/api/contact-request", (req, res) => {

  const request = {

    id: id("contact"),

    fromId:
      clean(req.body.fromId, 100),

    toId:
      clean(req.body.toId, 100),

    message:
      clean(req.body.message, 500),

    status: "pending",

    createdAt:
      new Date().toISOString()

  };

  if (
    !request.fromId ||
    !request.toId ||
    request.fromId === request.toId
  ) {

    return res.status(400).json({
      success: false,
      error: "Invalid contact request."
    });

  }

  db.contacts.push(request);

  saveDB();

  res.json({
    success: true,
    message: "Contact request sent."
  });

});


app.get("/api/contact-requests/:id", (req, res) => {

  const studentId =
    clean(req.params.id, 100);

  res.json({
    success: true,
    requests:
      db.contacts.filter(
        x =>
          x.fromId === studentId ||
          x.toId === studentId
      )
  });

});


/* =========================
   BLOOD DONOR
========================= */

app.post("/api/blood-donor", (req, res) => {

  const donor = {

    id: id("donor"),

    name:
      clean(req.body.name, 80),

    bloodGroup:
      clean(req.body.bloodGroup, 10)
        .toUpperCase(),

    city:
      clean(req.body.city, 80),

    phone:
      clean(req.body.phone, 30),

    availability:
      clean(req.body.availability, 100),

    createdAt:
      new Date().toISOString()

  };

  const groups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
  ];

  if (
    !donor.name ||
    !groups.includes(donor.bloodGroup) ||
    !donor.city ||
    !donor.phone
  ) {

    return res.status(400).json({
      success: false,
      error:
        "Name, valid blood group, city and phone are required."
    });

  }

  db.donors.push(donor);

  saveDB();

  res.json({
    success: true,
    message:
      "Blood donor registration submitted."
  });

});


app.get("/api/blood-donors", (req, res) => {

  const group =
    clean(req.query.group, 10)
      .toUpperCase();

  const city =
    clean(req.query.city, 80)
      .toLowerCase();

  let donors = db.donors;

  if (group) {

    donors =
      donors.filter(
        d => d.bloodGroup === group
      );

  }

  if (city) {

    donors =
      donors.filter(
        d =>
          d.city
            .toLowerCase()
            .includes(city)
      );

  }

  res.json({
    success: true,
    donors:
      donors
        .slice(-100)
        .reverse()
  });

});


/* =========================
   BLOOD REQUEST
========================= */

app.post("/api/blood-request", (req, res) => {

  const request = {

    id: id("blood"),

    name:
      clean(req.body.name, 80),

    bloodGroup:
      clean(req.body.bloodGroup, 10)
        .toUpperCase(),

    city:
      clean(req.body.city, 80),

    hospital:
      clean(req.body.hospital, 150),

    phone:
      clean(req.body.phone, 30),

    urgency:
      clean(req.body.urgency, 30),

    details:
      clean(req.body.details, 600),

    status: "open",

    createdAt:
      new Date().toISOString()

  };

  if (
    !request.name ||
    !request.bloodGroup ||
    !request.city ||
    !request.phone
  ) {

    return res.status(400).json({
      success: false,
      error:
        "Name, blood group, city and phone are required."
    });

  }

  db.bloodRequests.push(request);

  saveDB();

  res.json({
    success: true,
    message:
      "Blood request posted."
  });

});


app.get("/api/blood-requests", (req, res) => {

  res.json({
    success: true,
    requests:
      db.bloodRequests
        .filter(x => x.status === "open")
        .slice(-100)
        .reverse()
  });

});


/* =========================
   QUIZ
========================= */

app.get("/api/quiz", (req, res) => {

  res.json({
    success: true,
    questions:
      QUIZ.map((q, index) => ({
        id: index,
        question: q.q,
        options: q.options
      }))
  });

});


app.post("/api/quiz/submit", (req, res) => {

  const name =
    clean(req.body.name, 80);

  const answers =
    Array.isArray(req.body.answers)
      ? req.body.answers
      : [];

  if (!name) {

    return res.status(400).json({
      success: false,
      error: "Name is required."
    });

  }

  let score = 0;

  QUIZ.forEach((q, index) => {

    if (
      Number(answers[index]) ===
      q.answer
    ) {
      score++;
    }

  });

  const percentage =
    Math.round(
      score * 100 / QUIZ.length
    );

  const result = {

    id: id("quiz"),

    name,

    score,

    total: QUIZ.length,

    percentage,

    createdAt:
      new Date().toISOString()

  };

  db.quizResults.push(result);

  saveDB();

  res.json({
    success: true,
    result,
    message:
      percentage >= 80
        ? "Excellent score! Prize/bonus claim can be submitted for verification."
        : "Good attempt. Keep practicing."
  });

});


app.get("/api/leaderboard", (req, res) => {

  res.json({
    success: true,
    leaderboard:
      [...db.quizResults]
        .sort(
          (a, b) =>
            b.percentage -
              a.percentage ||
            b.score - a.score
        )
        .slice(0, 20)
  });

});


/* =========================
   PRIZE
========================= */

app.post("/api/prize-claim", (req, res) => {

  const claim = {

    id: id("prize"),

    name:
      clean(req.body.name, 80),

    contact:
      clean(req.body.contact, 60),

    quizId:
      clean(req.body.quizId, 100),

    message:
      clean(req.body.message, 600),

    status: "pending",

    createdAt:
      new Date().toISOString()

  };

  if (!claim.name || !claim.contact) {

    return res.status(400).json({
      success: false,
      error:
        "Name and contact are required."
    });

  }

  db.prizeClaims.push(claim);

  saveDB();

  res.json({
    success: true,
    message:
      "Prize claim submitted for verification."
  });

});


/* =========================
   SCHOLARSHIP + JOBS
========================= */

app.get("/api/opportunities", (req, res) => {

  res.json({
    success: true,

    opportunities: [

      {
        title:
          "National Scholarship Portal",

        category:
          "Scholarship",

        description:
          "Government scholarship information and applications.",

        url:
          "https://scholarships.gov.in/"
      },

      {
        title:
          "Baba Farid University of Health Sciences",

        category:
          "University",

        description:
          "Official BFUHS website.",

        url:
          "https://bfuhs.ac.in/"
      },

      {
        title:
          "AIIMS",

        category:
          "Nursing Vacancy",

        description:
          "Official AIIMS examination and recruitment information.",

        url:
          "https://www.aiimsexams.ac.in/"
      },

      {
        title:
          "National Health Mission",

        category:
          "Government Jobs",

        description:
          "Official health programme information.",

        url:
          "https://nhm.gov.in/"
      },

      {
        title:
          "Employment News",

        category:
          "Government Jobs",

        description:
          "Government employment information.",

        url:
          "https://employmentnews.gov.in/"
      }

    ]

  });

});


/* =========================
   UNIVERSITY
========================= */

app.get("/api/universities", (req, res) => {

  const q =
    clean(req.query.q, 100)
      .toLowerCase();

  const universities = [

    {
      name:
        "Baba Farid University of Health Sciences",

      state:
        "Punjab",

      official:
        "https://bfuhs.ac.in/"
    },

    {
      name:
        "All India Institute of Medical Sciences",

      state:
        "India",

      official:
        "https://www.aiims.edu/"
    }

  ];

  const result =
    universities.filter(
      u =>
        !q ||
        (
          u.name +
          " " +
          u.state
        )
          .toLowerCase()
          .includes(q)
    );

  res.json({
    success: true,
    universities: result
  });

});


/* =========================
   BOOK REQUEST
========================= */

app.post("/api/book-request", (req, res) => {

  const request = {

    id: id("book"),

    name:
      clean(req.body.name, 80),

    semester:
      clean(req.body.semester, 50),

    book:
      clean(req.body.book, 200),

    contact:
      clean(req.body.contact, 60),

    message:
      clean(req.body.message, 600),

    createdAt:
      new Date().toISOString()

  };

  if (!request.name || !request.book) {

    return res.status(400).json({
      success: false,
      error:
        "Name and subject/book are required."
    });

  }

  db.bookRequests.push(request);

  saveDB();

  res.json({
    success: true,
    message:
      "Study help request submitted."
  });

});


/* =========================
   DONATION
========================= */

app.get("/api/donation", (req, res) => {

  res.json({
    success: true,
    upi: UPI_ID,
    name: "NurseStudy",
    currency: "INR"
  });

});


/* =========================
   WEBSITE
========================= */

/*
   IMPORTANT:
   Ye server tumhari existing index.html ko serve karega.
*/

const publicPath =
  path.join(__dirname);

app.use(
  express.static(publicPath)
);


app.get("/", (req, res) => {

  const indexFile =
    path.join(
      __dirname,
      "index.html"
    );

  if (fs.existsSync(indexFile)) {

    return res.sendFile(indexFile);

  }

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>NurseStudy</title>
<meta name="viewport"
content="width=device-width,initial-scale=1">
<style>
body{
font-family:Arial;
background:#f3fafc;
padding:30px;
text-align:center;
}
.card{
background:white;
padding:30px;
border-radius:20px;
max-width:600px;
margin:auto;
box-shadow:0 5px 25px #0001;
}
h1{color:#087c75}
</style>
</head>
<body>
<div class="card">
<h1>🩺 NurseStudy</h1>
<p>Server is running successfully.</p>
<p>Please upload your index.html file.</p>
</div>
</body>
</html>
`);

});


/* =========================
   404 API
========================= */

app.use("/api", (req, res) => {

  res.status(404).json({
    success: false,
    error: "API route not found."
  });

});


/* =========================
   SERVER START
========================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "================================"
    );

    console.log(
      "🩺 NurseStudy Server Started"
    );

    console.log(
      "PORT:",
      PORT
    );

    console.log(
      "UPI:",
      UPI_ID
    );

    console.log(
      "================================"
    );

  }
);