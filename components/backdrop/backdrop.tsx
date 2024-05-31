import { MouseEventHandler } from 'react';
import classes from './backdrop.module.scss';
import { useToggleScroll } from '@/hooks';

type BackdropProps = {
  show: boolean;
  clicked: MouseEventHandler<HTMLDivElement>;
};

export const Backdrop = ({ show, clicked }: BackdropProps) => {
  useToggleScroll();
  if (show) {
    return <div className={classes.Backdrop} onClick={clicked}></div>;
  }
};
