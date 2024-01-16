const { defineConfig } = require('@bee/cli-service')

module.exports = defineConfig({
  source: [
    'app.(js|ts)',
    'pages/**/*.(js|ts)',
    // 'pages/home/*.(js|ts)',
    // 'pages/login/*.(js|ts)',
    // 'components/**/*.(js|ts)',
    // 'subpackage/**/*.(js|ts)',
  ],
})
