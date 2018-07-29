module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'routine',
      script: 'npm',
      args: 'run start-routine',
      env: {
        NODE_ENV: 'development',
      },
      env_sandbox: {
        NODE_ENV: 'sandbox',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'app',
      script: 'npm',
      args: 'run start-app',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_sandbox: {
        NODE_ENV: 'sandbox',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
