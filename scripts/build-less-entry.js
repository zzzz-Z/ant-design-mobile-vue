#!/usr/bin/env node

/* eslint-disable */
'use strict';

// Build a entry less file to dist/antd-mobile.less
var fs = require('fs');
var path = require('path');
console.log('Building a entry less file to dist/antd-mobile.less');
var componentsPath = path.join(process.cwd(), 'packages');
var componentsLessContent = '';
// Build components in one file: lib/style/components.less
fs.readdir(componentsPath, function (err, files) {
  files.forEach(function (file) {
    if (fs.existsSync(path.join(componentsPath, file, 'style', 'index.less'))) {
      componentsLessContent += `@import "./${path.join(file, 'style', 'index.less')}";\n`
    }
  });
  fs.writeFileSync(path.join(process.cwd(), 'packages', 'components.less'), componentsLessContent);

  // Build less entry file: dist/antd.less
  // fs.writeFileSync(
  //   path.join(process.cwd(), 'dist', 'antd-mobile.less'),
  //   '@import "../lib/style/index.less";\n@import "../lib/style/components.less";'
  // );
});
