import { supabase } from "@/lib/supabase";

export async function getProducts() {
  return await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function createProduct(product: any) {
  return await supabase.from("products").insert(product);
}

export async function deleteProduct(id: string) {
  return await supabase.from("products").delete().eq("id", id);
}