import { ResponseResult } from "./ResponseResult"

export type SingleApiResponse<T> = {
    result: ResponseResult<T>,
    title: string,
    statusCode: number
}
