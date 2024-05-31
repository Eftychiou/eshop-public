import { useForm } from 'react-hook-form';
import { useContext, useEffect, useMemo, useState } from 'react';

import { ModalsContext } from '@/store/';
import { useCompanyInformation } from '@/hooks';
import { Api } from '@/my-api';
import { InputList } from '@/components/input-list';
import { Button } from '@/components/button';
import { inputConfiguration } from './input-configuration';
import formStyles from '../../forms/form-styles.module.scss';

export const CompanyInformationTab = () => {
  const { register, handleSubmit, setFocus, setValue } = useForm();
  const modalsCtx = useContext(ModalsContext);
  const { companyInformation } = useCompanyInformation();

  const [files, setFiles] = useState<{ fieldName: string; fileList: File[] }[]>(
    inputConfiguration.filter((i) => i.type === 'pickImage').map((i) => ({ fieldName: i.name, fileList: [] }))
  );

  const onSubmit = (data) => {
    Api.updateCompanyInformation({
      ...data,
      banner: files.find((f) => f.fieldName === 'bannerUrl').fileList[0],
      logo: files.find((f) => f.fieldName === 'logoUrl').fileList[0],
      topProductsImage: files.find((f) => f.fieldName === 'topProductsUrl').fileList[0],
      discountsImage: files.find((f) => f.fieldName === 'discountsUrl').fileList[0]
    })
      .then((res) => {
        modalsCtx.showNotification({ status: 'success', message: res.data.message });
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onError = (errors) => {
    const [firstError] = Object.entries(errors).map((e: unknown) => e[1].message);
    modalsCtx.showNotification({ message: firstError, status: 'error' });
  };

  useEffect(() => {
    if (!companyInformation) {
      return;
    }
    setFocus('email');
    setValue('companyName', companyInformation.companyName);
    setValue('email', companyInformation.email);
    setValue('address', companyInformation.address);
    setValue('phoneNumber', companyInformation.phoneNumber);
    setValue('fax', companyInformation.fax);
    setValue('firstTextField', companyInformation.firstTextField);
    setValue('secondTextField', companyInformation.secondTextField);
  }, [companyInformation]);

  const pickImageConfiguration: { name: string; imagesLimit: number; loadedImagesUrl: string[] }[] = useMemo(() => {
    return inputConfiguration
      .filter((i) => i.type === 'pickImage')
      .map((i) => ({
        name: i.name,
        imagesLimit: i.pickImageConfiguration.fileLimit,
        loadedImagesUrl: companyInformation && [companyInformation[i.name]]
      }));
  }, [companyInformation]);

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit, onError)}>
      <InputList
        register={register}
        inputConfiguration={inputConfiguration}
        onFileListChangeHandler={(files, field) => {
          setFiles((state) => {
            return state.map((s) => (s.fieldName === field ? { ...s, fileList: files } : s));
          });
        }}
        onPickImageError={(error) => {
          modalsCtx.showNotification({ message: error, status: 'error' });
        }}
        pickImageConfiguration={pickImageConfiguration}
      />

      <Button type='submit'>Submit</Button>
    </form>
  );
};
