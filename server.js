const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "nursestudy-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30
    }
  })
);

/* =========================
   DATABASE
========================= */

const db = new Database("nursestudy.db");

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

/* =========================
   SAVE STUDENT
========================= */

app.post("/api/students", (req, res) => {

  try {

    const {
      name,
      phone,
      gender,
      semester,
      university,
      college,
      course
    } = req.body;

    if (
      !name ||
      !phone ||
      !gender ||
      !semester ||
      !university ||
      !college ||
      !course
    ) {
      return res.status(400).json({
        success: false,
        message: "All details are required."
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number."
      });
    }

    const statement = db.prepare(`
      INSERT INTO students
      (name, phone, gender, semester, university, college, course)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
      name.trim(),
      phone.trim(),
      gender,
      semester,
      university,
      college,
      course
    );

    req.session.studentId = result.lastInsertRowid;

    res.json({
      success: true,
      studentId: result.lastInsertRowid
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error."
    });

  }

});


/* =========================
   CURRENT STUDENT
========================= */

app.get("/api/me", (req, res) => {

  if (!req.session.studentId) {
    return res.json({
      loggedIn: false
    });
  }

  const student = db.prepare(`
    SELECT
      id,
      name,
      phone,
      gender,
      semester,
      university,
      college,
      course,
      created_at
    FROM students
    WHERE id = ?
  `).get(req.session.studentId);

  if (!student) {
    return res.json({
      loggedIn: false
    });
  }

  res.json({
    loggedIn: true,
    student
  });

});


/* =========================
   LOGOUT
========================= */

app.post("/api/logout", (req, res) => {

  req.session.destroy(() => {

    res.json({
      success: true
    });

  });

});


/* =========================
   ADMIN STUDENT LIST
========================= */

app.get("/api/admin/students", (req, res) => {

  /*
    IMPORTANT:
    Production website mein is route ko
    proper admin authentication se protect karna chahiye.
  */

  const students = db.prepare(`
    SELECT
      id,
      name,
      phone,
      gender,
      semester,
      university,
      college,
      course,
      created_at
    FROM students
    ORDER BY id DESC
  `).all();

  res.json({
    success: true,
    count: students.length,
    students
  });

});


/* =========================
   ADMIN SUMMARY
========================= */

app.get("/api/admin/summary", (req, res) => {

  const total = db.prepare(`
    SELECT COUNT(*) AS count
    FROM students
  `).get();

  const semesters = db.prepare(`
    SELECT semester, COUNT(*) AS count
    FROM students
    GROUP BY semester
    ORDER BY semester
  `).all();

  res.json({
    success: true,
    totalStudents: total.count,
    semesterWise: semesters
  });

});


/* =========================
   FRONTEND
========================= */

app.use(express.static(path.join(__dirname)));

app.get("*", (req, res) => {

  res.sendFile(
    path.join(__dirname, "index.html")
  );

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `NurseStudy server running on port ${PORT}`
  );

});