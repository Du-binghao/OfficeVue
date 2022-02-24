import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import "./index.scss";
import IFrame from "@/components/IFrame";
import { POST, Request } from "@/axios";
import { release } from "echarts/types/src/component/helper/interactionMutex";
import { ElForm } from "element-ui/types/form";
import store from "@/store";
import { ElNotification } from "element-plus/es";
import router from "@/router";

interface data {
  url: string;
  // 新窗口的引用
  newWin: any;
  tabSelect: string;
  aliConfig: {
    alipayId: number;
    appId: string;
    pid: string;
    publicKey: string;
    privateKey: string;
    notifyUrl: string;
    returnUrl: string;
  };
  tradeOption: {
    subject: string;
    totalAmount: number;
    body: string;
  };
}

const alipay = defineComponent({
  setup: function (props) {
    const data = reactive<data>({
      url: "",
      // 新窗口的引用
      newWin: null,
      tabSelect: "payTest",
      aliConfig: {
        alipayId: 1,
        appId: "",
        pid: "",
        publicKey: "",
        privateKey: "",
        notifyUrl: "",
        returnUrl: "",
      },
      tradeOption: {
        subject: "测试",
        totalAmount: 100,
        body: "测试描述",
      },
    });

    const aliFrom = ref<ElForm>();
    onMounted(() => {
      initAlipayConfig();
    });

    /**
     * 获取支付配置信息
     */
    const initAlipayConfig = async () => {
      const res = await POST(Request.alipayConfig, "");
      if (res.data.data) {
        data.aliConfig = res.data.data;
      }
    };

    /**
     * 提交修改支付配置
     */
    const submitAlipayConfigFrom = async () => {
      const res = await POST(Request.alipayConfigEdit, data.aliConfig);
      if (res.data.code == 200) {
        ElNotification({
          title: "配置成功",
          type: "success",
          duration: 1500,
          showClose: false,
          offset: 90,
        });
        initAlipayConfig();
      }
    };

    /**
     * 创建支付订单
     */
    const submitTradeFrom = () => {
      POST(Request.alipayToPayAsPCTest, data.tradeOption).then((res) => {
        data.newWin = window.open();
        data.newWin.document.open();
        data.newWin.document.write(res.data);
      });
    };

    return () => (
      <div class={"app-container"}>
        <el-card
          class={"box-card"}
          shadow={"never"}
          v-slots={{
            header: () => {
              return (
                <div
                  class="clearfix"
                  style={{ height: "32px", lineHeight: "32px" }}
                >
                  <span class="card-span">支付宝工具</span>
                  {data.tabSelect == "aliConfig" && (
                    <el-button
                      size={"small"}
                      type={"primary"}
                      style={{ float: "right" }}
                      onClick={() => {
                        submitAlipayConfigFrom();
                      }}
                    >
                      保存配置
                    </el-button>
                  )}
                  {data.tabSelect == "payTest" && (
                    <el-button
                      size={"small"}
                      type={"primary"}
                      style={{ float: "right" }}
                      onClick={() => {
                        submitTradeFrom();
                      }}
                    >
                      去支付
                    </el-button>
                  )}
                </div>
              );
            },
          }}
        >
          <el-tabs v-model={data.tabSelect} class={"demo-tabs"}>
            <el-tab-pane label={"参数配置"} name={"aliConfig"}>
              <el-form
                ref={aliFrom}
                size={"small"}
                label-width={"80px"}
                inline={true}
                model={data.aliConfig}
              >
                <el-form-item label={"appId"} prop={"alipayId"}>
                  <el-input
                    v-model={data.aliConfig.appId}
                    style={{ width: "1000px" }}
                    placeholder={"appId"}
                  />
                  <span style="color: #C0C0C0;margin-left: 10px;">
                    应用APPID,收款账号既是APPID对应支付宝账号
                  </span>
                </el-form-item>
                <el-form-item label={"pid"} prop={"pid"}>
                  <el-input
                    v-model={data.aliConfig.pid}
                    style={{ width: "1000px" }}
                    placeholder={"pid"}
                  />
                  <span style={{ color: "#C0C0C0", marginLeft: "10px" }}>
                    商家账号
                  </span>
                </el-form-item>
                <el-form-item label={"回调地址"} prop={"returnUrl"}>
                  <el-input
                    v-model={data.aliConfig.returnUrl}
                    style={{ width: "1000px" }}
                    placeholder={"回调地址"}
                  />
                  <span style={{ color: "#C0C0C0", marginLeft: "10px" }}>
                    订单完成后返回的地址
                  </span>
                </el-form-item>
                <el-form-item label={"异步通知"} prop={"notifyUrl"}>
                  <el-input
                    v-model={data.aliConfig.notifyUrl}
                    style={{ width: "1000px" }}
                    placeholder={"异步通知"}
                  />
                  <span style={{ color: "#C0C0C0", marginLeft: "10px" }}>
                    支付结果异步通知地址
                  </span>
                </el-form-item>
                <el-form-item label="公钥" prop="publicKey">
                  <el-input
                    v-model={data.aliConfig.publicKey}
                    style={{ width: "1000px" }}
                    rows={5}
                    type={"textarea"}
                  />
                  <span style={{ color: "#C0C0C0", marginLeft: "10px" }}>
                    支付宝公钥
                  </span>
                </el-form-item>
                <el-form-item label="私钥" prop="privateKey">
                  <el-input
                    v-model={data.aliConfig.privateKey}
                    style={{ width: "1000px" }}
                    rows={15}
                    type={"textarea"}
                  />
                  <span style={{ color: "#C0C0C0", marginLeft: "10px" }}>
                    商户私钥，你的PKCS8格式RSA2私钥
                  </span>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label={"支付测试"} name={"payTest"}>
              <el-form
                ref={aliFrom}
                size={"small"}
                label-width={"80px"}
                inline={true}
                model={data.aliConfig}
              >
                <el-form-item label={"商品名称"} prop={"orderName"}>
                  <el-input
                    v-model={data.tradeOption.subject}
                    style={{ width: "1000px" }}
                    placeholder={"商品名称"}
                  />
                </el-form-item>
                <el-form-item label={"商品价格"} prop={"orderPrice"}>
                  <el-input-number
                    v-model={data.tradeOption.totalAmount}
                    precision={2}
                    step={1}
                    max={5000}
                    style={{ width: "1000px" }}
                    controlsPosition={"right"}
                  />
                </el-form-item>
                <el-form-item label={"商品描述"} prop={"orderDescription"}>
                  <el-input
                    v-model={data.tradeOption.body}
                    style={{ width: "1000px" }}
                    rows={15}
                    type={"textarea"}
                    placeholder={"商品描述"}
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label={"使用说明"} name={"instruction"}>
              <el-collapse>
                <el-collapse-item title={"注意"} name={"1"}>
                  <div>
                    测试所用参数都是沙箱环境，仅供测试使用！
                    <el-descriptions column={1} size={"small"} border>
                      <el-descriptions-item
                        label={"支付宝开发平台"}
                        labelClassName={"description"}
                      >
                        <a
                          style={{ color: "#00a0e9" }}
                          href={"https://open.alipay.com/platform/appDaily.htm"}
                          target={"_blank"}
                        >
                          支付宝开发平台
                        </a>
                      </el-descriptions-item>
                      <el-descriptions-item
                        label={
                          "支付宝沙箱版下载地址（目前沙箱钱包仅提供Android版本）"
                        }
                        labelClassName={"description"}
                      >
                        <a
                          style={{ color: "#00a0e9" }}
                          href={
                            "https://zos.alipayobjects.com/rmsportal/CaXHDDXkdxikcZP.png"
                          }
                          target={"_blank"}
                        >
                          支付宝沙箱版
                        </a>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-collapse-item>
                <el-collapse-item title={"商家信息"} name={"2"}>
                  <el-descriptions column={1} size={"small"} border>
                    <el-descriptions-item label={"商家账号"}>
                      fjgtne2682@sandbox.com
                    </el-descriptions-item>
                    <el-descriptions-item label={"商家pid"}>
                      2088621957719289
                    </el-descriptions-item>
                    <el-descriptions-item label={"商家密码"}>
                      111111
                    </el-descriptions-item>
                  </el-descriptions>
                </el-collapse-item>
                <el-collapse-item title={"买家信息"} name={"3"}>
                  <el-descriptions column={1} size={"small"} border>
                    <el-descriptions-item label={"买家账号"}>
                      wtxolo7380@sandbox.com
                    </el-descriptions-item>
                    <el-descriptions-item label={"登录密码"}>
                      111111
                    </el-descriptions-item>
                    <el-descriptions-item label={"支付密码"}>
                      111111
                    </el-descriptions-item>
                  </el-descriptions>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    );
  },
});

export default alipay;
