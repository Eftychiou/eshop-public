import { useContext, useState } from 'react';
import classes from './pop-up-elements.module.scss';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ModalsContext } from '../../../../store';
import { useRouter } from 'next/router';
import { ImageButton } from '@/components/image-button';

export const PopupElements = () => {
  const { status, data } = useSession();
  const modalsContext = useContext(ModalsContext);
  const Router = useRouter();
  const [navItemsActive, setNavItemsActive] = useState(false);

  const authenticated = status === 'authenticated';
  const isHomePage = Router.asPath === '/';
  const isAboutPage = Router.asPath === '/about';
  const isAccountPage = Router.asPath === '/account';
  const isAuthPage = Router.asPath === '/auth';

  const logoutHandler = () => {
    signOut({
      redirect: false,
      callbackUrl: `${process.env.DOMAIN}/`
    }).then((res) => {
      Router.push(res.url);
      modalsContext.showNotification({ message: `See you soon ${data.user.name}`, status: 'success' });
    });
  };

  return (
    <div className={classes.pop_up_elements}>
      <ImageButton
        alt='shopping_card_btn'
        imgSrc='/content/shoping.png'
        onclick={() => modalsContext.showShoppingCard()}
        flick={modalsContext.showAddItemToShoppingCardAnimation}
      />
      <ImageButton
        clickOutsideCallback={() => {
          setNavItemsActive(false);
        }}
        alt='account_btn'
        imgSrc='/content/avatar.png'
        onclick={() => {
          setNavItemsActive((state) => !state);
        }}
      >
        <div className={navItemsActive ? [classes.nav_items, classes.active].join(' ') : classes.nav_items}>
          {!authenticated && !isAuthPage && <Link href='/auth'>Login</Link>}
          {!isHomePage && <Link href='/'>Home</Link>}
          {!isAboutPage && <Link href='/about'>About</Link>}
          {!isAccountPage && authenticated && <Link href='/account'>Account</Link>}
          {authenticated && (
            <Link onClick={() => logoutHandler()} href=''>
              Logout
            </Link>
          )}
        </div>
      </ImageButton>
    </div>
  );
};
