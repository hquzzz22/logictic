import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  isFeatured: boolean;
  countInStock: number;
  description?: string;
  category?: { name: string } | null;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: WishlistItem) => void;
  isLiked: (id: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.find((i) => i._id === product._id);
        if (!exists) {
          set({ items: [...get().items, product] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i._id !== id) });
      },

      toggleItem: (product) => {
        const exists = get().items.find((i) => i._id === product._id);
        if (exists) {
          set({ items: get().items.filter((i) => i._id !== product._id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },

      isLiked: (id) => {
        return get().items.some((i) => i._id === id);
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
