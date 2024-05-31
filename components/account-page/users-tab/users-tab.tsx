import { useContext } from 'react';
import moment from 'moment';
import { ModalsContext } from '@/store/';
import classes from './users-tab.module.scss';
import { useUsers } from '@/hooks';
import { Api } from '@/my-api';

const lastLogin = (date) => {
  const now = moment(new Date());
  const end = moment(date);
  let datee;
  const minutes = Math.trunc(moment.duration(now.diff(end)).asMinutes());
  const hours = Math.trunc(moment.duration(now.diff(end)).asHours());
  const days = Math.trunc(moment.duration(now.diff(end)).asDays());
  const weeks = Math.trunc(moment.duration(now.diff(end)).asWeeks());
  if (minutes < 60) {
    datee = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    datee = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    datee = `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    datee = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  return datee;
};

const dateCreated = (date) => {
  const newDate = moment(date).format('dddd DD-MM-YYYY HH:mm').toString();
  return newDate;
};

export const UsersTab = () => {
  const modalsCtx = useContext(ModalsContext);
  const { users, refetchUsers } = useUsers();

  const toggleUser = (userId: string) => {
    modalsCtx.showSpinner();
    Api.toggleUser({ userId })
      .then((res) => {
        refetchUsers();
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
      })
      .catch((err: Error) => {
        modalsCtx.showNotification({ message: err.message, status: 'error' });
      })
      .finally(() => {
        modalsCtx.hideSpinner();
      });
  };

  return (
    <div className={classes.container}>
      {users?.map((user) => {
        return (
          <div
            key={user._id}
            className={user.blocked ? classes.userDisable : classes.user}
            onClick={() => toggleUser(user._id)}
          >
            {user.admin && <h3 />}
            <p>{user.email}</p>
            <p>{user.username}</p>
            <p>Last Login: {lastLogin(user.lastLogin)}</p>
            <p>Signup: {dateCreated(user.dateCreated)}</p>
            {user.registrationConfirmed !== true ? <h2 /> : null}
          </div>
        );
      })}
    </div>
  );
};
