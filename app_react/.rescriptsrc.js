const { name } = require('./package');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');


module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    // config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';
    // config.module.rules = [{
    //   test: /\.less$/,
    //   use: [
    //     {
    //       loader: 'style-loader',
    //     },
    //     {
    //       loader: 'css-loader', // translates CSS into CommonJS
    //     },
    //     {
    //       loader: 'less-loader', // compiles Less to CSS
    //       options: {
    //         lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
    //           modifyVars: {
    //             'primary-color': '#1DA57A',
    //             'link-color': '#1DA57A',
    //             'border-radius-base': '2px',
    //             '@ant-prefix': 'app-react',
    //           },
    //           javascriptEnabled: true,
    //         },
    //       },
    //     }],
    // }];
    // config.plugins = [
    //   new ReactRefreshWebpackPlugin(),
    // ].filter(Boolean)

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
