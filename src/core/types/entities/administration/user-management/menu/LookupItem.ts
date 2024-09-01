export type LookupItem = {
    menuName: string[],
    pageName: string[],
    icon: string[],
    menuType: string[],
    level: string[],
    sequence: string[],
    isChild: string[],
    parentId: string[],
    isMenu: string[],
    section: string[],
    mdMenuId: string[]
};

export type LookupMenuItem = {
    MdMenuId: number,
    MenuName: string,
    PageName: string,
    MenuType: string,
    Level: number,
    Sequence: number,
    ParentId: number,
    Section: string
};
