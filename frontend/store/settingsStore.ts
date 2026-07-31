import { create } from 'zustand';
import api from '@/lib/api';

interface ContactButtons {
  phone: { label: string; number: string; enabled: boolean; icon?: string };
  zalo: { label: string; id: string; enabled: boolean; icon?: string };
  messenger: { label: string; id: string; enabled: boolean; icon?: string };
}

interface SettingsState {
  contactButtons: ContactButtons | null;
  loaded: boolean;
  fetchSettings: () => Promise<void>;
}

const defaultButtons: ContactButtons = {
  phone: { label: '0123 456 789', number: '0123456789', enabled: true },
  zalo: { label: 'Chat Zalo', id: 'https://zalo.me/0123456789', enabled: true },
  messenger: { label: 'Messenger', id: 'https://m.me/spmt', enabled: true },
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  contactButtons: null,
  loaded: false,
  fetchSettings: async () => {
    if (get().loaded) return;
    try {
      const { data } = await api.get('/settings/contactButtons');
      set({ contactButtons: data || defaultButtons, loaded: true });
    } catch {
      set({ contactButtons: defaultButtons, loaded: true });
    }
  },
}));
