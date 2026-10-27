/**
 * Organization Scoping Middleware
 * Enforces organization boundary isolation per Architecture.md.
 */

export function enforceOrgScope(req, res, next) {
  if (!req.user || !req.user.organizationId) {
    return res.status(403).json({ error: 'User is not bound to a valid organization.' });
  }

  // Attach active organizationId to request
  req.organizationId = req.user.organizationId;
  next();
}
