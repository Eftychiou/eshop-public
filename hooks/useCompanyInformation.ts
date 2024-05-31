import { Api, CompanyInformation } from '@/my-api';
import { ModalsContext } from '@/store/';
import { useContext, useEffect, useState } from 'react';

export const useCompanyInformation = () => {
  const [companyInformation, setCompanyInformation] = useState<CompanyInformation>(null);

  const modalsCtx = useContext(ModalsContext);
  useEffect(() => {
    modalsCtx.showSpinner();
    Api.getCompanyInformation()
      .then((res) => {
        setCompanyInformation(res.data);
      })
      .catch((err) => {
        modalsCtx.showNotification({ message: err, status: 'error' });
      })
      .finally(() => {
        modalsCtx.hideSpinner();
      });
  }, []);

  return { companyInformation };
};
