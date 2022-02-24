import { defineComponent } from "vue";
import SvgIcon from "@/components/SvgIcon";
import "./index.scss";

const HeadSearch = defineComponent({
  setup: function () {
    return () => (
      <div class="header-search">
        <SvgIcon class="svg-icon search-icon" iconName={"search"} />
        <el-select
          ref="headerSearchSelect"
          filterable
          default-first-option
          remote
          placeholder="Search"
          class="header-search-select"
        >
          <el-option />
        </el-select>
      </div>
    );
  },
});

export default HeadSearch;
