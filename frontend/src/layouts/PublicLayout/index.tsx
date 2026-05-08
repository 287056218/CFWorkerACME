import { Outlet } from 'react-router-dom';
import BackgroundFx from '@components/organisms/BackgroundFx';
import ThemeSwitch from '@components/molecules/ThemeSwitch';
import { Github } from 'lucide-react';
import Logo from '@components/organisms/Logo';
import { APP_NAME, GITHUB_URL } from '@utils/constants';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  return (
    <div className={styles.layout}>
      <BackgroundFx />

      <header className={styles.header}>
        <a
          href="/#/"
          className={styles.brand}
          aria-label={`${APP_NAME} 首页`}
        >
          <Logo size={32} />
          <span className={styles.brandName}>{APP_NAME}</span>
        </a>

        <div className={styles.actions}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubBtn}
            aria-label="GitHub"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <ThemeSwitch />
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
