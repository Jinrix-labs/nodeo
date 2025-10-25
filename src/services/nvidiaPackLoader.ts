/**
 * NVIDIA Practice Pack Dynamic Loader
 * Loads nvidia challenges only when needed to keep main app lightweight
 */

import { Challenge } from "./challengeLoader";

// Cache for loaded nvidia challenges
let nvidiaChallengesCache: Challenge[] | null = null;
let isLoading = false;

/**
 * Dynamically load nvidia practice pack challenges
 * Returns cached version if already loaded
 */
export async function loadNvidiaPack(): Promise<Challenge[]> {
    // Return cached version if available
    if (nvidiaChallengesCache) {
        return nvidiaChallengesCache;
    }

    // Prevent multiple simultaneous loads
    if (isLoading) {
        return new Promise((resolve) => {
            const checkLoaded = () => {
                if (nvidiaChallengesCache) {
                    resolve(nvidiaChallengesCache);
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
    }

    isLoading = true;

    try {
        console.log('🎯 Loading NVIDIA Practice Pack...');

        // Import the nvidia pack dynamically
        const nvidiaModule = await import('../challenges/nvidiaPack');
        nvidiaChallengesCache = nvidiaModule.nvidiaChallenges;

        console.log(`✅ Loaded ${nvidiaChallengesCache.length} NVIDIA challenges`);
        return nvidiaChallengesCache;
    } catch (error) {
        console.error('❌ Failed to load NVIDIA Practice Pack:', error);
        // Return empty array if loading fails
        nvidiaChallengesCache = [];
        return nvidiaChallengesCache;
    } finally {
        isLoading = false;
    }
}

/**
 * Check if nvidia pack is already loaded
 */
export function isNvidiaPackLoaded(): boolean {
    return nvidiaChallengesCache !== null;
}

/**
 * Get cached nvidia challenges (returns empty array if not loaded)
 */
export function getCachedNvidiaChallenges(): Challenge[] {
    return nvidiaChallengesCache || [];
}

/**
 * Clear nvidia pack cache (useful for development)
 */
export function clearNvidiaPackCache(): void {
    nvidiaChallengesCache = null;
    isLoading = false;
}
