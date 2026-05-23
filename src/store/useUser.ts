import { create } from "zustand";
import { supabase } from "@/lib/supabase";

type UserState = {
  user: any;
  fetchUser: () => Promise<void>;
  setUser: (user: any) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      set({ user: null });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    set({
      user: {
        ...data.user,
        role: profile?.role || "user",
      },
    });
  },
}));