import { AppContext } from "../type/common";

export interface LoginDto {
    name: string;
    passwd: string;
}

export class UserHandler {
    /**
     * login.
     */
    static async login(ctx: AppContext) {
        const dto = <LoginDto>ctx.request.body
        console.log(`receive dto: `, dto)

        const found = await ctx.prisma.user.findUnique({
            where: {
                name: dto.name
            }
        })

        if (!found) {
            console.log(`no user ${dto.name} found`)
            ctx.body = false
        } else {
            ctx.body = found.passwd == dto.passwd
        }
    }
}