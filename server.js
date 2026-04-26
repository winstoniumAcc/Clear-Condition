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

const paths = {
  4: [
    {
      type: "question",
      title: "Task 1",
      text: "I have keys but no locks. What am I?",
      answer: "piano",
      nextLocationHint: "I have a lot of books.",
      nextQR: "CLUE2"
    },
    {
      type: "video",
      title: "Task 2",
      text: "Record yourself running around the field",
      nextLocationHint: "Near the basketball court stairs",
      nextQR: "CLUE2"
    },
    {
      type: "photo",
      title: "Task 3",
      text: "Take a picture of another group's leader",
      nextLocationHint: "Near canteen",
      nextQR: "CLUE2"
    }
  ],
   3: [
    {
      type: "question",
      title: "Task 1",
      text: "I have keys but no locks. What am I?",
      answer: "piano",
      nextLocationHint: "I have a lot of books.",
      nextQR: "CLUE2"
    },
    {
      type: "video",
      title: "Task 2",
      text: "Record yourself running around the field",
      nextLocationHint: "Near the basketball court stairs",
      nextQR: "CLUE2"
    },
    {
      type: "photo",
      title: "Task 3",
      text: "Take a picture of another group's leader",
      nextLocationHint: "Near canteen",
      nextQR: "CLUE2"
    }
  ],
};

let groupProgress = {
  "1": { taskIndex: 0, stage: "task" },
  "2": { taskIndex: 0, stage: "task" },
  "3": { taskIndex: 0, stage: "task" },
  "4": { taskIndex: 0, stage: "task" }
};

let shield = {
  "Group 1": 0,
  "Group 2": 0,
  "Group 3": 0,
  "Group 4": 0
};

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

let qte = {
  active: false,
  countdown: 0,
  endsAt: null,
  title: "Quick Time Event",
};
let qteInterval = null;
let qteTask = null;
let qteStatus = {
  "1": "inactive",
  "2": "inactive",
  "3": "inactive",
  "4": "inactive"
};

const hiddenQRCodes = {
  "HIDDEN1": { type: "Win"},
  "HIDDEN2": { type: "Win"},
  "HIDDEN3": { type: "Win"},
  "HIDDEN4": { type: "Lose"},
  "HIDDEN5": { type: "Lose"},
  "HIDDEN6": { type: "Lose"},
  "HIDDEN7": { type: "Steal"},
  "HIDDEN8": { type: "Steal"},
  "HIDDEN9": { type: "Steal"},
  "HIDDEN10": { type: "Shield"},
  "HIDDEN11": { type: "Shield"},
  "HIDDEN12": { type: "Shield"}
};
const scannedHiddenQR = [];

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
    const ext = path.extname(file.originalname); // 🔥 get .jpg / .png / .webm
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

let submissions = [];

// UPLOAD
app.post("/upload", upload.single("file"), (req, res) => {

  const name = req.session.user;
  if (!name) {
    return res.status(401).send("Not logged in");
  }

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const task = req.body.task;

  const users = getUsers();
  const user = users.find(u => u.name === name);

  if (!user || !user.password) {
    return res.status(401).send("Not logged in");
  }

  submissions = submissions.filter(sub => {

    if (sub.name === name) {

      const filePath = path.join(__dirname, "videos", sub.file);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }

      return false; // remove from array
    }

    return true;
  });

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

app.get("/path", (req, res) => {
  const group = req.query.group;
  res.json(paths[group] || []);
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

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out");
  });
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

app.get("/progress", (req, res) => {
  const group = req.query.group;

  if (!group) {
    return res.status(400).send("Missing group");
  }

  const data = groupProgress[group];

  if (!data) {
    return res.json({
      taskIndex: 0,
      stage: "task"
    });
  }

  res.json({
    taskIndex: data.taskIndex,
    stage: data.stage
  });
});

app.post("/progress/complete-task", (req, res) => {
  const { group } = req.body;

  const prog = groupProgress[group];
  if (!prog) return res.status(400).send("Invalid group");

  prog.stage = "scanner";

  res.json({
    success: true,
    taskIndex: prog.taskIndex,
    stage: prog.stage
  });
});

app.post("/progress/complete-scanner", (req, res) => {
  const { group } = req.body;

  const prog = groupProgress[group];
  if (!prog) return res.status(400).send("Invalid group");

  prog.taskIndex++;
  prog.stage = "task";

  res.json({
    success: true,
    taskIndex: prog.taskIndex,
    stage: prog.stage
  });
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

app.post("/start-qte", (req, res) => {
  const { countdown, activeDuration, title, task } = req.body;

  if (typeof countdown !== "number") {
    return res.status(400).send("Invalid countdown");
  }

  if (qteInterval) clearInterval(qteInterval);

  qte.active = false;
  qte.countdown = countdown;
  qte.endsAt = null;
  qte.title = title || "Quick Time Event";

  qteTask = task;
  qteTask.qte = true;

  if (task.type !== "notification") {
    Object.keys(qteStatus).forEach(g => {
      qteStatus[g] = "inactive";
    });
  }

  qteInterval = setInterval(() => {
    qte.countdown--;

    if (qte.countdown <= 0) {
      clearInterval(qteInterval);

      qte.active = true;

      if (activeDuration) {
        qte.endsAt = Date.now() + activeDuration * 1000;

        setTimeout(() => {
          qte.active = false;
          qte.endsAt = null;
          qteTask = null; // ✅ cleanup
        }, activeDuration * 1000);
      }
    }
  }, 1000);

  res.json({ success: true });
});

app.post("/qte-status/set", (req, res) => {
  const { group, status } = req.body;

  if (!group || !status) {
    return res.status(400).send("Missing data");
  }

  if (!qteStatus[group]) {
    return res.status(400).send("Invalid group");
  }

  qteStatus[group] = status;

  res.json({
    success: true,
    group,
    status
  });
});

app.get("/qte-task", (req, res) => {
  res.json(qteTask);
});

app.get("/qte-status", (req, res) => {
  const group = req.query.group;

  res.json({
    status: qteStatus[group] || "inactive"
  });
});

app.post("/end-qte", (req, res) => {
  qte.active = false;
  qte.countdown = 0;
  qte.endsAt = null;
  qteTask = null;

  if (qteInterval) clearInterval(qteInterval);

  res.json({ success: true });
});

app.get("/qte", (req, res) => {
  res.json(qte);
});

app.post("/scan-hidden-qr", (req, res) => {
  const { group, qr } = req.body;

  if (!group || !qr) {
    return res.status(400).json({ error: "Missing data" });
  }

  const reward = hiddenQRCodes[qr];

  if (!reward) {
    return res.json({ success: false, message: "Not a hidden QR" });
  }

  if (scannedHiddenQR.includes(qr)) {
    return res.json({ success: false, message: "Already claimed by another team" });
  }

  scannedHiddenQR.push(qr);

  const points = getPoints();

  // 🔒 safety init
  if (!points[group]) points[group] = 0;
  if (!shield[group]) shield[group] = 0;

  let message = "";

  // =========================
  // 🎁 WIN (+5 points)
  // =========================
  if (reward.type === "Win") {
    points[group] += 5;
    message = "Your group has gained 5 points!";
  }

  // =========================
  // 💀 LOSE (-5 points, shield blocks)
  // =========================
  if (reward.type === "Lose") {
    if (shield[group] > 0) {
      shield[group]--;
      message = "Blocked by shield! No points lost.";
    } else {
      points[group] -= 5;
      message = "Your group has lost 5 points!";
    }
  }

  // =========================
  // 🕵️ STEAL (2 points from each group)
  // =========================
  if (reward.type === "Steal") {
    let totalStolen = 0;

    Object.keys(points).forEach(g => {
      if (g !== group) {
        const stealAmount = Math.min(2, points[g]);
        points[g] -= stealAmount;
        totalStolen += stealAmount;
      }
    });

    points[group] += totalStolen;
    message = `Stole ${totalStolen} points from all groups!`;
  }

  // =========================
  // 🛡️ SHIELD (+1 shield)
  // =========================
  if (reward.type === "Shield") {
    shield[group] += 1;
    message = "Your group gained 1 shield!";
  }

  savePoints(points);

  res.json({
    success: true,
    type: reward.type,
    message,
    shield: shield[group],
    points: points[group]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));