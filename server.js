const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Website files
app.use(express.static(path.join(__dirname)));

app.get("/health", (req, res) => {
  res.status(200).send("NurseStudy is running");
});

// Main page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// IMPORTANT: Render requires 0.0.0.0 + PORT
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NurseStudy running on 0.0.0.0:${PORT}`);
});