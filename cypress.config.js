// cypress/config.js

module.exports = (on, config) => {
  // Your Cypress configuration logic here
  return {
    env: {
      PASS_BUG: Cypress.env('PASS_BUG'),
    },
    e2e: {
      viewportHeight: 1080,
      viewportWidth: 1920,
      baseUrl: 'https://bugbank.netlify.app/',
      setupNodeEvents(on, config) {
        // Additional configuration if needed
      },
    },
  };
};
