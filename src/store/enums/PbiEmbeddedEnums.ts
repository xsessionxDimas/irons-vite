enum Actions {
    GET_PBI_CONFIG = "getPbiConfig",
    POST_PBI_CONFIG = "postPbiConfig",
    GET_MINING_PBI_ROLE = "getMiningPbiRole"
}

enum Mutations {
    SET_PBI_CONFIG = "setPbiConfig",
    SET_LOADING = "setLoading",
    SET_PBI_URL = "setPBIUrl",
    SET_IS_PBI_URL_COMPLETE_URL = "setIsPBIUrlCompleteUrl",
    SET_FIRST_INIT = "setPbiFirstInit",
    SET_DATE_FILTER = "setDateFilter"
}

export { Actions, Mutations };
