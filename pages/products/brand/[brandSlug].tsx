import { Api, Product } from '@/my-api';
import { ProductItem } from '@/components/product-item/';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import classes from './brandSlug.module.scss';

export default function Categories(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className={classes.brand_page}>
      <div className={classes.title_section}>
        <h1>{props.brand}</h1>
      </div>
      <div className={classes.product_list}>
        {props.products?.map((item) => (
          <ProductItem key={item._id} {...item} />
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  {
    products: Array<Product>;
    brand: string;
  },
  { brandSlug: string }
> = (ctx) => {
  return Api.getProducts({ brand: ctx.params.brandSlug })
    .then((res) => {
      if (!res.data.length) {
        return Promise.reject();
      }
      return {
        props: {
          products: res.data,
          brand: ctx.params.brandSlug
        }
      };
    })
    .catch(() => {
      return {
        notFound: true
      };
    });
};
