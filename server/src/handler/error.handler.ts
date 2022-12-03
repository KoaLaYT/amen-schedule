import { Context } from "koa";
import { AppError, AppResponse } from "../type/common";

export const errorHandler = () =>
    async (ctx: Context, next: () => Promise<any>): Promise<void> => {
        const start = new Date().getTime()
        console.log(`[${new Date(start)}] ${ctx.method} ${ctx.URL} -- REQUEST`)
        try {
            await next()
            ctx.status = 200
            ctx.body = <AppResponse<any>>{
                code: 0,
                msg: 'success',
                data: ctx.body
            }
        } catch (err: any) {
            if (err instanceof AppError) {
                ctx.status = 200
                ctx.body = err.response()
            } else {
                console.error(err)
                ctx.status = err.status || 500
            }
        }
        const end = new Date()
        const ms = end.getTime() - start;
        console.log(`[${end}] ${ctx.method} ${ctx.URL} -- RESPONSE in ${ms} ms`)
    }