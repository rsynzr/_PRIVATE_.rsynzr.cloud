import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

export const targetTime = Date.parse("2026-12-31T00:00:00+07:00")
export const startTime = Date.parse("2026-01-01T00:00:00+07:00")
export const timeServerUrl = "https://server-time.nazuraarsya.workers.dev/"

type TimeServerResponse = {
  now?: number
}

export async function getTrustedNow() {
  const response = await fetch(timeServerUrl, { cache: "no-store" })

  if (!response.ok) {
    throw new Error(`Time server responded with ${response.status}`)
  }

  const data = (await response.json()) as TimeServerResponse

  if (typeof data.now !== "number" || !Number.isFinite(data.now)) {
    throw new Error("Time server response does not include a valid now value")
  }

  return data.now
}

export async function isUnlocked() {
  try {
    const now = await getTrustedNow()

    return now >= targetTime
  } catch {
    return false
  }
}

export async function readHabedeFile(file: "index.html" | "birthday.html") {
  return readFile(path.join(process.cwd(), "habede", file), "utf8")
}

export async function renderCountdownHtml() {
  let now = Date.now()

  try {
    now = await getTrustedNow()
  } catch {
    // Keep the countdown visible if the external time server is temporarily unavailable.
  }

  const html = await readHabedeFile("index.html")

  return html
    .replaceAll("__HABEDE_TARGET_TIME__", String(targetTime))
    .replaceAll("__HABEDE_SERVER_TIME__", String(now))
    .replaceAll("__HABEDE_START_TIME__", String(startTime))
    .replaceAll("__HABEDE_TIME_SERVER_URL__", timeServerUrl)
}

export function htmlResponse(html: string) {
  return new NextResponse(html, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
