import type { NotificationArgsProps } from 'antd';
import { App } from '../components';
import '@/assets/css/notification.css';
import { SvgSuccessNotificationIcon } from '@/assets';
import React from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const mapIcon = {
  success: SvgSuccessNotificationIcon,
  info: undefined,
  warning: undefined,
  error: undefined,
};

export const useNotification = () => {
  const { notification } = App.useApp();

  const notify = (type: NotificationType, options: NotificationArgsProps) => {
    notification[type]({
      ...options,
      className: 'kng-notification',
      icon: mapIcon[type] ? (
        <span className="kng-notification-icon">
          {React.createElement(mapIcon[type])}
        </span>
      ) : undefined,
      message: (
        <div className={`kng-notification-${type}-message`}>
          {options.message}
        </div>
      ),
      description: (
        <div className={`kng-notification-${type}-description`}>
          {options.description}
        </div>
      ),
      placement: options.placement ?? 'top',
      duration: options.duration ?? 3,
    });
  };

  return {
    notify,
  };
};
