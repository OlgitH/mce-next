import { NextResponse, NextRequest } from "next/server";
import { createLocaleRedirect } from "@prismicio/next";
import { createClient } from "@/prismicio";

export async function middleware(request: NextRequest) {
  const client = createClient();
  const redirect = await createLocaleRedirect({ client, request });

  if (redirect) {
    return redirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|slice-simulator|icon.svg|robots.txt|sitemap.xml|favicon.ico).*)",
  ],
};
