const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// 🔥 ensure videos folder exists
const videosDir = path.join(__dirname, "videos");

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use("/videos", express.static("videos"));
app.use(express.static(path.join(__dirname)));

const session = require("express-session");

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true,        // IMPORTANT for Render HTTPS
    sameSite: "none",    // REQUIRED for cross-site
    maxAge: 1000 * 60 * 60 * 2
  }
}));

const usersFile = path.join(__dirname, "users.json");

let qteActive = false;
let qteData = {
  title: "",
  endsAt: 0
};

// create file if not exists
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([
    { "name": "Alvaro", "password": null },
    { "name": "Ben", "password": null },
    { "name": "Bryan", "password": null },
    { "name": "Cathleen", "password": null },
    { "name": "Cheryl", "password": null },
    { "name": "Christian", "password": null },
    { "name": "Cliff", "password": null },
    { "name": "Felix", "password": null },
    { "name": "Frederick", "password": null },
    { "name": "Gizelle", "password": null },
    { "name": "Grace", "password": null },
    { "name": "Gwillbert", "password": null },
    { "name": "Jasmine", "password": null },
    { "name": "Jeniffer", "password": null },
    { "name": "Jessica", "password": null },
    { "name": "Kathleen", "password": null },
    { "name": "Keiko", "password": null },
    { "name": "Sin", "password": null },
    { "name": "Viona", "password": null },
    { "name": "Priscilla", "password": null },
    { "name": "Victor", "password": null },
    { "name": "Wendellyne", "password": null },
    { "name": "Winston", "password": null }
  ], null, 2));
}

function getUsers() {
  return JSON.parse(fs.readFileSync(usersFile));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

const pointsFile = path.join(__dirname, "points.json");

function getPoints() {
  return JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints(points) {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videosDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".webm");
  }
});

const upload = multer({ storage });

let submissions = [];

// UPLOAD
app.post("/upload", upload.single("video"), (req, res) => {

  const name = req.session.user;
  if (!name) {
    return res.status(401).send("Not logged in");
  }

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const task = req.body.task;

  // 🔒 LOGIN CHECK HERE
  const users = getUsers();
  const user = users.find(u => u.name === name);

  if (!user || !user.password) {
    return res.status(401).send("Not logged in");
  }

  // count attempts
  const attemptCount = submissions.filter(
    s => s.name === name && s.task === task
  ).length + 1;

  const entry = {
    id: Date.now() + Math.random(),
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

app.post("/approve/:id", (req, res) => {
  const item = submissions.find(s => s.id == req.params.id);

  if (!item) {
    return res.status(404).send("Submission not found");
  }

  item.status = "approved";
  res.status(200).send("Approved");
});

app.post("/reject/:id", (req, res) => {
  const item = submissions.find(s => s.id == req.params.id);

  if (!item) {
    return res.status(404).send("Submission not found");
  }

  item.status = "rejected";
  res.status(200).send("Rejected");
});

app.get("/reset", (req, res) => {
  const videosDir = path.join(__dirname, "videos");

  // delete all files in videos folder
  fs.readdirSync(videosDir).forEach(file => {
    fs.unlinkSync(path.join(videosDir, file));
  });

  submissions = [];

  console.log("SERVER RESET: all submissions and videos deleted");

  res.send("✅ Reset complete (videos + data cleared)");
});

app.post("/register", async (req, res) => {
  const { name, password } = req.body;

  let users = getUsers();
  const user = users.find(u => u.name === name);

  if (!user) return res.status(400).send("Invalid name");
  if (user.password) return res.status(400).send("Already registered");

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;

  saveUsers(users);

  res.send("Registered");
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  let users = getUsers();
  const user = users.find(u => u.name === name);

  if (!user) return res.status(401).send("Wrong login");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send("Wrong login");

  req.session.user = user.name; // 🔥 IMPORTANT

  res.json({ success: true });
});

app.post("/admin-login", (req, res) => {
  console.log("ADMIN LOGIN BODY:", req.body);

  const { password } = req.body;

  if (password && password.trim() === "WinSkill") {
    res.json({ success: true });
  } else {
    res.status(401).send("Wrong password");
  }
});

app.get("/points", (req, res) => {
  const points = getPoints();
  res.json(points);
});

app.post("/add-points", (req, res) => {
  const name = req.session.user;
  if (!name) return res.status(401).send("Not logged in");

  const { group, amount } = req.body;

  if (!group || typeof amount !== "number") {
    return res.status(400).send("Invalid data");
  }

  const points = getPoints();

  if (!points[group]) points[group] = 0;

  points[group] += amount;

  savePoints(points);

  res.json({ success: true, points: points[group] });
});

app.get("/leaderboard", (req, res) => {
  const points = getPoints();

  // convert object → array and sort
  const sorted = Object.entries(points)
    .map(([group, score]) => ({ group, score }))
    .sort((a, b) => b.score - a.score);

  res.json(sorted);
});

app.post("/admin/start-qte", (req, res) => {
  const { title, duration } = req.body;

  const now = Date.now();

  qteActive = true; // QTE exists (but not active yet)

  qteData = {
    title,
    startAt: now + 15000, // 🔥 ALWAYS 15 sec countdown
    endsAt: null          // ❌ no auto end
  };

  res.json({ success: true, qteData });
});

app.post("/admin/end-qte", (req, res) => {
  qteActive = false;
  qteData = { title: "", endsAt: 0 };

  res.json({ success: true });
});

app.get("/qte-status", (req, res) => {
  res.json({
    active: qteActive,
    data: qteData
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));