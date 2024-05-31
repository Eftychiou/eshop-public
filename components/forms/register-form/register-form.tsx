import { ChangeEvent, useContext, useState } from 'react';
import { ModalsContext } from '@/store/';
import { Api } from '@/my-api';
import classes from '@/pages/auth/index.module.scss';

export const RegisterForm = ({ switchToLoginMode }: { switchToLoginMode: () => void }) => {
  const [credentials, setCredentials] = useState({ confirmPassword: '', password: '', username: '', email: '' });

  const modalsContext = useContext(ModalsContext);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const resetInputs = () => {
    setCredentials({ confirmPassword: '', email: '', password: '', username: '' });
  };

  const signup = () => {
    Api.register(credentials)
      .then((response) => {
        modalsContext.showNotification({ message: response.data.message, status: 'success' });
        switchToLoginMode();
        resetInputs();
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
        signup();
      }}
    >
      <input type='email' name='email' required value={credentials.email} onChange={onChange} placeholder='Email' />

      <input
        type='text'
        name='username'
        required
        value={credentials.username}
        onChange={onChange}
        placeholder='Username'
      />

      <input
        type='password'
        name='password'
        required
        value={credentials.password}
        onChange={onChange}
        placeholder='Password'
      />

      <input
        type='password'
        name='confirmPassword'
        required
        value={credentials.confirmPassword}
        onChange={onChange}
        placeholder='Confirm Password'
      />

      <input type='submit' value='Register'></input>
    </form>
  );
};
