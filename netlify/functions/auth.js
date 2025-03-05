const express = require('express');
const basicAuth = require('basic-auth');

exports.handler = (event, context) => {
  const app = express();

  app.use((req, res, next) => {
    const user = basicAuth(req);
    
    // Replace with your desired single password
    const validPassword = 'lopoko';
    
    if (!user || user.pass !== validPassword) {
      res.set('WWW-Authenticate', 'Basic realm="Documentation Access"');
      return res.status(401).send('Authentication required');
    }
    
    next();
  });

  // Serve your VitePress site
  app.use(express.static('docs/.vitepress/dist'));

  return app(req, res);
};
