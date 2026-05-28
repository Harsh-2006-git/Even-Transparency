module.exports = {
  apps: [
    // ── Production ────────────────────────────────────────
    {
      name: 'apprenticeship-portal',
      script: 'src/server.js',
      cwd: './backend',
      instances: 'max',        // one worker per CPU core
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      // Auto-restart on uncaught exceptions
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
    },

    // ── Staging ───────────────────────────────────────────
    {
      name: 'apprenticeship-portal-staging',
      script: 'src/server.js',
      cwd: './backend',
      instances: 1,
      watch: false,
      max_memory_restart: '256M',
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 5001,
      },
      error_file: './logs/pm2-staging-error.log',
      out_file: './logs/pm2-staging-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      autorestart: true,
    },
  ],
};
