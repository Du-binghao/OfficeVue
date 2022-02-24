import { defineComponent, onMounted, reactive } from "vue";
import "./login.scss";
import { GET, POST, Local, Request } from "@/axios";
import SvgIcon from "@/components/SvgIcon";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

interface data {
  captchaImage: string;
  loading: boolean;
  loginForm: {
    userName: string;
    password: string;
    rememberMe: boolean;
    captcha: string;
    key: string;
  };
}
const login = defineComponent({
  component: {
    SvgIcon: SvgIcon,
  },
  setup: function () {
    const router = useRouter();
    const data = reactive<data>({
      captchaImage: "",
      loading: false,
      loginForm: {
        userName: "admin",
        password: "123456",
        rememberMe: false,
        captcha: "",
        key: "",
      },
    });

    onMounted(() => {
      getCaptcha().then();
    });

    // 获取验证码
    const getCaptcha = async () => {
      const res = await GET(Request.getCaptcha, null);
      if (res.status == 200) {
        data.captchaImage = res.data.data.image;
        data.loginForm.key = res.data.data.key;
      } else {
        console.log("获取验证码失败");
      }
    };

    // 登录功能
    const handleLogin = async () => {
      data.loading = true;
      const res = await POST(Request.login, data.loginForm);

      if (res.data.code != 200) {
        ElMessage.error(res.data.msg);
        data.loading = false;
        getCaptcha();
        data.loginForm.captcha = "";
      } else {
        console.log(res.data);
        ElMessage.success({
          message: res.data.msg,
          duration: 1000,
        });
        setTimeout(() => {
          router.push(Local.adminDashboard);
        }, 1000);
      }
    };

    return () => (
      <div class="login">
        <el-form
          ref="loginForm"
          label-position="left"
          label-width="0px"
          class="login-form"
        >
          <h3 class="title">后台管理系统</h3>
          {/*<Index iconName={"password"} />*/}
          <el-form-item prop="username">
            <el-input
              v-model={data.loginForm.userName}
              type="text"
              auto-complete="off"
              placeholder={"账号"}
              autofocus={"true"}
              prefix-icon={<SvgIcon iconName={"user"} />}
            >
              {/*<svg v-slot={"prefix"} class="el-input__icon input-index">*/}
              {/*  <use href={"#user"} />*/}
              {/*</svg>*/}
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model={data.loginForm.password}
              type="password"
              auto-complete="off"
              placeholder={"密码"}
              prefix-icon={<SvgIcon iconName={"password"} />}
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model={data.loginForm.captcha}
              auto-complete="off"
              placeholder={"验证码"}
              style={{ width: "63%" }}
              prefix-icon={<SvgIcon iconName={"validCode"} />}
              {...{
                onkeypress: (event: any) => {
                  if (event.keyCode == 13) {
                    handleLogin();
                  }
                },
              }}
            ></el-input>
            <div class="login-code">
              <img
                src={data.captchaImage}
                onClick={() => {
                  getCaptcha();
                }}
              />
            </div>
          </el-form-item>
          <el-checkbox
            style={{ margin: "0 0 25px 0" }}
            v-model={data.loginForm.rememberMe}
          >
            记住我
          </el-checkbox>
          <el-form-item style={{ width: "100%" }}>
            <el-button
              size="medium"
              type={"primary"}
              style={{ width: "100%" }}
              onClick={() => {
                handleLogin();
              }}
            >
              {!data.loading ? <span>登 录</span> : <span>登 录 中...</span>}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
export default login;
