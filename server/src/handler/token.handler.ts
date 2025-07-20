import { AppContext } from "../type/common";

export const tokenHander =
  () =>
  async (ctx: AppContext, next: () => Promise<any>): Promise<void> => {
    const token = ctx.headers.authorization || "";
    const path = ctx.url;
    console.log({ path, token });
    if (path !== "/user/login") {
      const teacher = await ctx.prisma.user.findUnique({
        where: { name: token },
      });
      if (!teacher) {
        throw new Error(`unknown user ${token}`);
      }
      ctx.teacherId = teacher.id;
    }
    await next();
  };
