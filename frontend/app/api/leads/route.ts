const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const body = await request.text();

  const res = await fetch(`${API_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const responseBody = await res.text();

  return new Response(responseBody, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
