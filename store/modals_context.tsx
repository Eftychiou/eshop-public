import { createContext, useEffect, useState } from 'react';
import { NotificationProps } from '@/components/notification';

export const ModalsContext = createContext<ModalsContextType>(null);

type ModalsContextType = {
  activeShoppingCard: boolean;
  showShoppingCard: () => void;
  hideShoppingCard: () => void;
  activeSideDrawer: boolean;
  showSideDrawer: () => void;
  hideSideDrawer: () => void;
  notification: NotificationProps;
  showNotification: (notificationData: NotificationProps) => void;
  hideNotification: () => void;
  activeSpinner: boolean;
  showSpinner: () => void;
  hideSpinner: () => void;
  refreshNavigationItems: () => void;
  navigationItemsRefresh: boolean;
  refreshFooterItems: () => void;
  footerItemsRefresh: boolean;
  showAddItemToShoppingCardAnimation: boolean;
  animateShoppingCard: () => void;
  toggleSideDrawer: () => void;
};

export function ModalsContextProvider(props) {
  const [activeShoppingCard, setActiveShoppingCard] = useState(false);
  const [activeSideDrawer, setActiveSideDrawer] = useState(true);
  const [activeNotification, setActiveNotification] = useState<NotificationProps>();
  const [activeSpinner, setActiveSpinner] = useState(false);
  const [navigationItemsRefresh, setNavigationItemsRefresh] = useState(false);
  const [footItemsRefresh, setFootItemsRefresh] = useState(false);

  const toggleSideDrawer = () => setActiveSideDrawer((state) => !state);
  const showShoppingCardHandler = () => setActiveShoppingCard((prevState) => !prevState);
  const hideShoppingCardHandler = () => setActiveShoppingCard(false);
  const showSideDrawerHandler = () => setActiveSideDrawer(true);
  const hideSideDrawerHandler = () => setActiveSideDrawer(false);
  const showNotificationHandler = (notificationData) => {
    setActiveNotification(notificationData);
    setActiveSpinner(false);
  };
  const hideNotificationHandler = () => setActiveNotification(null);
  const showSpinnerHandler = () => setActiveSpinner(true);
  const hideSpinnerHandler = () => setActiveSpinner(false);
  const refresh = () => setNavigationItemsRefresh((prevState) => !prevState);
  const refreshFooterItems = () => setFootItemsRefresh((prevState) => !prevState);
  const [showAddItemToShoppingCardAnimation, setShowAddItemToShoppingCardAnimation] = useState(false);

  const animateShoppingCard = () => {
    setShowAddItemToShoppingCardAnimation(true);
    setTimeout(() => {
      setShowAddItemToShoppingCardAnimation(false);
    }, 1000);
  };

  useEffect(() => {
    if (activeNotification && (activeNotification.status === 'success' || activeNotification.status === 'error')) {
      const timer = setTimeout(() => {
        hideNotificationHandler();
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  const context = {
    activeShoppingCard,
    showShoppingCard: showShoppingCardHandler,
    hideShoppingCard: hideShoppingCardHandler,
    activeSideDrawer,
    showSideDrawer: showSideDrawerHandler,
    hideSideDrawer: hideSideDrawerHandler,
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
    activeSpinner,
    showSpinner: showSpinnerHandler,
    hideSpinner: hideSpinnerHandler,
    refreshNavigationItems: refresh,
    navigationItemsRefresh,
    refreshFooterItems,
    footerItemsRefresh: footItemsRefresh,
    showAddItemToShoppingCardAnimation,
    animateShoppingCard,
    toggleSideDrawer
  };

  return <ModalsContext.Provider value={context}>{props.children}</ModalsContext.Provider>;
}
