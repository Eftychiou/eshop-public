import { useEffect, useContext } from 'react';
import { ModalsContext } from '@/store/';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Api } from '@/my-api';

export default function AccountValidationPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const modalsContext = useContext(ModalsContext);

  useEffect(() => {
    if (props.isValidated) {
      modalsContext.showNotification({ message: 'Account Verified, You can now Login', status: 'success' });
      setTimeout(() => {
        window.close();
      }, 3000);
    } else {
      modalsContext.showNotification({ message: props.errorMessage, status: 'error' });
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, []);
}

export const getServerSideProps: GetServerSideProps<{
  isValidated: boolean;
  errorMessage?: string;
}> = (ctx) => {
  return Api.verifyEmail({ token: ctx.params.token as string })
    .then((res) => {
      if (res.data.isValidated) {
        return { props: { isValidated: true } };
      }
      return { props: { isValidated: false } };
    })
    .catch((err: Error) => {
      return {
        props: {
          isValidated: false,
          errorMessage: err.message
        }
      };
    });
};
