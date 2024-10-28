const dotenv = require('dotenv');
dotenv.config({ path: '.env.prod' });

module.exports = {
  apps: [
    {
      name: "ghanatalksradio-node-server",
      script: "./dist/server.js",
      env_production: {
        NODE_ENV: "prod",
        ...process.env
      }
    }
  ]
};
// pm2 start ecosystem.config.js --env prod

// Server IP : 137.184.21.178