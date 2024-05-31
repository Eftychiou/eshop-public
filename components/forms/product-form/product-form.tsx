import { useContext, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ModalsContext } from '@/store/';
import { Product } from '@/my-api';
import { Api } from '@/my-api';
import { inputConfiguration } from './configuration';
import { useCategories } from '@/hooks';
import classes from './product-form.module.scss';
import { InputList } from '@/components/input-list';
import { Button } from '@/components/button';

import formStyles from '../form-styles.module.scss';

type ProductFormProps = {
  product?: Product;
  closeProduct?: () => void;
};

type FormData = {
  brand: string;
  categories: string[];
  discount: string;
  longDescription: string;
  model: string;
  price: string;
  shortDescription: string;
  stock: string;
  title: string;
  topSale: string;
};

export const ProductForm = ({ product = null, closeProduct }: ProductFormProps) => {
  const modalsCtx = useContext(ModalsContext);
  const { register, handleSubmit, setFocus, setValue, reset } = useForm();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { flattenCategories: categories } = useCategories();
  const [files, setFiles] = useState<File[]>([]);
  const [pickImageReset, setPickImageReset] = useState(0);
  useEffect(() => {
    setFocus('title');
  }, []);

  useEffect(() => {
    if (product) {
      setValue('title', product.title);
      setValue('brand', product.brand);
      setValue('longDescription', product.longDescription);
      setValue('shortDescription', product.shortDescription);
      setValue('model', product.model);
      setValue('price', product.price / 100);
      setValue('stock', product.stock);
      setValue('discount', product.meta.discount);
      setValue('topSale', product.meta.topSale);
      setValue('brand', product.brand);
    }
  }, [product, categories]);

  useEffect(() => {
    setValue(
      'categories',
      categories
        .filter((c) => selectedCategories.includes(c._id))
        .map((c) => c.categoryName)
        .join(' , ')
    );
  }, [selectedCategories, categories]);

  useEffect(() => {
    if (product) {
      setSelectedCategories(product.categories.map((c) => c._id));
    }
  }, [product]);

  const resetForm = () => {
    setPickImageReset(pickImageReset + 1);
    reset();
    setSelectedCategories([]);
  };
  const updateProduct = (data: FormData) => {
    Api.updateProduct({
      ...data,
      categories: selectedCategories,
      images: files,
      _id: product._id
    })
      .then((res) => {
        closeProduct();
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
      })
      .catch((err) => {
        modalsCtx.showNotification({ message: err.message, status: 'error' });
      });
  };

  const addProduct = (data: FormData) => {
    Api.addProduct({ ...data, categories: selectedCategories, images: files })
      .then((res) => {
        resetForm();
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
      })
      .catch((err) => {
        modalsCtx.showNotification({ message: err.message, status: 'error' });
      });
  };
  const onSubmit = (data: FormData) => {
    modalsCtx.showSpinner();
    if (!product) {
      addProduct(data);
    } else {
      updateProduct(data);
    }
  };

  const onError = (errors: { [key in keyof FormData]: { message: string; type: string } }) => {
    const [firstError] = Object.entries(errors).map((e: unknown) => e[1].message);
    modalsCtx.showNotification({ message: firstError, status: 'error' });
  };

  const pickImageConfiguration: { name: string; imagesLimit: number; loadedImagesUrl: string[] }[] = useMemo(() => {
    return inputConfiguration
      .filter((i) => i.type === 'pickImage')
      .map((i) => ({
        name: i.name,
        imagesLimit: i.pickImageConfiguration.fileLimit,
        loadedImagesUrl: product?.imagesUrl
      }));
  }, [product]);

  return (
    <form className={[classes.product_form, formStyles.form].join(' ')} onSubmit={handleSubmit(onSubmit, onError)}>
      <InputList
        selectCategoriesConfiguration={{
          handleSelectCategories: (selectedCategoriesIds) => {
            setSelectedCategories(selectedCategoriesIds);
          },
          categories,
          selectedCategories
        }}
        register={register}
        inputConfiguration={inputConfiguration}
        pickImageConfiguration={pickImageConfiguration}
        onFileListChangeHandler={(fileList) => {
          setFiles(fileList);
        }}
        onPickImageError={(error) => {
          modalsCtx.showNotification({ message: error, status: 'error' });
        }}
        pickImageReset={pickImageReset}
      />
      <Button className={[classes.submitBtn, 'Button'].join(' ')} type='submit'>
        {product ? 'Update' : 'Submit'}
      </Button>
    </form>
  );
};
