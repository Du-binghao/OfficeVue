import { defineComponent, nextTick, onUnmounted, reactive, ref } from "vue";
import "./index.scss";
import { ElSelect } from "element-ui/types/select";
import { Select, Tree } from "element-ui";

import { POST, Request } from "@/axios";
import { ElTree } from "element-ui/types/tree";

interface data {
  treeStatus: boolean;
  treeResolve: any;
  treeNode: any;
  menuList: any;
  lastNode: [
    {
      id: "0";
      label: "所有目录";
    }
  ];
  chooseNode: {
    id: null;
    label: null;
    children?: Tree[];
  };
}
const TreeSelect = defineComponent({
  props: {
    // 点击图标才可展开
    showCheckbox: Boolean,
    // 选择框
    expandOnClickNode: Boolean,

    //传回的默认父菜单名称
    parentName: {
      type: String,
      default: () => {
        return "";
      },
    },
  },

  emits: ["chooseNode"],
  setup: (props, { emit }) => {
    const selectTree = ref();
    const tree = ref<Tree>();
    const data = reactive<data>({
      treeStatus: true,
      treeResolve: null,
      treeNode: null,
      lastNode: [
        {
          id: "0",
          label: "所有目录",
        },
      ],
      menuList: [
        {
          id: "0",
          label: "所有目录",
        },
      ],
      chooseNode: {
        id: null,
        label: null,
        children: [],
      },
    });
    onUnmounted(() => {
      clearInterval(data.menuList);
    });

    //加载node节点
    const loadNode = (node: any, resolve: any) => {
      getMenuNode(node, resolve);
    };
    //获取节点菜单
    const getMenuNode = (node: any, resolve: any) => {
      if (node.level == 0) {
        data.treeNode = node;
        data.treeResolve = resolve;
        resolve(data.lastNode);
      } else {
        setTimeout(async () => {
          const res = await POST(Request.lazyMenu, { menuId: node.data.id });
          res.data.data.map((menu: any) => {
            data.menuList.push({
              id: menu.menuId,
              label: menu.menuName,
              // false为有子节点
              hasChildren: menu.hasChildren == 0,
            });
          });
          resolve(data.menuList);
        }, 300);
      }
      data.menuList = [];
    };

    //选择节点数据
    const chooseNode = (node: any) => {
      console.log(node);
      emit("chooseNode", node);
      selectTree.value.visible = false;
      reloadTree();
    };

    //重新加载Tree
    const reloadTree = () => {
      data.treeNode.childNodes = [];
      loadNode(data.treeNode, data.treeResolve);
    };

    return () => (
      <el-select
        ref={selectTree}
        style={{ width: "450px" }}
        v-model={props.parentName}
        popper-class={"popper-class"}
      >
        <el-option value={data.menuList} class={"select-tree"}>
          {data.treeStatus && (
            <el-tree
              ref={tree}
              //控制是否为最后节点
              props={{
                isLeaf: (node: any) => {
                  if (node.hasChildren) {
                    return true;
                  }
                },
              }}
              nodeKey={"id"}
              lazy={true}
              load={loadNode}
              // 父子是否关联
              checkStrictly={true}
              // 点击图标才可展开
              expandOnClickNode={props.expandOnClickNode}
              // 高亮选中节点
              highlightCurrent={true}
              // 在点击节点的时候选中节点
              checkOnClickNode={false}
              // 选择框
              showCheckbox={props.showCheckbox}
              // 节点被点击触发事件
              onNodeClick={(node: any) => {
                chooseNode(node);
              }}
            ></el-tree>
          )}
        </el-option>
      </el-select>
    );
  },
});

export default TreeSelect;
