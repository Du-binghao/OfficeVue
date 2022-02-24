import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import "./index.scss";
import { RefreshLeft, Search } from "@element-plus/icons";
import Crud from "@/components/Crud";
import IconSelect from "@/components/IconSelect";
import { ElForm } from "element-ui/types/form";
import SvgIcon from "@/components/SvgIcon";
import TreeSelect from "@/components/TreeSelect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import Operations from "@/components/Operations";
import { POST, Request } from "@/axios";
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
  // menu
  menu: {
    menuId: any;
    type: any;
    sort: number;
    icon: string;
    menuName: string;
    permission: string;
    url: string;
    parentId: any;
    parentName: string;
  };
  //图标选择弹出框是否显示
  showPopover: boolean;
}

interface User {
  id: number;
  date: string;
  name: string;
  hasChildren?: boolean;
  children?: User[];
}

const menu = defineComponent({
  setup: function () {
    // 页面数据
    const data = reactive<data>({
      // crud参数
      crudOption: {
        add: "menu:add",
        edit: "menu:edit",
        del: "menu:del",
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
        menu: {},
      },
      // 搜索框状态
      searchToggle: true,
      // 表单显示状态
      dialogStatus: false,
      //表单标题
      dialogTitle: "",
      // table状态
      tableLoading: false,
      // 返回结果
      result: [
        {
          menuId: 0,
          menuName: "所有目录",
          hasChildren: false,
        },
      ],
      //返回结果状态
      resultStatus: false,
      // 选择的数据
      selection: [],
      // menu
      menu: {
        menuId: null,
        type: 0,
        sort: 0,
        icon: "",
        menuName: "",
        permission: "",
        url: "",
        parentId: 0,
        parentName: "",
      },
      //图标选择弹出框是否显示
      showPopover: false,
    });
    //用来获取menuFrom的dom
    const menuFrom = ref<ElForm>();
    // 公用 加载页面数据
    onMounted(() => {
      getMenuList();
    });
    // todo 图片选择收回
    watch(
      () => data.dialogStatus,
      () => {
        data.showPopover = false;
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
        data.dialogTitle = "添加菜单";
        data.dialogStatus = true;
      } else if (method == "edit") {
        data.dialogTitle = "修改菜单";
        data.dialogStatus = true;
        data.menu.menuId = data.selection[0].roleId;
        menuDetailInfo();
      } else if (method == "del") {
        delMenus();
      } else if (method == "export") {
      }
    };
    // 公用 刷新表格
    const refreshTableData = () => {
      console.log("刷新数据");
      data.tableLoading = true;
      setTimeout(() => {
        data.result = [];
        getMenuList();
        data.tableLoading = false;
      }, 500);
    };
    //获取menu数据
    const getMenuList = async () => {
      console.log("获取菜单数据");
      data.resultStatus = false;
      const res = await POST(Request.lazyMenu, { menuId: 0 });
      if (res) {
        if (res.data.data) {
          data.result = res.data.data;
        }
      }
      data.tableLoading = false;
      data.resultStatus = true;
    };

    //提交表单
    const submitFrom = () => {
      console.log("提交表单");
      (menuFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          console.log("验证成功");
          if (data.crudMethod == "add") {
            const res = await POST(Request.menuAdd, data.menu);
            if (res) {
              if (res.data.code == 200) {
                (menuFrom.value as ElForm).resetFields();
                ElNotification({
                  title: "菜单【" + res.data.data + "】" + res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                data.menu.menuName = "";
                getMenuList();
              } else {
                ElNotification({
                  title: res.data.data
                    ? "菜单【" + res.data.data + "】" + res.data.msg
                    : res.data.msg,
                  type: "error",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
              }
            }
          } else if (data.crudMethod == "edit") {
            const res = await POST(Request.menuEdit, data.menu);
            if (res) {
              if (res.data.code == 200) {
                (menuFrom.value as ElForm).resetFields();
                ElNotification({
                  title: "菜单【" + res.data.data + "】" + res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                data.menu.menuName = "";
                getMenuList();
              } else {
                ElNotification({
                  title: res.data.data
                    ? "菜单【" + res.data.data + "】" + res.data.msg
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
    //treeSelect 回调方法
    const onSelectIcon = (iconName: string) => {
      data.menu.icon = iconName;
      data.showPopover = false;
    };
    //选择上级目录节点
    const onChooseNode = (node: any) => {
      data.menu.parentName = node.label;
      data.menu.parentId = node.id;
    };
    //加载table子节点
    const lodeChildrenMenu = async (
      row: any,
      treeNode: unknown,
      resolve: any
    ) => {
      const res = await POST(Request.lazyMenu, { menuId: row.menuId });
      setTimeout(() => {
        resolve(res.data.data);
      }, 300);
    };
    //图表展示插槽
    const scopeIcon = (scope: any) => {
      if (scope.row.icon) {
        return (
          <SvgIcon
            iconName={scope.row.icon}
            style={{ width: "15px", height: "15px", fill: "#bfbfbf" }}
          ></SvgIcon>
        );
      }
    };

    //私用 获取选中菜单数据
    const menuDetailInfo = async () => {
      const res = await POST(Request.getMenuParent, data.selection[0]);
      if (res) {
        if (res.data.code == 200) {
          nextTick(() => {
            data.menu.menuId = data.selection[0].menuId;
            data.menu.menuName = data.selection[0].menuName;
            data.menu.type = data.selection[0].type;
            data.menu.sort = data.selection[0].sort;
            data.menu.icon = data.selection[0].icon;
            data.menu.url = data.selection[0].url;
            data.menu.permission = data.selection[0].permission;
            data.menu.parentId = data.selection[0].parentId;
            data.menu.parentName = res.data.data.menuName;
          });
        }
      }
    };

    //删除菜单
    const delMenus = async () => {
      console.log(data.selection);
      const res = await POST(Request.menuDel, data.selection);
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
            title: res.data.msg,
            type: "error",
            duration: 2000,
            showClose: false,
            offset: 90,
          });
        }
      }
    };

    // 操作行
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
                  getMenuList();
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
                    getMenuList();
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
          showClose={false}
          title={data.dialogTitle}
          width={"580px"}
          v-model={data.dialogStatus}
          v-slots={{
            footer: () => {
              return (
                <div class={"dialog-footer"}>
                  <el-button
                    size={"small"}
                    onClick={() => {
                      //取消修改清除表格数据
                      data.dialogStatus = false;
                      data.menu.parentId = null;
                      data.menu.parentName = "";
                      (menuFrom.value as ElForm).resetFields();
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
            ref={menuFrom}
            size={"small"}
            label-width={"80px"}
            inline={true}
            model={data.menu}
            // rules={data.rules}
          >
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group
                v-model={data.menu.type}
                size={"mini"}
                style={{ width: "178px", display: "block" }}
              >
                <el-radio-button label="0">目录</el-radio-button>
                <el-radio-button label="1">菜单</el-radio-button>
                <el-radio-button
                  label="2"
                  onClick={() => {
                    data.showPopover = false;
                  }}
                >
                  按钮
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label={data.menu.type != 2 ? "菜单排序" : "按钮排序"}
              prop={"sort"}
            >
              <el-input-number
                v-model={data.menu.sort}
                min={0}
                max={999}
                controls-position="right"
                style={{ width: "178px" }}
              />
            </el-form-item>
            <el-form-item
              label={data.menu.type != 2 ? "菜单标题" : "按钮名称"}
              prop={"menuName"}
            >
              <el-input
                v-model={data.menu.menuName}
                style={{ width: "450px" }}
                placeholder={"菜单标题"}
              />
            </el-form-item>

            {data.menu.type != 0 && (
              <el-form-item label={"权限标识"} prop={"permission"}>
                <el-input
                  v-model={data.menu.permission}
                  style={{ width: "450px" }}
                  placeholder={"权限标识"}
                />
              </el-form-item>
            )}
            {data.menu.type != 2 && (
              <>
                <el-form-item label="菜单图标" prop="icon">
                  <el-popover
                    placement={"bottom"}
                    width={"450px"}
                    trigger={"click"}
                    visible={data.showPopover}
                    v-slots={{
                      reference: () => {
                        return (
                          <el-input
                            v-model={data.menu.icon}
                            style={{ width: "450px" }}
                            placeholder={"点击选择图标"}
                            readonly
                            onClick={() => {
                              data.showPopover = true;
                            }}
                            v-slots={{
                              prefix: () => {
                                return data.menu.icon ? (
                                  <SvgIcon
                                    iconName={data.menu.icon}
                                    class={"el-input__icon"}
                                    style={{ height: "32px", width: "16px" }}
                                  ></SvgIcon>
                                ) : (
                                  <el-icon
                                    class={"el-input__icon"}
                                    style={{ height: "32px", width: "16px" }}
                                  >
                                    <Search />
                                  </el-icon>
                                );
                              },
                            }}
                          ></el-input>
                        );
                      },
                    }}
                  >
                    <IconSelect onSelectedIcon={onSelectIcon} />
                  </el-popover>
                </el-form-item>

                <el-form-item label={"路由地址"} prop={"url"}>
                  <el-input
                    v-model={data.menu.url}
                    style={{ width: "450px" }}
                    placeholder={"路由地址"}
                  />
                </el-form-item>
              </>
            )}
            <el-form-item label={"上级目录"} prop={"parentId"}>
              <TreeSelect
                // 选择框
                showCheckbox={false}
                // 点击图标才可展开(false)
                expandOnClickNode={false}
                //传回的默认父菜单名称
                parentName={data.menu.parentName}
                //子组件调用父组件方法
                onChooseNode={onChooseNode}
              ></TreeSelect>
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
                  <span class="card-span">菜单列表</span>
                </div>
              );
            },
          }}
        >
          <el-table
            fit={true}
            size={"small"}
            class={"menu-table"}
            style={{ width: "100%" }}
            v-loading={data.tableLoading}
            lazy={true}
            load={lodeChildrenMenu}
            treeProps={{ children: "children", hasChildren: "hasChildren" }}
            data={data.resultStatus ? data.result : null}
            rowKey={(row: any) => {
              return row.menuId;
            }}
            onSelectionChange={(selection: any) => {
              console.log("选择数据");
              data.selection = selection;
              setCrudButtonStatus();
            }}
            v-slots={{
              empty: () => {
                return <el-empty description="无数据"></el-empty>;
              },
            }}
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              showOverflowTooltip={true}
              label={"菜单标题"}
              width={200}
              prop={"menuName"}
            />
            <el-table-column
              prop={"icon"}
              label={"图标"}
              align={"center"}
              width={60}
            >
              {scopeIcon}
            </el-table-column>
            <el-table-column
              showOverflowToolTip={true}
              prop={"permission"}
              label={"权限标识"}
              align={"center"}
            />
            <el-table-column
              showOverflowToolTip={true}
              prop={"url"}
              label={"路径"}
              align={"center"}
            />
            <el-table-column
              showOverflowToolTip={true}
              prop={"sort"}
              label={"排序"}
              align={"center"}
            />
            <el-table-column
              showOverflowToolTip={true}
              prop={"type"}
              label={"类型"}
              align={"center"}
              formatter={function (scope: any) {
                if (scope.type == 0) {
                  return (
                    <el-tag size={"small"} effect={"plain"}>
                      目录
                    </el-tag>
                  );
                } else if (scope.type == 1) {
                  return (
                    <el-tag size={"small"} type={"success"} effect={"plain"}>
                      菜单
                    </el-tag>
                  );
                } else {
                  return (
                    <el-tag size={"small"} type={"warning"} effect={"plain"}>
                      按钮
                    </el-tag>
                  );
                }
              }}
            />
            <el-table-column
              prop={"createTime"}
              label={"创建日期"}
              width={150}
              align={"center"}
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
        </el-card>
      </div>
    );
  },
});
export default menu;
