import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { authMiddleware } from './middleware/auth.js';
import { enforceOrgScope } from './middleware/orgScope.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import organizationRoutes from './routes/organization.routes.js';
import workerRoutes from './routes/worker.routes.js';
import payRoutes from './routes/pay.routes.js';
import grievanceRoutes from './routes/grievance.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KaamSetu API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Demo auth middleware attaches req.user
app.use('/api', authMiddleware);

// Publicly accessible demo auth endpoints
app.use('/api/auth', authRoutes);

// Organization-scoped endpoints
app.use('/api/organizations', enforceOrgScope, organizationRoutes);
app.use('/api/workers', enforceOrgScope, workerRoutes);
app.use('/api/pay', enforceOrgScope, payRoutes);
app.use('/api/grievances', enforceOrgScope, grievanceRoutes);
app.use('/api/dashboard', enforceOrgScope, dashboardRoutes);

// Serve compiled frontend in production if client/dist exists
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

export default app;
