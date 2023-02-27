import { NextRequest, NextResponse } from "next/server";

export const config = {
	matcher: "/",
};

export function middleware(req: NextRequest) {
	// Parse the cookie
	const isInBeta = JSON.parse(req.cookies.get("beta")?.value || "false");

	console.log("isInBeta", isInBeta);

	// Update url pathname
	req.nextUrl.pathname = `/${isInBeta ? "secondary-homepage" : ""}`;

	// Rewrite to url
	return NextResponse.rewrite(req.nextUrl);
}
