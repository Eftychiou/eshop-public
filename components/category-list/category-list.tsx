import { Category } from '@/my-api';
import classes from './category-list.module.scss';

export const CategoryList = ({
  categories,
  handleSelectCategory,
  selectedCategory
}: {
  categories: Array<Category>;
  handleSelectCategory: (category: Category) => void;
  selectedCategory: Category;
}) => {
  const renderCategory = (category: Category) => {
    return (
      <div
        key={category._id}
        className={
          selectedCategory?._id === category._id ? [classes.category, classes.selected].join(' ') : classes.category
        }
        onClick={(event) => {
          event.stopPropagation();
          handleSelectCategory(category);
        }}
      >
        {category.categoryName}
        {category.subcategories.length > 0 && category.subcategories.map(renderCategory)}
      </div>
    );
  };

  return <div className={classes.categoryList}>{categories.map(renderCategory)}</div>;
};
