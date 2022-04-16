// EDIT: 下面是调整构建行为的配置
module.exports = [
  // EDIT: 按需加载 antd 的less文件
  [
    'use-babel-config',
    {
      presets: ['react-app'],
      plugins: [
        [
          'import',
          {
            libraryName: 'antd',
            style: true
          }
        ]
      ]
    }
  ],
  (config) => {
    const newConfig = config;
    let rule = newConfig.module.rules.find((rule) => rule.oneOf);
    rule.oneOf.unshift({
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        // EDIT: 在加载、编译 antd 的less文件过程中，设置主题色（也就是在获取antd最终样式前、调整了antd）
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': 'green'
              }
            }
          }
        }
      ]
    });

    return newConfig;
  }
];
