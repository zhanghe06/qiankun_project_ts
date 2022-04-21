# qiankun TypeScript

[快速上手](https://qiankun.umijs.org/zh/guide/getting-started)

[常见问题](https://qiankun.umijs.org/zh/faq)

[ProComponents](https://procomponents.ant.design/table/)

[Ant Design](https://ant.design/components/)

[Ant Design Pro](https://pro.ant.design/zh-CN/)

环境
```
node -v  # v16.14.2
npm -v  # 8.5.0
yarn -v  # 1.22.17
```

镜像加速
```
yarn config set registry https://registry.yarnpkg.com
yarn config get registry
```

```
mkdir main app_react app_vue
yarn create react-app main --template typescript
yarn create react-app app_react --template typescript
```

基座
```
cd main
yarn add qiankun
yarn add antd
yarn add @ant-design/pro-layout
yarn add @ant-design/icons
```

```
yarn start
```

子应用
```
cd app_react
yarn add antd
yarn add @ant-design/icons
yarn add @ant-design/pro-table
yarn add @types/axios
yarn add react-router-dom@5
yarn add @types/react-router-dom@5
yarn add moment

yarn add @rescripts/cli -D
yarn add @rescripts/rescript-env -D
yarn add @rescripts/rescript-use-babel-config -D
yarn add babel-plugin-import -D
yarn add less -D
yarn add less-loader -D
```

注意：Route 不能设置 exact

静态修改主题需要插件：`babel-plugin-import`

Layout.less
```
//@import '~antd/lib/style/themes/default.less';
//@import '~antd/dist/antd.less';
@import '~antd/dist/antd.variable.less';
//@import '~antd/dist/antd.compact.less';
@import '@ant-design/pro-table/dist/table.less';
@import '@ant-design/pro-form/dist/form.less';


.ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    width: 0;
}

.ant-tabs-top > .ant-tabs-nav::before, .ant-tabs-bottom > .ant-tabs-nav::before, .ant-tabs-top > div > .ant-tabs-nav::before, .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: 0;
}

.ant-pro-table .ant-pro-card-border {
    border: 0;
    .ant-pro-card-body {
        padding: 0;
    }
}

//@primary-color: #1890ff; // 全局主色
//@link-color: #1890ff; // 链接色
//@success-color: #52c41a; // 成功色
//@warning-color: #faad14; // 警告色
//@error-color: #f5222d; // 错误色
//@font-size-base: 14px; // 主字号
//@heading-color: rgba(0, 0, 0, 0.85); // 标题色
//@text-color: rgba(0, 0, 0, 0.65); // 主文本色
//@text-color-secondary: rgba(0, 0, 0, 0.45); // 次文本色
//@disabled-color: rgba(0, 0, 0, 0.25); // 失效色
@border-radius-base: 4px; // 组件/浮层圆角
//@border-color-base: #d9d9d9; // 边框色
//@box-shadow-base: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05); // 浮层阴影
```

package.json
```
"babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      [
        "import",
        {
          "libraryName": "antd",
          "style": true
        }
      ]
    ]
  }
```

.rescriptsrc.js
```
module.exports = {
  webpack: (config) => {

    // qiankun micro app
    ...

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

  ...
};
```

[动态修改主题](https://ant.design/docs/react/customize-theme-variable-cn)

```
ConfigProvider.config({
    theme: {
        primaryColor: '#f890ff',
        errorColor: '#ff4d4f',
        warningColor: '#faad14',
        successColor: '#52c41a',
        infoColor: '#1890ff',
    },
});
```

## Helm Chart

[https://helm.sh/zh/docs/](https://helm.sh/zh/docs/)

```
helm create app_react                           # 创建应用
helm lint ./app_react                           # 静态检查
helm package app_react/                         # 构建打包
helm serve                                      # 创建代理，端口8879
helm repo list                                  # 仓库列表
helm install --name app-react local/myapp       # 新开端口，安装应用
curl 127.0.0.1
helm status app-react                           # 查看状态
helm delete --purge app-react                   # 删除应用
```

## 浏览器兼容

[https://www.babeljs.cn/docs/babel-polyfill](https://www.babeljs.cn/docs/babel-polyfill)

```
// yarn add @babel/polyfill
yarn add core-js@3
# 入口index.tsx添加
// import "@babel/polyfill"
import "core-js/stable";
import "regenerator-runtime/runtime";
```

## 样式问题

下拉列表、抽屉样式 混乱

通过元素分析，发现：下拉列表和抽屉不是在子应用内渲染
