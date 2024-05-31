import { MutableRefObject, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useClickOutside = (ref: MutableRefObject<any>, callback: () => void) => {
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback && callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
};
