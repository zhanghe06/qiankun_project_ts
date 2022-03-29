# qiankun TypeScript

[快速上手](https://qiankun.umijs.org/zh/guide/getting-started)

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
```


## Helm Chart

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
