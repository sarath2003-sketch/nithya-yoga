const fs = require('fs');
const path = require('path');

function createSimplePdf(title, subtitle, sections) {
  // Build PDF text stream
  let stream = 'BT\n';
  stream += '/F1 20 Tf\n';
  stream += '50 750 Td\n';
  stream += `(${title.replace(/[()]/g, '')}) Tj\n`;
  stream += '0 -26 Td\n';
  stream += '/F1 12 Tf\n';
  stream += `(${subtitle.replace(/[()]/g, '')}) Tj\n`;
  stream += '0 -35 Td\n';

  sections.forEach((sec) => {
    stream += '/F1 14 Tf\n';
    stream += `(${sec.heading.replace(/[()]/g, '')}) Tj\n`;
    stream += '0 -18 Td\n';
    stream += '/F1 10 Tf\n';
    const lines = sec.text.split('\n');
    lines.forEach(l => {
      stream += `(${l.trim().replace(/[()]/g, '')}) Tj\n`;
      stream += '0 -14 Td\n';
    });
    stream += '0 -10 Td\n';
  });

  stream += 'ET';

  const streamLen = Buffer.byteLength(stream);

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ];

  let pdf = '%PDF-1.4\n';
  const xref = [0];
  let offset = Buffer.byteLength(pdf);

  objects.forEach(obj => {
    xref.push(offset);
    pdf += obj;
    offset += Buffer.byteLength(obj);
  });

  const xrefStart = offset;
  pdf += `xref\n0 ${xref.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < xref.length; i++) {
    pdf += `${String(xref[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

const docsDir = path.join(__dirname, '..', 'assets', 'docs');
const wwwDocsDir = path.join(__dirname, '..', 'www', 'assets', 'docs');

[docsDir, wwwDocsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Pranayama Guide
const pranayamaPdf = createSimplePdf(
  'NITHYA Yoga: Pranayama & Breathwork Guide',
  'Ancient Yogic Science of Prana & Nervous Regulation',
  [
    {
      heading: '1. Nadi Shodhana (Alternate Nostril Breathing)',
      text: 'Sit in a comfortable cross-legged posture with spine straight.\nUse Vishnu Mudra: fold index and middle fingers.\nInhale through left nostril for 4 counts, close both, retain for 4 counts.\nExhale gently through right nostril for 8 counts.\nBalances sympathetic and parasympathetic nervous channels.'
    },
    {
      heading: '2. Kapalabhati (Skull Shining Breath)',
      text: 'Active forceful exhalations with passive gentle inhalations.\nPumps prana to frontal brain lobes and stimulates Agni (digestive fire).\nPerform 3 rounds of 30 strokes each followed by slow retention.'
    },
    {
      heading: '3. Bhramari (Humming Bee Breath)',
      text: 'Close ears with thumbs, eyes with middle fingers.\nTake deep inhale, exhale with a soft high-pitched humming sound.\nInstantly reduces cortisol, anxiety, and blood pressure.'
    }
  ]
);

fs.writeFileSync(path.join(docsDir, 'pranayama_guide.pdf'), pranayamaPdf);
fs.writeFileSync(path.join(wwwDocsDir, 'pranayama_guide.pdf'), pranayamaPdf);

// 2. Surya Namaskar Guide
const suryaPdf = createSimplePdf(
  'NITHYA Yoga: Classical Surya Namaskar Guide',
  '12 Sacred Sun Salutations Steps with Mantras & Alignment',
  [
    {
      heading: '1. Pranamasana (Prayer Pose)',
      text: 'Stand at top of mat, feet together, palms in Anjali Mudra.\nMantra: Om Mitraya Namaha (Salutations to the Friend of All).'
    },
    {
      heading: '2. Hasta Uttanasana (Raised Arms Pose)',
      text: 'Inhale, lift arms overhead and gently arch spine backwards.\nMantra: Om Ravaye Namaha.'
    },
    {
      heading: '3. Padahastasana (Hand to Foot Pose)',
      text: 'Exhale, fold forward from hips with flat back, palms beside feet.\nMantra: Om Suryaya Namaha.'
    },
    {
      heading: '4. Ashwa Sanchalanasana (Equestrian Pose)',
      text: 'Inhale, step right leg back, right knee to floor, gaze upward.\nMantra: Om Bhanave Namaha.'
    },
    {
      heading: '5. Dandasana & Ashtanga Namaskara',
      text: 'Hold breath into plank, exhale lower knees, chest and chin to mat.\nEight points touch the earth in humility and core devotion.'
    },
    {
      heading: '6. Bhujangasana to Adho Mukha Svanasana',
      text: 'Inhale cobra pose opening heart, exhale into downward facing dog.\nPress heels toward floor, spine long, breathe steadily.'
    }
  ]
);

fs.writeFileSync(path.join(docsDir, 'surya_namaskar.pdf'), suryaPdf);
fs.writeFileSync(path.join(wwwDocsDir, 'surya_namaskar.pdf'), suryaPdf);

// 3. Sattvic Diet Guide
const dietPdf = createSimplePdf(
  'NITHYA Yoga: Sattvic Nutrition & Mindful Diet',
  'Ayurvedic Dietary Principles for Vitality and Clarity',
  [
    {
      heading: '1. Principles of Sattva (Purity & Harmony)',
      text: 'Food eaten with gratitude produces pure prana and mental clarity.\nEat fresh, seasonal, lightly cooked or raw natural plant foods.\nAvoid overly pungent, stale, fermented, or artificial items.'
    },
    {
      heading: '2. Recommended Daily Foods',
      text: 'Fresh sweet fruits (figs, dates, berries, apples).\nWhole grains (basmati rice, quinoa, millets, oats).\nHerbal teas (tulsi, ginger, cardamom, cinnamon, chamomile).\nHealthy fats (cold-pressed sesame oil, soaked almonds, seeds).'
    },
    {
      heading: '3. Mindful Eating Practice',
      text: 'Never eat when stressed or in a rush.\nSit comfortably, offer quiet gratitude before the first bite.\nChew each morsel thoroughly, leaving one-third of stomach for water and air.'
    }
  ]
);

fs.writeFileSync(path.join(docsDir, 'sattvic_diet.pdf'), dietPdf);
fs.writeFileSync(path.join(wwwDocsDir, 'sattvic_diet.pdf'), dietPdf);

console.log('Successfully generated all 3 authentic yoga PDF guides in assets/docs and www/assets/docs!');
