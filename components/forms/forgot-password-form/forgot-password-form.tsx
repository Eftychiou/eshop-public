import { useState, useContext } from 'react';
import { ModalsContext } from '@/store/';
import classes from '@/pages/auth/index.module.scss';
import { Api } from '@/my-api';

export const ForgotPasswordForm = ({ switchToLoginMode }: { switchToLoginMode: () => void }) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const modalsContext = useContext(ModalsContext);

  const sendEmail = () => {
    modalsContext.showNotification({ message: 'Sending email...', status: 'pending' });
    Api.forgotPassword({ email: enteredEmail })
      .then((response) => {
        modalsContext.showNotification({ message: response.data.message, status: 'success' });
        switchToLoginMode();
        setEnteredEmail('');
      })
      .catch((err: Error) => {
        modalsContext.showNotification({ message: err.message, status: 'error' });
      });
  };

  return (
    <form
      className={classes.form}
      onSubmit={(e) => {
        e.preventDefault();
        sendEmail();
      }}
    >
      <input
        type='text'
        id='email'
        required
        value={enteredEmail}
        onChange={(e) => setEnteredEmail(e.target.value)}
        placeholder='Email'
      />

      <input type='submit' value='Submit'></input>
    </form>
  );
};
