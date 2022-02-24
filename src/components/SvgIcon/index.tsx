import { defineComponent } from "vue";
import "./index.scss"

const SvgIcon = defineComponent({
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },

  setup: function (props) {
    const importAll = (requireContext: __WebpackModuleApi.RequireContext) =>
      requireContext.keys().forEach(requireContext);
    try {
      importAll(require.context("../../assets/icons", true, /\.svg$/));
    } catch (error) {
      console.log(error);
    }
    return () => (
      <svg>
        <use href={"#" + props.iconName} />
      </svg>
    );
  },
});

export default SvgIcon;
