import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import Layout from "@/layout/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "系统主页",
    component: () => import("@/views/admin/login"),
  },
  {
    path: "/admin",
    component: Layout,
    redirect: "/admin/dashboard",
    children: [
      {
        path: "/admin/dashboard",
        name: "首页",
        component: () => import("@/views/admin/dashboard"),
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
      {
        path: "/admin/personal",
        name: "个人中心",
        component: () => import("@/views/admin/personal"),
        meta: { title: "个人中心", icon: "personal", affix: true },
      },
      {
        path: "/notice_add",
        component: () => import("@/views/admin/notice_add"),
        name: "发布公告",
      },
      {
        path: "/record",
        component: () => import("@/views/admin/record"),
        name: "订单记录",
      }
    ],
  },
  {
    path: "/system",
    component: Layout,
    name: "系统管理",
    meta: { title: "系统管理", icon: "system", affix: true },
    redirect: "noredirect",
    children: [
      {
        path: "/system/user",
        component: () => import("@/views/admin/system/user"),
        name: "用户管理",
        meta: { title: "用户管理", icon: "user", affix: true },
      },
      {
        path: "/system/role",
        component: () => import("@/views/admin/system/role"),
        name: "角色管理",
        meta: { title: "角色管理", icon: "role", affix: true },
      },
      {
        path: "/system/menu",
        component: () => import("@/views/admin/system/menu"),
        name: "菜单管理",
        meta: { title: "菜单管理", icon: "menu", affix: true },
      },
    ],
  },
  {
    path: "/monitor",
    component: Layout,
    name: "系统监控",
    meta: { title: "系统监控", icon: "monitor", affix: true },
    redirect: "noredirect",
    children: [
      {
        path: "/monitor/logs",
        component: () => import("@/views/admin/monitor/logs"),
        name: "日志监控",
        meta: { title: "日志监控", icon: "log", affix: true },
      },
      {
        path: "/monitor/server",
        component: () => import("@/views/admin/monitor/server"),
        name: "服务监控",
        meta: { title: "服务监控", icon: "codeConsole", affix: true },
      }
    ],
  },
  {
    path: "/utils",
    component: Layout,
    name: "系统工具",
    meta: { title: "系统工具", icon: "sys-tools", affix: true },
    redirect: "noredirect",
    children: [
      {
        path: "/utils/notice",
        component: () => import("@/views/admin/utils/notice"),
        name: "公告管理",
        meta: { title: "公告管理", icon: "notice", affix: true },
      },
      {
        path: "/utils/alipay",
        component: () => import("@/views/admin/utils/alipay"),
        name: "支付宝工具",
        meta: { title: "支付宝工具", icon: "alipay", affix: true },
      },
      {
        path: "/utils/swagger",
        component: () => import("@/views/admin/utils/swagger"),
        name: "接口文档",
        meta: { title: "接口文档", icon: "swagger", affix: true },
      },
    ],
  },
  {
    path: "/drug",
    component: Layout,
    name: "药品管理",
    redirect: "noredirect",
    children: [
      {
        path: "/drug/medicine",
        component: () => import("@/views/admin/drug/medicine"),
        name: "药品信息",
      },
      {
        path: "/drug/supplier",
        component: () => import("@/views/admin/drug/supplier"),
        name: "供货商信息",
      },
      {
        path: "/drug/inventory",
        component: () => import("@/views/admin/drug/inventory"),
        name: "药品库存管理",
      }
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
