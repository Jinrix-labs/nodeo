import fs from "fs";
import path from "path";

/**
 * Convert nvidia-practice-pack JSON to TypeScript
 */

const PACK_PATH = "./nvidia-practice-pack/challenges/nvidia-practice-pack.json";
const OUTPUT_PATH = "./src/challenges/nvidiaPack.ts";

async function convertNvidiaPack() {
    console.log("🔄 Converting NVIDIA Practice Pack to TypeScript...");

    // Read the JSON file
    const packData = JSON.parse(fs.readFileSync(PACK_PATH, "utf8"));

    // Transform the data to match Challenge interface
    const transformedData = packData.map(challenge => {
        // Get starter code and tests from the first available language
        const firstLang = Object.keys(challenge.languages || {})[0];
        const langData = challenge.languages?.[firstLang];

        return {
            ...challenge,
            starter: langData?.starter || '',
            tests: langData?.tests || []
        };
    });

    // Generate TypeScript content
    const tsContent = `/**
 * Auto-generated NVIDIA Practice Pack challenges
 * Generated from nvidia-practice-pack on ${new Date().toISOString()}
 * 
 * This file is dynamically imported to keep the main app lightweight.
 */

import { Challenge } from "../services/challengeLoader";

export const nvidiaChallenges: Challenge[] = ${JSON.stringify(transformedData, null, 2)};

export function getNvidiaChallenges(): Challenge[] {
    return nvidiaChallenges;
}
`;

    // Write the TypeScript file
    fs.writeFileSync(OUTPUT_PATH, tsContent);

    console.log(`✅ Generated ${OUTPUT_PATH} with ${transformedData.length} challenges`);
    console.log("🎯 NVIDIA Practice Pack is ready for dynamic loading!");
}

convertNvidiaPack().catch(console.error);
