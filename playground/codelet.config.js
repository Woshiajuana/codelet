const { defineConfig } = require('@codelet/cli-service')

module.exports = defineConfig({
  source: [
    'app.(js|ts)',
    'pages/**/*.(js|ts)',
    'components/**/*.(js|ts)',
    // 'subpackage/**/*.(js|ts)',
  ],
})