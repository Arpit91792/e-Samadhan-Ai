import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── Protect: verify JWT ───────────────────────────────────────────────────────
export const protect = async (req, res, next) => {
      let token;

      // 1. HTTP-only cookie
      if (req.cookies?.token) {
            token = req.cookies.token;
      }
      // 2. Authorization header
      else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
      }

      try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password -aadhaarNumber -govtIdNumber');

            if (!user) {
                  return res.status(401).json({ success: false, message: 'User account no longer exists.' });
            }
            if (!user.isActive) {
                  return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });
            }

            req.user = user;
            next();
      } catch (err) {
            return res.status(401).json({
                  success: false,
                  message: err.name === 'TokenExpiredError'
                        ? 'Session expired. Please log in again.'
                        : 'Invalid token. Please log in again.',
            });
      }
};

// ── Authorize: role-based access ──────────────────────────────────────────────
export const authorize = (...roles) => (req, res, next) => {
      if (!roles.includes(req.user?.role)) {
            return res.status(403).json({
                  success: false,
                  message: `Access denied. This resource requires: ${roles.join(' or ')} role.`,
            });
      }
      next();
};

// ── Optional auth: attach user if token present, don't fail if not ────────────
export const optionalAuth = async (req, res, next) => {
      let token = req.cookies?.token
            || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

      if (!token) return next();

      try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
      } catch {
            // ignore — just proceed without user
      }
      next();
};
