export interface ISub {
  heading: string;
  sectionTitle: string;
  route: string;
  sub: Array<ISub> | null;
  icon: string | null;
  routeName: string;
}

export interface IMenu {
  menuId: number;
  pages: Array<IMenu>;
  page: string;
  heading: string;
  sectionTitle: string;
  route: string;
  sub: Array<ISub> | null;
  isMenu: boolean;
  icon: string | null;
}

class Sub implements ISub {
  heading = "";
  sectionTitle = "";
  route = "";
  sub: Array<ISub> | null = null;
  icon: string | null = null;
  routeName = "";
}

class Menu implements IMenu {
  menuId = 0;
  pages: Array<IMenu> = new Array<IMenu>();
  page = "";
  heading = "";
  sectionTitle = "";
  route = "";
  sub: Array<ISub> | null = null;
  isMenu = false;
  icon: string | null = null;
  routeName = "";
}

const menuFormatter = (raw: any): unknown => {
  const filters = [
    "To Do List",
    "Daftar Tugas",
    "Task History",
    "Asset Management",
    "Mining Tech"
  ];

  const headers = Array<Menu>();
  const content = raw.result.content;
  content.forEach((menu) => {
    if (
      !headers.find((h) => {
        return h.heading == menu.menuType;
      })
    ) {
      const header = new Menu();
      header.menuId = menu.menuID;
      if (menu.isMenu && !filters.includes(menu.menuType)) {
        // add child menu
        const page = new Menu();
        page.heading = menu.menuType
          .replaceAll(" ", "")
          .replaceAll("&", "")
          .toLowerCase();
        page.route = menu.route;
        page.isMenu = true;
        header.pages.push(page);
      } else {
        header.heading = menu.menuType;
        header.route = menu.menuType
          .replaceAll(" ", "")
          .replaceAll("&", "")
          .toLowerCase();
        header.page = menu.menuType;
        header.isMenu = false;
        header.icon = menu.icon;
      }
      headers.push(header);
    }
  });

  headers.forEach((h) => {
    if (h.isMenu) return;
    const childs = content.filter((x) => {
      return x.menuType == h.heading;
    });
    childs.forEach((c) => {
      if (!c.details || c.details.length < 1) return;
      c.details.forEach((d) => {
        if (!d.itemDetails || d.itemDetails.length == 0) {
          const splittedUrl = d.menuName.split("/");
          const routeName = splittedUrl[splittedUrl.length - 1].replaceAll(
            "-",
            "",
          );
          const page = new Menu();
          page.menuId = d.menuID;
          page.heading = d.pageName;
          page.route = splittedUrl[splittedUrl.length - 1];
          page.isMenu = true;
          page.icon = d.icon;
          page.routeName = routeName;
          h.pages.push(page);
        } else {
          const splittedUrl = d.menuName.split("/");
          const page = new Menu();
          page.menuId = d.menuID;
          page.sectionTitle = d.pageName;
          page.route = splittedUrl[splittedUrl.length - 1];
          page.isMenu = false;
          page.icon = d.icon;
          page.sub = new Array<ISub>();
          // level 3
          const subChild = d.itemDetails.filter((x) => {
            return x.parentID == page.menuId;
          });
          subChild.forEach((sc) => {
            const splittedUrlsc = sc.menuName.split("/");
            const routeName = splittedUrlsc[
              splittedUrlsc.length - 1
            ].replaceAll("-", "");
            const subPage = new Sub();
            subPage.heading = sc.pageName;
            subPage.route = splittedUrlsc[splittedUrlsc.length - 1];
            subPage.icon = sc.icon;
            subPage.routeName = routeName;
            if (page.sub) page.sub.push(subPage);
          });
          h.pages.push(page);
        }
      });
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const final = new Array<any>();

  headers.forEach((x) => {
    final.push({
      heading: x.heading,
      sectionTitle: x.sectionTitle,
      route: x.route,
      pages: x.pages,
      page: x.page,
      sub: x.sub,
      icon: x.icon,
    });
  });

  return final;
};

export { menuFormatter };
