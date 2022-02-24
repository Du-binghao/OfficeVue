import { createApp } from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";
import "@/public/css/home.css"; // 首页样式
import "@/public/css/style.css"; // 公共样式
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Echarts from "vue-echarts";
// 全局注册
import "echarts";
require("echarts/theme/macarons");

// 局部注册
// import * as echarts from "echarts/core";
// import { GridComponent, TooltipComponent } from "echarts/components";
// import { LineChart } from "echarts/charts";
// import { UniversalTransition } from "echarts/features";
// import { CanvasRenderer } from "echarts/renderers";
// echarts.use([
//   GridComponent,
//   LineChart,
//   CanvasRenderer,
//   UniversalTransition,
//   TooltipComponent,
// ]);
// 错误示范
// import { use } from "echarts/core";
// import { CanvasRenderer } from "echarts/renderers";
//
// import {
//   GridComponent,
//   TooltipComponent,
//   DatasetComponent,
// } from "echarts/components";
//
// use([CanvasRenderer, GridComponent, TooltipComponent, DatasetComponent]);

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale })
  .component("v-chart", Echarts)
  .mount("#app");

router.beforeEach((to, from, next) => {
  NProgress.start();
  store.commit("SET_ACTIVE_MENU", to.path);
  store.commit("SET_ACTIVE_PARENT", to.matched[0].path);
  next();
});

router.afterEach(() => {
  NProgress.done();
});

//进度条速度，一般不用控制自行加载
NProgress.inc(0.2);
NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});
