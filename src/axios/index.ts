import Service from "./axios";

export const getItem = (key: string) => {
  return localStorage.getItem(key);
};
export const setItem = (key: string, valye: any) => {
  return localStorage.setItem(key, valye);
};

const baseUrl = process.env.VUE_APP_URL;

interface Local {
  adminLogin: string;
  adminDashboard: string;
  adminPersonal: string;
}

export const Local: Local = {
  adminLogin: "/",
  adminDashboard: "/admin/dashboard",
  adminPersonal: "/admin/personal",
};

//类型
interface Request {
  // 获取验证码
  getCaptcha: string;
  // 登录
  login: string;
  // 登出
  logout: string;
  // 用户
  authUser: string;
  // 用户规则
  authRole: string;
  // 用户菜单
  authMenu: string;
  // 用户权限
  authPermission: string;
  // 获取用户角色
  getRoleUser: string;
  // 用户列表
  userList: string;
  // 用户添加
  userAdd: string;
  // 用户修改
  userEdit: string;
  // 用户删除
  userDel: string;
  // 全部角色
  roleAll: string;
  // 角色列表
  roleList: string;
  // 添加角色
  roleAdd: string;
  // 修改角色
  roleEdit: string;
  // 删除角色
  roleDel: string;
  // 获取角色权限
  roleMenuList: string;
  // 更改角色权限
  roleMenuChange: string;
  // 菜单懒加载
  lazyMenu: string;
  // 获取父菜单
  getMenuParent: string;
  // 添加菜单
  menuAdd: string;
  // 修改菜单
  menuEdit: string;
  // 删除菜单
  menuDel: string;
  // 日志监控
  logsList: string;
  // 日志删除
  logsDel: string;
  // 系统监控
  monitorServer: string;
  // sql监控
  sqlApi: string;
  // 公告列表
  noticeList: string;
  // 添加公告
  noticeAdd: string;
  // 公告修改
  noticeEdit: string;
  // 公告删除
  noticeDel: string;
  // swagger
  swaggerApi: string;
  // swagger-bs
  swaggerBSApi: string;
  // alipay配置
  alipayConfig: string;
  // 支付宝配置修改
  alipayConfigEdit: string;
  // 支付测试
  alipayToPayAsPCTest: string;

  // 个人信息修改
  personalEdit: string;
  // 个人日志查询
  personalLogList: string;

  // 修改密码
  updatePassword: string;
  // 上传头像
  uploadAvatar: string;
  // 获取头像
  getAvatar: string;

  // 药品信息管理：获取列表、添加、修改、删除
  medicineList: string;
  medicineAdd: string;
  medicineEdit: string;
  medicineDel: string;

  // 供应商信息管理：获取列表、添加、修改、删除
  supplierList: string;
  supplierAdd: string;
  supplierEdit: string;
  supplierDel: string;
  supAllList: string;

  // 药品库存管理：修改
  inventoryList: string;
  inventoryEdit: string;

  // 交易记录： 查看记录、查看记录购物列表
  recordList: string;
  medicinesList: string;
}

// URL传参
export const Request: Request = {
  getCaptcha: "/captcha",
  login: "/login",
  logout: "/logout",
  authUser: "/auth/user",
  authRole: "/auth/role",
  authMenu: "/auth/menu",
  authPermission: "/auth/permission",
  getRoleUser: "/roleUser/select",
  // user
  userList: "/user/list",
  userAdd: "/user/add",
  userEdit: "/user/edit",
  userDel: "/user/del",
  roleAll: "/role/all",
  // role
  roleList: "/role/list",
  roleAdd: "/role/add",
  roleEdit: "/role/edit",
  roleDel: "/role/del",
  roleMenuList: "/roleMenu/list",
  roleMenuChange: "/roleMenu/change",
  // menu
  lazyMenu: "/menu/lazy",
  getMenuParent: "/menu/parent",
  menuAdd: "/menu/add",
  menuEdit: "/menu/edit",
  menuDel: "/menu/del",

  // logs
  logsList: "/logs/list",
  logsDel: "/logs/del",
  // monitor
  monitorServer: "/monitor/server",
  // Sql 监控
  sqlApi: baseUrl + "/druid/index.html",
  // notice
  noticeList: "/notice/list",
  noticeAdd: "/notice/add",
  noticeEdit: "/notice/edit",
  noticeDel: "/notice/del",
  // swagger
  swaggerApi: baseUrl + "/swagger-ui.html",
  swaggerBSApi: baseUrl + "/doc.html",
  //alipay
  alipayConfig: "/alipay/config",
  alipayConfigEdit: "/alipay/configEdit",
  alipayToPayAsPCTest: "/alipay/toPayAsPCTest",
  // personal
  personalEdit: "/personalEdit",
  personalLogList: "/logs/personal",
  updatePassword: "/updatePassword",
  uploadAvatar: baseUrl + "/uploadAvatar",

  getAvatar: baseUrl + "/getAvatar?avatar=",

  // medicine
  medicineList: "/medicine/list",
  medicineAdd: "/medicine/add",
  medicineEdit: "/medicine/edit",
  medicineDel: "/medicine/del",

  // supplier
  supplierList: "/supplier/list",
  supAllList: "/supplier/all_list",
  supplierAdd: "/supplier/add",
  supplierEdit: "/supplier/edit",
  supplierDel: "/supplier/del",

  //inventory
  inventoryList: "/inventory/list",
  inventoryEdit: "/inventory/edit",

  //record
  recordList: "/record/list",
  medicinesList: "/medicines/list",
};

//POST方法
export const POST = (request: string, data: any) => {
  return Service({
    url: request,
    method: "POST",
    data: data,
  });
};

//GET方法
export const GET = (request: string, data: any) => {
  return Service({
    url: request,
    method: "GET",
    params: data,
  });
};
