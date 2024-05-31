import classes from './hero.module.scss';
import Image from 'next/image';
import { CompanyInformation } from '@/my-api';

export const Hero = ({ companyInformation }: { companyInformation: CompanyInformation }) => {
  return (
    <section className={classes.hero}>
      {companyInformation.bannerUrl && (
        <>
          <div
            className={classes.image_cover}
            style={{
              background: `url('${process.env.SERVER_DOMAIN}${companyInformation.bannerUrl}') no-repeat center`
            }}
          />
          <div className={classes.image}>
            <Image src={`${process.env.SERVER_DOMAIN}${companyInformation.bannerUrl}`} fill alt='banner' />
          </div>
        </>
      )}
    </section>
  );
};
