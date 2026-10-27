import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.js';
import { enforceOrgScope } from './middleware/orgScope.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import organizationRoutes from './routes/organization.routes.js';
import workerRoutes from './routes/worker.routes.js';
import payRoutes from './routes/pay.routes.js';
import grievanceRoutes from './routes/grievance.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

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

// Global Error Handler
app.use(errorHandler);

export default app;
