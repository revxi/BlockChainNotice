try {
  const app = require('./server');
  if (!app || !app._router) {
    console.log('App or router not available.');
    process.exit(0);
  }
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) routes.push(middleware.route.path);
    else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        route && routes.push(route.path);
      });
    }
  });
  console.log('Registered routes:', routes);
} catch (err) {
  console.error('Failed to list routes:', err.message || err);
  process.exit(1);
}
