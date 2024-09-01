export type TreeNode = {
    id: number
    menuName: string
    subMenu: Array<TreeNode> | undefined
    disabled: boolean
}

export type TreeItemCollapsibleOptions = {
    /**
     * you can pass state active or not active, but if you just need active or not you can pass through parent object directly
     */
    active: boolean

    /**
     * define default state of collapsible item
     */
    default?: boolean
}

export type TreeItem = {
    label: string
    icon: string

    versionHistoryId: number
    equipmentModelId: number
    equipmentModel: string
    menuName: string
    subMenu: Array<TreeItem> | null
    fileUrl: string
    fileUrlId: number
    sequence: number

    /**
     * Ability to make tree collapsible
     */
    collapsible?: boolean
}
