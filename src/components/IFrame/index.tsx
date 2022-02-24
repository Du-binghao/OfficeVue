import { defineComponent, onMounted, reactive } from "vue";
import "./index.scss";

interface data {
  loading: boolean;
  height: string;
}
const IFrame = defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
  },

  setup: function (props) {
    const data = reactive<data>({
      loading: true,
      height: document.documentElement.clientHeight - 94.5 + "px",
    });
    onMounted(() => {
      setTimeout(() => {
        data.loading = false;
      }, 230);
    });
    return () => (
      <div v-loading={data.loading} style={{ height: data.height }}>
        <iframe
          src={props.src}
          frameborder={"no"}
          style={{ width: "100%", height: "100%" }}
          scrolling={"auto"}
        />
      </div>
    );
  },
});

export default IFrame;
