import { PrismaClient } from "@prisma/client";
import Koa from "koa";

export interface PrismaAppContext {
  prisma: PrismaClient;
}

export type AppContext = Koa.Context & PrismaAppContext & { teacherId: bigint };

export interface AppResponse<T> {
  code: number; // 0 means success
  msg: string;
  data?: T;
}

export type AppErrorResponse = AppResponse<string>;

export class AppError {
  constructor(
    private code: number,
    private message: string,
  ) {}

  response(): AppErrorResponse {
    return {
      code: this.code,
      msg: this.message,
    };
  }

  static throwBadParams(message: string) {
    throw new AppError(AppErrorCode.BAD_PARAMS, message);
  }
}

export enum AppErrorCode {
  BAD_PARAMS = 4003,
}

