/**
 * 管理员鉴权中间件
 * -------------------------------------------------------------------------
 * 使用方法：
 *   app.use("/admin/*", adminMiddleware);
 *   app.get("/admin/xxx", async c => { const u = c.get("admin"); ... });
 *
 * 中间件完成两件事：
 *   1. 校验登录态（沿用 users.userAuth 逻辑）；
 *   2. 校验 Users.is_admin = 1；否则返回 403。
 *
 * 同时提供 `currentUser(c)` 工具函数，在普通路由里快速获取当前用户。
 */

import type {Context, Next} from "hono";
import * as local from "hono/cookie";
import {ensureDao} from "../db";
import type {UserRow} from "../db/dao";
import {userAuth} from "../users";

/** 从 cookie 中拿到当前用户完整记录（未登录返回 null） */
export async function currentUser(c: Context): Promise<UserRow | null> {
    if (!await userAuth(c)) return null;
    const mail = local.getCookie(c, "mail");
    if (!mail) return null;
    try {
        const dao = await ensureDao(c.env as any);
        return await dao.getUser(mail);
    } catch (e) {
        console.error("[currentUser] DAO error:", e);
        return null;
    }
}

/**
 * 管理员守卫：登录 + is_admin=1。
 * 命中失败时直接 return Response，调用方一般在业务路由里先手动调用。
 */
export async function requireAdmin(c: Context): Promise<Response | UserRow> {
    const u = await currentUser(c);
    if (!u) {
        return c.json({flags: 2, texts: "用户尚未登录"}, 401);
    }
    if (!u.is_admin || Number(u.is_admin) !== 1) {
        return c.json({flags: 9, texts: "无权限访问"}, 403);
    }
    return u;
}

/** Hono 中间件版本：挂到 /admin/* 上 */
export async function adminMiddleware(c: Context, next: Next): Promise<Response | void> {
    const result = await requireAdmin(c);
    if (result instanceof Response) return result;
    // 将管理员信息挂在 c 上，后续路由可直接取用
    c.set("admin", result);
    await next();
}
