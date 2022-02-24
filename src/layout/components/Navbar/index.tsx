import { defineComponent } from "vue";

const Navbar = defineComponent({
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },

  setup: function () {
    return () => <div>123</div>;
  },
});

export default Navbar;
