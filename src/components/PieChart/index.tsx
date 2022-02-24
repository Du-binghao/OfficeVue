import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import "./index.scss";

interface data {
  pieChartInfo: {
    tooltip: {
      trigger: "item";
      formatter: "{a} <br/>{b} : {c} ({d}%)";
    };
    legend: {
      left: "center";
      bottom: "10";
      data: ["Industries", "Technology", "Forex", "Gold", "Forecasts"];
    };
    calculable: true;
    series: [
      {
        name: "WEEKLY WRITE ARTICLES";
        type: "pie";
        roseType: "radius";
        radius: [15, 95];
        center: ["50%", "38%"];
        data: any;
        animationEasing: "cubicInOut";
        animationDuration: 1000;
      }
    ];
  };
}

const PieChart = defineComponent({
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
      pieChartInfo: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          bottom: "10",
          data: ["Industries", "Technology", "Forex", "Gold", "Forecasts"],
        },
        calculable: true,
        series: [
          {
            name: "WEEKLY WRITE ARTICLES",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: [
              { value: 320, name: "Industries" },
              { value: 240, name: "Technology" },
              { value: 149, name: "Forex" },
              { value: 100, name: "Gold" },
              { value: 59, name: "Forecasts" },
            ],
            animationEasing: "cubicInOut",
            animationDuration: 1000,
          },
        ],
      },
    });

    onMounted(() => {});

    return () => (
      <div class={"pie-chart"}>
        <v-chart
          class={"chart"}
          option={data.pieChartInfo}
          width={100}
          height={100}
          autoresize={true}
        />
      </div>
    );
  },
});

export default PieChart;
