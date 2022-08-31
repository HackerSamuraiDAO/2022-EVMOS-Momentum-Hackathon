import type { NextApiRequest, NextApiResponse } from "next";

import { isChainId } from "../../../../../contracts/types/network";
import { status } from "../../../lib/relayer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
    return;
  }
  const { chainId, hash } = req.query;
  if (typeof chainId !== "string" || !isChainId(chainId)) {
    return res.status(400).json({ error: "network is invalid" });
  }
  if (typeof hash !== "string") {
    return res.status(400).json({ error: "hash is invalid" });
  }
  const result = await status(chainId, hash);
  res.status(200).json(result);
}
