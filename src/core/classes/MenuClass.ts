import { Menu } from "../types/misc/Menu"

export default class MenuClass {
  // all menu
  private allMenu: Array<Menu> = []
  /* level 0 */
  private tribeMenu: string[] = [];
  private objectTribeMenu: Array<Menu> = [];
  /* level 1 */
  private productMenu: Array<Menu> = [];
  /* level 2 */
  private featureMenu: Array<Menu> = [];
  /* level 3 */
  private childMenu: Array<Menu> = [];

  // const

  private cardDashboard = {
    'IronLake': {
      cardHeader: "",
      cardText: "A Technology Platform that contains master mapping and configuration data for IronPortal and IronForms.",
      iconPath: "/media/icons/bumaau/ironlake.png",
      path: "ironlake"
    },
    'IronForms': {
      cardHeader: "",
      cardText: "A Technology Platform containing digital maintenance forms.",
      iconPath: "/media/icons/bumaau/ironforms.png",
      path: "ironforms"
    },
    'IronPortal': {
      cardHeader: "",
      cardText: "A Technology Platform that provides critical component condition information.",
      iconPath: "/media/icons/bumaau/ironportal-black.png",
      path: "ironportal"
    },
  }

  constructor(allMenu: Array<Menu>) {
    this.allMenu = allMenu
    this.extractTribeMenu(allMenu);
    this.extractTribeMenuObject(allMenu);
    this.extractProductMenu(allMenu);
    this.extractFeatureMenu(allMenu);
    this.extractChildMenu(allMenu);
  }

  private extractTribeMenu(allMenu: Array<Menu>) {
    const all = allMenu.map((m) => {
      return m.MenuType;
    });
    this.tribeMenu = [...new Set(all)];
  }

  private extractTribeMenuObject(allMenu: Array<Menu>) {
    this.objectTribeMenu = allMenu.filter((m) => {
      return m.Level === 0;
    });
  }

  private extractProductMenu(allMenu: Array<Menu>) {
    this.productMenu = allMenu.filter((m) => {
      return m.Level === 1;
    });
  }

  private extractFeatureMenu(allMenu: Array<Menu>) {
    this.featureMenu = allMenu.filter((m) => {
      return m.Level === 2;
    });
  }

  private extractChildMenu(allMenu: Array<Menu>) {
    this.childMenu = allMenu.filter((m) => {
      return m.Level === 3;
    });
  }

  public getAllMenu(): Array<Menu> {
    return this.allMenu
  }

  public getAllTribeMenu(): string[] {
    return this.tribeMenu;
  }

  public getAllTribeMenuObject(): Array<Menu> {
    return this.objectTribeMenu;
  }

  public getAllCardTribeMenuObject() {
    return this.cardDashboard;
  }

  public getAllProductMenu(tribe: string): Array<Menu> {
    return this.productMenu.filter((m) => {
      return m.MenuType === tribe;
    });
  }

  public getAllFeatureMenu(productId: number): Array<Menu> {
    return this.featureMenu.filter((m) => {
      return m.ParentId === productId;
    });
  }

  public getAllChildMenu(featureId: number): Array<Menu> {
    return this.childMenu.filter((m) => {
      return m.ParentId === featureId;
    });
  }
}

