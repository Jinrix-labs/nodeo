import fs from "fs";
import path from "path";

/**
 * Build script to process nvidia-practice-pack and generate TypeScript challenges
 */

const PACK_DIR = "./nvidia-practice-pack";
const OUTPUT_FILE = "./src/challenges/nvidiaPack.ts";

async function buildNvidiaPack() {
    console.log("🚀 Building NVIDIA Practice Pack...");

    // Read the main pack file
    const packPath = path.join(PACK_DIR, "challenges", "nvidia-practice-pack.json");
    const packData = JSON.parse(fs.readFileSync(packPath, "utf8"));

    console.log(`📦 Found ${packData.length} challenges in the pack`);

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

    // Generate TypeScript file
    const tsContent = `/**
 * Auto-generated NVIDIA Practice Pack challenges
 * Generated from nvidia-practice-pack on ${new Date().toISOString()}
 */

import { Challenge } from "../services/challengeLoader";

export const nvidiaChallenges: Challenge[] = ${JSON.stringify(transformedData, null, 2)};

export function getNvidiaChallenges(): Challenge[] {
    return nvidiaChallenges;
}
`;

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the generated file
    fs.writeFileSync(OUTPUT_FILE, tsContent);

    console.log(`✅ Generated ${OUTPUT_FILE} with ${packData.length} challenges`);
    console.log("🎯 NVIDIA Practice Pack is ready to use!");
}

buildNvidiaPack().catch(console.error);
