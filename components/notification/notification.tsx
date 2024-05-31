import ReactDOM from 'react-dom';
import classes from './notification.module.scss';

export type NotificationProps = {
  message: string;
  status: 'success' | 'error' | 'pending';
  title?: string;
};

export const Notification = ({ message, status }: NotificationProps) => {
  let statusClasses = '';
  if (status === 'success') {
    statusClasses = `${classes.success} ${classes.notificationDown}`;
  }

  if (status === 'error') {
    statusClasses = `${classes.error} ${classes.notificationDown}`;
  }
  if (status === 'pending') {
    statusClasses = `${classes.pending} ${classes.notificationUp}`;
  }

  const cssClasses = `${classes.notification} ${statusClasses} `;

  return ReactDOM.createPortal(
    <div className={cssClasses}>{<h2>{message} </h2>}</div>,
    document.getElementById('notifications')
  );
};
