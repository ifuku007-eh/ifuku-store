import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 🔥 AMBIL SESSION VALID
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 🔓 PUBLIC ROUTES
  const publicRoutes = ["/login", "/register"];

  const isPublic = publicRoutes.includes(pathname);

  // ❌ BELUM LOGIN → BLOCK
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ SUDAH LOGIN → BLOCK LOGIN/REGISTER
  if (session && isPublic) {
    return NextResponse.redirect(new URL("/shop", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};