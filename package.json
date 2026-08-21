const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "NurseStudy-2026-Secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  })
);

/* =========================================================
   DATABASE
========================================================= */

const db = new Database(
  path.join(__dirname, "nursestudy.db")
);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  semester TEXT NOT NULL,
  university TEXT NOT NULL,
  college TEXT NOT NULL,
  course TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

/* =========================================================
   NURSING CONTENT
========================================================= */

const SUBJECTS = {

"1st Semester":[
["Fundamentals of Nursing",
 "Fundamentals of Nursing is the basic foundation of nursing practice.",
 "Nursing process, patient safety, communication, basic procedures and holistic care."],

["Nursing Process",
 "The nursing process is a systematic method of providing individualized nursing care.",
 "Assessment, nursing diagnosis, planning, implementation and evaluation."],

["Vital Signs",
 "Vital signs are measurements that show important functions of the body.",
 "Temperature, pulse, respiration, blood pressure and oxygen saturation."],

["Hand Hygiene",
 "Hand hygiene means cleaning the hands to remove microorganisms and prevent infection.",
 "Hand hygiene before and after patient contact is essential."],

["Bed Making",
 "Bed making is preparing a clean, comfortable and safe bed for a patient.",
 "Cleanliness, comfort, privacy, safety and proper body mechanics."],

["Therapeutic Communication",
 "Therapeutic communication is purposeful communication used to help patients.",
 "Listening, empathy, respect, confidentiality and non-judgmental communication."],

["Patient Safety",
 "Patient safety means preventing avoidable harm during healthcare.",
 "Correct identification, fall prevention, medication safety and communication."],

["First Aid",
 "First aid is immediate basic care given to an injured or suddenly ill person.",
 "Assess danger, response, breathing and circulation and provide appropriate immediate help."]
],

"2nd Semester":[
["Microbiology",
 "Microbiology is the study of microorganisms and their relationship with health and disease.",
 "Bacteria, viruses, fungi, parasites, infection and prevention."],

["Pharmacology",
 "Pharmacology is the study of drugs and their effects on living organisms.",
 "Indications, dose, adverse effects, contraindications and nursing responsibilities."],

["Medication Safety",
 "Medication safety means giving medicines correctly and safely.",
 "Right patient, drug, dose, route, time, documentation and allergy checking."],

["Pain Assessment",
 "Pain assessment is the systematic assessment of a patient's pain.",
 "Site, severity, quality, duration, timing and effect on activities."],

["Fluid and Electrolyte Balance",
 "Fluid and electrolyte balance means maintaining appropriate water and electrolyte levels in the body.",
 "Intake, output, sodium, potassium, dehydration and fluid overload."],

["Nutrition",
 "Nutrition is the process by which the body obtains and uses nutrients.",
 "Carbohydrates, proteins, fats, vitamins, minerals and water."],

["Infection Control",
 "Infection control includes measures used to prevent the spread of infection.",
 "Hand hygiene, PPE, aseptic technique, sterilization and waste management."]
],

"3rd Semester":[
["Hypertension",
 "Hypertension is persistently elevated blood pressure.",
 "High salt intake, obesity, inactivity, tobacco, family history, age, diabetes and kidney disease."],

["Myocardial Infarction",
 "Myocardial infarction occurs when blood supply to part of the heart muscle is severely reduced or blocked.",
 "Chest discomfort, sweating, breathlessness, nausea and pain may occur."],

["COPD",
 "Chronic obstructive pulmonary disease is a chronic respiratory condition with persistent airflow limitation.",
 "Smoking and harmful environmental or occupational exposures are important risk factors."],

["Diabetes Mellitus",
 "Diabetes mellitus is a chronic metabolic disorder characterized by elevated blood glucose.",
 "Glucose monitoring, medicines, nutrition, exercise, foot care and complication prevention."],

["Shock",
 "Shock is a life-threatening condition in which tissue perfusion is inadequate.",
 "Hypotension, tachycardia, altered mental status, cold skin and reduced urine output."],

["Peptic Ulcer",
 "Peptic ulcer is a break in the lining of the stomach or duodenum.",
 "H. pylori infection, NSAIDs and other risk factors; pain and gastrointestinal bleeding may occur."],

["Asthma",
 "Asthma is a chronic inflammatory airway disease characterized by variable airflow obstruction.",
 "Wheezing, cough, chest tightness and breathlessness."],

["Pneumonia",
 "Pneumonia is an infection of the lung tissue.",
 "Fever, cough, sputum, chest discomfort and breathing difficulty may occur."],

["Renal Failure",
 "Renal failure is severe impairment of kidney function.",
 "Reduced urine output, edema, electrolyte imbalance and accumulation of waste products may occur."]
],

"4th Semester":[
["Surgical Nursing",
 "Surgical nursing provides care to patients before, during and after surgery.",
 "Preoperative, intraoperative and postoperative care."],

["Wound Care",
 "Wound care is assessment and management of a wound to promote healing.",
 "Aseptic technique, wound assessment, dressing, pain and infection prevention."],

["Blood Transfusion",
 "Blood transfusion is administration of blood or blood components to a patient.",
 "Correct patient and blood product identification and monitoring for reactions."],

["Postoperative Care",
 "Postoperative care is nursing care provided after surgery.",
 "Airway, breathing, circulation, pain, wound, urine output and complications."],

["Preoperative Care",
 "Preoperative care prepares a patient physically and psychologically for surgery.",
 "Assessment, consent verification, investigations, preparation and education."],

["Fracture",
 "A fracture is a break or disruption in the continuity of a bone.",
 "Pain, swelling, deformity and impaired movement may occur."],

["Burns",
 "A burn is tissue injury caused by heat, chemicals, electricity, radiation or friction.",
 "Airway, breathing, circulation, burn assessment, fluid management and infection prevention."],

["Cancer",
 "Cancer is uncontrolled abnormal growth of cells that may invade or spread.",
 "Early detection, treatment, nutrition, pain management and psychosocial support."]
],

"5th Semester":[
["Community Health Nursing",
 "Community health nursing combines nursing and public health principles to improve community health.",
 "Health promotion, prevention, assessment, education and follow-up."],

["Primary Health Care",
 "Primary health care is essential healthcare that is accessible to individuals and communities.",
 "Accessibility, participation, health education, appropriate technology and intersectoral coordination."],

["Health Education",
 "Health education helps people gain knowledge and skills to improve health.",
 "Assessment, planning, implementation and evaluation."],

["National Health Programmes",
 "National health programmes are organized programmes for prevention and control of important health problems.",
 "Prevention, treatment, health promotion and strengthening health services."],

["Epidemiology",
 "Epidemiology studies the distribution and determinants of health-related events in populations.",
 "Person, place, time, incidence, prevalence and prevention."],

["Family Health Nursing",
 "Family health nursing provides nursing care to families according to their health needs.",
 "Family assessment, education, prevention and follow-up."],

["School Health Nursing",
 "School health nursing promotes and protects the health of school children.",
 "Screening, health education, immunization support and referral."],

["Occupational Health",
 "Occupational health protects workers from health hazards related to work.",
 "Hazard identification, prevention, safety education and health surveillance."]
],

"6th Semester":[
["Child Health Nursing",
 "Child health nursing focuses on promoting, maintaining and restoring child health.",
 "Growth, development, nutrition, immunization, illness prevention and family-centred care."],

["Protein Energy Malnutrition",
 "Protein energy malnutrition occurs due to inadequate energy and protein intake.",
 "Poor growth, wasting, weakness and increased susceptibility to infection."],

["Acute Respiratory Infection",
 "Acute respiratory infection is an infection of the respiratory tract with relatively sudden onset.",
 "Cough, fever, fast breathing and difficulty in breathing."],

["Diarrhea and Dehydration",
 "Diarrhea is frequent passage of loose or watery stools and may cause dehydration.",
 "Fluid loss, electrolyte loss, reduced urine, thirst and altered consciousness."],

["Neonatal Jaundice",
 "Neonatal jaundice is yellow discoloration of the skin and sclera due to increased bilirubin.",
 "Assess onset, feeding, activity and bilirubin when clinically indicated."],

["Low Birth Weight Baby",
 "A low birth weight baby weighs less than 2500 grams at birth.",
 "Temperature maintenance, feeding, infection prevention and monitoring are important."],

["Prematurity",
 "A preterm baby is born before completion of 37 weeks of gestation.",
 "Warmth, respiratory support when needed, feeding, infection prevention and monitoring."],

["Kangaroo Mother Care",
 "Kangaroo Mother Care uses prolonged skin-to-skin contact for small or preterm babies.",
 "Warmth, breastfeeding, bonding and physiological stability."],

["Congenital Heart Disease",
 "Congenital heart disease refers to structural abnormalities of the heart present from birth.",
 "ASD, VSD, PDA, TOF and other defects may occur."],

["Tetralogy of Fallot",
 "Tetralogy of Fallot is a congenital heart defect involving four major abnormalities.",
 "Cyanosis, breathing difficulty and hypoxic episodes may occur."],

["Cleft Lip and Palate",
 "Cleft lip and palate are congenital openings or gaps in the lip and/or palate.",
 "Feeding difficulty, aspiration risk, speech problems and psychosocial concerns."],

["Hydrocephalus",
 "Hydrocephalus is abnormal accumulation of cerebrospinal fluid in the ventricular system.",
 "Increasing head circumference, vomiting, irritability and neurological signs may occur."],

["Spina Bifida",
 "Spina bifida is a neural tube defect caused by incomplete closure of the spinal column.",
 "Neurological deficits, weakness, bladder/bowel problems and hydrocephalus may occur."],

["Meningitis",
 "Meningitis is inflammation of the membranes covering the brain and spinal cord.",
 "Fever, headache, vomiting, neck stiffness and altered consciousness may occur."],

["Febrile Convulsion",
 "A febrile convulsion is a seizure associated with fever in a young child without another identified cause.",
 "Protect the child from injury, maintain airway and manage fever as appropriate."],

["Cerebral Palsy",
 "Cerebral palsy is a group of permanent disorders affecting movement and posture due to disturbance in the developing brain.",
 "Abnormal muscle tone, posture and motor difficulties may occur."],

["Nephrotic Syndrome",
 "Nephrotic syndrome is characterized by heavy protein loss in urine and associated edema.",
 "Edema, proteinuria, hypoalbuminemia and increased infection risk."],

["Acute Glomerulonephritis",
 "Acute glomerulonephritis is inflammation of the kidney glomeruli.",
 "Hematuria, edema, hypertension and reduced urine may occur."],

["Leukemia",
 "Leukemia is a malignant disorder of blood-forming tissues.",
 "Anemia, infections, bleeding and weakness may occur."],

["Hemophilia",
 "Hemophilia is an inherited bleeding disorder caused by deficiency of certain clotting factors.",
 "Prolonged bleeding and joint or muscle bleeding may occur."],

["Thalassemia",
 "Thalassemia is an inherited disorder affecting hemoglobin production.",
 "Anemia, pallor, fatigue and complications from repeated transfusions may occur."],

["Iron Deficiency Anemia",
 "Iron deficiency anemia occurs when the body does not have enough iron to produce adequate hemoglobin.",
 "Pallor, weakness, fatigue and poor concentration may occur."],

["Immunization",
 "Immunization protects individuals against vaccine-preventable diseases.",
 "Correct vaccine, dose, route, timing, storage and documentation are important."],

["IMNCI",
 "Integrated Management of Neonatal and Childhood Illness is an integrated approach to managing common childhood illnesses.",
 "Assessment, classification, treatment, counselling, referral and follow-up."]
],

"7th Semester":[
["Nursing Research",
 "Nursing research is systematic investigation that generates knowledge relevant to nursing practice.",
 "Problem, literature review, objectives, design, sampling, data collection, analysis and reporting."],

["Research Problem",
 "A research problem is a clear and focused issue that can be investigated systematically.",
 "It should be relevant, feasible and researchable."],

["Research Design",
 "Research design is the overall plan used to conduct a research study.",
 "Quantitative, qualitative, experimental and non-experimental approaches."],

["Sampling",
 "Sampling is selecting participants from a defined population for a study.",
 "Probability and non-probability sampling."],

["Data Collection",
 "Data collection is systematic gathering of information required for research.",
 "Questionnaires, interviews, observations and checklists."],

["Nursing Management",
 "Nursing management coordinates people and resources to achieve safe and effective nursing care.",
 "Planning, organizing, staffing, directing, coordination and evaluation."],

["Leadership",
 "Leadership is influencing and guiding people toward a common goal.",
 "Communication, delegation, motivation, supervision and decision-making."],

["Professional Nursing",
 "Professional nursing involves safe, ethical, competent and evidence-based care.",
 "Ethics, accountability, confidentiality, communication and continuous learning."],

["Budgeting",
 "Budgeting is the process of planning and controlling financial resources.",
 "Income, expenditure, planning, control and evaluation."],

["Planning",
 "Planning is deciding in advance what should be done, how, when and by whom.",
 "Goals, objectives, priorities, resources, implementation and evaluation."]
]

};

/* =========================================================
   UNIVERSITIES / COLLEGES
========================================================= */

const UNIVERSITIES = [
"Baba Farid University of Health Sciences",
"AIIMS New Delhi",
"Punjab University",
"Punjabi University",
"Guru Nanak Dev University",
"Rajiv Gandhi University of Health Sciences",
"Indian Nursing Council",
"Other University"
];

const COLLEGES = [
"Guru Arjun Dev College of Nursing",
"Government College of Nursing",
"AIIMS College/Institute of Nursing",
"Other College"
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function esc(v){
  return String(v ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function allTopics(){
  const arr=[];
  Object.keys(SUBJECTS).forEach(sem=>{
    SUBJECTS[sem].forEach(t=>{
      arr.push({
        semester:sem,
        topic:t[0],
        definition:t[1],
        key:t[2]
      });
    });
  });
  return arr;
}

/* =========================================================
   API - REGISTER
========================================================= */

app.post("/api/register",(req,res)=>{
  try{
    const {
      name,
      phone,
      gender,
      semester,
      university,
      college,
      course
    }=req.body;

    if(!name || !phone || !gender || !semester ||
       !university || !college || !course){
      return res.status(400).json({
        success:false,
        message:"Please fill all details."
      });
    }

    const cleanPhone=String(phone).replace(/\D/g,"");

    if(cleanPhone.length!==10){
      return res.status(400).json({
        success:false,
        message:"Please enter a valid 10 digit mobile number."
      });
    }

    const result=db.prepare(`
      INSERT INTO students
      (name,phone,gender,semester,university,college,course)
      VALUES (?,?,?,?,?,?,?)
    `).run(
      String(name).trim(),
      cleanPhone,
      String(gender),
      String(semester),
      String(university),
      String(college),
      String(course)
    );

    req.session.studentId=result.lastInsertRowid;

    const student=db.prepare(`
      SELECT * FROM students WHERE id=?
    `).get(result.lastInsertRowid);

    res.json({
      success:true,
      student
    });

  }catch(e){
    console.error(e);
    res.status(500).json({
      success:false,
      message:"Server error."
    });
  }
});

/* =========================================================
   API - LOGIN BY PHONE
========================================================= */

app.post("/api/login",(req,res)=>{
  try{
    const phone=String(req.body.phone||"").replace(/\D/g,"");

    if(phone.length!==10){
      return res.status(400).json({
        success:false,
        message:"Enter valid mobile number."
      });
    }

    const student=db.prepare(`
      SELECT * FROM students
      WHERE phone=?
      ORDER BY id DESC
      LIMIT 1
    `).get(phone);

    if(!student){
      return res.status(404).json({
        success:false,
        message:"Student not found. Please register first."
      });
    }

    req.session.studentId=student.id;

    res.json({
      success:true,
      student
    });

  }catch(e){
    res.status(500).json({
      success:false,
      message:"Login error."
    });
  }
});

/* =========================================================
   API - CURRENT STUDENT
========================================================= */

app.get("/api/me",(req,res)=>{
  if(!req.session.studentId){
    return res.json({
      success:false,
      loggedIn:false
    });
  }

  const student=db.prepare(`
    SELECT * FROM students WHERE id=?
  `).get(req.session.studentId);

  if(!student){
    req.session.destroy(()=>{});
    return res.json({
      success:false,
      loggedIn:false
    });
  }

  res.json({
    success:true,
    loggedIn:true,
    student
  });
});

/* =========================================================
   API - LOGOUT
========================================================= */

app.post("/api/logout",(req,res)=>{
  req.session.destroy(()=>{
    res.json({success:true});
  });
});

/* =========================================================
   ADMIN
========================================================= */

function adminOnly(req,res,next){
  if(req.session.isAdmin){
    return next();
  }

  res.status(401).json({
    success:false,
    message:"Admin login required."
  });
}

app.post("/api/admin/login",(req,res)=>{
  const password=String(req.body.password||"");

  const correct=
    process.env.ADMIN_PASSWORD ||
    "NurseStudyAdmin2026";

  if(password===correct){
    req.session.isAdmin=true;
    return res.json({success:true});
  }

  res.status(401).json({
    success:false,
    message:"Wrong password."
  });
});

app.get("/api/admin/students",adminOnly,(req,res)=>{
  const students=db.prepare(`
    SELECT id,name,phone,gender,semester,
           university,college,course,created_at
    FROM students
    ORDER BY id DESC
  `).all();

  res.json({
    success:true,
    students
  });
});

app.get("/api/student-count",(req,res)=>{
  const row=db.prepare(`
    SELECT COUNT(*) AS total FROM students
  `).get();

  res.json({
    success:true,
    total:row.total
  });
});

/* =========================================================
   MAIN WEBSITE
========================================================= */

const HTML=String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="theme-color" content="#0f766e">
<title>NurseStudy - Learn Nursing</title>

<style>
*{box-sizing:border-box}

:root{
--p:#0f766e;
--p2:#14b8a6;
--dark:#102a43;
--text:#243b53;
--muted:#627d98;
--bg:#f4f9fa;
--white:#fff;
--border:#d9e2ec;
}

body{
margin:0;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
background:var(--bg);
color:var(--text);
}

header{
position:sticky;
top:0;
z-index:50;
background:#fff;
border-bottom:1px solid var(--border);
}

.nav{
width:min(1100px,94%);
margin:auto;
height:68px;
display:flex;
align-items:center;
justify-content:space-between;
}

.logo{
font-size:23px;
font-weight:900;
color:var(--dark);
display:flex;
align-items:center;
gap:10px;
}

.logoIcon{
width:44px;
height:44px;
border-radius:14px;
display:grid;
place-items:center;
background:linear-gradient(135deg,var(--p),var(--p2));
font-size:22px;
}

.menuBtn{
border:0;
background:#e8f8f5;
color:var(--p);
font-size:24px;
border-radius:13px;
padding:10px 14px;
}

.container{
width:min(1100px,94%);
margin:auto;
}

.hero{
padding:45px 0;
background:linear-gradient(180deg,#e7faf7,#f4f9fa);
}

.badge{
display:inline-block;
padding:9px 14px;
border-radius:50px;
background:#d9f5f0;
color:#08645e;
font-weight:800;
}

h1{
font-size:clamp(42px,8vw,70px);
line-height:1;
letter-spacing:-3px;
margin:18px 0;
color:var(--dark);
}

.hero p{
font-size:18px;
line-height:1.7;
color:var(--muted);
}

.search{
display:flex;
gap:8px;
background:#fff;
border:1px solid var(--border);
padding:7px;
border-radius:16px;
margin-top:22px;
}

.search input{
flex:1;
border:0;
outline:0;
padding:13px;
font-size:16px;
min-width:0;
}

button{
cursor:pointer;
}

.btn{
border:0;
background:var(--p);
color:white;
font-weight:800;
padding:13px 18px;
border-radius:11px;
}

section{
padding:38px 0;
}

.title h2{
margin:0;
font-size:30px;
color:var(--dark);
}

.title p{
color:var(--muted);
line-height:1.6;
}

.tabs{
display:flex;
gap:8px;
overflow-x:auto;
padding:12px 0;
}

.tab{
white-space:nowrap;
border:1px solid var(--border);
background:#fff;
color:#1668bd;
padding:11px 16px;
border-radius:11px;
font-weight:800;
}

.tab.active{
background:var(--p);
color:white;
border-color:var(--p);
}

.card{
background:white;
border:1px solid var(--border);
border-radius:18px;
padding:20px;
margin:14px 0;
box-shadow:0 5px 20px rgba(16,42,67,.05);
}

.topic h3{
color:var(--dark);
margin-top:0;
font-size:21px;
}

.topic p{
line-height:1.7;
color:var(--muted);
}

.actions{
display:flex;
gap:8px;
flex-wrap:wrap;
}

.actions button{
border:1px solid var(--border);
background:#fff;
color:var(--p);
padding:10px 12px;
border-radius:10px;
font-weight:800;
}

.actions button:hover{
background:#e8f8f5;
}

.modal{
position:fixed;
inset:0;
background:rgba(0,0,0,.65);
z-index:100;
display:flex;
align-items:center;
justify-content:center;
padding:12px;
}

.modalBox{
background:white;
width:min(850px,100%);
max-height:92vh;
overflow:auto;
border-radius:20px;
}

.modalHead{
position:sticky;
top:0;
z-index:2;
background:var(--p);
color:white;
padding:16px;
display:flex;
justify-content:space-between;
align-items:center;
}

.close{
border:0;
background:transparent;
color:white;
font-size:24px;
}

.modalBody{
padding:18px;
}

.answer{
background:#effaf8;
border:1px solid #cceee8;
border-radius:15px;
padding:16px;
margin:12px 0;
line-height:1.75;
}

.answer h3{
margin-top:0;
color:#08645e;
}

.mcq{
background:#fff;
border:1px solid var(--border);
border-radius:15px;
padding:16px;
margin:12px 0;
line-height:1.7;
}

.correct{
color:#087f5b;
font-weight:900;
}

.loginBox{
max-width:720px;
margin:auto;
background:white;
padding:22px;
border-radius:22px;
border:1px solid var(--border);
box-shadow:0 8px 30px rgba(16,42,67,.08);
}

.grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:13px;
}

.field{
display:flex;
flex-direction:column;
gap:7px;
}

.field label{
font-weight:800;
color:var(--dark);
}

.field input,
.field select{
width:100%;
padding:14px;
border:1px solid var(--border);
border-radius:12px;
font-size:16px;
background:white;
}

.full{
grid-column:1/-1;
}

.check{
display:flex;
gap:10px;
align-items:flex-start;
color:var(--muted);
line-height:1.5;
}

.profile{
background:linear-gradient(135deg,#0f766e,#14b8a6);
color:white;
border-radius:18px;
padding:18px;
margin-bottom:20px;
}

.profile button{
background:white;
color:var(--p);
border:0;
padding:10px 14px;
border-radius:10px;
font-weight:800;
}

.sideMenu{
position:fixed;
right:15px;
top:75px;
z-index:80;
background:white;
width:270px;
border-radius:18px;
box-shadow:0 10px 35px rgba(0,0,0,.18);
padding:10px;
border:1px solid var(--border);
}

.sideMenu button{
display:block;
width:100%;
text-align:left;
border:0;
background:white;
padding:14px;
border-radius:10px;
font-weight:800;
color:var(--dark);
}

.sideMenu button:hover{
background:#e8f8f5;
}

.hidden{
display:none!important;
}

.notice{
background:#fff8e8;
border:1px solid #efd59c;
padding:17px;
border-radius:15px;
line-height:1.7;
}

footer{
background:#102a43;
color:#c7d5e2;
padding:40px 0;
}

footer h2{
color:white;
}

@media(max-width:650px){
.grid{
grid-template-columns:1fr;
}

.full{
grid-column:auto;
}

.search{
flex-direction:column;
}

.search .btn{
width:100%;
}

.actions button{
width:100%;
}

h1{
letter-spacing:-2px;
}
}
</style>
</head>

<body>

<header>
<div class="nav">

<div class="logo">
<div class="logoIcon">🩺</div>
NurseStudy
</div>

<button class="menuBtn" onclick="toggleMenu()">☰</button>

</div>
</header>

<div id="menu" class="sideMenu hidden">

<button onclick="go('study')">📚 Study Centre</button>
<button onclick="go('books')">📚 Books Give / Take</button>
<button onclick="go('donate')">❤️ Donate</button>
<button onclick="go('about')">👨‍⚕️ Founder</button>
<button onclick="logout()">🚪 Logout</button>

</div>

<section id="loginSection">

<div class="container">

<div class="loginBox">

<div class="badge">🎓 B.Sc. Nursing • Semester 1–7</div>

<h1 style="font-size:42px;letter-spacing:-2px">
Welcome to NurseStudy
</h1>

<p>
Pehle apni basic details bhar do. Uske baad tum directly
NurseStudy ke Notes, Viva, MCQ aur Important Questions padh sakte ho.
</p>

<form id="registerForm">

<div class="grid">

<div class="field">
<label>👤 Full Name *</label>
<input id="name" required placeholder="Enter your name">
</div>

<div class="field">
<label>📱 Mobile Number *</label>
<input id="phone" required inputmode="numeric"
maxlength="10" placeholder="10 digit mobile">
</div>

<div class="field">
<label>⚧ Gender *</label>
<select id="gender" required>
<option value="">Select gender</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>
</select>
</div>

<div class="field">
<label>🎓 Semester *</label>
<select id="semester" required>
<option value="">Select semester</option>
${Object.keys(SUBJECTS).map(s=>`<option>${s}</option>`).join("")}
</select>
</div>

<div class="field full">
<label>🏛️ University *</label>
<select id="university" required>
<option value="">Select university</option>
${UNIVERSITIES.map(x=>`<option>${esc(x)}</option>`).join("")}
</select>
</div>

<div class="field full">
<label>🏫 College *</label>
<select id="college" required>
<option value="">Select college</option>
${COLLEGES.map(x=>`<option>${esc(x)}</option>`).join("")}
</select>
</div>

<div class="field full">
<label>📚 Course</label>
<select id="course">
<option>B.Sc. Nursing</option>
<option>GNM Nursing</option>
<option>ANM</option>
<option>Other</option>
</select>
</div>

</div>

<br>

<label class="check">
<input type="checkbox" id="agree" required>
<span>
I agree that the details entered above may be used for
NurseStudy student services.
</span>
</label>

<br>

<button class="btn" style="width:100%;font-size:17px">
🚀 Enter NurseStudy
</button>

</form>

<hr style="border:0;border-top:1px solid #d9e2ec;margin:25px 0">

<h3>Already registered?</h3>

<div class="field">
<label>📱 Mobile Number</label>
<input id="loginPhone" inputmode="numeric"
maxlength="10" placeholder="Enter registered mobile">
</div>

<br>

<button class="btn" onclick="login()" style="width:100%">
🔐 Login
</button>

<p id="loginMsg"></p>

</div>

</div>

</section>

<main id="app" class="hidden">

<section class="hero">

<div class="container">

<div id="profile"></div>

<span class="badge">📖 Nursing Education Platform</span>

<h1>
Learn Nursing.<br>
<span style="color:var(--p)">Help Each Other.</span>
</h1>

<p>
Notes + Viva + MCQs + Important Questions.
Har answer ko simple English aur normal Hindi/Hinglish
language mein samjhaya gaya hai.
</p>

<div class="search">

<input id="search"
placeholder="Search Hypertension, COPD, KMC, Research...">

<button class="btn" onclick="searchTopics()">Search</button>

</div>

<div id="searchResults"></div>

</div>

</section>

<section id="study">

<div class="container">

<div class="title">
<h2>📚 Nursing Study Centre</h2>
<p>
Semester choose karo aur topic ke Notes, Viva, MCQ ya Important Answer kholo.
</p>
</div>

<div id="tabs" class="tabs"></div>

<div id="topics"></div>

</div>

</section>

<section id="books">

<div class="container">

<div class="title">
<h2>📚 Books Give / Take</h2>
<p>Students apni nursing books dusre students ke saath share kar sakte hain.</p>
</div>

<div class="card">

<h3>📖 Book Exchange</h3>

<p>
Agar tumhare paas extra nursing book hai to kisi junior/student
ko de sakte ho. Agar book chahiye to yahan request bhej sakte ho.
</p>

<div class="actions">

<button onclick="bookAction('Give')">📚 I Want To Give Book</button>

<button onclick="bookAction('Need')">🔎 I Need A Book</button>

</div>

</div>

</div>

</section>

<section id="donate">

<div class="container">

<div class="card">

<h2>❤️ Support NurseStudy</h2>

<p>
Agar aap NurseStudy ke educational work ko support karna chahte hain,
to voluntary donation kar sakte hain.
</p>

<div class="answer">

<h3>UPI ID</h3>

<strong style="font-size:20px">
7763082034@kotak
</strong>

<br><br>

<button class="btn"
onclick="navigator.clipboard.writeText('7763082034@kotak');alert('UPI ID copied!')">
Copy UPI
</button>

</div>

<p>
Donation completely voluntary hai.
</p>

</div>

</div>

</section>

<section id="about">

<div class="container">

<div class="card">

<h2>👨‍⚕️ Founder</h2>

<h3>Nadeem</h3>

<p>
NurseStudy ka aim nursing students ko easy language mein
study material, viva preparation, MCQs aur important questions
provide karna hai.
</p>

<p>
<strong>Learn Nursing • Help Each Other ❤️</strong>
</p>

</div>

</div>

</section>

</main>

<footer>

<div class="container">

<h2>🩺 NurseStudy</h2>

<p>
B.Sc. Nursing study platform — Notes, Viva, MCQs and Important Questions.
</p>

<p>
Founder: <strong>Nadeem</strong>
</p>

</div>

</footer>

<div id="modal" class="modal hidden" onclick="if(event.target===this)closeModal()">

<div class="modalBox">

<div class="modalHead">
<strong id="modalTitle">NurseStudy</strong>
<button class="close" onclick="closeModal()">✕</button>
</div>

<div id="modalBody" class="modalBody"></div>

</div>

</div>

<script>

let currentStudent=null;
let activeSemester="1st Semester";

const DATA=${JSON.stringify(allTopics())};

function toggleMenu(){
document.getElementById("menu").classList.toggle("hidden");
}

function go(id){
document.getElementById("menu").classList.add("hidden");
document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
}

function esc2(v){
return String(v??"")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");
}

/* =========================================================
   REGISTER
========================================================= */

document.getElementById("registerForm").addEventListener("submit",async(e)=>{
e.preventDefault();

const data={
name:document.getElementById("name").value,
phone:document.getElementById("phone").value,
gender:document.getElementById("gender").value,
semester:document.getElementById("semester").value,
university:document.getElementById("university").value,
college:document.getElementById("college").value,
course:document.getElementById("course").value
};

try{

const r=await fetch("/api/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
});

const result=await r.json();

if(!result.success){
alert(result.message||"Registration failed.");
return;
}

currentStudent=result.student;
openApp();

}catch(error){
alert("Server se connection nahi ho raha. Please refresh karke try karo.");
}

});

/* =========================================================
   LOGIN
========================================================= */

async function login(){

const phone=document.getElementById("loginPhone").value;

if(!/^[0-9]{10}$/.test(phone)){
document.getElementById("loginMsg").textContent=
"Please enter 10 digit mobile number.";
return;
}

try{

const r=await fetch("/api/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({phone})
});

const result=await r.json();

if(!result.success){
document.getElementById("loginMsg").textContent=
result.message;
return;
}

currentStudent=result.student;
openApp();

}catch(e){
alert("Server connection error.");
}

}

/* =========================================================
   OPEN APP
========================================================= */

function openApp(){

document.getElementById("loginSection").classList.add("hidden");
document.getElementById("app").classList.remove("hidden");

document.getElementById("profile").innerHTML=`

<div class="profile">

<h2>Welcome, ${esc2(currentStudent.name)} 👋</h2>

<p>
🎓 ${esc2(currentStudent.semester)}
<br>
🏫 ${esc2(currentStudent.college)}
<br>
🏛️ ${esc2(currentStudent.university)}
</p>

<button onclick="logout()">Logout</button>

</div>
`;

renderTabs();
renderTopics(activeSemester);

window.scrollTo({top:0,behavior:"smooth"});
}

/* =========================================================
   TABS
========================================================= */

function renderTabs(){

const tabs=document.getElementById("tabs");

tabs.innerHTML="";

Object.keys(${JSON.stringify(SUBJECTS)}).forEach(semester=>{

const b=document.createElement("button");

b.className="tab";

if(semester===activeSemester)b.classList.add("active");

b.textContent=semester;

b.onclick=()=>{
activeSemester=semester;
renderTabs();
renderTopics(semester);
};

tabs.appendChild(b);

});

}

/* =========================================================
   TOPICS
========================================================= */

function renderTopics(semester){

const list=DATA.filter(x=>x.semester===semester);

document.getElementById("topics").innerHTML=list.map((x,i)=>`

<div class="card topic">

<h3>${i+1}. ${esc2(x.topic)}</h3>

<p>
<strong>Simple English:</strong><br>
${esc2(x.definition)}
</p>

<p>
<strong>Easy Samajh:</strong><br>
${easyExplain(x)}
</p>

<p>
<strong>Important points:</strong><br>
${esc2(x.key)}
</p>

<div class="actions">

<button onclick='showNotes(${JSON.stringify(x.topic)})'>
📖 Notes + Answer
</button>

<button onclick='showViva(${JSON.stringify(x.topic)})'>
🎤 Viva + Answer
</button>

<button onclick='showMCQ(${JSON.stringify(x.topic)})'>
🧠 MCQ + Answer
</button>

<button onclick='showImportant(${JSON.stringify(x.topic)})'>
🎯 Important Q + Answer
</button>

</div>

</div>

`).join("");

}

/* =========================================================
   EASY EXPLANATION
========================================================= */

function easyExplain(x){

return `
<strong>${esc2(x.topic)}</strong> ko simple language mein
aise samjho: ye nursing ka important topic hai jisme nurse ko
patient ki condition samajhni, important signs observe karne,
safe care deni, complications ko jaldi identify karna aur
patient/family ko proper education deni hoti hai.
<br><br>
<strong>Yaad rakhne ka easy point:</strong>
Definition → Causes → Symptoms → Investigation →
Treatment → Nursing Management → Complications → Health Education.
`;

}

/* =========================================================
   MODAL
========================================================= */

function openModal(title,html){

document.getElementById("modalTitle").textContent=title;
document.getElementById("modalBody").innerHTML=html;
document.getElementById("modal").classList.remove("hidden");

}

function closeModal(){
document.getElementById("modal").classList.add("hidden");
}

/* =========================================================
   NOTES
========================================================= */

function getTopic(name){
return DATA.find(x=>x.topic===name);
}

function showNotes(name){

const x=getTopic(name);
if(!x)return;

openModal(
"📖 Notes — "+x.topic,
`

<div class="answer">

<h3>1. Definition</h3>

<p>
${esc2(x.definition)}
</p>

<p>
<strong>Easy Samajh:</strong>
<br>
${easyExplain(x)}
</p>

</div>

<div class="answer">

<h3>2. Causes / Risk Factors</h3>

<p>${esc2(x.key)}</p>

<p>
Risk factors ka matlab hai wo cheezein jo disease/problem
hone ka chance badha sakti hain.
</p>

</div>

<div class="answer">

<h3>3. Signs and Symptoms</h3>

<p>
Patient ki complaints, vital signs aur condition-specific
physical findings assess karein.
</p>

<ul>
<li>Patient history</li>
<li>Vital signs</li>
<li>Physical assessment</li>
<li>Condition-specific symptoms</li>
<li>Changes in patient's condition</li>
</ul>

</div>

<div class="answer">

<h3>4. Investigations</h3>

<p>
Condition ke according doctor ke order par laboratory tests,
imaging, monitoring aur other investigations ki ja sakti hain.
</p>

</div>

<div class="answer">

<h3>5. Treatment / Management</h3>

<p>
Treatment disease aur patient ki condition par depend karta hai.
Prescribed medicines, supportive treatment, monitoring aur
underlying cause ka management important hai.
</p>

</div>

<div class="answer">

<h3>6. Nursing Management</h3>

<ul>
<li>Patient ki condition assess karein.</li>
<li>Vital signs monitor karein.</li>
<li>Prescribed medicines safely administer karein.</li>
<li>Comfort aur safety maintain karein.</li>
<li>Nutrition aur hydration ka dhyan rakhein.</li>
<li>Complications observe karein.</li>
<li>Patient aur family ko simple language mein samjhayein.</li>
<li>Accurate documentation karein.</li>
</ul>

<p>
<strong>Easy Samajh:</strong>
Nurse ka main kaam patient ko safely monitor karna,
treatment dena, problem ko jaldi identify karna aur patient
ko care ke baare mein samjhana hai.
</p>

</div>

<div class="answer">

<h3>7. Complications</h3>

<p>
Disease-specific complications ke signs observe karein aur
patient ki condition worsen hone par timely reporting karein.
</p>

</div>

<div class="answer">

<h3>8. Health Education</h3>

<ul>
<li>Medicine correctly lena.</li>
<li>Diet aur lifestyle instructions follow karna.</li>
<li>Warning signs samajhna.</li>
<li>Follow-up par jana.</li>
<li>Complications prevent karna.</li>
</ul>

</div>

<div class="answer">

<h3>Exam Conclusion</h3>

<p>
Early assessment, correct treatment aur effective nursing care
patient outcome improve karne mein help karti hai.
</p>

</div>
`
);

}

/* =========================================================
   VIVA
========================================================= */

function showViva(name){

const x=getTopic(name);
if(!x)return;

const qs=[

[
"What is "+x.topic+"?",
x.definition
],

[
"Why is "+x.topic+" important?",
x.key
],

[
"What should a nurse assess?",
"Patient history, signs and symptoms, vital signs and relevant physical findings."
],

[
"What are important nursing responsibilities?",
"Assessment, monitoring, safe treatment, comfort, safety, education and documentation."
],

[
"What should the nurse teach the patient?",
"Medicines, diet/lifestyle, warning signs, prevention and follow-up according to the condition."
],

[
"What is the easiest way to remember this topic?",
"Definition → Causes → Symptoms → Investigation → Treatment → Nursing Management → Complications → Health Education."
]

];

openModal(
"🎤 Viva — "+x.topic,
qs.map((q,i)=>`

<div class="answer">

<h3>Q${i+1}. ${esc2(q[0])}</h3>

<p>
<strong>Answer:</strong><br>
${esc2(q[1])}
</p>

<p>
<strong>Simple language:</strong><br>
Iska simple matlab hai ki nurse ko patient ki condition
samajhkar safe care aur proper education deni hoti hai.
</p>

</div>

`).join("")
);

}

/* =========================================================
   MCQ
========================================================= */

function showMCQ(name){

const x=getTopic(name);

const questions=[

{
q:"Which statement best describes "+x.topic+"?",
o:[
x.definition,
"It has no relation to patient care.",
"It never requires assessment.",
"It is only a laboratory test."
],
a:"A",
e:"Option A is correct because it gives the appropriate definition."
},

{
q:"Which is an important point regarding "+x.topic+"?",
o:[
x.key,
"Patient assessment should be avoided.",
"Documentation is unnecessary.",
"Patient education has no role."
],
a:"A",
e:"Option A is correct because it represents an important point."
},

{
q:"Which nursing action is most appropriate?",
o:[
"Assess the patient, provide safe care, monitor the response and document.",
"Ignore changes in vital signs.",
"Give treatment without assessment.",
"Do not educate the patient."
],
a:"A",
e:"Assessment, safe care, monitoring and documentation are basic nursing responsibilities."
},

{
q:"What should a nurse do when the patient's condition worsens?",
o:[
"Recognize the change and report it promptly according to protocol.",
"Ignore it.",
"Stop all observations.",
"Hide the information."
],
a:"A",
e:"Early recognition and timely reporting can prevent complications."
},

{
q:"Which is important for patient care?",
o:[
"Patient education and prevention of complications.",
"Ignoring patient concerns.",
"Avoiding documentation.",
"Stopping monitoring."
],
a:"A",
e:"Education and prevention are important parts of nursing care."
}

];

openModal(
"🧠 MCQ — "+x.topic+" — Answers Included",
questions.map((q,i)=>`

<div class="mcq">

<h3>Q${i+1}. ${esc2(q.q)}</h3>

<p>A. ${esc2(q.o[0])}</p>
<p>B. ${esc2(q.o[1])}</p>
<p>C. ${esc2(q.o[2])}</p>
<p>D. ${esc2(q.o[3])}</p>

<p class="correct">
✅ Correct Answer: ${q.a}
</p>

<p>
<strong>Explanation:</strong>
${esc2(q.e)}
</p>

</div>

`).join("")
);

}

/* =========================================================
   IMPORTANT QUESTION
========================================================= */

function showImportant(name){

const x=getTopic(name);

openModal(
"🎯 Important Question + Complete Answer",
`

<div class="answer">

<h3>Important Question</h3>

<p>
<strong>Write a detailed answer on: ${esc2(x.topic)}</strong>
</p>

</div>

<div class="answer">

<h3>Model Answer</h3>

<h4>1. Definition</h4>
<p>${esc2(x.definition)}</p>

<h4>2. Causes / Risk Factors</h4>
<p>${esc2(x.key)}</p>

<h4>3. Types / Classification</h4>
<p>
Write the major types or classification applicable to
this condition/topic.
</p>

<h4>4. Signs and Symptoms</h4>
<p>
Assess the patient's complaints, vital signs and
condition-specific clinical findings.
</p>

<h4>5. Investigations</h4>
<p>
Relevant laboratory investigations, imaging and other
tests may be performed according to the condition and
medical advice.
</p>

<h4>6. Treatment / Management</h4>
<p>
Treatment depends on the condition. Prescribed medicines,
supportive care, monitoring and treatment of the underlying
problem are important.
</p>

<h4>7. Nursing Management</h4>

<ul>
<li>Assess patient.</li>
<li>Monitor vital signs.</li>
<li>Administer prescribed treatment safely.</li>
<li>Maintain comfort and safety.</li>
<li>Maintain nutrition/hydration as appropriate.</li>
<li>Observe for complications.</li>
<li>Provide psychological support.</li>
<li>Educate patient and family.</li>
<li>Document nursing care.</li>
</ul>

<h4>8. Complications</h4>
<p>
Observe for complications specific to the condition and
report deterioration promptly.
</p>

<h4>9. Health Education</h4>
<p>
Explain medicines, diet, lifestyle, warning signs,
prevention and follow-up in simple language.
</p>

<h4>10. Conclusion</h4>
<p>
Early assessment, appropriate treatment and effective
nursing care help improve patient outcomes.
</p>

<hr>

<h3>🗣️ Bachhe ko simple language mein kaise samjhayen?</h3>

<p>
Is topic ko ratne ki jagah pehle iska simple meaning samjho.
Patient ko kya problem hai, problem kyu hoti hai, patient mein
kya signs aate hain, doctor kya treatment dega aur nurse ko
patient ke liye kya karna hai — bas isi sequence mein answer yaad karo.
</p>

</div>
`
);

}

/* =========================================================
   SEARCH
========================================================= */

function searchTopics(){

const q=document.getElementById("search").value.toLowerCase().trim();

if(!q){
document.getElementById("searchResults").innerHTML="";
return;
}

const found=DATA.filter(x=>
(x.topic+" "+x.definition+" "+x.key)
.toLowerCase()
.includes(q)
);

if(!found.length){
document.getElementById("searchResults").innerHTML=`
<div class="card">
<h3>❌ No result found</h3>
<p>
Try Hypertension, COPD, Diabetes, KMC, IMNCI,
Nursing Research, Sampling, Leadership etc.
</p>
</div>
`;
return;
}

document.getElementById("searchResults").innerHTML=
found.map(x=>`

<div class="card">

<span class="badge">${esc2(x.semester)}</span>

<h3>${esc2(x.topic)}</h3>

<p>${esc2(x.definition)}</p>

<div class="actions">

<button onclick='showNotes(${JSON.stringify(x.topic)})'>📖 Notes</button>

<button onclick='showViva(${JSON.stringify(x.topic)})'>🎤 Viva</button>

<button onclick='showMCQ(${JSON.stringify(x.topic)})'>🧠 MCQ</button>

<button onclick='showImportant(${JSON.stringify(x.topic)})'>🎯 Important</button>

</div>

</div>

`).join("");

}

/* =========================================================
   BOOKS
========================================================= */

function bookAction(type){

if(!currentStudent){
alert("Please login first.");
return;
}

const message=
type==="Give"
? "Book dena hai. Apni book ka naam aur contact details apne college/community group mein share karein."
: "Book chahiye. Apni required book ka naam aur semester community/group mein share karein.";

alert(message);

}

/* =========================================================
   LOGOUT
========================================================= */

async function logout(){

await fetch("/api/logout",{
method:"POST"
});

location.reload();

}

/* =========================================================
   AUTO LOGIN CHECK
========================================================= */

(async function(){

try{

const r=await fetch("/api/me");
const data=await r.json();

if(data.loggedIn){
currentStudent=data.student;
openApp();
}

}catch(e){

console.log("Session check failed");

}

})();

</script>

</body>
</html>`;

/* =========================================================
   SERVE WEBSITE
========================================================= */

app.get("/",(req,res)=>{
  res.setHeader("Content-Type","text/html; charset=utf-8");
  res.send(HTML);
});

app.get("/health",(req,res)=>{
  res.json({
    status:"ok",
    app:"NurseStudy"
  });
});

/* =========================================================
   404
========================================================= */

app.use((req,res)=>{
  res.status(404).send("NurseStudy: Page not found");
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT,"0.0.0.0",()=>{
  console.log("=================================");
  console.log("NurseStudy is running");
  console.log("PORT:",PORT);
  console.log("=================================");
});