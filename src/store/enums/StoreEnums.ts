enum Actions {
  // action types
  ADD_BODY_CLASSNAME = "addBodyClassName",
  REMOVE_BODY_CLASSNAME = "removeBodyClassName",
  ADD_BODY_ATTRIBUTE = "addBodyAttribute",
  REMOVE_BODY_ATTRIBUTE = "removeBodyAttribute",
  ADD_CLASSNAME = "addClassName",
  VERIFY_AUTH = "verifyAuth",
  LOGIN = "login",
  LOGOUT = "logout",
  REGISTER = "register",
  UPDATE_USER = "updateUser",
  FORGOT_PASSWORD = "forgotPassword",
  SET_BREADCRUMB_ACTION = "setBreadcrumbAction",
  ACTIVE_PAGE = "activePage",
  ACTIVE_TOKEN = "activeToken",
  GET_USER_ROLE = "getUserRole",
  GET_USER_INFO = "getUserInfoFromAPI",
  GET_EXT_USER_INFO = "getExtUserInfoFromAPI",
  GET_MENU_LIST = "getMenuListFromAPI",
  GET_APPROVAL_TASKS = "getApprovalTasks",
  GET_DEMOGRAPHY_LIST = "getDemographyList",
  GET_DEMOGRAPHY_QUESTIONAIRE = "getDemographyQuestionaire",
  POST_UPLOADED_IMAGES = "postUploadedImages",
  GET_HEALTH_CHECK_QUESTION = "getHealthCheckQuestion",
  GET_HEALTH_CHECK_LIST = 'getHealthCheckList',
  GET_FOLLOW_UP_LIST = "getFollowUpList",
  SET_IS_SIDE_ACTIVE = "setIsSideActiveAction",
}

enum Mutations {
  // mutation types
  SET_CLASSNAME_BY_POSITION = "appendBreadcrumb",
  SET_AUTH = "setAuth",
  SET_USER = "setUser",
  SET_PASSWORD = "setPassword",
  SET_ERROR = "setError",
  SET_BREADCRUMB_MUTATION = "setBreadcrumbMutation",
  SET_LAYOUT_CONFIG = "setLayoutConfig",
  RESET_LAYOUT_CONFIG = "resetLayoutConfig",
  OVERRIDE_LAYOUT_CONFIG = "overrideLayoutConfig",
  OVERRIDE_PAGE_LAYOUT_CONFIG = "overridePageLayoutConfig",
  SET_ACTIVE_PAGE = "setActivePage",
  SET_ACTIVE_TOKEN = "setActiveToken",
  SET_USER_ROLE = "setUserRole",
  SET_USER_INFO = "setUserInfo",
  SET_MENU_LIST = "setMenuList",
  RESET_MENU_LIST = "resetMenuList",
  SET_MSAL_INSTANCE = "setMSALInstance",
  SET_APPROVAL_TASK = "setApprovalTasks",
  SET_DEMOGRAPHY_LIST = "setDemographyList",
  SET_DEMOGRAPHY_QUESTIONAIRE = "setDemographyQuestionaire",
  SET_UPLOADED_IMAGES = "setUploadedImages",
  SET_FOLLOW_UP_LIST = "setFollowUpList",
  SET_FOLLOW_UP_QUESTIONAIRE = "setFollowUpQuestionaire",
  SEARCHING_FUNC = "searchingFunc",
  SET_IS_SIDE_ACTIVE = "setIsSideActive",
  SET_USER_NAME_WITH_EMAIL = 'setUserNameWithEmail',
  SET_LANG = "setLang"
}

enum CACHES {
  TOKEN = "id_token",
  TOKEN_EXPIRES = "id_token_expires",
  MENU = "id_menu",
  USER = "id_user",
}

export { Actions, Mutations, CACHES };
