import { Product } from '@/my-api';
import classes from './product-item.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const ProductItem = (props: Product) => {
  const router = useRouter();

  return (
    <div id={props._id} onClick={() => router.push(`/products/${props._id}`)} className={classes.product_item}>
      <div className={classes.image}>
        <Image
          alt='product_image'
          src={
            props.imagesUrl.length !== 0
              ? `${process.env.SERVER_DOMAIN}${props.imagesUrl[0]}`
              : '/images/other/noImage.jpg'
          }
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={classes.frontLabel}>
        <h4 className={classes.title}>{props.title}</h4>
        {/* <p className={classes.short}>{props.shortDescription}</p> */}
        <p className={classes.price}>€ {(props.finalPrice / 100).toFixed(2)}</p>
      </div>
    </div>
  );
};
