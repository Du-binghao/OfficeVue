import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import "./index.scss";

interface data {
  barChartInfo: {
    tooltip: {
      // trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow"; // 默认为直线，可选为：'line' | 'shadow'
      };
    };
    grid: {
      top: 10;
      left: "2%";
      right: "2%";
      bottom: "3%";
      containLabel: true;
    };
    xAxis: [
      {
        type: "category";
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        axisTick: {
          alignWithLabel: true;
        };
      }
    ];
    yAxis: [
      {
        type: "value";
        axisTick: {
          show: false;
        };
      }
    ];
    series: [
      {
        name: "pageA";
        type: "bar";
        stack: "vistors";
        barWidth: "60%";
        data: [79, 52, 200, 334, 390, 330, 220];
        animationDuration: 1000;
      },
      {
        name: "pageB";
        type: "bar";
        stack: "vistors";
        barWidth: "60%";
        data: [80, 52, 200, 334, 390, 330, 220];
        animationDuration: 1000;
      },
      {
        name: "pageC";
        type: "bar";
        stack: "vistors";
        barWidth: "60%";
        data: [30, 52, 200, 334, 390, 330, 220];
        animationDuration: 1000;
      }
    ];
  };
}

const BarChart = defineComponent({
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
      default: "300px",
    },
  },
  setup: (props) => {
    const data = reactive<data>({
      barChartInfo: {
        tooltip: {
          // trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 10,
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "pageA",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration: 1000,
          },
          {
            name: "pageB",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration: 1000,
          },
          {
            name: "pageC",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration: 1000,
          },
        ],
      },
    });

    onMounted(() => {});

    return () => (
      <div class={"bar-chart"}>
        <v-chart
          class={"chart"}
          option={data.barChartInfo}
          width={100}
          height={100}
          autoresize={true}
        />
      </div>
    );
  },
});

export default BarChart;
