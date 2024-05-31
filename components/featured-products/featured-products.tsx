import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from 'react';
import classes from './featured-products.module.scss';
import { ProductItem } from '../product-item';
import { Product } from '@/my-api';
import { debounce } from '@/utils';
import { Label } from '../label';
import { useRouter } from 'next/router';
import Image from 'next/image';

type FeatureProductsProps = {
  items: Array<Product>;
  featuredId: string;
  featuredName: string;
  withNavigation?: boolean;
  imageUrl?: string;
};

export const FeatureProducts = ({
  items,
  featuredId,
  featuredName,
  imageUrl,
  withNavigation = true
}: FeatureProductsProps) => {
  const productListRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollRight = debounce(() => {
    let imageSize = 0;
    let itemsToScroll = 0;

    if (innerWidth > 1920) {
      imageSize = innerWidth / 6;
      itemsToScroll = 5;
    } else if (innerWidth > 1200) {
      imageSize = innerWidth / 5;
      itemsToScroll = 4;
    } else if (innerWidth > 1024) {
      imageSize = innerWidth / 4;
      itemsToScroll = 3;
    } else if (innerWidth > 768) {
      imageSize = innerWidth / 3;
      itemsToScroll = 2;
    } else {
      imageSize = innerWidth / 2;
      itemsToScroll = 1;
    }

    productListRef.current.scrollTo({
      left: productListRef.current.scrollLeft + imageSize * itemsToScroll,
      behavior: 'smooth'
    });
  });

  const scrollLeft = debounce(() => {
    let imageSize = 0;
    let itemsToScroll = 0;

    if (innerWidth > 1920) {
      imageSize = innerWidth / 6;
      itemsToScroll = 5;
    } else if (innerWidth > 1200) {
      imageSize = innerWidth / 5;
      itemsToScroll = 4;
    } else if (innerWidth > 1024) {
      imageSize = innerWidth / 4;
      itemsToScroll = 3;
    } else if (innerWidth > 768) {
      imageSize = innerWidth / 3;
      itemsToScroll = 2;
    } else {
      imageSize = innerWidth / 2;
      itemsToScroll = 1;
    }
    productListRef.current.scrollTo({
      left: productListRef.current.scrollLeft - imageSize * itemsToScroll,
      behavior: 'smooth'
    });
  });

  useEffect(() => {
    const goToTheLeft = () => {
      if (innerWidth > 768) {
        productListRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    };
    window.addEventListener('resize', goToTheLeft);
    return () => {
      window.removeEventListener('resize', goToTheLeft);
    };
  }, []);

  return (
    <section
      id={featuredId}
      className={imageUrl ? classes.featuredProducts : [classes.featuredProducts, classes.no_img].join(' ')}
    >
      {imageUrl && (
        <>
          <div
            className={classes.image_cover}
            style={{
              background: `url('${process.env.SERVER_DOMAIN}${imageUrl}') no-repeat center`
            }}
          />
          <div className={classes.image}>
            <Image fill src={`${process.env.SERVER_DOMAIN}${imageUrl}`} alt='' />
          </div>
        </>
      )}

      <div className={classes.content}>
        <div className={classes.label_container} style={withNavigation ? { cursor: 'pointer' } : {}}>
          <div
            onClick={() => {
              if (!withNavigation) {
                return;
              }
              router.push(`/products/category/${featuredId}`);
            }}
          >
            <Label>{featuredName}</Label>
          </div>

          <div className={classes.arrows}>
            <FontAwesomeIcon icon='less-than' className={[classes.icon, classes.left].join(' ')} onClick={scrollLeft} />
            <FontAwesomeIcon
              icon='greater-than'
              className={[classes.icon, classes.right].join(' ')}
              onClick={scrollRight}
            />
          </div>
        </div>

        <div ref={productListRef} className={classes.items}>
          <div className={classes.dummy_item}></div>
          {items?.map((item) => (
            <ProductItem key={item._id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};
