import { defineComponent, KeepAlive, Transition } from "vue";
import "./index.scss";

const Content = defineComponent({
  setup() {
    return () => (
      <section class="app-main">
        <router-view>
          {({ Component }: any) => {
            return (
              <Transition name="fade-transform" mode={"out-in"}>
                {/*todo keepalive 待优化*/}
                <KeepAlive>
                  <Component />
                </KeepAlive>
              </Transition>
            );
          }}
        </router-view>
        <div id="el-main-footer">© 2022 Demo 1.0</div>
      </section>
    );
  },
});
export default Content;
