import { defineComponent, onMounted, reactive, watch } from "vue";
import "./index.scss";
import {
  Delete,
  Download,
  Edit,
  Plus,
  Refresh,
  Search,
} from "@element-plus/icons";
import store from "@/store";

interface data {
  editButtonStatus: boolean;
  delButtonStatus: boolean;
}

const Crud = defineComponent({
  props: {
    crudOption: {
      type: Object,
      default: () => {
        return {};
      },
    },
    searchToggle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["refreshTable", "setSearchToggle", "performCrud"],
  setup: (props, { emit }) => {
    const data = reactive<data>({
      editButtonStatus: true,
      delButtonStatus: true,
    });
    onMounted(async () => {
      console.log("加载按钮");
    });
    // 监听菜单缩进
    watch(
      () => [
        props.crudOption.editButtonStatus,
        props.crudOption.delButtonStatus,
      ],
      () => {
        data.editButtonStatus = props.crudOption.editButtonStatus;
        data.delButtonStatus = props.crudOption.delButtonStatus;
      }
    );
    const onRefreshTable = () => {
      emit("refreshTable");
    };

    const toggleSearch = () => {
      emit("setSearchToggle", true);
    };

    const crudMethod = (method: string) => {
      console.log("执行【" + method + "】操作");
      emit("performCrud", method);
    };

    return () => (
      <div class={"crud-opts"}>
        {/*左侧按钮（新增，修改，删除，等）*/}
        <span class={"crud-opts-left"}>
          {store.state.permission.includes(props.crudOption.add) && (
            <el-button
              class={"filter-item"}
              type={"success"}
              icon={
                <el-icon>
                  <Plus />
                </el-icon>
              }
              onClick={() => crudMethod("add")}
            >
              新增
            </el-button>
          )}
          {store.state.permission.includes(props.crudOption.edit) && (
            <el-button
              class={"filter-item"}
              type={"primary"}
              icon={
                <el-icon>
                  <Edit />
                </el-icon>
              }
              disabled={data.editButtonStatus}
              onClick={() => crudMethod("edit")}
            >
              修改
            </el-button>
          )}

          {store.state.permission.includes(props.crudOption.del) && (
            <el-button
              class={"filter-item"}
              type={"danger"}
              icon={
                <el-icon>
                  <Delete />
                </el-icon>
              }
              disabled={data.delButtonStatus}
              onClick={() => crudMethod("del")}
            >
              删除
            </el-button>
          )}
        </span>

        <el-button-group class={"crud-opts-right"}>
          <el-button
            plain
            type="info"
            size="small"
            icon={
              <el-icon>
                <Search />
              </el-icon>
            }
            onClick={toggleSearch}
          />
          <el-button
            size="small"
            icon={
              <el-icon>
                <Refresh />
              </el-icon>
            }
            onClick={onRefreshTable}
          />
          <el-popover placement="bottom-end" width="150" trigger="click">
            <el-button size="mini" icon="el-icon-s-grid">
              <i class="fa fa-caret-down" aria-hidden="true" />
            </el-button>
            <el-checkbox>全选</el-checkbox>
            <el-checkbox>{{}}</el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    );
  },
});
export default Crud;
