import BootstrapCarousel from 'react-bootstrap/Carousel';
import Image from 'next/image';
import classes from './carousel.module.scss';

type MyCarouselProps = {
  images: Array<string>;

  slidingTimer?: number;
};

export const Carousel = ({ images, slidingTimer = 5000 }: MyCarouselProps) => {
  return (
    <BootstrapCarousel
      fade
      controls={images.length <= 1 ? false : true}
      nextIcon={<span className={[classes.arrow, 'carousel-control-next-icon'].join(' ')} />}
      prevIcon={<span className={[classes.arrow, 'carousel-control-prev-icon'].join(' ')} />}
    >
      {images.map((image, index) => (
        <BootstrapCarousel.Item key={index} interval={slidingTimer}>
          <Image alt='product_image' src={`${process.env.SERVER_DOMAIN}${image}`} fill priority />
        </BootstrapCarousel.Item>
      ))}
    </BootstrapCarousel>
  );
};
