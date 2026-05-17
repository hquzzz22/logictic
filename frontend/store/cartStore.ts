import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product: string; // Product ID
  name: string;
  image: string;
  price: number;
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (item) => {
        const existItem = get().cartItems.find((x) => x.product === item.product);
        if (existItem) {
          set({
            cartItems: get().cartItems.map((x) =>
              x.product === existItem.product ? item : x
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, item] });
        }
      },
      removeFromCart: (id) =>
        set({
          cartItems: get().cartItems.filter((x) => x.product !== id),
        }),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
