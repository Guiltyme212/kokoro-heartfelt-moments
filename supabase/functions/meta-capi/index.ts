// Meta Conversions API relay — Lovable Cloud edge function.
// Browser pixel fires each event AND posts here with a shared event_id.
// Meta dedupes pixel-vs-CAPI by (event_name, event_id).

const GRAPH_VERSION = "v21.0";
const META_DATASET_ID = "1318180623856061";

const ALLOWED_EVENTS = new Set([
  "PageView", "ViewContent", "Lead",
  "InitiateCheckout", "AddPaymentInfo", "Purchase", "StartTrial",
]);

const ORIGIN_ALLOWLIST = [
  "https://kokoromind.com",
  "https://www.kokoromind.com",
  "https://kokoro-heartfelt-moments.lovable.app",
];

function corsHeaders(origin: string) {
  const allow = ORIGIN_ALLOWLIST.includes(origin) ? origin : ORIGIN_ALLOWLIST[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Vary": "Origin",
  };
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(String(value).trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(obj: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

Deno.serve(async (request) => {
  const cors = corsHeaders(request.headers.get("Origin") || "");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors });

  let body: any;
  try { body = JSON.parse(await request.text()); }
  catch { return json({ error: "bad json" }, 400, cors); }

  if (!body || !ALLOWED_EVENTS.has(body.event_name)) return json({ error: "invalid event_name" }, 422, cors);
  if (!body.event_id) return json({ error: "missing event_id" }, 422, cors);

  const token = Deno.env.get("META_CAPI_TOKEN");
  if (!token) return json({ error: "META_CAPI_TOKEN not configured" }, 500, cors);

  const user_data: Record<string, unknown> = {
    client_user_agent: request.headers.get("User-Agent") || "",
  };
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for");
  if (ip) user_data.client_ip_address = ip.split(",")[0].trim();
  if (body.email) user_data.em = [await sha256(body.email)];
  if (body.fbp) user_data.fbp = body.fbp;
  if (body.fbc) user_data.fbc = body.fbc;

  const event = {
    event_name: body.event_name,
    event_time: Number(body.event_time) || Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    action_source: "website",
    event_source_url: body.event_source_url,
    user_data,
    custom_data: body.custom_data || {},
  };

  const payload: any = { data: [event] };
  const testCode = Deno.env.get("META_TEST_EVENT_CODE");
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${META_DATASET_ID}/events?access_token=${token}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let meta: unknown;
    try { meta = JSON.parse(text); } catch { meta = text; }
    return json({ ok: res.status === 200, meta_status: res.status, meta }, 200, cors);
  } catch (e) {
    return json({ error: "meta fetch failed", detail: String(e) }, 502, cors);
  }
});