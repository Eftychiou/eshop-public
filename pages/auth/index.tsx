import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { LoginForm } from '@/components/forms/login-form';
import { RegisterForm } from '@/components/forms/register-form';
import classes from './index.module.scss';
import { useRouter } from 'next/router';

export default function AuthenticationPage() {
  const [formType, setFormType] = useState<'signIn' | 'signup' | 'forgot-password'>('signIn');

  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/account');

    return null;
  }

  const renderTitle = (() => {
    if (formType === 'forgot-password') {
      return 'Retrieve your password';
    } else if (formType === 'signIn') {
      return 'Welcome';
    } else if (formType === 'signup') {
      return 'Sign up';
    }
  })();

  const renderSwitcher = (() => {
    if (formType === 'signIn') {
      return 'Register';
    } else if (formType === 'signup' || formType === 'forgot-password') {
      return 'SignIn';
    }
  })();

  const switcher = () => {
    if (formType === 'signIn') {
      setFormType('signup');
    } else if (formType === 'signup' || formType === 'forgot-password') {
      setFormType('signIn');
    }
  };

  const switchToLoginMode = () => {
    setFormType('signIn');
  };

  return (
    <section className={classes.AuthenticationPage}>
      <div className={classes.formContainer}>
        <p className={classes.title}> {renderTitle}</p>
        {formType === 'forgot-password' && <ForgotPasswordForm switchToLoginMode={switchToLoginMode} />}
        {formType === 'signIn' && <LoginForm />}
        {formType === 'signup' && <RegisterForm switchToLoginMode={switchToLoginMode} />}
        <div className={classes.switcher_container}>
          <p className={classes.switcher} onClick={switcher}>
            {renderSwitcher}
          </p>
          {formType === 'signIn' && (
            <p
              className={classes.switcher}
              onClick={() => {
                setFormType('forgot-password');
              }}
            >
              Forgot Password ?
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
