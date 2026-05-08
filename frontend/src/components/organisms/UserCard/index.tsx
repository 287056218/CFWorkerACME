import { useState } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { Dropdown, type MenuProps } from 'antd';
import { useAuthStore } from '@stores/useAuthStore';
import { useGravatar, emailInitial } from '@hooks/useGravatar';
import styles from './UserCard.module.css';

/**
 * 侧边栏底部用户信息卡
 */
export default function UserCard() {
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = useGravatar(email, 80);

  const menuItems: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <Settings size={14} />,
      label: '账号设置',
      onClick: () => {
        window.location.hash = '#/panel';
      },
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogOut size={14} />,
      label: '退出登录',
      danger: true,
      onClick: () => logout(),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="topRight"
    >
      <button className={styles.card} type="button">
        <div className={styles.avatar}>
          {!avatarError && email ? (
            <img
              src={avatarUrl}
              alt=""
              onError={() => setAvatarError(true)}
              loading="lazy"
            />
          ) : (
            <span className={styles.initial}>{emailInitial(email)}</span>
          )}
          <span className={styles.onlineDot} />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{email?.split('@')[0] || 'guest'}</div>
          <div className={styles.email}>{email || 'not logged in'}</div>
        </div>
      </button>
    </Dropdown>
  );
}
