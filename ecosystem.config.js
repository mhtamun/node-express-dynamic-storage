const config = {
  apps: [
    {
      name: 'node-express-dynamic-storage',
      script: './src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules'],
    },
  ],
};

export default config;
