import { create } from 'zustand';
import api from '@/lib/api';

interface ContactButtons {
  phone: { label: string; number: string; enabled: boolean; icon?: string };
  zalo: { label: string; id: string; enabled: boolean; icon?: string };
  messenger: { label: string; id: string; enabled: boolean; icon?: string };
}

export interface CompanyInfo {
  phone: string;
  email: string;
  address: string;
  logo?: string;
  favicon?: string;
}

interface SettingsState {
  contactButtons: ContactButtons | null;
  companyInfo: CompanyInfo | null;
  loaded: boolean;
  fetchSettings: () => Promise<void>;
}

const defaultButtons: ContactButtons = {
  phone: { label: '0123 456 789', number: '0123456789', enabled: true },
  zalo: { label: 'Chat Zalo', id: 'https://zalo.me/0123456789', enabled: true },
  messenger: { label: 'Messenger', id: 'https://m.me/spmt', enabled: true },
};

const defaultCompanyInfo: CompanyInfo = {
  phone: '(+84) 28 3620 7585',
  email: 'info@spmt.com.vn',
  address: 'Ho Chi Minh City, Vietnam',
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  contactButtons: null,
  companyInfo: null,
  loaded: false,
  fetchSettings: async () => {
    if (get().loaded) return;
    try {
      const [btnsRes, infoRes] = await Promise.all([
        api.get('/settings/contactButtons').catch(() => ({ data: null })),
        api.get('/settings/companyInfo').catch(() => ({ data: null })),
      ]);
      set({ 
        contactButtons: btnsRes.data || defaultButtons,
        companyInfo: infoRes.data || defaultCompanyInfo,
        loaded: true 
      });
    } catch {
      set({ 
        contactButtons: defaultButtons, 
        companyInfo: defaultCompanyInfo,
        loaded: true 
      });
    }
  },
}));
