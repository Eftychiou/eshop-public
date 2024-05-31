import classes from './dashboard.module.scss';

import { Dispatch, SetStateAction } from 'react';
import moment from 'moment';
import { TABS } from '@/pages/account';

export type DashboardProps = {
  username: string;
  dateCreated: string;
  lastLogin: string;
  activeTab: TABS;
  setActiveTab: Dispatch<SetStateAction<TABS>>;
  isAdmin: boolean;
};

export const Dashboard = ({ username, dateCreated, lastLogin, setActiveTab, activeTab, isAdmin }: DashboardProps) => {
  const now = moment(new Date());
  const end = moment(lastLogin);
  let loginDate;
  const minutes = Math.trunc(moment.duration(now.diff(end)).asMinutes());
  const hours = Math.trunc(moment.duration(now.diff(end)).asHours());
  const days = Math.trunc(moment.duration(now.diff(end)).asDays());
  const weeks = Math.trunc(moment.duration(now.diff(end)).asWeeks());
  if (minutes < 60) {
    loginDate = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    loginDate = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    loginDate = `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    loginDate = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  const signupDate = moment(dateCreated).format('dddd DD-MM-YYYY HH:mm').toString();

  return (
    <div className={classes.dashboard}>
      <h1 className={classes.username}>{username}</h1>
      <div className={classes.time}>
        <div>
          <span>Signup</span>
          <time style={{ fontSize: '12px' }}> {signupDate} </time>
        </div>
        <div>
          <span>Previous Login</span>
          <time style={{ fontSize: '12px' }}> {loginDate} </time>
        </div>
      </div>
      <hr className={classes.line} />
      <div className={classes.tabList}>
        {isAdmin && (
          <>
            <div
              className={activeTab === TABS.COMPANY_INFORMATION ? classes.activeTab : ''}
              onClick={() => setActiveTab(TABS.COMPANY_INFORMATION)}
            >
              Company Information
            </div>
            <div
              className={activeTab === TABS.ADD_PRODUCT ? classes.activeTab : ''}
              onClick={() => setActiveTab(TABS.ADD_PRODUCT)}
            >
              Add Product
            </div>
            <div
              className={activeTab === TABS.ADD_CATEGORY ? classes.activeTab : ''}
              onClick={() => setActiveTab(TABS.ADD_CATEGORY)}
            >
              Categories
            </div>
            <div
              className={activeTab === TABS.UPDATE_REMOVE ? classes.activeTab : ''}
              onClick={() => setActiveTab(TABS.UPDATE_REMOVE)}
            >
              Products
            </div>
            <div className={activeTab === TABS.USERS ? classes.activeTab : ''} onClick={() => setActiveTab(TABS.USERS)}>
              Users
            </div>
          </>
        )}

        <div
          className={activeTab === TABS.CHANGE_PASSWORD ? classes.activeTab : ''}
          onClick={() => setActiveTab(TABS.CHANGE_PASSWORD)}
        >
          Change Password
        </div>
      </div>
    </div>
  );
};
