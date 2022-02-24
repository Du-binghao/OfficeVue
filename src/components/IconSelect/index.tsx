import { defineComponent, onMounted, reactive, watch } from "vue";
import "./index.scss";
import SvgIcon from "@/components/SvgIcon";
import { CaretTop, Search } from "@element-plus/icons";
import icons from "@/components/IconSelect/icons";
import store from "@/store";

interface data {
  iconList: any;
  searchName: string;
}
const IconSelect = defineComponent({
  component: {
    SvgIcon: SvgIcon,
  },
  emits: ["selectedIcon"],
  setup: (props, { emit }) => {
    const data = reactive<data>({
      iconList: icons,
      searchName: "",
    });
    onMounted(() => {
      console.log("加载图标选择框");
    });
    watch(
      // 监听菜单缩进
      () => data.searchName,
      () => {
        searchIcon();
      }
    );
    const selectedIcon = (item: string) => {
      emit("selectedIcon", item);
    };

    const searchIcon = () => {
      data.iconList = icons;
      if (data.searchName) {
        data.iconList = data.iconList.filter((item: string) =>
          item.includes(data.searchName)
        );
      }
    };

    return () => (
      <div class={"icon-body"}>
        <el-input
          style={{ position: "relative" }}
          clearable
          placeholder={"请输入图标名称"}
          v-model={data.searchName}
          v-slots={{
            suffix: () => {
              return (
                <el-icon class={"el-icon-search el-input__icon"}>
                  <Search />
                </el-icon>
              );
            },
          }}
        ></el-input>
        <div class="icon-list">
          {data.iconList.map((item: string, index: number) => {
            return (
              <div key={index} onClick={() => selectedIcon(item)}>
                <SvgIcon
                  iconName={item}
                  style={{ width: "25px", height: "25px", fill: "#bfbfbf" }}
                />
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});

export default IconSelect;
