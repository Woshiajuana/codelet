const { defineConfig } = require('@codelet/cli-service')

module.exports = defineConfig({
  pageIndex: 'pages/home/index',
  externalSource: ['libs/**/*.js'],
  npmDir: 'miniprogram_npm',
  source: [
    'app.(js|ts)',
    '(pages|components)/**/index.(js|ts)',
    'packages/*/(pages|components)/**/index.(js|ts)',
  ],
})
