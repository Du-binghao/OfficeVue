import {
  computed,
  defineComponent,
  KeepAlive,
  ref,
  Transition,
  watch,
} from "vue";
import "./index.scss";
import { useRoute } from "vue-router";
import store from "@/store";
import Router from "@/router";

//备份
const Content = defineComponent({
  components: {
    Transition,
  },
  get cachedViews() {
    return store.state.cachedViews;
  },

  setup() {
    console.log("加载子页面");
    const route = useRoute();

    const key = computed(() => {
      // store.commit("SET_ACTIVE_MENU", {
      //   menuId: route.path,
      //   menuPath: route.path,
      // });
      return route.fullPath;
    });

    return {
      key,
    };
  },

  render(data: any) {
    return (
      // <section class="app-main">
      //   {/*<el-input model-value={data.key}></el-input>*/}
      //   <transition name="fade-transform" mode="out-in">
      //     {/*<KeepAlive>*/}
      //     <div>
      //       <router-view key={data.key} />{" "}
      //     </div>
      //     {/*</KeepAlive>*/}
      //   </transition>
      // </section>

      <section class="app-main">
        {/*<el-input model-value={data.key}></el-input>*/}
        <router-view key={data.key}>
          {/*@ts-ignore*/}
          {({ Component }) => {
            return (
              <Transition name="fade-transform" mode={"out-in"}>
                <KeepAlive>
                  <Component />
                </KeepAlive>
              </Transition>
            );
          }}
        </router-view>
      </section>
    );
  },
});
export default Content;
