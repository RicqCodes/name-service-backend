"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Create a schema for metadata
const metadataSchema = new mongoose_1.default.Schema({
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
exports.Metadata = mongoose_1.default.model("Metadata", metadataSchema);
