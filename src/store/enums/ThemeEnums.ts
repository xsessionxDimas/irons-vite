enum Actions {
    GET_ALL_THEMES = "getAllTheme",
    CREATE_THEME = "createTheme",
    UPDATE_THEME = "updateTheme",
    DELETE_THEME = "deleteTheme",
    GET_BY_ID = "getById",
}

enum Mutations {
    SET_THEMES = "setThemes",
    SET_THEME_DS = "setThemesDS",
    SET_THEME = "setTheme",
    SET_FILTERS = "setFilters",
    SET_ERROR = "setError",
}

export { Actions, Mutations };
