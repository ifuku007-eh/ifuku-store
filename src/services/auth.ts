import { supabase } from "@/lib/supabase";

export async function register(
  name: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return { error };

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      name,
    });
  }

  return { data };
}

export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function logout() {
  return await supabase.auth.signOut();
}