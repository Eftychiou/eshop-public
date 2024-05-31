import { useState, useEffect } from 'react';

import classes from './parallax.module.scss';

export const Parallax = ({ children }: { children: JSX.Element }) => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={classes.parallax}>
      <div className={classes.parallaxContent}>{children}</div>
      <div className={classes.parallaxBackground} style={{ transform: `translateY(${offsetY * 0.6}px)` }} />
      <div className={classes.parallaxBackgroundTriangles} style={{ transform: `translateY(${offsetY * 0.45}px)` }} />
    </div>
  );
};
