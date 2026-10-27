export function errorHandler(err, req, res, next) {
  console.error('[KaamSetu API Error]:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected internal server error occurred.',
    timestamp: new Date().toISOString()
  });
}
