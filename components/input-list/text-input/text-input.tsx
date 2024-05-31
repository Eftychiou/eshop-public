import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import classes from './text-input.module.scss';

export const TextInput = (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return <input {...props} className={[classes.text_input, props.className].join(' ')} />;
};
