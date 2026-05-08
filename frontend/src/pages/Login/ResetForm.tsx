import { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { KeyRound, Lock, Mail, RefreshCcw } from 'lucide-react';
import TurnstileWidget from './TurnstileWidget';
import styles from './Login.module.css';

export interface ResetFormProps {
  loading: boolean;
  turnstileReady: boolean;
  captchaEnabled?: boolean;
  captchaSiteKey?: string;
  onSubmit: (email: string, password: string, code: string) => void;
  onTurnstileChange: (token: string) => void;
  onSendCode: (email: string) => Promise<void>;
}

export default function ResetForm({
  loading,
  turnstileReady,
  captchaEnabled = true,
  captchaSiteKey,
  onSubmit,
  onTurnstileChange,
  onSendCode,
}: ResetFormProps) {
  const [form] = Form.useForm<{
    email: string;
    code: string;
    password: string;
    confirm: string;
  }>();

  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSend = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      form.validateFields(['email']);
      return;
    }
    setSending(true);
    try {
      await onSendCode(email);
      setCountdown(60);
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  const handleFinish = (values: {
    email: string;
    code: string;
    password: string;
  }) => {
    onSubmit(values.email, values.password, values.code);
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

      {captchaEnabled && (
        <div className={styles.turnstile}>
          <TurnstileWidget
            siteKey={captchaSiteKey}
            onSuccess={onTurnstileChange}
            onExpired={() => onTurnstileChange('')}
          />
        </div>
      )}

      <Form.Item
        name="code"
        label={
          <div className={styles.labelWithExtra}>
            <span>邮箱验证码</span>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={handleSend}
              disabled={sending || countdown > 0 || !turnstileReady}
            >
              {countdown > 0
                ? `${countdown}s 后重发`
                : sending
                  ? '发送中...'
                  : '发送验证码'}
            </button>
          </div>
        }
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <Input
          size="large"
          prefix={<KeyRound size={16} className={styles.inputIcon} />}
          placeholder="请输入邮箱收到的验证码"
          autoComplete="one-time-code"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="新密码"
        rules={[
          { required: true, message: '请输入新密码' },
          { min: 8, message: '密码至少 8 位' },
        ]}
        hasFeedback
      >
        <Input.Password
          size="large"
          prefix={<Lock size={16} className={styles.inputIcon} />}
          placeholder="至少 8 位"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认新密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value)
                return Promise.resolve();
              return Promise.reject(new Error('两次密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password
          size="large"
          prefix={<Lock size={16} className={styles.inputIcon} />}
          placeholder="再次输入新密码"
          autoComplete="new-password"
        />
      </Form.Item>

      <Button
        type="primary"
        size="large"
        htmlType="submit"
        loading={loading}
        icon={<RefreshCcw size={16} />}
        className={styles.submitBtn}
        block
      >
        重置密码
      </Button>
    </Form>
  );
}
