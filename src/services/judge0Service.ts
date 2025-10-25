/**
 * Judge0 API Integration Service
 * Handles code execution for Python, C++, Java, and other languages
 */

// Judge0 Language IDs for common languages
export const JUDGE0_LANG_MAP: Record<string, number> = {
    javascript: 63,  // JavaScript (Node.js)
    python: 71,      // Python 3
    cpp: 54,         // C++ (GCC 9.2.0)
    java: 62,        // Java (OpenJDK 13)
    c: 50,           // C (GCC 9.2.0)
    csharp: 51,      // C# (Mono 6.6.0)
    go: 60,          // Go (1.13.5)
    rust: 73,        // Rust (1.40.0)
    php: 68,         // PHP (7.4.1)
    ruby: 72,        // Ruby (2.7.0)
    swift: 83,       // Swift (5.2.3)
    kotlin: 78,      // Kotlin (1.3.70)
    scala: 81,       // Scala (2.13.2)
    haskell: 61,     // Haskell (GHC 8.8.1)
    lua: 64,         // Lua (5.3.4)
    perl: 85,        // Perl (5.28.1)
    r: 80,           // R (4.0.0)
    bash: 46,        // Bash (4.4.20)
    sql: 82,         // SQL (SQLite 3.27.2)
};

export interface Judge0Result {
    stdout: string;
    stderr: string;
    status: string;
    time?: string;
    memory?: string;
}

export interface Judge0Submission {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
    cpu_time_limit?: string;
    memory_limit?: string;
}

/**
 * Execute code using Judge0 API
 */
export async function runWithJudge0({
    source_code,
    language_id,
    expected_output,
    stdin = "",
    cpu_time_limit = "5.0",
    memory_limit = "128000",
}: {
    source_code: string;
    language_id: number;
    expected_output?: string;
    stdin?: string;
    cpu_time_limit?: string;
    memory_limit?: string;
}): Promise<Judge0Result> {
    // Suppress unused parameter warnings for future API implementation
    void cpu_time_limit;
    void memory_limit;
    try {
        // For now, we'll use a mock response since we don't have the API key
        // In production, you would use the real Judge0 API
        console.log(`🚀 Executing ${language_id} code with Judge0...`);
        console.log(`📝 Source: ${source_code.substring(0, 100)}...`);
        console.log(`📥 Input: ${stdin}`);
        console.log(`📤 Expected: ${expected_output}`);

        // Mock response for development
        const mockResponse = {
            stdout: expected_output || "Mock output from Judge0",
            stderr: "",
            status: "Accepted",
            time: "0.001",
            memory: "1024"
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return mockResponse;

        /* 
        // Real Judge0 API implementation (uncomment when you have API key)
        const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.VITE_RAPIDAPI_KEY || "<YOUR_RAPID_API_KEY>",
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            body: JSON.stringify({
                source_code,
                language_id,
                stdin,
                expected_output,
                cpu_time_limit,
                memory_limit,
            }),
        });

        if (!response.ok) {
            throw new Error(`Judge0 API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return {
            stdout: result.stdout?.trim() || "",
            stderr: result.stderr?.trim() || "",
            status: result.status?.description || "Unknown",
            time: result.time,
            memory: result.memory,
        };
        */
    } catch (error) {
        console.error("Judge0 execution error:", error);
        return {
            stdout: "",
            stderr: `Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            status: "Error",
        };
    }
}

/**
 * Get language ID for a given language name
 */
export function getLanguageId(language: string): number {
    const langId = JUDGE0_LANG_MAP[language.toLowerCase()];
    if (!langId) {
        throw new Error(`Unsupported language: ${language}`);
    }
    return langId;
}

/**
 * Check if a language is supported by Judge0
 */
export function isLanguageSupported(language: string): boolean {
    return language.toLowerCase() in JUDGE0_LANG_MAP;
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): string[] {
    return Object.keys(JUDGE0_LANG_MAP);
}
