import "@/assets/styles/variables.scss";
import Logo from "./Logo";
import { defineComponent, reactive } from "vue";
import AppMain from "@/layout/components/Content";

interface data {
  menuList: any;
  isCollapse: boolean;
}

const Sidebar = defineComponent({
  component: {
    Logo,
  },
  setup: function () {
    const data = reactive<data>({
      menuList: {},
      isCollapse: true,
    });
    return () => (
      <div class={"sidebar-container has-logo"}>
        <Logo />
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          collapse={data.isCollapse}
        ></el-menu>
      </div>
    );
  },
});

export default Sidebar;
