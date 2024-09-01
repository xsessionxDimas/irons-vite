import { TreeNode } from "@/core/types/misc/TreeNode";

const treeNodeGenerator = (data: Array<any>): Array<TreeNode> => {
  const result: Array<TreeNode> = [];
  data.forEach((item) => {
    const node = {
      id: item.Id,
      label: `${item.ValClass}-${item.ValDesc}`,
      children: undefined,
    } as TreeNode;
    result.push(node);
  });
  return result;
};

export { treeNodeGenerator };
