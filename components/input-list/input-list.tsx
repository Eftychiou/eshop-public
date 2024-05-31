import { FieldValues, UseFormRegister } from 'react-hook-form';
import classes from './input-list.module.scss';
import { CategoriesModal } from '../categories-modal';
import { useState } from 'react';
import { Category } from '@/my-api';
import { PickImage } from '../pick-image';

export type InputConfiguration = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'email' | 'dropdown' | 'categories' | 'pickImage' | 'password';
  validation?: {
    required: string;
    minLength?: { value: number; message: string };
  };
  pickImageConfiguration?: {
    fileLimit?: number;
  };
};

export const InputList = ({
  register,
  inputConfiguration,
  selectCategoriesConfiguration,
  pickImageConfiguration,
  onFileListChangeHandler,
  onPickImageError,
  pickImageReset
}: {
  pickImageReset?: number;
  register: UseFormRegister<FieldValues>;
  inputConfiguration: Array<InputConfiguration>;
  onFileListChangeHandler?: (fileList: Array<File>, field: string) => void;
  onPickImageError?: (error: string) => void;
  selectCategoriesConfiguration?: {
    categories: Array<Category>;
    selectedCategories: Array<string>;
    handleSelectCategories: (selectedCategories: Array<string>) => void;
  };
  pickImageConfiguration?: Array<{
    name: string;
    loadedImagesUrl: Array<string>;
    imagesLimit: number;
  }>;
}) => {
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const renderInput = (input: InputConfiguration) => {
    switch (input.type) {
      case 'textarea':
        return (
          <div key={input.name} className={classes.input_element}>
            <label htmlFor={input.name}>{input.label}</label>
            <textarea name={input.name} id={input.name} rows={4} {...register(input.name, input.validation)} />
          </div>
        );
      case 'dropdown':
        return (
          <div key={input.name} className={classes.input_element}>
            <label htmlFor={input.name}>{input.label}</label>
            <select name={input.name} id={input.name} {...register(input.name, input.validation)}>
              <option value='true'>True</option>
              <option value='false'>False</option>
            </select>
          </div>
        );
      case 'categories':
        if (selectCategoriesConfiguration) {
          return (
            <div key={input.name} className={classes.input_element}>
              <label htmlFor={input.name}>{input.label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type='text'
                  name='categories'
                  id='categories'
                  onClick={() => {
                    setShowCategoriesModal(true);
                  }}
                  {...register(input.name, input.validation)}
                />
                <CategoriesModal
                  key={input.name}
                  show={showCategoriesModal}
                  setShowCategoriesModal={setShowCategoriesModal}
                  handleSelectCategories={(selectedCategoriesIds) => {
                    selectCategoriesConfiguration.handleSelectCategories(selectedCategoriesIds);
                  }}
                  categories={selectCategoriesConfiguration.categories}
                  selectedCategories={selectCategoriesConfiguration.selectedCategories}
                />
              </div>
            </div>
          );
        } else {
          return null;
        }

      case 'pickImage':
        const pickImage = pickImageConfiguration?.find((c) => c.name === input.name);
        if (pickImage) {
          return (
            <div key={input.name} className={classes.input_element}>
              <label htmlFor={input.name}>{input.label}</label>
              <PickImage
                key={input.name}
                loadedImagesUrl={pickImage.loadedImagesUrl}
                fileLimit={pickImage.imagesLimit}
                onFileListChangeHandler={(fileList) => onFileListChangeHandler(fileList, input.name)}
                onError={onPickImageError}
                pickImageReset={pickImageReset}
              />
            </div>
          );
        } else {
          return null;
        }

      default:
        return (
          <div key={input.name} className={classes.input_element}>
            <label htmlFor={input.name}>{input.label}</label>
            <input type={input.type} name={input.name} id={input.name} {...register(input.name, input.validation)} />
          </div>
        );
    }
  };
  return <div className={classes.input_list}>{inputConfiguration.map(renderInput)}</div>;
};
