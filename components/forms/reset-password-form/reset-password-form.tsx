import { Fragment, useState, useContext } from 'react';
import classes from './reset-password-form.module.scss';
import { ModalsContext } from '@/store/';
import { Api } from '@/my-api';

export const ResetPasswordForm = ({ firstTokenValidation, token }) => {
  const [enteredNewPassword, setEnteredNewPassword] = useState('');

  const modalsContext = useContext(ModalsContext);

  const submitHandler = (event) => {
    event.preventDefault();
    modalsContext.showNotification({ message: 'Resetting Password ...', status: 'pending' });
    Api.resetPassword({ firstTokenValidation, newPassword: enteredNewPassword, token })
      .then((res) => {
        if (res.data.passwordChanged) {
          modalsContext.showNotification({ message: res.data.message, status: 'success' });
          return;
        }
        modalsContext.showNotification({ message: res.data.message, status: 'error' });
      })
      .catch((err: Error) => {
        modalsContext.showNotification({ message: err.message, status: 'error' });
      });
  };

  return (
    <Fragment>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='new-password'>New Password</label>
          <input
            type='password'
            id='new-password'
            value={enteredNewPassword}
            onChange={(e) => setEnteredNewPassword(e.target.value)}
          />
        </div>
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
      </form>
    </Fragment>
  );
};
