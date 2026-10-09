const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const HOST = '0.0.0.0';

// Load .env variables manually without extra deps
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && val) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.map': 'application/json',
  '.zip': 'application/zip',
  '.apk': 'application/vnd.android.package-archive'
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.writeHead(204);
    res.end();
    return;
  }

  const reqPath = req.url.split('?')[0];

  // API Route: LiveKit Server Status Check
  if (reqPath === '/api/livekit/status' && req.method === 'GET') {
    loadEnv();
    const isConfigured = Boolean(
      process.env.LIVEKIT_URL && 
      process.env.LIVEKIT_API_KEY && 
      process.env.LIVEKIT_API_SECRET
    );
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured: isConfigured,
      serverUrl: process.env.LIVEKIT_URL || '',
      hasApiKey: Boolean(process.env.LIVEKIT_API_KEY),
      hasApiSecret: Boolean(process.env.LIVEKIT_API_SECRET)
    }));
    return;
  }

  // API Route: Configure LiveKit Credentials
  if (reqPath === '/api/livekit/config' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (data.serverUrl) process.env.LIVEKIT_URL = data.serverUrl.trim();
        if (data.apiKey) process.env.LIVEKIT_API_KEY = data.apiKey.trim();
        if (data.apiSecret) process.env.LIVEKIT_API_SECRET = data.apiSecret.trim();

        // Persist to .env
        const envContent = `# LiveKit Server Configuration for NITHYA Yoga\nLIVEKIT_URL=${process.env.LIVEKIT_URL || ''}\nLIVEKIT_API_KEY=${process.env.LIVEKIT_API_KEY || ''}\nLIVEKIT_API_SECRET=${process.env.LIVEKIT_API_SECRET || ''}\n`;
        fs.writeFileSync(path.join(__dirname, '.env'), envContent, 'utf8');

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          configured: Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET),
          serverUrl: process.env.LIVEKIT_URL || ''
        }));
      } catch (err) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API Route: Secure LiveKit Access Token Generation
  if (reqPath === '/api/livekit/token' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        loadEnv();
        const data = JSON.parse(body || '{}');
        const roomName = (data.roomName || 'nithya-live-studio').trim();
        const participantName = (data.participantName || 'Sarah').trim();
        const role = data.role === 'instructor' || Boolean(data.isTeacher) ? 'instructor' : 'student';
        const isInstructor = role === 'instructor';

        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const serverUrl = process.env.LIVEKIT_URL;

        if (!apiKey || !apiSecret || !serverUrl) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'LiveKit server credentials are not configured on the backend. Please provide LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.',
            needsConfig: true
          }));
          return;
        }

        const { AccessToken } = require('livekit-server-sdk');

        // Clean unique identity
        const cleanName = participantName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        const identity = `${cleanName}-${randomSuffix}`;

        const at = new AccessToken(apiKey, apiSecret, {
          identity,
          name: participantName,
          metadata: JSON.stringify({
            role,
            isInstructor,
            joinedAt: new Date().toISOString()
          })
        });

        // Add grants based on role
        at.addGrant({
          roomJoin: true,
          room: roomName,
          canPublish: true, // Both instructor and students can publish video & audio
          canSubscribe: true,
          canPublishData: true,
          roomAdmin: isInstructor,
          roomRecord: isInstructor
        });

        const token = await at.toJwt();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          token,
          serverUrl,
          roomName,
          participantName,
          identity,
          role
        }));
      } catch (err) {
        console.error('Error generating LiveKit token:', err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';

  res.setHeader('Access-Control-Allow-Origin', '*');
  const stat = fs.statSync(filePath);
  res.setHeader('Content-Length', stat.size);
  res.writeHead(200, { 'Content-Type': mime });
  if (req.method === 'HEAD') {
    res.end();
  } else {
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`NITHYA Yoga LiveKit Server running on http://localhost:${PORT}`);
});
