import { useEffect, useState, Fragment } from 'react';
import ReactDOM from 'react-dom';

import ShoppingList from './shopping-card-list/shopping-list';
import classes from './shopping-card.module.scss';
import { Backdrop } from '../backdrop/';
import { Api, Product } from '@/my-api';

type ProductWithQuantity = Product & { quantity: number };

export const ShoppingCard = ({ activeShoppingCard, hideShoppingCard }) => {
  const [products, setProducts] = useState<Array<ProductWithQuantity>>([]);
  const [shoppingCardTrigger, setShoppingCardTrigger] = useState(true);

  useEffect(() => {
    const shoppingCardList = sessionStorage.getItem('shoppingCardList');
    const productList: Array<{ itemId: string; quantity: number }> = JSON.parse(shoppingCardList);

    if (productList && productList.length > 0) {
      Api.getProductsById({ products: productList.map((p) => p.itemId) }).then((res) => {
        setProducts(res.data.map((p) => ({ ...p, quantity: productList.find((l) => l.itemId === p._id).quantity })));
      });
    }
  }, []);

  const addQuant = (itemId) => {
    const foundItemIndex = products.findIndex((item) => item._id === itemId);
    const copyData = [...products];

    if (copyData[foundItemIndex].quantity >= 10) {
      return;
    }
    copyData[foundItemIndex].quantity++;
    const storageList = copyData.map((item) => ({
      itemId: item._id,
      quantity: item.quantity
    }));
    const stringifiedData = JSON.stringify(storageList);
    sessionStorage.setItem('shoppingCardList', stringifiedData);
    setProducts(copyData);
  };
  const subQuant = (itemId) => {
    const foundItemIndex = products.findIndex((item) => item._id === itemId);
    const copyData = [...products];
    if (copyData[foundItemIndex].quantity <= 0) return;
    copyData[foundItemIndex].quantity--;
    const storageList = copyData.map((item) => ({
      itemId: item._id,
      quantity: item.quantity
    }));
    const stringifiedData = JSON.stringify(storageList);
    sessionStorage.setItem('shoppingCardList', stringifiedData);
    setProducts(copyData);
  };
  const removeItem = (itemId) => {
    const foundItemIndex = products.findIndex((item) => item._id === itemId);
    const copyData = [...products];
    copyData.splice(foundItemIndex, 1);
    const storageList = copyData.map((item) => ({
      itemId: item._id,
      quantity: item.quantity
    }));
    const stringifiedData = JSON.stringify(storageList);
    sessionStorage.setItem('shoppingCardList', stringifiedData);
    setProducts(copyData);
  };

  const shopCartClasses = [classes.shoppingCard];
  activeShoppingCard && !shoppingCardTrigger && shopCartClasses.push(classes.disappear);
  activeShoppingCard && shopCartClasses.push(classes.appear);

  const hideShoppingCardHandler = () => {
    setShoppingCardTrigger(false);
    setTimeout(() => {
      hideShoppingCard();
      setShoppingCardTrigger(true);
    }, 400);
  };

  return ReactDOM.createPortal(
    <Fragment>
      <Backdrop show={activeShoppingCard} clicked={hideShoppingCardHandler} />
      <div className={shopCartClasses.join(' ')}>
        {products ? (
          <ShoppingList
            itemList={products}
            addQuant={addQuant}
            subQuant={subQuant}
            removeItem={removeItem}
            hideShoppingCard={hideShoppingCard}
          />
        ) : (
          <h1 style={{ margin: 'auto' }}>Shopping Card Is Empty</h1>
        )}
      </div>
    </Fragment>,
    document.getElementById('shoppingCard')
  );
};
