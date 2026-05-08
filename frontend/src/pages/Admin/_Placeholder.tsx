/**
 * Admin 模块的临时占位页
 * 真实实现会在任务 5 / 6 / 7 分别填充到各自的 index.tsx。
 * 这里先提供可感知的"建设中"提示，避免路由 404。
 */
import { Alert } from 'antd';

export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
      <Alert
        type="info"
        showIcon
        message={`${title} · 骨架已就绪`}
        description="该页面的具体功能将在后续任务中实现。当前仅作为管理员菜单的路由占位，证明鉴权与导航工作正常。"
      />
    </div>
  );
}
