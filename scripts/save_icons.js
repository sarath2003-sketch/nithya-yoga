const fs = require('fs');
const path = require('path');

const srcFile = path.resolve('C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf/.system_generated/steps/2523/output.txt');
const content = fs.readFileSync(srcFile, 'utf8');

// Match JSON object after ### Result
const startIdx = content.indexOf('{');
const endIdx = content.indexOf('\n### Ran Playwright code');
const jsonStr = (endIdx !== -1) ? content.slice(startIdx, endIdx) : content.slice(startIdx);
const data = JSON.parse(jsonStr);
const targetDir = path.resolve(__dirname, '../assets/icons');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

for (const [filename, dataUrl] of Object.entries(data)) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const buf = Buffer.from(base64, 'base64');
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ Saved ${filename} (${buf.length} bytes, true PNG format)`);
}
