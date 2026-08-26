const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const UPI_ID = "7763082034@kotak";
const DB_FILE = path.join(__dirname, "nursestudy-data.json");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

function makeId(prefix) {
  return prefix + "_" + crypto.randomBytes(6).toString("hex");
}

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    }
  } catch (error) {
    console.log("Database read error:", error.message);
  }

  return {
    students: [],
    community: [],
    contacts: [],
    donors: [],
    bloodRequests: [],
    quizResults: [],
    prizeClaims: [],
    bookRequests: []
  };
}

let database = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(database, null, 2),
      "utf8"
    );
  } catch (error) {
    console.log("Database save error:", error.message);
  }
}

/* =========================================================
   NURSING STUDY DATA
   Semester 1 to 7
   Theory + Easy Hindi/English + Practical + Image
========================================================= */

const STUDY_DATA = {

  "1st Semester": [

    {
      name: "Anatomy",
      theory:
        "Anatomy is the study of the structure of the human body and its parts.",
      easy:
        "Anatomy ka matlab body ke different parts aur unki structure ko samajhna hai.",
      practical:
        "Skeleton model par skull, clavicle, scapula, humerus, radius, ulna, ribs, pelvis, femur, tibia aur fibula identify karein.",
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
        "Physiology me hum dekhte hain ki body ke organs normally kaise kaam karte hain.",
      practical:
        "Pulse, respiration, blood pressure aur basic physiological observations demonstrate karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Diagram_of_the_human_heart.svg",
      labels: [
        "Heart",
        "Circulation",
        "Blood flow"
      ]
    },

    {
      name: "Fundamentals of Nursing",
      theory:
        "Fundamentals of Nursing covers basic principles and skills required for safe patient care.",
      easy:
        "Ye nursing ki basic foundation hai jisme patient care ke important skills sikhte hain.",
      practical:
        "Hand hygiene, bed making, positioning, vital signs aur basic documentation practice karein.",
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
        "Nutrition is the study of nutrients required for energy, growth, repair and normal body functions.",
      easy:
        "Nutrition ka matlab body ko required food aur nutrients dena hai.",
      practical:
        "Food groups, balanced diet chart aur nutritional assessment practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/MyPlate.svg",
      labels: [
        "Carbohydrate",
        "Protein",
        "Fat",
        "Vitamins",
        "Minerals"
      ]
    },

    {
      name: "Psychology",
      theory:
        "Psychology is the study of behaviour and mental processes.",
      easy:
        "Psychology me human behaviour, thinking aur emotions ko samjha jata hai.",
      practical:
        "Basic observation, communication aur behaviour assessment practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg",
      labels: [
        "Brain",
        "Behaviour",
        "Emotion"
      ]
    },

    {
      name: "Sociology",
      theory:
        "Sociology is the study of society, relationships and social behaviour.",
      easy:
        "Sociology me family, society aur culture ka study hota hai.",
      practical:
        "Family assessment aur community observation practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Family_Portrait.svg",
      labels: [
        "Family",
        "Society",
        "Culture"
      ]
    }

  ],

  "2nd Semester": [

    {
      name: "Microbiology",
      theory:
        "Microbiology is the study of microorganisms such as bacteria, viruses and fungi.",
      easy:
        "Microbiology me germs aur microorganisms ko samjha jata hai.",
      practical:
        "Microscope principles, specimen handling aur infection-control practices practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Bacteria.svg",
      labels: [
        "Bacteria",
        "Virus",
        "Fungi",
        "Microorganism"
      ]
    },

    {
      name: "Pharmacology",
      theory:
        "Pharmacology is the study of medicines, their actions and adverse effects.",
      easy:
        "Pharmacology me medicines kya karti hain aur nurse ko kya precautions rakhne hain ye study hota hai.",
      practical:
        "Medication safety, routes of administration aur basic drug calculations practice karein.",
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
        "Pathology is the study of disease processes and changes in tissues and organs.",
      easy:
        "Disease ki wajah se body me kya changes hote hain, pathology me ye study hota hai.",
      practical:
        "Basic specimen collection aur laboratory reports ko samajhne ki practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Red_White_Blood_cells.jpg",
      labels: [
        "RBC",
        "WBC",
        "Specimen"
      ]
    },

    {
      name: "Health Assessment",
      theory:
        "Health assessment is systematic collection of information about a patient's health.",
      easy:
        "Patient ki condition ko step-by-step check karna health assessment hai.",
      practical:
        "General examination, vital signs aur system-wise assessment practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_pressure_measurement.jpg",
      labels: [
        "BP",
        "Pulse",
        "Respiration"
      ]
    },

    {
      name: "First Aid",
      theory:
        "First aid is immediate care given to an injured or ill person before definitive treatment.",
      easy:
        "Emergency me doctor ke treatment se pehle di jane wali safe immediate help first aid hai.",
      practical:
        "CPR principles, bleeding control, recovery position aur emergency response practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/CPR_training.jpg",
      labels: [
        "CPR",
        "Airway",
        "Emergency"
      ]
    }

  ],

  "3rd Semester": [

    {
      name: "Medical Surgical Nursing",
      theory:
        "Medical Surgical Nursing deals with nursing care of adults with medical and surgical conditions.",
      easy:
        "Adult patient ki different diseases aur surgeries me nursing care ko study karte hain.",
      practical:
        "Patient assessment, medication administration, wound care aur monitoring practice karein.",
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
        "Blood pressure repeatedly normal se high rehna hypertension kehlata hai.",
      practical:
        "Correct BP measurement, cuff selection, patient positioning aur BP recording practice karein.",
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
        "Diabetes me blood sugar control karne me problem hoti hai.",
      practical:
        "Glucometer demonstration, foot-care teaching aur medication safety principles practice karein.",
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
        "Pneumonia me lungs me infection ki wajah se cough, fever aur breathing problem ho sakti hai.",
      practical:
        "Respiratory assessment, oxygen safety, positioning aur prescribed nebulization principles practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg",
      labels: [
        "Trachea",
        "Bronchi",
        "Lungs"
      ]
    },

    {
      name: "COPD",
      theory:
        "COPD is a chronic respiratory condition causing persistent airflow limitation.",
      easy:
        "COPD me long-term breathing problem hoti hai aur airflow limited ho sakta hai.",
      practical:
        "Respiratory assessment, oxygen safety aur inhaler-technique teaching practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg",
      labels: [
        "Lung",
        "Airway",
        "Bronchi"
      ]
    },

    {
      name: "Myocardial Infarction",
      theory:
        "Myocardial infarction is acute injury to heart muscle due to inadequate blood supply.",
      easy:
        "Heart muscle ko blood supply achanak kam ya block hone par serious heart injury ho sakti hai.",
      practical:
        "Emergency assessment, ECG awareness, vital monitoring aur immediate referral principles practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Diagram_of_the_human_heart.svg",
      labels: [
        "Heart",
        "Coronary Arteries",
        "ECG"
      ]
    }

  ],

  "4th Semester": [

    {
      name: "Child Health Nursing",
      theory:
        "Child Health Nursing focuses on nursing care of infants, children and adolescents.",
      easy:
        "Bachchon ki age ke according unki physical, mental aur developmental needs ka care.",
      practical:
        "Growth chart, pediatric assessment, immunization history aur medication safety practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Child_growth_chart.svg",
      labels: [
        "Growth",
        "Development",
        "Growth Chart"
      ]
    },

    {
      name: "Pneumonia in Children",
      theory:
        "Pneumonia in children is an infection of the lower respiratory tract or lungs.",
      easy:
        "Child me pneumonia ke saath cough, fever aur fast breathing ho sakti hai.",
      practical:
        "Respiratory assessment aur danger signs ko identify karna practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg",
      labels: [
        "Lungs",
        "Breathing",
        "Chest"
      ]
    },

    {
      name: "Acute Bronchitis",
      theory:
        "Acute bronchitis is inflammation of the bronchial tubes, often after an infection.",
      easy:
        "Bronchial tubes me inflammation hone se cough aur mucus ho sakta hai.",
      practical:
        "Respiratory assessment, hydration advice aur warning signs identify karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg",
      labels: [
        "Bronchi",
        "Cough",
        "Mucus"
      ]
    },

    {
      name: "Kangaroo Mother Care",
      theory:
        "Kangaroo Mother Care involves skin-to-skin contact between a newborn and mother or caregiver.",
      easy:
        "Baby ko mother/caregiver ke chest par skin-to-skin rakhna KMC ka important part hai.",
      practical:
        "Safe positioning, warmth, breastfeeding support aur newborn monitoring practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Kangaroo_mother_care.jpg",
      labels: [
        "Skin-to-Skin",
        "Newborn",
        "Breastfeeding"
      ]
    },

    {
      name: "IMNCI",
      theory:
        "IMNCI is an integrated approach for assessment and management of common childhood illnesses.",
      easy:
        "Common childhood illness ko systematic tarike se assess, classify aur manage karna.",
      practical:
        "Assessment, classification, treatment advice aur caregiver counselling practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Child_health.jpg",
      labels: [
        "Assessment",
        "Classification",
        "Counselling"
      ]
    },

    {
      name: "Spina Bifida",
      theory:
        "Spina bifida is a neural tube defect involving development of the spine.",
      easy:
        "Spina bifida ek congenital condition hai jisme spine development affected hota hai.",
      practical:
        "Newborn assessment, skin observation aur neurological assessment principles practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Spina_bifida.jpg",
      labels: [
        "Spine",
        "Neural Tube",
        "Newborn"
      ]
    }

  ],

  "5th Semester": [

    {
      name: "Community Health Nursing",
      theory:
        "Community Health Nursing focuses on health promotion, disease prevention and care of communities.",
      easy:
        "Community nursing ka focus poori community ki health improve karna hai.",
      practical:
        "Community assessment, family survey, home visit, health education aur community diagnosis practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Community_health_workers.jpg",
      labels: [
        "Community",
        "Family",
        "Home Visit",
        "Health Education"
      ]
    },

    {
      name: "Communicable Diseases",
      theory:
        "Communicable diseases can spread directly or indirectly through infectious agents.",
      easy:
        "Aisi diseases jo different transmission routes se spread ho sakti hain.",
      practical:
        "Chain of infection, hand hygiene, PPE, isolation aur prevention measures practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Influenza_virus_particles.jpg",
      labels: [
        "Agent",
        "Source",
        "Transmission",
        "Host"
      ]
    },

    {
      name: "Non Communicable Diseases",
      theory:
        "Non communicable diseases generally do not spread from person to person.",
      easy:
        "Hypertension, diabetes aur many cardiovascular diseases jaise conditions generally spread nahi hoti.",
      practical:
        "Risk assessment, screening, health education aur lifestyle counselling practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Heart_disease.jpg",
      labels: [
        "Risk Factors",
        "Screening",
        "Prevention"
      ]
    },

    {
      name: "Mental Health Nursing",
      theory:
        "Mental Health Nursing provides safe and therapeutic nursing care to people with mental health problems.",
      easy:
        "Mental health problems wale patient ko safe, respectful aur therapeutic care dena.",
      practical:
        "Mental status examination, therapeutic communication aur safety assessment practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg",
      labels: [
        "Mood",
        "Thought",
        "Perception",
        "Behaviour"
      ]
    },

    {
      name: "Schizophrenia",
      theory:
        "Schizophrenia is a serious mental disorder affecting thinking, perception and functioning.",
      easy:
        "Is condition me thinking, perception aur behaviour me significant disturbance ho sakti hai.",
      practical:
        "Mental status assessment, therapeutic communication, observation and safety precautions practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg",
      labels: [
        "Thought",
        "Perception",
        "Behaviour"
      ]
    },

    {
      name: "Depression",
      theory:
        "Depression involves persistent low mood or loss of interest with associated symptoms.",
      easy:
        "Long time tak sadness ya interest kam hona aur daily life affect hona depression ka important feature ho sakta hai.",
      practical:
        "Mood assessment, therapeutic communication aur suicide-risk awareness practice karein.",
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
        "Nursing research is systematic investigation used to improve nursing knowledge and practice.",
      easy:
        "Research evidence ke through nursing care ko better banane ki process hai.",
      practical:
        "Research problem, objectives, literature review, sampling, tools aur data collection practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Researcher_at_work.jpg",
      labels: [
        "Research Problem",
        "Sample",
        "Data"
      ]
    },

    {
      name: "Research Methodology",
      theory:
        "Research methodology describes the methods and procedures used to conduct research.",
      easy:
        "Research practically kaise karni hai, methodology ye batati hai.",
      practical:
        "Research design, variables, validity, reliability and data analysis practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Research_methods.jpg",
      labels: [
        "Design",
        "Validity",
        "Reliability"
      ]
    },

    {
      name: "Nursing Education",
      theory:
        "Nursing education involves teaching and learning processes related to nursing.",
      easy:
        "Nursing students ya patients ko effective tarike se sikhane ki process.",
      practical:
        "Lesson plan, teaching method, demonstration and evaluation practice karein.",
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
        "Leadership is the ability to guide and influence people toward common goals.",
      easy:
        "Team ko direction dena aur goal achieve karwana leadership hai.",
      practical:
        "Communication, delegation, decision-making and teamwork practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Teamwork.jpg",
      labels: [
        "Leader",
        "Team",
        "Delegation"
      ]
    },

    {
      name: "Professional Ethics",
      theory:
        "Professional ethics are principles that guide professional nursing behaviour.",
      easy:
        "Patient ki privacy, dignity, rights aur safety protect karna ethical nursing ka important part hai.",
      practical:
        "Consent, confidentiality, privacy and ethical decision-making situations discuss karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Doctor_patient.jpg",
      labels: [
        "Consent",
        "Privacy",
        "Dignity"
      ]
    }

  ],

  "7th Semester": [

    {
      name: "Advanced Nursing Practice",
      theory:
        "Advanced nursing practice involves advanced assessment and evidence-based clinical care.",
      easy:
        "Detailed assessment aur evidence ke basis par advanced nursing decisions lena.",
      practical:
        "Advanced assessment, clinical reasoning, care planning and evaluation practice karein.",
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
        "Nursing administration involves management of nursing services and resources.",
      easy:
        "Nursing staff, resources aur services ko properly manage karna.",
      practical:
        "Planning, staffing, supervision, delegation and evaluation practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hospital_nurse_station.jpg",
      labels: [
        "Planning",
        "Staffing",
        "Supervision"
      ]
    },

    {
      name: "Case Presentation",
      theory:
        "Case presentation is a structured presentation of a patient's clinical information.",
      easy:
        "Patient ki complete case ko systematic order me present karna.",
      practical:
        "Patient profile, history, physical examination, investigations, diagnosis and nursing care plan prepare karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Medical_record.jpg",
      labels: [
        "History",
        "Examination",
        "Investigation",
        "Care Plan"
      ]
    },

    {
      name: "Clinical Practice",
      theory:
        "Clinical practice is the application of nursing knowledge and skills in healthcare settings.",
      easy:
        "Theory ko actual patient care me safely apply karna clinical practice hai.",
      practical:
        "Assessment, procedures, documentation, communication and patient safety practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Nurse_patient.jpg",
      labels: [
        "Procedure",
        "Safety",
        "Documentation"
      ]
    },

    {
      name: "Exam Revision",
      theory:
        "Focused revision of high-yield nursing concepts for examinations.",
      easy:
        "Exam ke important topics ko systematically revise karna.",
      practical:
        "Viva, procedure checklist, case presentation, MCQ and OSCE-style practice karein.",
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Nursing_students.jpg",
      labels: [
        "Viva",
        "MCQ",
        "OSCE",
        "Revision"
      ]
    }

  ]

};

/* =========================================================
   ADDITIONAL PRACTICAL IMAGE LIBRARY
========================================================= */

const PRACTICAL_IMAGES = [

  {
    category: "Anatomy",
    name: "Human Skeleton",
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
    category: "Anatomy",
    name: "Human Heart",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Diagram_of_the_human_heart.svg",
    labels: [
      "Right Atrium",
      "Left Atrium",
      "Right Ventricle",
      "Left Ventricle",
      "Aorta"
    ]
  },

  {
    category: "Anatomy",
    name: "Respiratory System",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Respiratory_system_complete_en.svg",
    labels: [
      "Nose",
      "Pharynx",
      "Larynx",
      "Trachea",
      "Bronchi",
      "Lungs"
    ]
  },

  {
    category: "Anatomy",
    name: "Brain",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brain_diagram_without_text.svg",
    labels: [
      "Cerebrum",
      "Cerebellum",
      "Brainstem"
    ]
  },

  {
    category: "Practical",
    name: "Hand Hygiene",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hand_washing.svg",
    labels: [
      "Wet",
      "Apply soap",
      "Rub",
      "Rinse",
      "Dry"
    ]
  },

  {
    category: "Practical",
    name: "Blood Pressure",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_pressure_measurement.jpg",
    labels: [
      "Cuff",
      "Arm",
      "Stethoscope",
      "Systolic",
      "Diastolic"
    ]
  },

  {
    category: "Practical",
    name: "Blood Glucose",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Blood_glucose_meter.jpg",
    labels: [
      "Glucometer",
      "Test Strip",
      "Blood Sample"
    ]
  }

];

/* =========================================================
   QUIZ QUESTIONS
========================================================= */

const QUIZ_QUESTIONS = [

  {
    question: "First step of the nursing process is:",
    options: [
      "Planning",
      "Implementation",
      "Assessment",
      "Evaluation"
    ],
    answer: 2
  },

  {
    question: "Normal adult pulse rate is approximately:",
    options: [
      "20–40/min",
      "60–100/min",
      "120–160/min",
      "160–200/min"
    ],
    answer: 1
  },

  {
    question: "Hand hygiene mainly helps prevent:",
    options: [
      "Infection transmission",
      "Fracture",
      "Hypertension",
      "Diabetes"
    ],
    answer: 0
  },

  {
    question: "Which is generally a non-communicable disease?",
    options: [
      "Tuberculosis",
      "Measles",
      "Hypertension",
      "Chickenpox"
    ],
    answer: 2
  },

  {
    question: "Kangaroo Mother Care mainly includes:",
    options: [
      "Cold bathing",
      "Skin-to-skin contact",
      "Isolation",
      "Bed rest"
    ],
    answer: 1
  },

  {
    question: "Blood pressure is commonly measured using:",
    options: [
      "Thermometer",
      "Sphygmomanometer",
      "Glucometer",
      "Pulse oximeter"
    ],
    answer: 1
  },

  {
    question: "Which may occur in schizophrenia?",
    options: [
      "Hallucinations",
      "Fracture",
      "Diarrhoea only",
      "Fever only"
    ],
    answer: 0
  },

  {
    question: "Research helps nursing practice become more:",
    options: [
      "Evidence based",
      "Random",
      "Unsafe",
      "Unplanned"
    ],
    answer: 0
  },

  {
    question: "Patient confidentiality means:",
    options: [
      "Sharing records publicly",
      "Protecting private patient information",
      "Ignoring records",
      "Posting records online"
    ],
    answer: 1
  },

  {
    question: "A care plan mainly helps nurses to:",
    options: [
      "Organize patient care",
      "Avoid assessment",
      "Hide information",
      "Avoid evaluation"
    ],
    answer: 0
  }

];

/* =========================================================
   UNIVERSITY DIRECTORY
========================================================= */

const UNIVERSITIES = [

  {
    name: "Baba Farid University of Health Sciences",
    state: "Punjab",
    official: "https://bfuhs.ac.in/"
  },

  {
    name: "All India Institute of Medical Sciences",
    state: "India",
    official: "https://www.aiimsexams.ac.in/"
  }

];

/* =========================================================
   OFFICIAL SCHOLARSHIP / JOB LINKS
========================================================= */

const OFFICIAL_LINKS = [

  {
    title: "National Scholarship Portal",
    category: "Scholarship",
    description:
      "Government scholarship information and applications.",
    url: "https://scholarships.gov.in/"
  },

  {
    title: "AIIMS Examination",
    category: "Nursing Vacancy",
    description:
      "Official AIIMS examination and recruitment information.",
    url: "https://www.aiimsexams.ac.in/"
  },

  {
    title: "Baba Farid University of Health Sciences",
    category: "University",
    description:
      "Official BFUHS website.",
    url: "https://bfuhs.ac.in/"
  },

  {
    title: "National Health Mission",
    category: "Government Jobs",
    description:
      "Official health programme information.",
    url: "https://nhm.gov.in/"
  },

  {
    title: "Employment News",
    category: "Government Jobs",
    description:
      "Government employment information.",
    url: "https://employmentnews.gov.in/"
  }

];

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {

  res.json({
    success: true,
    service: "NurseStudy",
    status: "running",
    time: new Date().toISOString()
  });

});

/* =========================================================
   STUDY API
========================================================= */

app.get("/api/semesters", (req, res) => {

  res.json({
    success: true,
    semesters: Object.keys(STUDY_DATA)
  });

});

app.get("/api/semester/:semester", (req, res) => {

  const semester = decodeURIComponent(req.params.semester);

  const data = STUDY_DATA[semester];

  if (!data) {

    return res.status(404).json({
      success: false,
      error: "Semester not found"
    });

  }

  res.json({
    success: true,
    semester,
    topics: data
  });

});

app.get("/api/topics", (req, res) => {

  const query = clean(req.query.q, 150).toLowerCase();

  const results = [];

  for (const semester of Object.keys(STUDY_DATA)) {

    for (const topic of STUDY_DATA[semester]) {

      const searchable = (
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

      if (!query || searchable.includes(query)) {

        results.push({
          semester,
          ...topic
        });

      }

    }

  }

  res.json({
    success: true,
    topics: results.slice(0, 100)
  });

});

app.get("/api/practical-images", (req, res) => {

  res.json({
    success: true,
    images: PRACTICAL_IMAGES
  });

});

/* =========================================================
   STUDENT PROFILE API
========================================================= */

app.post("/api/students", (req, res) => {

  const student = {

    id: makeId("student"),

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

  database.students.push(student);

  saveDatabase();

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

  const query =
    clean(req.query.q, 100).toLowerCase();

  let students = database.students;

  if (query) {

    students = students.filter(student => {

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

      return text.includes(query);

    });

  }

  res.json({
    success: true,

    students:
      students
        .slice(-100)
        .reverse()
        .map(student => ({
          id: student.id,
          name: student.name,
          university: student.university,
          college: student.college,
          semester: student.semester,
          city: student.city
        }))

  });

});

/* =========================================================
   COMMUNITY
========================================================= */

app.get("/api/community", (req, res) => {

  res.json({
    success: true,
    posts:
      database.community
        .slice(-100)
        .reverse()
  });

});

app.post("/api/community", (req, res) => {

  const post = {

    id: makeId("post"),

    name: clean(req.body.name, 80),

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

  database.community.push(post);

  saveDatabase();

  res.json({
    success: true,
    message: "Question posted successfully.",
    post
  });

});

/* =========================================================
   CONTACT REQUEST
========================================================= */

app.post("/api/contact-request", (req, res) => {

  const request = {

    id: makeId("contact"),

    fromId:
      clean(req.body.fromId, 100),

    toId:
      clean(req.body.toId, 100),

    message:
      clean(req.body.message, 500),

    status:
      "pending",

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

  database.contacts.push(request);

  saveDatabase();

  res.json({
    success: true,
    message: "Contact request sent successfully."
  });

});

app.get("/api/contact-requests/:studentId", (req, res) => {

  const studentId =
    clean(req.params.studentId, 100);

  const requests =
    database.contacts.filter(
      request =>
        request.fromId === studentId ||
        request.toId === studentId
    );

  res.json({
    success: true,
    requests
  });

});

/* =========================================================
   BLOOD DONOR
========================================================= */

app.post("/api/blood-donor", (req, res) => {

  const donor = {

    id: makeId("donor"),

    name:
      clean(req.body.name, 80),

    bloodGroup:
      clean(req.body.bloodGroup, 10).toUpperCase(),

    city:
      clean(req.body.city, 80),

    phone:
      clean(req.body.phone, 30),

    availability:
      clean(req.body.availability, 100),

    verified:
      false,

    createdAt:
      new Date().toISOString()

  };

  const validGroups = [
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
    !validGroups.includes(donor.bloodGroup) ||
    !donor.city ||
    !donor.phone
  ) {

    return res.status(400).json({
      success: false,
      error:
        "Name, valid blood group, city and phone are required."
    });

  }

  database.donors.push(donor);

  saveDatabase();

  res.json({
    success: true,
    message:
      "Blood donor registration submitted successfully. Verification may be required."
  });

});

app.get("/api/blood-donors", (req, res) => {

  const group =
    clean(req.query.group, 10).toUpperCase();

  const city =
    clean(req.query.city, 80).toLowerCase();

  let donors = database.donors;

  if (group) {

    donors =
      donors.filter(
        donor =>
          donor.bloodGroup === group
      );

  }

  if (city) {

    donors =
      donors.filter(
        donor =>
          donor.city
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
        .map(donor => ({
          id: donor.id,
          name: donor.name,
          bloodGroup: donor.bloodGroup,
          city: donor.city,
          availability: donor.availability,
          verified: donor.verified
        }))

  });

});

/* =========================================================
   BLOOD REQUEST
========================================================= */

app.post("/api/blood-request", (req, res) => {

  const request = {

    id: makeId("blood"),

    name:
      clean(req.body.name, 80),

    bloodGroup:
      clean(req.body.bloodGroup, 10).toUpperCase(),

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

    status:
      "open",

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
        "Name, blood group, city and contact are required."
    });

  }

  database.bloodRequests.push(request);

  saveDatabase();

  res.json({
    success: true,
    message:
      "Blood request posted successfully."
  });

});

app.get("/api/blood-requests", (req, res) => {

  res.json({

    success: true,

    requests:
      database.bloodRequests
        .filter(x => x.status === "open")
        .slice(-100)
        .reverse()
        .map(x => ({
          id: x.id,
          name: x.name,
          bloodGroup: x.bloodGroup,
          city: x.city,
          hospital: x.hospital,
          urgency: x.urgency,
          details: x.details
        }))

  });

});

/* =========================================================
   QUIZ API
========================================================= */

app.get("/api/quiz", (req, res) => {

  res.json({

    success: true,

    questions:
      QUIZ_QUESTIONS.map(
        (question, index) => ({
          id: index,
          question: question.question,
          options: question.options
        })
      )

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

  QUIZ_QUESTIONS.forEach(
    (question, index) => {

      if (
        Number(answers[index]) ===
        question.answer
      ) {
        score++;
      }

    }
  );

  const percentage =
    Math.round(
      score *
      100 /
      QUIZ_QUESTIONS.length
    );

  const result = {

    id: makeId("quiz"),

    name,

    score,

    total:
      QUIZ_QUESTIONS.length,

    percentage,

    createdAt:
      new Date().toISOString()

  };

  database.quizResults.push(result);

  saveDatabase();

  res.json({

    success: true,

    result,

    message:
      percentage >= 80
        ? "Excellent! You may qualify for a NurseStudy prize/bonus after verification."
        : "Good attempt! Keep practicing."

  });

});

app.get("/api/leaderboard", (req, res) => {

  const leaderboard =
    [...database.quizResults]
      .sort(
        (a, b) =>
          b.percentage - a.percentage ||
          b.score - a.score
      )
      .slice(0, 20);

  res.json({
    success: true,
    leaderboard
  });

});

/* =========================================================
   PRIZE CLAIM
========================================================= */

app.post("/api/prize-claim", (req, res) => {

  const claim = {

    id: makeId("prize"),

    name:
      clean(req.body.name, 80),

    contact:
      clean(req.body.contact, 60),

    quizId:
      clean(req.body.quizId, 100),

    message:
      clean(req.body.message, 600),

    status:
      "pending",

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

  database.prizeClaims.push(claim);

  saveDatabase();

  res.json({
    success: true,
    message:
      "Prize claim submitted. Winner verification will be done by NurseStudy."
  });

});

/* =========================================================
   UNIVERSITY API
========================================================= */

app.get("/api/universities", (req, res) => {

  const query =
    clean(req.query.q, 100).toLowerCase();

  const results =
    UNIVERSITIES.filter(
      university =>
        !query ||
        (
          university.name +
          " " +
          university.state
        )
        .toLowerCase()
        .includes(query)
    );

  res.json({
    success: true,
    universities: results
  });

});

/* =========================================================
   OFFICIAL SCHOLARSHIP / JOB API
========================================================= */

app.get("/api/opportunities", (req, res) => {

  res.json({
    success: true,
    opportunities: OFFICIAL_LINKS
  });

});

/* =========================================================
   BOOK HELP
========================================================= */

app.post("/api/book-request", (req, res) => {

  const request = {

    id:
      makeId("book"),

    name:
      clean(req.body.name, 80),

    semester:
      clean(req.body.semester, 50),

    book:
      clean(req.body.book, 200),

    contact:
      clean(req.body.contact, 50),

    message:
      clean(req.body.message, 600),

    createdAt:
      new Date().toISOString()

  };

  if (!request.name || !request.book) {

    return res.status(400).json({
      success: false,
      error:
        "Name and book/subject are required."
    });

  }

  database.bookRequests.push(request);

  saveDatabase();

  res.json({
    success: true,
    message:
      "Book/help request submitted successfully."
  });

});

/* =========================================================
   DONATION API
========================================================= */

app.get("/api/donation", (req, res) => {

  res.json({

    success: true,

    upi:
      UPI_ID,

    name:
      "NurseStudy",

    currency:
      "INR"

  });

});

/* =========================================================
   OFFICIAL WEBSITE ROUTE
   PART 2 WILL CONTINUE FROM HERE
========================================================= */