import { UserCog } from 'lucide-react';
import PageShell from '@components/Layout/PageShell';
import SectionHeader from '@components/Layout/SectionHeader';
import TerminalPrompt from '@components/molecules/TerminalPrompt';
import { useAuthStore } from '@stores/useAuthStore';
import AcmeSection from '@pages/Panel/AcmeSection';
import UserSection from '@pages/Panel/UserSection';
import styles from './Account.module.css';

export default function Account() {
  const email = useAuthStore((s) => s.email);

  return (
    <PageShell>
      {/* 终端提示 */}
      <div className={styles.greet}>
        <TerminalPrompt
          user={email?.split('@')[0] || 'guest'}
          host="certhub"
          path="~/account"
          suffix={<span className={styles.cmdText}>whoami</span>}
        />
      </div>

      {/* 标题 */}
      <SectionHeader
        icon={<UserCog size={18} />}
        title="账号设置"
        subtitle="管理 ACME 私钥、API Token、登录密码与账号"
      />

      {/* 两列布局：ACME 密钥 + 账号操作 */}
      <div className={styles.grid}>
        <AcmeSection defaultExpanded />
        <UserSection email={email || ''} defaultExpanded />
      </div>
    </PageShell>
  );
}
