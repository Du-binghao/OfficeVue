import {
  defineComponent,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  reactive,
  watch,
} from "vue";
import "./index.scss";
import SvgIcon from "@/components/SvgIcon";
import { Refresh } from "@element-plus/icons";
import { POST, Request } from "@/axios";

interface data {
  loading: boolean;
  monitor: any;
  time: string;
  sys: {
    os: string;
    ip: string;
    day: string;
  };
  cpu: {
    name: string;
    package: string;
    core: string;
    coreNumber: string;
    logic: string;
    used: string;
  };
  memory: {
    total: string;
    available: string;
    used: string;
    usageRate: string;
  };
  swap: {
    total: string;
    used: string;
    available: string;
    usageRate: string;
  };
  disk: {
    total: string;
    used: string;
    available: string;
    usageRate: string;
  };
  cpuInfo: {
    tooltip: {
      trigger: string;
    };
    grid: {
      top: number;
      left: string;
      right: string;
      bottom: string;
      containLabel: boolean;
    };
    xAxis: {
      type: string;
      boundaryGap: boolean;
      axisLine: {
        lineStyle: {
          color: string;
        };
      };
      data: string[];
    };
    yAxis: {
      type: string;
      min: number;
      max: number;
      alignTicks: boolean;
      axisLine: {
        show: boolean;
        lineStyle: {
          color: string;
        };
      };
    };
    series: [
      {
        data: number[];
        type: string;
        areaStyle: {
          color: string; // 改变区域颜色
        };
        itemStyle: {
          color: string;
          lineStyle: {
            color: string; // 改变折线颜色
          };
        };
      }
    ];
  };
  memoryInfo: {
    tooltip: {
      trigger: string;
    };
    grid: {
      top: number;
      left: string;
      right: string;
      bottom: string;
      containLabel: boolean;
    };
    xAxis: {
      type: string;
      boundaryGap: boolean;
      axisLine: {
        lineStyle: {
          color: string;
        };
      };
      data: string[];
    };
    yAxis: {
      type: string;
      min: number;
      max: number;
      alignTicks: boolean;
      axisLine: {
        show: boolean;
        lineStyle: {
          color: string;
        };
      };
    };
    series: [
      {
        data: number[];
        type: string;
        areaStyle: {
          color: string; // 改变区域颜色
        };
        itemStyle: {
          color: string;
          lineStyle: {
            color: string; // 改变折线颜色
          };
        };
      }
    ];
  };
}

const Server = defineComponent({
  setup: () => {
    const data = reactive<data>({
      loading: true,
      monitor: null,
      time: "",
      sys: {
        os: "无数据",
        ip: "无数据",
        day: "无数据",
      },
      cpu: {
        name: "无数据",
        package: "无数据",
        core: "无数据",
        coreNumber: "无数据",
        logic: "无数据",
        used: "无数据",
      },
      memory: {
        total: "无数据",
        available: "无数据",
        used: "无数据",
        usageRate: "无数据",
      },
      swap: {
        total: "无数据",
        used: "无数据",
        available: "无数据",
        usageRate: "无数据",
      },
      disk: {
        total: "无数据",
        used: "无数据",
        available: "无数据",
        usageRate: "无数据",
      },
      cpuInfo: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: 10,
          left: "1%",
          right: "4%",
          bottom: "0",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#3888fa",
            },
          },
          data: [],
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#3888fa",
            },
          },
        },
        series: [
          {
            data: [],
            type: "line",
            areaStyle: {
              color: "rgb(32, 160, 255)", // 改变区域颜色
            },
            itemStyle: {
              color: "#6fbae1",
              lineStyle: {
                color: "#6fbae1", // 改变折线颜色
              },
            },
          },
        ],
      },
      memoryInfo: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: 10,
          left: "1%",
          right: "3%",
          bottom: "0",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#3888fa",
            },
          },
          data: [],
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#3888fa",
            },
          },
        },
        series: [
          {
            data: [],
            type: "line",
            areaStyle: {
              color: "rgb(32, 160, 255)", // 改变区域颜色
            },
            itemStyle: {
              color: "#6fbae1",
              lineStyle: {
                color: "#6fbae1", // 改变折线颜色
              },
            },
          },
        ],
      },
    });
    onMounted(() => {
      init();
    });

    onActivated(() => {
      nextTick(() => {
        data.monitor = window.setInterval(() => {
          init();
        }, 2000);
      });
    });

    onDeactivated(() => {
      clearInterval(data.monitor);
    });

    onUnmounted(() => {
      clearInterval(data.monitor);
    });
    //加载数据
    const init = async () => {
      const res = await POST(Request.monitorServer, "");
      if (res.status == 200) {
        if (res.data.data) {
          nextTick(() => {
            data.loading = false;
            data.sys = res.data.data.sys;
            data.cpu = res.data.data.cpu;
            data.memory = res.data.data.memory;
            data.swap = res.data.data.swap;
            data.disk = res.data.data.disk;
            data.time = res.data.data.time;
            if (data.cpuInfo.xAxis.data.length >= 8) {
              data.cpuInfo.xAxis.data.shift();
              data.memoryInfo.xAxis.data.shift();
              data.cpuInfo.series[0].data.shift();
              data.memoryInfo.series[0].data.shift();
            }
            data.cpuInfo.xAxis.data.push(data.time);
            data.memoryInfo.xAxis.data.push(data.time);
            data.cpuInfo.series[0].data.push(parseFloat(data.cpu.used));
            data.memoryInfo.series[0].data.push(
              parseFloat(data.memory.usageRate)
            );
          });
        }
      }
    };
    return () => (
      <div
        v-loading={data.loading}
        element-loading-text={"数据加载中..."}
        style={data.loading ? "height: 600px" : "height: 100%"}
        class={"app-container"}
      >
        {!data.loading && (
          <div>
            <el-card class="box-card">
              <div style={{ color: "#666", fontSize: "13px" }}>
                <SvgIcon
                  iconName={"system"}
                  style={{ marginRight: "5px", width: "1em", height: "1em" }}
                ></SvgIcon>
                <span class={"os-span"}>系统：{data.sys.os}</span>
                <span class={"os-span"}>IP：{data.sys.ip}</span>
                <span class={"os-span"}>项目已不间断运行：{data.sys.day}</span>
                <el-icon onClick={() => init()} class={"el-icon-right"}>
                  <Refresh />
                </el-icon>
              </div>
            </el-card>
            <el-card
              class={"box-card"}
              v-slots={{
                header: () => {
                  return (
                    <div class={"clearfix"}>
                      <span
                        style={{
                          fontWeight: "bolder",
                          color: "#666",
                          fontSize: "15px",
                        }}
                      >
                        状态
                      </span>
                    </div>
                  );
                },
              }}
            >
              <div>
                <el-row gutter={20}>
                  {/*cpu*/}
                  <el-col
                    xs={24}
                    sm={24}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{ marginBottom: "10px" }}
                  >
                    <div class={"title"}>CPU使用率</div>
                    <el-popover
                      placement={"top"}
                      trigger={"hover"}
                      width={"auto"}
                      popper-class={"server-dark"}
                      v-slots={{
                        reference: () => {
                          return (
                            <div class={"content"}>
                              <el-progress
                                type={"dashboard"}
                                percentage={parseFloat(data.cpu.used)}
                              />
                            </div>
                          );
                        },
                      }}
                    >
                      <div style={{ fontSize: "12px" }}>
                        <div style={{ padding: "3px" }}>{data.cpu.name}</div>
                        <div style={{ padding: "3px" }}>{data.cpu.package}</div>
                        <div style={{ padding: "3px" }}>{data.cpu.core}</div>
                        <div style={{ padding: "3px" }}>{data.cpu.logic}</div>
                      </div>
                    </el-popover>
                    <div class={"footer"}>{data.cpu.coreNumber} 核心</div>
                  </el-col>

                  <el-col
                    xs={24}
                    sm={24}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{ marginBottom: "10px" }}
                  >
                    {/*内存*/}
                    <div class={"title"}>内存使用率</div>
                    <el-popover
                      placement={"top"}
                      trigger={"hover"}
                      width={"auto"}
                      popper-class={"server-dark"}
                      v-slots={{
                        reference: () => {
                          return (
                            <div class={"content"}>
                              <el-progress
                                type={"dashboard"}
                                percentage={parseFloat(data.memory.usageRate)}
                              />
                            </div>
                          );
                        },
                      }}
                    >
                      <div style={{ fontSize: "12px" }}>
                        <div style={{ padding: "3px" }}>
                          总量：{data.memory.total}
                        </div>
                        <div style={{ padding: "3px" }}>
                          已使用：{data.memory.used}
                        </div>
                        <div style={{ padding: "3px" }}>
                          空闲：{data.memory.available}
                        </div>
                      </div>
                    </el-popover>
                    <div class={"footer"}>
                      {data.memory.used} / {data.memory.total}
                    </div>
                  </el-col>
                  <el-col
                    xs={24}
                    sm={24}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{ marginBottom: "10px" }}
                  >
                    <div class={"title"}>交换区使用率</div>
                    <el-popover
                      placement={"top"}
                      trigger={"hover"}
                      width={"auto"}
                      popper-class={"server-dark"}
                      v-slots={{
                        reference: () => {
                          return (
                            <div class={"content"}>
                              <el-progress
                                type={"dashboard"}
                                percentage={parseFloat(data.swap.usageRate)}
                              />
                            </div>
                          );
                        },
                      }}
                    >
                      <div style={{ fontSize: "12px" }}>
                        <div style={{ padding: "3px" }}>
                          总量：{data.swap.total}
                        </div>
                        <div style={{ padding: "3px" }}>
                          已使用：{data.swap.used}
                        </div>
                        <div style={{ padding: "3px" }}>
                          空闲：{data.swap.available}
                        </div>
                      </div>
                    </el-popover>
                    <div class={"footer"}>
                      {data.swap.used} / {data.swap.total}
                    </div>
                  </el-col>
                  <el-col
                    xs={24}
                    sm={24}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{ marginBottom: "10px" }}
                  >
                    <div class={"title"}>磁盘使用率</div>
                    <el-popover
                      placement={"top"}
                      trigger={"hover"}
                      width={"auto"}
                      popper-class={"server-dark"}
                      v-slots={{
                        reference: () => {
                          return (
                            <div class={"content"}>
                              <el-progress
                                type={"dashboard"}
                                percentage={parseFloat(data.disk.usageRate)}
                              />
                            </div>
                          );
                        },
                      }}
                    >
                      <div style={{ fontSize: "12px" }}>
                        <div style={{ padding: "3px" }}>
                          总量：{data.disk.total}
                        </div>
                        <div style={{ padding: "3px" }}>
                          已使用：{data.disk.used}
                        </div>
                        <div style={{ padding: "3px" }}>
                          空闲：{data.disk.available}
                        </div>
                      </div>
                    </el-popover>
                    <div class={"footer"}>
                      {data.disk.used} / {data.disk.total}
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
            <div>
              <el-row gutter={6}>
                <el-col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ marginBottom: "10px" }}
                >
                  <el-card
                    class={"box-card"}
                    v-slots={{
                      header: () => {
                        return (
                          <div class={"clearfix"}>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "#666",
                                fontSize: "15px",
                              }}
                            >
                              CPU使用率监控
                            </span>
                          </div>
                        );
                      },
                    }}
                  >
                    <div class={"server-chart"}>
                      <v-chart
                        class={"cpu-chart"}
                        option={data.cpuInfo}
                        width={100}
                        height={100}
                        autoresize={true}
                      />
                    </div>
                  </el-card>
                </el-col>
                <el-col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ marginBottom: "10px" }}
                >
                  <el-card
                    class={"box-card"}
                    v-slots={{
                      header: () => {
                        return (
                          <div class={"clearfix"}>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "#666",
                                fontSize: "15px",
                              }}
                            >
                              内存使用率监控
                            </span>
                          </div>
                        );
                      },
                    }}
                  >
                    <div class={"server-chart"}>
                      <v-chart
                        class={"cpu-chart"}
                        option={data.memoryInfo}
                        width={100}
                        height={100}
                        autoresize={true}
                      />
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        )}
      </div>
    );
  },
});
export default Server;
