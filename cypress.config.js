const { defineConfig } = require("cypress");


module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,

  env: {
    PASS_BUG: '',
  },

  e2e: {
    baseUrl: 'https://bugbank.netlify.app/',
    setupNodeEvents(on, config) {
   
    },
  },
});