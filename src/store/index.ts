import { createStore } from "vuex";
import { Local } from "@/axios";

export default createStore({
  state: {
    loginUser: {
      userId: 0,
      userName: "",
      avatar: "",
      nickName: "",
      sex: 1,
      phone: "",
      email: "",
      status: "",
    },
    role: {
      roleId: 0,
      roleName: "",
      description: "",
    },
    permission: [""],
    isCollapse: false,
    activeMenu: Local.adminDashboard,
    activeParent: "",
    menuList: [
      {
        id: 0,
        parentId: 0,
        title: "",
        icon: "",
        type: 0,
        href: "",
        permission: "",
        children: [
          {
            id: 0,
            parentId: 0,
            title: "",
            icon: "0",
            type: 0,
            href: "",
            permission: "",
            children: [],
          },
        ],
      },
    ],
    // todo tabView缓存页面待修改
    cachedViews: [
      {
        viewName: "首页",
        viewPath: "/admin/dashboard",
      },
    ],
  },
  mutations: {
    SET_LOGIN_USER: (state, loginUser) => {
      state.loginUser = loginUser;
    },

    SET_ROLE: (state, role) => {
      state.role = role;
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission;
    },

    SET_ACTIVE_MENU: (state, activeMenu) => {
      state.activeMenu = activeMenu;
    },

    SET_ACTIVE_PARENT: (state, activeParent) => {
      state.activeParent = activeParent;
    },

    SET_MENU_LIST: (state, menuList) => {
      state.menuList = menuList;
    },
    SET_COLLAPSE: (state, isCollapse) => {
      state.isCollapse = isCollapse;
    },
    // SET_VISITED_VIEWS: (state, visitedViews) => {
    //   state.visitedViews = visitedViews;
    // },

    // ADD_VISITED_VIEWS: (state, visitedViews) => {
    //   state.visitedViews.push(visitedViews);
    // },

    SET_CACHED_VIEWS: (state, cachedViews) => {
      state.cachedViews = cachedViews;
    },
  },
  actions: {
    add_visited_views({ commit }, visitedViews) {
      commit("ADD_VISITED_VIEWS", visitedViews);
    },
  },
  modules: {},
});
