import { NextResponse } from "next/server"
import { htmlResponse, isUnlocked, readHabedeFile, renderCountdownHtml } from "../access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

type RouteContext = {
  params: { file: string } | Promise<{ file: string }>
}

export async function GET(request: Request, context: RouteContext) {
  const { file } = await context.params

  if (file !== "birthday.html" && file !== "index.html") {
    return new NextResponse("Not found", { status: 404 })
  }

  if (file === "index.html") {
    if (await isUnlocked()) {
      return NextResponse.redirect(new URL("/habede/birthday.html", request.url))
    }

    return htmlResponse(await renderCountdownHtml())
  }

  if (!(await isUnlocked())) {
    return NextResponse.redirect(new URL("/habede/index.html", request.url))
  }

  return htmlResponse(await readHabedeFile("birthday.html"))
}
