import {
  defineComponent,
  onMounted,
  reactive,
  TransitionGroup,
  watch,
} from "vue";
import "./index.scss";
import { useRoute, useRouter } from "vue-router";

interface data {
  levelList: any;
}
const BreadCrumb = defineComponent({
  components: {
    TransitionGroup,
  },

  // watch: {
  //   $route(route) {
  //     // if you go to the redirect page, do not update the breadcrumbs
  //     if (route.path.startsWith("/redirect/")) {
  //       return;
  //     }
  //     this.getBreadcrumb()
  //   },
  // },
  // methods: {
  //   getBreadcrumb() {
  //     console.logs(123)
  //   },
  // },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const data = reactive<data>({
      levelList: [],
    });
    onMounted(() => {
      console.log("加载面包屑");
      getBreadcrumb();
    });
    watch(
      () => route.fullPath,
      () => {
        getBreadcrumb();
      }
    );
    // 获取面包屑
    const getBreadcrumb = () => {
      data.levelList = route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      const first = data.levelList[0];
      if (!isDashboard(first)) {
        data.levelList = [
          { path: "/admin/dashboard", meta: { title: "首页" } },
        ].concat(data.levelList);
      }
    };
    // 判断首页
    const isDashboard = (route: any) => {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
      );
    };

    return () => (
      <el-breadcrumb class="app-breadcrumb" separator="/">
        <TransitionGroup name="breadcrumb">
          {data.levelList.map((item: any, index: number) => {
            return item.redirect === "noredirect" ||
              index == data.levelList.length - 1 ? (
              <el-breadcrumb-item key={item.path}>
                <span class="no-redirect">{item.meta.title}</span>
              </el-breadcrumb-item>
            ) : (
              <el-breadcrumb-item key={item.path}>
                <a
                  onClick={() => {
                    router.push(item.path);
                  }}
                >
                  {item.meta.title}
                </a>
              </el-breadcrumb-item>
            );
          })}
        </TransitionGroup>
      </el-breadcrumb>
    );
  },
});

export default BreadCrumb;
