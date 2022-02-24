import { defineComponent, onMounted, reactive } from "vue";
import "@/assets/styles/mixin.scss";
import "@/assets/styles/variables.scss";
import "@/assets/styles/sidebar.scss";
import "@/assets/styles/index.scss";
import "./index.scss";
import Content from "@/layout/components/Content";

import store from "@/store";
import { adminImg } from "@/public";
import { Local, POST, Request } from "@/axios";

import SvgIcon from "@/components/SvgIcon";
import Hamburger from "@/components/Hamburger";
import BreadCrumb from "@/components/BreadCrumb";
import HeadSearch from "@/components/HeadSearch";
import ScreenFull from "@/components/ScreenFull";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";

interface data {
  activeView: {
    viewPath: string;
    viewName: string;
  };

  visitViewList: [
    {
      viewPath: string;
      viewName: string;
    }
  ];
}

const index = defineComponent({
  component: {
    Content,
    Hamburger,
    HeadSearch,
    ScreenFull,
  },

  setup: () => {
    const router = useRouter();
    const route = useRoute();
    const data = reactive<data>({
      activeView: {
        viewPath: "",
        viewName: "",
      },
      visitViewList: [
        {
          viewName: "首页",
          viewPath: "/admin/dashboard",
        },
      ],
    });
    onMounted(() => {
      // 首页判断、并自动加载tabview
      if (route.fullPath != data.visitViewList[0].viewPath) {
        data.visitViewList.push({
          viewName: router.currentRoute.value.name
            ? router.currentRoute.value.name.toString()
            : "",
          viewPath: router.currentRoute.value.fullPath,
        });
      }
      getLoginUser();
    });

    const getLoginUser = async () => {
      console.log("获取登录用户");
      const res = await POST(Request.authUser, "");
      console.log(res)
      if (res) {
        if (res.data.code == 200) {
          store.commit("SET_LOGIN_USER", res.data.data);
          getPermission();
        } else {
          ElMessage.error(res.data.msg);
          router.push(Local.adminLogin);
        }
      }
    };

    const getPermission = async () => {
      const res = await POST(Request.authPermission, "");
      console.log("获取权限");
      if (res) {
        if (res.data.code == 200) {
          store.commit("SET_PERMISSION", res.data.data);
          getMenuList();
        } else {
          ElMessage.error(res.data.msg);
          router.push(Local.adminLogin);
        }
      }
    };

    const getMenuList = async () => {
      const res = await POST(Request.authMenu, "");
      console.log("获取菜单");
      if (res.data.code == 200) {
        store.commit("SET_MENU_LIST", res.data.data);
      } else {
        ElMessage.error(res.data.msg);
        router.push(Local.adminLogin);
      }
    };

    const menuSub = () => {
      return store.state.menuList.map((menuParent) => {
        {
          /*父菜单*/
        }
        return menuParent.children.length != 0 ? (
          <el-sub-menu
            index={menuParent.href}
            v-slots={{
              title: () => {
                return [
                  <el-icon>
                    <SvgIcon iconName={menuParent.icon} />
                  </el-icon>,
                  <span>{menuParent.title}</span>,
                ];
              },
            }}
          >
            {/*子菜单*/}
            {menuParent.children.map((item) => {
              return (
                <router-link
                  to={item.href}
                  onClick={() => {
                    //动态添加tabView
                    let state = data.visitViewList.find(function (
                      view,
                      index,
                      arr
                    ) {
                      return view.viewPath == item.href;
                    });
                    if (!state) {
                      data.visitViewList.push({
                        viewName: item.title,
                        viewPath: item.href,
                      });
                    }
                  }}
                >
                  <el-menu-item index={item.href} key={item.href}>
                    <el-icon>
                      <SvgIcon iconName={item.icon} />
                    </el-icon>
                    <span>{item.title}</span>
                  </el-menu-item>
                </router-link>
              );
            })}
          </el-sub-menu>
        ) : (
          // 菜单
          <router-link to={menuParent.href}>
            <el-menu-item index={menuParent.href} key={menuParent.href}>
              <el-icon>
                <SvgIcon iconName={menuParent.icon} />
              </el-icon>
              {store.state.isCollapse ? "" : <span>{menuParent.title}</span>}
            </el-menu-item>
          </router-link>
        );
      });
    };
    return () => (
      <el-container
        class={
          store.state.isCollapse
            ? " el-container app-wrapper hideSidebar"
            : " el-container app-wrapper openSidebar"
        }
      >
        <div class="sidebar-container has-logo">
          <div class="sidebar-logo-container collapse">
            {store.state.isCollapse == true ? (
              <router-link key="collapse" class="sidebar-logo-link" to="#">
                <img src={adminImg.logo} class="sidebar-logo" />
              </router-link>
            ) : (
              <router-link key="expand" class="sidebar-logo-link" to="#">
                <h1 class="sidebar-title">在线药店管理系统</h1>
              </router-link>
            )}
          </div>
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
              v-slots={menuSub}
              active-text-color={"#409eff"}
              background-color={"#304156"}
              class="el-menu-vertical-demo"
              text-color={"#bfcbd9"}
              collapse={store.state.isCollapse}
              collapseTransition={false}
              defaultActive={store.state.activeMenu}
              defaultOpeneds={Array.prototype.slice.call([
                store.state.activeParent,
              ])}
              unique-opened
              // router={true}
              onOpen={(key: string, keyPath: string[]) => {
                //TODO 打开目录操作(暂无)
                console.log("打开目录：" + key);
                // store.commit("SET_ACTIVE_PARENT", key)
              }}
              onClose={(key: string, keyPath: string[]) => {
                //TODO 关闭目录操作(暂无)
                console.log("关闭目录：" + key);
                store.commit("SET_ACTIVE_PARENT", "");
              }}
            ></el-menu>
          </el-scrollbar>
        </div>
        {/*主页面*/}
        <div
          class="main-container"
          style={{
            width: store.state.isCollapse
              ? "calc(100% - 54px)"
              : "calc(100% - 205px)",
          }}
        >
          <div class={"fixed-header"}>
            {/*navbar*/}
            <div class="navbar">
              <Hamburger class="hamburger-container" />
              <BreadCrumb class="breadcrumb-container" />
              <div class="right-menu">
                {/*todo 查找功能*/}
                {/*<HeadSearch class="right-menu-item" />*/}
                <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
                  <ScreenFull class="right-menu-item hover-effect" />
                </el-tooltip>
                <el-dropdown
                  class={"avatar-container right-menu-item hover-effect"}
                  trigger="click"
                  v-slots={{
                    dropdown: () => {
                      return (
                        <el-dropdown-menu>
                          <router-link
                            to={Local.adminPersonal}
                            onClick={() => {
                              let status = data.visitViewList.find(function (
                                view
                              ) {
                                return view.viewPath == Local.adminPersonal;
                              });
                              if (!status) {
                                data.visitViewList.push({
                                  viewName: "个人中心",
                                  viewPath: Local.adminPersonal,
                                });
                              }
                            }}
                          >
                            <el-dropdown-item>个人中心</el-dropdown-item>
                          </router-link>
                          <span style="display:block;">
                            <el-dropdown-item
                              divided
                              onClick={async () => {
                                ElMessageBox.confirm(
                                  "确定注销并退出系统吗？",
                                  "提示",
                                  {
                                    confirmButtonText: "确认",
                                    cancelButtonText: "取消",
                                    type: "warning",
                                  }
                                )
                                  .then(async () => {
                                    const res = await POST(
                                      Request.logout,
                                      null
                                    );
                                    if (res.data.code == 200) {
                                      ElMessage.success({
                                        message: res.data.msg,
                                        duration: 1000,
                                      });
                                      router.push(Local.adminLogin);
                                    }
                                  })
                                  .catch(() => {});
                              }}
                            >
                              退出登录
                            </el-dropdown-item>
                          </span>
                        </el-dropdown-menu>
                      );
                    },
                  }}
                >
                  <div class="avatar-wrapper">
                    <img
                      src={Request.getAvatar + store.state.loginUser.avatar}
                      class="user-avatar"
                    />
                  </div>
                </el-dropdown>
              </div>
            </div>

          </div>
          <Content />
        </div>
      </el-container>
    );
  },
});
export default index;
