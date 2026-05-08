import { Menu, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import TerminalPrompt from '@components/molecules/TerminalPrompt';
import ThemeSwitch from '@components/molecules/ThemeSwitch';
import { useAuthStore } from '@stores/useAuthStore';
import styles from './TopBar.module.css';

export interface TopBarProps {
  onMenuClick?: () => void;
  showMenuBtn?: boolean;
}

const PATH_MAP: Record<string, string> = {
  '/panel': '~/panel',
  '/certs': '~/certs',
  '/apply': '~/apply',
  '/order': '~/order',
};

export default function TopBar({ onMenuClick, showMenuBtn }: TopBarProps) {
  const email = useAuthStore((s) => s.email);
  const { pathname } = useLocation();

  const promptPath = useMemo(() => {
    for (const k of Object.keys(PATH_MAP)) {
      if (pathname.startsWith(k)) return PATH_MAP[k];
    }
    return '~';
  }, [pathname]);

  const user = useMemo(() => {
    if (!email) return 'guest';
    return email.split('@')[0].slice(0, 12);
  }, [email]);

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {showMenuBtn && (
          <button
            type="button"
            onClick={onMenuClick}
            className={styles.menuBtn}
            aria-label="展开菜单"
          >
            <Menu size={18} />
          </button>
        )}
        <TerminalPrompt user={user} host="certhub" path={promptPath} />
      </div>

      <div className={styles.right}>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={styles.iconBtn}
          aria-label="刷新页面"
          title="刷新"
        >
          <RefreshCw size={16} />
        </button>
        <ThemeSwitch />
      </div>
    </header>
  );
}
