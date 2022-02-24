import axios from "axios"; //引入axios
import qs from "qs"; //字符串解析和序列化字符串
import "nprogress/nprogress.css";
import router from "@/router";
import store from "@/store";
import { ElMessage } from "element-plus";
import { Local } from "@/axios";

//测试和开发环境地址切换
const URL = process.env.VUE_APP_URL;
//使用create方法创建axios实例
export const Service = axios.create({
  timeout: 30000, // 请求超时时间
  baseURL: URL,
  //携带cookie
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    // "Content-Type": "application/x-www-form-urlencoded",
    // "Content-Type": "application/json;charset=UTF-8",
  },
});

export const request = {
  lastUrl: String,
};
//axios请求拦截器  发送请求之前拦截并修改请求
Service.interceptors.request.use(
  (configuration) => {
    if (configuration.url === "/login") {
      configuration.data = qs.stringify(configuration.data);
    }
    return configuration; //添加这一行
  },
  (error) => {
    return Promise.reject(error);
  }
);

//axios请求返回拦截,返回的数据进行处理归类
Service.interceptors.response.use(
  function (response) {
      return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//转换类型
declare module "axios" {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}
export default Service;
