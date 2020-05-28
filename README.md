# dace-plugin-debugssr
dace plugin

## 安装
```
npm i dace-plugin-debugssr
```

## 用法

在 `dace.config.js` 的插件中添加配置：

```js
module.exports = {
  plugins: ['debugssr']
};
```

## 原理

*dace* 预置的 *babel* 打包配置是 `babel-preset-dace` ，开发环境通过区别设置 ssr 文件的转译规则，使得服务端文件最大化保留可读性。