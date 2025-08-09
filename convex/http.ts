import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/healthz",
  method: "GET",
  handler: httpAction(async () => {
    return new Response("ok", { status: 200 });
  }),
});

export default http;


