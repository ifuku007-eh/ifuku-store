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

    // 🔥 ambil role dari profiles
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

    // 🔥 realtime update auth
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session?.user) {
        set({ user: null });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      set({
        user: {
          ...session.user,
          role: profile?.role || "user",
        },
      });
    });
  },
}));