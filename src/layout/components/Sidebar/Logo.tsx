import "./Logo.scss";
import { adminImg } from "@/public";

import { defineComponent } from "vue";

const Logo = defineComponent({

  setup: function () {
    return () => (
      <div class="sidebar-logo-container">
        <transition name={"sidebarLogoFade"}>
          <router-link class="sidebar-logo-link router-link-active" to="/" >
            <img src={adminImg.logo} class="sidebar-logo" />
            <h1 class="sidebar-title">后台管理</h1>
          </router-link>
        </transition>
      </div>
    );
  },
});

export default Logo;
