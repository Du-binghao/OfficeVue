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

const Index = defineComponent({
  component: {},

  setup: function() {
    //验证电话号码
    const validPhone = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };

    const isvalidPhone = (phone: string) => {
      const reg = /^1[345789]\d{9}$/;
      return reg.test(phone);
    };

    const data = reactive<data>({
      // crud参数
      /* todo:权限 */
      crudOption: {
        add: "supplier:add",
        edit: "supplier:edit",
        del: "supplier:del",
        editButtonStatus: true,
        delButtonStatus: true
      },
      // crud操作方式
      crudMethod: "",
      // 查询参数
      searchOption: {
        currentPage: 1,
        pageSize: 10,
        searchText: ""
      },
      // 搜索框状态
      searchToggle: true,
      // 分页参数
      pageParam: {
        total: 0,
        pages: 0,
        current: 1
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
        supplierId: null,
        supplierName: null,
        supplierCode: 10000,
        supplierContact: null,
        contactTel: null,
        createTime: null
      },
      suppliers: [{}],
      /* todo:表单提交规则 */
      rules: {
        supplierName: [
          { required: true, message: "请输入供应商信息", trigger: "blur" }
        ],
        supplierCode: [
          { required: true, message: "请输入公司代码", trigger: "blur" }
        ],
        supplierContact: [{ required: true, message: "请输入负责人姓名", trigger: "blur" }],
        contactTel: [{ required: true, validator: validPhone, trigger: "blur" }]
      }
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
      const res = await POST(Request.supplierList, data.searchOption);
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
        /* todo:重置表单提交内容 */
        data.role = {
          supplierId: null,
          supplierName: null,
          supplierCode: 100000,
          supplierContact: null,
          contactTel: null
        };
        data.dialogStatus = true;
      } else if (method == "edit") {
        data.dialogTitle = "供货商信息修改";
        DetailInfo();
        data.dialogStatus = true;
      } else if (method == "del") {
        del();
      }
    };

    //私用 获取选中角色数据
    const DetailInfo = () => {
      //通过nextTick对表单赋值，否则清空会失效
      nextTick(() => {
        /* todo:行选中设置表单内容 */
        data.role.supplierId = data.selection[0].supplierId;
        data.role.supplierName = data.selection[0].supplierName;
        data.role.supplierCode = data.selection[0].supplierCode;
        data.role.supplierContact = data.selection[0].supplierContact;
        data.role.contactTel = data.selection[0].contactTel;
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

    // 删除药品
    const del = () => {
      POST(Request.supplierDel, data.selection).then((res) => {
        message(res);
      });
    };

    // 公用消息
    const message = (res: any) => {
      ElMessage({
        showClose: true,
        message: res.data.msg,
        center: true,
        type: res.data.code == 200 ? "success" : "error"
      });
      data.dialogStatus = false;
      getList();
    };

    // 提交表单
    const submitFrom = () => {
      (roleFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          if (data.crudMethod == "add") {
            const res = await POST(Request.supplierAdd, data.role);
            message(res);
          } else if (data.crudMethod == "edit") {
            const res = await POST(Request.supplierEdit, data.role);
            message(res);
          }
        } else {
          message({
            data: {
              msg: "验证失败，请输入正确内容",
              code: 400
            }
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
                    <span class="card-span">供应商列表</span>
                  </div>
                );
              }
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
                }
              }}
            >
              /* todo:设置列头信息 */
              <el-table-column
                type={"selection"}
                width={55}
                align={"center"}
                fixed={"left"}
              />
              <el-table-column
                prop={"supplierName"}
                label={"供应商"}
                min-width={"135"}
                align={"center"}
              />
              <el-table-column
                prop={"supplierCode"}
                label={"公司代码"}
                min-width={"135"}
                align={"center"}
              />
              <el-table-column
                prop={"supplierContact"}
                label={"负责人"}
                min-width={"135"}
                align={"center"}
              />

              <el-table-column
                prop={"contactTel"}
                min-width={"135"}
                label={"联系电话"}
                align={"center"}
              />
              <el-table-column
                prop={"createTime"}
                min-width={"135"}
                label={"创建日期"}
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
                  }
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
            }
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
            <el-form-item label={"供货商"} prop={"supplierName"}>
              <el-input
                v-model={data.role.supplierName}
                style={{ width: "450px" }}
                placeholder={"请输入供货商信息"}
              />
            </el-form-item>
            <el-form-item label="公司代码" prop={"supplierCode"}>
              <el-input
                v-model={data.role.supplierCode}
                style={{ width: "450px" }}
                type={"number"}
                min={100000}
              />
            </el-form-item>
            <el-form-item label={"负责人"} prop={"supplierContact"}>
              <el-input
                v-model={data.role.supplierContact}
                style={{ width: "450px" }}
                placeholder={"请输入负责人信息"}
              />
            </el-form-item>
            <el-form-item label={"TEL"} prop={"contactTel"}>
              <el-input
                v-model={data.role.contactTel}
                style={{ width: "450px" }}
                placeholder={"请输入负责人联系方式"}
              />
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    );
  }
});
export default Index;
