import { defineComponent, h, ref, onMounted, reactive, nextTick } from "vue";
import { GET, POST, Request } from "@/axios";
import { ElMessage, ElNotification } from "element-plus";
import { RefreshLeft } from "@element-plus/icons";
import Crud from "@/components/Crud";
import { ElForm } from "element-ui/types/form";
import Operations from "@/components/Operations";
import Pagination from "@/components/Pagination";
import "./medicine.scss"

interface data {
  // crud参数
  crudOption: {
    add: string;
    edit: string;
    del: string;
    editButtonStatus: boolean;
    delButtonStatus: boolean;
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

  suppliers: any;
  rules: any;
}

const Medicine = defineComponent({
  component: {},

  setup: function () {
    const data = reactive<data>({
      // crud参数
      crudOption: {
        add: "medicine:add",
        edit: "medicine:edit",
        del: "medicine:del",
        editButtonStatus: true,
        delButtonStatus: true,
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
      role: {
        medicineId: null,
        medicineName: null,
        medicineInfo: null,
        medicinePrice: 1,
        medicineSupplier: null,
      },
      suppliers: [{}],
      rules: {
        medicineName: [
          { required: true, message: "请输入药品名", trigger: "blur" },
        ],
        medicineInfo: [
          { required: true, message: "请输入药品功效", trigger: "blur" },
        ],
        medicinePrice:[ { required: true, message: "请输入药品价格", trigger: "blur" },],
        medicineSupplier: [{ required: true, trigger: "blur", message: "请选择供应商" }],
      },
    });

    onMounted(async () => {
      // $('#captcha').attr('src', captchaUrl.data.image);
      getSuppliers();
      getMedicineList();
    });

    // 获取供应商列表
    const getSuppliers = () => {
       POST(Request.supAllList,null).then(res => {
        data.suppliers = res.data.data;
      })
    };

    //用来获取roleFrom的dom
    const roleFrom = ref<ElForm>();

    // 获取药品信息数据
    const getMedicineList = async () => {
      data.tableLoading = true;
      const res = await POST(Request.medicineList, data.searchOption);
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

    // 公用 更改搜索状态
    const setSearchToggle = () => {
      console.log("切换搜索显示状态");
      data.searchToggle = !data.searchToggle;
    };
    //设置crud按钮状态
    const setCrudButtonStatus = () => {
      if (data.selection.length == 0) {
        data.crudOption.editButtonStatus = true;
        data.crudOption.delButtonStatus = true;
      } else if (data.selection.length == 1) {
        data.crudOption.editButtonStatus = false;
        data.crudOption.delButtonStatus = false;
      } else {
        data.crudOption.editButtonStatus = true;
        data.crudOption.delButtonStatus = false;
      }
    };

    //todo 导出操作
    const performCrudOperation = (method: string) => {
      data.crudMethod = method;
      if (method == "add") {
        data.dialogTitle = "添加";
        data.role={
          medicineId: null,
            medicineName: null,
            medicineInfo: null,
            medicinePrice: 1,
            medicineSupplier: null,
        }
        data.dialogStatus = true;
      } else if (method == "edit") {
        data.dialogTitle = "修改用户";
        medDetailInfo();
        data.dialogStatus = true;
      } else if (method == "del") {
        delMed();
      }
    };

    //私用 获取选中角色数据
    const medDetailInfo = () => {
      //通过nextTick对表单赋值，否则清空会失效
      nextTick(() => {
        data.role.medicineId = data.selection[0].medicineId;
        data.role.medicineName = data.selection[0].medicineName;
        data.role.medicinePrice = data.selection[0].medicinePrice;
        data.role.medicineInfo = data.selection[0].medicineInfo;
        data.suppliers.map((sup: any) => {
          if (sup.supplierName == data.selection[0].medicineSupplier){
            data.role.medicineSupplier = sup.supplierId
          }
        })
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
      getMedicineList();
    };
    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      data.searchOption.currentPage = page;
      getMedicineList();
    };

    const editMed = () => {
      POST(Request.medicineEdit, data.role).then((res) => {
        message(res);
      });
    };

    // 删除药品
    const delMed = () => {
      POST(Request.medicineDel, data.selection).then((res) => {
        message(res);
      });
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
      getMedicineList();
    };

    // 提交表单
    const submitFrom = () => {
      (roleFrom.value as ElForm).validate(async (valid) => {
        console.log(valid)
        if (valid) {
          console.log("验证成功");
          if (data.crudMethod == "add") {
            const res = await POST(Request.medicineAdd, data.role);
            message(res);
          } else if (data.crudMethod == "edit") {
            const res = await POST(Request.medicineEdit, data.role);
            message(res);
          }
        } else {
          message({
            data: {
              msg: "验证失败，请输入正确内容",
              code: 400,
            },
          });
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
                  getMedicineList();
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
                    getMedicineList();
                  }}
                >
                  重置
                </el-button>
              </span>
            </div>
          )}
          {/*crud按钮*/}
          <Crud
            crudOption={data.crudOption}
            onRefreshTable={refreshTableData}
            onSetSearchToggle={setSearchToggle}
            onPerformCrud={performCrudOperation}
          />
          {/*表格数据*/}
          <el-card
            class={"box-card"}
            shadow={"never"}
            v-slots={{
              header: () => {
                return (
                  <div class="clearfix">
                    <span class="card-span">药品列表</span>
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
              onSelectionChange={(selection: any) => {
                data.selection = selection;
                setCrudButtonStatus();
              }}
              v-slots={{
                empty: () => {
                  return <el-empty description="无数据"></el-empty>;
                },
              }}
            >
              <el-table-column
                type={"selection"}
                width={55}
                align={"center"}
                fixed={"left"}
              />
              <el-table-column
                prop={"medicineName"}
                label={"药品名"}
                align={"center"}
              />
              <el-table-column
                prop={"medicineInfo"}
                label={"药品功效"}
                align={"center"}
              />
              <el-table-column
                prop={"medicinePrice"}
                label={"药品单价"}
                align={"center"}
              />

              <el-table-column
                prop={"medicineSupplier"}
                width={"110"}
                label={"供应商"}
                align={"center"}
              />
              <el-table-column
                prop={"createUser"}
                width={"135"}
                label={"创建人"}
                align={"center"}
              />
              <el-table-column
                prop={"createTime"}
                width={"135"}
                label={"创建日期"}
                align={"center"}
              />
              <el-table-column
                prop={"updateTime"}
                width={"135"}
                label={"更新日期"}
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
            <el-form-item label={"药品名"} prop={"medicineName"}>
              <el-input
                v-model={data.role.medicineName}
                style={{ width: "450px" }}
                placeholder={"请输入药品名"}
              />
            </el-form-item>
            <el-form-item label="药品描述" prop={"medicineInfo"}>
              <el-input
                v-model={data.role.medicineInfo}
                style={{ width: "450px" }}
                rows={3}
                type={"textarea"}
              />
            </el-form-item>
            <el-form-item label={"单价"} prop={"medicinePrice"}>
              <el-input
                v-model={data.role.medicinePrice}
                min={1}
                style={{ width: "450px" }}
                placeholder={"请输入药品单价"}
                type={"number"}
              />
            </el-form-item>
            <el-form-item label={"供应商"} prop={"medicineSupplier"}>
              <el-select
                v-model={data.role.medicineSupplier}
                class="m-2"
                placeholder="请选择供应商"
                size="large"
                style={{ width: "450px" }}
              >
                {
                  data.suppliers.map((sup : any )=> {
                    return(
                      <el-option label={sup.supplierName} value={sup.supplierId} />
                    )
                  })
                }
              </el-select>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    );
  },
});
export default Medicine;
