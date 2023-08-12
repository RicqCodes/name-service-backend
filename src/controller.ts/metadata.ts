import { generateSVG, generateMetadata } from "../utils";
import { Metadata } from "../model/Metadata";
import { Request, Response, NextFunction } from "express";

export const createMetadata = async (req: Request, res: Response) => {
  try {
    const { tokenId, domainName } = req.body;

    const svg = generateSVG(domainName);
    const json = generateMetadata(tokenId, domainName, svg as string);

    // Save metadata to the database
    await Metadata.create(json);

    res.json({ message: "Metadata saved successfully" });
  } catch (error) {
    console.error("Error saving metadata:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getMetadata = async (req: Request, res: Response) => {
  //   res.set("Content-Type", "text/html; charset=UTF-8");
  try {
    const { tokenId } = req.params;

    // Retrieve metadata from the database based on tokenId
    const metadata = await Metadata.findOne(
      { tokenId: Number(tokenId) },
      { __v: 0 }
    );
    if (!metadata) {
      return res.status(404).json({ message: "Metadata not found" });
    }

    res.status(200).json(metadata);
  } catch (error) {
    console.error("Error retrieving metadata:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
