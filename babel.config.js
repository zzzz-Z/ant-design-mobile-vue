module.exports = {
  presets: [
    ['@babel/preset-env'],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        "pragma": "jsx", 
        "pragmaFrag":"JsxFragment"
      },
    ],
  ],
}
