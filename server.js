const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const UPI_ID = "7763082034@kotak";

const semesters = {
  "1st Semester": [
    ["Nursing Process","Assessment, nursing diagnosis, planning, implementation and evaluation."],
    ["Vital Signs","Temperature, pulse, respiration, blood pressure and oxygen saturation."],
    ["Hand Hygiene","Correct hand hygiene technique and infection prevention."],
    ["Bed Making","Safe, clean and comfortable bed preparation."],
    ["Therapeutic Communication","Communication, empathy, active listening and patient support."],
    ["Nutrition Basics","Basic nutrition, hydration and nutritional assessment."],
    ["Patient Safety","Patient identification, fall prevention and safe environment."],
    ["Documentation","Accurate, timely and confidential nursing documentation."]
  ],
  "2nd Semester": [
    ["Microbiology","Microorganisms, infection, transmission and prevention."],
    ["Pharmacology","Drugs, indications, adverse effects and nursing responsibilities."],
    ["Medication Safety","Right patient, medicine, dose, route, time and documentation."],
    ["Pain Assessment","Location, severity, quality, timing and effect of pain."],
    ["Infection Control","Standard precautions, PPE and prevention of healthcare infections."],
    ["First Aid","Immediate care for common emergencies and injuries."]
  ],
  "3rd Semester": [
    ["Medical Surgical Nursing","Assessment, treatment and nursing management of common disorders."],
    ["Hypertension","High blood pressure, symptoms, complications and nursing management."],
    ["Diabetes Mellitus","Blood glucose disorder, symptoms, complications and nursing care."],
    ["COPD","Chronic respiratory disease, symptoms and nursing management."],
    ["Pneumonia","Infection of lung tissue, symptoms and nursing management."],
    ["Myocardial Infarction","Acute myocardial injury, emergency care and nursing management."]
  ],
  "4th Semester": [
    ["Child Health Nursing","Growth, development and care of children."],
    ["Pneumonia in Children","Assessment, treatment and nursing care."],
    ["Acute Bronchitis","Causes, symptoms, treatment and nursing management."],
    ["Kangaroo Mother Care","Skin-to-skin care and benefits for newborns."],
    ["IMNCI","Integrated management of common childhood illnesses."],
    ["Spina Bifida","Congenital neural tube defect and nursing care."]
  ],
  "5th Semester": [
    ["Community Health Nursing","Community assessment, prevention and health promotion."],
    ["Communicable Diseases","Transmission, prevention and control of infectious diseases."],
    ["Non Communicable Diseases","Prevention and management of chronic diseases."],
    ["Mental Health Nursing","Mental health assessment and psychiatric nursing care."],
    ["Psychiatric Viva","Important psychiatric nursing viva questions."],
    ["Nursing Management","Planning, organising, staffing, directing and evaluation."]
  ],
  "6th Semester": [
    ["Nursing Research","Research process, sampling, variables and data collection."],
    ["Research Methodology","Research design, validity, reliability and analysis."],
    ["Nursing Education","Teaching-learning process and evaluation."],
    ["Leadership","Leadership styles, communication and delegation."],
    ["Quality Patient Safety","Safe communication, medication safety and infection prevention."],
    ["Professional Ethics","Privacy, confidentiality, consent, dignity and professional conduct."]
  ],
  "7th Semester": [
    ["Advanced Nursing Practice","Advanced assessment and evidence-based nursing care."],
    ["Nursing Administration","Management, planning, staffing and supervision."],
    ["Case Presentation","Patient profile, history, assessment, diagnosis and nursing care."],
    ["Clinical Practice","Clinical assessment, procedures and safe patient care."],
    ["Exam Revision","Important long questions, short questions, viva and MCQs."],
    ["Final Viva","High-yield nursing viva preparation."]
  ]
};

const topics = [
  "Hypertension",
  "COPD",
  "Pneumonia",
  "Diabetes Mellitus",
  "Myocardial Infarction",
  "Kangaroo Mother Care",
  "IMNCI",
  "Spina Bifida",
  "Mental Health",
  "Schizophrenia",
  "Depression",
  "Anxiety",
  "Nursing Research",
  "Nursing Management",
  "Community Health Nursing",
  "Communicable Diseases",
  "Non Communicable Diseases"
];

function esc(value) {
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function page() {
return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0f766e">
<title>NurseStudy - Nursing Education Platform</title>

<style>
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
 margin:0;
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
 background:#f4f9fa;
 color:#243b53;
}
header{
 position:sticky;
 top:0;
 z-index:50;
 background:#fff;
 border-bottom:1px solid #d9e2ec;
}
.container{
 width:min(1100px,92%);
 margin:auto;
}
.nav{
 min-height:68px;
 display:flex;
 align-items:center;
 justify-content:space-between;
}
.logo{
 font-size:22px;
 font-weight:900;
 color:#102a43;
}
.hero{
 padding:55px 0;
 background:linear-gradient(180deg,#e8fbf8,#f4f9fa);
}
.badge{
 display:inline-block;
 background:#ddf6f2;
 color:#08645e;
 padding:8px 12px;
 border-radius:50px;
 font-weight:800;
}
h1{
 font-size:clamp(38px,7vw,65px);
 line-height:1;
 color:#102a43;
 margin:18px 0;
}
.hero p{
 font-size:18px;
 line-height:1.7;
 color:#627d98;
}
.search{
 display:flex;
 gap:8px;
 background:white;
 padding:8px;
 border:1px solid #d9e2ec;
 border-radius:15px;
 box-shadow:0 10px 30px rgba(16,42,67,.08);
}
.search input{
 flex:1;
 border:0;
 outline:0;
 padding:13px;
 min-width:0;
}
.btn{
 border:0;
 border-radius:11px;
 padding:12px 17px;
 background:#0f766e;
 color:white;
 font-weight:800;
 cursor:pointer;
}
.btn.secondary{
 background:#e8f8f5;
 color:#08645e;
}
section{padding:45px 0}
h2{color:#102a43}
.tabs{
 display:flex;
 gap:8px;
 flex-wrap:wrap;
 margin:20px 0;
}
.tab{
 border:1px solid #d9e2ec;
 background:white;
 padding:10px 14px;
 border-radius:10px;
 font-weight:800;
 color:#2476e8;
 cursor:pointer;
}
.tab.active{
 background:#0f766e;
 color:white;
}
.card,.topic,.form{
 background:white;
 border:1px solid #d9e2ec;
 border-radius:18px;
 padding:18px;
 margin-bottom:14px;
 box-shadow:0 8px 25px rgba(16,42,67,.05);
}
.topic h3{color:#102a43}
.actions{
 display:flex;
 flex-wrap:wrap;
 gap:8px;
 margin-top:12px;
}
.actions button{
 border:0;
 padding:9px 12px;
 border-radius:9px;
 cursor:pointer;
 background:#e8f8f5;
 color:#08645e;
 font-weight:800;
}
input,textarea,select{
 width:100%;
 padding:12px;
 margin:6px 0;
 border:1px solid #d9e2ec;
 border-radius:10px;
 outline:none;
}
textarea{min-height:100px}
.grid{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
 gap:16px;
}
.result{
 background:white;
 border:1px solid #d9e2ec;
 padding:14px;
 border-radius:12px;
 margin-top:8px;
}
.notice{
 background:#fff8e8;
 border:1px solid #f1d49a;
 border-radius:12px;
 padding:14px;
 margin-top:12px;
}
.hidden{display:none}
.upi{
 background:#effcf9;
 border:1px solid #bfe8df;
 border-radius:15px;
 padding:18px;
 margin:12px 0;
}
.upi strong{
 display:block;
 font-size:20px;
 color:#08645e;
 margin:7px 0 12px;
 word-break:break-all;
}
footer{
 background:#102a43;
 color:#c7d5e2;
 padding:35px 0;
}
footer h2{color:white}
@media(max-width:600px){
 .search{flex-direction:column}
 .search .btn{width:100%}
 .actions button{width:100%}
}
</style>
</head>

<body>

<header>
<div class="container nav">
<div class="logo">🩺 NurseStudy</div>
</div>
</header>

<section class="hero">
<div class="container">

<span class="badge">🎓 B.Sc. Nursing • Semester 1–7</span>

<h1>Learn Nursing.<br>
<span style="color:#0f766e">Help Each Other.</span>
</h1>

<p>
Notes, detailed answers, viva questions, MCQs,
important topics and student help — all in one place.
</p>

<div class="search">
<input id="search" placeholder="Search Hypertension, COPD, Pneumonia...">
<button class="btn" onclick="searchSite()">Search</button>
</div>

<div id="results"></div>

</div>
</section>

<section>
<div class="container">

<h2>📚 Nursing Study Centre</h2>
<p>Choose your semester and open the resource you need.</p>

<div id="tabs" class="tabs"></div>

<div id="content"></div>

</div>
</section>

<section>
<div class="container">

<h2>📖 Quick Revision</h2>

<div class="grid">

${topics.map(t=>`
<div class="card">
<h3>${esc(t)}</h3>
<p>Important nursing topic for exam and viva preparation.</p>
<div class="actions">
<button onclick="showNote('${esc(t)}')">📖 Notes</button>
<button onclick="showViva('${esc(t)}')">🎤 Viva</button>
<button onclick="showMCQ('${esc(t)}')">🧠 MCQ</button>
</div>
</div>
`).join("")}

</div>
</div>
</section>

<section>
<div class="container">

<h2>📚 Book Help</h2>

<div class="grid">

<div class="form">
<h3>Book Request</h3>
<input id="bookName" placeholder="Your name">
<input id="bookTitle" placeholder="Book / subject name">
<input id="bookContact" placeholder="Contact">
<select id="bookSemester">
<option>1st Semester</option>
<option>2nd Semester</option>
<option>3rd Semester</option>
<option>4th Semester</option>
<option>5th Semester</option>
<option>6th Semester</option>
<option>7th Semester</option>
</select>
<textarea id="bookMessage" placeholder="What book/help do you need?"></textarea>
<button class="btn" onclick="submitBook()">Request Book Help</button>
<div id="bookMsg"></div>
</div>

<div class="form">
<h3>📤 Offer a Book</h3>
<input placeholder="Your name" id="offerName">
<input placeholder="Book title" id="offerTitle">
<input placeholder="Contact" id="offerContact">
<textarea placeholder="Details" id="offerDetails"></textarea>
<button class="btn" onclick="submitOffer()">Offer Book</button>
<div id="offerMsg"></div>
</div>

</div>
</div>
</section>

<section>
<div class="container">

<h2>💰 Support NurseStudy</h2>

<div class="card">

<p>
If you want to support NurseStudy and help students,
you can donate through UPI.
</p>

<div class="upi">
<div>UPI ID</div>
<strong>${UPI_ID}</strong>

<button class="btn" onclick="copyUPI()">
📋 Copy UPI ID
</button>

<button class="btn secondary" onclick="payUPI()">
📱 Pay with UPI App
</button>

<div id="donationMsg" class="notice hidden"></div>
</div>

<p>
Please verify the UPI ID before making any payment.
</p>

</div>
</div>
</section>

<section>
<div class="container">

<h2>💬 Student Community</h2>

<div class="grid">

<div class="form">
<h3>Post a Message</h3>

<input id="postName" placeholder="Your name">

<select id="postSemester">
<option>1st Semester</option>
<option>2nd Semester</option>
<option>3rd Semester</option>
<option>4th Semester</option>
<option>5th Semester</option>
<option>6th Semester</option>
<option>7th Semester</option>
</select>

<textarea id="postText" placeholder="Write your study-related question..."></textarea>

<button class="btn" onclick="postCommunity()">
Post to Community
</button>

</div>

<div class="form">
<h3>Community Posts</h3>
<div id="posts"></div>
</div>

</div>
</div>
</section>

<footer>
<div class="container">
<h2>🩺 NurseStudy</h2>
<p>
A nursing education and student-help platform.
</p>
<p>
© 2026 NurseStudy
</p>
</div>
</footer>

<script>

const DATA = ${JSON.stringify(semesters)};

let currentSemester = "1st Semester";

function renderTabs(){

 const tabs=document.getElementById("tabs");

 tabs.innerHTML=Object.keys(DATA).map(s=>`

 <button class="tab ${s===currentSemester?"active":""}"
 onclick="selectSemester('${s}')">
 ${s}
 </button>

 `).join("");

 renderContent();
}

function selectSemester(s){

 currentSemester=s;

 renderTabs();

 window.scrollTo({
  top:document.getElementById("content").offsetTop-80,
  behavior:"smooth"
 });

}

function renderContent(){

 const data=DATA[currentSemester];

 document.getElementById("content").innerHTML=`

 <div class="card">

 <span class="badge">${currentSemester}</span>

 <h2>📚 ${currentSemester} Nursing Study</h2>

 <p>
 Select any topic below for notes, viva and MCQ revision.
 </p>

 </div>

 ${data.map((x,i)=>`

 <div class="topic">

 <h3>${i+1}. ${esc(x[0])}</h3>

 <p>${esc(x[1])}</p>

 <div class="actions">

 <button onclick="showNote('${esc(x[0])}')">
 📖 Read Notes
 </button>

 <button onclick="showViva('${esc(x[0])}')">
 🎤 Viva
 </button>

 <button onclick="showMCQ('${esc(x[0])}')">
 🧠 MCQ
 </button>

 </div>

 </div>

 `).join("")}`;

}

function showNote(topic){

 alert(
 "📖 "+topic+"\\n\\n"+
 "Definition → Causes/Risk Factors → Signs & Symptoms → "+
 "Investigations → Treatment → Nursing Management → "+
 "Complications → Health Education."
 );

}

function showViva(topic){

 alert(
 "🎤 Viva: "+topic+"\\n\\n"+
 "1. What is "+topic+"?\\n"+
 "2. What are its causes/risk factors?\\n"+
 "3. What are the signs and symptoms?\\n"+
 "4. How is it diagnosed?\\n"+
 "5. What is the treatment?\\n"+
 "6. What are the nursing responsibilities?"
 );

}

function showMCQ(topic){

 alert(
 "🧠 MCQ: "+topic+"\\n\\n"+
 "For exam revision, focus on definition, causes, "+
 "signs/symptoms, diagnosis, treatment and nursing management."
 );

}

function searchSite(){

 const q=document
 .getElementById("search")
 .value
 .trim()
 .toLowerCase();

 const box=document.getElementById("results");

 if(!q){

  box.innerHTML="";
  return;

 }

 let found=[];

 for(const [sem,data] of Object.entries(DATA)){

  for(const x of data){

   if((x[0]+" "+x[1])
   .toLowerCase()
   .includes(q)){

    found.push({
     semester:sem,
     topic:x[0],
     text:x[1]
    });

   }

  }

 }

 if(!found.length){

  box.innerHTML=`
  <div class="result">
  No matching topic found.
  </div>`;
  return;

 }

 box.innerHTML=found
 .slice(0,20)
 .map(x=>`

 <div class="result">

 <b>${esc(x.topic)}</b>

 <small> • ${esc(x.semester)}</small>

 <p>${esc(x.text)}</p>

 <button class="btn"
 onclick="showNote('${esc(x.topic)}')">
 Read Notes
 </button>

 </div>

 `).join("");

}

function copyUPI(){

 const upi="${UPI_ID}";

 if(navigator.clipboard){

  navigator.clipboard.writeText(upi).then(()=>{

   const m=document.getElementById("donationMsg");

   m.classList.remove("hidden");

   m.innerHTML=
   "✅ UPI ID copied successfully:<br><b>"+upi+"</b>";

  });

 }else{

  prompt("Copy this UPI ID:",upi);

 }

}

function payUPI(){

 const url=
 "upi://pay?pa=${UPI_ID}&pn=NurseStudy&cu=INR";

 window.location.href=url;

}

function submitBook(){

 const name=document.getElementById("bookName").value;

 const title=document.getElementById("bookTitle").value;

 if(!name || !title){

  alert("Please enter your name and book name.");

  return;

 }

 document.getElementById("bookMsg").innerHTML=
 '<div class="notice">✅ Book request saved on this device.</div>';

}

function submitOffer(){

 const title=document.getElementById("offerTitle").value;

 if(!title){

  alert("Please enter the book title.");

  return;

 }

 document.getElementById("offerMsg").innerHTML=
 '<div class="notice">✅ Thank you for offering the book.</div>';

}

function postCommunity(){

 const name=document.getElementById("postName").value;

 const semester=document.getElementById("postSemester").value;

 const text=document.getElementById("postText").value;

 if(!name || !text){

  alert("Please enter your name and message.");

  return;

 }

 const posts=
 JSON.parse(
 localStorage.getItem("nurseStudyPosts")||"[]"
 );

 posts.unshift({
  name,
  semester,
  text,
  time:new Date().toLocaleString()
 });

 localStorage.setItem(
 "nurseStudyPosts",
 JSON.stringify(posts)
 );

 document.getElementById("postText").value="";

 renderPosts();

}

function renderPosts(){

 const posts=
 JSON.parse(
 localStorage.getItem("nurseStudyPosts")||"[]"
 );

 const box=document.getElementById("posts");

 if(!posts.length){

  box.innerHTML=
  "<p>No community posts yet.</p>";

  return;

 }

 box.innerHTML=posts
 .slice(0,20)
 .map(p=>`

 <div class="result">

 <b>${esc(p.name)}</b>

 <small> • ${esc(p.semester)}</small>

 <p>${esc(p.text)}</p>

 <small>${esc(p.time)}</small>

 </div>

 `).join("");

}

renderTabs();
renderPosts();

</script>

</body>
</html>`;
}

// Health API
app.get("/api/health",(req,res)=>{
 res.json({
  success:true,
  service:"NurseStudy",
  status:"running"
 });
});

// Donation API
app.get("/api/donation",(req,res)=>{
 res.json({
  success:true,
  upiId:UPI_ID,
  name:"NurseStudy",
  currency:"INR"
 });
});

// Website
app.get("*",(req,res)=>{
 res.send(page());
});

// Start
app.listen(PORT,"0.0.0.0",()=>{
 console.log(
  "NurseStudy running on port "+PORT
 );
});