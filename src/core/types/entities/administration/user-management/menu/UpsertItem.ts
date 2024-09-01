export type UpsertItem = {
    mdMenuId: number,
    menuName: string,
    pageName: string,
    // icon: string | null,
    menuType: string,
    level: number | null,
    sequence: number | null,
    isChild: boolean,
    parentId: number | null | string,
    isMenu: boolean,
    section: string,
    isActive: boolean
}
