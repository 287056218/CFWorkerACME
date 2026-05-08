import { Button, Form, Input } from 'antd';
import { Lock, Mail, LogIn } from 'lucide-react';
import TurnstileWidget from './TurnstileWidget';
import styles from './Login.module.css';

export interface LoginFormProps {
  loading: boolean;
  captchaEnabled?: boolean;
  captchaSiteKey?: string;
  onSubmit: (email: string, password: string) => void;
  onTurnstileChange: (token: string) => void;
  onForgot: () => void;
}

export default function LoginForm({
  loading,
  captchaEnabled = true,
  captchaSiteKey,
  onSubmit,
  onTurnstileChange,
  onForgot,
}: LoginFormProps) {
  const [form] = Form.useForm<{ email: string; password: string }>();

  const handleFinish = (values: { email: string; password: string }) => {
    onSubmit(values.email, values.password);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className={styles.form}
      onFinish={handleFinish}
      requiredMark={false}
    >
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input
          size="large"
          prefix={<Mail size={16} className={styles.inputIcon} />}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={
          <div className={styles.labelWithExtra}>
            <span>密码</span>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={onForgot}
            >
              忘记密码？
            </button>
          </div>
        }
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password
          size="large"
          prefix={<Lock size={16} className={styles.inputIcon} />}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </Form.Item>

      {captchaEnabled && (
        <div className={styles.turnstile}>
          <TurnstileWidget
            siteKey={captchaSiteKey}
            onSuccess={onTurnstileChange}
            onExpired={() => onTurnstileChange('')}
          />
        </div>
      )}

      <Button
        type="primary"
        size="large"
        htmlType="submit"
        loading={loading}
        icon={<LogIn size={16} />}
        className={styles.submitBtn}
        block
      >
        登录 CertHub
      </Button>
    </Form>
  );
}
