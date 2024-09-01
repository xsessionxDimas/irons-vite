export type Menu = {
    MenuId: number,
    MenuName: string,
    MenuType: string,
    PageName: string,
    Icon: string | null,
    IsChild: boolean,
    ParentId: number | null,
    IsMenu: boolean,
    Sequence: number,
    Level: number,
    Section: string
    Children: Menu[] | undefined
}

export type ElTreeMenu = {
    menuId: number,
    menuName: string,
    isCheck: boolean,
    level?: number,
    subMenu: ElTreeMenu[]
}
