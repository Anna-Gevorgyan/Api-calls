const {setCommonPlugins } = require('@codeceptjs/configure');


setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost',
      show: true,
    },
  },
  include: {
    I: './steps/api_steps.js',
  },
  gherkin: {
    features: './features/*.feature',
    steps: [
      './steps/api_steps.js',
    ],
  },
  name: 'api',
};
