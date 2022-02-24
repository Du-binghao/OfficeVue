import { defineComponent, h, ref, onMounted, reactive } from "vue";
import { GET, POST, Request } from "@/axios";
import "./record_list.scss";

const RecordList = defineComponent({
  props: {
    meds: {
      type: Object,
      default: () => [{}],
    },
  },

  setup: function (props : any) {

    onMounted(async () => {
      // $('#captcha').attr('src', captchaUrl.data.image);
    });

    return () => (
      <div class={"record-list"}>
        <el-card
          style={{ height: "95%" }}
          class="box-card"
          v-slots={{
            header: () => {
              return (
                <div class="card-header">
                  <span style={{ marginBlockStart: "0", marginBlockEnd: "0" }}>
                    购买列表
                  </span>
                </div>
              );
            },
          }}
        >
          <div class={"dd"}>
            <el-scrollbar>
              {props.meds.map((med : any) => {
                return (
                  <el-card shadow="always" class={"list-item"}>
                    <h5 style={{ float: "left" }}>{med.medId}</h5>
                    <h5>x{med.medCount}</h5>
                  </el-card>
                );
              })}
            </el-scrollbar>
          </div>
        </el-card>
      </div>
    );
  },
});
export default RecordList;
