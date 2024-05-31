import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import { useRef, useState } from 'react';
import { Dashboard } from '@/components/account-page/dashboard';
import { CompanyInformationTab } from '@/components/account-page/company-information-tab';
import { ProductForm } from '@/components/forms/product-form';
import { UpdateAndRemoveProductsTab } from '@/components/account-page/update-and-remove-products-tab';
import { UsersTab } from '@/components/account-page/users-tab';
import { ChangePasswordForm } from '@/components/forms/change-password-form';
import { UpdateAndRemoveCategoriesTab } from '@/components/account-page/update-and-remove-categories-tab';
import classes from './index.module.scss';

export enum TABS {
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  ADD_PRODUCT = 'ADD_PRODUCT',
  ADD_CATEGORY = 'ADD_CATEGORY',
  UPDATE_REMOVE = 'UPDATE_REMOVE',
  USERS = 'USERS',
  COMPANY_INFORMATION = 'COMPANY_INFORMATION'
}

export default function Account(session: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    user: { name, dateCreated, lastLogin, isAdmin }
  } = session;
  const accountContentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TABS>(isAdmin ? TABS.COMPANY_INFORMATION : TABS.CHANGE_PASSWORD);

  return (
    <div ref={accountContentRef} className={classes.account_page}>
      <Dashboard
        username={name}
        dateCreated={dateCreated}
        lastLogin={lastLogin}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        isAdmin={isAdmin}
      />
      <div className={classes.rightContainer}>
        {activeTab === TABS.COMPANY_INFORMATION && <CompanyInformationTab />}
        {activeTab === TABS.ADD_PRODUCT && <ProductForm />}
        {activeTab === TABS.UPDATE_REMOVE && <UpdateAndRemoveProductsTab />}
        {activeTab === TABS.ADD_CATEGORY && <UpdateAndRemoveCategoriesTab />}
        {activeTab === TABS.USERS && <UsersTab />}
        {activeTab === TABS.CHANGE_PASSWORD && <ChangePasswordForm />}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Session> = (ctx) => {
  return getSession({ req: ctx.req })
    .then((session) => {
      if (!session) {
        return {
          redirect: {
            destination: '/auth',
            permanent: false
          }
        };
      }
      return {
        props: session
      };
    })
    .catch(() => {
      return { notFound: true };
    });
};
