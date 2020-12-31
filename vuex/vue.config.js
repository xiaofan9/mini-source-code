const path = require('path');

module.exports = {
  pages: {
    index: {
      entry: 'example/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'custom-vuex',
    },
  },
  configureWebpack: {
    resolve: {
      // 设置别名
      alias: {
        vuex: path.resolve(__dirname, './src/index.js')
      }
    }
  },
};
