import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  routes: [
    {
      path: '/',
      component: '../pages/layout/index',
      routes: [
        { path: '/', component: '../pages/gyyd/classify/index' },
        { path: '/gyyd/classify', component: '../pages/gyyd/classify/index' },
      ]
    }
  ],
  antd: {},
  proxy: {
    '/api/v1': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
      pathRewrite: { "^/api/v1": "" }
    }
  },
}

export default config;
