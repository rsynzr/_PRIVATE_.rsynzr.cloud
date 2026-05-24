import { NextResponse } from "next/server"
import { htmlResponse, isUnlocked, renderCountdownHtml } from "./access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  if (await isUnlocked()) {
    return NextResponse.redirect(new URL("/habede/birthday.html", request.url))
  }

  return htmlResponse(await renderCountdownHtml())
}
