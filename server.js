const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "NurseStudy-Change-This-Secret-2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30
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
   WEBSITE
========================================================= */

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================================================
   REGISTER STUDENT
========================================================= */

app.post("/api/register", (req, res) => {
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
        message: "Please fill all required details."
      });
    }

    const cleanName = String(name).trim();
    const cleanPhone = String(phone).trim();
    const cleanGender = String(gender).trim();
    const cleanSemester = String(semester).trim();
    const cleanUniversity = String(university).trim();
    const cleanCollege = String(college).trim();
    const cleanCourse = String(course).trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name."
      });
    }

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10 digit mobile number."
      });
    }

    const stmt = db.prepare(`
      INSERT INTO students
      (
        name,
        phone,
        gender,
        semester,
        university,
        college,
        course
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      cleanName,
      cleanPhone,
      cleanGender,
      cleanSemester,
      cleanUniversity,
      cleanCollege,
      cleanCourse
    );

    req.session.studentId = result.lastInsertRowid;

    res.json({
      success: true,
      message: "Welcome to NurseStudy!",
      student: {
        id: result.lastInsertRowid,
        name: cleanName,
        phone: cleanPhone,
        gender: cleanGender,
        semester: cleanSemester,
        university: cleanUniversity,
        college: cleanCollege,
        course: cleanCourse
      }
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
});

/* =========================================================
   LOGIN / EXISTING STUDENT
========================================================= */

app.post("/api/login", (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(String(phone))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10 digit mobile number."
      });
    }

    const student = db
      .prepare(
        `SELECT * FROM students
         WHERE phone = ?
         ORDER BY id DESC
         LIMIT 1`
      )
      .get(String(phone));

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found. Please register first."
      });
    }

    req.session.studentId = student.id;

    res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to login."
    });
  }
});

/* =========================================================
   CURRENT STUDENT
========================================================= */

app.get("/api/me", (req, res) => {
  try {
    if (!req.session.studentId) {
      return res.json({
        success: false,
        loggedIn: false
      });
    }

    const student = db
      .prepare(
        `SELECT * FROM students
         WHERE id = ?`
      )
      .get(req.session.studentId);

    if (!student) {
      req.session.studentId = null;

      return res.json({
        success: false,
        loggedIn: false
      });
    }

    res.json({
      success: true,
      loggedIn: true,
      student
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    res.status(500).json({
      success: false,
      loggedIn: false
    });
  }
});

/* =========================================================
   LOGOUT
========================================================= */

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({
      success: true
    });
  });
});

/* =========================================================
   STUDENT COUNT
========================================================= */

app.get("/api/student-count", (req, res) => {
  try {
    const row = db
      .prepare(`SELECT COUNT(*) AS total FROM students`)
      .get();

    res.json({
      success: true,
      total: row.total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      total: 0
    });
  }
});

/* =========================================================
   ADMIN LOGIN
   Set ADMIN_PASSWORD in Render Environment Variables.
========================================================= */

function adminRequired(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Admin login required."
  });
}

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  const adminPassword =
    process.env.ADMIN_PASSWORD || "ChangeThisAdminPassword";

  if (
    password &&
    String(password) === String(adminPassword)
  ) {
    req.session.isAdmin = true;

    return res.json({
      success: true,
      message: "Admin login successful."
    });
  }

  res.status(401).json({
    success: false,
    message: "Wrong admin password."
  });
});

/* =========================================================
   ADMIN - STUDENT LIST
========================================================= */

app.get(
  "/api/admin/students",
  adminRequired,
  (req, res) => {
    try {
      const students = db
        .prepare(`
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
        `)
        .all();

      res.json({
        success: true,
        students
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to load students."
      });
    }
  }
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "NurseStudy",
    time: new Date().toISOString()
  });
});

/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found."
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, HOST, () => {
  console.log(
    `NurseStudy server running on http://${HOST}:${PORT}`
  );
});