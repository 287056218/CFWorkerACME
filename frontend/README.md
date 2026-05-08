# CertHub Frontend · Cyber-Kawaii Terminal

现代化的 SSL 证书管理界面，使用 **React 18 + TypeScript + Ant Design 5 + Framer Motion + Vite** 构建，
设计风格为 **Cyber-Kawaii Terminal**（赛博可爱终端风）。

## 技术栈

- ⚛️ **React 18** · 函数式组件 + Hooks
- 🔷 **TypeScript** · 严格模式 + Path Alias
- 🎨 **Ant Design 5** · 深度定制 Token + CSS 变量覆盖
- ✨ **Framer Motion** · 页面过渡与微交互
- 🗃️ **Zustand** · 轻量状态管理（主题、登录态）
- 📡 **Axios** · API 请求 + 统一拦截
- 🎭 **CSS Modules** · 样式作用域隔离
- 🌙 **双主题** · 白天「晨雾薄荷」 · 暗黑「深夜终端」

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认端口 5173，API 代理到 127.0.0.1:8787）
npm run dev

# 构建生产版本（产物输出到 ../public）
npm run build

# 类型检查
npm run lint
```

## 目录结构

```
src/
├── api/            # API 请求封装（auth / order / user / types）
├── components/     # 组件（atoms / molecules / organisms / layout）
├── hooks/          # 自定义 hooks
├── layouts/        # 页面布局（Public / Admin）
├── pages/          # 页面（Home / Login / Panel / Certs / Apply / Order）
├── stores/         # Zustand 状态
├── theme/          # 设计 token（variables / tokens / animations / reset）
├── utils/          # 工具函数（crypto / constants / format / kaomoji）
├── App.tsx         # 根组件（ConfigProvider + HashRouter）
├── routes.tsx      # 路由配置（懒加载 + 路由守卫）
└── main.tsx        # 入口
```

## 设计系统

### 配色

- **白天模式「晨雾薄荷」**：米白底 + 薄荷绿主色 + 珊瑚橙点缀
- **暗黑模式「深夜终端」**：深墨绿底 + 荧光薄荷 + CRT 荧光橙

### 字体

- `JetBrains Mono` —— 数字、代码、订单号
- `Plus Jakarta Sans` —— 英文正文
- `LXGW WenKai` / `HarmonyOS Sans SC` —— 中文正文
- `Caveat` —— 手写点缀（欢迎语等）

### 组件规范

所有组件按原子设计分层：
- **Atoms** · `Pill` `Chip` `CodeInline` `Kbd` `Dot` `Divider`
- **Molecules** · `TerminalPrompt` `StatusPulse` `CopyButton` `Kaomoji` `GradientText` `CodeBlock` `StatCard` `EmptyState` `ThemeSwitch` `Loading`
- **Organisms** · `BackgroundFx` `Logo` `UserCard` `Sidebar` `TopBar`
- **Layout** · `PageShell` `SectionHeader` `ProtectedRoute`
