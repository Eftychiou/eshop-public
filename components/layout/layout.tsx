import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Header } from './header/header/';
import { ModalsContext } from '../../store/';
import { ShoppingCard } from '@/components/shopping-card';
import { Notification } from '@/components/notification';
import { LoadingSpinner } from '@/components/loading-spinner';
import { DrawerToggle } from '../drawer-toggle';

export default function Layout({ children }) {
  const router = useRouter();
  const { notification, activeShoppingCard, hideShoppingCard, activeSpinner } = useContext(ModalsContext);

  const isHomePage = router.asPath === '/';

  const noLayoutRoutes =
    router.pathname.startsWith('/account-validation') || router.pathname.startsWith('/reset-password');

  return (
    <div style={{ position: 'relative' }}>
      {!noLayoutRoutes && (
        <div>
          {isHomePage && <DrawerToggle />}
          <Header />
        </div>
      )}

      <main>{children}</main>

      {notification && (
        <Notification title={notification.title} message={notification.message} status={notification.status} />
      )}
      {activeShoppingCard && (
        <ShoppingCard activeShoppingCard={activeShoppingCard} hideShoppingCard={hideShoppingCard} />
      )}
      {activeSpinner && <LoadingSpinner />}
    </div>
  );
}
