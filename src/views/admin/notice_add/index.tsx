import {
  defineComponent,
  h,
  ref,
  onMounted,
  reactive,
  nextTick,
  watch
} from "vue";
import { GET, POST, Request } from "@/axios";
import { ElMessage, ElNotification } from "element-plus";
import Editor from "@/components/Editor";
import "@/assets/styles/index.scss";
import store from "@/store";
import { ElForm } from "element-ui/types/form";
import { useRoute } from "vue-router";

interface data {
  // crud参数
  crudOption: {
    add: string;
  };
  noticeInfo: any;
  levelList: any;
  rules: any;
  initBool:any;
}

const Index = defineComponent({
  component: {},

  setup: function() {
    const route = useRoute();
    const data = reactive<data>({
      // crud参数
      /* todo:权限 */
      crudOption: {
        add: "medicine:add"
      },
      noticeInfo: {
        noticeTitle: "",
        noticeContent: ""
      },
      levelList: [],
      rules: {
        noticeTitle: [
          { required: true, trigger: "blur", message: "请输入公告标题" }
        ],
        noticeContent: [
          { required: true, trigger: "blur", message: "请输入公告内容" }
        ]
      },
      initBool: false,
    });

    const noticeFrom = ref<ElForm>();

    onMounted(async () => {
      // $('#captcha').attr('src', captchaUrl.data.image);
    });

    const initHtml = () => {
      data.initBool = true;

      (noticeFrom.value as ElForm).resetFields();
    };

    const noticeAdd = async () => {
      (noticeFrom.value as ElForm).validate(async (valid) => {
        if (valid) {
          const res = await POST(Request.noticeAdd, data.noticeInfo);
          initHtml();
          message(res);
        }
      })
    };

    // 公用消息
    const message = (res: any) => {
      ElMessage({
        showClose: true,
        message: res.data.msg,
        center: true,
        type: res.data.code == 200 ? "success" : "error"
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
                  <span class="card-span">公告发布</span>
                </div>
              );
            }
          }}
        >
          <el-form
            ref={noticeFrom}
            size={"large"}
            label-width={"150px"}
            inline={true}
            model={data.noticeInfo}
            rules={data.rules}

          >
            {/* todo: 标题*/}
            <el-form-item prop={"noticeTitle"} style={{ width: "100%" }}>
              <el-input
                placeholder={"请输入公告标题"}
                v-model={data.noticeInfo.noticeTitle}
              />
            </el-form-item>

            {/* todo: 内容*/}
            <el-form-item prop={"noticeContent"} style={{ width: "100%" }}>
              <Editor
                noticeContent={data.noticeInfo.noticeContent}
                init={data.initBool}
                onGetNoticeContent={(content) => {
                  data.noticeInfo.noticeContent = content;
                }}
                onSetInitBool={(bool) => {
                  data.initBool = bool
                }}
              ></Editor>
            </el-form-item>

            <el-form-item style={{ width: "100%", margin: "0" }}>
              <el-button
                plain
                type={"success"}
                style={{
                  padding: "0 30px 0 30px",
                  float: "right"
                }}
                onClick={() => {
                  noticeAdd();
                }}
              >
                发布公告
              </el-button>
              <el-button
                plain
                type={"warning"}
                style={{
                  padding: "0 30px 0 30px",
                  margin: "0 20px 0 0",
                  float: "right"
                }}
                onClick={() => {
                  initHtml();
                }}
              >
                重置内容
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    );
  }
});
export default Index;
