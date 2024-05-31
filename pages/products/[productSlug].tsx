import { useContext, useEffect } from 'react';
import { ModalsContext } from '@/store/';
import { useRouter } from 'next/router';
import { Api, Product } from '@/my-api';
import NextError from 'next/error';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

import classes from '@/pages/products/[productSlug].module.scss';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { Carousel } from '@/components/carousel';
import { Button } from '@/components/button';
import Head from 'next/head';

export default function ProductPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const modalsContext = useContext(ModalsContext);
  const router = useRouter();
  const { paymentStatus } = router.query;

  useEffect(() => {
    if (paymentStatus === 'success')
      modalsContext.showNotification({ message: 'Payment Completed', status: 'success' });
    if (paymentStatus === 'fail')
      modalsContext.showNotification({ message: 'Payment was not Completed', status: 'error' });
  }, [paymentStatus]);

  if (!props.product) {
    return <NextError statusCode={404} title='This product was not found' />;
  }

  const links = props.product.categories.map((cat) => {
    return (
      <Link key={cat._id} href={`/products/category/${cat?._id}`}>
        {cat?.categoryName}
      </Link>
    );
  });

  const stockClasses = [classes.stock];
  props.product.stock > 0 ? stockClasses.push(classes.success) : stockClasses.push(classes.fail);

  const addItem = () => {
    const shoppingCardListString = sessionStorage.getItem('shoppingCardList');
    const shoppingCardListParsed = JSON.parse(shoppingCardListString);
    let foundItemIndex;
    let newList;
    if (shoppingCardListParsed)
      foundItemIndex = shoppingCardListParsed.findIndex((item_) => item_.itemId === props.product._id);
    else {
      const newList = [{ itemId: props.product._id, quantity: 1 }];
      const newListStringified = JSON.stringify(newList);
      sessionStorage.setItem('shoppingCardList', newListStringified);
      return;
    }
    if (shoppingCardListParsed && foundItemIndex > -1) {
      const foundItem = { ...shoppingCardListParsed[foundItemIndex] };
      if (foundItem.quantity >= 10) return;
      shoppingCardListParsed[foundItemIndex].quantity++;
      const newListStringified = JSON.stringify(shoppingCardListParsed);
      sessionStorage.setItem('shoppingCardList', newListStringified);
    } else if (shoppingCardListParsed && foundItemIndex === -1) {
      const item_ = { itemId: props.product._id, quantity: 1 };
      newList = [...shoppingCardListParsed, item_];
      const itemStringified = JSON.stringify(newList);
      sessionStorage.setItem('shoppingCardList', itemStringified);
    }
  };

  const orderNowHandler = () => {
    let sessionId: string;

    Api.createCheckoutSession({ products: [{ itemId: props.product._id, quantity: 1 }] })
      .then((res) => {
        sessionId = res.data.sessionId;
        return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
      })
      .then((stripeSession) => {
        if (stripeSession) {
          stripeSession.redirectToCheckout({ sessionId });
        }
      })
      .catch((err: Error) => {
        modalsContext.showNotification({ message: err.message, status: 'error' });
      });
  };

  return (
    <>
      <Head>
        <meta name='theme-color' content='#252226'></meta>
      </Head>

      <div className={classes.content}>
        <section className={classes.left_section}>
          <div className={classes.carousel}>
            <Carousel images={props.product.imagesUrl} />
          </div>
        </section>
        <section className={classes.middle_section}>
          <div className={classes.middle_section_content}>
            <h1 className={classes.title}>{props.product.title}</h1>
            <Link href={`/products/brand/${props.product.brand}`} style={{ fontSize: '2rem' }}>
              {props.product.brand}
            </Link>
            <p />
            <div className={classes.categories}>{links}</div>
            <hr />
            <div className={classes.short_description}>
              <p>{props.product.shortDescription}</p>
            </div>
            <hr />
            <div className={classes.long_description}>
              <h1>About this item</h1>
              <p>{props.product.longDescription}</p>
            </div>
          </div>
        </section>
        <section className={classes.right_section}>
          <div className={classes.stock_top_sale_container}>
            {props.product.meta.topSale && <p className={classes.top_sale}>Top Sale</p>}

            {props.product.stock > 0 ? (
              <p className={stockClasses.join(' ')}>In Stock.</p>
            ) : (
              <p className={stockClasses.join(' ')}>Out of Stock</p>
            )}
          </div>
          <span className={classes.finalPrice}>{`€${(props.product.finalPrice / 100).toFixed(2)}`}</span>
          <div className={classes.price_wrapper}>
            {props.product.meta.discount && (
              <span className={classes.discount}>{` -${props.product.meta.discount}%`}</span>
            )}
            <p className={classes.price}>€{(props.product.price / 100).toFixed(2)}</p>
          </div>

          <div className={classes.buttons_container}>
            <Button
              disabled={props.product.stock > 0 ? false : true}
              className={classes.buttons}
              onClick={() => {
                addItem();
                modalsContext.animateShoppingCard();
              }}
            >
              Add to Cart
            </Button>
            <Button
              disabled={props.product.stock > 0 ? false : true}
              className={classes.buttons}
              onClick={orderNowHandler}
            >
              Order Now
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ product: Product }> = ({ params }) => {
  return Api.getProductById({ productId: params.productSlug as string })
    .then((res) => {
      return {
        props: { product: res.data },
        revalidate: 30
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        notFound: true
      };
    });
};

export const getStaticPaths: GetStaticPaths = () => {
  return Api.getTopSaleAndDiscountProductsIds()
    .then((res) => {
      const pathsWithParams = res.data.map((id) => ({
        params: { productSlug: id }
      }));
      return {
        paths: pathsWithParams,
        fallback: true
      };
    })
    .catch(() => {
      return {
        paths: [],
        fallback: false
      };
    });
};
