module.exports = {
  // https://babel.nodejs.cn/docs/options/#sourcetype
  sourceType: 'unambiguous',
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime'],
}
