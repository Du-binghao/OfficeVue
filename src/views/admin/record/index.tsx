import { defineComponent, h, ref, onMounted, reactive } from "vue";
import { GET, POST, Request } from "@/axios";
import { ElMessage } from "element-plus";
import { RefreshLeft, View } from "@element-plus/icons";
import Operations from "@/components/Operations";
import Pagination from "@/components/Pagination";
import { ElForm } from "element-ui/types/form";
import RecordList from "@/views/admin/record/record_list";

interface data {
  pageParam: {
    total: number;
    pages: number;
    current: number;
  };
  searchOption: {
    currentPage: number;
    pageSize: number;
    searchText: string;
  };
  tableLoading: boolean;
  //返回结果状态
  resultStatus: boolean;
  result: any;
  drawer: any;
  mes: any;
}

const $name$ = defineComponent({
  component: {},

  setup: function () {
    const data = reactive<data>({
      pageParam: {
        total: 0,
        pages: 0,
        current: 1,
      },
      // 查询参数
      searchOption: {
        currentPage: 1,
        pageSize: 10,
        searchText: "",
      },
      // table状态
      tableLoading: false,
      resultStatus: false,
      result: [{}],
      drawer: false,
      mes : [],
    });

    onMounted(async () => {
      // $('#captcha').attr('src', captchaUrl.data.image);

      getList();
    });

    const getList = async () => {
      data.tableLoading = true;
      const res = await POST(Request.recordList, data.searchOption);
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

    const mesList = (recordId: any) => {
      POST(Request.medicinesList,{
        recordId: recordId
      }).then(res => {
        data.mes = res.data.data;
        data.drawer = true
      })
    }

    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      data.searchOption.currentPage = page;
      getList();
    };

    return () => (
      <div class={"app-container"}>
        <div class={"head-container"}>
          {/*模糊查询*/}
          <div>
            <el-input
              clearable
              v-model={data.searchOption.searchText}
              size={"small"}
              placeholder={"搜索"}
              style={{ width: "200px" }}
              class={"filter-item"}
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
                }}
              >
                重置
              </el-button>
            </span>
          </div>
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
              data={data.result}
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
                prop={"userId"}
                label={"用户名"}
                align={"center"}
              />
              <el-table-column
                prop={"userAddress"}
                label={"用户地址"}
                align={"center"}
              />
              <el-table-column
                prop={"createTime"}
                label={"下单时间"}
                align={"center"}
              />
              <el-table-column
                prop={"recordPrice"}
                width={"110"}
                label={"消费金额"}
                align={"center"}
                v-slots={{
                  default: (scope: any) => {
                    return (
                      <el-tag type={"success"} plain>
                        ¥ {scope.row.recordPrice}
                      </el-tag>
                    );
                  },
                }}
              />
              <el-table-column
                label={"查看账单"}
                width={120}
                align={"center"}
                fixed={"right"}
                v-slots={{
                  default: (scope: any) => {
                    return (
                      <el-button
                        type="success"
                        plain
                        icon={
                          <el-icon>
                            <View />
                          </el-icon>
                        }
                        circle
                        onClick={() => {
                          // todo:展示购买列表
                          mesList(scope.row.recordId)
                        }}
                      ></el-button>
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

        {/* todo:购买清单 */}
        <el-drawer v-model={data.drawer} destroy-on-close={true} direction="rtl" size={"600px"}>
          <RecordList meds={data.mes}></RecordList>
        </el-drawer>
      </div>
    );
  },
});
export default $name$;
