const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
// In production validate password, use DB, hashing, etc.

// Mock login: accept username & password, if username === 'admin' mark isAdmin
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if(!username) return res.status(400).json({ ok:false, error:'username required' });
  // mock check
  const isAdmin = username === 'admin';
  const payload = { sub: username, isAdmin };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  // set cookie httpOnly
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 2*60*60*1000 });
  res.json({ ok:true, isAdmin });
});

router.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.json({ ok:true });
});

module.exports = router;
