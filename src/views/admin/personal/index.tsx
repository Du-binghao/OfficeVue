import { defineComponent, onMounted, reactive, ref } from "vue";
import "./index.scss";
import { POST, Request } from "@/axios";
import store from "@/store";
import SvgIcon from "@/components/SvgIcon";
import Pagination from "@/components/Pagination";
import { ElForm } from "element-ui/types/form";
import { ElNotification } from "element-plus/es";
import { UploadFilled } from "@element-plus/icons";
import { ElMessage } from "element-plus";

interface data {
  tabSelect: string;
  tableLoading: boolean;
  // 分页参数
  pageParam: {
    total: number;
    pages: number;
    current: number;
  };
  // 查询参数
  searchOption: {
    currentPage: number;
    pageSize: number;
  };
  personalLogsList: any;
  avatarUrl: string;
  dialogStatus: boolean;
  rules: any;
  passwordFrom: {
    oldPass: string;
    newPass: string;
    confirmPass: string;
  };
}

// todo 个人中心页面
const personal = defineComponent({
  setup: function (props) {
    const confirmPass = (rule: any, value: any, callback: any) => {
      if (value) {
        if (data.passwordFrom.newPass !== value) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请再次输入密码"));
      }
    };
    const data = reactive<data>({
      tabSelect: "user",
      tableLoading: true,
      // 分页参数
      pageParam: {
        total: 0,
        pages: 0,
        current: 1,
      },
      // 查询参数
      searchOption: {
        currentPage: 1,
        pageSize: 10,
      },
      personalLogsList: [],
      avatarUrl: "",
      dialogStatus: false,
      rules: {
        oldPass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        confirmPass: [
          {
            required: true,
            validator: confirmPass,
            trigger: "blur",
          },
        ],
      },
      passwordFrom: {
        oldPass: "",
        newPass: "",
        confirmPass: "",
      },
    });
    onMounted(() => {});

    const passwordFrom = ref<ElForm>();
    const personalFrom = ref<ElForm>();
    const initCurrentLog = async () => {
      const res = await POST(Request.personalLogList, data.searchOption);
      data.personalLogsList = res.data.data.records;
      data.pageParam.pages = res.data.data.pages;
      data.pageParam.total = res.data.data.total;
      data.pageParam.current = res.data.data.current;
      data.tableLoading = false;
    };

    // 公用 更换选中页
    const onSetCurrentPage = (page: number) => {
      data.tableLoading = true;
      console.log("切换数据【个人日志页面：" + page + "】");
      data.searchOption.currentPage = page;
      initCurrentLog();
    };

    const submitFrom = async () => {
      const res = await POST(Request.personalEdit, store.state.loginUser);
      if (res.data.code == 200) {
        ElNotification({
          title: "修改成功",
          type: "success",
          duration: 1500,
          showClose: false,
          offset: 90,
        });
      }
    };
    const submitPasswordFrom = () => {
      (passwordFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          console.log("验证成功");
          const res = await POST(Request.updatePassword, data.passwordFrom);
          console.log(res);
          if (res.data.code == 200) {
            ElNotification({
              title: "修改成功",
              type: "success",
              duration: 1500,
              showClose: false,
              offset: 90,
            });
            data.dialogStatus = false;
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
      });
    };

    return () => (
      <div class={"app-container"}>
        {/*表单渲染*/}
        <el-dialog
          title={"修改密码"}
          width={"450px"}
          showClose={false}
          v-model={data.dialogStatus}
          v-slots={{
            footer: () => {
              return (
                <div class={"dialog-footer"}>
                  <el-button
                    size={"small"}
                    onClick={() => {
                      (passwordFrom.value as ElForm).resetFields();
                      data.dialogStatus = false;
                    }}
                  >
                    取消
                  </el-button>
                  <el-button
                    size={"small"}
                    type="primary"
                    onClick={() => {
                      submitPasswordFrom();
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
            ref={passwordFrom}
            size={"small"}
            label-width={"80px"}
            inline={true}
            model={data.passwordFrom}
            rules={data.rules}
          >
            <el-form-item label={"原密码"} prop={"oldPass"}>
              <el-input
                v-model={data.passwordFrom.oldPass}
                style={{ width: "300px" }}
                placeholder={"原密码"}
              />
            </el-form-item>
            <el-form-item label={"新密码"} prop={"newPass"}>
              <el-input
                v-model={data.passwordFrom.newPass}
                style={{ width: "300px" }}
                placeholder={"新密码"}
              />
            </el-form-item>
            <el-form-item label={"确认密码"} prop={"confirmPass"}>
              <el-input
                v-model={data.passwordFrom.confirmPass}
                style={{ width: "300px" }}
                placeholder={"确认密码"}
              />
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-row gutter={20}>
          <el-col
            xs={24}
            sm={24}
            md={8}
            lg={6}
            xl={5}
            style={{ marginBottom: "10px" }}
          >
            <el-card
              class={"box-card"}
              v-slots={{
                header: () => {
                  return (
                    <div class={"clearfix"}>
                      <span>个人信息</span>
                    </div>
                  );
                },
              }}
            >
              <div>
                <div style={{ textAlign: "center" }}>







                  <div class={"el-upload"}>
                    <el-upload
                      class={"avatar-uploader"}
                      action={Request.uploadAvatar}
                      showFileList={false}
                      withCredentials={true}
                      onSuccess={(res: any) => {
                        store.state.loginUser.avatar = res.data;
                        ElNotification({
                          title: "修改成功",
                          type: "success",
                          duration: 1500,
                          showClose: false,
                          offset: 90,
                        });
                      }}
                    >
                      {/*todo:显示头像*/}
                      <div class="pan-item">
                        <div class="pan-info">
                          <div class="pan-info-roles-container">
                            {/* 用户名 */}
                            <h3>Hello:</h3>
                            <h4>{store.state.loginUser.userName}</h4>
                          </div>
                        </div>
                        <div class="pan-thumb">
                          <img
                            style={{ width: "100%", height: "100%" }}
                            src={Request.getAvatar + store.state.loginUser.avatar}
                          />
                        </div>
                      </div>

                    </el-upload>
                  </div>
                </div>
                <ul class={"user-info"}>
                  <li>
                    <div style={{ height: "100%" }}>
                      <SvgIcon
                        iconName={"login"}
                        class={"personal-icon"}
                      ></SvgIcon>
                      登录账号
                      <div class={"user-right"}>
                        {store.state.loginUser.userName}
                      </div>
                    </div>
                  </li>
                  <li>
                    <SvgIcon
                      iconName={"user1"}
                      class={"personal-icon"}
                    ></SvgIcon>
                    用户昵称
                    <div class={"user-right"}>
                      {store.state.loginUser.nickName}
                    </div>
                  </li>
                  <li>
                    <SvgIcon iconName={"sex"} class={"personal-icon"}></SvgIcon>
                    性别
                    <div class={"user-right"}>
                      {store.state.loginUser.sex == 1 ? "男" : "女"}
                    </div>
                  </li>
                  <li>
                    <SvgIcon
                      iconName={"phone"}
                      class={"personal-icon"}
                    ></SvgIcon>
                    手机号码{" "}
                    <div class={"user-right"}>
                      {store.state.loginUser.phone}
                    </div>
                  </li>
                  <li>
                    <SvgIcon
                      iconName={"email"}
                      class={"personal-icon"}
                    ></SvgIcon>
                    用户邮箱
                    <div class={"user-right"}>
                      {store.state.loginUser.email}
                    </div>
                  </li>
                  <li>
                    <SvgIcon iconName={"anq"} class={"personal-icon"}></SvgIcon>
                    安全设置
                    <div class={"user-right"}>
                      <a
                        onClick={() => {
                          data.dialogStatus = true;
                        }}
                      >
                        修改密码
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col xs={24} sm={24} md={16} lg={18} xl={19}>
            <el-card class={"box-card"}>
              <el-tabs
                v-model={data.tabSelect}
                onTabClick={(tab: any) => {
                  if (data.tabSelect == "operationLog") {
                    initCurrentLog();
                  }
                }}
              >
                <el-tab-pane label={"用户资料"} name={"user"}>
                  <el-form
                    ref={personalFrom}
                    style={{ marginTop: "10px" }}
                    size={"small"}
                    label-width={"65px"}
                  >
                    <el-form-item label={"昵称"} prop={"nickName"}>
                      <el-input
                        style={{ width: "35%" }}
                        v-model={store.state.loginUser.nickName}
                      />
                      <span style={{ color: "#C0C0C0", marginLeft: "10px" }}>
                        用户昵称不作为登录使用
                      </span>
                    </el-form-item>
                    <el-form-item label={"手机号"} prop={"phone"}>
                      <el-input
                        style={{ width: "35%" }}
                        v-model={store.state.loginUser.phone}
                      />
                    </el-form-item>
                    <el-form-item label={"邮箱"} prop={"phone"}>
                      <el-input
                        style={{ width: "35%" }}
                        v-model={store.state.loginUser.email}
                      />
                    </el-form-item>
                    <el-form-item label={"性别"}>
                      <el-radio-group
                        style={{ width: "180px" }}
                        v-model={store.state.loginUser.sex}
                      >
                        <el-radio label={"1"}>男</el-radio>
                        <el-radio label={"0"}>女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        size={"mini"}
                        type={"primary"}
                        onClick={() => {
                          submitFrom();
                        }}
                      >
                        保存
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label={"操作日志"} name={"operationLog"}>
                  <el-table
                    v-loading={data.tableLoading}
                    data={data.personalLogsList}
                    style={{ width: "100%" }}
                    size={"small"}
                    v-slots={{
                      empty: () => {
                        return <el-empty description={"无数据"}></el-empty>;
                      },
                    }}
                  >
                    <el-table-column prop={"description"} label={"行为"} />
                    <el-table-column prop={"requestIp"} label={"IP"} />
                    <el-table-column
                      showOverflowTooltip={true}
                      prop={"address"}
                      label={"IP来源"}
                    />
                    <el-table-column prop={"browser"} label={"浏览器"} />
                    <el-table-column
                      prop={"time"}
                      label={"请求耗时"}
                      align={"center"}
                      formatter={(scope: any) => {
                        return scope.time <= 300 ? (
                          <el-tag size={"small"}>{scope.time}ms</el-tag>
                        ) : scope.time <= 1000 ? (
                          <el-tag size={"small"} type={"warning"}>
                            {scope.time}ms
                          </el-tag>
                        ) : (
                          <el-tag size={"small"} type={"danger"}>
                            {scope.time}ms
                          </el-tag>
                        );
                      }}
                    />
                    <el-table-column
                      prop={"createTime"}
                      label={"创建日期"}
                      align={"center"}
                    />
                  </el-table>
                  <Pagination
                    pageParam={data.pageParam}
                    onSetCurrentPage={onSetCurrentPage}
                  />
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </div>
    );
  },
});

export default personal;
