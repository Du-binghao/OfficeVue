import { defineComponent, onMounted, reactive } from "vue";
import "./index.scss";
import { RefreshLeft } from "@element-plus/icons";
import Crud from "@/components/Crud";
import { POST, Request } from "@/axios";
import { ElNotification } from "element-plus/es";
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
  // table状态
  tableLoading: boolean;
  // 返回结果
  result: any;
  // 选择的数据
  selection: any;
}

const logs = defineComponent({
  setup: function () {
    // 页面数据
    const data = reactive<data>({
      // crud参数
      crudOption: {
        add: "logs:add",
        edit: "logs:edit",
        del: "logs:del",
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
      // 选择的数据
      selection: [],
    });
    onMounted(() => {
      getLogsList();
    });
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
      if (method == "del") {
        delLogs();
      } else if (method == "export") {
      }
    };
    // 公用 刷新表格
    const refreshTableData = () => {
      console.log("刷新数据");
      data.tableLoading = true;
      setTimeout(() => {
        data.result = [];
        getLogsList();
      }, 500);
    };
    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      data.tableLoading = true;
      console.log("切换数据【用户管理页面：" + page + "】");
      data.searchOption.currentPage = page;
      getLogsList();
    };
    //获取日志数据
    const getLogsList = async () => {
      console.log("获取日志数据");
      const res = await POST(Request.logsList, data.searchOption);
      if (res) {
        if (res.data.data) {
          data.result = res.data.data.records;
          data.pageParam.pages = res.data.data.pages;
          data.pageParam.total = res.data.data.total;
          data.pageParam.current = res.data.data.current;
        }
      }
      data.tableLoading = false;
    };

    //删除日志
    const delLogs = async () => {
      console.log(data.selection);
      const res = await POST(Request.logsDel, data.selection);
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
                  getLogsList();
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
                    getLogsList();
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
        {/*表格数据*/}
        <el-card
          class={"box-card"}
          shadow={"never"}
          v-slots={{
            header: () => {
              return (
                <div class="clearfix">
                  <span class="card-span">日志列表</span>
                </div>
              );
            },
          }}
        >
          <el-table
            fit={true}
            size={"small"}
            class={"logs-table"}
            style={{ width: "100%" }}
            v-loading={data.tableLoading}
            data={data.result}
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
              fixed={"left"}
              align={"center"}
            />
            <el-table-column
              type={"expand"}
              fixed={"left"}
              // width={20}
              prop={"id"}
              v-slots={{
                default: (props: any) => {
                  return (
                    <el-form
                      label-position="left"
                      inline
                      class={"demo-table-expand"}
                    >
                      <el-form-item label="请求方法">
                        <span>{props.row.method}</span>
                      </el-form-item>
                      <el-form-item label="请求参数">
                        <span>{props.row.params}</span>
                      </el-form-item>
                    </el-form>
                  );
                },
              }}
            />
            <el-table-column prop={"userName"} label={"用户名"} />
            <el-table-column prop={"requestIp"} label={"ip"} />
            <el-table-column prop={"address"} label={"ip来源"} />
            <el-table-column prop={"description"} label={"描述"} />
            <el-table-column prop={"browser"} label={"浏览器"} />
            <el-table-column
              prop={"time"}
              label={"请求耗时"}
              align={"center"}
              formatter={(scope: any) => {
                return scope.time <= 300 ? (
                  <el-tag size={"small"}>{scope.time}ms</el-tag>
                ) : scope.time <= 1000 ? (
                  <el-tag size={"small"} type="warning">
                    {scope.time}ms
                  </el-tag>
                ) : (
                  <el-tag size={"small"} type="danger">
                    {scope.time}ms
                  </el-tag>
                );
              }}
            />
            <el-table-column prop={"createTime"} label={"请求时间"} />
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
export default logs;
