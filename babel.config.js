const transformJsx = require('./scripts/plugins/transform-jsx')

module.exports = {
  presets: [
    ['@babel/preset-env'],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ],
  plugins: [transformJsx]
}