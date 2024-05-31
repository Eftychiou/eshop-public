import { useEffect, useRef } from 'react';
import classes from './header.module.scss';
import { PopupElements } from '../pop-up-elements';

export const Header = () => {
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navbar = navbarRef.current;
    const checkIfOnTop = () => {
      if (window.scrollY > 0) {
        navbar.classList.remove(classes.enable);
        navbar.classList.add(classes.disable);
      } else {
        navbar.classList.add(classes.enable);
        navbar.classList.remove(classes.disable);
      }
    };
    window.addEventListener('scroll', checkIfOnTop);
    return () => window.removeEventListener('scroll', checkIfOnTop);
  }, []);
  return (
    <header ref={navbarRef} id='navbar' className={classes.Header}>
      <PopupElements />
    </header>
  );
};
