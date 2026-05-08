import { config } from 'dotenv'
config()

import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'

// 1. 创建主应用实例
const app = new Hono()

// 2. 优先添加环境设置中间件
app.use('*', async(c, next)=>{
    c.env = {
        ...(c.env || {}),
        MAIN_URLS: process.env.MAIN_URLS || '',
        baiduyun_ext: process.env.baiduyun_ext || '',
        onedrive_uid: process.env.onedrive_uid || '',
        onedrive_key: process.env.onedrive_key || '',
        alicloud_uid: process.env.alicloud_uid || '',
        alicloud_key: process.env.alicloud_key || '',
        baiduyun_uid: process.env.baiduyun_uid || '',
        baiduyun_key: process.env.baiduyun_key || '',
        cloud115_uid: process.env.cloud115_uid || '',
        cloud115_key: process.env.cloud115_key || '',
        googleui_uid: process.env.googleui_uid || '',
        googleui_key: process.env.googleui_key || '',
        yandexui_uid: process.env.yandexui_uid || '',
        yandexui_key: process.env.yandexui_key || '',
        dropboxs_uid: process.env.dropboxs_uid || '',
        dropboxs_key: process.env.dropboxs_key || ''
    }
    await next()
})

// 3. 延迟导入路由（必须在中间件之后导入）
import * as index from './index'
import { Hono } from 'hono'

// 4. 挂载路由
app.route('/', index.app)

// 静态文件服务
app.use('*', serveStatic({root: 'public/'}))

// SPA fallback：任何未匹配的 GET 请求都回退到 index.html
// 这确保用户直接访问 /panel 或刷新时也能正确加载前端
import { readFileSync, existsSync } from 'node:fs'
app.get('*', (c) => {
    const indexPath = 'public/index.html'
    if (existsSync(indexPath)) {
        return c.html(readFileSync(indexPath, 'utf-8'))
    }
    return c.text('index.html not found, please run `npm --prefix frontend run build`', 404)
})

serve({
    fetch: app.fetch,
    port: 3000,
})

export default app