const { defineConfig } = require("cypress");
module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: true,

  e2e: {
    baseUrl: 'https://bugbank.netlify.app/',
    setupNodeEvents(on, config) {
    },
  },

  reporter: 'cypress-qase-reporter',
  reporterOptions: {
    mode: "testops",
    screenshotFolder: 'screenshots',
    apiToken: process.env.API_TOKEN, // Access the environment variable directly
    projectCode: 'BOPL',
    logging: true,
    basePath: 'https://api.qase.io/v1',
    sendScreenshot: true,
    runComplete: true,
  },
});

