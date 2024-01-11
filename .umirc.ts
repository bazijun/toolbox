import { defineConfig } from 'umi';

export default defineConfig({
  history: { type: 'hash' },
  routes: [
    { path: '/', redirect: '/lucky-subway' },
    { path: '/lucky-subway', component: 'luckySubway' },
  ],
  npmClient: 'pnpm',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
});
