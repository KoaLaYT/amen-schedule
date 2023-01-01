import prisma from "../src/prisma"
import CryptoJS from "crypto-js"
import { LoginDto, UserHandler } from "../src/handler/user.handler"
import { AppContext } from "../src/type/common"

const passwd = CryptoJS.MD5("passwd").toString()

beforeAll(async () => {
    await prisma.user.deleteMany()

    await prisma.user.create({
        data: {
            name: 'amen',
            passwd
        }
    })
})

test('only amen can login', async () => {
    const dto = <LoginDto>{
        name: 'amen',
        passwd
    }

    const ctx = <AppContext>{
        prisma,
        request: {
            body: dto
        },
        body: {} as any
    }

    await UserHandler.login(ctx)

    expect(ctx.body).toBeTruthy()
})

test('amen with bad passwd cannot login', async () => {
    const dto = <LoginDto>{
        name: 'amen',
        passwd: CryptoJS.MD5('wrong passwd').toString()
    }

    const ctx = <AppContext>{
        prisma,
        request: {
            body: dto
        },
        body: {} as any
    }

    await UserHandler.login(ctx)

    expect(ctx.body).toBeFalsy()
})

test('other user cannot login', async () => {
    const dto = <LoginDto>{
        name: 'koalayt',
        passwd
    }

    const ctx = <AppContext>{
        prisma,
        request: {
            body: dto
        },
        body: {} as any
    }

    await UserHandler.login(ctx)

    expect(ctx.body).toBeFalsy()
})