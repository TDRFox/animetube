const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function verifyJWTFromCookie(req){
  // Prefer httpOnly cookie named 'token', fallback to Authorization header
  const cookieHeader = req.headers.cookie || '';
  const tokenFromCookie = cookieHeader.split(';').map(c=>c.trim()).find(c=>c.startsWith('token='));
  let token = null;
  if(tokenFromCookie) token = tokenFromCookie.split('=')[1];
  if(!token && req.headers.authorization){
    const parts = req.headers.authorization.split(' ');
    if(parts.length===2 && parts[0]==='Bearer') token = parts[1];
  }
  if(!token) return null;
  try{
    return jwt.verify(token, JWT_SECRET);
  }catch(e){
    return null;
  }
}

function requireAdmin(req, res, next){
  const payload = verifyJWTFromCookie(req);
  if(!payload) return res.status(401).json({ ok:false, error:'Unauthorized' });
  // In a real app check payload.role or lookup DB
  if(!payload.isAdmin) return res.status(403).json({ ok:false, error:'Forbidden' });
  req.user = payload;
  next();
}

module.exports = { verifyJWTFromCookie, requireAdmin };
