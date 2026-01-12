
import { UserProfile, MonthData, UserAccount } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'be_user_profile',
  HISTORY: 'be_month_history',
  ACCOUNT: 'be_user_account',
  SYNC_TIME: 'be_last_sync',
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveAccount = (account: UserAccount) => {
  localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));
};

export const getAccount = (): UserAccount | null => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
  return data ? JSON.parse(data) : null;
};

export const saveHistory = (history: MonthData[]) => {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  // Simulate updating sync time
  const now = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.SYNC_TIME, now);
};

export const getHistory = (): MonthData[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

export const getLastSync = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.SYNC_TIME);
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  localStorage.removeItem(STORAGE_KEYS.ACCOUNT);
  localStorage.removeItem(STORAGE_KEYS.SYNC_TIME);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount);
};
