import type { NextApiRequest, NextApiResponse } from "next";

import { run } from "../../../lib/relayer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
    res.status(401).end("Unauthorized");
    return;
  }
  const result = await run();
  res.status(200).json(result);
}
