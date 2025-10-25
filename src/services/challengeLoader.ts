/**
 * Challenge Loader Service
 * Dynamically loads challenges from JSON files
 */

// Note: fs and path are Node.js modules, not available in browser
// We'll use a different approach for browser environment

export interface Challenge {
    id: string;
    topic: string;
    title: string;
    difficulty?: "easy" | "medium" | "hard";
    tags?: string[];
    unlocked?: boolean;
    languages?: {
        javascript?: { starter: string; tests: any[]; stdinTests?: any[] };
        python?: { starter: string; tests: any[]; stdinTests?: any[] };
        cpp?: { starter: string; tests: any[]; stdinTests?: any[] };
        java?: { starter: string; tests: any[]; stdinTests?: any[] };
    };
    concept?: string;
    example?: string;
    prompt: string;
    starter: string;
    tests: any[];
    learn?: {
        intro: string;
        bullets: string[];
        demo?: string;
    };
    tips?: string[];
}

/**
 * Load all challenges from the challenges directory
 * Note: In browser environment, we'll use a different approach
 */
export function loadChallenges(): Challenge[] {
    // For now, return fallback challenges
    // In a real implementation, you would:
    // 1. Use a build-time script to bundle challenges
    // 2. Use dynamic imports
    // 3. Use a CDN or API to load challenges
    console.log('🎯 Loading challenges from fallback data');
    return getFallbackChallenges();
}

/**
 * Fallback challenges if JSON loading fails
 */
function getFallbackChallenges(): Challenge[] {
    return [
        {
            id: "fallback-hello",
            topic: "Basics",
            title: "Hello World",
            difficulty: "easy",
            tags: ["basics"],
            unlocked: true,
            concept: "Print a simple message to the console.",
            example: "Output:\nHello, World!",
            prompt: "Print 'Hello, World!' to the console.",
            starter: "console.log('Hello, World!');",
            tests: [
                { description: "prints hello world", run: "(()=>{__RESET__(); console.log('Hello, World!'); return __LOGS__[0]==='Hello, World!';})()" }
            ],
            learn: {
                intro: "This is the traditional first program in programming.",
                bullets: ["Use console.log() to print text", "Strings go in quotes"]
            },
            tips: ["Make sure to use quotes around your text"]
        }
    ];
}

/**
 * Get challenge by ID
 */
export function getChallengeById(challenges: Challenge[], id: string): Challenge | undefined {
    return challenges.find(c => c.id === id);
}

/**
 * Get challenges by topic
 */
export function getChallengesByTopic(challenges: Challenge[], topic: string): Challenge[] {
    return challenges.filter(c => c.topic.toLowerCase() === topic.toLowerCase());
}

/**
 * Get challenges by difficulty
 */
export function getChallengesByDifficulty(challenges: Challenge[], difficulty: string): Challenge[] {
    return challenges.filter(c => c.difficulty === difficulty);
}

/**
 * Search challenges by title, topic, or tags
 */
export function searchChallenges(challenges: Challenge[], query: string): Challenge[] {
    const lowerQuery = query.toLowerCase();
    return challenges.filter(c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.topic.toLowerCase().includes(lowerQuery) ||
        c.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}
