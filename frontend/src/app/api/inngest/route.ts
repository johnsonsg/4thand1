import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { processPlayerHeadshot } from "@/lib/inngest/functions/processPlayerHeadshot";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processPlayerHeadshot],
});