import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import classes from './shopping-list.module.scss';
import { ModalsContext } from '@/store/';
import { Api } from '@/my-api';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/button';

export default function ShoppingList({ itemList, addQuant, subQuant, removeItem, hideShoppingCard }) {
  const modalsContext = useContext(ModalsContext);

  const orderNowHandler = () => {
    let sessionId: string;
    const products: Array<{ itemId: string; quantity: number }> = JSON.parse(
      sessionStorage.getItem('shoppingCardList')
    );
    Api.createCheckoutSession({ products })
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
    <div className={classes.shoppingList}>
      <div className={classes.list}>
        {itemList.map((item) => (
          <div key={item._id} className={classes.item}>
            <Link passHref href={`/products/${item._id}`} legacyBehavior>
              <div className={classes.image} onClick={() => hideShoppingCard()}>
                <Image
                  alt='image'
                  src={
                    item?.imagesUrl[0]
                      ? `${process.env.SERVER_DOMAIN}${item?.imagesUrl[0]}`
                      : '/images/other/noImage.jpg'
                  }
                  fill
                />
              </div>
            </Link>
            <span className={classes.cancel} onClick={() => removeItem(item.itemId)} />
            <p className={classes.title}>{item.title}</p>
            <div className={classes.price}>
              {item.quantity} * €{(item.finalPrice / 100).toFixed(2)}
              <span> = €{((item.finalPrice * item.quantity) / 100).toFixed(2)}</span>
            </div>
            <div className={classes.buttonsContainer}>
              <button onClick={() => subQuant(item._id)}>-</button>
              <button onClick={() => addQuant(item._id)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={orderNowHandler} className={classes.buyButton}>
        Order Now
      </Button>
    </div>
  );
}
