const { name } = require('./package');

module.exports = {
  webpack: (config) => {

    // qiankun micro app
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    // config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    // custom theme
    let rule = config.module.rules.find((rule) => rule.oneOf);
    rule.oneOf.unshift({
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        // 在加载、编译 antd 的less文件过程中，设置主题色（也就是在获取antd最终样式前、调整了antd）
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#25b8f4'
              }
            }
          }
        }
      ]
    });

    return config;
  },

  devServer: (_) => {
    const config = _;

    config.headers = {
      'Access-Control-Allow-Origin': '*'
    };
    config.historyApiFallback = true;
    config.hot = false;
    config.static.watch = false;
    config.liveReload = false;

    return config;
  }
};
