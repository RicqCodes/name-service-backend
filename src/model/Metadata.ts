import mongoose from "mongoose";

// Create a schema for metadata
const metadataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    unique: true,
    required: true,
    select: false,
  },
  description: {
    type: String,
    default: "A domain on the test name service",
  },
  image: {
    type: String,
    required: true,
  },
});

export const Metadata = mongoose.model("Metadata", metadataSchema);
