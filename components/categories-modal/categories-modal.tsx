import { Dispatch, SetStateAction, useRef } from 'react';
import classes from './categories-modal.module.scss';
import { Button } from '../button';
import { useClickOutside } from '@/hooks';
import { Category } from '@/my-api';

type ProductCategoriesModalProps = {
  setShowCategoriesModal: Dispatch<SetStateAction<boolean>>;
  handleSelectCategories: (categoriesId: Array<string>) => void;
  selectedCategories: Array<string>;
  categories: Array<Category>;
  show: boolean;
};

export const CategoriesModal = ({
  setShowCategoriesModal,
  handleSelectCategories,
  categories,
  selectedCategories,
  show
}: ProductCategoriesModalProps) => {
  const categoriesModalRef = useRef(null);
  useClickOutside(categoriesModalRef, () => {
    // setShowCategoriesModal(false);
  });

  return (
    <div ref={categoriesModalRef} className={classes.SelectCategoriesModal} style={!show ? { display: 'none' } : {}}>
      <div className={classes.container}>
        {categories.map((category) => {
          return (
            <div
              key={category._id}
              className={
                selectedCategories.includes(category._id)
                  ? [classes.category, classes.selected].join(' ')
                  : classes.category
              }
              onClick={(event) => {
                event.stopPropagation();
                if (selectedCategories.includes(category._id)) {
                  handleSelectCategories([...selectedCategories].filter((c) => c !== category._id));
                } else {
                  handleSelectCategories([...selectedCategories, category._id]);
                }
              }}
            >
              {category.categoryName}
            </div>
          );
        })}
      </div>
      <Button
        className={classes.categories_btn}
        type='button'
        onClick={() => {
          setShowCategoriesModal(false);
        }}
      >
        X
      </Button>
    </div>
  );
};
