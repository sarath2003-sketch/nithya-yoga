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
`);

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
      created_at: new Date().toISOString()
    },
    {
      id: 'cls-2',
      title: 'Vinyasa Core & Stamina',
      starts_at: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: 60,
      room_name: 'nithya-vinyasa-core',
      created_at: new Date().toISOString()
    },
    {
      id: 'cls-3',
      title: 'Chakra Meditation & Yin Stillness',
      starts_at: new Date(Date.now() + 172800000).toISOString(),
      duration_minutes: 50,
      room_name: 'nithya-yin-meditation',
      created_at: new Date().toISOString()
    }
  ];

  const insertClass = db.prepare('INSERT INTO classes VALUES (?, ?, ?, ?, ?, ?)');
  for (const c of defaultStarterClasses) {
    insertClass.run(c.id, c.title, c.starts_at, c.duration_minutes, c.room_name, c.created_at);
  }
}

const now = () => new Date().toISOString();
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Auth middleware: verifies signed JWT from Authorization header
function auth(req, res, next) {
  const raw = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!raw) {
    return res.status(401).json({ error: 'Authorization token required. Please log in.' });
  }
  try {
    const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
    req.actor = jwt.verify(raw, jwtSecret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
}

// Admin only middleware: checks verified role in JWT payload
function adminOnly(req, res, next) {
  if (req.actor?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

// Optional Auth middleware (extracts actor if provided, but does not block)
function optionalAuth(req, res, next) {
  const raw = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (raw) {
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
// 2. ADMIN AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/admin/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nithyayoga.com').trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !password) {
    return res.status(400).json({ error: 'Provide admin email and password.' });
  }

  if (email !== adminEmail) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  let isMatch = false;
  if (passwordHash) {
    isMatch = await bcrypt.compare(password, passwordHash);
  } else if (password === 'NithyaAdmin2026!') {
    // Development fallback
    isMatch = true;
  }

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'nithya_yoga_secure_jwt_secret_key_2026_mindful_wellness_prod';
  const token = jwt.sign(
    { role: 'admin', email: adminEmail },
    jwtSecret,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    role: 'admin',
    email: adminEmail,
    expiresIn: '8h'
  });
});

// -------------------------------------------------------------
// 3. ADMIN: CLASSES MANAGEMENT
// -------------------------------------------------------------
app.post('/api/admin/classes', auth, adminOnly, (req, res) => {
  const title = String(req.body?.title || '').trim();
  const startsAt = String(req.body?.startsAt || '');
  const duration = Number(req.body?.durationMinutes || 60);

  if (!title || !Number.isFinite(Date.parse(startsAt)) || duration < 5 || duration > 240) {
    return res.status(400).json({
      error: 'Provide title, valid startsAt date/time (ISO), and duration between 5 and 240 minutes.'
    });
  }

  const id = crypto.randomUUID();
  const roomName = `nithya-${id.replace(/-/g, '').slice(0, 20)}`;
  const createdAt = now();

  db.prepare('INSERT INTO classes VALUES (?, ?, ?, ?, ?, ?)').run(
    id, title, startsAt, duration, roomName, createdAt
  );

  res.status(201).json({
    id,
    title,
    startsAt,
    durationMinutes: duration,
    roomName,
    createdAt
  });
});

app.get('/api/admin/classes', auth, adminOnly, (req, res) => {
  const rows = db.prepare('SELECT * FROM classes ORDER BY starts_at DESC').all();
  res.json(rows);
});

// -------------------------------------------------------------
// 4. ADMIN: INVITES MANAGEMENT
// -------------------------------------------------------------
app.post('/api/admin/classes/:id/invites', auth, adminOnly, (req, res) => {
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
  const inviteUrl = `${frontendBase}?invite=${encodeURIComponent(token)}`;

  res.status(201).json({
    inviteUrl,
    token,
    expiresAt,
    classId: cls.id,
    classTitle: cls.title
  });
});

// -------------------------------------------------------------
// 5. PUBLIC INVITE METADATA
// -------------------------------------------------------------
app.get('/api/invites/:token', (req, res) => {
  const tokenHash = hash(req.params.token);
  const invite = db.prepare('SELECT * FROM invites WHERE token_hash=?').get(tokenHash);

  if (!invite || Date.parse(invite.expires_at) < Date.now()) {
    return res.status(404).json({ error: 'Invite link is invalid or has expired.' });
  }

  const cls = db.prepare('SELECT id, title, starts_at, duration_minutes, room_name FROM classes WHERE id=?').get(invite.class_id);
  if (!cls) {
    return res.status(404).json({ error: 'Associated yoga class not found.' });
  }

  res.json({
    valid: true,
    class: {
      id: cls.id,
      title: cls.title,
      startsAt: cls.starts_at,
      durationMinutes: cls.duration_minutes
    },
    expiresAt: invite.expires_at
  });
});

// -------------------------------------------------------------
// 6. MEMBER REGISTRATION VIA INVITE
// -------------------------------------------------------------
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
// 7. SECURE LIVEKIT ACCESS TOKEN GENERATION
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
  let isAdmin = false;
  let roomName;

  const reqClassId = String(req.body?.classId || '').trim();

  // Case A: Authenticated actor (Admin or Registered Member)
  if (req.actor) {
    if (req.actor.role === 'admin') {
      isAdmin = true;
      identity = `admin-${req.actor.email}`;
      displayName = 'Yoga Instructor';

      if (reqClassId) {
        const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(reqClassId);
        roomName = cls?.room_name || `nithya-${reqClassId}`;
      } else {
        roomName = (req.body?.roomName || 'nithya-live-studio').trim();
      }
    } else if (req.actor.role === 'member') {
      const member = db.prepare('SELECT * FROM members WHERE id=?').get(req.actor.memberId);
      if (!member) {
        return res.status(401).json({ error: 'Registered member account not found.' });
      }
      identity = `member-${member.id}`;
      displayName = member.name;

      const targetClassId = reqClassId || req.actor.classId;
      const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(targetClassId);
      roomName = cls?.room_name || `nithya-${targetClassId}`;
    }
  }

  // Case B: Public / Demo guest (never granted admin permissions)
  if (!identity) {
    const rawName = String(req.body?.participantName || 'Guest Student').trim();
    const cleanName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'student';
    identity = `guest-${cleanName}-${crypto.randomBytes(3).toString('hex')}`;
    displayName = rawName;
    roomName = (req.body?.roomName || 'nithya-live-studio').trim();
    isAdmin = false;
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: displayName,
      ttl: '2h',
      metadata: JSON.stringify({
        role: isAdmin ? 'instructor' : 'student',
        isInstructor: isAdmin,
        joinedAt: now()
      })
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: isAdmin,
      roomRecord: isAdmin
    });

    const token = await at.toJwt();

    res.json({
      token,
      serverUrl,
      roomName,
      participantName: displayName,
      identity,
      role: isAdmin ? 'instructor' : 'student',
      isAdmin
    });
  } catch (err) {
    console.error('Error generating LiveKit token:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. SERVER-BACKED ATTENDANCE
// -------------------------------------------------------------
app.post('/api/attendance/join', auth, (req, res) => {
  if (req.actor.role !== 'member') {
    return res.status(403).json({ error: 'Member attendance only.' });
  }

  const classId = req.actor.classId || String(req.body?.classId || '');
  const cls = db.prepare('SELECT * FROM classes WHERE id=?').get(classId);
  if (!cls) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  const id = crypto.randomUUID();
  const joinedAt = now();

  db.prepare(`
    INSERT INTO attendance (id, class_id, member_id, joined_at, status)
    VALUES (?, ?, ?, ?, 'joined')
    ON CONFLICT(class_id, member_id) DO UPDATE SET
      joined_at = excluded.joined_at,
      left_at = NULL,
      duration_seconds = NULL,
      status = 'joined'
  `).run(id, cls.id, req.actor.memberId, joinedAt);

  res.json({
    ok: true,
    joinedAt,
    classId: cls.id,
    memberId: req.actor.memberId
  });
});

app.post('/api/attendance/leave', auth, (req, res) => {
  if (req.actor.role !== 'member') {
    return res.status(403).json({ error: 'Member attendance only.' });
  }

  const classId = req.actor.classId || String(req.body?.classId || '');
  const row = db.prepare('SELECT * FROM attendance WHERE class_id=? AND member_id=?')
    .get(classId, req.actor.memberId);

  if (!row || row.status !== 'joined') {
    return res.status(400).json({ error: 'No active attendance session found to leave.' });
  }

  const leftAt = now();
  const durationSeconds = Math.max(0, Math.floor((Date.parse(leftAt) - Date.parse(row.joined_at)) / 1000));

  db.prepare(`
    UPDATE attendance
    SET left_at=?, duration_seconds=?, status='left'
    WHERE class_id=? AND member_id=?
  `).run(leftAt, durationSeconds, classId, req.actor.memberId);

  res.json({
    ok: true,
    durationSeconds,
    durationMinutes: Math.round(durationSeconds / 60)
  });
});

app.get('/api/admin/attendance', auth, adminOnly, (req, res) => {
  const rows = db.prepare(`
    SELECT a.class_id AS classId,
           c.title AS classTitle,
           c.duration_minutes AS classDurationMinutes,
           m.name,
           m.email,
           m.phone,
           a.joined_at AS joinedAt,
           a.left_at AS leftAt,
           COALESCE(a.duration_seconds, 0) AS durationSeconds,
           MIN(100, ROUND(COALESCE(a.duration_seconds, 0) * 100.0 / (c.duration_minutes * 60))) AS attendancePercent,
           a.status
    FROM attendance a
    JOIN members m ON m.id = a.member_id
    JOIN classes c ON c.id = a.class_id
    ORDER BY a.joined_at DESC
  `).all();

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
