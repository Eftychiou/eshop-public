import { Parallax } from '@/components/parallax/';
import classes from './about.module.scss';
import Image from 'next/image';

import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Api, CompanyInformation } from '@/my-api';

export default function About(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <section className={classes.about_page}>
      <Parallax>
        <div className={classes.content}>
          <section>
            <Image
              className={classes.logo}
              src={`${process.env.SERVER_DOMAIN}${props.companyInformation?.logoUrl}`}
              width={400}
              height={400}
              alt='logo'
            />
          </section>
          <section>
            <p>{props.companyInformation?.firstTextField}</p>
          </section>
          <section>
            <p>{props.companyInformation?.secondTextField}</p>
          </section>
          <section>
            <div>
              <div>
                <span>Email : </span>
                <span>{props.companyInformation?.email}</span>
              </div>
              <div>
                <span>Fax : </span>
                <span>{props.companyInformation?.fax}</span>
              </div>
              <div>
                <span>Telephone : </span>
                <span>{props.companyInformation?.phoneNumber}</span>
              </div>
            </div>
          </section>
        </div>
      </Parallax>
    </section>
  );
}
export const getStaticProps: GetStaticProps<{ companyInformation: CompanyInformation }> = () => {
  return Api.getCompanyInformation().then((res) => {
    return {
      props: {
        companyInformation: res.data
      },
      revalidate: 30
    };
  });
};
