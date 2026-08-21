const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

const DATA_FILE = path.join(os.tmpdir(), "nursestudy_students.json");

function readStudents() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }
  } catch (e) {}
  return [];
}

function saveStudent(student) {
  const students = readStudents();
  students.push({
    ...student,
    id: Date.now(),
    createdAt: new Date().toISOString()
  });

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
  } catch (e) {}

  return true;
}

const CONTENT = {

"1st Semester": [
["Fundamentals of Nursing",
"Fundamentals of Nursing is the foundation of nursing practice.",
"Simple: Nursing ki basic knowledge aur patient care ke rules ko Fundamentals of Nursing kehte hain.",
["What is nursing?","Nursing means caring for individuals, families and communities to promote health, prevent illness and provide care."],
["What is nursing process?","Assessment → Nursing Diagnosis → Planning → Implementation → Evaluation"],
["What are vital signs?","Temperature, pulse, respiration, blood pressure and oxygen saturation."],
["Why is hand washing important?","It prevents the spread of infection."],
["What is asepsis?","Asepsis means absence or prevention of harmful microorganisms."]
],

["Nursing Process",
"The nursing process is a systematic method of providing individualized nursing care.",
"Simple: Patient ki problem ko identify karke planned care dene ka systematic method nursing process hai.",
["Name the five steps.","Assessment, Diagnosis, Planning, Implementation and Evaluation."],
["What is assessment?","Collection of information about the patient's health condition."],
["What is evaluation?","Checking whether the planned nursing goals were achieved."]
],

["Vital Signs",
"Vital signs are measurements of important body functions.",
"Simple: Body ke important functions ko measure karna vital signs kehlata hai.",
["Normal adult temperature?","Approximately 36.5–37.5°C."],
["Normal adult pulse?","Usually 60–100 beats/minute."],
["Normal adult respiratory rate?","Usually 12–20 breaths/minute."],
["Normal adult blood pressure?","Around 120/80 mmHg is commonly considered normal."],
["Normal SpO2?","Usually 95–100% in a healthy adult at sea level."]
],

["Communication",
"Therapeutic communication is purposeful communication used to help a patient.",
"Simple: Patient ko samajhne aur help karne ke liye respectful communication therapeutic communication hai.",
["What is empathy?","Understanding another person's feelings and perspective."],
["What is active listening?","Listening carefully and responding appropriately."]
],

["First Aid",
"First aid is immediate basic care given to an injured or suddenly ill person.",
"Simple: Emergency me doctor/hospital care se pehle di gayi immediate basic help first aid hai.",
["First priority in an emergency?","Ensure scene safety and assess the person's condition."],
["What is CPR?","Cardiopulmonary resuscitation used when a person is unresponsive and not breathing normally."]
]
],

"2nd Semester": [
["Microbiology",
"Microbiology is the study of microorganisms.",
"Simple: Bacteria, virus, fungus aur other microorganisms ka study microbiology hai.",
["Name common microorganisms.","Bacteria, viruses, fungi and parasites."],
["What is infection?","Entry and multiplication of microorganisms in a host, which may cause disease."],
["How can infection spread be prevented?","Hand hygiene, PPE, aseptic technique, cleaning, disinfection and sterilization."]
],

["Pharmacology",
"Pharmacology is the study of drugs and their effects.",
"Simple: Medicines/drugs aur unke body par effects ka study pharmacology hai.",
["What is a drug?","A substance used to diagnose, prevent, treat or modify disease."],
["What is side effect?","An unintended effect that may occur at normal therapeutic doses."]
],

["Medication Safety",
"Medication safety means giving medicines correctly and safely.",
"Simple: Patient ko correct medicine correct dose aur correct time par dena medication safety hai.",
["Five rights of medication?","Right patient, right drug, right dose, right route and right time."],
["Why check allergy?","To prevent potentially serious allergic reactions."]
],

["Nutrition",
"Nutrition is the process by which the body obtains and uses nutrients.",
"Simple: Body ko energy aur growth ke liye nutrients milna nutrition hai.",
["Main nutrients?","Carbohydrates, proteins, fats, vitamins, minerals and water."],
["Main function of protein?","Growth, tissue repair and maintenance."]
],

["Infection Control",
"Infection control includes measures used to prevent the spread of infection.",
"Simple: Infection ko ek patient se dusre tak spread hone se rokna infection control hai.",
["Most important infection-control measure?","Hand hygiene."],
["What is sterilization?","A process that destroys all forms of microbial life, including spores."]
]
],

"3rd Semester": [
["Hypertension",
"Hypertension is persistently elevated blood pressure.",
"Simple: Jab blood pressure repeatedly normal se high rahe to hypertension kehte hain.",
["What is systolic BP?","Pressure in arteries when the heart contracts."],
["What is diastolic BP?","Pressure in arteries when the heart relaxes."],
["Common risk factors?","High salt intake, obesity, inactivity, smoking, age, family history, diabetes and kidney disease."],
["Symptoms?","It may have no symptoms; severe hypertension can cause headache, visual problems, chest symptoms or breathlessness."],
["Nursing management?","Monitor BP, give prescribed medicines, encourage healthy diet, exercise, smoking cessation and follow-up."]
],

["Myocardial Infarction",
"Myocardial infarction occurs when blood supply to part of the heart muscle is severely reduced or blocked.",
"Simple: Heart muscle ke kisi part ko blood/oxygen supply rukne se heart attack hota hai.",
["Important symptom?","Chest pressure/discomfort, sweating, breathlessness, nausea or pain radiating to arm/jaw may occur."],
["Nursing priority?","Rapid assessment, monitoring, oxygen when indicated, prescribed treatment and urgent medical management."]
],

["COPD",
"Chronic obstructive pulmonary disease is a chronic respiratory condition with persistent airflow limitation.",
"Simple: COPD me lungs ki airflow permanently/long-term limited ho jati hai.",
["Major risk factor?","Smoking is a major risk factor."],
["Symptoms?","Chronic cough, sputum and breathlessness."],
["Nursing care?","Monitor breathing, administer prescribed medicines, encourage smoking cessation and breathing exercises."]
],

["Diabetes Mellitus",
"Diabetes mellitus is a chronic disorder characterized by elevated blood glucose.",
"Simple: Blood me sugar level continuously high rehna diabetes hai.",
["Common symptoms?","Polyuria, polydipsia, polyphagia, fatigue and weight changes."],
["Nursing management?","Blood glucose monitoring, medicines, diet, exercise, foot care and complication prevention."]
],

["Shock",
"Shock is a life-threatening condition in which tissue perfusion is inadequate.",
"Simple: Body ke tissues ko enough blood aur oxygen na milne ki dangerous condition shock hai.",
["Common signs?","Low BP, fast pulse, altered consciousness, cold skin and reduced urine output."],
["Nursing priority?","ABC assessment, oxygen/support as indicated, IV access/fluids or other treatment as prescribed and urgent medical care."]
],

["Peptic Ulcer",
"Peptic ulcer is a break in the lining of the stomach or duodenum.",
"Simple: Stomach ya duodenum ki lining me ulcer/ghaav ko peptic ulcer kehte hain.",
["Important causes?","H. pylori infection and NSAID use are major causes."],
["Complications?","Bleeding, perforation and obstruction."]
],

["Asthma",
"Asthma is a chronic inflammatory airway disease with variable airflow obstruction.",
"Simple: Airways narrow hone ki wajah se wheezing aur breathing difficulty hoti hai.",
["Common symptoms?","Wheezing, cough, chest tightness and breathlessness."],
["Nursing care?","Monitor breathing, administer prescribed inhaled medicines and identify triggers."]
],

["Pneumonia",
"Pneumonia is an infection of lung tissue.",
"Simple: Lungs ke tissue me infection ko pneumonia kehte hain.",
["Symptoms?","Fever, cough, sputum, chest discomfort and breathlessness."],
["Nursing care?","Monitor oxygenation, breathing, temperature, hydration and prescribed treatment."]
]
],

"4th Semester": [
["Surgical Nursing",
"Surgical nursing provides care before, during and after surgery.",
"Simple: Operation ke before, during aur after patient ki nursing care surgical nursing hai.",
["Phases?","Preoperative, intraoperative and postoperative."],
["Important postoperative observations?","Airway, breathing, circulation, pain, wound, urine output and complications."]
],

["Preoperative Care",
"Preoperative care prepares a patient physically and psychologically for surgery.",
"Simple: Operation se pehle patient ko physically aur mentally prepare karna.",
["Important checks?","Patient identity, consent, investigations, allergies, fasting status and preparation."],
["Why is consent important?","It confirms informed agreement for the procedure."]
],

["Postoperative Care",
"Postoperative care is nursing care provided after surgery.",
"Simple: Operation ke baad patient ki recovery ke liye di gayi care.",
["Priority?","Airway, breathing and circulation."],
["What should be monitored?","Vital signs, pain, wound, drainage, urine output and complications."]
],

["Wound Care",
"Wound care aims to promote healing and prevent infection.",
"Simple: Wound ko clean rakhna aur healing promote karna wound care hai.",
["Important principle?","Use appropriate aseptic technique."],
["Signs of infection?","Increasing redness, warmth, swelling, pain, pus or fever."]
],

["Blood Transfusion",
"Blood transfusion is administration of blood or blood components.",
"Simple: Patient ko blood ya blood component dena blood transfusion hai.",
["Important safety step?","Correctly identify the patient and blood product."],
["Signs of transfusion reaction?","Fever, chills, rash, breathlessness, back/chest pain or hypotension may occur."]
],

["Fracture",
"A fracture is a break in the continuity of a bone.",
"Simple: Bone ka tootna fracture kehlata hai.",
["Symptoms?","Pain, swelling, deformity and limited movement."],
["First aid principle?","Immobilize the injured part and avoid unnecessary movement."]
],

["Burns",
"A burn is tissue injury caused by heat, chemicals, electricity, radiation or friction.",
"Simple: Heat, chemical, electricity etc. se tissue damage burn hai.",
["Priority in major burn?","Assess airway, breathing and circulation."],
["Complications?","Fluid loss, infection, hypothermia and scarring."]
],

["Cancer",
"Cancer is uncontrolled abnormal cell growth that may invade or spread.",
"Simple: Body cells ka uncontrolled abnormal growth cancer hai.",
["Treatment types?","Surgery, chemotherapy, radiotherapy, targeted/immunotherapy depending on cancer."],
["Nursing care?","Pain control, nutrition, infection prevention, treatment support and psychological care."]
]
],

"5th Semester": [
["Community Health Nursing",
"Community health nursing combines nursing and public health principles.",
"Simple: Community ke health ko improve karne ke liye nursing aur public health ka use.",
["Main aim?","Health promotion, disease prevention and community wellbeing."],
["Important activities?","Assessment, health education, prevention, referral and follow-up."]
],

["Primary Health Care",
"Primary health care is essential healthcare that is accessible to individuals and communities.",
"Simple: Sabko easily available basic healthcare dena primary health care hai.",
["Important principles?","Accessibility, community participation, intersectoral coordination and appropriate technology."],
["Examples?","Health education, immunization, maternal-child care and basic treatment."]
],

["Health Education",
"Health education helps people gain knowledge and skills to improve health.",
"Simple: Health ke baare me knowledge aur healthy behaviour develop karna health education hai.",
["Steps?","Assessment, planning, implementation and evaluation."],
["Methods?","Individual, group and mass methods."]
],

["Epidemiology",
"Epidemiology studies the distribution and determinants of health-related events in populations.",
"Simple: Population me disease kahan, kab aur kin logon me ho rahi hai iska study epidemiology hai.",
["What is incidence?","Number of new cases occurring in a population during a specified period."],
["What is prevalence?","Total existing cases in a population at a given time/period."]
],

["Family Health Nursing",
"Family health nursing provides care according to family health needs.",
"Simple: Puri family ki health needs assess karke care dena.",
["Important activities?","Family assessment, health education, prevention, referral and follow-up."]
],

["School Health Nursing",
"School health nursing promotes and protects the health of school children.",
"Simple: School children ki health protect aur improve karna.",
["Activities?","Screening, health education, first aid, referral and health promotion."]
],

["Occupational Health",
"Occupational health protects workers from work-related hazards.",
"Simple: Job ki wajah se hone wale health hazards se workers ko protect karna.",
["Examples of hazards?","Physical, chemical, biological, ergonomic and psychological hazards."]
]
],

"6th Semester": [
["Protein Energy Malnutrition",
"Protein energy malnutrition occurs due to inadequate energy and protein intake.",
"Simple: Body ko enough calories aur protein na milne se PEM hota hai.",
["Types?","Marasmus and kwashiorkor are classic forms."],
["Signs?","Poor growth, wasting, weakness, edema in some cases and increased infection risk."],
["Nursing management?","Assess nutrition, provide appropriate feeding, prevent infection and monitor growth."]
],

["Acute Respiratory Infection",
"Acute respiratory infection is an infection of the respiratory tract with relatively sudden onset.",
"Simple: Respiratory tract ka suddenly hone wala infection ARI hai.",
["Danger signs?","Difficulty breathing, inability to drink, cyanosis or altered consciousness require urgent assessment."],
["Nursing care?","Monitor breathing, temperature, hydration and oxygenation; provide prescribed treatment."]
],

["Diarrhea and Dehydration",
"Diarrhea is frequent passage of loose or watery stools and may cause dehydration.",
"Simple: Baar-baar loose motion hone se body ka water aur electrolytes kam ho sakte hain.",
["Main treatment principle?","Prevent/treat dehydration with appropriate oral or IV fluids as clinically indicated."],
["Signs of dehydration?","Thirst, dry mouth, reduced urine, lethargy and sunken eyes may occur."]
],

["Neonatal Jaundice",
"Neonatal jaundice is yellow discoloration caused by increased bilirubin.",
"Simple: Newborn ke body/eyes yellow hone ko jaundice kehte hain.",
["What should be assessed?","Age at onset, feeding, activity and bilirubin level when indicated."],
["Treatment?","Depends on cause and bilirubin level; phototherapy may be used when indicated."]
],

["Low Birth Weight Baby",
"A low birth weight baby weighs less than 2500 g at birth.",
"Simple: Birth ke time baby ka weight 2500 gram se kam ho to LBW.",
["Important care?","Warmth, feeding, infection prevention and monitoring."],
["Main danger?","Hypothermia, hypoglycemia, infection and feeding problems."]
],

["Prematurity",
"A preterm baby is born before 37 completed weeks of gestation.",
"Simple: 37 weeks se pehle born baby preterm hota hai.",
["Important care?","Warmth, breathing support when required, feeding and infection prevention."]
],

["Kangaroo Mother Care",
"Kangaroo Mother Care uses prolonged skin-to-skin contact for small or preterm babies.",
"Simple: Maa aur baby ka skin-to-skin contact KMC hai.",
["Benefits?","Warmth, breastfeeding, bonding and physiological stability."],
["Who can provide it?","Mother or another suitable caregiver when appropriate."]
],

["Congenital Heart Disease",
"Congenital heart disease refers to structural heart abnormalities present from birth.",
"Simple: Birth se heart me structural problem hona congenital heart disease hai.",
["Examples?","ASD, VSD, PDA and Tetralogy of Fallot."],
["Possible signs?","Cyanosis, poor feeding, breathlessness, poor growth or recurrent respiratory infections."]
],

["Tetralogy of Fallot",
"TOF is a congenital heart defect involving four major abnormalities.",
"Simple: TOF me heart ki 4 major structural abnormalities hoti hain.",
["Four defects?","VSD, pulmonary stenosis/right ventricular outflow obstruction, overriding aorta and right ventricular hypertrophy."],
["Important sign?","Cyanosis and hypoxic spells may occur."]
],

["Cleft Lip and Palate",
"Cleft lip and palate are congenital gaps in the lip and/or palate.",
"Simple: Birth se lip ya mouth ke roof me gap hona cleft lip/palate hai.",
["Main problem?","Feeding difficulty and aspiration risk."],
["Nursing care?","Safe feeding, positioning, nutrition, surgical preparation and family support."]
],

["Hydrocephalus",
"Hydrocephalus is abnormal accumulation of cerebrospinal fluid in the brain ventricles.",
"Simple: Brain me CSF zyada collect hone ki condition hydrocephalus hai.",
["Signs?","Increasing head circumference, vomiting, irritability and neurological changes."],
["Treatment?","Depends on cause; shunt surgery may be required."]
],

["Spina Bifida",
"Spina bifida is a neural tube defect caused by incomplete closure of the spinal column.",
"Simple: Spine properly close na hone se spina bifida hota hai.",
["Problems?","Weakness, sensory problems, bladder/bowel problems and hydrocephalus may occur."],
["Nursing care?","Protect lesion, prevent infection and pressure injury and monitor neurological function."]
],

["Meningitis",
"Meningitis is inflammation of the membranes covering the brain and spinal cord.",
"Simple: Brain aur spinal cord ko cover karne wali membranes me inflammation meningitis hai.",
["Symptoms?","Fever, headache, vomiting, neck stiffness and altered consciousness."],
["Nursing priority?","Urgent assessment, prescribed treatment, monitoring and infection precautions when indicated."]
],

["Febrile Convulsion",
"A febrile seizure is a seizure associated with fever in a young child.",
"Simple: Fever ke saath young child ko seizure/fit aana febrile convulsion ho sakta hai.",
["During seizure?","Protect child from injury, place safely, maintain airway and do not put anything in the mouth."],
["After seizure?","Assess breathing, consciousness and fever; seek medical assessment."]
],

["Cerebral Palsy",
"Cerebral palsy is a group of permanent disorders affecting movement and posture due to disturbance in the developing brain.",
"Simple: Developing brain ki injury/disturbance se movement aur posture affected hona.",
["Signs?","Abnormal tone, posture and delayed motor development."],
["Management?","Physiotherapy, occupational/speech therapy, medical care and family support."]
],

["Nephrotic Syndrome",
"Nephrotic syndrome is characterized by heavy protein loss in urine and edema.",
"Simple: Urine me bahut protein loss hone aur swelling/edema wali condition.",
["Main features?","Proteinuria, hypoalbuminemia, edema and hyperlipidemia."],
["Nursing care?","Monitor edema, weight, urine, nutrition, infection and prescribed medicines."]
],

["Acute Glomerulonephritis",
"Acute glomerulonephritis is inflammation of the kidney glomeruli.",
"Simple: Kidney ke filtering units me inflammation.",
["Symptoms?","Hematuria, edema, hypertension and reduced urine."],
["Nursing care?","Monitor BP, urine output, edema, fluid balance and prescribed treatment."]
],

["Leukemia",
"Leukemia is a malignant disorder of blood-forming tissues.",
"Simple: Blood-forming cells ka cancer leukemia hai.",
["Symptoms?","Anemia, infections, bleeding, fever, weakness and pallor may occur."],
["Nursing care?","Infection prevention, bleeding precautions, nutrition and treatment support."]
],

["Hemophilia",
"Hemophilia is an inherited bleeding disorder caused by deficiency of clotting factors.",
"Simple: Blood clotting factor ki deficiency se bleeding zyada hone wali inherited disease.",
["Main problem?","Prolonged bleeding, including joint or muscle bleeding."],
["Nursing care?","Prevent injury, monitor bleeding and give prescribed factor replacement."]
],

["Thalassemia",
"Thalassemia is an inherited disorder affecting hemoglobin production.",
"Simple: Hemoglobin banne ki inherited problem se anemia hota hai.",
["Symptoms?","Pallor, fatigue, weakness and growth problems may occur."],
["Treatment?","Depends on type; transfusions and chelation may be required."]
],

["Iron Deficiency Anemia",
"Iron deficiency anemia occurs when the body lacks enough iron to produce adequate hemoglobin.",
"Simple: Iron ki kami se hemoglobin kam ho jata hai.",
["Symptoms?","Pallor, weakness, fatigue and poor concentration."],
["Prevention?","Iron-rich diet and prescribed iron supplementation."]
],

["Immunization",
"Immunization protects people against vaccine-preventable diseases.",
"Simple: Vaccine dekar diseases se protection develop karna.",
["Nursing responsibility?","Correct vaccine, dose, route, schedule, storage and documentation."],
["Why important?","It reduces illness, complications and deaths from vaccine-preventable diseases."]
],

["IMNCI",
"IMNCI is an integrated approach for management of common neonatal and childhood illnesses.",
"Simple: Bachchon ki common diseases ko ek integrated system se assess, classify aur treat karna.",
["Main steps?","Assess, classify, treat/counsel, refer when needed and follow up."],
["Purpose?","Reduce childhood illness and deaths and improve quality of care."]
]
],

"7th Semester": [
["Nursing Research",
"Nursing research is systematic investigation that generates knowledge relevant to nursing.",
"Simple: Nursing problems ka scientific study research kehlata hai.",
["Steps?","Problem, literature review, objectives, design, sampling, data collection, analysis and report."],
["Why research?","To improve nursing knowledge, care quality and evidence-based practice."]
],

["Research Problem",
"A research problem is a clear issue that can be investigated systematically.",
"Simple: Aisi clear problem jisko scientific method se study kiya ja sake.",
["Characteristics?","Relevant, clear, feasible and researchable."],
["Example?","Effect of health education on knowledge regarding hypertension."]
],

["Research Design",
"Research design is the overall plan used to conduct a study.",
"Simple: Research ka complete plan research design hai.",
["Types?","Experimental and non-experimental designs; quantitative and qualitative approaches."]
],

["Sampling",
"Sampling is selecting participants from a population for a study.",
"Simple: Puri population me se study ke liye kuch participants select karna.",
["Types?","Probability and non-probability sampling."],
["What is sample?","A selected group of people representing the study population."]
],

["Data Collection",
"Data collection is systematic gathering of information for research.",
"Simple: Research ke liye required information collect karna.",
["Methods?","Questionnaire, interview, observation and checklist."],
["What is primary data?","Data collected directly by the researcher from the source."]
],

["Nursing Management",
"Nursing management coordinates people and resources to provide safe and effective nursing care.",
"Simple: Nursing staff aur resources ko properly manage karke patient care improve karna.",
["Functions?","Planning, organizing, staffing, directing, coordinating and controlling/evaluation."],
["Why delegation?","To distribute appropriate tasks safely according to competence."]
],

["Leadership",
"Leadership is influencing and guiding people toward a common goal.",
"Simple: Team ko guide aur motivate karke common goal achieve karna.",
["Qualities?","Communication, confidence, decision-making, responsibility and motivation."],
["Good leader?","A good leader communicates clearly, supports staff and makes responsible decisions."]
],

["Professional Nursing",
"Professional nursing involves safe, ethical, competent and evidence-based care.",
"Simple: Nursing ko ethics, knowledge aur professional responsibility ke saath practice karna.",
["Important values?","Confidentiality, accountability, respect, safety and ethical practice."],
["What is confidentiality?","Protecting a patient's private information from unauthorized disclosure."]
],

["Budgeting",
"Budgeting is planning and controlling financial resources.",
"Simple: Paisa/resources ko pehle se plan aur control karna budgeting hai.",
["Purpose?","Efficient use and control of resources."],
["Components?","Expected income/resources and planned expenditure."]
],

["Planning",
"Planning is deciding in advance what should be done, how, when and by whom.",
"Simple: Kaam pehle se decide karna ki kya, kab, kaise aur kaun karega.",
["Steps?","Set goals, assess resources, choose actions, implement and evaluate."],
["Why important?","It provides direction and helps use resources efficiently."]
]
]
};

const UNIVERSITIES = [
"Baba Farid University of Health Sciences",
"Rajiv Gandhi University of Health Sciences",
"Guru Nanak Dev University",
"Punjabi University",
"Punjab University",
"Delhi University",
"AIIMS New Delhi",
"Other University"
];

const COLLEGES = [
"Guru Arjun Dev College of Nursing",
"Government College of Nursing",
"AIIMS College of Nursing",
"Other Nursing College"
];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function json(res, data, status=200) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type":"application/json; charset=utf-8",
    "Access-Control-Allow-Origin":"*"
  });
  res.end(body);
}

function page(res) {
  res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
  res.end(HTML);
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0f766e">
<title>NurseStudy - B.Sc. Nursing Study Platform</title>

<style>
*{box-sizing:border-box}
body{
 margin:0;
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
 background:#f4f9fa;
 color:#243b53;
}
button,input,select{font:inherit}
button{cursor:pointer}
.hidden{display:none!important}
.container{width:min(1100px,92%);margin:auto}

header{
 position:sticky;top:0;z-index:100;
 background:#fff;border-bottom:1px solid #d9e2ec
}
.nav{
 min-height:70px;display:flex;align-items:center;
 justify-content:space-between
}
.logo{
 display:flex;align-items:center;gap:10px;
 font-size:24px;font-weight:900;color:#102a43
}
.logoIcon{
 width:45px;height:45px;border-radius:14px;
 display:grid;place-items:center;
 background:linear-gradient(135deg,#0f766e,#14b8a6);
 font-size:24px
}
.menuBtn{
 border:0;background:#e8f8f5;border-radius:13px;
 padding:11px 15px;font-size:22px;color:#0f766e
}

.hero{
 padding:35px 0;
 background:linear-gradient(180deg,#e8fbf8,#f4f9fa)
}
.badge{
 display:inline-block;background:#ddf6f2;color:#08645e;
 padding:8px 13px;border-radius:50px;font-size:13px;font-weight:800
}
h1{
 font-size:clamp(38px,7vw,65px);
 line-height:1.03;letter-spacing:-2px;
 color:#102a43;margin:18px 0
}
.hero p{font-size:18px;line-height:1.7;color:#627d98}

.search{
 display:flex;gap:8px;background:white;padding:7px;
 border:1px solid #d9e2ec;border-radius:16px;margin-top:22px
}
.search input{
 flex:1;border:0;outline:0;padding:14px;min-width:0
}
.btn{
 border:0;border-radius:12px;padding:13px 18px;
 background:#0f766e;color:white;font-weight:800
}

section{padding:40px 0}
h2{color:#102a43}
.card,.topic,.bookCard{
 background:#fff;border:1px solid #d9e2ec;
 border-radius:18px;padding:20px;margin:14px 0;
 box-shadow:0 5px 20px rgba(16,42,67,.05)
}
.topic h3{margin:0 0 8px;color:#102a43}
.topic p{line-height:1.7;color:#627d98}

.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}
.tab{
 border:1px solid #d9e2ec;background:white;
 padding:11px 14px;border-radius:11px;
 font-weight:800;color:#0f766e
}
.tab.active{background:#0f766e;color:white}

.actions{display:flex;gap:8px;flex-wrap:wrap}
.actions button{
 border:1px solid #d9e2ec;background:white;
 padding:10px 13px;border-radius:10px;
 font-weight:800;color:#0f766e
}

.modalBg{
 position:fixed;inset:0;background:rgba(16,42,67,.72);
 display:flex;align-items:center;justify-content:center;
 padding:14px;z-index:1000
}
.modal{
 width:min(850px,100%);max-height:92vh;overflow:auto;
 background:white;border-radius:22px
}
.modalHead{
 background:#0f766e;color:white;padding:17px;
 display:flex;justify-content:space-between;
 position:sticky;top:0;z-index:2
}
.modalHead button{
 border:0;background:transparent;color:white;font-size:23px
}
.modalBody{padding:18px}
.answerBox{
 background:#f0faf8;border:1px solid #cceee8;
 border-radius:15px;padding:16px;margin:12px 0;line-height:1.75
}
.simple{
 background:#fff8e8;border:1px solid #f1d49a;
 border-radius:15px;padding:16px;line-height:1.75;margin:12px 0
}
.mcq{
 border:1px solid #d9e2ec;border-radius:15px;
 padding:16px;margin:12px 0;line-height:1.7
}
.correct{font-weight:900;color:#0f766e}

.formCard{
 max-width:700px;margin:30px auto;background:white;
 border:1px solid #d9e2ec;border-radius:24px;
 padding:24px;box-shadow:0 10px 35px rgba(16,42,67,.08)
}
.field{margin:15px 0}
.field label{display:block;font-weight:800;margin-bottom:7px;color:#102a43}
.field input,.field select{
 width:100%;padding:14px;border:1px solid #d9e2ec;
 border-radius:12px;outline:none;background:white
}
.check{display:flex;gap:10px;align-items:flex-start;margin:17px 0;color:#627d98}
.check input{width:20px;height:20px}
.fullBtn{
 width:100%;padding:16px;border:0;border-radius:14px;
 background:linear-gradient(135deg,#0f766e,#14b8a6);
 color:white;font-size:18px;font-weight:900
}

.profile{
 background:linear-gradient(135deg,#0f766e,#115e59);
 color:white;border-radius:20px;padding:20px;margin-bottom:20px
}
.profile strong{font-size:22px}

.menuPanel{
 position:fixed;top:70px;right:12px;
 width:min(330px,90%);background:white;
 border:1px solid #d9e2ec;border-radius:18px;
 padding:14px;box-shadow:0 15px 40px rgba(0,0,0,.18);
 z-index:500
}
.menuPanel button{
 width:100%;text-align:left;border:0;background:white;
 padding:14px;border-radius:11px;font-weight:800;color:#102a43
}
.menuPanel button:hover{background:#e8f8f5}

.donation{
 background:linear-gradient(135deg,#ecfdf5,#dff8f3);
 border:1px solid #bce9df;border-radius:20px;padding:22px
}
.upi{
 background:white;padding:15px;border-radius:12px;
 font-weight:900;font-size:18px;word-break:break-all
}
.bookGrid{
 display:grid;grid-template-columns:repeat(2,1fr);gap:15px
}
footer{background:#102a43;color:#c7d5e2;padding:35px 0}
footer h3{color:white}
.small{font-size:13px;color:#627d98}

@media(max-width:650px){
 .search{flex-direction:column}
 .search .btn{width:100%}
 .actions button{width:100%}
 .bookGrid{grid-template-columns:1fr}
 .formCard{padding:18px}
}
</style>
</head>

<body>

<header>
<div class="container nav">
<div class="logo">
<span class="logoIcon">🩺</span>
NurseStudy
</div>
<button class="menuBtn" onclick="toggleMenu()">☰</button>
</div>
</header>

<div id="menuPanel" class="menuPanel hidden">
<button onclick="goTo('study')">📚 Study Centre</button>
<button onclick="goTo('donation')">❤️ Donation</button>
<button onclick="goTo('books')">📚 Books Give / Take</button>
<button onclick="goTo('founder')">👨‍💼 Founder</button>
<button onclick="logout()">🚪 Logout</button>
</div>

<section id="loginPage">
<div class="container">
<div class="formCard">

<div style="text-align:center;font-size:55px">🩺</div>

<h2 style="text-align:center">Welcome to NurseStudy</h2>

<p style="text-align:center;color:#627d98;line-height:1.6">
Free B.Sc. Nursing Study Platform<br>
Apni details bharo aur turant website use karo.
</p>

<div class="field">
<label>👤 Full Name *</label>
<input id="studentName" type="text" placeholder="Enter your full name">
</div>

<div class="field">
<label>📱 Mobile Number *</label>
<input id="studentPhone" type="tel" inputmode="numeric"
maxlength="10" placeholder="10 digit mobile number">
</div>

<div class="field">
<label>⚧ Gender *</label>
<select id="studentGender">
<option value="">Select Gender</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>
<option>Prefer not to say</option>
</select>
</div>

<div class="field">
<label>🎓 Semester *</label>
<select id="studentSemester">
<option value="">Select Semester</option>
<option>1st Semester</option>
<option>2nd Semester</option>
<option>3rd Semester</option>
<option>4th Semester</option>
<option>5th Semester</option>
<option>6th Semester</option>
<option>7th Semester</option>
</select>
</div>

<div class="field">
<label>🏛️ University *</label>
<select id="studentUniversity">
<option value="">Select University</option>
${UNIVERSITIES.map(x=>`<option>${x}</option>`).join("")}
</select>
</div>

<div class="field">
<label>🏫 College *</label>
<select id="studentCollege">
<option value="">Select College</option>
${COLLEGES.map(x=>`<option>${x}</option>`).join("")}
</select>
</div>

<div class="field">
<label>📖 Course</label>
<select id="studentCourse">
<option>B.Sc. Nursing</option>
<option>Other Nursing Course</option>
</select>
</div>

<div class="check">
<input id="agree" type="checkbox">
<span>I agree to use these details for NurseStudy student services.</span>
</div>

<button class="fullBtn" onclick="enterNurseStudy()">
🚀 Enter NurseStudy
</button>

<p class="small" style="text-align:center;margin-top:15px">
Aapki details secure student service ke liye use hongi.
</p>

</div>
</div>
</section>

<div id="mainSite" class="hidden">

<section class="hero">
<div class="container">

<div class="profile">
<div>👋 Welcome to NurseStudy</div>
<strong id="welcomeName"></strong>
<div id="welcomeDetails" style="margin-top:8px"></div>
</div>

<span class="badge">🎓 B.Sc. Nursing • Semester 1–7</span>

<h1>
Learn Nursing.<br>
<span style="color:#0f766e">Understand Nursing.</span>
</h1>

<p>
Notes, Viva Answers, MCQs, Important Questions,
Simple English + Apni Bhasha explanation.
</p>

<div class="search">
<input id="searchInput"
placeholder="Search Hypertension, COPD, KMC..."
onkeydown="if(event.key==='Enter')searchSite()">
<button class="btn" onclick="searchSite()">🔎 Search</button>
</div>

<div id="searchResults"></div>

</div>
</section>

<section id="study">
<div class="container">

<h2>📚 Nursing Study Centre</h2>
<p style="color:#627d98">
Semester select karo aur kisi bhi topic me Notes, Viva, MCQ aur Important Questions dekho.
</p>

<div id="tabs" class="tabs"></div>
<div id="content"></div>

</div>
</section>

<section id="donation">
<div class="container">
<div class="donation">

<h2>❤️ Help a Student</h2>

<p>
Aapki chhoti si help kisi nursing student ki books,
study material ya education mein madad kar sakti hai.
</p>

<div class="upi">UPI: 7763082034@kotak</div>

<br>

<button class="btn" onclick="copyUPI()">
📋 Copy UPI ID
</button>

</div>
</div>
</section>

<section id="books">
<div class="container">

<h2>📚 Books Give / Take</h2>

<div class="bookGrid">

<div class="bookCard">
<h3>📤 Book Give</h3>
<p>Apni extra nursing books kisi student ko dene ke liye details share karein.</p>
<button class="btn" onclick="bookForm('Give')">Add Book</button>
</div>

<div class="bookCard">
<h3>📥 Book Need</h3>
<p>Agar aapko nursing book chahiye to apni requirement submit karein.</p>
<button class="btn" onclick="bookForm('Need')">Request Book</button>
</div>

</div>

<div id="bookMessage"></div>

</div>
</section>

<section id="founder">
<div class="container">

<div class="card">
<h2>👨‍💼 Founder</h2>
<h3 style="font-size:26px">Nadeem</h3>
<p>
Founder of <b>NurseStudy</b>
</p>
<p style="line-height:1.7;color:#627d98">
NurseStudy ka purpose nursing students ko easy language me
study material, viva preparation, MCQs aur important questions
available karwana hai.
</p>
</div>

</div>
</section>

<footer>
<div class="container">
<h3>🩺 NurseStudy</h3>
<p>Learn Nursing • Understand Nursing • Help Each Other</p>
<p>Founder: <b>Nadeem</b></p>
</div>
</footer>

</div>

<div id="modalRoot"></div>

<script>

const CONTENT = ${JSON.stringify(CONTENT)};

let profile = null;
let activeSemester = "1st Semester";

function $(id){
 return document.getElementById(id);
}

function toggleMenu(){
 $("menuPanel").classList.toggle("hidden");
}

function goTo(id){
 $("menuPanel").classList.add("hidden");
 const el = $(id);
 if(el) el.scrollIntoView({behavior:"smooth"});
}

function enterNurseStudy(){

 const name = $("studentName").value.trim();
 const phone = $("studentPhone").value.trim();
 const gender = $("studentGender").value;
 const semester = $("studentSemester").value;
 const university = $("studentUniversity").value;
 const college = $("studentCollege").value;
 const course = $("studentCourse").value;

 if(!name){
   alert("Please enter your full name.");
   return;
 }

 if(!/^[0-9]{10}$/.test(phone)){
   alert("Please enter a valid 10 digit mobile number.");
   return;
 }

 if(!gender || !semester || !university || !college){
   alert("Please fill all required details.");
   return;
 }

 if(!$("agree").checked){
   alert("Please tick the agreement box.");
   return;
 }

 profile = {
   name, phone, gender, semester,
   university, college, course
 };

 localStorage.setItem("nurseStudyProfile",JSON.stringify(profile));

 $("loginPage").classList.add("hidden");
 $("mainSite").classList.remove("hidden");

 $("welcomeName").textContent = name;

 $("welcomeDetails").textContent =
 semester + " • " + university + " • " + college;

 buildTabs();
 showSemester(semester);

 fetch("/api/student",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify(profile)
 }).catch(()=>{});

 window.scrollTo(0,0);
}

function loadProfile(){

 try{
   const saved = localStorage.getItem("nurseStudyProfile");

   if(saved){
     profile = JSON.parse(saved);

     $("loginPage").classList.add("hidden");
     $("mainSite").classList.remove("hidden");

     $("welcomeName").textContent = profile.name;

     $("welcomeDetails").textContent =
       profile.semester + " • " +
       profile.university + " • " +
       profile.college;

     buildTabs();
     showSemester(profile.semester || "1st Semester");
   }
 }catch(e){}
}

function logout(){

 localStorage.removeItem("nurseStudyProfile");
 profile = null;

 $("mainSite").classList.add("hidden");
 $("loginPage").classList.remove("hidden");

 $("menuPanel").classList.add("hidden");

 window.scrollTo(0,0);
}

function buildTabs(){

 $("tabs").innerHTML =
 Object.keys(CONTENT).map(semester => {

   const active =
     semester === activeSemester ? "active" : "";

   return \`
   <button class="tab \${active}"
   onclick="showSemester('\${semester}')">
   \${semester.replace(" Semester","")} Semester
   </button>
   \`;

 }).join("");
}

function showSemester(semester){

 activeSemester = semester;

 buildTabs();

 const topics = CONTENT[semester] || [];

 $("content").innerHTML = \`
 <div class="card">
 <h2>📖 \${semester}</h2>
 <p style="color:#627d98">
 Total important topics: <b>\${topics.length}</b>
 </p>
 </div>

 \${topics.map((topic,index)=>\`
 <div class="topic">
   <h3>\${index+1}. \${topic[0]}</h3>
   <p><b>Definition:</b> \${topic[1]}</p>
   <p><b>Apni Bhasha:</b> \${topic[2]}</p>

   <div class="actions">
     <button onclick="openTopic('\${semester}',\${index},'notes')">
       📘 Notes
     </button>

     <button onclick="openTopic('\${semester}',\${index},'viva')">
       🎤 Viva
     </button>

     <button onclick="openTopic('\${semester}',\${index},'mcq')">
       📝 MCQ
     </button>

     <button onclick="openTopic('\${semester}',\${index},'important')">
       ⭐ Important Questions
     </button>
   </div>
 </div>
 \`).join("")}
 \`;

}

function openTopic(semester,index,type){

 const topic = CONTENT[semester][index];

 const name = topic[0];
 const definition = topic[1];
 const hindi = topic[2];
 const qa = topic.slice(3);

 let body = "";

 if(type === "notes"){

   body = \`
   <div class="answerBox">
   <h4>📘 Definition</h4>
   \${definition}
   </div>

   <div class="simple">
   <b>🗣️ Apni Bhasha:</b><br>
   \${hindi}
   </div>

   <div class="answerBox">
   <h4>📚 Short Notes</h4>
   <p><b>Meaning:</b> \${definition}</p>
   <p><b>Exam Point:</b> Definition ke baad causes/risk factors,
   signs & symptoms, investigations, management aur nursing care
   likhna useful hota hai.</p>
   </div>
   \`;

 }

 if(type === "viva"){

   body = qa.map((x,i)=>\`
   <div class="answerBox">
   <h4>🎤 Viva Q\${i+1}. \${x[0]}</h4>
   <b>Answer:</b> \${x[1]}
   </div>
   \`).join("");

 }

 if(type === "mcq"){

   const mcqs = makeMCQs(name,qa);

   body = mcqs.map((q,i)=>\`
   <div class="mcq">
   <b>Q\${i+1}. \${q.q}</b>
   <p>A) \${q.a}</p>
   <p>B) \${q.b}</p>
   <p>C) \${q.c}</p>
   <p>D) \${q.d}</p>
   <div class="correct">✅ Correct Answer: \${q.correct}</div>
   </div>
   \`).join("");

 }

 if(type === "important"){

   body = \`
   <div class="answerBox">
   <h4>⭐ Very Important Questions</h4>

   <ol>
   <li>Define \${name}.</li>
   <li>Write causes/risk factors of \${name}.</li>
   <li>Write signs and symptoms of \${name}.</li>
   <li>Write investigations of \${name}.</li>
   <li>Write medical management of \${name}.</li>
   <li>Write nursing management of \${name}.</li>
   <li>Write complications of \${name}.</li>
   </ol>
   </div>

   <div class="simple">
   <b>Exam Writing Tip:</b><br>
   15 marks ke answer me Definition →
   Causes → Signs/Symptoms → Investigations →
   Management → Nursing Management → Complications
   ke headings use karo.
   </div>
   \`;

 }

 $("modalRoot").innerHTML = \`
 <div class="modalBg" onclick="if(event.target===this)closeModal()">
   <div class="modal">

     <div class="modalHead">
       <b>\${name}</b>
       <button onclick="closeModal()">✕</button>
     </div>

     <div class="modalBody">
       \${body}
     </div>

   </div>
 </div>
 \`;
}

function makeMCQs(name,qa){

 const first = qa[0] ? qa[0][1] : "See notes.";

 return [
 {
   q:"Which statement is most appropriate about " + name + "?",
   a:first,
   b:"It is unrelated to nursing care.",
   c:"It has no clinical importance.",
   d:"None of these.",
   correct:"A"
 },
 {
   q:"Which is important for nursing students studying " + name + "?",
   a:"Ignore patient assessment.",
   b:"Understand definition and nursing care.",
   c:"Avoid documentation.",
   d:"Do not monitor the patient.",
   correct:"B"
 },
 {
   q:"The best approach to answer a long question is:",
   a:"Write only one line.",
   b:"Write without headings.",
   c:"Use clear headings and points.",
   d:"Leave the question blank.",
   correct:"C"
 },
 {
   q:"For viva preparation, the student should:",
   a:"Memorize without understanding.",
   b:"Know definition and key points.",
   c:"Avoid important questions.",
   d:"Only read MCQs.",
   correct:"B"
 }
 ];

}

function searchSite(){

 const query = $("searchInput").value.trim().toLowerCase();

 if(!query){
   $("searchResults").innerHTML = "";
   return;
 }

 const results = [];

 for(const semester of Object.keys(CONTENT)){

   CONTENT[semester].forEach((topic,index)=>{

     const text =
       (topic[0]+" "+topic[1]+" "+topic[2]).toLowerCase();

     if(text.includes(query)){
       results.push({semester,index,topic});
     }

   });

 }

 if(!results.length){

   $("searchResults").innerHTML = \`
   <div class="card">
   ❌ No exact topic found.<br>
   Try: <b>Hypertension</b>, <b>Diabetes</b>,
   <b>KMC</b>, <b>IMNCI</b>, <b>Research</b>.
   </div>
   \`;

   return;
 }

 $("searchResults").innerHTML = \`
 <div class="card">
 <h3>🔎 Search Results</h3>

 \${results.map(x=>\`
 <div class="topic">
 <small>\${x.semester}</small>
 <h3>\${x.topic[0]}</h3>
 <p>\${x.topic[1]}</p>
 <button class="btn"
 onclick="showSemester('\${x.semester}');setTimeout(()=>openTopic('\${x.semester}',\${x.index},'notes'),100)">
 Open Topic
 </button>
 </div>
 \`).join("")}

 </div>
 \`;
}

function closeModal(){
 $("modalRoot").innerHTML = "";
}

function copyUPI(){

 navigator.clipboard?.writeText("7763082034@kotak")
 .then(()=>alert("UPI ID copied: 7763082034@kotak"))
 .catch(()=>alert("UPI ID: 7763082034@kotak"));
}

function bookForm(type){

 $("bookMessage").innerHTML = \`
 <div class="card">
 <h3>\${type === "Give" ? "📤 Give a Book" : "📥 Need a Book"}</h3>

 <div class="field">
 <label>Name</label>
 <input id="bookName" placeholder="Your name">
 </div>

 <div class="field">
 <label>Mobile</label>
 <input id="bookPhone" placeholder="10 digit mobile">
 </div>

 <div class="field">
 <label>Book Name</label>
 <input id="bookTitle" placeholder="Example: Child Health Nursing">
 </div>

 <div class="field">
 <label>Semester</label>
 <select id="bookSemester">
 ${Object.keys(CONTENT).map(s=>\`<option>\${s}</option>\`).join("")}
 </select>
 </div>

 <button class="btn" onclick="submitBook('\${type}')">
 Submit
 </button>
 </div>
 \`;
}

function submitBook(type){

 const name = $("bookName").value.trim();
 const phone = $("bookPhone").value.trim();
 const title = $("bookTitle").value.trim();
 const semester = $("bookSemester").value;

 if(!name || !phone || !title){
   alert("Please fill all details.");
   return;
 }

 fetch("/api/book",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({
     type,name,phone,title,semester
   })
 }).catch(()=>{});

 $("bookMessage").innerHTML = \`
 <div class="card">
 <h3>✅ Request Submitted</h3>
 <p>
 Thank you <b>\${name}</b>.<br>
 Your book \${type.toLowerCase()} request has been recorded.
 </p>
 </div>
 \`;
}

window.addEventListener("load",loadProfile);

</script>

</body>
</html>`;

const server = http.createServer((req,res)=>{

  if(req.method === "GET" && req.url === "/"){
    return page(res);
  }

  if(req.method === "GET" && req.url === "/health"){
    return json(res,{
      ok:true,
      app:"NurseStudy",
      message:"NurseStudy server is running"
    });
  }

  if(req.method === "POST" && req.url === "/api/student"){

    let body = "";

    req.on("data",chunk=>{
      body += chunk.toString();

      if(body.length > 100000){
        req.destroy();
      }
    });

    req.on("end",()=>{

      try{

        const student = JSON.parse(body);

        if(
          !student.name ||
          !student.phone ||
          !student.gender ||
          !student.semester ||
          !student.university ||
          !student.college
        ){
          return json(res,{
            ok:false,
            message:"Required details missing"
          },400);
        }

        saveStudent(student);

        return json(res,{
          ok:true,
          message:"Student registered successfully"
        });

      }catch(e){

        return json(res,{
          ok:false,
          message:"Invalid request"
        },400);

      }

    });

    return;
  }

  if(req.method === "POST" && req.url === "/api/book"){

    let body = "";

    req.on("data",chunk=>{
      body += chunk.toString();
    });

    req.on("end",()=>{

      try{

        const data = JSON.parse(body);

        const file = path.join(
          os.tmpdir(),
          "nursestudy_books.json"
        );

        let books = [];

        try{
          if(fs.existsSync(file)){
            books = JSON.parse(
              fs.readFileSync(file,"utf8")
            );
          }
        }catch(e){}

        books.push({
          ...data,
          createdAt:new Date().toISOString()
        });

        try{
          fs.writeFileSync(
            file,
            JSON.stringify(books,null,2)
          );
        }catch(e){}

        return json(res,{
          ok:true,
          message:"Book request saved"
        });

      }catch(e){

        return json(res,{
          ok:false
        },400);

      }

    });

    return;
  }

  res.writeHead(404,{"Content-Type":"text/plain"});
  res.end("NurseStudy - Page Not Found");

});

server.listen(PORT,HOST,()=>{
  console.log("=================================");
  console.log("NurseStudy server is running");
  console.log("PORT:",PORT);
  console.log("URL ready for Render");
  console.log("=================================");
});