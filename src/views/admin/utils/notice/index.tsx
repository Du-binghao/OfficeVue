import { defineComponent, nextTick, onMounted, reactive, ref } from "vue";
import "./index.scss";
import ELFrame from "@/components/IFrame";
import { POST, Request } from "@/axios";
import { ElNotification } from "element-plus/es";
import { RefreshLeft } from "@element-plus/icons";
import Crud from "@/components/Crud";
import Pagination from "@/components/Pagination";
import Operations from "@/components/Operations";
import { ElForm } from "element-ui/types/form";

interface data {
  // crud参数
  crudOption: {
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

  notice: {
    noticeId: any;
    noticeTitle: string;
    noticeContent: string;
    noticeImg: string;
  };
}

const notice = defineComponent({
  components: {
    ELFrame,
  },
  setup: function (props) {
    // 页面数据
    const data = reactive<data>({
      // crud参数
      crudOption: {
        edit: "notice:edit",
        del: "notice:del",
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

      notice: {
        noticeId: null,
        noticeTitle: "",
        noticeContent: "",
        noticeImg: "",
      },
    });
    //用来获取noticeFrom的dom
    const noticeFrom = ref<ElForm>();
    onMounted(() => {
      getNoticeList();
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
      if (method == "edit") {
        data.dialogTitle = "修改角色";
        data.dialogStatus = true;
        data.notice.noticeId = data.selection[0].noticeId;
        noticeDetailInfo();
      } else if (method == "del") {
        delNotices();
      }
    };

    // 公用 刷新表格
    const refreshTableData = () => {
      console.log("刷新数据");
      data.tableLoading = true;
      setTimeout(() => {
        data.result = [];
        getNoticeList();
      }, 500);
    };
    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      data.tableLoading = true;
      console.log("切换数据【用户管理页面：" + page + "】");
      data.searchOption.currentPage = page;
      getNoticeList();
    };

    //获取公告数据
    const getNoticeList = async () => {
      console.log("获取公告数据");
      const res = await POST(Request.noticeList, data.searchOption);
      console.log(res);
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

    // 提交表单
    const submitFrom = () => {
      (noticeFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          console.log("验证成功");
          if (data.crudMethod == "add") {
            const res = await POST(Request.noticeAdd, data.notice);
            if (res) {
              if (res.data.code == 200) {
                (noticeFrom.value as ElForm).resetFields();
                ElNotification({
                  title: res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                getNoticeList();
              } else {
                ElNotification({
                  title: res.data.msg,
                  type: "error",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
              }
            }
          } else if (data.crudMethod == "edit") {
            const res = await POST(Request.noticeEdit, data.notice);
            if (res) {
              if (res.data.code == 200) {
                (noticeFrom.value as ElForm).resetFields();
                ElNotification({
                  title: res.data.msg,
                  type: "success",
                  duration: 1500,
                  showClose: false,
                  offset: 90,
                });
                data.dialogStatus = false;
                getNoticeList();
              } else {
                ElNotification({
                  title: res.data.msg,
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

    //私用 获取选中公告数据
    const noticeDetailInfo = () => {
      //通过nextTick对表单赋值，否则清空会失效
      nextTick(() => {
        data.notice.noticeTitle = data.selection[0].noticeTitle;
        data.notice.noticeContent = data.selection[0].noticeContent;
        data.notice.noticeImg = data.selection[0].noticeImg;
      });
    };

    //删除公告
    const delNotices = async () => {
      const res = await POST(Request.noticeDel, data.selection);
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
                  getNoticeList();
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
                    getNoticeList();
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
                      (noticeFrom.value as ElForm).resetFields();
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
            ref={noticeFrom}
            size={"small"}
            label-width={"80px"}
            inline={true}
            model={data.notice}
          >
            <el-form-item label={"公告标题"} prop={"noticeTitle"}>
              <el-input
                v-model={data.notice.noticeTitle}
                style={{ width: "450px" }}
                placeholder={"公告标题"}
              />
            </el-form-item>
            <el-form-item label="公告内容" prop="noticeContent">
              <el-input
                v-model={data.notice.noticeContent}
                style={{ width: "450px" }}
                rows={20}
                type={"textarea"}
              />
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
                <div class={"clearfix"}>
                  <span class={"card-span"}>公告列表</span>
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
            <el-table-column prop={"noticeTitle"} label={"公告标题"} />
            <el-table-column prop={"noticeContent"} label={"公告内容"} showOverflowTooltip={true} />
            <el-table-column prop={"noticeImg"} label={"公告图片"} />
            <el-table-column prop={"createUser"} label={"发布人"} />
            <el-table-column prop={"updateUser"} label={"修改人"} />
            <el-table-column prop={"createTime"} label={"发布时间"} />
            <el-table-column prop={"updateTime"} label={"修改时间"} />
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

export default notice;
