module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || "learn-analogueshifts",
      script: "node_modules/.bin/next",
      args: "start -p " + (process.env.PORT || "3000"),
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
