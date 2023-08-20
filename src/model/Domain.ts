import mongoose from "mongoose";

// Create a schema for metadata
const domainSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  domainName: {
    type: String,
    unique: true,
    required: true,
  },
  chainId: {
    type: String,
    required: true,
  },
});

domainSchema.index({ owner: 1, chain: 1 });

export const Domain = mongoose.model("Domain", domainSchema);
