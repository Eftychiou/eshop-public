import { ProductItem } from '../../../components/product-item';
import { Api, Category, Product } from '@/my-api';
import classes from './categorySlug.module.scss';
import { Label } from '../../../components/label';
import { useRouter } from 'next/router';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export default function Categories(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mainCategoryIndex = props.categories.length - 1;
  const category = props.categories[mainCategoryIndex];
  const router = useRouter();

  return (
    <div className={classes.category_page}>
      <div className={classes.title_section}>
        {category?.imageUrl && (
          <div
            className={classes.image}
            style={{ background: `url('${process.env.SERVER_DOMAIN}${category.imageUrl}') no-repeat center` }}
          ></div>
        )}
        <div className={classes.categories}>
          {props.categories.map((c) => (
            <div
              style={c._id === props.categories[mainCategoryIndex]._id ? {} : { cursor: 'pointer' }}
              key={c._id}
              onClick={() => {
                if (c._id === props.categories[mainCategoryIndex]._id) {
                  return;
                }
                router.push(`/products/category/${c._id}`);
              }}
            >
              <Label>{c.categoryName}</Label>
            </div>
          ))}
        </div>
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
    categories: Category[];
    products: Array<Product>;
  },
  { categorySlug: string }
> = (ctx) => {
  const getProductPromise = Api.getProducts({ category: ctx.params.categorySlug });
  const getCategoriesByPathPromise = Api.getCategoriesByPath({ categoryId: ctx.params.categorySlug });

  return Promise.all([getCategoriesByPathPromise, getProductPromise])
    .then(([categoryResponse, productsResponse]) => {
      return {
        props: {
          categories: categoryResponse.data,
          products: productsResponse.data
        }
      };
    })
    .catch(() => {
      return {
        notFound: true
      };
    });
};
