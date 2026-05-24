const TIME_SERVER_URL = "https://server-time.nazuraarsya.workers.dev/";
const TARGET_TIME = Date.parse("2026-12-31T00:00:00+07:00");

const INDEX_PATHS = new Set([
  "/habede",
  "/habede/",
  "/habede/index.html",
]);

const BIRTHDAY_PATH = "/habede/birthday.html";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const isIndex = INDEX_PATHS.has(url.pathname);
    const isBirthday = url.pathname === BIRTHDAY_PATH;

    if (!isIndex && !isBirthday) {
      return fetch(request);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const unlocked = await isUnlocked();

    if (isBirthday && !unlocked) {
      return redirectTo(url, "/habede/index.html");
    }

    if (isIndex && unlocked) {
      return redirectTo(url, BIRTHDAY_PATH);
    }

    return withNoStore(await fetch(request));
  },
};

async function isUnlocked() {
  try {
    const response = await fetch(TIME_SERVER_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    return typeof data.now === "number" && data.now >= TARGET_TIME;
  } catch {
    return false;
  }
}

function redirectTo(currentUrl, pathname) {
  const nextUrl = new URL(currentUrl);
  nextUrl.pathname = pathname;
  nextUrl.search = "";
  nextUrl.hash = "";

  return new Response(null, {
    status: 307,
    headers: {
      "Cache-Control": "no-store",
      Location: nextUrl.toString(),
    },
  });
}

function withNoStore(response) {
  const nextResponse = new Response(response.body, response);
  nextResponse.headers.set("Cache-Control", "no-store");

  return nextResponse;
}
