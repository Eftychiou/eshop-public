import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { Api } from '@/my-api';
import { useContext, useEffect } from 'react';
import { ModalsContext } from '@/store';

export default function ResetPasswordPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const modalsContext = useContext(ModalsContext);
  useEffect(() => {
    if (props.error) {
      modalsContext.showNotification({ message: props.error.message, status: 'error' });
      // setTimeout(() => {
      //   window.close();
      // }, 3000);
    }
  }, []);
  if (props.error) return null;

  return <ResetPasswordForm firstTokenValidation={props.isValidated} token={props.token} />;
}

export const getServerSideProps: GetServerSideProps<{
  isValidated?: boolean;
  token?: string;
  error?: {
    message: string;
  };
}> = (context) => {
  return Api.validateToken({ token: context.params.token as string })
    .then((res) => {
      if (res.data.isValidated) {
        return {
          props: { isValidated: true, token: context.params.token as string }
        };
      }
      return {
        props: { isValidated: false, token: null }
      };
    })
    .catch((err) => {
      return {
        props: {
          error: {
            message: err.message
          }
        }
      };
    });
};
