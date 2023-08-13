"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = exports.createMetadata = void 0;
const utils_1 = require("../utils");
const Metadata_1 = require("../model/Metadata");
const createMetadata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId, domainName } = req.body;
        const svg = (0, utils_1.generateSVG)(domainName);
        const json = (0, utils_1.generateMetadata)(tokenId, domainName, svg);
        // Save metadata to the database
        yield Metadata_1.Metadata.create(json);
        res.json({ message: "Metadata saved successfully" });
    }
    catch (error) {
        console.error("Error saving metadata:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});
exports.createMetadata = createMetadata;
const getMetadata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   res.set("Content-Type", "text/html; charset=UTF-8");
    try {
        const { tokenId } = req.params;
        // Retrieve metadata from the database based on tokenId
        const metadata = yield Metadata_1.Metadata.findOne({ tokenId: Number(tokenId) }, { __v: 0 });
        if (!metadata) {
            return res.status(404).json({ message: "Metadata not found" });
        }
        res.status(200).json(metadata);
    }
    catch (error) {
        console.error("Error retrieving metadata:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});
exports.getMetadata = getMetadata;
