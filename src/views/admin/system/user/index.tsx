import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { POST, Request } from "@/axios";
import Crud from "@/components/Crud";
import "./index.scss";
import { RefreshLeft } from "@element-plus/icons";
import { ElMessageBox, ElNotification } from "element-plus/es";
import Operations from "@/components/Operations";
import Pagination from "@/components/Pagination";
import { ElForm } from "element-ui/types/form";
import store from "@/store";

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
    user: any;
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
  //校验规则
  rules: any;
  // 角色选择列表
  roleList: any;
  // table状态
  tableLoading: boolean;
  // 更改状态参数
  changeStatus: {
    loading: boolean;
    scopeId: number;
  };
  // 选择的数据
  selection: any;
  //返回结果
  result: any;
  //返回结果状态
  resultStatus: boolean;
  // 用户信息
  user: {
    userId: any;
    userName: string;
    nickName: string;
    phone: string;
    email: string;
    sex: string;
    status: number;
    roleId: any;
    roleName: string;
    description: string;
  };
}

const user = defineComponent({
  setup(props) {
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
      const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/;
      return reg.test(phone);
    };
    // 页面数据
    const data = reactive<data>({
      // crud参数
      crudOption: {
        add: "user:add",
        edit: "user:edit",
        del: "user:del",
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
        user: {
          default: () => {
            return {};
          },
        },
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
      //校验规则
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        phone: [{ required: true, trigger: "blur", validator: validPhone }],
      },
      // 角色选择列表
      roleList: [
        {
          roleId: 0,
          roleName: "",
          description: "",
        },
      ],
      // table状态
      tableLoading: false,
      // 更改状态参数
      changeStatus: {
        loading: false,
        scopeId: 0,
      },
      // 选择的数据
      selection: [],
      //返回结果
      result: [{}],
      //返回结果状态
      resultStatus: false,
      // 用户信息
      user: {
        userId: null,
        userName: "",
        nickName: "",
        phone: "",
        email: "",
        sex: "1",
        status: 1,
        roleId: null,
        roleName: "",
        description: "",
      },
    });
    // 公用 加载页面数据
    onMounted(() => {
      getUserList();
    });
    //用来获取userFrom的dom
    const userFrom = ref<ElForm>();
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
        data.dialogTitle = "添加用户";
        data.dialogStatus = true;
        getRoleList();
      } else if (method == "edit") {
        data.dialogTitle = "修改用户";
        data.dialogStatus = true;
        data.user.userId = data.selection[0].userId;
        userDetailInfo();
      } else if (method == "del") {
        delUsers();
      }
    };
    // 公用 刷新表格
    const refreshTableData = () => {
      console.log("刷新数据【用户管理页面：" + data.pageParam.current + "】");
      getUserList();
    };
    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      console.log("切换数据【用户管理页面：" + page + "】");
      data.searchOption.currentPage = page;
      getUserList();
    };
    //提交表单验证
    const submitFrom = () => {
      (userFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          console.log("验证成功");
          if (data.crudMethod == "add") {
            const res = await POST(Request.userAdd, data.user);
            if (res) {
              if (res.data.code == 200) {
                (userFrom.value as ElForm).resetFields();
                ElNotification({
                  title: "用户名【" + res.data.data + "】" + res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                getUserList();
              } else {
                ElNotification({
                  title: res.data.data
                    ? "用户名【" + res.data.data + "】" + res.data.msg
                    : res.data.msg,
                  type: "error",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
              }
            }
          } else if (data.crudMethod == "edit") {
            const res = await POST(Request.userEdit, data.user);
            if (res) {
              if (res.data.code == 200) {
                (userFrom.value as ElForm).resetFields();
                ElNotification({
                  title: "用户名【" + res.data.data + "】" + res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                getUserList();
              } else {
                ElNotification({
                  title: res.data.data
                    ? "用户名【" + res.data.data + "】" + res.data.msg
                    : res.data.msg,
                  type: "error",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
              }
            }
          }
        } else {
          ElNotification({
            title: "验证失败，请输入正确内容",
            type: "error",
            duration: 1500,
            showClose: false,
            offset: 90,
          });
        }
      });
    };
    //私用 获取用户列表
    const getUserList = async () => {
      data.tableLoading = true;
      const res = await POST(Request.userList, data.searchOption);
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
    //私用 获取角色列表
    const getRoleList = async () => {
      console.log("获取全部角色");
      const res = await POST(Request.roleAll, null);
      if (res) {
        data.roleList = res.data.data;
      }
    };
    // 设置不可选中
    const checkSelection = (row: any, index: number) => {
      let isChecked = true;
      if (row.userId == 1 || row.userId == store.state.loginUser.userId) {
        // 判断里面是否存在某个参数
        isChecked = false;
      } else {
        isChecked = true;
      }
      return isChecked;
    };
    //私用 获取选中用户数据
    const userDetailInfo = () => {
      //通过nextTick对表单赋值，否则清空会失效
      nextTick(() => {
        data.user.userName = data.selection[0].userName;
        data.user.email = data.selection[0].email;
        data.user.phone = data.selection[0].phone;
        data.user.nickName = data.selection[0].nickName;
        data.user.sex = data.selection[0].sex;
        data.user.status = data.selection[0].status;
        getRoleList().then(async () => {
          await POST(Request.getRoleUser, data.user).then((response) => {
            data.roleList.find(function (role: any) {
              if (role.roleId == response.data.data.roleId) {
                data.user.roleId = role.roleId;
              }
            });
          });
        });
      });
    };
    //私用 状态开关插槽及操作
    const scopedSlots = (scope: any) => {
      var enable = scope.row.status == 1;
      let enableText = enable ? "禁用" : "激活";
      return (
        <el-switch
          // 初步加载开关动画
          inActiveValue={enable}
          v-model={enable}
          active-color={"#409EFF"}
          // active-color={"#13ce66"}
          inactive-color={"#F56C6C"}
          disabled={scope.row.userName == "admin"}
          loading={
            data.changeStatus.loading &&
            scope.row.userId == data.changeStatus.scopeId
          }
          beforeChange={() => {
            data.changeStatus.scopeId = scope.row.userId;
            data.changeStatus.loading = true;
            return true;
          }}
          onChange={() => {
            ElMessageBox.confirm(
              "此操作将" +
                enableText +
                "账户【" +
                scope.row.userName +
                "】，是否" +
                enableText +
                "？",
              "警告",
              {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(async () => {
                if (scope.row.status) {
                  scope.row.status = 0;
                } else {
                  scope.row.status = 1;
                }
                const res = await POST(Request.userEdit, scope.row);
                if (res.data.code == 200) {
                  ElNotification({
                    title: enableText + "成功!",
                    type: "success",
                    duration: 1500,
                    showClose: false,
                    offset: 90,
                  });
                  refreshTableData();
                  data.changeStatus.scopeId = 0;
                  data.changeStatus.loading = false;
                } else {
                  ElNotification({
                    title: enableText + "失败!",
                    message: res.data.message,
                    type: "error",
                    duration: 3000,
                    showClose: false,
                    offset: 90,
                  });
                  if (scope.row.status) {
                    scope.row.status = 0;
                  } else {
                    scope.row.status = 1;
                  }

                  data.changeStatus.scopeId = 0;
                  data.changeStatus.loading = false;
                }
              })
              .catch(() => {
                data.changeStatus.scopeId = 0;
                data.changeStatus.loading = false;
              });
          }}
        />
      );
    };
    //删除用户
    const delUsers = async () => {
      const res = await POST(Request.userDel, data.selection);
      if (res) {
        if (res.data.code == 200) {
          ElNotification({
            title: "删除成功",
            type: "success",
            duration: 1500,
            showClose: false,
            offset: 90,
          });
          refreshTableData();
        } else {
          ElNotification({
            title: "删除失败",
            type: "error",
            duration: 2000,
            showClose: false,
            offset: 90,
          });
        }
      }
    };
    //行操作
    const onRowOperation = (rowData: any, method: string) => {
      data.selection = [];
      data.selection.push(rowData);
      performCrudOperation(method);
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
                  getUserList();
                }}
              />
              {/*  <date-range-picker class="date-item" />*/}
              <span>
                <el-button
                  class={"filter-item"}
                  size={"mini"}
                  type={"warning"}
                  icon={
                    <el-icon>
                      <RefreshLeft />
                    </el-icon>
                  }
                  onClick={() => {
                    data.searchOption.searchText = "";
                    getUserList();
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
                      (userFrom.value as ElForm).resetFields();
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
            ref={userFrom}
            size={"small"}
            label-width={"66px"}
            inline={true}
            model={data.user}
            rules={data.rules}
          >
            <el-form-item label={"用户名"} prop={"userName"}>
              <el-input v-model={data.user.userName} />
            </el-form-item>
            <el-form-item label={"电话"} prop={"phone"}>
              <el-input v-model={data.user.phone} />
            </el-form-item>
            <el-form-item label={"昵称"} prop={"nickName"}>
              <el-input v-model={data.user.nickName} />
            </el-form-item>
            <el-form-item label={"邮箱"} prop={"email"}>
              <el-input v-model={data.user.email} />
            </el-form-item>

            <el-form-item label={"性别"} prop={"sex"}>
              <el-radio-group
                style={{ width: "190px" }}
                v-model={data.user.sex}
              >
                <el-radio label={"1"}>男</el-radio>
                <el-radio label={"0"}>女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label={"状态"} prop={"status"}>
              <el-radio-group
                style={{ width: "190px" }}
                v-model={data.user.status}
              >
                <el-radio label={1}>激活</el-radio>
                <el-radio label={0}>禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              style={{ marginBottom: "0px" }}
              label="角色"
              prop={"roleId"}
            >
              <el-select
                style={{ width: "460px" }}
                placeholder={"请选择"}
                v-model={data.user.roleId}
              >
                {data.roleList.map((item: any) => {
                  return (
                    <el-option value={item.roleId} label={item.description} />
                  );
                })}
              </el-select>
            </el-form-item>
          </el-form>
        </el-dialog>
        {/*表格数据*/}
        <el-card
          class={"box-card"}
          shadow={"never"}
          v-slots={{
            header: () => {
              return (
                <div class="clearfix">
                  <span class="card-span">用户列表</span>
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
              selectable={checkSelection}
            />
            <el-table-column
              prop={"userName"}
              label={"用户名"}
              align={"center"}
            />
            <el-table-column
              prop={"nickName"}
              label={"昵称"}
              align={"center"}
            />
            <el-table-column
              prop={"description"}
              label={"角色"}
              align={"center"}
            />
            <el-table-column
              prop={"sex"}
              // width={"100"
              label={"性别"}
              align={"center"}
              formatter={(scope: any) => {
                return scope.sex == 1 ? (
                  <el-tag size={"small"} effect={"plain"}>
                    男
                  </el-tag>
                ) : (
                  <el-tag size={"small"} type={"danger"} effect={"plain"}>
                    女
                  </el-tag>
                );
              }}
            />
            <el-table-column
              prop={"phone"}
              width={"110"}
              label={"电话"}
              align={"center"}
            />
            <el-table-column
              prop={"email"}
              width={"180"}
              label={"邮箱"}
              align={"center"}
            />

            <el-table-column
              prop={"status"}
              // width={"100"
              label={"状态"}
              align={"center"}
            >
              {scopedSlots}
            </el-table-column>
            <el-table-column
              prop={"createUser"}
              width={"135"}
              label={"创建人"}
              align={"center"}
            />
            <el-table-column
              prop={"updateUser"}
              width={"135"}
              label={"更新人"}
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
    );
  },
});
export default user;
