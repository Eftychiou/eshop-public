import { Api, Product } from '@/my-api';
import { useEffect, useState } from 'react';

export const useProducts = (props: { category?: string; topSale?: boolean }) => {
  const [products, setProducts] = useState<Array<Product>>([]);

  const fetchProducts = () => {
    Api.getProducts(props)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [props.category, props.topSale]);

  return { products, refetchProducts: fetchProducts };
};
