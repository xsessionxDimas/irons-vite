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
    Children: Menu[]
}
