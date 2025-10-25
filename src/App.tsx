import React, { useState, useEffect } from "react";
import { runCode } from "./services/codeRunner";
import { loadChallenges, loadChallengesWithPacks, type Challenge } from "./services/challengeLoader";
import {
    saveAppState,
    loadAppState,
    saveChallengeProgress,
    loadChallengeProgress,
    saveNvidiaPackState,
    loadNvidiaPackState,
    clearAppState
} from "./services/persistence";

/**
 * Nodeo – Multi-Language Coding Platform
 * ------------------------------------------------------
 * Dynamic challenge loading from JSON files
 * Multi-language support with Judge0 integration
 * Challenge generator for easy content creation
 */

// Dictionary for auto-linking terms
const dictionary = [
    { term: "function", meaning: "a block of code you can reuse (like a machine)" },
    { term: "variable", meaning: "a container that holds a value" },
    { term: "loop", meaning: "repeat some code multiple times" },
    { term: "array", meaning: "a list of values stored together" },
    { term: "index", meaning: "the position number in an array (starts at 0)" },
];

// TestSpec is now defined in challengeLoader.ts

// Types are now defined in challengeLoader.ts

type EvalTestResult = { description: string; passed: boolean; error?: string };
type EvalResult = { passed: boolean; results: EvalTestResult[]; error?: string; logs?: any[]; returns?: any[] };

// Load challenges dynamically from JSON files
const CHALLENGES: Challenge[] = loadChallenges();

// -----------------------------
// Legacy Evaluator (replaced by unified codeRunner)
// -----------------------------

// -----------------------------
// Hint Engine (graduated, topic-aware)
// -----------------------------

function buildHints({
    code,
    result,
    context,
}: {
    code: string;
    result: EvalResult | { error?: string; results?: EvalTestResult[]; logs?: any[]; returns?: any[] };
    context?: { topic?: string; language?: string };
}): string[] {
    const hints: string[] = [];

    if ((result as any)?.error) {
        // Language-specific error messages
        if (context?.language === "python") {
            hints.push("Your code didn't run. Check for indentation errors or syntax issues.");
        } else if (context?.language === "cpp") {
            hints.push("Your code didn't compile. Check for missing semicolons or syntax errors.");
        } else if (context?.language === "java") {
            hints.push("Your code didn't compile. Check for missing semicolons or class structure.");
        } else {
            hints.push("Your code didn't run. Check for missing braces or parentheses.");
        }
    }

    const lower = code.toLowerCase();
    const usesFor = /for\s*\(/.test(lower);
    const usesWhile = /while\s*\(/.test(lower);

    // Language-specific basics
    if (context?.topic === "Basics") {
        if (/greet\s*\(/.test(lower)) {
            if (context?.language === "python") {
                if (!/print\(/.test(lower)) hints.push("Use `print(...)` to output to the console.");
            } else if (context?.language === "cpp") {
                if (!/cout/.test(lower)) hints.push("Use `cout` to print to the console.");
            } else {
                if (!/console\.log\(/.test(lower)) hints.push("Use `console.log(...)` to print to the console.");
            }
            if (!/'hello'/.test(code) && !/"hello"/.test(code)) hints.push("Log the exact string 'hello' in lowercase.");
        }
        if (/add\s*\(/.test(lower) || /multiply\s*\(/.test(lower)) {
            if (!/return/.test(lower)) {
                if (context?.language === "python") {
                    hints.push("Don't forget to `return` from the function.");
                } else if (context?.language === "cpp") {
                    hints.push("Don't forget to `return` from the function.");
                } else {
                    hints.push("Don't forget to `return` from the function.");
                }
            }
        }
        if (/total:\s*\$\{\s*3\s*\+\s*4\s*\}/i.test(code) === false && lower.includes("total: 7")) {
            if (context?.language === "python") {
                hints.push("Use f-strings with f'Total: {3+4}' to compute inside the string.");
            } else {
                hints.push("Use a template string with backticks and ${3+4} to compute inside the string.");
            }
        }
    }

    // Conditionals
    if (context?.topic === "Conditionals") {
        if (/iseven\s*\(/i.test(lower) && !/%/.test(code)) hints.push("Consider using the modulo operator `%` to check even/odd.");
        if (/max\s*\(/i.test(lower) && !/\?|:|if\s*\(/.test(lower)) hints.push("Pick one path or the other using if/else or a ternary.");
    }

    // Loops
    if (context?.topic === "Loops") {
        if (/printonetofive\s*\(/i.test(lower) && !usesFor && !usesWhile) hints.push("Use a loop to repeat the logging.");
        if (/countdown\s*\(/i.test(lower) && !usesFor && !usesWhile) hints.push("Use a loop that counts down instead of up.");
        if (/staircase\s*\(/i.test(lower) && !usesFor) hints.push("Use a loop to repeat the pattern.");
    }

    // Arrays
    if (context?.topic === "Arrays") {
        if (/makelist\s*\(/i.test(lower) && !/\[/.test(code)) hints.push("Use square brackets [ ] to create an array.");
        if (/sumarray\s*\(/i.test(lower) && !usesFor && !usesWhile) hints.push("Use a loop to go through each number in the array.");
    }

    // Logic + Loops
    if (context?.topic === "Logic + Loops") {
        if (/twosum\s*\(/i.test(lower) && !usesFor) hints.push("Use nested loops to check all pairs of numbers.");
        if (/countingvalleys\s*\(/i.test(lower) && !usesFor) hints.push("Use a loop to process each step in the path.");
    }

    // Math
    if (context?.topic === "Math") {
        if (/minimaxsum\s*\(/i.test(lower) && !/math\.min|math\.max/.test(lower)) hints.push("Use Math.min() and Math.max() to find the smallest and largest numbers.");
    }

    // Strings
    if (context?.topic === "Strings") {
        if (/timeconversion\s*\(/i.test(lower) && !/slice/.test(lower)) hints.push("Use slice() to extract parts of the time string.");
    }

    const failed = (result as any)?.results?.filter((t: EvalTestResult) => !t.passed) || [];
    for (const f of failed) {
        if (f.description.includes("logs 5 times")) {
            hints.push("Make sure your loop runs exactly 5 times.");
        }
        if (f.description.includes("function exists")) {
            hints.push("Make sure you define the function with the exact name expected.");
        }
        if (f.description.includes("logged once")) {
            hints.push("Make sure you call console.log() exactly once.");
        }
    }

    return hints;
}

function escalateHints(hints: string[], attemptCount: number): string[] {
    if (hints.length === 0) return [];

    // Attempt 1: Just short hints (as-is)
    if (attemptCount === 1) {
        return hints;
    }

    // Attempt 2: Add explanations
    if (attemptCount === 2) {
        return hints.map(hint => {
            const explanation = getSimpleExplanation(hint);
            return `${hint}\n💡 Here's why this happens: ${explanation}`;
        });
    }

    // Attempt 3+: Add example snippet if available
    return hints.map(hint => {
        const explanation = getSimpleExplanation(hint);
        const example = getExampleSnippet(hint);
        return `${hint}\n💡 Here's why this happens: ${explanation}${example ? `\n🧪 Example: ${example}` : ''}`;
    });
}

function getSimpleExplanation(hint: string): string {
    if (hint.includes("function")) return "Functions declared normally stay inside the sandbox, so tests can't reach them. Making them global fixes this.";
    if (hint.includes("String")) return "Your output is close, but spacing or formatting doesn't exactly match.";
    if (hint.includes("return")) return "`return` sends a value back from the function so the test can use it.";
    if (hint.includes("Log count")) return "The number of console.log calls didn't match what the test expected.";
    return "This is a common beginner error — try adjusting step by step.";
}

function getExampleSnippet(hint: string): string {
    if (hint.includes("function")) return "globalThis.add = function(a,b){ return a+b };";
    if (hint.includes("String")) return "console.log(`Hello, ${name}!');";
    if (hint.includes("return")) return "function add(a,b){ return a + b }";
    if (hint.includes("array")) return "return ['apple', 'banana', 'cherry'];";
    return "";
}

// Auto-link dictionary terms to tooltips inside text
function linkTermsToTooltips(text: string, dictionary: { term: string; meaning: string }[]) {
    let linked = text;
    dictionary.forEach((entry) => {
        const regex = new RegExp(`\\b(${entry.term})\\b`, "gi");
        linked = linked.replace(regex, (match) => {
            return `<span class="tooltip-term" data-term="${entry.term}">${match}</span>`;
        });
    });
    return linked;
}

function ConceptPrimer({ concept, example, dictionary }: { concept?: string; example?: string; dictionary: { term: string; meaning: string }[] }) {
    const [showExample, setShowExample] = React.useState(false);
    if (!concept) return null;

    return (
        <div className="rounded-2xl border border-slate-600 bg-slate-800 p-4 mb-4">
            <div className="mb-2 text-sm uppercase tracking-wide text-slate-400">📘 Concept Primer</div>
            <p
                className="text-slate-200 text-sm mb-3"
                dangerouslySetInnerHTML={{ __html: linkTermsToTooltips(concept, dictionary) }}
            />
            {example && (
                <button
                    onClick={() => setShowExample(!showExample)}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                >
                    {showExample ? "Hide Example" : "Show Example"}
                </button>
            )}
            {showExample && example && (
                <pre className="mt-3 rounded-lg bg-slate-900 text-white p-3 text-sm overflow-x-auto">
                    {example}
                </pre>
            )}
        </div>
    );
}

function ChallengeLibrary({
    challenges,
    onSelect,
}: {
    challenges: Challenge[];
    onSelect: (id: string) => void;
}) {
    const [search, setSearch] = React.useState("");
    const [filter, setFilter] = React.useState("all");

    const filtered = challenges.filter((c) => {
        const matchesSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.topic.toLowerCase().includes(search.toLowerCase()) ||
            c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === "all" || c.difficulty === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="rounded-2xl border border-slate-600 bg-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
                <input
                    type="text"
                    placeholder="🔍 Search challenges..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm w-full mr-2 text-slate-200 placeholder-slate-400"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-2 py-2 text-sm text-slate-200"
                >
                    <option value="all">All</option>
                    <option value="easy">Easy 🟢</option>
                    <option value="medium">Medium 🟡</option>
                    <option value="hard">Hard 🔴</option>
                </select>
            </div>

            <ul className="space-y-2 max-h-80 overflow-auto">
                {filtered.map((c) => (
                    <li
                        key={c.id}
                        className="cursor-pointer rounded-lg border border-slate-600 bg-slate-700 p-3 hover:bg-slate-600 flex items-center justify-between transition-colors"
                        onClick={() => onSelect(c.id)}
                    >
                        <div>
                            <div className="font-medium text-slate-200">{c.title}</div>
                            <div className="text-xs text-slate-400">
                                {c.topic} • {c.difficulty}
                            </div>
                        </div>
                        <span
                            className={`text-xs font-semibold ${c.difficulty === "easy"
                                ? "text-emerald-400"
                                : c.difficulty === "medium"
                                    ? "text-amber-400"
                                    : "text-rose-400"
                                }`}
                        >
                            {c.difficulty}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-600 bg-slate-800 p-4">
            <h3 className="mb-3 text-lg font-semibold text-slate-200">{title}</h3>
            {children}
        </div>
    );
}

export default function NodeoApp() {
    // Load initial state from localStorage
    const savedState = loadAppState();
    const savedNvidiaState = loadNvidiaPackState();

    const [challengeId, setChallengeId] = useState(savedState.challengeId || CHALLENGES[0]?.id || "fallback-hello");
    const [code, setCode] = useState("");
    const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
    const [hints, setHints] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [mode, setMode] = useState<"learn" | "code">(savedState.mode || "learn");
    const [showNextButton, setShowNextButton] = useState(false);

    // Track how many times the user has attempted the current challenge
    const [attemptCount, setAttemptCount] = useState<number>(savedState.attemptCount || 0);

    // Challenge Library state
    const [showLibrary, setShowLibrary] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Language selection state
    const [language, setLanguage] = useState<"javascript" | "python" | "cpp" | "java">(savedState.language || "javascript");

    // Dynamic challenges state
    const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
    const [nvidiaPackLoaded, setNvidiaPackLoaded] = useState(savedNvidiaState);
    const [loadingNvidiaPack, setLoadingNvidiaPack] = useState(false);

    const challenge = challenges.find(c => c.id === challengeId) || challenges[0];

    // Initialize app state on mount
    useEffect(() => {
        // Load nvidia pack if it was previously loaded
        if (savedNvidiaState && !nvidiaPackLoaded) {
            loadNvidiaPack();
        }

        // Load saved code for current challenge
        const savedProgress = loadChallengeProgress(challengeId);
        if (savedProgress.code) {
            setCode(savedProgress.code);
        }
        if (savedProgress.attemptCount) {
            setAttemptCount(savedProgress.attemptCount);
        }
    }, []);

    // Save state whenever important values change
    useEffect(() => {
        saveAppState({
            challengeId,
            language,
            mode,
            attemptCount,
            nvidiaPackLoaded
        });
    }, [challengeId, language, mode, attemptCount, nvidiaPackLoaded]);

    // Save nvidia pack state
    useEffect(() => {
        saveNvidiaPackState(nvidiaPackLoaded);
    }, [nvidiaPackLoaded]);

    // Save code changes with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (code.trim()) {
                saveChallengeProgress(challengeId, code, attemptCount);
            }
        }, 1000); // Save after 1 second of no changes

        return () => clearTimeout(timeoutId);
    }, [code, challengeId, attemptCount]);

    // Load NVIDIA Practice Pack
    async function loadNvidiaPack() {
        if (nvidiaPackLoaded || loadingNvidiaPack) return;

        setLoadingNvidiaPack(true);
        try {
            const allChallenges = await loadChallengesWithPacks(true);
            setChallenges(allChallenges);
            setNvidiaPackLoaded(true);
            console.log('🎯 NVIDIA Practice Pack loaded successfully!');
        } catch (error) {
            console.error('Failed to load NVIDIA pack:', error);
        } finally {
            setLoadingNvidiaPack(false);
        }
    }

    React.useEffect(() => {
        // Check for saved progress first
        const savedProgress = loadChallengeProgress(challengeId);

        if (savedProgress.code) {
            // Use saved code if available
            setCode(savedProgress.code);
            setAttemptCount(savedProgress.attemptCount || 0);
        } else {
            // Get starter code for current language, fallback to legacy starter
            const langConfig = challenge.languages?.[language];
            const starterCode = langConfig?.starter || challenge.starter;
            setCode(starterCode);
            setAttemptCount(0);
        }

        setEvalResult(null);
        setHints([]);
        setMode("learn");
        setShowNextButton(false);
    }, [challenge, language, challengeId]);

    // Attach meanings to tooltip spans
    React.useEffect(() => {
        const terms = document.querySelectorAll(".tooltip-term");
        terms.forEach((el) => {
            const term = el.getAttribute("data-term");
            const found = dictionary.find((d) => d.term.toLowerCase() === term?.toLowerCase());
            if (found) {
                el.setAttribute("data-meaning", found.meaning);
            }
        });
    }, [hints, evalResult]);

    async function onRun() {
        setRunning(true);
        try {
            // Get tests for current language, fallback to legacy tests
            const langConfig = challenge.languages?.[language];
            let tests = langConfig?.tests || challenge.tests;

            // For non-JavaScript languages, use stdin/stdout tests if available
            if (language !== "javascript" && langConfig?.stdinTests) {
                tests = langConfig.stdinTests.map(test => ({
                    description: test.description,
                    run: "true", // Placeholder for non-JS
                    stdin: test.stdin,
                    expected_output: test.expected_output
                }));
            }

            const result = await runCode(language, code, tests);
            setEvalResult(result);
            setAttemptCount(prev => prev + 1);  // 🔥 count attempts
            const built = buildHints({ code, result, context: { topic: challenge.topic, language } });
            const escalatedHints = escalateHints(built, attemptCount + 1); // Use next attempt count
            setHints(result.passed ? [] : escalatedHints);
            setShowNextButton(result.passed);
        } finally {
            setRunning(false);
        }
    }

    function onResetToStarter() {
        // Get starter code for current language, fallback to legacy starter
        const langConfig = challenge.languages?.[language];
        const starterCode = langConfig?.starter || challenge.starter;
        setCode(starterCode);
        setEvalResult(null);
        setHints([]);
        setShowNextButton(false);
        setAttemptCount(0); // Reset attempts when resetting code
    }

    function goToNextChallenge() {
        const currentIndex = challenges.findIndex(c => c.id === challengeId);
        if (currentIndex < challenges.length - 1) {
            setChallengeId(challenges[currentIndex + 1].id);
        }
    }

    // Reset all app data
    function resetAllData() {
        if (confirm('Are you sure you want to clear all saved data? This will reset your progress, code, and settings.')) {
            clearAppState();
            // Clear all challenge progress
            const savedIds = Object.keys(localStorage).filter(key => key.startsWith('nodeo-challenge-'));
            savedIds.forEach(key => localStorage.removeItem(key));

            // Reset state to defaults
            setChallengeId(CHALLENGES[0]?.id || "fallback-hello");
            setCode("");
            setAttemptCount(0);
            setMode("learn");
            setLanguage("javascript");
            setNvidiaPackLoaded(false);
            setChallenges(CHALLENGES);

            console.log('🔄 All app data cleared');
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="mx-auto max-w-6xl">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100">Nodeo</h1>
                        <p className="text-slate-400">Multi-Language Coding Platform</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!nvidiaPackLoaded && (
                            <button
                                onClick={loadNvidiaPack}
                                disabled={loadingNvidiaPack}
                                className="rounded-lg border border-blue-600 bg-blue-700 px-3 py-1 text-sm text-blue-100 hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                {loadingNvidiaPack ? "Loading..." : "🧠 Load NVIDIA Pack"}
                            </button>
                        )}
                        {nvidiaPackLoaded && (
                            <span className="text-sm text-green-400">✅ NVIDIA Pack Loaded</span>
                        )}
                        <button
                            onClick={() => setShowLibrary(!showLibrary)}
                            className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                        >
                            {showLibrary ? "Close Library" : "📚 Challenge Library"}
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                        >
                            ⚙️ Settings
                        </button>
                        <nav className="text-sm text-slate-400">learn by doing ✨</nav>
                    </div>
                </header>

                {showLibrary && (
                    <div className="my-4">
                        <ChallengeLibrary
                            challenges={challenges}
                            onSelect={(id) => {
                                setChallengeId(id);
                                setShowLibrary(false);
                            }}
                        />
                    </div>
                )}

                {showSettings && (
                    <div className="my-4">
                        <Panel title="Settings">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Data Management</h4>
                                    <p className="text-sm text-slate-400 mb-3">
                                        Your progress, code, and settings are automatically saved.
                                        You can clear all data to start fresh.
                                    </p>
                                    <button
                                        onClick={resetAllData}
                                        className="rounded-lg border border-red-600 bg-red-700 px-3 py-2 text-sm text-red-100 hover:bg-red-600 transition-colors"
                                    >
                                        🗑️ Clear All Data
                                    </button>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Current State</h4>
                                    <div className="text-xs text-slate-400 space-y-1">
                                        <div>Challenge: {challenge.title}</div>
                                        <div>Language: {language}</div>
                                        <div>Mode: {mode}</div>
                                        <div>Attempts: {attemptCount}</div>
                                        <div>NVIDIA Pack: {nvidiaPackLoaded ? 'Loaded' : 'Not loaded'}</div>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-[1fr_320px]">
                    <Panel title="Challenge">
                        <select
                            value={challengeId}
                            onChange={(e) => setChallengeId(e.target.value)}
                            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-slate-200"
                        >
                            {challenges.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.topic}: {c.title}
                                </option>
                            ))}
                        </select>
                        <div className="mt-2 text-sm text-slate-300">{challenge.prompt}</div>

                        {/* Language selector */}
                        <div className="mt-3">
                            <label className="block text-sm text-slate-300 mb-1">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as "javascript" | "python" | "cpp" | "java")}
                                className="rounded-lg border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-slate-200"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                            </select>
                        </div>

                        {/* Mode toggle */}
                        <div className="mt-3 inline-flex overflow-hidden rounded-lg border border-slate-600">
                            <button
                                className={`px-3 py-1 text-sm ${mode === 'learn' ? 'bg-emerald-400 text-slate-900' : 'bg-slate-700 text-slate-300'}`}
                                onClick={() => setMode('learn')}
                            >Learn</button>
                            <button
                                className={`px-3 py-1 text-sm ${mode === 'code' ? 'bg-emerald-400 text-slate-900' : 'bg-slate-700 text-slate-300'}`}
                                onClick={() => setMode('code')}
                            >Code</button>
                        </div>
                    </Panel>

                    <Panel title="Tutor Tips">
                        <ul className="space-y-2 text-sm text-slate-300">
                            {challenge.tips?.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-emerald-400 mt-0.5">💡</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </Panel>
                </div>

                {mode === "learn" ? (
                    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
                        <Panel title="Learn">
                            <ConceptPrimer concept={challenge.concept} example={challenge.example} dictionary={dictionary} />
                            <div className="text-sm text-slate-300 mb-4"
                                dangerouslySetInnerHTML={{ __html: linkTermsToTooltips(challenge.learn?.intro || "", dictionary) }}
                            />
                            <ul className="space-y-2 text-sm text-slate-300">
                                {challenge.learn?.bullets?.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-2"
                                        dangerouslySetInnerHTML={{ __html: linkTermsToTooltips(bullet, dictionary) }}
                                    />
                                ))}
                            </ul>
                            {challenge.learn?.demo && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Demo:</h4>
                                    <pre className="rounded-lg bg-slate-900 text-white p-3 text-sm overflow-x-auto">
                                        {challenge.learn.demo}
                                    </pre>
                                </div>
                            )}
                        </Panel>

                        <Panel title="Results">
                            {evalResult ? (
                                <div className="space-y-3">
                                    <div className={`text-lg font-semibold ${evalResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {evalResult.passed ? '✅ All tests passed!' : '❌ Some tests failed'}
                                    </div>
                                    <ul className="space-y-2">
                                        {evalResult.results.map((result, i) => (
                                            <li key={i} className={`text-sm ${result.passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                                                {result.passed ? '✅' : '❌'} {result.description}
                                                {result.error && <div className="text-xs text-slate-400 mt-1">{result.error}</div>}
                                            </li>
                                        ))}
                                    </ul>
                                    {evalResult.logs && evalResult.logs.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Output:</h4>
                                            <pre className="rounded-lg bg-slate-900 text-white p-3 text-sm overflow-x-auto">
                                                {evalResult.logs.map(log => String(log)).join('\n')}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-slate-400 text-sm">Run your code to see results</div>
                            )}
                        </Panel>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
                        <Panel title="Editor">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck={false}
                                className="h-80 w-full resize-y rounded-xl border border-slate-600 bg-slate-800 p-3 font-mono text-sm text-slate-100"
                                placeholder={`Write your ${language} solution here...`}
                            />
                            <div className="mt-3 flex items-center gap-3">
                                <button
                                    onClick={onRun}
                                    disabled={running}
                                    className="rounded-xl bg-emerald-400 px-4 py-2 text-slate-900 font-medium disabled:opacity-50"
                                >
                                    {running ? "Running..." : "Run Code"}
                                </button>
                                <button
                                    onClick={onResetToStarter}
                                    className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-slate-300 font-medium hover:bg-slate-600"
                                >
                                    Reset
                                </button>
                                {showNextButton && (
                                    <button
                                        onClick={goToNextChallenge}
                                        className="rounded-xl bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
                                    >
                                        Next Challenge
                                    </button>
                                )}
                            </div>
                        </Panel>

                        <Panel title="Hints">
                            {hints.length > 0 ? (
                                <ul className="space-y-2">
                                    {hints.map((h, i) => (
                                        <li
                                            key={i}
                                            className="rounded-xl bg-slate-700 p-3 text-slate-300"
                                            dangerouslySetInnerHTML={{ __html: linkTermsToTooltips(h, dictionary) }}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-slate-400 text-sm">No hints yet. Run your code to get feedback!</div>
                            )}
                        </Panel>
                    </div>
                )}
            </div>
        </div>
    );
}
