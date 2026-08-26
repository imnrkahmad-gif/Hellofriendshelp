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
/* =========================================================
   FRONTEND
========================================================= */

function renderPage() {

  const semesters = Object.keys(STUDY_DATA);

  return `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>NurseStudy - Nursing Student Platform</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Arial,
    sans-serif;
  background:#f4f9fb;
  color:#243b53;
}

header{
  position:sticky;
  top:0;
  z-index:100;
  background:#ffffff;
  border-bottom:1px solid #d9e2ec;
}

.container{
  width:min(1150px,92%);
  margin:auto;
}

.navbar{
  min-height:68px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
}

.logo{
  font-size:23px;
  font-weight:900;
  color:#102a43;
}

.navlinks{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.navlinks a{
  text-decoration:none;
  color:#0f766e;
  font-weight:800;
  font-size:13px;
}

.hero{
  padding:60px 0;
  background:
    linear-gradient(
      180deg,
      #e9faf7,
      #f4f9fb
    );
}

.badge{
  display:inline-block;
  padding:8px 13px;
  border-radius:50px;
  background:#ddf6f2;
  color:#08645e;
  font-weight:800;
  font-size:12px;
}

h1{
  font-size:
    clamp(38px,7vw,68px);
  line-height:1;
  margin:20px 0;
  color:#102a43;
}

h2{
  color:#102a43;
}

h3{
  color:#243b53;
}

p{
  line-height:1.65;
}

section{
  padding:45px 0;
}

.searchbox{
  background:#ffffff;
  padding:8px;
  border-radius:15px;
  border:1px solid #d9e2ec;
  display:flex;
  gap:8px;
  margin-top:25px;
}

.searchbox input{
  flex:1;
  border:0;
  outline:none;
  margin:0;
}

input,
select,
textarea{
  width:100%;
  padding:12px;
  border-radius:10px;
  border:1px solid #d9e2ec;
  margin:6px 0;
  font:inherit;
}

textarea{
  min-height:110px;
  resize:vertical;
}

button,
.btn{
  border:0;
  border-radius:10px;
  padding:11px 15px;
  background:#0f766e;
  color:white;
  font-weight:800;
  cursor:pointer;
  text-decoration:none;
  display:inline-block;
}

button:hover,
.btn:hover{
  opacity:.9;
}

.btn-light{
  background:#e8f8f5;
  color:#08645e;
}

.grid{
  display:grid;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(280px,1fr)
    );
  gap:16px;
}

.card{
  background:#ffffff;
  border:1px solid #d9e2ec;
  border-radius:17px;
  padding:18px;
  margin:12px 0;
  box-shadow:
    0 7px 22px rgba(16,42,67,.06);
}

.semester-tabs{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin:20px 0;
}

.semester-tab{
  border:1px solid #d9e2ec;
  background:white;
  color:#0f766e;
}

.semester-tab.active{
  background:#0f766e;
  color:white;
}

.topic{
  background:#ffffff;
  border:1px solid #d9e2ec;
  border-radius:18px;
  padding:20px;
  margin:15px 0;
}

.topic-layout{
  display:grid;
  grid-template-columns:
    minmax(220px,380px)
    1fr;
  gap:22px;
  align-items:start;
}

.topic-image{
  width:100%;
  max-height:330px;
  object-fit:contain;
  background:#ffffff;
  border:1px solid #d9e2ec;
  border-radius:14px;
  padding:8px;
}

.easy-box{
  background:#effcf8;
  border:1px solid #b9eadf;
  border-radius:12px;
  padding:14px;
  margin:12px 0;
}

.practical-box{
  background:#eef4ff;
  border:1px solid #c8d8ff;
  border-radius:12px;
  padding:14px;
  margin:12px 0;
}

.notice{
  background:#fff8e8;
  border:1px solid #f0d39a;
  border-radius:12px;
  padding:14px;
  margin:12px 0;
}

.labels{
  display:flex;
  flex-wrap:wrap;
  gap:7px;
  margin-top:12px;
}

.label{
  background:#eef4ff;
  color:#2456a6;
  border-radius:50px;
  padding:7px 11px;
  font-size:12px;
  font-weight:800;
}

.result{
  background:#ffffff;
  border:1px solid #d9e2ec;
  border-radius:13px;
  padding:14px;
  margin:9px 0;
}

.gallery-image{
  width:100%;
  height:240px;
  object-fit:contain;
  border:1px solid #d9e2ec;
  border-radius:12px;
  background:white;
}

.quiz-question{
  border:1px solid #d9e2ec;
  border-radius:14px;
  padding:15px;
  margin:12px 0;
  background:white;
}

.quiz-option{
  display:block;
  padding:11px;
  border:1px solid #d9e2ec;
  border-radius:9px;
  margin:7px 0;
  cursor:pointer;
}

.quiz-option:hover{
  background:#f4f9fb;
}

.upi-box{
  background:#effcf8;
  border:1px solid #b9eadf;
  border-radius:15px;
  padding:18px;
}

.upi-id{
  font-size:22px;
  font-weight:900;
  color:#08645e;
  margin:10px 0;
}

.success{
  background:#effcf8;
  border:1px solid #b9eadf;
  padding:12px;
  border-radius:10px;
  margin-top:10px;
}

.error{
  background:#fff0f0;
  border:1px solid #f2b8b8;
  padding:12px;
  border-radius:10px;
  margin-top:10px;
}

footer{
  background:#102a43;
  color:#c7d5e2;
  padding:40px 0;
  margin-top:30px;
}

footer h2{
  color:white;
}

@media(max-width:700px){

  .navlinks{
    display:none;
  }

  .searchbox{
    flex-direction:column;
  }

  .topic-layout{
    grid-template-columns:1fr;
  }

}

</style>

</head>

<body>

<header>

<div class="container navbar">

<div class="logo">
🩺 NurseStudy
</div>

<div class="navlinks">

<a href="#study">Study</a>

<a href="#practical">Practical</a>

<a href="#community">Community</a>

<a href="#blood">Blood</a>

<a href="#quiz">Quiz</a>

<a href="#jobs">Jobs</a>

<a href="#donation">Donate</a>

</div>

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
Theory + Easy Hindi/English + Practical Learning +
Images + Viva + MCQ + Student Community +
Blood Donor + Quiz + Scholarship + Nursing Jobs
</p>

<div class="searchbox">

<input
id="mainSearch"
placeholder="Search Anatomy, Bone, Community, Pneumonia..."
>

<button onclick="searchTopic()">
🔎 Search
</button>

</div>

<div id="searchResults"></div>

</div>

</section>


<section id="study">

<div class="container">

<h2>
📚 Semester 1–7 Study Centre
</h2>

<p>
Semester choose karo aur topic ko theory,
easy language aur practical image ke saath padho.
</p>

<div class="semester-tabs">

${semesters.map(
  (semester,index) => `
<button
  class="semester-tab ${index === 0 ? "active" : ""}"
  onclick="selectSemester(this, '${encodeURIComponent(semester)}')"
>
${escapeHTML(semester)}
</button>
`
).join("")}

</div>

<div id="topicsContainer"></div>

</div>

</section>


<section id="practical">

<div class="container">

<h2>
🧪 Anatomy & Practical Image Gallery
</h2>

<p>
Important anatomy aur practical topics ko images ke
saath samajhne ke liye gallery.
</p>

<div
id="practicalGallery"
class="grid"
></div>

</div>

</section>


<section id="community">

<div class="container">

<h2>
👥 Nursing Student Community
</h2>

<div class="grid">


<div class="card">

<h3>
👤 Create Student Profile
</h3>

<input
id="studentName"
placeholder="Your Name"
>

<input
id="studentPhone"
placeholder="Mobile Number"
>

<input
id="studentUniversity"
placeholder="University"
>

<input
id="studentCollege"
placeholder="College"
>

<input
id="studentSemester"
placeholder="Semester"
>

<input
id="studentCity"
placeholder="City"
>

<button onclick="createProfile()">
Create Profile
</button>

<div id="profileMessage"></div>

</div>


<div class="card">

<h3>
🔎 Find Nursing Students
</h3>

<input
id="studentSearch"
placeholder="Name / University / College / Semester / City"
>

<button
onclick="findStudents()"
>
Search
</button>

<div id="studentResults"></div>

</div>

</div>


<div class="card">

<h3>
💬 Ask a Nursing Question
</h3>

<input
id="postName"
placeholder="Your Name"
>

<input
id="postUniversity"
placeholder="University"
>

<input
id="postSemester"
placeholder="Semester"
>

<input
id="postTopic"
placeholder="Topic"
>

<textarea
id="postMessage"
placeholder="Write your question..."
></textarea>

<button onclick="createPost()">
Post Question
</button>

<div id="communityMessage"></div>

</div>


<div class="card">

<h3>
📢 Recent Student Questions
</h3>

<div id="communityPosts"></div>

</div>

</div>

</section>


<section id="blood">

<div class="container">

<h2>
🩸 Blood Donation & Blood Donor
</h2>

<div class="grid">


<div class="card">

<h3>
❤️ Become a Blood Donor
</h3>

<input
id="donorName"
placeholder="Name"
>

<select id="donorGroup">

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

<input
id="donorCity"
placeholder="City"
>

<input
id="donorPhone"
placeholder="Phone"
>

<input
id="donorAvailability"
placeholder="Availability"
>

<button onclick="registerDonor()">
Register Donor
</button>

<div id="donorMessage"></div>

</div>


<div class="card">

<h3>
🔎 Find Blood Donor
</h3>

<select id="findBloodGroup">

<option value="">
Any Blood Group
</option>

<option>A+</option>
<option>A-</option>
<option>B+</option>
<option>B-</option>
<option>AB+</option>
<option>AB-</option>
<option>O+</option>
<option>O-</option>

</select>

<input
id="findBloodCity"
placeholder="City"
>

<button onclick="findDonors()">
Find Donor
</button>

<div id="donorResults"></div>

</div>

</div>


<div class="card">

<h3>
🚨 Need Blood?
</h3>

<input
id="bloodPatient"
placeholder="Patient / Requester Name"
>

<input
id="bloodGroup"
placeholder="Required Blood Group"
>

<input
id="bloodCity"
placeholder="City"
>

<input
id="bloodHospital"
placeholder="Hospital"
>

<input
id="bloodPhone"
placeholder="Contact Number"
>

<select id="bloodUrgency">

<option>Normal</option>
<option>Urgent</option>
<option>Emergency</option>

</select>

<textarea
id="bloodDetails"
placeholder="Additional details"
></textarea>

<button onclick="createBloodRequest()">
Post Blood Request
</button>

<div id="bloodMessage"></div>

</div>

</div>

</section>


<section id="quiz">

<div class="container">

<h2>
🎮 Nursing MCQ Quiz
</h2>

<div class="card">

<p>
MCQ solve karo aur score check karo.
High score students ke liye prize/bonus claim
system available hai. Final winner verification
administrator karega.
</p>

<input
id="quizName"
placeholder="Your Name"
>

<div id="quizContainer"></div>

<button onclick="submitQuiz()">
🏆 Submit Quiz
</button>

<div id="quizResult"></div>

</div>


<div class="card">

<h3>
🏆 Leaderboard
</h3>

<button
class="btn-light"
onclick="loadLeaderboard()"
>
Refresh Leaderboard
</button>

<div id="leaderboard"></div>

</div>


<div class="card">

<h3>
🎁 Prize Claim
</h3>

<input
id="prizeName"
placeholder="Name"
>

<input
id="prizeContact"
placeholder="Contact"
>

<input
id="prizeQuizId"
placeholder="Quiz Result ID"
>

<textarea
id="prizeMessage"
placeholder="Prize claim message"
></textarea>

<button onclick="claimPrize()">
Submit Prize Claim
</button>

<div id="prizeMessage"></div>

</div>

</div>

</section>


<section id="jobs">

<div class="container">

<h2>
🎓 Scholarships & 👩‍⚕️ Nursing Vacancies
</h2>

<p>
Scholarship aur vacancy ke liye official websites
open karo aur current notification verify karke apply karo.
</p>

<div
id="opportunityContainer"
class="grid"
></div>

<div class="notice">

<b>Important:</b>

Application submit karne se pehle eligibility,
last date, fees aur official notification zaroor check karein.

</div>

</div>

</section>


<section>

<div class="container">

<h2>
🏫 University Search
</h2>

<input
id="universitySearch"
placeholder="Search University"
>

<button onclick="searchUniversities()">
Search
</button>

<div id="universityResults"></div>

</div>

</section>


<section id="donation">

<div class="container">

<h2>
💰 Support NurseStudy
</h2>

<div class="card">

<p>
Agar aap NurseStudy platform ko support karna chahte hain,
to UPI se voluntary donation kar sakte hain.
</p>

<div class="upi-box">

<div>
UPI ID
</div>

<div class="upi-id">
${UPI_ID}
</div>

<button onclick="copyUPI()">
📋 Copy UPI
</button>

<button
class="btn-light"
onclick="openUPI()"
>
📱 Open UPI App
</button>

<div id="upiMessage"></div>

</div>

</div>

</div>

</section>


<section>

<div class="container">

<h2>
📚 Book / Study Help Request
</h2>

<div class="card">

<input
id="bookName"
placeholder="Your Name"
>

<input
id="bookSemester"
placeholder="Semester"
>

<input
id="bookSubject"
placeholder="Book / Subject"
>

<input
id="bookContact"
placeholder="Contact"
>

<textarea
id="bookMessage"
placeholder="What help do you need?"
></textarea>

<button onclick="sendBookRequest()">
Send Request
</button>

<div id="bookMessageResult"></div>

</div>

</div>

</section>


<footer>

<div class="container">

<h2>
🩺 NurseStudy
</h2>

<p>
Nursing education • Practical learning • Student community
</p>

<p>
© 2026 NurseStudy
</p>

</div>

</footer>


<script>

/* =========================================================
   FRONTEND JAVASCRIPT
========================================================= */

let studentProfile = null;

let quizQuestions = [];

let latestQuizId = "";


/* ---------------------------------------------------------
   API HELPER
--------------------------------------------------------- */

async function api(url, options = {}) {

  try {

    const response =
      await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        ...options
      });

    return await response.json();

  } catch (error) {

    return {
      success: false,
      error:
        "Server connection problem."
    };

  }

}


/* ---------------------------------------------------------
   START APP
--------------------------------------------------------- */

async function startApp() {

  await loadSemester(
    Object.keys(${JSON.stringify(STUDY_DATA)})[0]
  );

  await loadPracticalGallery();

  await loadCommunity();

  await loadQuiz();

  await loadOpportunities();

  await loadLeaderboard();

}


/* ---------------------------------------------------------
   SEMESTER
--------------------------------------------------------- */

async function selectSemester(button, semester) {

  document
    .querySelectorAll(".semester-tab")
    .forEach(
      item =>
        item.classList.remove("active")
    );

  button.classList.add("active");

  await loadSemester(
    decodeURIComponent(semester)
  );

}


async function loadSemester(semester) {

  const response =
    await api(
      "/api/semester/" +
      encodeURIComponent(semester)
    );

  if (!response.success) {

    document
      .getElementById("topicsContainer")
      .innerHTML =
      '<div class="error">' +
      escapeHTML(response.error) +
      '</div>';

    return;

  }

  const topics =
    response.topics || [];

  document
    .getElementById("topicsContainer")
    .innerHTML = `

<div class="card">

<span class="badge">
${escapeHTML(semester)}
</span>

<h2>
${escapeHTML(semester)}
— Theory + Practical
</h2>

<p>
Har topic ko theory, easy Hindi/English,
practical points aur image ke saath padho.
</p>

</div>

${topics
  .map(
    (topic, index) => `

<article class="topic">

<h3>
${index + 1}.
${escapeHTML(topic.name)}
</h3>

<div class="topic-layout">

<div>

<img
class="topic-image"
src="${topic.image}"
alt="${escapeHTML(topic.name)}"
onerror="this.style.display='none'"
>

</div>

<div>

<p>
<b>📖 Theory:</b>
${escapeHTML(topic.theory)}
</p>

<div class="easy-box">

<b>
🗣️ Easy Hindi/English:
</b>

<p>
${escapeHTML(topic.easy)}
</p>

</div>

<div class="practical-box">

<b>
🧪 Practical:
</b>

<p>
${escapeHTML(topic.practical)}
</p>

</div>

<div class="labels">

${topic.labels
  .map(
    label =>
      `<span class="label">
      ${escapeHTML(label)}
      </span>`
  )
  .join("")}

</div>

<br>

<button
class="btn-light"
onclick="showViva('${escapeHTML(topic.name)}')"
>
🎤 Viva
</button>

<button
class="btn-light"
onclick="showRevision('${escapeHTML(topic.name)}')"
>
🧠 Revision
</button>

</div>

</div>

</article>

`
  )
  .join("")}

`;

}


/* ---------------------------------------------------------
   SEARCH
--------------------------------------------------------- */

async function searchTopic() {

  const query =
    document
      .getElementById("mainSearch")
      .value
      .trim();

  if (!query) {

    document
      .getElementById("searchResults")
      .innerHTML = "";

    return;

  }

  const response =
    await api(
      "/api/topics?q=" +
      encodeURIComponent(query)
    );

  if (!response.success) {

    return;

  }

  const topics =
    response.topics || [];

  document
    .getElementById("searchResults")
    .innerHTML = `

<h3>
🔎 Search Results
</h3>

${
  topics.length
    ? topics
        .map(
          topic => `

<div class="result">

<span class="badge">
${escapeHTML(topic.semester)}
</span>

<h3>
${escapeHTML(topic.name)}
</h3>

<p>
<b>Theory:</b>
${escapeHTML(topic.theory)}
</p>

<div class="easy-box">

<b>Easy:</b>

${escapeHTML(topic.easy)}

</div>

<div class="practical-box">

<b>Practical:</b>

${escapeHTML(topic.practical)}

</div>

<img
src="${topic.image}"
alt="${escapeHTML(topic.name)}"
class="gallery-image"
onerror="this.style.display='none'"
>

</div>

`
        )
        .join("")
    : '<div class="result">No topic found.</div>'

}

`;

}


/* ---------------------------------------------------------
   PRACTICAL GALLERY
--------------------------------------------------------- */

async function loadPracticalGallery() {

  const response =
    await api(
      "/api/practical-images"
    );

  if (!response.success) {
    return;
  }

  document
    .getElementById("practicalGallery")
    .innerHTML =
      response.images
        .map(
          item => `

<div class="card">

<span class="badge">
${escapeHTML(item.category)}
</span>

<h3>
${escapeHTML(item.name)}
</h3>

<img
class="gallery-image"
src="${item.image}"
alt="${escapeHTML(item.name)}"
onerror="this.style.display='none'"
>

<div class="labels">

${item.labels
  .map(
    label =>
      `<span class="label">
      ${escapeHTML(label)}
      </span>`
  )
  .join("")}

</div>

</div>

`
        )
        .join("");

}


/* ---------------------------------------------------------
   VIVA
--------------------------------------------------------- */

function showViva(topic) {

  alert(
`VIVA REVISION

Topic: ${topic}

Important questions:

1. Define ${topic}.
2. Causes / risk factors kya hain?
3. Signs and symptoms kya hain?
4. Diagnosis kaise hota hai?
5. Treatment kya hota hai?
6. Nursing management kya hai?
7. Complications kya ho sakti hain?
8. Patient education kya denge?`
  );

}


/* ---------------------------------------------------------
   REVISION
--------------------------------------------------------- */

function showRevision(topic) {

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
Health Education

Exam me definition + signs/symptoms +
management zaroor revise karein.`
  );

}


/* ---------------------------------------------------------
   STUDENT PROFILE
--------------------------------------------------------- */

async function createProfile() {

  const response =
    await api(
      "/api/students",
      {
        method: "POST",

        body:
          JSON.stringify({

            name:
              document
                .getElementById("studentName")
                .value,

            phone:
              document
                .getElementById("studentPhone")
                .value,

            university:
              document
                .getElementById("studentUniversity")
                .value,

            college:
              document
                .getElementById("studentCollege")
                .value,

            semester:
              document
                .getElementById("studentSemester")
                .value,

            city:
              document
                .getElementById("studentCity")
                .value

          })

      }
    );

  showMessage(
    "profileMessage",
    response.success,
    response.message ||
    response.error
  );

  if (response.success) {

    studentProfile =
      response.student;

    localStorage.setItem(
      "nurseStudyProfile",
      JSON.stringify(
        response.student
      )
    );

  }

}


/* ---------------------------------------------------------
   FIND STUDENTS
--------------------------------------------------------- */

async function findStudents() {

  const query =
    document
      .getElementById("studentSearch")
      .value;

  const response =
    await api(
      "/api/students?q=" +
      encodeURIComponent(query)
    );

  const container =
    document
      .getElementById("studentResults");

  if (!response.success) {

    container.innerHTML =
      '<div class="error">' +
      escapeHTML(response.error) +
      '</div>';

    return;

  }

  if (!response.students.length) {

    container.innerHTML =
      '<div class="result">No students found.</div>';

    return;

  }

  container.innerHTML =
    response.students
      .map(
        student => `

<div class="result">

<b>
👤 ${escapeHTML(student.name)}
</b>

<p>

${escapeHTML(student.university || "University not added")}
<br>

${escapeHTML(student.college || "College not added")}
<br>

${escapeHTML(student.semester || "")}

•

${escapeHTML(student.city || "")}

</p>

<button
class="btn-light"
onclick="sendContactRequest('${escapeHTML(student.id)}')"
>
💬 Contact
</button>

</div>

`
      )
      .join("");

}


/* ---------------------------------------------------------
   CONTACT REQUEST
--------------------------------------------------------- */

async function sendContactRequest(toId) {

  if (!studentProfile) {

    alert(
      "Pehle Student Profile create karo."
    );

    return;

  }

  const message =
    prompt(
      "Study related message likho:"
    );

  if (!message) {
    return;
  }

  const response =
    await api(
      "/api/contact-request",
      {
        method: "POST",

        body:
          JSON.stringify({

            fromId:
              studentProfile.id,

            toId,

            message

          })

      }
    );

  alert(
    response.message ||
    response.error
  );

}


/* ---------------------------------------------------------
   COMMUNITY POST
--------------------------------------------------------- */

async function createPost() {

  const response =
    await api(
      "/api/community",
      {
        method: "POST",

        body:
          JSON.stringify({

            name:
              document
                .getElementById("postName")
                .value,

            university:
              document
                .getElementById("postUniversity")
                .value,

            semester:
              document
                .getElementById("postSemester")
                .value,

            topic:
              document
                .getElementById("postTopic")
                .value,

            message:
              document
                .getElementById("postMessage")
                .value

          })

      }
    );

  showMessage(
    "communityMessage",
    response.success,
    response.message ||
    response.error
  );

  if (response.success) {

    document
      .getElementById("postMessage")
      .value = "";

    await loadCommunity();

  }

}


/* ---------------------------------------------------------
   LOAD COMMUNITY
--------------------------------------------------------- */

async function loadCommunity() {

  const response =
    await api(
      "/api/community"
    );

  const container =
    document
      .getElementById("communityPosts");

  if (!response.success) {
    return;
  }

  container.innerHTML =
    response.posts.length

      ? response.posts
          .map(
            post => `

<div class="result">

<b>
${escapeHTML(post.name)}
</b>

<span>
•
${escapeHTML(post.semester || "")}
</span>

<p>
<b>
${escapeHTML(post.topic || "Question")}
</b>
</p>

<p>
${escapeHTML(post.message)}
</p>

</div>

`
          )
          .join("")

      : '<div class="result">No questions yet.</div>';

}


/* ---------------------------------------------------------
   DONOR REGISTRATION
--------------------------------------------------------- */

async function registerDonor() {

  const response =
    await api(
      "/api/blood-donor",
      {
        method: "POST",

        body:
          JSON.stringify({

            name:
              document
                .getElementById("donorName")
                .value,

            bloodGroup:
              document
                .getElementById("donorGroup")
                .value,

            city:
              document
                .getElementById("donorCity")
                .value,

            phone:
              document
                .getElementById("donorPhone")
                .value,

            availability:
              document
                .getElementById("donorAvailability")
                .value

          })

      }
    );

  showMessage(
    "donorMessage",
    response.success,
    response.message ||
    response.error
  );

}


/* ---------------------------------------------------------
   FIND DONORS
--------------------------------------------------------- */

async function findDonors() {

  const group =
    document
      .getElementById("findBloodGroup")
      .value;

  const city =
    document
      .getElementById("findBloodCity")
      .value;

  const response =
    await api(
      "/api/blood-donors?group=" +
      encodeURIComponent(group) +
      "&city=" +
      encodeURIComponent(city)
    );

  const container =
    document
      .getElementById("donorResults");

  if (!response.success) {
    return;
  }

  if (!response.donors.length) {

    container.innerHTML =
      '<div class="result">No matching donor found.</div>';

    return;

  }

  container.innerHTML =
    response.donors
      .map(
        donor => `

<div class="result">

<b>
🩸 ${escapeHTML(donor.bloodGroup)}
</b>

<p>
${escapeHTML(donor.name)}
<br>
${escapeHTML(donor.city)}
</p>

<p>
${escapeHTML(
  donor.availability ||
  "Availability not specified"
)}
</p>

</div>

`
      )
      .join("");

}


/* ---------------------------------------------------------
   BLOOD REQUEST
--------------------------------------------------------- */

async function createBloodRequest() {

  const response =
    await api(
      "/api/blood-request",
      {
        method: "POST",

        body:
          JSON.stringify({

            name:
              document
                .getElementById("bloodPatient")
                .value,

            bloodGroup:
              document
                .getElementById("bloodGroup")
                .value,

            city:
              document
                .getElementById("bloodCity")
                .value,

            hospital:
              document
                .getElementById("bloodHospital")
                .value,

            phone:
              document
                .getElementById("bloodPhone")
                .value,

            urgency:
              document
                .getElementById("bloodUrgency")
                .value,

            details:
              document
                .getElementById("bloodDetails")
                .value

          })

      }
    );

  showMessage(
    "bloodMessage",
    response.success,
    response.message ||
    response.error
  );

}


/* ---------------------------------------------------------
   QUIZ
--------------------------------------------------------- */

async function loadQuiz() {

  const response =
    await api("/api/quiz");

  if (!response.success) {
    return;
  }

  quizQuestions =
    response.questions || [];

  document
    .getElementById("quizContainer")
    .innerHTML =
      quizQuestions
        .map(
          (question,index) => `

<div class="quiz-question">

<b>
${index + 1}.
${escapeHTML(question.question)}
</b>

${question.options
  .map(
    (option,optionIndex) => `

<label class="quiz-option">

<input
type="radio"
name="quiz-${index}"
value="${optionIndex}"
>

${escapeHTML(option)}

</label>

`
  )
  .join("")}

</div>

`
        )
        .join("");

}


/* ---------------------------------------------------------
   SUBMIT QUIZ
--------------------------------------------------------- */

async function submitQuiz() {

  const name =
    document
      .getElementById("quizName")
      .value
      .trim();

  if (!name) {

    alert(
      "Quiz submit karne se pehle name enter karo."
    );

    return;

  }

  const answers =
    quizQuestions.map(
      (question,index) => {

        const selected =
          document.querySelector(
            'input[name="quiz-' +
            index +
            '"]:checked'
          );

        return selected
          ? Number(selected.value)
          : -1;

      }
    );

  const response =
    await api(
      "/api/quiz/submit",
      {
        method: "POST",

        body:
          JSON.stringify({
            name,
            answers
          })

      }
    );

  if (!response.success) {

    document
      .getElementById("quizResult")
      .innerHTML =
        '<div class="error">' +
        escapeHTML(response.error) +
        '</div>';

    return;

  }

  latestQuizId =
    response.result.id;

  document
    .getElementById("quizResult")
    .innerHTML = `

<div class="success">

🏆 <b>
Score:
${response.result.score}/${response.result.total}
</b>

<br>

Percentage:
${response.result.percentage}%

<br><br>

${escapeHTML(response.message)}

<br><br>

<b>
Quiz Result ID:
${escapeHTML(response.result.id)}
</b>

</div>

`;

  await loadLeaderboard();

}


/* ---------------------------------------------------------
   LEADERBOARD
--------------------------------------------------------- */

async function loadLeaderboard() {

  const response =
    await api(
      "/api/leaderboard"
    );

  const container =
    document
      .getElementById("leaderboard");

  if (!response.success) {
    return;
  }

  container.innerHTML =
    response.leaderboard.length

      ? response.leaderboard
          .map(
            (item,index) => `

<div class="result">

<b>
#${index + 1}
${escapeHTML(item.name)}
</b>

<br>

${item.score}/${item.total}

•

${item.percentage}%

</div>

`
          )
          .join("")

      : '<div class="result">No quiz results yet.</div>';

}


/* ---------------------------------------------------------
   PRIZE CLAIM
--------------------------------------------------------- */

async function claimPrize() {

  let quizId =
    document
      .getElementById("prizeQuizId")
      .value;

  if (!quizId) {
    quizId = latestQuizId;
  }

  const response =
    await api(
      "/api/prize-claim",
      {
        method: "POST",

        body:
          JSON.stringify({

            name:
              document
                .getElementById("prizeName")
                .value,

            contact:
              document
                .getElementById("prizeContact")
                .value,

            quizId,

            message:
              document
                .getElementById("prizeMessage")
                .value

          })

      }
    );

  showMessage(
    "prizeMessage",
    response.success,
    response.message ||
    response.error
  );

}


/* ---------------------------------------------------------
   SCHOLARSHIP / JOBS
--------------------------------------------------------- */

async function loadOpportunities() {

  const response =
    await api(
      "/api/opportunities"
    );

  const container =
    document
      .getElementById(
        "opportunityContainer"
      );

  if (!response.success) {
    return;
  }

  container.innerHTML =
    response.opportunities
      .map(
        item => `

<div class="card">

<span class="badge">
${escapeHTML(item.category)}
</span>

<h3>
${escapeHTML(item.title)}
</h3>

<p>
${escapeHTML(item.description)}
</p>

<a
class="btn"
href="${item.url}"
target="_blank"
rel="noopener noreferrer"
>
🌐 Official Website
</a>

</div>

`
      )
      .join("");

}


/* ---------------------------------------------------------
   UNIVERSITY SEARCH
--------------------------------------------------------- */

async function searchUniversities() {

  const query =
    document
      .getElementById("universitySearch")
      .value;

  const response =
    await api(
      "/api/universities?q=" +
      encodeURIComponent(query)
    );

  const container =
    document
      .getElementById(
        "universityResults"
      );

  if (!response.success) {
    return;
  }

  container.innerHTML =
    response.universities.length

      ? response.universities
          .map(
            university => `

<div class="card">

<h3>
🏫
${escapeHTML(university.name)}
</h3>

<p>
${escapeHTML(university.state)}
</p>

<a
class="btn"
href="${university.official}"
target="_blank"
rel="noopener noreferrer"
>
Official Website
</a>

</div>

`
          )
          .join("")

      : '<div class="result">University not found.</div>';

}


/* ---------------------------------------------------------
   UPI
--------------------------------------------------------- */

function copyUPI() {

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {

    navigator.clipboard
      .writeText("${UPI_ID}");

  }

  document
    .getElementById("upiMessage")
    .innerHTML = `

<div class="success">

✅ UPI ID copied:

<b>
${UPI_ID}
</b>

</div>

`;

}


function openUPI() {

  window.location.href =
    "upi://pay?pa=${UPI_ID}" +
    "&pn=NurseStudy" +
    "&cu=INR";

}


/* ---------------------------------------------------------
   BOOK HELP
--------------------------------------------------------- */

async function sendBookRequest() {

  const response =
    await api(
      "/api/book-request",
      {
        method: "POST",

        body:
          JSON.stringify({

            name:
              document
                .getElementById("bookName")
                .value,

            semester:
              document
                .getElementById("bookSemester")
                .value,

            book:
              document
                .getElementById("bookSubject")
                .value,

            contact:
              document
                .getElementById("bookContact")
                .value,

            message:
              document
                .getElementById("bookMessage")
                .value

          })

      }
    );

  showMessage(
    "bookMessageResult",
    response.success,
    response.message ||
    response.error
  );

}


/* ---------------------------------------------------------
   MESSAGE HELPER
--------------------------------------------------------- */

function showMessage(
  elementId,
  success,
  message
) {

  const element =
    document.getElementById(
      elementId
    );

  if (!element) {
    return;
  }

  element.innerHTML = `

<div class="${success ? "success" : "error"}">

${escapeHTML(
  message ||
  (
    success
      ? "Success"
      : "Something went wrong"
  )
)}

</div>

`;

}


/* ---------------------------------------------------------
   AUTO LOAD SAVED PROFILE
--------------------------------------------------------- */

try {

  const savedProfile =
    localStorage.getItem(
      "nurseStudyProfile"
    );

  if (savedProfile) {

    studentProfile =
      JSON.parse(savedProfile);

  }

} catch (error) {

  console.log(
    "Profile load error:",
    error.message
  );

}


/* ---------------------------------------------------------
   START
--------------------------------------------------------- */

startApp();

</script>

</body>

</html>
`;

}


/* =========================================================
   PART 3 WILL ADD THE FINAL EXPRESS ROUTE + SERVER START
========================================================= */
/* =========================================================
   FINAL EXPRESS ROUTE
========================================================= */

app.get("/", (req, res) => {

  res.send(renderPage());

});


/* =========================================================
   HEALTH / STATUS
========================================================= */

app.get("/status", (req, res) => {

  res.json({
    success: true,
    message: "NurseStudy website is running.",
    service: "NurseStudy",
    port: PORT,
    time: new Date().toISOString()
  });

});


/* =========================================================
   404 API RESPONSE
========================================================= */

app.use("/api", (req, res) => {

  res.status(404).json({
    success: false,
    error: "API route not found."
  });

});


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "===================================="
    );

    console.log(
      "🩺 NurseStudy Server Started"
    );

    console.log(
      "Port:",
      PORT
    );

    console.log(
      "UPI:",
      UPI_ID
    );

    console.log(
      "===================================="
    );

  }
);
========================================================= */