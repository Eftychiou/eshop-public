import React from 'react';
import classes from './drawer-toggle.module.scss';
import { ModalsContext } from '@/store/';
import { useContext } from 'react';

export const DrawerToggle = () => {
  const modalsCtx = useContext(ModalsContext);
  return (
    <div className={classes.DrawerToggle} onClick={modalsCtx.toggleSideDrawer}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
