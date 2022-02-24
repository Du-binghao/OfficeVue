import { defineComponent, onMounted, reactive, watch } from "vue";
import "./index.scss";
import EditorTool from "wangeditor";
import { types } from "sass";
import Boolean = types.Boolean;
interface data {
  editor: any;
}
//todo 富文本
const Editor = defineComponent({
  props: {
    noticeContent: {
      type: String,
      default: "",
    },
    init: {
      type: Boolean,
      default: false,
    }
  },


  emits:["getNoticeContent","setInitBool"],
  setup: function (props,{ emit }) {
    const data = reactive<data>({
      editor: null,
    });
    onMounted(() => {
      data.editor = new EditorTool("#editor");
      data.editor.config.zIndex = 1;
      data.editor.config.height = 500;
      data.editor.create();
      data.editor.txt.html(props.noticeContent);
      data.editor.config.onchange = () => {
        emit("getNoticeContent",data.editor.txt.html())
      }
    });
    watch(
      () => props.init,
      () => {
        if (props.init) {
          data.editor.txt.clear();
          emit("setInitBool",false)
        }
      }
    );

    return () => <div id={"editor"}></div>;
  },
});

export default Editor;
