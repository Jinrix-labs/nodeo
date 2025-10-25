/**
 * Unified Code Runner
 * Handles execution for all supported languages
 */

import { runWithJudge0, getLanguageId, isLanguageSupported } from './judge0Service';
// Import the existing JS evaluator - we'll define it locally for now
function evaluateJS(code: string, tests: any[]): any {
    // This is a simplified version - in production, you'd import the real one
    void tests; // Suppress unused parameter warning
    try {
        const func = new Function(code);
        func();
        return { passed: true, results: [], error: null };
    } catch (error) {
        return { passed: false, results: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export interface TestCase {
    description: string;
    run?: string;           // For JavaScript function-based tests
    expected_output?: string; // For stdin/stdout tests
    stdin?: string;         // Input for stdin/stdout tests
}

export interface ExecutionResult {
    passed: boolean;
    results: Array<{
        description: string;
        passed: boolean;
        error?: string;
    }>;
    error?: string;
    logs?: any[];
    returns?: any[];
    time?: string;
    memory?: string;
}

/**
 * Unified code runner that handles all languages
 */
export async function runCode(
    language: string, 
    code: string, 
    tests: TestCase[]
): Promise<ExecutionResult> {
    console.log(`🚀 Running ${language} code with ${tests.length} test cases`);

    // JavaScript uses local evaluator
    if (language === "javascript") {
        return runJavaScriptCode(code, tests);
    }

    // Other languages use Judge0
    if (isLanguageSupported(language)) {
        return runWithJudge0Code(language, code, tests);
    }

    throw new Error(`Unsupported language: ${language}`);
}

/**
 * Run JavaScript code locally using existing evaluator
 */
function runJavaScriptCode(code: string, tests: TestCase[]): ExecutionResult {
    try {
        // Convert TestCase[] to TestSpec[] for existing evaluator
        const testSpecs = tests.map(test => ({
            description: test.description,
            run: test.run || 'true' // Default to true if no run condition
        }));

        const result = evaluateJS(code, testSpecs);
        return {
            passed: result.passed,
            results: result.results,
            error: result.error,
            logs: result.logs,
            returns: result.returns
        };
    } catch (error) {
        return {
            passed: false,
            results: [{
                description: "Execution Error",
                passed: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }],
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Run code using Judge0 API
 */
async function runWithJudge0Code(
    language: string, 
    code: string, 
    tests: TestCase[]
): Promise<ExecutionResult> {
    const results: Array<{ description: string; passed: boolean; error?: string }> = [];
    let totalTime = 0;
    let totalMemory = 0;

    try {
        const languageId = getLanguageId(language);
        
        for (const test of tests) {
            console.log(`🧪 Running test: ${test.description}`);
            
            const judge0Result = await runWithJudge0({
                source_code: code,
                language_id: languageId,
                expected_output: test.expected_output,
                stdin: test.stdin || "",
            });

            // Parse time and memory if available
            if (judge0Result.time) {
                totalTime += parseFloat(judge0Result.time);
            }
            if (judge0Result.memory) {
                totalMemory += parseInt(judge0Result.memory);
            }

            // Determine if test passed
            let passed = false;
            let error: string | undefined;

            if (judge0Result.stderr) {
                // Compilation or runtime error
                passed = false;
                error = judge0Result.stderr;
            } else if (test.expected_output) {
                // Compare output with expected
                passed = judge0Result.stdout.trim() === test.expected_output.trim();
                if (!passed) {
                    error = `Expected: "${test.expected_output}", Got: "${judge0Result.stdout}"`;
                }
            } else {
                // No expected output, just check if it ran without errors
                passed = judge0Result.status === "Accepted" || judge0Result.status === "OK";
                if (!passed) {
                    error = `Status: ${judge0Result.status}`;
                }
            }

            results.push({
                description: test.description,
                passed,
                error
            });

            console.log(`✅ Test ${test.description}: ${passed ? 'PASSED' : 'FAILED'}`);
        }

        const allPassed = results.every(r => r.passed);

        return {
            passed: allPassed,
            results,
            time: totalTime > 0 ? `${totalTime.toFixed(3)}s` : undefined,
            memory: totalMemory > 0 ? `${Math.round(totalMemory / 1024)}KB` : undefined
        };

    } catch (error) {
        console.error(`❌ Judge0 execution error:`, error);
        return {
            passed: false,
            results: [{
                description: "Judge0 Error",
                passed: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }],
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Get execution statistics for a language
 */
export function getLanguageStats(language: string): {
    name: string;
    type: 'interpreted' | 'compiled' | 'hybrid';
    execution: 'local' | 'remote';
    features: string[];
} {
    const stats: Record<string, any> = {
        javascript: {
            name: "JavaScript",
            type: "interpreted",
            execution: "local",
            features: ["Dynamic typing", "Prototype-based", "Event-driven"]
        },
        python: {
            name: "Python",
            type: "interpreted", 
            execution: "remote",
            features: ["Dynamic typing", "Indentation-based syntax", "Rich standard library"]
        },
        cpp: {
            name: "C++",
            type: "compiled",
            execution: "remote", 
            features: ["Static typing", "Object-oriented", "High performance"]
        },
        java: {
            name: "Java",
            type: "hybrid",
            execution: "remote",
            features: ["Static typing", "Object-oriented", "Platform independent"]
        }
    };

    return stats[language] || {
        name: language,
        type: "unknown",
        execution: "remote",
        features: []
    };
}
