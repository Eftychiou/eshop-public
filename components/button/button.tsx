import React from 'react';
import classes from './button.module.scss';

export const Button = (
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) => (
  <button {...props} className={[classes.button, classes[props.type], props.className].join(' ')}>
    {props.children}
  </button>
);
