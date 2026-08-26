const express=require("express");
const session=require("express-session");
const bcrypt=require("bcryptjs");
const Database=require("better-sqlite3");
const path=require("path");

const app=express();
const db=new Database("hellofriendshelp.db");
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 phone TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'user',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS workers(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 skill TEXT NOT NULL,
 location TEXT NOT NULL,
 experience TEXT,
 rate TEXT,
 available INTEGER DEFAULT 1,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS jobs(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 work TEXT NOT NULL,
 location TEXT NOT NULL,
 details TEXT,
 status TEXT DEFAULT 'open',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS donations(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 donor_name TEXT,
 amount REAL,
 note TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const adminPhone=process.env.ADMIN_PHONE || "9999999999";
const adminPassword=process.env.ADMIN_PASSWORD || "ChangeMe123!";

if(!db.prepare("SELECT id FROM users WHERE phone=?").get(adminPhone)){
  const hash=bcrypt.hashSync(adminPassword,10);
  db.prepare(
    "INSERT INTO users(name,phone,password_hash,role) VALUES(?,?,?,'admin')"
  ).run("HelloFriendsHelp Admin",adminPhone,hash);
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
 secret:process.env.SESSION_SECRET || "CHANGE_THIS_SESSION_SECRET",
 resave:false,
 saveUninitialized:false,
 cookie:{
   httpOnly:true,
   sameSite:"lax",
   secure:false,
   maxAge:7*24*60*60*1000
 }
}));

app.use(express.static(path.join(__dirname,"public")));

function auth(req,res,next){
  if(!req.session.user)
    return res.status(401).json({error:"Login required"});
  next();
}

function admin(req,res,next){
  if(!req.session.user || req.session.user.role!=="admin")
    return res.status(403).json({error:"Admin only"});
  next();
}

app.get("/api/me",(req,res)=>{
  res.json({user:req.session.user||null});
});

app.post("/api/signup",(req,res)=>{
  const {name,phone,password}=req.body;

  if(!name||!phone||!password||password.length<6)
    return res.status(400).json({
      error:"Name, phone and 6+ character password required"
    });

  if(db.prepare("SELECT id FROM users WHERE phone=?").get(phone))
    return res.status(409).json({
      error:"Phone already registered"
    });

  const hash=bcrypt.hashSync(password,10);

  const info=db.prepare(
    "INSERT INTO users(name,phone,password_hash) VALUES(?,?,?)"
  ).run(name,phone,hash);

  const user={
    id:info.lastInsertRowid,
    name,
    phone,
    role:"user"
  };

  req.session.user=user;

  res.json({user});
});

app.post("/api/login",(req,res)=>{
  const {phone,password}=req.body;

  const u=db.prepare(
    "SELECT * FROM users WHERE phone=?"
  ).get(phone);

  if(!u || !bcrypt.compareSync(password||"",u.password_hash))
    return res.status(401).json({
      error:"Invalid phone or password"
    });

  req.session.user={
    id:u.id,
    name:u.name,
    phone:u.phone,
    role:u.role
  };

  res.json({user:req.session.user});
});

app.post("/api/logout",(req,res)=>{
  req.session.destroy(()=>res.json({ok:true}));
});

app.get("/api/workers",(req,res)=>{
  const {q="",location="",skill=""}=req.query;

  const rows=db.prepare(`
    SELECT * FROM workers WHERE available=1
    AND (
      lower(name)||' '||lower(skill) LIKE lower(?)
      OR lower(skill) LIKE lower(?)
    )
    AND lower(location) LIKE lower(?)
    AND lower(skill) LIKE lower(?)
    ORDER BY id DESC
  `).all(
    `%${q}%`,
    `%${q}%`,
    `%${location}%`,
    `%${skill}%`
  );

  res.json(rows);
});

app.post("/api/workers",auth,(req,res)=>{
  const {
    name,
    phone,
    skill,
    location,
    experience,
    rate
  }=req.body;

  if(!name||!phone||!skill||!location)
    return res.status(400).json({
      error:"Name, phone, skill and location are required"
    });

  const info=db.prepare(`
    INSERT INTO workers(
      user_id,
      name,
      phone,
      skill,
      location,
      experience,
      rate
    )
    VALUES(?,?,?,?,?,?,?)
  `).run(
    req.session.user.id,
    name,
    phone,
    skill,
    location,
    experience||"",
    rate||""
  );

  res.json({id:info.lastInsertRowid});
});

app.get("/api/jobs",(req,res)=>{
  const rows=db.prepare(
    "SELECT * FROM jobs WHERE status='open' ORDER BY id DESC"
  ).all();

  res.json(rows);
});

app.post("/api/jobs",auth,(req,res)=>{
  const {
    name,
    phone,
    work,
    location,
    details
  }=req.body;

  if(!name||!phone||!work||!location)
    return res.status(400).json({
      error:"Name, phone, work and location are required"
    });

  const info=db.prepare(`
    INSERT INTO jobs(
      user_id,
      name,
      phone,
      work,
      location,
      details
    )
    VALUES(?,?,?,?,?,?)
  `).run(
    req.session.user.id,
    name,
    phone,
    work,
    location,
    details||""
  );

  res.json({id:info.lastInsertRowid});
});

app.post("/api/donations",auth,(req,res)=>{
  const {amount,note}=req.body;

  if(!amount||Number(amount)<=0)
    return res.status(400).json({
      error:"Enter a valid amount"
    });

  const info=db.prepare(`
    INSERT INTO donations(
      donor_name,
      amount,
      note
    )
    VALUES(?,?,?)
  `).run(
    req.session.user.name,
    Number(amount),
    note||""
  );

  res.json({
    id:info.lastInsertRowid,
    message:
      "Donation intention recorded. Complete payment separately through the displayed UPI."
  });
});

app.get("/api/admin/stats",admin,(req,res)=>{
  res.json({
    users:db.prepare(
      "SELECT count(*) c FROM users WHERE role='user'"
    ).get().c,

    workers:db.prepare(
      "SELECT count(*) c FROM workers"
    ).get().c,

    jobs:db.prepare(
      "SELECT count(*) c FROM jobs"
    ).get().c,

    donations:db.prepare(
      "SELECT COALESCE(sum(amount),0) total FROM donations"
    ).get().total
  });
});

app.get("/api/admin/workers",admin,(req,res)=>{
  res.json(
    db.prepare(
      "SELECT * FROM workers ORDER BY id DESC"
    ).all()
  );
});

app.get("/api/admin/jobs",admin,(req,res)=>{
  res.json(
    db.prepare(
      "SELECT * FROM jobs ORDER BY id DESC"
    ).all()
  );
});

app.patch("/api/admin/jobs/:id",admin,(req,res)=>{
  const status=req.body.status;

  if(!["open","closed"].includes(status))
    return res.status(400).json({
      error:"Invalid status"
    });

  db.prepare(
    "UPDATE jobs SET status=? WHERE id=?"
  ).run(status,req.params.id);

  res.json({ok:true});
});

app.patch("/api/admin/workers/:id",admin,(req,res)=>{
  db.prepare(
    "UPDATE workers SET available=? WHERE id=?"
  ).run(
    req.body.available?1:0,
    req.params.id
  );

  res.json({ok:true});
});

app.get("*",(req,res)=>{
  res.sendFile(
    path.join(__dirname,"public","index.html")
  );
});

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
  console.log(
    `HelloFriendsHelp running on http://localhost:${PORT}`
  );
});