const { defineConfig } = require('@codelet/cli-service')

module.exports = defineConfig({
  pageIndex: 'pages/home/index',
  source: [
    'app.(js|ts)',
    'pages/**/index.(js|ts)',
    'components/**/index.(js|ts)',
    'packages/**/index.(js|ts)',
    'subpackage/**/index.(js|ts)',
  ],
})
