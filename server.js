const fs = require("fs");
const path = require("path");

const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/videos", express.static("videos"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "videos/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".webm");
  }
});

const upload = multer({ storage });

let submissions = [];

// UPLOAD
app.post("/upload", upload.single("video"), (req, res) => {

  const name = req.body.name;
  const task = req.body.task;

  // count attempts
  const attemptCount = submissions.filter(
    s => s.name === name && s.task === task
  ).length + 1;

  const entry = {
    id: Date.now() + Math.random(), // 🔥 unique ID
    name,
    task,
    attempt: attemptCount,
    file: req.file.filename,
    status: "pending"
  };

  submissions.push(entry);
  res.sendStatus(200);
});

// GET ALL
app.get("/submissions", (req, res) => {

  submissions = submissions.filter(sub => {

    const filePath = path.join(__dirname, "videos", sub.file);

    // keep only if file exists
    return fs.existsSync(filePath);
  });

  res.json(submissions);
});

// APPROVE
app.post("/approve/:id", (req, res) => {
  const item = submissions.find(s => s.id == req.params.id);
  if (item) item.status = "approved";
  res.sendStatus(200);
});

// REJECT
app.post("/reject/:id", (req, res) => {
  const item = submissions.find(s => s.id == req.params.id);
  if (item) item.status = "rejected";
  res.sendStatus(200);
});

app.get("/reset", (req, res) => {
  submissions = []; // clear all data

  console.log("SERVER RESET: submissions cleared");

  res.send("✅ Server reset done");
});

app.listen(3000, () => console.log("Server running on port 3000"));