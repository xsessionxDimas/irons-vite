export type TreeNode = {
  id: number,
  label: string,
  children: Array<TreeNode> | undefined,
  disabled: boolean
}

export type TreeItemCollapsibleOptions = {
  /**
   * you can pass state active or not active, but if you just need active or not you can pass through parent object directly
   */
  active: boolean,

  /**
   * define default state of collapsible item
   */
  default?: boolean
}

export type TreeItem = {
  label: string,
  icon: string,

  psType?: string
  fileUrl?: string
  model?: string

  /**
   * Ability to make tree collapsible
   */
  collapsible?: boolean

  children?: Array<TreeItem>,
}
