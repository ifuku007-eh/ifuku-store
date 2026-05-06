import { create } from "zustand";
import { supabase } from "@/lib/supabase";

type UserState = {
  user: any;
  setUser: (user: any) => void;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const { data } = await supabase.auth.getUser();
    set({ user: data.user || null });

    // 🔥 realtime auth listener
    supabase.auth.onAuthStateChange((_, session) => {
      set({ user: session?.user || null });
    });
  },
}));