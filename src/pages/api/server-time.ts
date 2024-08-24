// src/pages/api/server-time.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request }) => {
  return new Response(JSON.stringify(Date.now()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
