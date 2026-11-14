export type NotificationMode = 'sms' | 'whatsapp';

export type NotificationResult = {
  mode: NotificationMode;
  status: 'demo' | 'queued' | 'failed';
  messageId: string;
  summary: string;
};

export function routeAlert({ mode, phone, message }: { mode: NotificationMode; phone: string; message: string }): NotificationResult {
  if (process.env.NODE_ENV !== 'production') {
    return {
      mode,
      status: 'demo',
      messageId: `demo-${mode}-${Date.now()}`,
      summary: `Demo ${mode.toUpperCase()} alert preview for ${phone}. No real message was sent.`,
    };
  }

  return {
    mode,
    status: 'failed',
    messageId: `unconfigured-${mode}-${Date.now()}`,
    summary: `Live ${mode.toUpperCase()} delivery is not configured; no message was sent.`,
  };
}
