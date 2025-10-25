/**
 * Persistence Service
 * Handles saving and restoring app state to localStorage
 */

export interface AppState {
    challengeId?: string;
    code?: string;
    language?: 'javascript' | 'python' | 'cpp' | 'java';
    nvidiaPackLoaded?: boolean;
    mode?: 'learn' | 'code';
    attemptCount?: number;
    lastSaved: string;
}

const STORAGE_KEY = 'nodeo-app-state';
const VERSION = '1.0.0';

/**
 * Save app state to localStorage
 */
export function saveAppState(state: Partial<AppState>): void {
    try {
        const currentState = loadAppState();
        const newState: AppState = {
            ...currentState,
            ...state,
            lastSaved: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: VERSION,
            data: newState
        }));

        console.log('💾 App state saved:', newState);
    } catch (error) {
        console.error('Failed to save app state:', error);
    }
}

/**
 * Load app state from localStorage
 */
export function loadAppState(): Partial<AppState> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return {};

        const parsed = JSON.parse(stored);

        // Check version compatibility
        if (parsed.version !== VERSION) {
            console.log('🔄 App state version mismatch, clearing old data');
            clearAppState();
            return {};
        }

        return parsed.data || {};
    } catch (error) {
        console.error('Failed to load app state:', error);
        return {};
    }
}

/**
 * Clear all saved app state
 */
export function clearAppState(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('🗑️ App state cleared');
    } catch (error) {
        console.error('Failed to clear app state:', error);
    }
}

/**
 * Save specific challenge progress
 */
export function saveChallengeProgress(challengeId: string, code: string, attemptCount: number): void {
    try {
        const key = `nodeo-challenge-${challengeId}`;
        const progress = {
            code,
            attemptCount,
            lastSaved: new Date().toISOString()
        };

        localStorage.setItem(key, JSON.stringify(progress));
        console.log(`💾 Progress saved for challenge: ${challengeId}`);
    } catch (error) {
        console.error('Failed to save challenge progress:', error);
    }
}

/**
 * Load specific challenge progress
 */
export function loadChallengeProgress(challengeId: string): { code?: string; attemptCount?: number } {
    try {
        const key = `nodeo-challenge-${challengeId}`;
        const stored = localStorage.getItem(key);
        if (!stored) return {};

        const progress = JSON.parse(stored);
        return {
            code: progress.code,
            attemptCount: progress.attemptCount
        };
    } catch (error) {
        console.error('Failed to load challenge progress:', error);
        return {};
    }
}

/**
 * Get all saved challenge IDs
 */
export function getSavedChallengeIds(): string[] {
    try {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith('nodeo-challenge-'))
            .map(key => key.replace('nodeo-challenge-', ''));
    } catch (error) {
        console.error('Failed to get saved challenge IDs:', error);
        return [];
    }
}

/**
 * Save nvidia pack loaded state
 */
export function saveNvidiaPackState(loaded: boolean): void {
    try {
        localStorage.setItem('nodeo-nvidia-pack-loaded', JSON.stringify(loaded));
        console.log(`💾 NVIDIA pack state saved: ${loaded}`);
    } catch (error) {
        console.error('Failed to save nvidia pack state:', error);
    }
}

/**
 * Load nvidia pack loaded state
 */
export function loadNvidiaPackState(): boolean {
    try {
        const stored = localStorage.getItem('nodeo-nvidia-pack-loaded');
        return stored ? JSON.parse(stored) : false;
    } catch (error) {
        console.error('Failed to load nvidia pack state:', error);
        return false;
    }
}
