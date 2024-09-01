type tribe = {
    menuId: number,
    menuName: string,
    isCheck: boolean,
    subMenu: Array<product>,
};

type product = {
    menuId: number,
    menuName: string,
    isCheck: boolean,
    subMenu: Array<feature>,
};

type feature = {
    menuId: number,
    menuName: string,
    isCheck: boolean,
};

export type UpsertItem = {
    userGroupMenuId: number,
    userGroupName: string,
    userGroupDescription: string,
    menu: Array<tribe>,
};
