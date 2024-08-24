import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request }) => {
  const time = Date.now();
  console.log(`Server time requested: ${new Date(time).toISOString()}`);
  return new Response(JSON.stringify(time), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
