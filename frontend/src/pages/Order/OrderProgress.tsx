import { FLAG_MAP } from '@utils/constants';
import styles from './Order.module.css';

export interface OrderProgressProps {
  flag: number;
}

// 状态阶段顺序：0 等待 → 1 创建 → 2 待验证 → 3 验证中 → 4 申请中 → 5 完成
const STAGES = [
  { flag: 0, label: '等待中' },
  { flag: 1, label: '创建中' },
  { flag: 2, label: '待验证' },
  { flag: 3, label: '验证中' },
  { flag: 4, label: '申请中' },
  { flag: 5, label: '已完成' },
];

export default function OrderProgress({ flag }: OrderProgressProps) {
  const isFailed = flag === -1;

  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>
          订单进度：
          <strong
            className={styles.progressStatus}
            data-status={
              isFailed ? 'err' : flag === 5 ? 'ok' : flag >= 3 ? 'warn' : 'info'
            }
          >
            {FLAG_MAP[flag] || '未知'}
          </strong>
        </span>
      </div>
      <div className={styles.progressTrack}>
        {STAGES.map((stage, i) => {
          const isDone = !isFailed && stage.flag <= flag;
          const isCurrent = !isFailed && stage.flag === flag;
          return (
            <div
              key={stage.flag}
              className={[
                styles.progressBlock,
                isDone && styles.progressBlockDone,
                isCurrent && styles.progressBlockCurrent,
                isFailed && styles.progressBlockFailed,
              ]
                .filter(Boolean)
                .join(' ')}
              title={stage.label}
            >
              <span className={styles.progressBlockLabel}>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
