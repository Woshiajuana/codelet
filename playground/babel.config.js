module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        // 如果使用了 babel，则需要关闭插件 modules 模块转换功能，不然 Tree Shaking 可能不会起效果，新版本的 babel-loader 以及 @babel/preset-env 内部已经根据webpack的版本自动禁用了 modules
        modules: false,
        // shippedProposals: true,

        useBuiltIns: 'usage',

        corejs: 3,
      },
    ],
  ],
}
