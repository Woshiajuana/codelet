const { defineConfig } = require('@codelet/cli-service')

module.exports = defineConfig({
  pageIndex: 'pages/home/index',
  source: [
    'app.(js|ts)',
    '(pages|components)/**/index.(js|ts)',
    'packages/*/(pages|components)/**/index.(js|ts)',
  ],
})
