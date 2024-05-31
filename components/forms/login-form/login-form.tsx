import { ChangeEvent, useContext, useState } from 'react';
import { ModalsContext } from '@/store/';
import { getSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ password: '', email: '' });
  const modalsContext = useContext(ModalsContext);
  const Router = useRouter();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const login = () => {
    modalsContext.showNotification({ message: 'Logging in ...', status: 'pending' });

    const options = {
      redirect: false,
      email: credentials.email,
      password: credentials.password
    };

    signIn('credentials', options)
      .then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        return getSession();
      })
      .then((session) => {
        modalsContext.showNotification({ message: `Welcome back ${session?.user?.name}`, status: 'success' });
        Router.push('/account');
      })
      .catch((err) => {
        modalsContext.showNotification({ message: err.message, status: 'error' });
      });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login();
      }}
    >
      <input type='email' name='email' required value={credentials.email} onChange={onChange} placeholder='Email' />

      <input
        type='password'
        name='password'
        required
        value={credentials.password}
        onChange={onChange}
        placeholder='Password'
      />
      <input type='submit' value='Sign in'></input>
    </form>
  );
};
