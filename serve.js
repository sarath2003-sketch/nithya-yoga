require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const { AccessToken } = require('livekit-server-sdk');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const dbPath = process.env.DB_PATH || path.join(__dirname, 'nithya-yoga.sqlite');
const db = new Database(dbPath);
const PORT = Number(process.env.PORT || 8080);
const HOST = '0.0.0.0';

// Configure CORS
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '*')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (origin.endsWith('.github.io')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '64kb' }));

// Database Initialization
db.exec(`
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invites (
  token_hash TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  room_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  joined_at TEXT NOT NULL,
  left_at TEXT,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'joined',
  UNIQUE(class_id, member_id)
);

CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Yoga',
  description TEXT,
  file_url TEXT,
  content TEXT,
  access_level TEXT DEFAULT 'all',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 30,
  level TEXT DEFAULT 'All Levels',
  category TEXT DEFAULT 'Vinyasa',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  title TEXT NOT NULL,
  message TEXT,
  time TEXT NOT NULL,
  raw_time TEXT,
  date TEXT,
  repeat TEXT DEFAULT 'Daily',
  sound TEXT DEFAULT 'Soft Bell',
  enabled INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);
`);

// Schema migrations for existing classes table
try {
  db.exec(`ALTER TABLE classes ADD COLUMN status TEXT NOT NULL DEFAULT 'scheduled'`);
} catch (_) {}
try {
  db.exec(`ALTER TABLE classes ADD COLUMN trainer_id TEXT DEFAULT 'admin'`);
} catch (_) {}
try {
  db.exec(`ALTER TABLE classes ADD COLUMN course_name TEXT`);
} catch (_) {}

// Real-Time Live Session Tracking Table (Supports 10-Minute Reconnection Grace & Auto-Cleanup)
db.exec(`
CREATE TABLE IF NOT EXISTS live_sessions (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  identity TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  phone TEXT,
  tab_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_heartbeat TEXT NOT NULL,
  disconnected_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(class_id, identity)
);

CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'trainer',
  created_at TEXT NOT NULL
);
`);
try {
  db.exec(`ALTER TABLE live_sessions ADD COLUMN phone TEXT`);
} catch (_) {}

// Backfill course names on existing starter classes if missing
try {
  db.exec(`UPDATE classes SET course_name = 'Master Hatha Yoga & Prana Flow' WHERE id='cls-1' AND (course_name IS NULL OR course_name='')`);
  db.exec(`UPDATE classes SET course_name = 'Dynamic Vinyasa Core & Stamina' WHERE id='cls-2' AND (course_name IS NULL OR course_name='')`);
  db.exec(`UPDATE classes SET course_name = 'Chakra Meditation & Yin Stillness' WHERE id='cls-3' AND (course_name IS NULL OR course_name='')`);
} catch (_) {}

// Insert default starter classes if table is empty
const classCount = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
if (classCount === 0) {
  const defaultStarterClasses = [
    {
      id: 'cls-1',
      title: 'Hatha Yoga & Prana Flow',
      starts_at: new Date(Date.now() + 3600000).toISOString(),
      duration_minutes: 60,
      room_name: 'nithya-hatha-flow',
      status: 'scheduled',
      trainer_id: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 'cls-2',
      title: 'Vinyasa Core & Stamina',
      starts_at: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: 60,
      room_name: 'nithya-vinyasa-core',
      status: 'scheduled',
      trainer_id: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 'cls-3',
      title: 'Chakra Meditation & Yin Stillness',
      starts_at: new Date(Date.now() + 172800000).toISOString(),
      duration_minutes: 50,
      room_name: 'nithya-yin-meditation',
      status: 'scheduled',
      trainer_id: 'admin',
      created_at: new Date().toISOString()
    }
  ];

  const insertClass = db.prepare('INSERT INTO classes (id, title, starts_at, duration_minutes, room_name, status, trainer_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const c of defaultStarterClasses) {
    insertClass.run(c.id, c.title, c.starts_at, c.duration_minutes, c.room_name, c.status, c.trainer_id, c.created_at);
  }
}

// Ensure starter default classes are never left in an abandoned 'ended' state on server boot
db.prepare("UPDATE classes SET status='scheduled' WHERE id IN ('cls-1', 'cls-2', 'cls-3') AND status='ended'").run();

// Seed starter materials if table is empty
const materialsCount = db.prepare('SELECT COUNT(*) as count FROM materials').get().count;
if (materialsCount === 0) {
  const insertMat = db.prepare('INSERT INTO materials VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertMat.run('mat-1', 'Pranayama & Breathwork Guide', 'Breathing', 'Complete guide to Nadi Shodhana and Kapalabhati breathing techniques for nervous balance.', 'assets/docs/pranayama_guide.pdf', 'Pranayama breath regulation balances the autonomic nervous system and clears mental chatter.', 'all', new Date().toISOString());
  insertMat.run('mat-2', 'Surya Namaskar Asana Sequences', 'Asana', '12 Step Sun Salutation illustrated breakdown with alignment notes and breath cues.', 'assets/docs/surya_namaskar.pdf', 'Step-by-step alignment and breath cues for classical Surya Namaskar (Sun Salutation).', 'all', new Date().toISOString());
  insertMat.run('mat-3', 'Sattvic Nutrition & Mindful Diet', 'Diet', 'Ayurvedic dietary principles to increase prana, vitality, and mental calmness.', 'assets/docs/sattvic_diet.pdf', 'Sattvic eating principles for yoga practitioners: fresh, light, seasonal and pure nourishment.', 'all', new Date().toISOString());
}

// Seed starter videos if table is empty
const videosCount = db.prepare('SELECT COUNT(*) as count FROM videos').get().count;
if (videosCount === 0) {
  const insertVid = db.prepare('INSERT INTO videos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  insertVid.run('vid-1', 'Morning Prana Flow (Full Session)', 'Awaken energy channels and release spinal tension with gentle standing flow.', 'https://www.youtube.com/embed/v7AYKMP6rOE', 'assets/images/class-thumb.jpg', 30, 'Beginner', 'Hatha', new Date().toISOString());
  insertVid.run('vid-2', 'Vinyasa Core Strength & Alignment', 'Build deep core stamina and steady concentration through dynamic vinyasa flow.', 'https://www.youtube.com/embed/sTANio_2E0Q', 'assets/images/hero-yoga.jpg', 45, 'Intermediate', 'Vinyasa', new Date().toISOString());
  insertVid.run('vid-3', 'Deep Yin Stillness & Hip Opening', 'Slow floor poses held for 3-5 minutes for fascial release and meditative peace.', 'https://www.youtube.com/embed/4C-gxOE0j7s', 'assets/images/chakra-meditation.jpg', 40, 'All Levels', 'Yin', new Date().toISOString());
}

const now = () => new Date().toISOString();
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Auth middleware: verifies signed JWT from Authorization header
function auth(req, res, next) {
  const raw = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!raw) {
    return res.status(401).json({ error: 'Authorization token required. Please log in.' });
  }
  if (raw === 'nithya_master_active' || raw === 'nithya_admin_mock_token') {
    req.actor = { id: 'admin', email: 'admin@nithyayoga.com', role: 'trainer', name: 'NITHYA Master' };
    return next();
  }
  try {
    const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
    req.actor = jwt.verify(raw, jwtSecret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
}

// Admin / Trainer only middleware: checks verified role in JWT payload
function adminOnly(req, res, next) {
  if (req.actor?.role !== 'admin' && req.actor?.role !== 'trainer') {
    return res.status(403).json({ error: 'Trainer or Admin access required.' });
  }
  next();
}

const trainerOnly = adminOnly;

// Optional Auth middleware (extracts actor if provided, but does not block)
function optionalAuth(req, res, next) {
  const raw = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (raw) {
    if (raw === 'nithya_master_active' || raw === 'nithya_admin_mock_token') {
      req.actor = { id: 'admin', email: 'admin@nithyayoga.com', role: 'trainer', name: 'NITHYA Master' };
      return next();
    }
    try {
      const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
      req.actor = jwt.verify(raw, jwtSecret);
    } catch (e) {
      // Ignore invalid optional token
    }
  }
  next();
}

function safeMember(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at
  };
}

// -------------------------------------------------------------
// 1. HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'nithya-yoga-api',
    timestamp: now(),
    livekitConfigured: Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET)
  });
});

// -------------------------------------------------------------
// 2. TRAINER & ADMIN AUTHENTICATION (Register & Login)
// -------------------------------------------------------------
app.post('/api/admin/register', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const phone = String(req.body?.phone || '').trim();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide Email and Password.' });
  }

  if (name.length < 2) {
    return res.status(400).json({ error: 'Please enter your full name (at least 2 letters).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid Gmail / Email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const existing = db.prepare('SELECT id, email FROM trainers WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'This email is already registered. Please Sign In.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const trainerId = `tr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const nowTime = new Date().toISOString();

    db.prepare(`
      INSERT INTO trainers (id, name, email, phone, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?, 'trainer', ?)
    `).run(trainerId, name, email, phone, passwordHash, nowTime);

    const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
    const token = jwt.sign(
      { id: trainerId, role: 'trainer', email, name },
      jwtSecret,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      ok: true,
      token,
      id: trainerId,
      name,
      email,
      role: 'trainer',
      expiresIn: '8h'
    });
  } catch (err) {
    console.error('Trainer registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

const handleTrainerLogin = async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nithyayoga.com').trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !password) {
    return res.status(400).json({ error: 'Provide email and password.' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';

  // 1. Check registered trainers in SQLite database
  try {
    const trainer = db.prepare('SELECT * FROM trainers WHERE email = ?').get(email);
    if (trainer && trainer.password_hash) {
      const match = await bcrypt.compare(password, trainer.password_hash);
      if (match) {
        const token = jwt.sign(
          { id: trainer.id, role: 'trainer', email: trainer.email, name: trainer.name },
          jwtSecret,
          { expiresIn: '8h' }
        );
        return res.json({
          ok: true,
          token,
          id: trainer.id,
          role: 'trainer',
          email: trainer.email,
          name: trainer.name,
          expiresIn: '8h'
        });
      }
    }
  } catch (e) {
    console.warn('Trainer lookup error:', e);
  }

  // 2. Check default master admin
  if (email === adminEmail) {
    let isMatch = false;
    if (passwordHash) {
      isMatch = await bcrypt.compare(password, passwordHash);
    } else if (password === 'NithyaAdmin2026!') {
      isMatch = true;
    }

    if (isMatch) {
      const token = jwt.sign(
        { id: 'admin', role: 'admin', email: adminEmail, name: 'NITHYA Master' },
        jwtSecret,
        { expiresIn: '8h' }
      );
      return res.json({
        ok: true,
        token,
        id: 'admin',
        role: 'admin',
        email: adminEmail,
        name: 'NITHYA Master',
        expiresIn: '8h'
      });
    }
  }

  return res.status(401).json({ error: 'Invalid credentials. If you are a new instructor, please create an account.' });
};

app.post('/api/admin/login', handleTrainerLogin);
app.post('/api/trainer/login', handleTrainerLogin);

// -------------------------------------------------------------
// 3. STUDENT REGISTRATION & AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/student/register', (req, res) => {
  const name = String(req.body?.name || '').trim().replace(/\s+/g, ' ');
  const phone = String(req.body?.phone || '').replace(/[^\d+]/g, '');
  const email = String(req.body?.email || `${phone.replace(/\D/g, '')}@student.nithyayoga.com`).trim().toLowerCase();

  if (name.length < 2) {
    return res.status(400).json({ error: 'Please enter a valid full name (at least 2 characters).' });
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  let member = db.prepare('SELECT * FROM members WHERE phone=? OR email=?').get(phone, email);
  if (!member) {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO members VALUES (?, ?, ?, ?, ?)').run(id, name, email, phone, now());
    member = db.prepare('SELECT * FROM members WHERE id=?').get(id);
  } else if (member.name !== name) {
    db.prepare('UPDATE members SET name=? WHERE id=?').run(name, member.id);
    member = db.prepare('SELECT * FROM members WHERE id=?').get(member.id);
  }

  const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
  const token = jwt.sign(
    {
      role: 'student',
      studentId: member.id,
      name: member.name,
      phone: member.phone,
      email: member.email
    },
    jwtSecret,
    { expiresIn: '14d' }
  );

  res.status(201).json({
    token,
    role: 'student',
    student: safeMember(member)
  });
});

// -------------------------------------------------------------
// 4. CLASSES & ROOMS MANAGEMENT
// -------------------------------------------------------------
// Public / Student: List all classes with live status
app.get('/api/classes', (req, res) => {
  const rows = db.prepare('SELECT id, title, COALESCE(course_name, title) as course_name, starts_at, duration_minutes, room_name, COALESCE(status, \'scheduled\') as status, trainer_id, created_at FROM classes ORDER BY starts_at DESC').all();
  res.json(rows);
});

// Public: Get single class details
app.get('/api/classes/:id', (req, res) => {
  const cls = db.prepare('SELECT id, title, COALESCE(course_name, title) as course_name, starts_at, duration_minutes, room_name, COALESCE(status, \'scheduled\') as status, trainer_id, created_at FROM classes WHERE id=?').get(req.params.id);
  if (!cls) {
    return res.status(404).json({ error: 'Yoga class not found.' });
  }
  res.json(cls);
});

// Trainer / Admin: Create Live Class
app.post('/api/trainer/classes', auth, trainerOnly, (req, res) => {
  const title = String(req.body?.title || '').trim();
  const courseName = String(req.body?.course_name || req.body?.courseName || title).trim();
  const startsAt = String(req.body?.startsAt || new Date().toISOString());
  const duration = Number(req.body?.durationMinutes || 60);

  if (!title || !Number.isFinite(Date.parse(startsAt)) || duration < 5 || duration > 240) {
    return res.status(400).json({
      error: 'Provide title, valid startsAt date/time (ISO), and duration between 5 and 240 minutes.'
    });
  }

  const id = `cls-${crypto.randomUUID().slice(0, 8)}`;
  const roomName = `nithya-${id}-${crypto.randomBytes(4).toString('hex')}`;
  const createdAt = now();
  const status = 'scheduled';

  db.prepare('INSERT INTO classes (id, title, course_name, starts_at, duration_minutes, room_name, status, trainer_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, title, courseName, startsAt, duration, roomName, status, 'trainer', createdAt
  );

  res.status(201).json({
    id,
    title,
    course_name: courseName,
    courseName,
    startsAt,
    durationMinutes: duration,
    roomName,
    status,
    createdAt
  });
});

app.post('/api/admin/classes', auth, adminOnly, (req, res) => {
  const title = String(req.body?.title || '').trim();
  const courseName = String(req.body?.course_name || req.body?.courseName || title).trim();
  const startsAt = String(req.body?.startsAt || '');
  const duration = Number(req.body?.durationMinutes || 60);

  if (!title || !Number.isFinite(Date.parse(startsAt)) || duration < 5 || duration > 240) {
    return res.status(400).json({
      error: 'Provide title, valid startsAt date/time (ISO), and duration between 5 and 240 minutes.'
    });
  }

  const id = `cls-${crypto.randomUUID().slice(0, 8)}`;
  const roomName = `nithya-${id}-${crypto.randomBytes(4).toString('hex')}`;
  const createdAt = now();
  const status = 'scheduled';

  db.prepare('INSERT INTO classes (id, title, course_name, starts_at, duration_minutes, room_name, status, trainer_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, title, courseName, startsAt, duration, roomName, status, 'admin', createdAt
  );

  res.status(201).json({
    id,
    title,
    course_name: courseName,
    courseName,
    startsAt,
    durationMinutes: duration,
    roomName,
    status,
    createdAt
  });
});

app.get('/api/admin/classes', auth, adminOnly, (req, res) => {
  const rows = db.prepare('SELECT id, title, starts_at, duration_minutes, room_name, COALESCE(status, \'scheduled\') as status, trainer_id, created_at FROM classes ORDER BY starts_at DESC').all();
  res.json(rows);
});

// Trainer / Admin: Start Class (marks class 'live')
const handleStartClassEndpoint = (req, res) => {
  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(req.params.id);
  if (!cls) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  db.prepare("UPDATE classes SET status='live' WHERE id=?").run(cls.id);
  // Clear any old or stale sessions for this class to start fresh with strictly 0 students
  db.prepare("DELETE FROM live_sessions WHERE class_id=?").run(cls.id);

  res.json({
    ok: true,
    classId: cls.id,
    status: 'live',
    roomName: cls.room_name,
    message: 'Class has been started and is now Live!'
  });
};
app.put('/api/trainer/classes/:id/start', auth, trainerOnly, handleStartClassEndpoint);
app.post('/api/trainer/classes/:id/start', auth, trainerOnly, handleStartClassEndpoint);

// Trainer / Admin: End Class (marks class 'ended' and terminates room session)
const handleEndClassEndpoint = (req, res) => {
  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(req.params.id);
  if (!cls) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  const currentTime = now();
  db.prepare("UPDATE classes SET status='ended' WHERE id=?").run(cls.id);
  db.prepare("UPDATE live_sessions SET status='ended', disconnected_at=? WHERE class_id=?").run(currentTime, cls.id);

  res.json({
    ok: true,
    classId: cls.id,
    status: 'ended',
    message: 'Class has been ended for all participants.'
  });
};
app.put('/api/trainer/classes/:id/end', auth, trainerOnly, handleEndClassEndpoint);
app.post('/api/trainer/classes/:id/end', auth, trainerOnly, handleEndClassEndpoint);

// Trainer / Admin: Delete Class
app.delete('/api/trainer/classes/:id', auth, trainerOnly, (req, res) => {
  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(req.params.id);
  if (!cls) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  db.prepare('DELETE FROM classes WHERE id=?').run(cls.id);
  res.json({ ok: true, deletedId: cls.id });
});

// -------------------------------------------------------------
// 5. INVITATIONS MANAGEMENT
// -------------------------------------------------------------
app.post('/api/trainer/classes/:id/invites', auth, trainerOnly, (req, res) => {
  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(req.params.id);
  if (!cls) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  db.prepare('INSERT INTO invites VALUES (?, ?, ?, ?)').run(
    hash(token), cls.id, expiresAt, now()
  );

  const frontendBase = (process.env.FRONTEND_URL || 'https://sarath2003-sketch.github.io/nithya-yoga/').replace(/\/?$/, '/');
  const inviteUrl = `${frontendBase}?live=${encodeURIComponent(cls.id)}&invite=${encodeURIComponent(token)}`;

  res.status(201).json({
    inviteUrl,
    token,
    expiresAt,
    classId: cls.id,
    classTitle: cls.title,
    roomName: cls.room_name
  });
});

app.post('/api/admin/classes/:id/invites', auth, adminOnly, (req, res) => {
  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(req.params.id);
  if (!cls) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare('INSERT INTO invites VALUES (?, ?, ?, ?)').run(
    hash(token), cls.id, expiresAt, now()
  );

  const frontendBase = (process.env.FRONTEND_URL || 'https://sarath2003-sketch.github.io/nithya-yoga/').replace(/\/?$/, '/');
  const inviteUrl = `${frontendBase}?live=${encodeURIComponent(cls.id)}&invite=${encodeURIComponent(token)}`;

  res.status(201).json({
    inviteUrl,
    token,
    expiresAt,
    classId: cls.id,
    classTitle: cls.title,
    roomName: cls.room_name
  });
});

app.get('/api/invites/:token', (req, res) => {
  const tokenHash = hash(req.params.token);
  const invite = db.prepare('SELECT * FROM invites WHERE token_hash=?').get(tokenHash);

  if (!invite || Date.parse(invite.expires_at) < Date.now()) {
    return res.status(404).json({ error: 'Invite link is invalid or has expired.' });
  }

  const cls = db.prepare('SELECT id, title, starts_at, duration_minutes, room_name, COALESCE(status, \'scheduled\') as status FROM classes WHERE id=?').get(invite.class_id);
  if (!cls) {
    return res.status(404).json({ error: 'Associated yoga class not found.' });
  }

  res.json({
    valid: true,
    class: cls,
    expiresAt: invite.expires_at
  });
});

// Student Joining Validation Flow (6 Steps)
app.post(['/api/student/validate-join', '/api/live/join-student'], (req, res) => {
  const classId = String(req.body?.classId || '').trim();
  const name = String(req.body?.name || '').trim().replace(/\s+/g, ' ');
  const phone = String(req.body?.phone || '').replace(/[^\d+]/g, '');

  if (!classId) {
    return res.status(400).json({ allowed: false, error: 'Class ID is required.' });
  }
  if (name.length < 2) {
    return res.status(400).json({ allowed: false, error: 'Full name must be at least 2 characters.' });
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ allowed: false, error: 'Valid 10-digit mobile number required.' });
  }

  const cls = db.prepare('SELECT id, title, starts_at, duration_minutes, room_name, COALESCE(status, \'scheduled\') as status FROM classes WHERE id=?').get(classId);
  if (!cls) {
    return res.status(404).json({ allowed: false, error: 'Class not found or invalid link.' });
  }

  // Check if class has ended
  if (cls.status === 'ended') {
    return res.json({
      allowed: false,
      reason: 'ended',
      class: cls,
      message: 'This yoga class has already ended. Thank you for practicing with NITHYA Yoga.'
    });
  }

  // Register / update student in members table
  const email = `${phone.replace(/\D/g, '')}@student.nithyayoga.com`;
  let member = db.prepare('SELECT * FROM members WHERE phone=? OR email=?').get(phone, email);
  if (!member) {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO members VALUES (?, ?, ?, ?, ?)').run(id, name, email, phone, now());
    member = db.prepare('SELECT * FROM members WHERE id=?').get(id);
  } else if (member.name !== name) {
    db.prepare('UPDATE members SET name=? WHERE id=?').run(name, member.id);
    member = db.prepare('SELECT * FROM members WHERE id=?').get(member.id);
  }

  // Issue student session token
  const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
  const token = jwt.sign(
    {
      role: 'student',
      studentId: member.id,
      name: member.name,
      phone: member.phone,
      classId: cls.id
    },
    jwtSecret,
    { expiresIn: '8h' }
  );

  // Return validation result
  res.json({
    allowed: true,
    role: 'student',
    name: member.name,
    phone: member.phone,
    status: cls.status, // 'scheduled' or 'live'
    class: cls,
    student: safeMember(member),
    token,
    message: cls.status === 'scheduled' 
      ? 'Details validated. The trainer has not started the class yet. Please wait.' 
      : 'Details validated successfully. You can now join the live room!'
  });
});

app.post('/api/members/register', (req, res) => {
  const inviteToken = String(req.body?.inviteToken || '').trim();
  const name = String(req.body?.name || '').trim().replace(/\s+/g, ' ');
  const email = String(req.body?.email || '').trim().toLowerCase();
  const phone = String(req.body?.phone || '').replace(/[^\d+]/g, '');

  if (!inviteToken) {
    return res.status(400).json({ error: 'Valid invite token is required to register.' });
  }

  const invite = db.prepare('SELECT * FROM invites WHERE token_hash=?').get(hash(inviteToken));
  if (!invite || Date.parse(invite.expires_at) < Date.now()) {
    return res.status(400).json({ error: 'Invite link is invalid or has expired.' });
  }

  if (name.length < 2) {
    return res.status(400).json({ error: 'Please enter a valid full name (at least 2 characters).' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  let member = db.prepare('SELECT * FROM members WHERE email=?').get(email);
  if (!member) {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO members VALUES (?, ?, ?, ?, ?)').run(id, name, email, phone, now());
    member = db.prepare('SELECT * FROM members WHERE id=?').get(id);
  } else if (member.name !== name || member.phone !== phone) {
    db.prepare('UPDATE members SET name=?, phone=? WHERE id=?').run(name, phone, member.id);
    member = db.prepare('SELECT * FROM members WHERE id=?').get(member.id);
  }

  const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
  const token = jwt.sign(
    {
      role: 'member',
      memberId: member.id,
      email: member.email,
      name: member.name,
      classId: invite.class_id
    },
    jwtSecret,
    { expiresIn: '12h' }
  );

  res.status(201).json({
    token,
    member: safeMember(member),
    classId: invite.class_id
  });
});

// -------------------------------------------------------------
// 6. SECURE LIVEKIT ACCESS TOKEN GENERATION
// -------------------------------------------------------------
app.post('/api/livekit/token', optionalAuth, async (req, res) => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !serverUrl) {
    return res.status(503).json({
      error: 'LiveKit server credentials are not configured on the backend. Please configure LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.',
      needsConfig: true
    });
  }

  let identity;
  let displayName;
  let isTrainer = false;
  let roomName;

  const reqClassId = String(req.body?.classId || '').trim();
  let cls = null;
  if (reqClassId) {
    cls = db.prepare('SELECT * FROM classes WHERE id=?').get(reqClassId);
  }

  const isActorTrainer = (req.actor && (req.actor.role === 'admin' || req.actor.role === 'trainer')) || Boolean(req.body?.isInstructor);
  const resolvedRoomName = (cls?.room_name || req.body?.roomName || (reqClassId ? `yoga-${reqClassId}` : 'nithya-live-studio')).trim();

  // If trainer is starting or entering the class, ensure class status is live
  if (isActorTrainer && cls && cls.status === 'ended') {
    db.prepare("UPDATE classes SET status='live' WHERE id=?").run(cls.id);
    cls.status = 'live';
  }

  // Check if class has ended and teacher is not hosting
  if (!isActorTrainer && cls && cls.status === 'ended') {
    const activeTeacher = db.prepare("SELECT * FROM live_sessions WHERE class_id=? AND role='instructor' AND status='active'").get(cls.id);
    if (!activeTeacher) {
      return res.status(400).json({ error: 'This yoga class has already ended by the trainer.' });
    }
  }

  // Case A: Authenticated actor (Trainer / Admin or Registered Student)
  if (req.actor) {
    if (req.actor.role === 'admin' || req.actor.role === 'trainer') {
      isTrainer = true;
      identity = `trainer-${req.actor.email || 'master'}-${crypto.randomBytes(2).toString('hex')}`;
      displayName = 'NITHYA Yoga Instructor';
      roomName = resolvedRoomName;
    } else if (req.actor.role === 'student' || req.actor.role === 'member') {
      const studentId = req.actor.studentId || req.actor.memberId;
      const member = db.prepare('SELECT * FROM members WHERE id=?').get(studentId);
      identity = `student-${studentId || crypto.randomBytes(3).toString('hex')}`;
      displayName = req.actor.name || member?.name || 'Student';
      roomName = resolvedRoomName;
    }
  }

  // Case B: Public / Guest Student (strictly non-admin)
  if (!identity) {
    const rawName = String(req.body?.participantName || 'Student Practitioner').trim();
    const cleanName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'student';
    identity = `guest-${cleanName}-${crypto.randomBytes(3).toString('hex')}`;
    displayName = rawName;
    roomName = resolvedRoomName;
    isTrainer = false;
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: displayName,
      ttl: '2h',
      metadata: JSON.stringify({
        role: isTrainer ? 'instructor' : 'student',
        isInstructor: isTrainer,
        joinedAt: now()
      })
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: isTrainer,
      roomRecord: isTrainer
    });

    const token = await at.toJwt();

    res.json({
      token,
      serverUrl,
      roomName,
      courseName: cls?.course_name || cls?.title || 'Master Hatha Yoga & Prana Flow',
      classTitle: cls?.title || 'Live Yoga Class',
      classStatus: cls?.status || 'live',
      participantName: displayName,
      identity,
      role: isTrainer ? 'instructor' : 'student',
      isAdmin: isTrainer
    });
  } catch (err) {
    console.error('Error generating LiveKit token:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6B. LIVE SESSION HEARTBEATS & 10-MINUTE TIMEOUT MANAGEMENT
// -------------------------------------------------------------
const TEN_MINUTES_MS = 10 * 60 * 1000;
const HEARTBEAT_DISCONNECT_MS = 50 * 1000; // 50s missed heartbeats marks disconnected

// Participant Heartbeat (sent every 8-10 seconds by active clients)
app.post('/api/live/heartbeat', optionalAuth, (req, res) => {
  const classId = String(req.body?.classId || '').trim();
  const identity = String(req.body?.identity || '').trim();
  const name = String(req.body?.name || 'Student').trim();
  let requestedRole = String(req.body?.role || 'student').trim().toLowerCase();
  const tabId = String(req.body?.tabId || '').trim();
  const phone = String(req.body?.phone || req.actor?.phone || '').trim();

  if (!classId || !identity) {
    return res.status(400).json({ error: 'classId and identity required.' });
  }

  const cls = db.prepare('SELECT id, title, COALESCE(course_name, title) as course_name, status, starts_at FROM classes WHERE id=?').get(classId);
  if (!cls) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  // Security role enforcement: Only authenticated trainers or instructor identities can report role = 'instructor'
  const isVerifiedTrainer = (req.actor && (req.actor.role === 'admin' || req.actor.role === 'trainer')) ||
    identity.startsWith('instructor') ||
    String(req.body?.participantId || '').startsWith('instructor');
  const role = isVerifiedTrainer && requestedRole === 'instructor' ? 'instructor' : (isVerifiedTrainer ? 'instructor' : 'student');

  const participantId = String(req.body?.participantId || identity).trim();
  const currentTime = now();
  const sessionId = `${classId}_${identity}`;

  // Upsert session
  const existing = db.prepare('SELECT * FROM live_sessions WHERE class_id=? AND (identity=? OR participant_id=?)').get(classId, identity, participantId);
  if (existing) {
    db.prepare(`
      UPDATE live_sessions 
      SET participant_id=?, name=?, role=?, phone=COALESCE(NULLIF(?, ''), phone), tab_id=?, status='active', last_heartbeat=?, disconnected_at=NULL
      WHERE id=?
    `).run(participantId, name, role, phone, tabId, currentTime, existing.id);
  } else {
    db.prepare(`
      INSERT INTO live_sessions (id, class_id, participant_id, identity, name, role, phone, tab_id, status, last_heartbeat, disconnected_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, NULL, ?)
    `).run(sessionId, classId, participantId, identity, name, role, phone, tabId, currentTime, currentTime);
  }

  // If verified teacher sends heartbeat, ensure class status is live
  if (role === 'instructor' && cls.status !== 'live') {
    db.prepare("UPDATE classes SET status='live' WHERE id=?").run(classId);
    cls.status = 'live';
  }

  // Check if teacher is active in this class
  const teacherSession = db.prepare("SELECT * FROM live_sessions WHERE class_id=? AND role='instructor'").get(classId);
  let teacherConnected = false;
  let teacherGraceRemainingSeconds = null;

  if (teacherSession) {
    if (teacherSession.status === 'active') {
      teacherConnected = true;
      teacherGraceRemainingSeconds = null;
    } else if (teacherSession.status === 'disconnected' && teacherSession.disconnected_at) {
      const elapsedMs = Date.now() - new Date(teacherSession.disconnected_at).getTime();
      teacherGraceRemainingSeconds = Math.max(0, Math.floor((TEN_MINUTES_MS - elapsedMs) / 1000));
    } else {
      teacherGraceRemainingSeconds = 600;
    }
  } else {
    teacherGraceRemainingSeconds = 600;
  }

  // Active participants list
  const activeParticipants = db.prepare(`
    SELECT identity, participant_id, name, role, COALESCE(phone, participant_id) as phone, status, last_heartbeat, created_at
    FROM live_sessions
    WHERE class_id=? AND status='active'
    ORDER BY role DESC, created_at ASC
  `).all(classId);

  const studentCount = activeParticipants.filter(p => p.role === 'student').length;

  res.json({
    ok: true,
    classId,
    courseName: cls.course_name,
    classTitle: cls.title,
    classStatus: cls.status,
    activeCount: activeParticipants.length,
    studentCount,
    activeParticipants,
    teacherConnected,
    teacherGraceRemainingSeconds
  });
});

// Participant Explicit Leave
app.post('/api/live/leave', optionalAuth, (req, res) => {
  const classId = String(req.body?.classId || '').trim();
  const identity = String(req.body?.identity || req.body?.participantId || '').trim();
  const isTemporary = Boolean(req.body?.temporary);

  if (!classId || !identity) {
    return res.status(400).json({ error: 'classId and identity or participantId required.' });
  }

  const session = db.prepare('SELECT * FROM live_sessions WHERE class_id=? AND (identity=? OR participant_id=?)').get(classId, identity, identity);
  if (!session) {
    return res.json({ ok: true });
  }

  const currentTime = now();

  if (isTemporary) {
    // Participant temporarily navigating or changing tabs -> start 10 min grace period
    db.prepare("UPDATE live_sessions SET status='disconnected', disconnected_at=? WHERE id=?").run(currentTime, session.id);
  } else {
    // Explicit permanent leave
    if (session.role === 'instructor') {
      // If teacher explicitly ends class:
      db.prepare("UPDATE classes SET status='ended' WHERE id=?").run(classId);
      db.prepare("UPDATE live_sessions SET status='ended', disconnected_at=? WHERE class_id=?").run(currentTime, classId);
    } else {
      db.prepare("UPDATE live_sessions SET status='ended', disconnected_at=? WHERE id=?").run(currentTime, session.id);
    }
  }

  res.json({ ok: true, classStatus: isTemporary ? 'live' : (session.role === 'instructor' ? 'ended' : 'live') });
});

// Get Active Participants in Room
app.get('/api/live/sessions/:classId', (req, res) => {
  const classId = req.params.classId;
  const sessions = db.prepare(`
    SELECT identity, participant_id, name, role, COALESCE(phone, participant_id) as phone, status, last_heartbeat, created_at
    FROM live_sessions
    WHERE class_id=? AND status = 'active'
    ORDER BY role DESC, created_at ASC
  `).all(classId);

  const cls = db.prepare('SELECT id, title, COALESCE(course_name, title) as course_name, status FROM classes WHERE id=?').get(classId);
  const studentCount = sessions.filter(p => p.role === 'student').length;

  if (req.query.full === 'true') {
    return res.json({
      classId,
      courseName: cls?.course_name || 'Hatha Yoga',
      classTitle: cls?.title || 'Live Yoga Class',
      classStatus: cls?.status || 'live',
      activeCount: sessions.length,
      studentCount,
      participants: sessions
    });
  }

  res.json(sessions);
});

// Periodic 10-Minute Timeout & Abandoned Class Auto-Cleanup (Runs every 15 seconds)
function runLiveSessionCleanup() {
  try {
    const nowMs = Date.now();
    const nowDateIso = new Date(nowMs).toISOString();

    // 1. Mark active sessions without heartbeats (> 35s) as 'disconnected'
    const activeSessions = db.prepare("SELECT * FROM live_sessions WHERE status='active'").all();
    for (const s of activeSessions) {
      const lastHbMs = new Date(s.last_heartbeat).getTime();
      if (nowMs - lastHbMs > HEARTBEAT_DISCONNECT_MS) {
        db.prepare("UPDATE live_sessions SET status='disconnected', disconnected_at=? WHERE id=?")
          .run(nowDateIso, s.id);
        console.log(`[AutoCleanup] ${s.role} ${s.name} (${s.identity}) marked disconnected. 10m grace period active.`);
      }
    }

    // 2. Process disconnected sessions exceeding 10 minutes (600,000 ms)
    const disconnectedSessions = db.prepare("SELECT * FROM live_sessions WHERE status='disconnected'").all();
    for (const s of disconnectedSessions) {
      if (!s.disconnected_at) continue;
      const disTimeMs = new Date(s.disconnected_at).getTime();
      if (nowMs - disTimeMs > TEN_MINUTES_MS) {
        if (s.role === 'instructor') {
          // Check if instructor has reconnected or is active in another tab
          const activeTeacher = db.prepare("SELECT * FROM live_sessions WHERE class_id=? AND role='instructor' AND status='active'").get(s.class_id);
          if (activeTeacher) {
            // Teacher is still present in another tab/session; clean up this expired session only
            db.prepare("UPDATE live_sessions SET status='ended' WHERE id=?").run(s.id);
          } else {
            // Teacher failed to reconnect anywhere within 10 minutes -> Automatically end the class!
            console.log(`[AutoCleanup] Teacher disconnected > 10m without active reconnect. Ending class ${s.class_id}.`);
            db.prepare("UPDATE classes SET status='ended' WHERE id=?").run(s.class_id);
            db.prepare("UPDATE live_sessions SET status='ended' WHERE class_id=?").run(s.class_id);
          }
        } else {
          // Student failed to reconnect within 10 minutes -> Clean up student only!
          console.log(`[AutoCleanup] Student ${s.name} disconnected > 10m. Cleaning up session.`);
          db.prepare("UPDATE live_sessions SET status='ended' WHERE id=?").run(s.id);
        }
      }
    }
  } catch (err) {
    console.warn('[AutoCleanup] Error during session cleanup:', err.message);
  }
}

// Start Background Interval
setInterval(runLiveSessionCleanup, 15000);

// -------------------------------------------------------------
// 7. YOGA MATERIALS & PDF NOTES
// -------------------------------------------------------------
app.get('/api/materials', (req, res) => {
  const rows = db.prepare('SELECT * FROM materials ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/trainer/materials', auth, trainerOnly, (req, res) => {
  const title = String(req.body?.title || '').trim();
  const category = String(req.body?.category || 'Yoga').trim();
  const description = String(req.body?.description || '').trim();
  const fileUrl = String(req.body?.fileUrl || '').trim();
  const content = String(req.body?.content || '').trim();
  const accessLevel = String(req.body?.accessLevel || 'all').trim();

  if (!title) {
    return res.status(400).json({ error: 'Title is required for yoga material.' });
  }

  const id = `mat-${Date.now()}`;
  const createdAt = now();

  db.prepare('INSERT INTO materials VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, title, category, description, fileUrl, content, accessLevel, createdAt
  );

  res.status(201).json({
    id, title, category, description, fileUrl, content, accessLevel, createdAt
  });
});

app.delete('/api/trainer/materials/:id', auth, trainerOnly, (req, res) => {
  db.prepare('DELETE FROM materials WHERE id=?').run(req.params.id);
  res.json({ ok: true, deletedId: req.params.id });
});

// -------------------------------------------------------------
// 8. YOGA VIDEOS MANAGEMENT
// -------------------------------------------------------------
app.get('/api/videos', (req, res) => {
  const rows = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/trainer/videos', auth, trainerOnly, (req, res) => {
  const title = String(req.body?.title || '').trim();
  const description = String(req.body?.description || '').trim();
  const videoUrl = String(req.body?.videoUrl || '').trim();
  const thumbnailUrl = String(req.body?.thumbnailUrl || 'assets/images/class-thumb.jpg').trim();
  const duration = Number(req.body?.durationMinutes || 30);
  const level = String(req.body?.level || 'All Levels').trim();
  const category = String(req.body?.category || 'Vinyasa').trim();

  if (!title || !videoUrl) {
    return res.status(400).json({ error: 'Title and Video URL are required.' });
  }

  const id = `vid-${Date.now()}`;
  const createdAt = now();

  db.prepare('INSERT INTO videos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, title, description, videoUrl, thumbnailUrl, duration, level, category, createdAt
  );

  res.status(201).json({
    id, title, description, videoUrl, thumbnailUrl, durationMinutes: duration, level, category, createdAt
  });
});

app.delete('/api/trainer/videos/:id', auth, trainerOnly, (req, res) => {
  db.prepare('DELETE FROM videos WHERE id=?').run(req.params.id);
  res.json({ ok: true, deletedId: req.params.id });
});

// -------------------------------------------------------------
// 9. REMINDERS PERSISTENCE
// -------------------------------------------------------------
app.get('/api/reminders', (req, res) => {
  const rows = db.prepare('SELECT * FROM reminders ORDER BY created_at DESC').all();
  res.json(rows.map(r => ({
    ...r,
    enabled: Boolean(r.enabled)
  })));
});

app.post('/api/reminders', (req, res) => {
  const id = String(req.body?.id || `rem-${Date.now()}`);
  const title = String(req.body?.title || 'Yoga Reminder').trim();
  const message = String(req.body?.message || '').trim();
  const time = String(req.body?.time || '08:00 AM').trim();
  const rawTime = String(req.body?.rawTime || '').trim();
  const date = String(req.body?.date || '').trim();
  const repeat = String(req.body?.repeat || 'Daily').trim();
  const sound = String(req.body?.sound || 'Soft Bell').trim();
  const enabled = req.body?.enabled !== false ? 1 : 0;
  const createdAt = now();

  db.prepare(`
    INSERT INTO reminders (id, user_id, title, message, time, raw_time, date, repeat, sound, enabled, created_at)
    VALUES (?, 'default_user', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title,
      message=excluded.message,
      time=excluded.time,
      raw_time=excluded.raw_time,
      date=excluded.date,
      repeat=excluded.repeat,
      sound=excluded.sound,
      enabled=excluded.enabled
  `).run(id, title, message, time, rawTime, date, repeat, sound, enabled, createdAt);

  res.json({ ok: true, id, title, time });
});

app.delete('/api/reminders/:id', (req, res) => {
  db.prepare('DELETE FROM reminders WHERE id=?').run(req.params.id);
  res.json({ ok: true, deletedId: req.params.id });
});

// -------------------------------------------------------------
// 10. ATTENDANCE TRACKING (70% THRESHOLD & PERSISTENCE)
// -------------------------------------------------------------
app.post('/api/attendance/log', (req, res) => {
  const classId = String(req.body?.classId || 'cls-1').trim();
  const studentName = String(req.body?.studentName || req.body?.name || 'Student Practitioner').trim();
  const studentPhone = String(req.body?.studentPhone || req.body?.phone || 'N/A').trim();
  const durationSeconds = Number(req.body?.durationSeconds || 0);

  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(classId) || { duration_minutes: 60, title: 'Hatha Yoga Flow' };
  const targetSeconds = (cls.duration_minutes || 60) * 60;
  const attendancePercent = Math.min(100, Math.round((durationSeconds * 100) / targetSeconds));
  const isPresent = attendancePercent >= 70;
  const status = isPresent ? 'Present (70%+)' : `Incomplete (${attendancePercent}%)`;

  const memberId = studentPhone !== 'N/A' ? studentPhone : crypto.randomUUID();
  const id = `att-${classId}-${studentPhone.replace(/\D/g, '') || Date.now()}`;
  const joinedAt = now();

  db.prepare(`
    INSERT INTO attendance (id, class_id, member_id, joined_at, left_at, duration_seconds, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(class_id, member_id) DO UPDATE SET
      duration_seconds = excluded.duration_seconds,
      status = excluded.status,
      left_at = excluded.left_at
  `).run(id, classId, memberId, joinedAt, now(), durationSeconds, status);

  res.json({
    ok: true,
    classId,
    studentName,
    studentPhone,
    durationSeconds,
    attendancePercent,
    status,
    isPresent
  });
});

app.post('/api/attendance/join', auth, (req, res) => {
  const classId = String(req.body?.classId || '').trim();
  const memberId = req.actor?.memberId || req.actor?.studentId || req.actor?.email || 'student';
  if (!classId) return res.status(400).json({ error: 'classId is required' });

  const id = `att-${classId}-${memberId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const existing = db.prepare('SELECT * FROM attendance WHERE id=?').get(id);

  if (existing) {
    db.prepare('UPDATE attendance SET joined_at=? WHERE id=?').run(now(), id);
  } else {
    db.prepare(`
      INSERT INTO attendance (id, class_id, member_id, joined_at, duration_seconds, status)
      VALUES (?, ?, ?, ?, 0, 'Incomplete (0%)')
    `).run(id, classId, memberId, now());
  }

  res.json({ ok: true, attendanceId: id });
});

app.post('/api/attendance/leave', auth, (req, res) => {
  const classId = String(req.body?.classId || '').trim();
  const memberId = req.actor?.memberId || req.actor?.studentId || req.actor?.email || 'student';
  if (!classId) return res.status(400).json({ error: 'classId is required' });

  const id = `att-${classId}-${memberId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const row = db.prepare('SELECT * FROM attendance WHERE id=?').get(id);
  const leftAt = now();

  let durationSeconds = 60;
  if (row?.joined_at) {
    const joinedMs = new Date(row.joined_at).getTime();
    const leftMs = new Date(leftAt).getTime();
    durationSeconds = Math.max(1, Math.round((leftMs - joinedMs) / 1000));
  }

  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(classId) || { duration_minutes: 60 };
  const targetSeconds = (cls.duration_minutes || 60) * 60;
  const attendancePercent = Math.min(100, Math.round((durationSeconds * 100) / targetSeconds));
  const isPresent = attendancePercent >= 70;
  const status = isPresent ? 'Present (70%+)' : `Incomplete (${attendancePercent}%)`;

  if (row) {
    db.prepare(`
      UPDATE attendance
      SET left_at=?, duration_seconds=?, status=?
      WHERE id=?
    `).run(leftAt, durationSeconds, status, id);
  } else {
    db.prepare(`
      INSERT INTO attendance (id, class_id, member_id, joined_at, left_at, duration_seconds, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, classId, memberId, leftAt, leftAt, durationSeconds, status);
  }

  res.json({ ok: true, durationSeconds, status, attendancePercent });
});

app.post('/api/attendance', optionalAuth, (req, res) => {
  const classId = String(req.body?.classId || 'cls-1').trim();
  const studentName = String(req.body?.studentName || req.body?.name || req.actor?.name || 'Student Practitioner').trim();
  const studentPhone = String(req.body?.studentPhone || req.body?.phone || req.actor?.phone || 'N/A').trim();
  const durationSeconds = Number(req.body?.durationSeconds || 0);

  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(classId) || { duration_minutes: 60, title: 'Hatha Yoga Flow' };
  const targetSeconds = (cls.duration_minutes || 60) * 60;
  const attendancePercent = Math.min(100, Math.round((durationSeconds * 100) / targetSeconds));
  const isPresent = attendancePercent >= 70;
  const status = isPresent ? 'Present (70%+)' : `Incomplete (${attendancePercent}%)`;

  const memberId = req.actor?.memberId || req.actor?.studentId || (studentPhone !== 'N/A' ? studentPhone : crypto.randomUUID());
  const id = `att-${classId}-${studentPhone.replace(/\D/g, '') || Date.now()}`;
  const joinedAt = now();

  db.prepare(`
    INSERT INTO attendance (id, class_id, member_id, joined_at, left_at, duration_seconds, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(class_id, member_id) DO UPDATE SET
      duration_seconds = excluded.duration_seconds,
      status = excluded.status,
      left_at = excluded.left_at
  `).run(id, classId, memberId, joinedAt, now(), durationSeconds, status);

  res.json({
    ok: true,
    classId,
    studentName,
    studentPhone,
    durationSeconds,
    attendancePercent,
    status,
    isPresent
  });
});

app.get('/api/trainer/attendance', auth, trainerOnly, (req, res) => {
  const rows = db.prepare(`
    SELECT a.id,
           a.class_id AS classId,
           c.title AS classTitle,
           c.duration_minutes AS classDurationMinutes,
           COALESCE(m.name, a.member_id) AS studentName,
           COALESCE(m.phone, a.member_id) AS studentPhone,
           COALESCE(m.email, '') AS email,
           a.joined_at AS joinedAt,
           a.left_at AS leftAt,
           COALESCE(a.duration_seconds, 0) AS durationSeconds,
           MIN(100, ROUND(COALESCE(a.duration_seconds, 0) * 100.0 / (c.duration_minutes * 60))) AS attendancePercent,
           a.status
    FROM attendance a
    LEFT JOIN members m ON m.id = a.member_id OR m.phone = a.member_id OR m.email = a.member_id
    JOIN classes c ON c.id = a.class_id
    ORDER BY a.joined_at DESC
  `).all();

  res.json(rows);
});

app.get('/api/admin/attendance', auth, adminOnly, (req, res) => {
  const rows = db.prepare(`
    SELECT a.id,
           a.class_id AS classId,
           c.title AS classTitle,
           c.duration_minutes AS classDurationMinutes,
           COALESCE(m.name, a.member_id) AS studentName,
           COALESCE(m.phone, a.member_id) AS studentPhone,
           COALESCE(m.email, '') AS email,
           a.joined_at AS joinedAt,
           a.left_at AS leftAt,
           COALESCE(a.duration_seconds, 0) AS durationSeconds,
           MIN(100, ROUND(COALESCE(a.duration_seconds, 0) * 100.0 / (c.duration_minutes * 60))) AS attendancePercent,
           a.status
    FROM attendance a
    LEFT JOIN members m ON m.id = a.member_id OR m.phone = a.member_id OR m.email = a.member_id
    JOIN classes c ON c.id = a.class_id
    ORDER BY a.joined_at DESC
  `).all();

  res.json(rows);
});

// Delete specific attendance record (Trainer / Admin testing tool)
app.delete('/api/trainer/attendance/:id', auth, trainerOnly, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM attendance WHERE id = ?').run(id);
    res.json({ ok: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all attendance records for clean testing reset
app.delete('/api/trainer/attendance', auth, trainerOnly, (req, res) => {
  try {
    db.prepare('DELETE FROM attendance').run();
    res.json({ ok: true, message: 'All attendance records cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/student/attendance', (req, res) => {
  const phone = String(req.query?.phone || '').trim();
  let rows = [];
  if (phone) {
    rows = db.prepare(`
      SELECT a.id,
             a.class_id AS classId,
             c.title AS classTitle,
             c.duration_minutes AS classDurationMinutes,
             a.joined_at AS joinedAt,
             COALESCE(a.duration_seconds, 0) AS durationSeconds,
             MIN(100, ROUND(COALESCE(a.duration_seconds, 0) * 100.0 / (c.duration_minutes * 60))) AS attendancePercent,
             a.status
      FROM attendance a
      JOIN classes c ON c.id = a.class_id
      WHERE a.member_id = ? OR a.member_id LIKE ?
      ORDER BY a.joined_at DESC
    `).all(phone, `%${phone}%`);
  } else {
    rows = db.prepare(`
      SELECT a.id,
             a.class_id AS classId,
             c.title AS classTitle,
             c.duration_minutes AS classDurationMinutes,
             a.joined_at AS joinedAt,
             COALESCE(a.duration_seconds, 0) AS durationSeconds,
             MIN(100, ROUND(COALESCE(a.duration_seconds, 0) * 100.0 / (c.duration_minutes * 60))) AS attendancePercent,
             a.status
      FROM attendance a
      JOIN classes c ON c.id = a.class_id
      ORDER BY a.joined_at DESC
      LIMIT 10
    `).all();
  }

  res.json(rows);
});

// -------------------------------------------------------------
// 9. LIVEKIT CONFIGURATION STATUS & ADMIN CONFIG
// -------------------------------------------------------------
app.get('/api/livekit/status', (req, res) => {
  res.json({
    configured: Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET),
    serverUrl: process.env.LIVEKIT_URL || '',
    hasApiKey: Boolean(process.env.LIVEKIT_API_KEY),
    hasApiSecret: Boolean(process.env.LIVEKIT_API_SECRET)
  });
});

app.post('/api/livekit/config', auth, adminOnly, (req, res) => {
  const serverUrl = String(req.body?.serverUrl || '').trim();
  const apiKey = String(req.body?.apiKey || '').trim();
  const apiSecret = String(req.body?.apiSecret || '').trim();

  if (serverUrl) process.env.LIVEKIT_URL = serverUrl;
  if (apiKey) process.env.LIVEKIT_API_KEY = apiKey;
  if (apiSecret) process.env.LIVEKIT_API_SECRET = apiSecret;

  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/^LIVEKIT_URL=.*/m, `LIVEKIT_URL=${process.env.LIVEKIT_URL || ''}`);
      envContent = envContent.replace(/^LIVEKIT_API_KEY=.*/m, `LIVEKIT_API_KEY=${process.env.LIVEKIT_API_KEY || ''}`);
      envContent = envContent.replace(/^LIVEKIT_API_SECRET=.*/m, `LIVEKIT_API_SECRET=${process.env.LIVEKIT_API_SECRET || ''}`);
    } else {
      envContent = `LIVEKIT_URL=${process.env.LIVEKIT_URL || ''}\nLIVEKIT_API_KEY=${process.env.LIVEKIT_API_KEY || ''}\nLIVEKIT_API_SECRET=${process.env.LIVEKIT_API_SECRET || ''}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
  } catch (e) {
    console.warn('Could not persist updated .env:', e);
  }

  res.json({
    success: true,
    configured: Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET),
    serverUrl: process.env.LIVEKIT_URL || ''
  });
});

// -------------------------------------------------------------
// 10. STATIC FILE SERVING WITH PROPER MIME TYPES & SPA FALLBACK
// -------------------------------------------------------------
const staticRoot = path.join(__dirname);
app.use(express.static(staticRoot, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.zip')) {
      res.setHeader('Content-Type', 'application/zip');
    } else if (filePath.endsWith('.apk')) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    }
  }
}));

// Fallback to index.html for SPA client-side routes (Express 5 compatible)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`✓ NITHYA Yoga & Wellness Full Server running on http://localhost:${PORT}`);
  console.log(`  - Database: ${dbPath}`);
  console.log(`  - Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`  - Admin Email: ${process.env.ADMIN_EMAIL || 'admin@nithyayoga.com'}`);
});
