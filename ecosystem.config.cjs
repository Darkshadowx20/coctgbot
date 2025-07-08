// ecosystem.config.cjs - PM2 configuration for Clash of Clans bot
module.exports = {
  apps: [{
    name: "coc",
    script: "./dist/index.js",
    watch: false,
    env: {
      NODE_ENV: "production",
    },
    max_memory_restart: "300M",
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    restart_delay: 4000,
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    min_uptime: "10s",
    error_file: "logs/error.log",
    out_file: "logs/output.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    merge_logs: true,
    time: true,
    interpreter: "node",
    interpreter_args: "--experimental-specifier-resolution=node",
    node_args: "--max-old-space-size=256",
    kill_timeout: 3000,
    wait_ready: true
  }]
} 