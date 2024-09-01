import LayoutConfigTypes from "@/core/config/LayoutConfigTypes";

const Config: LayoutConfigTypes = {
  themeName: "Metronic",
  themeVersion: "8.0.27",
  demo: "demo1",
  main: {
    type: "default",
    primaryColor: "#009EF7",
    logo: {
      dark: "/media/logos/logo-1-dark.svg",
      light: "/media/logos/logo-1.svg",
    },
  },
  loader: {
    logo: "/media/logos/logo-1-dark.svg",
    display: false,
    type: "default",
  },
  scrollTop: {
    display: true,
  },
  header: {
    display: true,
    menuIcon: "font",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  toolbar: {
    display: true,
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  aside: {
    display: true,
    theme: "light",
    fixed: true,
    menuIcon: "svg",
    minimized: false,
    minimize: true,
    hoverable: true,
  },
  content: {
    width: "fixed",
  },
  footer: {
    width: "fluid",
  },
};

export default Config;
