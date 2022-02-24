import { defineComponent, nextTick, onMounted, reactive, watch } from "vue";

interface data {
  wordChartInfo: any;
}

const WordChart = defineComponent({
  props: {
    class: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  emits: ["getInformationId"],
  setup: (props, { emit }) => {
    // 获取dom节点
    const data = reactive<data>({
      wordChartInfo: {
        tooltip: {
          show: false,
        },
        backgroundColor: "rgba(255,255,255,0.15)",
        series: [
          {
            type: "wordCloud",
            gridSize: 15,
            // 字体大小范围
            sizeRange: [20, 35],
            // 文字翻转
            rotationRange: [-45, 45],
            // shape: "circle",
            left: "center",
            top: "center",
            width: "100%",
            height: "100%",
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 20,
            },
            textStyle: {
              color: function () {
                return (
                  "rgb(" +
                  Math.round(Math.random() * 255) +
                  ", " +
                  Math.round(Math.random() * 255) +
                  ", " +
                  Math.round(Math.random() * 255) +
                  ")"
                );
              },
              emphasis: {
                shadowBlur: 50,
                shadowColor: "#00a7fd",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            data: [],
          },
        ],
      },
    });

    watch(
      // 监听数据改变
      () => props.chartData.length,
      () => {
        nextTick(() => {
          props.chartData.map((item: any) => {
            data.wordChartInfo.series[0].data.push({
              name: item.informationContent,
              value: (new Date(item.informationTime)).getTime() / 1000,
              informationId:item.informationId
            });
          });
        });
      }
    );

    const getInformationId = (item: any) => {
      emit("getInformationId", item);
    };
    return () => (
      <div class={"word-chart"}>
        <v-chart
          class={"chart"}
          option={data.wordChartInfo}
          width={100}
          height={100}
          // autoresize={true}
          onClick={(item: any) => getInformationId(item)}
        />
      </div>
    );
  },
});

export default WordChart;
