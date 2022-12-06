import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import cors from "@koa/cors"
import { PrismaClient } from "@prisma/client";
import { config } from "./config";
import router from "./router";
import { PrismaAppContext } from "./type/common";
import { errorHandler } from "./handler/error.handler";

(BigInt.prototype as any).toJSON = function () { return Number(this.toString()) }

const app = new Koa<{}, PrismaAppContext>()
const prisma = new PrismaClient({
    log: config.isDev ? ['query', 'info', 'warn', 'error'] : ['error']
})

app.context.prisma = prisma

// TODO find out why
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "online.swagger.io", "validator.swagger.io"]
    }
}))

if (config.isDev) {
    app.use(cors()) // prod will use nginx
}

app.use(errorHandler())

app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())

const server = app.listen(config.port, () => {
    console.log(`${config.isDev ? '[dev mode] ' : ''}Server started at port ${config.port}.`)
})

process.on('SIGTERM', () => gracefullyShutdown('SIGTERM'))
process.on('SIGINT', () => gracefullyShutdown('SIGINT'))

function gracefullyShutdown(signal: NodeJS.Signals) {
    console.log(`${signal} received.`)
    console.log("Closing server.")
    server.close(async () => {
        console.log("Server closed.")
        console.log("Disconnecting from mysql.")
        await prisma.$disconnect()
        console.log("Disconnected from mysql.")
    })
}