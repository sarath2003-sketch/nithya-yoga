const db = require('better-sqlite3')('nithya-yoga.sqlite');
try {
  db.exec('ALTER TABLE live_sessions ADD COLUMN phone TEXT');
} catch (_) {}
const res = db.prepare("DELETE FROM live_sessions WHERE status='ended' OR name LIKE '%Practitioner%' OR name LIKE '%Practice%'").run();
console.log('Cleaned sessions:', res.changes);
console.log('Remaining sessions:', db.prepare('SELECT * FROM live_sessions').all());
