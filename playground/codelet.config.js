const { defineConfig } = require('@codelet/cli-service')

module.exports = defineConfig({
  pageIndex: 'pages/home/index',
  externalSource: ['utils/xxLib.ts'],
  source: [
    'app.(js|ts)',
    '(pages|components)/**/index.(js|ts)',
    'packages/*/(pages|components)/**/index.(js|ts)',
    'utils/xxLib.ts',
  ],
})
