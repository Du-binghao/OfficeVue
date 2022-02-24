import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { POST, Request } from "@/axios";
import { RefreshLeft } from "@element-plus/icons";
import Crud from "@/components/Crud";
import { ElForm } from "element-ui/types/form";
import Pagination from "@/components/Pagination";
import Operations from "@/components/Operations";
import { ElTree } from "element-ui/types/tree";
import store from "@/store";
import { ElNotification } from "element-plus/es";

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
    menu: any;
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
  // table状态
  tableLoading: boolean;
  // 返回结果
  result: any;
  //返回结果状态
  resultStatus: boolean;
  // 选择的数据
  selection: any;
  //role
  role: {
    roleId: any;
    roleName: string;
    description: string;
  };

  //接收菜单
  menuList: any;
  //选中行的角色ID
  currentRoleId: any;
  //tree选择框展示状态
  checkBoxStatus: boolean;
  //默认选中的TreeId
  menuIds: any;
  //修改权限状态
  roleMenuPermission: boolean;
}

const role = defineComponent({
  setup() {
    const data = reactive<data>({
      // crud参数
      crudOption: {
        add: "role:add",
        edit: "role:edit",
        del: "role:del",
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
        menu: {
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
      //检验规则
      rules: {
        roleName: [
          { required: true, message: "请输入角色标识", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // table状态
      tableLoading: false,
      // 返回结果
      result: [],
      //返回结果状态
      resultStatus: false,
      // 选择的数据
      selection: [],
      //role
      role: {
        roleId: null,
        roleName: "",
        description: "",
      },
      // 接收menu
      menuList: [],
      //选中行的角色ID
      currentRoleId: null,
      //tree展示状态
      checkBoxStatus: false,
      //默认选中的TreeId
      menuIds: [],
      //修改权限状态
      roleMenuPermission: false,
    });
    //用来获取roleFrom的dom
    const roleFrom = ref<ElForm>();
    //菜单树
    const menu = ref<ElTree<any, any>>();
    // 公用 加载页面数据
    onMounted(() => {
      getRoleList();
      data.roleMenuPermission =
        store.state.permission.includes("role:menu:change");
    });

    //监听权限并更新状态
    watch(
      () => store.state.permission,
      () => {
        data.roleMenuPermission =
          store.state.permission.includes("role:menu:change");
      }
    );
    //监听角色权限并刷新tree数据
    watch(
      () => data.menuIds,
      (menuIds) => {
        nextTick(() => {
          menu.value?.setCheckedKeys(menuIds);
        });
      }
    );
    //监听是否有用户被选中
    watch(
      () => data.currentRoleId,
      (currentId) => {
        if (currentId) {
          data.checkBoxStatus = true;
        } else {
          data.checkBoxStatus = false;
        }
      }
    );
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
    // todo 导出操作
    const performCrudOperation = (method: string) => {
      data.crudMethod = method;
      if (method == "add") {
        data.dialogTitle = "添加角色";
        data.dialogStatus = true;
      } else if (method == "edit") {
        data.dialogTitle = "修改角色";
        data.dialogStatus = true;
        data.role.roleId = data.selection[0].roleId;
        roleDetailInfo();
      } else if (method == "del") {
        delRoles();
      } else if (method == "export") {
      }
    };
    // 公用 刷新表格
    const refreshTableData = () => {
      data.currentRoleId = null;
      console.log("刷新数据");
      data.tableLoading = true;
      setTimeout(() => {
        data.result = [];
        getRoleList();
        data.tableLoading = false;
      }, 500);
    };
    //获取role数据
    const getRoleList = async () => {
      data.tableLoading = true;
      const res = await POST(Request.roleList, data.searchOption);
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
    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      console.log("切换数据【角色管理页面：" + page + "】");
      data.searchOption.currentPage = page;
      getRoleList();
    };
    //加载node节点
    const loadNode = (node: any, resolve: any) => {
      getMenuNode(node, resolve);
    };
    //获取节点菜单
    const getMenuNode = async (node: any, resolve: any) => {
      if (node.level == 0) {
        const res = await POST(Request.lazyMenu, {
          menuId: 0,
        });
        if (res) {
          if (res.data.data) {
            resolve(res.data.data);
          }
        }
      } else {
        setTimeout(async () => {
          const res = await POST(Request.lazyMenu, {
            menuId: node.data.menuId,
          });
          resolve(res.data.data);
        }, 300);
      }
    };
    // 选择角色后自动加载已存在权限
    const setDefaultMenuIds = async (currentRow: any) => {
      if (currentRow) {
        await POST(Request.roleMenuList, {
          roleId: currentRow.roleId,
        }).then((res) => {
          data.menuIds = res.data.data;
          data.currentRoleId = currentRow.roleId;
        });
      } else {
        data.menuIds = [];
      }
    };
    //更改角色权限
    const roleMenuChange = async (nodes: any) => {
      const res = await POST(Request.roleMenuChange, {
        roleId: data.currentRoleId,
        menuId: nodes.menuId,
      });
      if (res) {
        if (res.data.code == 200) {
          ElNotification({
            title: "修改成功",
            type: "success",
            duration: 1500,
            showClose: false,
            offset: 90,
          });
        } else {
          ElNotification({
            title: "删除失败",
            message:
              "删除用户名【" + res.data.data.userName + "】" + res.data.msg,
            type: "error",
            duration: 2000,
            showClose: false,
            offset: 90,
          });
        }
      }
    };
    // 提交表单
    const submitFrom = () => {
      (roleFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          console.log("验证成功");
          if (data.crudMethod == "add") {
            const res = await POST(Request.roleAdd, data.role);
            if (res) {
              if (res.data.code == 200) {
                (roleFrom.value as ElForm).resetFields();
                ElNotification({
                  title: "角色【" + res.data.data + "】" + res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                getRoleList();
              } else {
                ElNotification({
                  title: res.data.data
                    ? "角色【" + res.data.data + "】" + res.data.msg
                    : res.data.msg,
                  type: "error",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
              }
            }
          } else if (data.crudMethod == "edit") {
            const res = await POST(Request.roleEdit, data.role);
            if (res) {
              if (res.data.code == 200) {
                (roleFrom.value as ElForm).resetFields();
                ElNotification({
                  title: "角色【" + res.data.data + "】" + res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                getRoleList();
              } else {
                ElNotification({
                  title: res.data.data
                    ? "角色【" + res.data.data + "】" + res.data.msg
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

    //私用 获取选中角色数据
    const roleDetailInfo = () => {
      //通过nextTick对表单赋值，否则清空会失效
      nextTick(() => {
        data.role.roleName = data.selection[0].roleName;
        data.role.description = data.selection[0].description;
      });
    };
    //删除用户
    const delRoles = async () => {
      const res = await POST(Request.roleDel, data.selection);
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
                  getRoleList();
                }}
              />
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
                    getRoleList();
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
            <el-form-item label={"角色标识"} prop={"roleName"}>
              <el-input
                v-model={data.role.roleName}
                style={{ width: "450px" }}
                placeholder={"角色标识"}
              />
            </el-form-item>
            <el-form-item label="描述信息" prop="description">
              <el-input
                v-model={data.role.description}
                style={{ width: "450px" }}
                rows={10}
                type={"textarea"}
              />
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-row gutter={15}>
          <el-col
            xs={24}
            sm={24}
            md={data.roleMenuPermission ? 16 : 24}
            lg={data.roleMenuPermission ? 16 : 24}
            xl={data.roleMenuPermission ? 17 : 24}
            style={{ marginBottom: "10px" }}
          >
            <el-card
              class={"box-card"}
              shadow={"never"}
              v-slots={{
                header: () => {
                  return (
                    <div class={"clearfix"}>
                      <span class={"card-span"}>角色列表</span>
                    </div>
                  );
                },
              }}
            >
              <el-table
                fit={true}
                size={"small"}
                class={"role-table"}
                style={{ width: "100%" }}
                highlightCurrentRow={true}
                v-loading={data.tableLoading}
                data={data.resultStatus ? data.result : null}
                onSelectionChange={(selection: any) => {
                  data.selection = selection;
                  setCrudButtonStatus();
                }}
                //点击行事件
                onCurrentChange={(currentRow: any, oldCurrentRow: any) => {
                  setDefaultMenuIds(currentRow);
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
                  prop={"roleName"}
                  label={"角色标识"}
                  width={135}
                />
                <el-table-column
                  prop={"description"}
                  label={"规则描述"}
                  showOverflowTooltip={true}
                />
                <el-table-column
                  prop={"createTime"}
                  label={"创建时间"}
                  width={135}
                  showOverflowTooltip={true}
                />
                <el-table-column
                  prop={"updateTime"}
                  label={"修改时间"}
                  width={135}
                  showOverflowTooltip={true}
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
          </el-col>

          {/*权限tree*/}
          {data.roleMenuPermission && (
            <el-col xs={24} sm={24} md={8} lg={8} xl={7}>
              <el-card
                class={"box-card"}
                shadow={"never"}
                v-slots={{
                  header: () => {
                    return (
                      <el-tooltip
                        class={"item"}
                        effect={"dark"}
                        content={"点击角色所在行分配菜单权限"}
                        placement={"top"}
                      >
                        <span class={"card-span"}>权限分配</span>
                      </el-tooltip>
                    );
                  },
                }}
              >
                <el-tree
                  props={{
                    id: (node: any) => {
                      return node.menuId;
                    },
                    label: (node: any) => {
                      return node.menuName;
                    },
                    isLeaf: (node: any) => {
                      return node.hasChildren > 0 ? false : true;
                    },
                  }}
                  ref={menu}
                  lazy={true}
                  load={loadNode}
                  nodeKey={"id"}
                  setCheckedNodes={data.menuIds}
                  check-strictly={true}
                  showCheckbox={data.checkBoxStatus}
                  node-key={"menuId"}
                  onCheck={(nodes: any) => {
                    roleMenuChange(nodes);
                  }}
                />
              </el-card>
            </el-col>
          )}
        </el-row>
      </div>
    );
  },
});
export default role;
