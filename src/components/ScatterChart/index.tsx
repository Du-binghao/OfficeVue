import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import "./index.scss";

interface data {
  radarChartInfo: {
    tooltip: {
      trigger: "item";
      formatter: string;
    };
    xAxis: {
      scale: boolean;
      symbolSize: number;
    };
    grid: {
      top: number;
      left: string;
      right: string;
      bottom: string;
      containLabel: boolean;
    };
    yAxis: {
      scale: boolean;
      symbolSize: number;
    };
    series: [
      {
        type: string;
        symbolSize: number;
        data: [[176.5, 76.8], [153.4, 42]];
      },
      {
        type: string;
        symbolSize: number;
        // prettier-ignore
        data: any
      }
    ];
  };
}

const RadarChart = defineComponent({
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
    const radarRef = ref<HTMLDivElement>();
    const data = reactive<data>({
      radarChartInfo: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ",
        },
        xAxis: {
          scale: true,
          symbolSize: 1,
        },
        yAxis: {
          scale: true,
          symbolSize: 1,
        },
        grid: {
          top: 10,
          left: "2%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        series: [
          {
            type: "effectScatter",
            symbolSize: 10,
            data: [
              [176.5, 76.8],
              [153.4, 42],
            ],
          },
          {
            type: "scatter",
            symbolSize: 5,
            // prettier-ignore
            data: [
              [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
              [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
              [172.5, 55.2], [170.9, 54.2], [153.4, 42.0], [160.0, 50.0], [172.2, 75.2],
              [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
              [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
              [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
              [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
              [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
              [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [176.5, 76.8],
              [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
            ],
          },
        ],
      },
    });

    onMounted(() => {});

    return () => (
      <div class={"radar-chart"}>
        <v-chart
          class={"chart"}
          option={data.radarChartInfo}
          width={100}
          height={100}
          autoresize={true}
        />
      </div>
    );
  },
});

export default RadarChart;
