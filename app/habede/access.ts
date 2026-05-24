import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

export const targetTime = Date.parse("2026-12-31T00:00:00+07:00")
export const startTime = Date.parse("2026-01-01T00:00:00+07:00")

export function isUnlocked(now = Date.now()) {
  return now >= targetTime
}

export async function readHabedeFile(file: "index.html" | "birthday.html") {
  return readFile(path.join(process.cwd(), "habede", file), "utf8")
}

export async function renderCountdownHtml() {
  const now = Date.now()
  const html = await readHabedeFile("index.html")

  return html
    .replaceAll("__HABEDE_TARGET_TIME__", String(targetTime))
    .replaceAll("__HABEDE_SERVER_TIME__", String(now))
    .replaceAll("__HABEDE_START_TIME__", String(startTime))
}

export function htmlResponse(html: string) {
  return new NextResponse(html, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
