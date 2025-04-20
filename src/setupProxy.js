const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
  
  // Explicitly exclude static assets from proxy
  app.use('/uploads', (req, res, next) => next()); // Bypass proxy for uploads
};