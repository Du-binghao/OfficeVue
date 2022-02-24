import { defineComponent, h, ref, onMounted, reactive, nextTick } from "vue";
import { GET, POST, Request } from "@/axios";
import { ElMessage, ElNotification } from "element-plus";
import { RefreshLeft } from "@element-plus/icons";
import Crud from "@/components/Crud";
import { ElForm } from "element-ui/types/form";
import Operations from "@/components/Operations";
import Pagination from "@/components/Pagination";

interface data {
  // crud参数
  crudOption: {
    edit: string;
    editButtonStatus: boolean;
  };
  // crud操作方式
  crudMethod: string;
  // 查询参数
  searchOption: {
    currentPage: number;
    pageSize: number;
    searchText: string;
  };
  // 搜索框状态
  searchToggle: boolean;
  // 分页参数
  pageParam: {
    total: number;
    pages: number;
    current: number;
  };
  // 表单显示状态
  dialogStatus: boolean;
  //表单标题
  dialogTitle: string;
  // table状态
  tableLoading: boolean;
  // 返回结果
  result: any;
  //返回结果状态
  resultStatus: boolean;
  // 选择的数据
  selection: any;

  role: any;

  rules: any;

  draw: any;
}

const Index = defineComponent({
  component: {},

  setup: function () {
    const data = reactive<data>({
      // crud参数
      /* todo:权限 */
      crudOption: {
        edit: "inventory:edit",
        editButtonStatus: true,
      },
      // crud操作方式
      crudMethod: "",
      // 查询参数
      searchOption: {
        currentPage: 1,
        pageSize: 10,
        searchText: "",
      },
      // 搜索框状态
      searchToggle: true,
      // 分页参数
      pageParam: {
        total: 0,
        pages: 0,
        current: 1,
      },
      // 表单显示状态
      dialogStatus: false,
      //表单标题
      dialogTitle: "",
      // table状态
      tableLoading: false,
      // 返回结果
      result: [],
      //返回结果状态
      resultStatus: false,
      // 选择的数据
      selection: [],
      /* todo:表单提交内容 */
      role: {
        inventoryId: null,
        medicineId: null,
        inventoryCount: null,
        createTime: null,
        inventorySold: null,
      },
      draw: true,
      /* todo:表单提交规则 */
      rules: {
        inventoryCount: [
          { required: true, trigger: "blur", message: "请输入商品库存" },
        ],
      },
    });

    onMounted(async () => {
      // $('#captcha').attr('src', captchaUrl.data.image);
      /* todo:页面获取内容 */
      getList();
    });

    //用来获取roleFrom的dom
    const roleFrom = ref<ElForm>();

    // 获取药品信息数据
    const getList = async () => {
      data.tableLoading = true;
      /* todo:页面内容请求地址 */
      const res = await POST(Request.inventoryList, data.searchOption);
      if (res) {
        if (res.data.data) {
          data.result = res.data.data.records;
          data.pageParam.pages = res.data.data.pages;
          data.pageParam.total = res.data.data.total;
          data.pageParam.current = res.data.data.current;
        }
      }
      data.tableLoading = false;
      data.resultStatus = true;
    };

    //todo 导出操作
    const performCrudOperation = (method: string) => {
      data.crudMethod = method;
      data.dialogTitle = "修改药品库存";
      DetailInfo();
      data.dialogStatus = true;
    };

    //私用 获取选中角色数据
    const DetailInfo = () => {
      //通过nextTick对表单赋值，否则清空会失效
      nextTick(() => {
        /* todo:行选中设置表单内容 */
        data.role.inventoryId = data.selection[0].inventoryId;
        data.role.medicineId = data.selection[0].medicineId;
        data.role.inventoryCount = data.selection[0].inventoryCount;
        data.role.createTime = data.selection[0].createTime;
        data.role.inventorySold = data.selection[0].inventorySold;
      });
    };

    //行操作
    const onRowOperation = (rowData: any, method: string) => {
      data.selection = [];
      data.selection.push(rowData);
      performCrudOperation(method);
    };

    // 公用 刷新表格
    const refreshTableData = () => {
      getList();
    };
    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      data.searchOption.currentPage = page;
      getList();
    };

    // 公用消息
    const message = (res: any) => {
      ElMessage({
        showClose: true,
        message: res.data.msg,
        center: true,
        type: res.data.code == 200 ? "success" : "error",
      });
      data.dialogStatus = false;
      getList();
    };

    // 提交表单
    const submitFrom = () => {
      (roleFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          const res = await POST(Request.inventoryEdit, data.role);
          message(res);
        }
      });
    };

    return () => (
      <div class={"app-container"}>
        <div class={"head-container"}>
          {/*模糊查询*/}
          {data.searchToggle && (
            <div>
              <el-input
                clearable
                v-model={data.searchOption.searchText}
                size={"small"}
                placeholder={"搜索"}
                style={{ width: "200px" }}
                class={"filter-item"}
                onChange={() => {
                  getList();
                }}
              />
              <span>
                <el-button
                  class={"filter-item"}
                  size={"small"}
                  type={"warning"}
                  icon={
                    <el-icon>
                      <RefreshLeft />
                    </el-icon>
                  }
                  onClick={() => {
                    data.searchOption.searchText = "";
                    getList();
                  }}
                >
                  重置
                </el-button>
              </span>
            </div>
          )}
          {/*表格数据*/}
          <el-card
            class={"box-card"}
            shadow={"never"}
            v-slots={{
              header: () => {
                return (
                  <div class="clearfix">
                    <span class="card-span">药品库存管理</span>
                  </div>
                );
              },
            }}
          >
            <el-table
              fit={true}
              size={"small"}
              class={"user-table"}
              style={{ width: "100%" }}
              v-loading={data.tableLoading}
              data={data.resultStatus ? data.result : null}
              v-slots={{
                empty: () => {
                  return <el-empty description="无数据"></el-empty>;
                },
              }}
            >
              /* todo:设置列头信息 */
              <el-table-column
                type={"index"}
                width={55}
                align={"center"}
                fixed={"left"}
              />
              <el-table-column
                prop={"medicineId"}
                label={"药品名"}
                align={"center"}
              />
              <el-table-column
                prop={"inventoryCount"}
                label={"库存"}
                align={"center"}
              />
              <el-table-column
                prop={"inventorySold"}
                width={"110"}
                label={"已售"}
                align={"center"}
              />
              <el-table-column
                prop={"createTime"}
                label={"更新时间"}
                align={"center"}
              />
              <el-table-column
                label={"操作"}
                width={120}
                align={"center"}
                fixed={"right"}
                v-slots={{
                  default: (scope: any) => {
                    return (
                      <Operations
                        rowData={scope.row}
                        crudOption={data.crudOption}
                        onRowOperation={onRowOperation}
                      />
                    );
                  },
                }}
              ></el-table-column>
            </el-table>
            <Pagination
              pageParam={data.pageParam}
              onSetCurrentPage={onSetCurrentPage}
            />
          </el-card>
        </div>
        {/*表单渲染*/}
        <el-dialog
          title={data.dialogTitle}
          width={"580px"}
          showClose={false}
          v-model={data.dialogStatus}
          v-slots={{
            footer: () => {
              return (
                <div class={"dialog-footer"}>
                  <el-button
                    size={"small"}
                    onClick={() => {
                      (roleFrom.value as ElForm).resetFields();
                      data.dialogStatus = false;
                    }}
                  >
                    取消
                  </el-button>
                  <el-button
                    size={"small"}
                    type="primary"
                    onClick={() => {
                      submitFrom();
                    }}
                  >
                    确认
                  </el-button>
                </div>
              );
            },
          }}
        >
          <el-form
            ref={roleFrom}
            size={"small"}
            label-width={"80px"}
            inline={true}
            model={data.role}
            rules={data.rules}
          >
            {/* todo:表单内容 */}
            <el-form-item label={"药品名"} prop={"medicineId"}>
              <el-input
                v-model={data.role.medicineId}
                style={{ width: "450px" }}
                disabled
              />
            </el-form-item>

            <el-form-item label={"库存"} prop={"inventoryCount"}>
              <el-input
                v-model={data.role.inventoryCount}
                min={0}
                style={{ width: "450px" }}
                placeholder={"请输入药品库存"}
                type={"number"}
              />
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    );
  },
});
export default Index;
