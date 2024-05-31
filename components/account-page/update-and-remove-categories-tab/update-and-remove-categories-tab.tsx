import { useState, useContext, useMemo } from 'react';
import { ModalsContext } from '@/store/';
import { useCategories } from '@/hooks';
import { Api, Category } from '@/my-api';
import classes from './update-and-remove-categories-tab.module.scss';
import { CategoryList } from '@/components/category-list';
import { Button } from '@/components/button';
import { TextInput } from '@/components/input-list/text-input';
import { PickImage } from '@/components/pick-image';

export const UpdateAndRemoveCategoriesTab = () => {
  const { categories, refetchCategories } = useCategories();

  const modalsCtx = useContext(ModalsContext);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pickImageReset, setPickImageReset] = useState(0);

  const reset = () => {
    setPickImageReset(pickImageReset + 1);
    setSelectedCategory(null);
    setNewCategoryName('');
  };

  const deleteCategoryHandler = () => {
    if (!selectedCategory) {
      modalsCtx.showNotification({ message: 'Select Category', status: 'error' });
      return;
    }

    modalsCtx.showSpinner();

    Api.deleteCategory({ categoryId: selectedCategory._id })
      .then((res) => {
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
      })
      .catch((err: Error) => {
        modalsCtx.showNotification({ message: err.message, status: 'error' });
      })
      .finally(() => {
        refetchCategories();
        reset();
      });
  };

  const updateCategory = (event) => {
    event.preventDefault();
    if (!newCategoryName) {
      modalsCtx.showNotification({ message: 'Enter category name', status: 'error' });
      return;
    }
    Api.updateCategory({
      newCategoryName,
      categoryId: selectedCategory._id,
      image: files[0]
    })
      .then((res) => {
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
      })
      .catch((err: Error) => {
        console.log({ err });
        modalsCtx.showNotification({ message: err.message, status: 'error' });
      })
      .finally(() => {
        reset();
        refetchCategories();
      });
  };

  const addCategory = (event) => {
    event.preventDefault();
    if (!newCategoryName) {
      modalsCtx.showNotification({ message: 'Enter category name', status: 'error' });
      return;
    }

    Api.addCategory({
      categoryName: newCategoryName,
      parentId: selectedCategory?._id || '',
      image: files[0]
    })
      .then((res) => {
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
      })
      .catch((err: Error) => {
        console.log({ err });
        modalsCtx.showNotification({ message: err.message, status: 'error' });
      })
      .finally(() => {
        reset();
        refetchCategories();
      });
  };
  const pickImageMemoized = useMemo(() => {
    return (
      <PickImage
        loadedImagesUrl={selectedCategory?.imageUrl ? [selectedCategory.imageUrl] : []}
        fileLimit={1}
        onFileListChangeHandler={(fileList) => {
          setFiles(fileList);
        }}
        onError={(error) => {
          modalsCtx.showNotification({ message: error, status: 'error' });
        }}
        pickImageReset={pickImageReset}
      />
    );
  }, [selectedCategory, pickImageReset]);
  return (
    <div className={classes.update_and_remove_categories}>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        handleSelectCategory={(category) => {
          setSelectedCategory((state) => {
            if (state?._id === category._id) {
              return null;
            } else {
              return category;
            }
          });
        }}
      />

      <hr />

      <div className={classes.bottom_container}>
        <TextInput
          className={classes.input}
          type='text'
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <div className={classes.buttons}>
          <Button onClick={deleteCategoryHandler}>Delete Category</Button>
          <Button onClick={addCategory}>Add Category</Button>
          <Button onClick={updateCategory} disabled={!selectedCategory}>
            Update Category
          </Button>
        </div>
      </div>
      <hr />

      {pickImageMemoized}
    </div>
  );
};
