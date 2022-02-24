import { defineComponent, reactive } from "vue";
import "./index.scss";
import store from "@/store";

interface data {
  currentPage: number;
}
const Pagination = defineComponent({
  props: {
    pageParam: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["setCurrentPage"],
  setup: (props, { emit }) => {
    const data = reactive<data>({
      currentPage: 1,
    });
    const onPageChange = async (page: number) => {
      emit("setCurrentPage", page);
    };
    return () => (
      <div>
        <el-pagination
          background={true}
          pageSize={1}
          pageSizes={[10, 20, 30, 40, 50, 100]}
          total={props.pageParam.total}
          pageCount={props.pageParam.pages}
          pagerCount={5}
          defaultCurrentPage={props.pageParam.current}
          style={{ marginTop: "8px" }}
          layout={"total,prev, pager, next"}
          // 单页隐藏
          // hideOnSinglePage={true}
          onCurrentChange={onPageChange}
        ></el-pagination>
      </div>
    );
  },
});

export default Pagination;
