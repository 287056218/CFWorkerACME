import type { CSSProperties, ReactNode } from 'react';
import CopyButton from '../CopyButton';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  children?: ReactNode;
  code?: string; // 字符串形式的代码（优先 copy 用）
  language?: string; // 语言标签
  showCopy?: boolean;
  showLineNumbers?: boolean;
  className?: string;
  style?: CSSProperties;
  maxHeight?: number | string;
}

/**
 * 多行代码块 —— 等宽字体 + 浅色背景 + 复制按钮
 * 不做语法高亮以降低打包体积，若需要可后续接入 prism.js
 */
export default function CodeBlock({
  children,
  code,
  language,
  showCopy = true,
  showLineNumbers = false,
  className,
  style,
  maxHeight,
}: CodeBlockProps) {
  const textContent = code ?? (typeof children === 'string' ? children : '');
  const lines = (textContent || '').split('\n');

  return (
    <div
      className={[styles.wrap, className].filter(Boolean).join(' ')}
      style={style}
    >
      {(language || showCopy) && (
        <div className={styles.header}>
          {language && <span className={styles.lang}>{language}</span>}
          {showCopy && textContent && (
            <CopyButton
              text={textContent}
              label="复制"
              className={styles.copyBtn}
            />
          )}
        </div>
      )}

      <pre
        className={styles.pre}
        style={{ maxHeight: maxHeight ? `${maxHeight}${typeof maxHeight === 'number' ? 'px' : ''}` : undefined }}
      >
        <code className={styles.code}>
          {showLineNumbers
            ? lines.map((line, i) => (
                <span key={i} className={styles.line}>
                  <span className={styles.lineNumber}>{i + 1}</span>
                  <span className={styles.lineContent}>{line || ' '}</span>
                </span>
              ))
            : children || textContent}
        </code>
      </pre>
    </div>
  );
}
