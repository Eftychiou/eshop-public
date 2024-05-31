import { useEffect, useState } from 'react';

import { ProductList } from '@/components/product-list/';

import { ProductForm } from '@/components/forms/product-form';
import { useCategories } from '@/hooks';
import { CategoryList } from '@/components/category-list';
import { Category, Product } from '@/my-api';

export const UpdateAndRemoveProductsTab = () => {
  const [product, setProduct] = useState<Product>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const { categories } = useCategories();
  const [topSale, setTopSale] = useState<boolean>(false);

  useEffect(() => {
    setProduct(null);
  }, [selectedCategory]);

  return (
    <>
      <h1
        style={{ backgroundColor: topSale ? 'green' : 'unset' }}
        onClick={() => {
          setTopSale((state) => !state);
        }}
      >
        Top Sale
      </h1>
      <CategoryList
        categories={categories}
        handleSelectCategory={(category) => {
          setSelectedCategory((state) => {
            if (state?._id === category._id) {
              return null;
            } else {
              return category;
            }
          });
        }}
        selectedCategory={selectedCategory}
      />

      <ProductList
        selectProduct={setProduct}
        selectedCategoryId={selectedCategory?._id}
        topSale={topSale}
        product={product}
      />
      {product && (
        <ProductForm
          product={product}
          closeProduct={() => {
            setProduct(null);
          }}
        />
      )}
    </>
  );
};
