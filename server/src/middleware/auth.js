import { db } from '../models/dataStore.js';

export function authMiddleware(req, res, next) {
  // Support demo authentication via header or query
  const demoUserId = req.headers['x-demo-user-id'] || 
                     req.headers['authorization']?.replace(/^Bearer\s+/i, '') || 
                     req.query.demoUserId;

  if (demoUserId) {
    const user = db.findById('users', demoUserId);
    if (user) {
      req.user = user;
      return next();
    }
  }

  // Fallback to default demo user (Worker Ramesh Kumar) if no user specified
  const defaultUser = db.findOne('users', { id: 'usr-worker-1' }) || db.getCollection('users')[0];
  req.user = defaultUser;
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role '${req.user.role}' is not authorized to perform this action. Required: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}
