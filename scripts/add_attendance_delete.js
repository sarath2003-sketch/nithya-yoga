const fs = require('fs');

let content = fs.readFileSync('serve.js', 'utf8');
const target = "app.get('/api/student/attendance', (req, res) => {";
const insert = `// Delete specific attendance record (Trainer / Admin testing tool)
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

`;

if (content.includes(target)) {
  content = content.replace(target, insert + target);
  fs.writeFileSync('serve.js', content, 'utf8');
  console.log('SUCCESS: updated serve.js');
} else {
  console.log('Target string not found in serve.js');
}
