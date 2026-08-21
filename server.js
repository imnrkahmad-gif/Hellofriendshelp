const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "nursestudy-change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

const db = new Database(
  process.env.DATABASE_PATH || path.join(__dirname, "nursestudy.db")
);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/* =========================
   DATABASE
========================= */

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  semester TEXT,
  university TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  semester TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  semester TEXT,
  subject TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(sender_id) REFERENCES users(id),
  FOREIGN KEY(receiver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS book_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  book_name TEXT NOT NULL,
  semester TEXT,
  details TEXT,
  status TEXT DEFAULT 'open',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS book_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  book_name TEXT NOT NULL,
  semester TEXT,
  details TEXT,
  status TEXT DEFAULT 'available',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS community_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);


/* =========================
   NURSING CONTENT
========================= */

const nursingContent = [

{
semester:"1st Semester",
subject:"Nursing Foundation",
topic:"Nursing Process",
content:`
NURSING PROCESS

Definition:
The nursing process is a systematic method used by nurses to provide individualised patient care.

Steps:
1. Assessment
2. Nursing Diagnosis
3. Planning
4. Implementation
5. Evaluation

Important points:
• Collect subjective and objective data.
• Identify patient problems.
• Set measurable goals.
• Provide appropriate nursing interventions.
• Evaluate patient response.

Exam pattern:
Definition → Steps → Explanation → Advantages → Nursing example.
`
},

{
semester:"1st Semester",
subject:"Nursing Foundation",
topic:"Vital Signs",
content:`
VITAL SIGNS

Main vital signs:
1. Temperature
2. Pulse
3. Respiration
4. Blood pressure
5. Oxygen saturation when indicated

Nursing responsibilities:
• Use correct equipment.
• Explain procedure.
• Record accurately.
• Compare with previous readings.
• Report significant abnormal findings.

For examinations, always mention normal ranges according to the textbook or institutional guideline being used.
`
},

{
semester:"2nd Semester",
subject:"Pharmacology",
topic:"Medication Safety",
content:`
MEDICATION SAFETY

Before giving medication:
• Correct patient
• Correct medicine
• Correct dose
• Correct route
• Correct time
• Check allergies
• Check relevant contraindications
• Document administration

Nursing responsibilities:
Assess the patient, monitor therapeutic response and adverse effects, educate the patient and follow institutional medication policies.
`
},

{
semester:"3rd Semester",
subject:"Adult Health Nursing",
topic:"Hypertension",
content:`
HYPERTENSION

Definition:
Hypertension is persistently elevated blood pressure. WHO commonly defines hypertension in adults as systolic BP ≥140 mmHg and/or diastolic BP ≥90 mmHg when measured on two different days.

Risk factors:
• High salt intake
• Obesity
• Physical inactivity
• Tobacco use
• Alcohol use
• Family history
• Increasing age
• Diabetes and kidney disease

Signs and symptoms:
Hypertension may have no symptoms. Some people may experience headache, dizziness, visual problems or other symptoms, but symptoms alone cannot diagnose hypertension.

Complications:
• Stroke
• Heart disease
• Kidney disease
• Retinopathy
• Peripheral vascular disease

Nursing management:
1. Measure BP correctly.
2. Monitor vital signs.
3. Assess medication adherence.
4. Encourage healthy diet.
5. Encourage appropriate physical activity.
6. Educate about reducing excess salt.
7. Encourage tobacco cessation.
8. Monitor for complications.
9. Teach importance of follow-up.
10. Administer prescribed medicines safely.

15-MARK ANSWER:
Definition → Risk factors → Classification → Clinical features → Investigations → Medical management → Nursing management → Complications → Health education.
`
},

{
semester:"3rd Semester",
subject:"Adult Health Nursing",
topic:"Myocardial Infarction",
content:`
MYOCARDIAL INFARCTION

Definition:
Myocardial infarction occurs when blood supply to part of the heart muscle is severely reduced or blocked, causing myocardial injury.

Risk factors:
• Smoking
• Hypertension
• Diabetes
• Dyslipidaemia
• Obesity
• Physical inactivity
• Family history

Clinical features:
• Chest discomfort
• Sweating
• Breathlessness
• Nausea
• Weakness
• Pain may radiate to arm, shoulder, neck or jaw

Nursing management:
• Rapid assessment
• Monitor vital signs
• ECG and investigations as prescribed
• Administer prescribed emergency treatment
• Monitor cardiac rhythm
• Provide reassurance
• Monitor complications
• Educate about risk-factor modification

Suspected acute coronary syndrome is an emergency and requires immediate medical assessment.
`
},

{
semester:"3rd Semester",
subject:"Adult Health Nursing",
topic:"COPD",
content:`
CHRONIC OBSTRUCTIVE PULMONARY DISEASE

COPD is a chronic respiratory condition associated with persistent airflow limitation.

Risk factors:
• Tobacco smoking
• Air pollution
• Occupational exposure
• Biomass fuel exposure
• Recurrent respiratory problems

Symptoms:
• Chronic cough
• Sputum production
• Breathlessness
• Wheezing
• Reduced exercise tolerance

Nursing management:
• Assess respiratory status.
• Monitor oxygenation as prescribed.
• Position for easier breathing.
• Administer prescribed medicines.
• Encourage smoking cessation.
• Teach breathing techniques.
• Monitor for exacerbation.
`
},

{
semester:"3rd Semester",
subject:"Child Health Nursing",
topic:"Protein Energy Malnutrition",
content:`
PROTEIN ENERGY MALNUTRITION

Definition:
Protein-energy malnutrition is inadequate intake or utilisation of energy and protein resulting in impaired growth and health.

Assessment:
• Weight
• Height/length
• MUAC where appropriate
• Growth chart
• Dietary history
• Clinical signs

Nursing management:
• Assess nutritional status.
• Provide appropriate feeding.
• Monitor weight.
• Prevent infection.
• Educate caregivers.
• Monitor treatment response.
• Refer severe cases according to protocol.
`
},

{
semester:"4th Semester",
subject:"Mental Health Nursing",
topic:"Mental Status Examination",
content:`
MENTAL STATUS EXAMINATION

Areas assessed:
1. Appearance
2. Behaviour
3. Attitude
4. Speech
5. Mood
6. Affect
7. Thought
8. Perception
9. Cognition
10. Insight
11. Judgement

Nursing role:
Maintain privacy, communicate therapeutically, observe objectively and document findings accurately.
`
},

{
semester:"4th Semester",
subject:"Mental Health Nursing",
topic:"Schizophrenia",
content:`
SCHIZOPHRENIA

Schizophrenia is a serious mental disorder that can affect thinking, perception, emotions and behaviour.

Possible features:
• Delusions
• Hallucinations
• Disorganised thinking
• Social withdrawal
• Reduced motivation
• Cognitive difficulties

Nursing management:
• Maintain safety.
• Establish therapeutic relationship.
• Communicate clearly.
• Reduce excessive stimulation.
• Administer prescribed medicines.
• Monitor adverse effects.
• Encourage self-care.
• Provide family education.
• Support follow-up.
`
},

{
semester:"5th Semester",
subject:"Adult Health Nursing",
topic:"Shock",
content:`
SHOCK

Shock is a life-threatening state of inadequate tissue perfusion.

Types:
• Hypovolemic
• Cardiogenic
• Distributive
• Obstructive

Assessment:
• Blood pressure
• Pulse
• Respiratory status
• Mental status
• Urine output
• Skin/perfusion
• Oxygenation

Nursing priorities:
Use ABC approach, call for emergency assistance, maintain airway and breathing, monitor circulation, administer prescribed treatment and continuously reassess the patient.
`
},

{
semester:"6th Semester",
subject:"Midwifery",
topic:"Antenatal Care",
content:`
ANTENATAL CARE

Antenatal care supports the health of the pregnant woman and fetus.

Important components:
• History and physical assessment
• Blood pressure monitoring
• Weight monitoring
• Screening tests
• Nutrition counselling
• Immunisation according to local recommendations
• Supplementation as prescribed
• Birth preparedness
• Danger-sign education
• Follow-up

The exact schedule and investigations should follow current national guidelines.
`
},

{
semester:"6th Semester",
subject:"Child Health Nursing",
topic:"APGAR Score",
content:`
APGAR SCORE

APGAR is a rapid newborn assessment usually recorded at 1 and 5 minutes after birth.

A = Appearance
P = Pulse
G = Grimace
A = Activity
R = Respiration

Each component is scored 0, 1 or 2.

The score helps assess the newborn's immediate condition and response to resuscitation. It should not be used alone to diagnose asphyxia or predict long-term outcome.
`
},

{
semester:"6th Semester",
subject:"Child Health Nursing",
topic:"Kangaroo Mother Care",
content:`
KANGAROO MOTHER CARE

KMC involves skin-to-skin contact between the mother/caregiver and newborn and is particularly useful for small or preterm babies.

Benefits:
• Supports thermal regulation
• Supports breastfeeding
• Promotes bonding
• May improve physiological stability

Nursing care:
• Teach correct positioning.
• Maintain airway.
• Monitor temperature and breathing.
• Support feeding.
• Encourage family participation.
`
},

{
semester:"7th Semester",
subject:"Nursing Research",
topic:"Research Process",
content:`
NURSING RESEARCH PROCESS

Main steps:
1. Identify research problem.
2. Review literature.
3. Develop objectives/questions.
4. Select research design.
5. Identify population and sample.
6. Develop data collection tool.
7. Collect data.
8. Analyse data.
9. Interpret findings.
10. Prepare report.

Important:
Research should follow ethical principles and institutional requirements.
`
},

{
semester:"7th Semester",
subject:"Nursing Management",
topic:"Leadership",
content:`
LEADERSHIP IN NURSING

Leadership is the process of influencing and guiding people toward a common goal.

Important areas:
• Communication
• Delegation
• Motivation
• Supervision
• Decision making
• Conflict management
• Teamwork
• Accountability

A good nurse leader promotes patient safety and effective teamwork.
`
}

];


/* =========================
   INSERT INITIAL CONTENT
========================= */

const insertNote = db.prepare(`
INSERT INTO notes
(semester,subject,topic,content)
SELECT ?,?,?,?
WHERE NOT EXISTS (
SELECT 1 FROM notes
WHERE semester=? AND topic=?
)
`);

const insertMany = db.transaction((items)=>{
  for(const n of items){
    insertNote.run(
      n.semester,
      n.subject,
      n.topic,
      n.content,
      n.semester,
      n.topic
    );
  }
});

insertMany(nursingContent);


/* =========================
   MIDDLEWARE
========================= */

function requireLogin(req,res,next){

  if(!req.session.user){
    return res.status(401).json({
      success:false,
      message:"Please login first."
    });
  }

  next();
}


/* =========================
   BASIC ROUTES
========================= */

app.get("/api/health",(req,res)=>{

  res.json({
    success:true,
    service:"NurseStudy Backend",
    status:"running",
    time:new Date().toISOString()
  });

});


app.get("/api/me",(req,res)=>{

  if(!req.session.user){

    return res.json({
      loggedIn:false
    });

  }

  res.json({
    loggedIn:true,
    user:req.session.user
  });

});


/* =========================
   REGISTER
========================= */

app.post("/api/register",async(req,res)=>{

  try{

    const {
      name,
      email,
      mobile,
      semester,
      university,
      password
    }=req.body;

    if(!name || !email || !password){

      return res.status(400).json({
        success:false,
        message:"Name, email and password are required."
      });

    }

    const existing=db
      .prepare("SELECT id FROM users WHERE email=?")
      .get(email.toLowerCase());

    if(existing){

      return res.status(409).json({
        success:false,
        message:"An account with this email already exists."
      });

    }

    const hash=await bcrypt.hash(password,12);

    const result=db.prepare(`
      INSERT INTO users
      (name,email,mobile,semester,university,password_hash)
      VALUES(?,?,?,?,?,?)
    `).run(
      name.trim(),
      email.toLowerCase().trim(),
      mobile || "",
      semester || "",
      university || "",
      hash
    );

    const user={
      id:result.lastInsertRowid,
      name:name.trim(),
      email:email.toLowerCase().trim(),
      mobile:mobile || "",
      semester:semester || "",
      university:university || "",
      role:"student"
    };

    req.session.user=user;

    res.json({
      success:true,
      user
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Registration failed."
    });

  }

});


/* =========================
   LOGIN
========================= */

app.post("/api/login",async(req,res)=>{

  try{

    const {
      email,
      password
    }=req.body;

    const user=db.prepare(`
      SELECT *
      FROM users
      WHERE email=?
    `).get(
      String(email || "").toLowerCase().trim()
    );

    if(!user){

      return res.status(401).json({
        success:false,
        message:"Invalid email or password."
      });

    }

    const valid=await bcrypt.compare(
      password || "",
      user.password_hash
    );

    if(!valid){

      return res.status(401).json({
        success:false,
        message:"Invalid email or password."
      });

    }

    const safeUser={
      id:user.id,
      name:user.name,
      email:user.email,
      mobile:user.mobile,
      semester:user.semester,
      university:user.university,
      role:user.role
    };

    req.session.user=safeUser;

    res.json({
      success:true,
      user:safeUser
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Login failed."
    });

  }

});


/* =========================
   LOGOUT
========================= */

app.post("/api/logout",(req,res)=>{

  req.session.destroy(()=>{

    res.json({
      success:true
    });

  });

});


/* =========================
   NOTES
========================= */

app.get("/api/notes",(req,res)=>{

  const {
    semester,
    subject,
    q
  }=req.query;

  let sql="SELECT * FROM notes WHERE 1=1";
  const params=[];

  if(semester){

    sql+=" AND semester=?";
    params.push(semester);

  }

  if(subject){

    sql+=" AND subject=?";
    params.push(subject);

  }

  if(q){

    sql+=`
      AND (
        topic LIKE ?
        OR content LIKE ?
        OR subject LIKE ?
      )
    `;

    const search="%"+q+"%";

    params.push(
      search,
      search,
      search
    );

  }

  sql+=" ORDER BY semester,subject,topic";

  const notes=db.prepare(sql).all(...params);

  res.json({
    success:true,
    count:notes.length,
    notes
  });

});


/* =========================
   SINGLE NOTE
========================= */

app.get("/api/notes/:id",(req,res)=>{

  const note=db
    .prepare("SELECT * FROM notes WHERE id=?")
    .get(req.params.id);

  if(!note){

    return res.status(404).json({
      success:false,
      message:"Note not found."
    });

  }

  res.json({
    success:true,
    note
  });

});


/* =========================
   QUESTION SOLVER
========================= */

app.post("/api/solve",async(req,res)=>{

  try{

    const {
      question,
      semester,
      language="simple English",
      marks="15"
    }=req.body;

    if(!question){

      return res.status(400).json({
        success:false,
        message:"Please enter a question."
      });

    }

    const cleanQuestion=String(question).trim();

    const exact=db.prepare(`
      SELECT *
      FROM questions
      WHERE question LIKE ?
      LIMIT 1
    `).get("%"+cleanQuestion+"%");

    if(exact){

      return res.json({
        success:true,
        source:"nursing-database",
        answer:exact.answer
      });

    }

    const related=db.prepare(`
      SELECT *
      FROM notes
      WHERE topic LIKE ?
      OR content LIKE ?
      ORDER BY id DESC
      LIMIT 5
    `).all(
      "%"+cleanQuestion+"%",
      "%"+cleanQuestion+"%"
    );

    let answer="";

    if(related.length){

      answer +=
`NURSING ANSWER

Question:
${cleanQuestion}

`;

      answer +=
related.map(n=>`

${n.topic.toUpperCase()}

${n.content}

`).join("\n");

    }else{

      answer=
`QUESTION:
${cleanQuestion}

EXAM ANSWER FORMAT

For a ${marks}-mark nursing question, write:

1. Definition
2. Introduction
3. Causes / Risk factors
4. Types / Classification
5. Pathophysiology
6. Signs and Symptoms
7. Investigations
8. Medical Management
9. Nursing Management
10. Complications
11. Health Education
12. Conclusion

Language requested:
${language}

Semester:
${semester || "Not specified"}

Important:
This answer framework is for study support. Always verify clinical information with current textbooks, institutional protocols and qualified faculty/clinicians.
`;

    }

    res.json({
      success:true,
      source:related.length
        ?"related-notes"
        :"structured-answer",
      answer
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Question solving failed."
    });

  }

});


/* =========================
   USERS SEARCH
========================= */

app.get(
"/api/students",
requireLogin,
(req,res)=>{

  const q=String(
    req.query.q || ""
  ).trim();

  const users=db.prepare(`
    SELECT id,name,semester,university
    FROM users
    WHERE
      name LIKE ?
      OR semester LIKE ?
      OR university LIKE ?
    ORDER BY name
    LIMIT 50
  `).all(
    "%"+q+"%",
    "%"+q+"%",
    "%"+q+"%"
  );

  res.json({
    success:true,
    users
  });

});


/* =========================
   SEND MESSAGE
========================= */

app.post(
"/api/messages",
requireLogin,
(req,res)=>{

  const {
    receiverId,
    message
  }=req.body;

  if(!receiverId || !message){

    return res.status(400).json({
      success:false,
      message:"Receiver and message are required."
    });

  }

  const receiver=db.prepare(`
    SELECT id FROM users WHERE id=?
  `).get(receiverId);

  if(!receiver){

    return res.status(404).json({
      success:false,
      message:"Student not found."
    });

  }

  db.prepare(`
    INSERT INTO messages
    (sender_id,receiver_id,message)
    VALUES(?,?,?)
  `).run(
    req.session.user.id,
    receiverId,
    String(message).trim()
  );

  res.json({
    success:true,
    message:"Message sent."
  });

});


/* =========================
   GET CHAT
========================= */

app.get(
"/api/messages/:userId",
requireLogin,
(req,res)=>{

  const current=req.session.user.id;
  const other=Number(req.params.userId);

  const messages=db.prepare(`
    SELECT
      m.id,
      m.sender_id,
      m.receiver_id,
      m.message,
      m.created_at,
      u.name AS sender_name
    FROM messages m
    JOIN users u ON u.id=m.sender_id
    WHERE
      (m.sender_id=? AND m.receiver_id=?)
      OR
      (m.sender_id=? AND m.receiver_id=?)
    ORDER BY m.id ASC
  `).all(
    current,
    other,
    other,
    current
  );

  res.json({
    success:true,
    messages
  });

});


/* =========================
   BOOK REQUEST
========================= */

app.post(
"/api/book-requests",
requireLogin,
(req,res)=>{

  const {
    bookName,
    semester,
    details
  }=req.body;

  if(!bookName){

    return res.status(400).json({
      success:false,
      message:"Book name is required."
    });

  }

  const result=db.prepare(`
    INSERT INTO book_requests
    (user_id,book_name,semester,details)
    VALUES(?,?,?,?)
  `).run(
    req.session.user.id,
    bookName,
    semester || "",
    details || ""
  );

  res.json({
    success:true,
    id:result.lastInsertRowid
  });

});


/* =========================
   BOOK OFFERS
========================= */

app.post(
"/api/book-offers",
requireLogin,
(req,res)=>{

  const {
    bookName,
    semester,
    details
  }=req.body;

  if(!bookName){

    return res.status(400).json({
      success:false,
      message:"Book name is required."
    });

  }

  const result=db.prepare(`
    INSERT INTO book_offers
    (user_id,book_name,semester,details)
    VALUES(?,?,?,?)
  `).run(
    req.session.user.id,
    bookName,
    semester || "",
    details || ""
  );

  res.json({
    success:true,
    id:result.lastInsertRowid
  });

});


/* =========================
   COMMUNITY
========================= */

app.get(
"/api/community",
(req,res)=>{

  const posts=db.prepare(`
    SELECT
      p.id,
      p.title,
      p.content,
      p.created_at,
      u.name,
      u.semester
    FROM community_posts p
    LEFT JOIN users u
      ON u.id=p.user_id
    ORDER BY p.id DESC
    LIMIT 100
  `).all();

  res.json({
    success:true,
    posts
  });

});


app.post(
"/api/community",
requireLogin,
(req,res)=>{

  const {
    title,
    content
  }=req.body;

  if(!title || !content){

    return res.status(400).json({
      success:false,
      message:"Title and content are required."
    });

  }

  const result=db.prepare(`
    INSERT INTO community_posts
    (user_id,title,content)
    VALUES(?,?,?)
  `).run(
    req.session.user.id,
    title.trim(),
    content.trim()
  );

  res.json({
    success:true,
    id:result.lastInsertRowid
  });

});


/* =========================
   ADMIN
========================= */

function requireAdmin(req,res,next){

  if(
    !req.session.user ||
    req.session.user.role!=="admin"
  ){

    return res.status(403).json({
      success:false,
      message:"Admin access required."
    });

  }

  next();

}


app.get(
"/api/admin/users",
requireAdmin,
(req,res)=>{

  const users=db.prepare(`
    SELECT
      id,
      name,
      email,
      mobile,
      semester,
      university,
      role,
      created_at
    FROM users
    ORDER BY id DESC
  `).all();

  res.json({
    success:true,
    users
  });

});


app.post(
"/api/admin/notes",
requireAdmin,
(req,res)=>{

  const {
    semester,
    subject,
    topic,
    content
  }=req.body;

  if(
    !semester ||
    !subject ||
    !topic ||
    !content
  ){

    return res.status(400).json({
      success:false,
      message:"All note fields are required."
    });

  }

  const result=db.prepare(`
    INSERT INTO notes
    (semester,subject,topic,content)
    VALUES(?,?,?,?)
  `).run(
    semester,
    subject,
    topic,
    content
  );

  res.json({
    success:true,
    id:result.lastInsertRowid
  });

});


/* =========================
   DONATION INFORMATION
========================= */

app.get(
"/api/donation",
(req,res)=>{

  res.json({

    success:true,

    upi:"7763082034@kotak",

    name:"NurseStudy",

    message:
      "Support nursing students with books and educational resources."

  });

});


/* =========================
   FRONTEND
========================= */

app.use(
express.static(__dirname)
);

app.get(
"*",
(req,res)=>{

  res.sendFile(
    path.join(__dirname,"index.html")
  );

});


/* =========================
   START SERVER
========================= */

app.listen(
PORT,
"0.0.0.0",
()=>{

  console.log(
    `NurseStudy server running on port ${PORT}`
  );

});