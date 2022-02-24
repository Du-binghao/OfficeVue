import { defineComponent } from "vue";
import "./index.scss";
import IFrame from "@/components/IFrame";
import { Request } from "@/axios";

const swagger = defineComponent({
  setup: function (props) {
    return () => <IFrame src={Request.swaggerApi}></IFrame>;
  },
});

export default swagger;
