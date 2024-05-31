import { useContext, useEffect } from 'react';
import { ModalsContext } from '@/store/';
import { InputList } from '@/components/input-list';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { Api } from '@/my-api';
import classes from './change-password-form.module.scss';
import formStyles from '../form-styles.module.scss';
import { inputConfiguration } from './configuration';

export const ChangePasswordForm = () => {
  const modalsCtx = useContext(ModalsContext);
  const { register, handleSubmit, setFocus, reset } = useForm();

  useEffect(() => {
    setFocus('newPassword');
  }, []);

  const onSubmit = (data: { newPassword: string; oldPassword: string }) => {
    Api.changePassword(data)
      .then((res) => {
        modalsCtx.showNotification({ status: 'success', message: res.data.message });
        reset();
      })
      .catch((err: Error) => {
        modalsCtx.showNotification({ status: 'error', message: err.message });
      });
  };

  const onError = (errors) => {
    const [firstError] = Object.entries(errors).map((e: unknown) => e[1].message);
    modalsCtx.showNotification({ message: firstError, status: 'error' });
  };

  return (
    <form className={[classes.addProductForm, formStyles.form].join(' ')} onSubmit={handleSubmit(onSubmit, onError)}>
      <InputList register={register} inputConfiguration={inputConfiguration} />
      <Button style={{ marginTop: '2rem' }} type='submit'>
        Submit
      </Button>
    </form>
  );
};
//
