import configuration from "../configuration.ts";
import { serve } from "https://deno.land/std@0.116.0/http/server.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";

const port = Deno.env.get("PORT") || 8000;

const serveFiles = (req: Request) =>
  staticFiles(configuration.dataDir)({
    request: req,
    respondWith: (r: Response) => r,
  });

serve((req) => serveFiles(req), { addr: `:${port}` });
