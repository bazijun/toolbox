import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", redirect: "/lucky-subway" },
    { path: "/lucky-subway", component: "luckySubway", layout: 'index' },
  ],
  npmClient: 'pnpm',
});
