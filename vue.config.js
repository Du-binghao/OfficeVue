// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    const dir = path.resolve(__dirname, "src/assets/icons"); //这里路径写自己的
    config.module
      .rule("svg-sprite")
      .test(/\.svg$/)
      .include.add(dir)
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ extract: false })
      .end();
    config
      .plugin("svg-sprite")
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .use(require("svg-sprite-loader/plugin"), [{ plainSprite: true }]);
    config.module.rule("svg").exclude.add(dir);
  },
  // devServer: {
  //   port: 8080,
  //   open: false, //是否自动打开浏览器
  //   overlay: {
  //     warnings: false,
  //     errors: false,
  //   },
  //   // proxy: {
  //   //   "/": {
  //   //     target: process.env.VUE_APP_URL,
  //   //     changeOrigin: true,
  //   //     pathRewrite: {
  //   //       "^/": "/",
  //   //     },
  //   //   },
  //   // },
  // },
};
