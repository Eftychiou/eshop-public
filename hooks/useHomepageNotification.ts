import { useEffect, useContext } from 'react';
import { ModalsContext } from '@/store/';

export const useHomepageNotification = () => {
  const modalsContext = useContext(ModalsContext);

  useEffect(() => {
    let timer;
    if (sessionStorage.getItem('eshopLoaded') !== 'true') {
      sessionStorage.setItem('eshopLoaded', 'true');
      timer = setTimeout(() => {
        sessionStorage.removeItem('eshopLoaded');
      }, 600000);
      modalsContext.showNotification({ message: 'Welcome', status: 'success' });
    }
    return () => clearTimeout(timer);
  }, []);

  return null;
};
