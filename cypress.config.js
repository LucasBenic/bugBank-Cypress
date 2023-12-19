const { defineConfig } = require("cypress");

module.exports = defineConfig({

  env: {
    PASS_BUG: Cypress.env('PASS_BUG'),
  },
  
  e2e: {
    viewportHeight: 1080,
    viewportWidth: 1920,

    baseUrl: 'https://bugbank.netlify.app/',

    setupNodeEvents(on, config) {
    },
  },
});
