import { defineComponent, onMounted, reactive } from "vue";
import "./index.scss";
import PanelGroup from "./component/PanelGroup";
import WordChart from "@/components/WordChart";

interface data {
  lineChartData: any;
  lineChartDataMap: any;
  dataInfo: any;
}

const index = defineComponent({
  props: {
    type: String,
  },

  setup() {
    const data = reactive<data>({
      lineChartData: {},
      lineChartDataMap: {
        people: {
          expectedData: [100, 120, 161, 134, 105, 160, 165],
          actualData: [120, 82, 91, 154, 162, 140, 145],
        },
        messages: {
          expectedData: [200, 192, 120, 144, 160, 130, 140],
          actualData: [180, 160, 151, 106, 145, 150, 130],
        },
        money: {
          expectedData: [80, 100, 121, 104, 105, 90, 100],
          actualData: [120, 90, 100, 138, 142, 130, 130],
        },
        shopping: {
          expectedData: [130, 140, 141, 142, 145, 150, 160],
          actualData: [120, 82, 91, 154, 162, 140, 130],
        },
      },
      dataInfo:[{
        name:"aaaa",
        value:180,
      },
        {
          name:"cccc",
          value:500,
        },
        {
          name:"aaddddddaa",
          value:100,
        }]
    });

    onMounted(() => {
      data.lineChartData = data.lineChartDataMap["people"];
    });

    const onSetLineChartData = (type: string) => {
      data.lineChartData = data.lineChartDataMap[type];
    };

    return () => (
      <div class={"dashboard-container"}>
        <div class={"dashboard-editor-container"}>
          {/*父组件*/}
          <PanelGroup onSetLineChartData={onSetLineChartData} />
        </div>
        <div class={"cont"}>
          <div class={"info"}>
            <WordChart chartData={data.dataInfo}></WordChart>
          </div>
        </div>
      </div>
    );
  },
});
export default index;
