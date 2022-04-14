# qiankun TypeScript

[快速上手](https://qiankun.umijs.org/zh/guide/getting-started)

[ProComponents](https://procomponents.ant.design/table/)

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
yarn add @rescripts/cli -D
yarn add @types/axios
yarn add react-router-dom@5
yarn add @types/react-router-dom@5
yarn add moment
```

注意：Route 不能设置 exact


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
