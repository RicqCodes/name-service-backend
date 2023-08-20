import { Request, Response } from "express";
import { Domain } from "../model/Domain";

export const getMetadata = async (req: Request, res: Response) => {
  try {
    const { address, chainId } = req.params;

    const domains = await Domain.find({ owner: address, chainId });
    const domainNames = domains.map((domain) => domain.domainName);

    if (domains.length < 1) {
      return res.status(404).json({ message: "No domain name minted yet" });
    }

    res.status(200).json(domainNames);
  } catch (error) {
    console.error("Error retrieving metadata:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
