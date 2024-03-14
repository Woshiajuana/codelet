const { defineConfig } = require('@codelet/cli-service')

module.exports = defineConfig({
  pageIndex: 'pages/home/index',
  source: [
    'app.(js|ts)',
    'pages/**/*.(js|ts)',
    'components/**/*.(js|ts)',
    'subpackage/**/*.(js|ts)',
  ],
})
