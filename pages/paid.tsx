import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Api } from '@/my-api';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export default function SaleValidation(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const Router = useRouter();
  useEffect(() => {
    sessionStorage.removeItem('shoppingCardList');
    setTimeout(() => {
      Router.replace('/');
    }, 3000);
  }, []);
  return <h1>{props.message}</h1>;
}

export const getServerSideProps: GetServerSideProps<{ message: string }> = (ctx) => {
  const products: Array<{ _id: string; quantity: number }> = JSON.parse(
    Buffer.from(ctx.query.items as string, 'base64')?.toString('utf-8')
  );

  return Api.finalizeSale(products)
    .then((res) => {
      return {
        props: {
          message: res.data.message
        }
      };
    })
    .catch(() => {
      return {
        notFound: true
      };
    });
};
