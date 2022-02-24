import { defineComponent, reactive } from "vue";
import "./index.scss";
import SvgIcon from "@/components/SvgIcon";
import { CountTo } from "vue3-count-to";

// 子组件向父组件传值到dashboard
const menu = defineComponent({
  components: { CountTo },
  // 监听数据
  emits: ["setLineChartData"],
  setup: function(props, { emit }) {

    const handleSetLineChartData = (type: string) => {
      emit("setLineChartData", type);
    };

    return () => (
      <el-row gutter={40} class={"panel-group"}>
        <el-col xs={24} sm={24} lg={12} class={"card-panel-col"}>
          <div
            class="card-panel"
          >
            {/*子组件*/}
            <div class="card-panel-icon-wrapper icon-people">
              <SvgIcon
                iconName={"peoples"}
                class={"svg-icon card-panel-icon"}
                style={{ fill: "currentColor" }}
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">平台用户</div>
              <div class={"card-div"}>
                <CountTo
                  startVal={0}
                  endVal={9280}
                  duration={2600}
                  class={"card-panel-num"}
                ></CountTo>
              </div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">药品数量</div>
              <div class={"card-div"}>
                <CountTo
                  startVal={0}
                  endVal={9280}
                  duration={2600}
                  class={"card-panel-num"}
                ></CountTo>
              </div>
            </div>
          </div>
        </el-col>
        <el-col xs={24} sm={24} lg={12} class={"card-panel-col"}>
          <div
            class="card-panel"
          >
            <div class="card-panel-icon-wrapper icon-money">
              <SvgIcon
                iconName={"money"}
                class={"svg-icon card-panel-icon"}
                style={{ fill: "currentColor" }}
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">总消费金额</div>
              <div class={"card-div"}>
                <CountTo
                  startVal={0}
                  endVal={9280}
                  duration={2600}
                  class={"card-panel-num"}
                ></CountTo>
              </div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">总订单量</div>
              <div class={"card-div"}>
                <CountTo
                  startVal={0}
                  endVal={9280}
                  duration={2600}
                  class={"card-panel-num"}
                ></CountTo>
              </div>
            </div>

          </div>

        </el-col>

      </el-row>
    );
  }
});
export default menu;
