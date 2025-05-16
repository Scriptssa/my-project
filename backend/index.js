// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// تقديم جميع الملفات من نفس المجلد اللي فيه index.html
app.use(express.static(path.join(__dirname, 'public'))); // لازم السطر ده

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // لازم ده
  });
const correctPassword = "115200";

let randomPassword = generatePassword();
let lastGenerated = Date.now();

// كل 30 دقيقة نولّد باسورد جديد
setInterval(() => {
  randomPassword = generatePassword();
  lastGenerated = Date.now();
}, 30 * 60 * 1000); // 30 دقيقة

// دالة توليد الباسورد
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

// التحقق من الباسورد
app.post('/check-password', (req, res) => {
  const { password } = req.body;

  if (password === correctPassword || password === randomPassword) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// إرسال كلمة المرور الحالية (للأدمن)
app.get('/password', (req, res) => {
  res.json({ password: randomPassword, generatedAt: new Date(lastGenerated).toISOString() });
});

// ✅ إرسال معلومات الـ IP
app.get('/client-info', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.json({ ip });
});

// تقديم الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
