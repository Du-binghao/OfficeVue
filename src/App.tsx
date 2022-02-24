import { defineComponent, onMounted } from "vue";
import "@/assets/styles/eladmin.scss";
import "./App.scss";
import store from "@/store";
import { useRoute } from "vue-router";

const App = defineComponent({
  setup: function () {
    return () => <router-view />;
  },
});

export default App;
