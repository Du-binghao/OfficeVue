import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import "./index.scss";
import { SetOptionOpts } from "echarts";

// echarts theme
interface data {
  lineChartInfo: {
    xAxis: {
      data: string[];
      boundaryGap: boolean;
      axisTick: {
        show: boolean;
      };
      axisLine: {
        lineStyle: {
          color: "#3888fa";
        };
      };
    };
    grid: {
      left: number;
      right: number;
      bottom: number;
      top: number;
      containLabel: boolean;
    };
    tooltip: {
      trigger: string;
      axisPointer: {
        type: string;
      };
      padding: number[];
    };
    yAxis: {
      axisTick: {
        show: boolean;
      };
      axisLine: {
        show: true;
        lineStyle: {
          color: "#3888fa";
        };
      };
    };
    legend: {
      data: string[];
    };
    series: [
      {
        name: string;
        smooth: boolean;
        type: string;
        data: number[];

        // itemStyle: {
        //   normal: {
        //     color: string;
        //   };
        // };
        lineStyle: {
          color: string;
          width: number;
        };
        color: string;
        animationDuration: number;
        animationEasing: string;
      },
      {
        name: string;
        smooth: boolean;
        type: string;
        data: number[];
        color: string;
        lineStyle: {
          color: string;
          width: number;
        };
        areaStyle: {
          color: string;
        };
        animationDuration: number;
        animationEasing: string;
      }
    ];
  };
}

const LineChart = defineComponent({
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },

  setup: (props) => {
    // 获取dom节点
    const chartRef = ref<HTMLElement>();
    const data = reactive<data>({
      lineChartInfo: {
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#3888fa",
            },
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#3888fa",
            },
          },
        },
        legend: {
          data: ["expected", "actual"],
        },
        series: [
          {
            name: "expected",
            lineStyle: {
              color: "#FF005A",
              width: 2,
            },
            color: "#FF005A",
            smooth: true,
            type: "line",
            data: [],
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: "actual",
            smooth: true,
            type: "line",
            color: "#3888fa",
            lineStyle: {
              color: "#3888fa",
              width: 2,
            },
            areaStyle: {
              color: "#f3f8ff",
            },
            data: [],
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
        ],
      },
    });

    watch(
      // 监听数据改变
      () => props.chartData,
      () => {
        nextTick(() => {
          data.lineChartInfo.series[0].data = props.chartData.expectedData;
          data.lineChartInfo.series[1].data = props.chartData.actualData;
        });
      }
    );
    onMounted(() => {});

    return () => (
      <div class={"line-chart"}>
        <v-chart
          class={"chart"}
          option={data.lineChartInfo}
          width={100}
          height={100}
          autoresize={true}
        />
      </div>
    );
  },
});

export default LineChart;
