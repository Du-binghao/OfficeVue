// @ts-nocheck
import { defineComponent } from "vue";
import "./index.scss";
import SvgIcon from "@/components/SvgIcon";
import sf from "screenfull";

const ScreenFull = defineComponent({
  setup: function () {
    return () => (
      <div>
        <SvgIcon
          iconName={sf.isFullscreen ? "exit-fullscreen" : "fullscreen"}
          class="svg-icon"
          onClick={() => {
            if (!sf.isEnabled) {
              this.$message({
                message: "you browser can not work",
                type: "warning",
              });
              return false;
            }
            sf.toggle();
          }}
        />
      </div>
    );
  },
});

export default ScreenFull;
