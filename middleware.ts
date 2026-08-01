import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Protects /admin routes (except /admin/login) at the edge
export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list: any[]) => {
          list.forEach(({ name, value }: any) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }: any) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
