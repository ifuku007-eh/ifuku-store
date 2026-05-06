import { supabase } from "@/lib/supabase";

export const checkWeeklyLimit = async (userId: string) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const { count } = await supabase
    .from("redeem_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", lastWeek.toISOString());

  return (count || 0) < 10;
};