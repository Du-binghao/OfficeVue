import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import "./index.scss";
import store from "@/store";
import {
  Delete,
  Edit,
  Plus,
  RefreshLeft,
  WarningFilled,
} from "@element-plus/icons";
import { ElForm } from "element-ui/types/form";
import { ElPopover } from "element-ui/types/popover";

interface data {
  visible: boolean;
}
const Operations = defineComponent({
  props: {
    crudOption: {
      type: Object,
      default: () => {
        return {};
      },
    },
    msg: {
      type: String,
      default: "确定删除本条数据吗？",
    },
    rowData: {},
  },
  emits: ["rowOperation"],
  setup: (props, { emit }) => {
    const data = reactive<data>({
      visible: false,
    });
    onMounted(() => {
      // console.logs("加载操作");
    });

    const rowOperation = (rowData: any, method: string) => {
      emit("rowOperation", rowData, method);
    };

    return () => (
      <div>
        {store.state.permission.includes(props.crudOption.edit) && (
          <el-button
            size={"mini"}
            type={"success"}
            plain
            icon={
              <el-icon>
                <Edit />
              </el-icon>
            }
            onClick={() => rowOperation(props.rowData, "edit")}
          />
        )}

        {store.state.permission.includes(props.crudOption.del) && (
          <el-popconfirm
            title={props.msg}
            iconColor={"red"}
            icon={
              <el-icon>
                <WarningFilled />
              </el-icon>
            }
            onConfirm={() => {
              rowOperation(props.rowData, "del");
            }}
            v-slots={{
              reference: () => {
                return (
                  <el-button
                    plain
                    type={"danger"}
                    size={"mini"}
                    icon={
                      <el-icon>
                        <Delete />
                      </el-icon>
                    }
                  />
                );
              },
            }}
          >
            <></>
          </el-popconfirm>
        )}
      </div>
    );
  },
});

export default Operations;
