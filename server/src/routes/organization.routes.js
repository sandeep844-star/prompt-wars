import { Router } from 'express';
import { db } from '../models/dataStore.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const orgs = db.getCollection('organizations');
  res.json({ organizations: orgs });
});

router.get('/current', (req, res) => {
  const org = db.findById('organizations', req.user?.organizationId);
  if (!org) {
    return res.status(404).json({ error: 'Organization not found.' });
  }
  res.json({ organization: org });
});

router.patch('/:id/settings', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const { settings } = req.body;

  if (req.user.organizationId !== id) {
    return res.status(403).json({ error: 'Cannot modify settings for another organization.' });
  }

  const existingOrg = db.findById('organizations', id);
  if (!existingOrg) {
    return res.status(404).json({ error: 'Organization not found.' });
  }

  const updatedOrg = db.update('organizations', id, {
    settings: {
      ...existingOrg.settings,
      ...settings
    }
  });

  res.json({
    message: 'Organization settings updated successfully.',
    organization: updatedOrg
  });
});

export default router;
