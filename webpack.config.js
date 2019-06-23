const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development', // production development
  entry: {
    main: path.resolve(__dirname,'src/main.js'),
    //vues:['vue','vuex','vue-router','vee-validate'],
    //iview:['iview'],
    //axios:['axios']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    //publicPath:"/url", // 处理正确的静态分发资源包地址
    filename: 'res/js/[name].bundle.js',
    chunkFilename: "res/js/[name].chunk.js"
  },
  // 解决编译环境 : webpack You are using the runtime-only build of Vue where the template compiler is not available
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js' // 路径简写
    }
  },
  module: {
    rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        // 它会应用到普通的 `.js` 文件
        // 以及 `.vue` 文件中的 `<script>` 块
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        // 它会应用到普通的 `.css` 文件
        // 以及 `.vue` 文件中的 `<style>` 块
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        // 字体资源文件
        {
          test: /\.(svg|ttf|eot|woff)\??.*$/,
          loader: "url-loader?limit=10000&name=res/font/[hash].[ext]"
        },
        // 图片资源文件
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader?limit=8192&name=res/img/[hash].[ext]'
        }
      ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
};