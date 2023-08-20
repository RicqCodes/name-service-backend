import { Request, Response } from "express";
import { Domain } from "../model/Domain";

export const getUserDomains = async (req: Request, res: Response) => {
  try {
    const { address, chainId } = req.params;

    const domains = await Domain.find({ owner: address, chainId: chainId });

    if (domains.length < 1) {
      return res.status(404).json({ message: "No domain name minted yet" });
    }
    // const domainNames = domains.map((domain) => domain.domainName);

    res.status(200).json(domains);
  } catch (error) {
    console.error("Error retrieving metadata:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
