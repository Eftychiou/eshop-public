import { Hero } from '../components/hero';
import { LeftNavbar } from '@/components/layout/left-navbar';
import { useCategories, useCompanyInformation, useHomepageNotification } from '../hooks/';
import { useRouter } from 'next/router';
import { FeatureProducts } from '@/components/featured-products';
import { Api, Category, CompanyInformation, Product } from '@/my-api';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import Head from 'next/head';

const hasIdInSubcategories = (category: Category, targetId: string): boolean => {
  if (category._id === targetId) {
    return true;
  }

  for (const subcategory of category.subcategories) {
    if (hasIdInSubcategories(subcategory, targetId)) {
      return true;
    }
  }

  return false;
};

export default function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  useHomepageNotification();
  const router = useRouter();
  const { companyInformation } = useCompanyInformation();
  const { categories } = useCategories();

  const [features, setFeatures] = useState<{ category: Category; products: Product[] }[]>([]);

  if (router.query.paymentStatus && router.query.paymentStatus === 'success') {
    sessionStorage.removeItem('shoppingCardList');
  }

  const handleSelectedCategory = (category: Category, scroll: (c: string) => void) => {
    if (features.some((f) => f.category._id === category._id)) {
      scroll(category._id);
      return;
    }
    Api.getProducts({ category: category._id })
      .then((res) => {
        if (res.data.length > 0) {
          setFeatures((state) => {
            const newState = [...state];
            const isParent = category.path.length === 0;
            const isChildIndex = newState.findIndex((s) => hasIdInSubcategories(s.category, category._id));
            const parentExists = newState.some((s) => s.category._id === category._id);
            const isParentOfAnyIndex = state.findIndex((s) => s.category.path.includes(category._id));
            const isSiblingIndex = newState.findIndex((s) => s.category.path.join(',') === category.path.join(','));

            if (isParent && !parentExists && isParentOfAnyIndex < 0) {
              newState.push({ category, products: res.data });
            } else if (isParentOfAnyIndex >= 0) {
              newState[isParentOfAnyIndex] = { category, products: res.data };
            } else if (isChildIndex >= 0) {
              newState[isChildIndex] = { category, products: res.data };
            } else if (isSiblingIndex >= 0) {
              newState[isSiblingIndex] = { category, products: res.data };
            } else {
              newState.push({ category, products: res.data });
            }

            return newState;
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          scroll(category._id);
        }, 1);
      });
  };

  return (
    <>
      <Head>
        <meta name='theme-color' content='#001D55'></meta>
      </Head>
      <section>
        <Hero companyInformation={props.companyInformation} />
        <FeatureProducts
          items={props.topProducts}
          featuredName='Top Products'
          featuredId='Top Products'
          imageUrl={companyInformation?.topProductsUrl}
          withNavigation={false}
        />
        <FeatureProducts
          items={props.discounts}
          featuredName='Discounts'
          featuredId='Discounts'
          imageUrl={companyInformation?.discountsUrl}
          withNavigation={false}
        />
        {features?.map((f) => (
          <FeatureProducts
            key={f.category._id}
            items={f.products}
            featuredName={f.category.categoryName}
            featuredId={f.category._id}
            imageUrl={f.category.imageUrl}
          />
        ))}
        <LeftNavbar
          handleSelectedCategory={handleSelectedCategory}
          categories={categories}
          companyInformation={companyInformation}
        />
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  topProducts: Array<Product>;
  discounts: Array<Product>;
  companyInformation: CompanyInformation;
}> = () => {
  return Promise.all([
    Api.getProducts({ topSale: true }),
    Api.getProducts({ withDiscount: true }),
    Api.getCompanyInformation()
  ])
    .then((res) => {
      const topProducts = res[0].data;
      const discounts = res[1].data;
      const companyInformation = res[2].data;
      return {
        props: {
          topProducts,
          discounts,
          companyInformation
        },
        revalidate: 30
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        notFound: true
      };
    });
};
