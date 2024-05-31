import Image from 'next/image';
import { MouseEventHandler, useRef } from 'react';
import classes from './image-button.module.scss';
import { useClickOutside } from '@/hooks';

type ImageButtonProps = {
  imgSrc: string;
  alt: string;
  onclick?: MouseEventHandler<HTMLDivElement>;
  children?: JSX.Element;
  clickOutsideCallback?: () => void;
  flick?: boolean;
};

export const ImageButton = ({
  imgSrc,
  alt,
  onclick,
  children,
  clickOutsideCallback,
  flick = false
}: ImageButtonProps) => {
  const imageButtonRef = useRef(null);

  useClickOutside(imageButtonRef, clickOutsideCallback);

  return (
    <div
      ref={imageButtonRef}
      className={flick ? [classes.ImageButton, classes.flick].join(' ') : classes.ImageButton}
      onClick={onclick && onclick}
    >
      <Image sizes='50px' fill src={imgSrc} alt={alt} />
      {children}
    </div>
  );
};
