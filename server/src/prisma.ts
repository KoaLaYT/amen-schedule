import { PrismaClient } from "@prisma/client";
import { config } from "./config";

const prisma = new PrismaClient({
    log: config.isDev ? ['query', 'info', 'warn', 'error'] : ['error']
})

export default prisma