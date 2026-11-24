module.exports = {
  apps: [
    {
      name: 'BE_Vinceship',
      cwd: '/home/prod/logictic/backend',
      script: 'src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      max_memory_restart: '400M',
    },
    {
      name: 'FE_Vinceship',
      cwd: '/home/prod/logictic/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3006',
      env: {
        NODE_ENV: 'production',
        PORT: 3006,
      },
      max_memory_restart: '600M',
    },
  ],
};

