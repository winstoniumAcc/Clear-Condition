const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// 🔥 ensure videos folder existss
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
  1: [
    {
      nextLocationHint: "Di PPT",
      nextQR: "START"
    },
    {
      type: "question",
      title: "Task 1",
      text: "Apa angka berikutnya: 5, 11, 23, 47, ?",
      answer: "95",
      nextLocationHint: "Greenhouse",
      nextQR: "1CLUE1"
    },
    {
      type: "video",
      title: "Task 2",
      text: "Lari memutari lapangan gor bawah 3x (2 anggota bersamaan)",
      nextLocationHint: "Aula",
      nextQR: "1CLUE2"
    },
    {
      type: "photo",
      title: "Task 3",
      text: "Foto 1 buku fisika, 1 buku geografi, 1 buku inggris (1 anggota memegang 1 buku)",
      nextLocationHint: "Loker",
      nextQR: "1CLUE3"
    },
     {
      type: "puzzle",
      title: "Task 4",
      text: "https://cdn.acidcow.com/pics/20100629/most_popular_imgur_images_45.jpg",
      nextLocationHint: "Bio 1",
      nextQR: "1CLUE4"
    },
    {
      type: "video",
      title: "Task 5",
      text: "Nyanyi lagu balon ku ada lima not nada dasar i",
      nextLocationHint: "Depan tangga",
      nextQR: "1CLUE5"
    },
    {
      type: "question",
      title: "Task 6",
      text: "Aku tidak hidup, tapi aku tumbuh. Aku tidak punya paru-paru, tapi aku butuh udara. Apa aku?",
      answer: "Api",
      nextLocationHint: "Mandarin",
      nextQR: "1CLUE6"
    },
    {
      type: "video",
      title: "Task 7",
      text: "Di gor bawah, setiap anggota tendang bola masuk ke gawang menggunakan kaki tidak dominan dari garis 3 point.",
      nextLocationHint: "GOR",
      nextQR: "1CLUE7"
    },
    {
      type: "photo",
      title: "Task 8",
      text: "Recreate pose couple",
      nextLocationHint: "Perpustakaan",
      nextQR: "1CLUE8"
    },
    {
      type: "video",
      title: "Task 9",
      text: "Bikin yel-yel kelompok",
      nextLocationHint: "Lobby",
      nextQR: "1CLUE9"
    },
    {
      type: "video",
      title: "Task 10",
      text: "Hafalkan semua nama panjang anggota kelompok (1 anggota yg direkam)",
      nextLocationHint: "Mat 2",
      nextQR: "1CLUE10"
    },
    {
      type: "video",
      title: "Task 11",
      text: "Lakukan wall sit selama 30 detik (2 anggota)",
      nextLocationHint: "Ruang OSIS (lt 3)",
      nextQR: "1CLUE11"
    },
     {
      type: "question",
      title: "Task 12",
      text: "Berapakah hasil dari (17 + 11) x 7?",
      answer: "196",
      nextLocationHint: "Senirupa",
      nextQR: "1CLUE12"
    },
    {
      type: "puzzle",
      title: "Task 13",
      text: "https://th.bing.com/th/id/OIP.0FtyAfJpLY16nceqI3gV0QHaE-?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      nextLocationHint: "Lab Kom 1",
      nextQR: "1CLUE13"
    },
     {
      type: "question",
      title: "Task 14",
      text: "Ia selalu di depanmu tapi tak bisa kau lihat?",
      answer: "Masa Depan",
      nextLocationHint: "Aula",
      nextQR: "1CLUE14"
    },
    {
      type: "photo",
      title: "Task 15",
      text: "Foto 3 benda yang berwarna kuning (Dikumpulkan bendanya kemudian di foto)",
      nextLocationHint: "Pingpong",
      nextQR: "1CLUE15"
    },
      {
      type: "video",
      title: "Task 16",
      text: "Lakukan push up 5x bergantian (semua anggota)",
      nextLocationHint: "Koperasi",
      nextQR: "1CLUE16"
    },
     {
      type: "photo",
      title: "Task 17",
      text: "Recreate a meme",
      nextLocationHint: "Drama",
      nextQR: "1CLUE17"
    },
     {
      type: "question",
      title: "Task 18",
      text: "Apa yang punya banyak gigi tapi tak bisa makan/menggigit?",
      answer: "Sisir",
      nextLocationHint: "Uni Corner",
      nextQR: "1CLUE18"
    },
    {
      type: "photo",
      title: "Task 19",
      text: "Foto bersama guru / foto guru dari jauh (tidak mengganggu)",
      nextLocationHint: "Mading (lt 1)",
      nextQR: "1CLUE19"
    },
    {
      type: "puzzle",
      title: "Task 20",
      text: "https://tse2.mm.bing.net/th/id/OIP.GOMXjlgEwY78ICmuAftsFQHaF3?rs=1&pid=ImgDetMain&o=7&rm=3",
      nextLocationHint: "Task sudah habis",
      nextQR: " "
    },
  ],
   2: [
    {
      nextLocationHint: "Di PPT",
      nextQR: "START"
    },
    {
      type: "puzzle",
      title: "Task 1",
      text: "https://cdn.acidcow.com/pics/20100629/most_popular_imgur_images_45.jpg",
      nextLocationHint: "Ekonomi",
      nextQR: "2CLUE1"
    },
    {
      type: "question",
      title: "Task 2",
      text: "Ia selalu di depanmu tapi tak bisa kau lihat?",
      answer: "Masa Depan",
      nextLocationHint: "B.Ing 2",
      nextQR: "2CLUE2"
    },
     {
      type: "photo",
      title: "Task 3",
      text: "Foto bersama guru / foto guru dari jauh (tidak mengganggu)",
      nextLocationHint: "Mulmed",
      nextQR: "2CLUE3"
    },
    {
      type: "video",
      title: "Task 4",
      text: "Lakukan jumping jacks 25x (Semua anggota melakukan sambil berhitung)",
      nextLocationHint: "Kimia 2",
      nextQR: "2CLUE4"
    },
     {
      type: "photo",
      title: "Task 5",
      text: "Pegang 10 buku dalam 1 tangan",
      nextLocationHint: "B.Indo 2",
      nextQR: "2CLUE5"
    },
    {
      type: "video",
      title: "Task 6",
      text: "Di gor bawah, setiap anggota tendang bola masuk ke gawang menggunakan kaki tidak dominan dari garis 3 point.",
      nextLocationHint: "Sosiologi",
      nextQR: "2CLUE6"
    },
    {
      type: "video",
      title: "Task 7",
      text: "Bikin yel-yel kelompok",
      nextLocationHint: "Loker depan perpus",
      nextQR: "2CLUE7"
    },
    {
      type: "question",
      title: "Task 8",
      text: "Berapakah hasil dari (17 + 11) x 7?",
      answer: "196",
      nextLocationHint: "Mat 1",
      nextQR: "2CLUE8"
    },
     {
      type: "puzzle",
      title: "Task 9",
      text: "https://th.bing.com/th/id/OIP.0FtyAfJpLY16nceqI3gV0QHaE-?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      nextLocationHint: "Geografi",
      nextQR: "2CLUE9"
    },
     {
      type: "video",
      title: "Task 10",
      text: "Lakukan wall sit selama 30 detik (2 anggota)",
      nextLocationHint: "Aula",
      nextQR: "2CLUE10"
    },
     {
      type: "question",
      title: "Task 11",
      text: "Apa angka berikutnya: 5, 11, 23, 47, ?",
      answer: "95",
      nextLocationHint: "KWN",
      nextQR: "2CLUE11"
    },
       {
      type: "photo",
      title: "Task 12",
      text: "Recreate pose couple",
      nextLocationHint: "Bio 2",
      nextQR: "2CLUE12"
    },
      {
      type: "video",
      title: "Task 13",
      text: "Hafalkan semua nama panjang anggota kelompok (1 anggota yg direkam)",
      nextLocationHint: "Geografi",
      nextQR: "2CLUE13"
    },
    {
      type: "video",
      title: "Task 14",
      text: "Lari memutari lapangan gor bawah 3x (2 anggota bersamaan)",
      nextLocationHint: "Agama 2",
      nextQR: "2CLUE14"
    },
    {
      type: "puzzle",
      title: "Task 15",
      text: "https://tse2.mm.bing.net/th/id/OIP.GOMXjlgEwY78ICmuAftsFQHaF3?rs=1&pid=ImgDetMain&o=7&rm=3",
      nextLocationHint: "Koperasi",
      nextQR: "2CLUE15"
    },
    {
      type: "question",
      title: "Task 16",
      text: "Aku tidak hidup, tapi aku tumbuh. Aku tidak punya paru-paru, tapi aku butuh udara. Apa aku?",
      answer: "Api",
      nextLocationHint: "Mat 1",
      nextQR: "2CLUE16"
    },
     {
      type: "photo",
      title: "Task 17",
      text: "Foto 3 benda yang berwarna kuning (Dikumpulkan bendanya kemudian di foto)",
      nextLocationHint: "Lab Kom 2",
      nextQR: "2CLUE17"
    },
      {
      type: "photo",
      title: "Task 18",
      text: "Recreate a meme",
      nextLocationHint: "Lab Kom 3",
      nextQR: "2CLUE18"
    },
     {
      type: "photo",
      title: "Task 19",
      text: "Foto 1 buku sejarah, 1 buku inggris, 1 buku ekonomi (1 anggota memegang 1 buku)",
      nextLocationHint: "B.Ing 2",
      nextQR: "2CLUE19"
    },
        {
      type: "question",
      title: "Task 20",
      text: "Apa yang punya banyak gigi tapi tak bisa makan/menggigit?",
      answer: "Sisir",
      nextLocationHint: "Task sudah habis",
      nextQR: " "
    },
  ],
  3: [
     {
      type: "photo",
      title: "Task 1",
      text: "Foto 1 buku sejarah, 1 buku inggris, 1 buku ekonomi (1 anggota memegang 1 buku)",
      nextLocationHint: "Geografi",
      nextQR: "3CLUE1"
    },
    {
      type: "puzzle",
      title: "Task 2",
      text: "https://th.bing.com/th/id/OIP.0FtyAfJpLY16nceqI3gV0QHaE-?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      nextLocationHint: "Aula",
      nextQR: "3CLUE2"
    },
    {
      type: "video",
      title: "Task 3",
      text: "Lakukan push up 5x bergantian (semua anggota)",
      nextLocationHint: "Kolam Ikan",
      nextQR: "3CLUE3"
    },
    {
      type: "question",
      title: "Task 4",
      text: "Berapakah hasil dari (17 + 11) x 7?",
      answer: "196",
      nextLocationHint: "Bio 2",
      nextQR: "3CLUE4"
    },
    {
      type: "question",
      title: "Task 5",
      text: "Apa yang punya banyak gigi tapi tak bisa makan/menggigit?",
      answer: "Sisir",
      nextLocationHint: "Lab Kimia",
      nextQR: "3CLUE5"
    },
    {
      type: "photo",
      title: "Task 6",
      text: "Foto 3 benda yang berwarna kuning (Dikumpulkan bendanya kemudian di foto)",
      nextLocationHint: "Tata Usaha",
      nextQR: "3CLUE6"
    },
    {
      type: "video",
      title: "Task 7",
      text: "Lari memutari lapangan gor bawah 3x (2 anggota bersamaan)",
      nextLocationHint: "Sosiologi",
      nextQR: "3CLUE7"
    },
    {
      type: "video",
      title: "Task 8",
      text: "Nyanyi lagu balon ku ada lima not nada dasar u",
      nextLocationHint: "Loker",
      nextQR: "3CLUE8"
    },
      {
      type: "photo",
      title: "Task 9",
      text: "Recreate a meme",
      nextLocationHint: "Drama",
      nextQR: "3CLUE9"
    },
      {
      type: "video",
      title: "Task 10",
      text: "Lakukan wall sit selama 30 detik (2 anggota)",
      nextLocationHint: "Agama 2",
      nextQR: "3CLUE10"
    },
    {
      type: "photo",
      title: "Task 11",
      text: "Foto bersama guru / foto guru dari jauh (tidak mengganggu)",
      nextLocationHint: "Greenhouse",
      nextQR: "3CLUE11"
    },
    {
      type: "question",
      title: "Task 12",
      text: "Ia selalu di depanmu tapi tak bisa kau lihat?",
      answer: "masa depan",
      nextLocationHint: "Mading (lt 2)",
      nextQR: "3CLUE12"
    },
    {
      type: "photo",
      title: "Task 13",
      text: "Recreate pose couple (tanpa harus couple beneran)",
      nextLocationHint: "Kimia 2",
      nextQR: "3CLUE13"
    },
    {
      type: "video",
      title: "Task 14",
      text: "Hafalkan semua nama panjang anggota kelompok (1 anggota yg direkam)",
      nextLocationHint: "B.Indo 1",
      nextQR: "3CLUE14"
    },
    {
      type: "photo",
      title: "Task 15",
      text: "Group photo dengan pose kreatif (bebas gaya)",
      nextLocationHint: "Loker",
      nextQR: "3CLUE15"
    },
    {
      type: "question",
      title: "Task 16",
      text: "Apa angka berikutnya: 5, 11, 23, 47, ?",
      answer: "95",
      nextLocationHint: "Perpus",
      nextQR: "3CLUE16"
    },
    {
      type: "video",
      title: "Task 17",
      text: "Bikin yel-yel kelompok",
      nextLocationHint: "Drama",
      nextQR: "3CLUE17"
    },
    {
      type: "photo",
      title: "Task 18",
      text: "Foto 1 buku fisika, 1 buku geografi, 1 buku inggris (1 anggota memegang 1 buku)",
      nextLocationHint: "Loker depan perpus",
      nextQR: "3CLUE18"
    },
    {
      type: "video",
      title: "Task 19",
      text: "Tendang bola ke gawang dengan kaki tidak dominan dari jarak jauh",
      nextLocationHint: "Sosiologi",
      nextQR: "3CLUE19"
    },
    {
      type: "puzzle",
      title: "Task 20",
      text: "https://cdn.acidcow.com/pics/20100629/most_popular_imgur_images_45.jpg",
      nextLocationHint: "Task sudah habis",
      nextQR: ""
    }
  ]
};

let groupProgress = {
  "1": { taskIndex: 0, stage: "scanner" },
  "2": { taskIndex: 0, stage: "scanner" },
  "3": { taskIndex: 0, stage: "scanner" }
};

let shield = {
  "Group 1": 0,
  "Group 2": 0,
  "Group 3": 0,
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
  "HIDDEN1": "Win",
  "HIDDEN2": "Win",
  "HIDDEN3": "Win",
  "HIDDEN4": "Lose",
  "HIDDEN5": "Lose",
  "HIDDEN6": "Lose",
  "HIDDEN7": "Steal",
  "HIDDEN8": "Steal",
  "HIDDEN9": "Steal",
  "HIDDEN10": "Shield",
  "HIDDEN11": "Shield",
  "HIDDEN12": "Shield"
};
const scannedHiddenQR = {};

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
    status: "pending",
    time: Date.now()
  };

  submissions.push(entry);
  res.sendStatus(200);
});

// GET ALL
app.get("/submissions", (req, res) => {

  submissions = submissions.filter(sub => {
    const filePath = path.join(__dirname, "videos", sub.file);
    return fs.existsSync(filePath);
  });

  const sorted = [...submissions].sort((a, b) => a.time - b.time);

  res.json(sorted);
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

  if (scannedHiddenQR[qr]) {
    return res.json({ success: false, message: "Already claimed" });
  }

  scannedHiddenQR[qr] = true;

  const points = getPoints();

  let message = "";

  // =========================
  // 🎁 WIN (+5 points)
  // =========================
  if (reward === "Win") {
    points[group] += 5;
    message = "Your group has gained 5 points!";
  }

  // =========================
  // 💀 LOSE (-5 points, shield blocks)
  // =========================
  if (reward === "Lose") {
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
  if (reward === "Steal") {
    let totalStolen = 0;

    Object.keys(points).forEach(g => {
      if (g !== group) {

        let stealAmount = 2;

        // 🛡️ shield blocks steal first
        if (shield[g] > 0) {
          shield[g]--;
          stealAmount = 0; // blocked completely
        }

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
  if (reward === "Shield") {
    shield[group] += 1;
    message = "Your group gained 1 shield!";
  }

  savePoints(points);

  res.json({
    success: true,
    type: reward,
    message,
    shield: shield[group],
    points: points[group]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));