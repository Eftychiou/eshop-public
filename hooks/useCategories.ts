import { Api, Category } from '@/my-api';
import { ModalsContext } from '@/store/';
import { useEffect, useState, useContext } from 'react';

const flattenCategories = (categories: Category[]): Category[] => {
  const flatCategories: Category[] = [];

  const flatten = (category: Category, parentPath: string[] = []): void => {
    const flatCategory = {
      ...category,
      path: [...parentPath, category.categoryName]
    };
    flatCategories.push(flatCategory);

    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        flatten(subcategory, flatCategory.path);
      }
    }
  };

  for (const category of categories) {
    flatten(category);
  }

  return flatCategories;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const modalsCtx = useContext(ModalsContext);
  const [error, setError] = useState<string>('');

  const fetchCategories = () => {
    modalsCtx.showSpinner();
    Api.getCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        modalsCtx.hideSpinner();
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    error,
    refetchCategories: fetchCategories,
    flattenCategories: flattenCategories(categories)
  };
};
