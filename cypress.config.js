const { defineConfig } = require("cypress");


module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,

  e2e: {
    baseUrl: 'https://bugbank.netlify.app/',
    setupNodeEvents(on, config) {
   
    },
  },
});






// module.exports = defineConfig({
//   projectId: "e9msfd",
//   defaultCommandTimeout: 10000,
//   retries: 0,
//   viewportWidth: 1920,
//   viewportHeight: 1200,

//   env: {
//     local: {
//       CMS: "http://localhost:3030/",
//       broker: "http://localhost:3050/",
//       organization: "http://localhost:3040/"
//     },
//     stage: {
//       CMS: "https://dev-cms.dashre.us/",
//       broker: "https://dev-broker.dashre.us/",
//       organization: "https://dev-organization.dashre.us/"
//     }
//   },

//   e2e: {
//     setupNodeEvents(on, config) {
//       on('task', {
//         listFilesInFolder(folderPath) {
//           const fs = require('fs');
//           const path = require('path');
//           const folderAbsolutePath = path.join(config.projectRoot, folderPath);
//           const files = fs.readdirSync(folderAbsolutePath);
//           return files;
//         },
//       });
//     },
//   },
// });
