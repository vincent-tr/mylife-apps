export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
