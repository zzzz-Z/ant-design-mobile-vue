module.exports = {
  presets: [
    ['@babel/preset-env'],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    "transform-class-properties",
    [
      '@babel/plugin-transform-react-jsx',
      {
        "pragma": "jsx",
        "pragmaFrag": "JsxFragment"
      },
    ],
  ],
}
