/**
 * 修改 dace 的 ssr 服务端打包规则，使其在本地开发时 server.js 代码不被编译，增加调试可读性
 * 配置参考 babel-preset-dace
 */
module.exports = {
  modify(conf, { target, isDev }, webpackInstance, options) {
    const IS_NODE = target === 'node';

    if (IS_NODE && isDev) {console.log('debugssr')
      const rules = conf.module.rules;
      const babelRules = rules.find(r => r.use && r.test.test('.jsx') && r.use.find(u => u.loader.indexOf('babel-loader') > -1));
      if (babelRules) {
          // 重置 webpack babel-loader 中的 options，规则参考 node_modules/babel-preset-dace/index.js，由此提升调试源码可读性
          babelRules.use[0].options.cacheDirectory = false;
          babelRules.use[0].options.presets = [{
              presets: [
                  [require.resolve('@babel/preset-env'), {
                      exclude: [
                          'transform-regenerator',
                          'transform-async-to-generator'
                      ],
                      modules: false,
                      useBuiltIns: false,
                      targets: { 'node': 'current' }
                  }],
                  require.resolve('@babel/preset-react')
              ],
              plugins: [
                  require.resolve('@loadable/babel-plugin'),
                  require.resolve('babel-plugin-add-module-exports'),
                  [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                  require.resolve('@babel/plugin-transform-modules-commonjs'),
                  require.resolve('@babel/plugin-proposal-optional-chaining'),
                  [require.resolve('@babel/plugin-proposal-class-properties'), { loose: false }],
                  [require.resolve('@babel/plugin-syntax-object-rest-spread'), { useBuiltIns: true }],
                  process.env.NODE_ENV === 'local' && require.resolve('@babel/plugin-transform-react-jsx-source'),

                  // 支持 import() 语法
                  require.resolve('@babel/plugin-syntax-dynamic-import'),
                  require.resolve('@babel/plugin-transform-runtime'),
                  process.env.NODE_ENV === 'production' && require.resolve('babel-plugin-transform-react-remove-prop-types')
              ].filter(Boolean)
          }];

      }
    }

    return conf
  }
};
