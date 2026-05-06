import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  userId: string;
};

type CartState = {
  cart: CartItem[];
  hydrated: boolean;

  addToCart: (item: any, userId: string) => void;
  removeFromCart: (id: string, userId: string) => void;
  increaseQty: (id: string, userId: string) => void;
  decreaseQty: (id: string, userId: string) => void;

  setCart: (cart: CartItem[]) => void;
  setHydrated: (v: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      hydrated: false,

      setCart: (cart) => set({ cart }),
      setHydrated: (v) => set({ hydrated: v }),

      addToCart: (item, userId) => {
        if (!userId) return;

        const existing = get().cart.find(
          (i) => i.id === item.id && i.userId === userId
        );

        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.id === item.id && i.userId === userId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            cart: [
              ...get().cart,
              {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1,
                userId,
              },
            ],
          });
        }
      },

      removeFromCart: (id, userId) =>
        set({
          cart: get().cart.filter(
            (i) => !(i.id === id && i.userId === userId)
          ),
        }),

      increaseQty: (id, userId) =>
        set({
          cart: get().cart.map((i) =>
            i.id === id && i.userId === userId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }),

      decreaseQty: (id, userId) =>
        set({
          cart: get().cart
            .map((i) =>
              i.id === id && i.userId === userId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        }),
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);