import React, { useMemo, useState } from "react";

/**
 * Nodeo – Hands-on Coding Tutor (Canvas Preview)
 * ------------------------------------------------------
 * Adds beginner-friendly Learn Mode, Tutor Tips, and a 10-question starter set.
 * Keeps original loop tests intact. New tests added for new challenges.
 */

// -----------------------------
// Types
// -----------------------------

// 🧠 Simple Beginner Dictionary
const dictionary: { term: string; meaning: string }[] = [
    { term: "call", meaning: "run a function, like greet();" },
    { term: "declare", meaning: "create a variable or function, e.g. let x = 5;" },
    { term: "parameter", meaning: "an input that a function can use" },
    { term: "return", meaning: "give back a value from a function" },
    { term: "log", meaning: "print something to the console (console.log)" },
    { term: "function", meaning: "a block of code you can reuse (like a machine)" },
    { term: "loop", meaning: "repeat some code multiple times" },
    { term: "array", meaning: "a list of values stored together" },
    { term: "index", meaning: "the position number in an array (starts at 0)" },
];

type TestSpec = { description: string; run: string };

type LearnBlock = {
    intro: string;            // short plain-English explanation
    bullets: string[];        // key takeaways
    demo?: string;            // non-editable code snippet to show
};

type Challenge = {
    id: string;
    topic: string;
    title: string;
    difficulty?: "easy" | "medium" | "hard";  // 🆕 difficulty tag
    tags?: string[];                          // 🆕 searchable tags
    unlocked?: boolean;                      // 🆕 for progress tracking
    concept?: string;         // Short explanation of the concept
    example?: string;        // Optional code example
    prompt: string;
    starter: string;
    tests: TestSpec[];
    learn: LearnBlock;        // Learn Mode content
    tips?: string[];          // Tutor tips sidebar
};

type EvalTestResult = { description: string; passed: boolean; error?: string };

type EvalResult = { passed: boolean; results: EvalTestResult[]; error?: string; logs?: any[]; returns?: any[] };

// -----------------------------
// 10 Starter Challenges (Beginner → Loops). Original loop tests preserved.
// -----------------------------

const CHALLENGES: Challenge[] = [
    // 1
    {
        id: "basics-100",
        topic: "Basics",
        title: "Hello (your first log)",
        difficulty: "easy",
        tags: ["functions", "console", "basics"],
        unlocked: true,
        concept: "A function is like a machine. You give it instructions, and you can call it whenever you want to run those instructions.",
        example: `function greet() {
  console.log('Hello!');
}

greet();`,
        prompt: "Write a function greet() that logs the string 'hello'. Then call it.",
        starter: `function greet(){
  // log the string 'hello'
}

greet();`,
        tests: [
            { description: "function exists", run: `typeof greet === 'function'` },
            { description: "logs once", run: `__LOGS__.length === 1` },
            { description: "logs a string", run: `typeof __LOGS__[0] === 'string'` },
            { description: "logs 'hello' exactly", run: `__LOGS__[0] === 'hello'` },
        ],
        learn: {
            intro: "Functions are little machines. They run when you call their name with ( ).",
            bullets: [
                "Use console.log('...') to print text.",
                "Curly braces { } wrap the function body.",
                "Don't forget to CALL the function after you define it."
            ],
            demo: `function demo(){
  console.log('hello');
}

demo(); // prints hello`
        },
        tips: [
            "Make sure 'hello' is lowercase and inside quotes.",
            "Did you remember parentheses in greet()?"
        ]
    },
    // 2
    {
        id: "basics-101",
        topic: "Basics",
        title: "Variables + strings",
        concept: "Variables store values that you can use later. Strings are text wrapped in quotes.",
        example: `const name = 'Ada';
console.log('Hello, ' + name + '!');`,
        prompt: "Create a variable name = 'Ada' and log the string 'Hello, Ada!' (exact punctuation).",
        starter: `// create a variable named 'name' with value 'Ada'
// then log "Hello, Ada!"`,
        tests: [
            { description: "logged once", run: `__LOGS__.length === 1` },
            { description: "is a string", run: `typeof __LOGS__[0] === 'string'` },
            { description: "matches 'Hello, Ada!' (ignoring extra spaces)", run: `(()=>{ const s=__LOGS__[0]; return typeof s==='string' && s.replace(/\s+/g,' ').trim()==='Hello, Ada!'; })()` },
        ],
        learn: {
            intro: "Variables store values. Strings are text inside quotes.",
            bullets: [
                "Use let or const to create a variable.",
                "Use + or template strings to combine text.",
                "console.log prints values to the console."
            ],
            demo: `const name = 'Ada';
console.log('Hello, ' + name + '!');`
        },
        tips: ["Mind spaces, the comma, and the exclamation mark."]
    },
    // 3
    {
        id: "basics-102",
        topic: "Basics",
        title: "Add two numbers",
        prompt: "Write add(a,b) that returns the sum. Log add(2,3).",
        starter: `function add(a, b){
  // return the sum of a and b
}

console.log(add(2,3));`,
        tests: [
            { description: "function exists", run: `typeof add === 'function'` },
            { description: "returns 5 for (2,3)", run: `__RETURNS__[0] === 5` },
            { description: "works for negatives", run: `(()=>{ __RESET__(); console.log(add(-2,5)); return __RETURNS__[0]===3 })()` },
            { description: "works for zeros", run: `(()=>{ __RESET__(); console.log(add(0,0)); return __RETURNS__[0]===0 })()` },
        ],
        learn: {
            intro: "Functions can take inputs (parameters) and return a result.",
            bullets: [
                "Use return to send a value back from the function.",
                "Numbers add with + (be careful not to return strings)."
            ],
            demo: `function add(a,b){
  return a + b;
}
console.log(add(2,3)); // 5`
        },
        tips: ["Did you use return?", "Are you adding numbers, not strings?"]
    },
    // 4
    {
        id: "basics-103",
        topic: "Basics",
        title: "Template strings",
        prompt: "Log exactly the string: 'Total: 7' by computing 3 + 4 using a template string.",
        starter: `// Use a template string with backticks
// Example: \`Hello, ${name}!\`
// Compute 3 + 4 inside the expression and log 'Total: 7'`,
        tests: [
            { description: "logged once", run: `__LOGS__.length === 1` },
            { description: "exact text (ignoring extra spaces)", run: `(()=>{ const s=__LOGS__[0]; return typeof s==='string' && s.replace(/\s+/g,' ').trim()==='Total: 7'; })()` },
        ],
        learn: {
            intro: "Template strings use backticks and ${} to embed expressions.",
            bullets: [
                "Use backticks, not quotes.",
                "Inside ${}, you can compute values like 3+4."
            ],
            demo: "console.log(`Total: ${3+4}`);"
        },
        tips: ["Use backticks ` not regular quotes.", "Spacing matters: match 'Total: 7'."]
    },
    // 5
    {
        id: "basics-104",
        topic: "Basics",
        title: "Multiply",
        prompt: "Write multiply(a,b) that returns a*b. Log multiply(3,4).",
        starter: `function multiply(a,b){
  // return the product
}

console.log(multiply(3,4));`,
        tests: [
            { description: "function exists", run: `typeof multiply === 'function'` },
            { description: "returns 12 for (3,4)", run: `__RETURNS__[0] === 12` },
            { description: "works for (0,5)", run: `(()=>{ __RESET__(); console.log(multiply(0,5)); return __RETURNS__[0]===0 })()` },
        ],
        learn: {
            intro: "Return values let you compute results you can reuse.",
            bullets: ["Use the * operator for multiplication."],
            demo: `function multiply(a,b){ return a*b }\nconsole.log(multiply(3,4)); // 12`
        },
        tips: ["Don't forget return."]
    },
    // 6
    {
        id: "conditionals-101",
        topic: "Conditionals",
        title: "isEven(n)",
        prompt: "Write isEven(n) that returns true if n is even, else false. Log isEven(4) and isEven(5).",
        starter: `function isEven(n){
  // return true if even, false otherwise
}

console.log(isEven(4));
console.log(isEven(5));`,
        tests: [
            { description: "function exists", run: `typeof isEven === 'function'` },
            { description: "two logs", run: `__LOGS__.length === 2` },
            { description: "even true", run: `__LOGS__[0] === true` },
            { description: "odd false", run: `__LOGS__[1] === false` },
            { description: "boolean returns", run: `typeof __LOGS__[0] === 'boolean' && typeof __LOGS__[1] === 'boolean'` },
        ],
        learn: {
            intro: "Conditionals choose different paths based on a test.",
            bullets: ["Use n % 2 === 0 to test even numbers.", "Return true/false explicitly."],
            demo: `function isEven(n){\n  return n % 2 === 0;\n}`
        },
        tips: ["Use the modulo operator %.", "Return a boolean value."]
    },
    // 7
    {
        id: "conditionals-102",
        topic: "Conditionals",
        title: "max(a,b)",
        prompt: "Write max(a,b) that returns the larger of the two numbers. Log max(10,7).",
        starter: `function max(a,b){
  // return the larger value
}

console.log(max(10,7));`,
        tests: [
            { description: "function exists", run: `typeof max === 'function'` },
            { description: "returns 10 for (10,7)", run: `__RETURNS__[0] === 10` },
            { description: "works for equal", run: `(()=>{ __RESET__(); console.log(max(5,5)); return __RETURNS__[0]===5 })()` },
        ],
        learn: {
            intro: "Use if/else or the ternary operator to pick a value.",
            bullets: ["Compare with > or >= as desired."],
            demo: `function max(a,b){\n  return a >= b ? a : b;\n}`
        },
        tips: ["Remember to return the chosen value."]
    },
    // 8 (original kept)
    {
        id: "loops-101",
        topic: "Loops",
        title: "Print 1 to 5",
        difficulty: "easy",
        tags: ["loops", "for", "basics"],
        unlocked: true,
        concept: "A loop lets you repeat the same action multiple times automatically.",
        example: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}`,
        prompt:
            "Write a function printOneToFive() that logs numbers 1 through 5 (inclusive). Then call it.",
        starter: `function printOneToFive(){
  // your code here
}

printOneToFive();`,
        tests: [
            { description: "function exists", run: `typeof printOneToFive === 'function'` },
            { description: "logs 5 times", run: `__LOGS__.length === 5` },
            { description: "starts at 1", run: `__LOGS__[0] === 1` },
            { description: "ends at 5", run: `__LOGS__[4] === 5` },
            { description: "only numbers", run: `__LOGS__.every(n => typeof n === 'number')` },
            { description: "increasing by 1", run: `__LOGS__.every((v,i)=> i===0 ? true : (__LOGS__[i]-__LOGS__[i-1]===1))` },
            { description: "no extra items", run: `Array.isArray(__LOGS__) && __LOGS__.length === 5` },
        ],
        learn: {
            intro: "Loops repeat actions. A for-loop has init; condition; increment parts.",
            bullets: ["Use i++ to step by 1.", "Use <= 5 to include 5."],
            demo: `for (let i=1; i<=5; i++){ console.log(i) }`
        },
        tips: ["Check your boundaries.", "Increment with i++ not i+1."]
    },
    // 9 (original kept)
    {
        id: "loops-102",
        topic: "Loops",
        title: "Sum 1..N",
        prompt: "Write sumToN(n) that returns the sum of 1..n. For n=5 => 15.",
        starter: `function sumToN(n){
  // your code here
}

// Do not change below
console.log(sumToN(5));`,
        tests: [
            { description: "returns 15 for 5", run: `__RETURNS__[0] === 15` },
            { description: "works for 1", run: `(()=>{ __RESET__(); console.log(sumToN(1)); return __RETURNS__[0]===1 })()` },
            { description: "works for 10", run: `(()=>{ __RESET__(); console.log(sumToN(10)); return __RETURNS__[0]===55 })()` },
            { description: "returns a number", run: `(()=>{ __RESET__(); console.log(sumToN(3)); return typeof __RETURNS__[0] === 'number' })()` },
            { description: "works for 3", run: `(()=>{ __RESET__(); console.log(sumToN(3)); return __RETURNS__[0]===6 })()` },
        ],
        learn: {
            intro: "Accumulate a running total in a loop.",
            bullets: ["Start at 0, add i each iteration.", "Return the total."],
            demo: `function sumToN(n){\n  let total = 0;\n  for (let i=1;i<=n;i++){ total += i }\n  return total;\n}`
        },
        tips: ["Initialize total=0.", "Use <= n to include n."]
    },
    // 10
    {
        id: "arrays-101",
        topic: "Arrays",
        title: "Make a list",
        concept: "Arrays are ordered lists that can hold multiple values. You can access them by position (starting from 0).",
        example: `const fruits = ['apple', 'banana', 'cherry'];
console.log(fruits.length); // 3`,
        prompt: "Write makeList() that returns an array with exactly 3 strings. Then log its length.",
        starter: `function makeList(){
  // return an array with exactly 3 strings
}

console.log(makeList().length);`,
        tests: [
            { description: "function exists", run: `typeof makeList === 'function'` },
            { description: "returns array", run: `(()=>{ const a = makeList(); return Array.isArray(a) })()` },
            { description: "exactly 3 items", run: `(()=>{ const a = makeList(); return a.length === 3 })()` },
            { description: "all strings", run: `(()=>{ const a = makeList(); return a.every(x => typeof x === 'string') })()` },
            { description: "logged length is 3", run: `__RETURNS__[0] === 3` },
        ],
        learn: {
            intro: "Arrays hold ordered lists of values.",
            bullets: ["Use [ ] to create arrays.", "Use .length to count items."],
            demo: `const arr = ['a','b','c'];\nconsole.log(arr.length); // 3`
        },
        tips: ["Use strings like 'a', not numbers."]
    },
    // 11 - New Challenge Pack
    {
        id: "find-number",
        topic: "Warm-up",
        title: "Find Number",
        difficulty: "easy",
        tags: ["arrays", "search", "loops"],
        unlocked: true,
        concept: "Search for a number in a list using a simple loop.",
        example: `function findNumber(arr, n) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === n) return "YES";
  }
  return "NO";
}`,
        prompt: "Write a function findNumber(arr, n) that returns 'YES' if n exists in arr, otherwise 'NO'.",
        starter: `function findNumber(arr, n) {
  // your code here
}`,
        tests: [
            { description: "function exists", run: `typeof findNumber === 'function'` },
            { description: "finds existing number", run: `findNumber([1,2,3,4], 3) === 'YES'` },
            { description: "returns NO if not found", run: `findNumber([1,2,3,4], 7) === 'NO'` },
            { description: "works for empty array", run: `findNumber([], 1) === 'NO'` },
        ],
        learn: {
            intro: "Searching through arrays is a fundamental skill. Use a loop to check each element.",
            bullets: [
                "Use a for loop to visit each array element.",
                "Compare each element with your target value.",
                "Return immediately when you find a match."
            ],
            demo: `function findNumber(arr, n) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === n) return "YES";
  }
  return "NO";
}`
        },
        tips: ["Check each element one by one.", "Return 'YES' as soon as you find it."]
    },
    {
        id: "odd-numbers",
        topic: "Loops",
        title: "Odd Numbers",
        concept: "Loop through a range and return all odd numbers in ascending order.",
        example: `function oddNumbers(l, r) {
  const result = [];
  for (let i = l; i <= r; i++) {
    if (i % 2 !== 0) result.push(i);
  }
  return result;
}`,
        prompt: "Write a function oddNumbers(l, r) that returns an array of all odd numbers between l and r inclusive.",
        starter: `function oddNumbers(l, r) {
  // your code here
}`,
        tests: [
            { description: "function exists", run: `typeof oddNumbers === 'function'` },
            { description: "basic range", run: `JSON.stringify(oddNumbers(2, 5)) === JSON.stringify([3,5])` },
            { description: "works when start is odd", run: `JSON.stringify(oddNumbers(1, 5)) === JSON.stringify([1,3,5])` },
            { description: "no odds in even range", run: `JSON.stringify(oddNumbers(2, 2)) === JSON.stringify([])` },
        ],
        learn: {
            intro: "Use the modulo operator % to check if a number is odd.",
            bullets: [
                "Use i % 2 !== 0 to test for odd numbers.",
                "Build an array by pushing odd numbers to it.",
                "Loop from l to r inclusive."
            ],
            demo: `function oddNumbers(l, r) {
  const result = [];
  for (let i = l; i <= r; i++) {
    if (i % 2 !== 0) result.push(i);
  }
  return result;
}`
        },
        tips: ["Use % 2 to check odd/even.", "Start with an empty array."]
    },
    {
        id: "counting-valleys",
        topic: "Loops + Conditions",
        title: "Counting Valleys",
        difficulty: "medium",
        tags: ["loops", "conditions", "state-tracking"],
        unlocked: true,
        concept: "Track a hiker's altitude. A valley is a sequence below sea level that starts with a step down and ends with a step up.",
        example: `function countingValleys(steps, path) {
  let level = 0;
  let valleys = 0;
  for (let i = 0; i < steps; i++) {
    if (path[i] === 'U') level++;
    else level--;
    if (level === 0 && path[i] === 'U') valleys++;
  }
  return valleys;
}`,
        prompt: "Write a function countingValleys(steps, path) that returns how many valleys were walked through.",
        starter: `function countingValleys(steps, path) {
  // your code here
}`,
        tests: [
            { description: "function exists", run: `typeof countingValleys === 'function'` },
            { description: "basic valley case", run: `countingValleys(8, 'UDDDUDUU') === 1` },
            { description: "no valleys", run: `countingValleys(4, 'UUUU') === 0` },
            { description: "two valleys", run: `countingValleys(12, 'DDUUDDUDUUUD') === 2` },
        ],
        learn: {
            intro: "Track altitude changes and count when you return to sea level from below.",
            bullets: [
                "Keep track of current altitude level.",
                "Increment when going up (U), decrement when going down (D).",
                "Count a valley when you reach sea level (0) from below."
            ],
            demo: `function countingValleys(steps, path) {
  let level = 0;
  let valleys = 0;
  for (let i = 0; i < steps; i++) {
    if (path[i] === 'U') level++;
    else level--;
    if (level === 0 && path[i] === 'U') valleys++;
  }
  return valleys;
}`
        },
        tips: ["Track your altitude level.", "Count valleys when returning to sea level."]
    },
    {
        id: "two-sum",
        topic: "Logic + Loops",
        title: "Two Sum",
        concept: "Find if any two numbers in an array add up to a target.",
        example: `function twoSum(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) return true;
    }
  }
  return false;
}`,
        prompt: "Write a function twoSum(arr, target) that returns true if two numbers add to target, else false.",
        starter: `function twoSum(arr, target) {
  // your code here
}`,
        tests: [
            { description: "function exists", run: `typeof twoSum === 'function'` },
            { description: "finds a valid pair", run: `twoSum([2,7,11,15], 9) === true` },
            { description: "no pair found", run: `twoSum([1,2,3], 100) === false` },
            { description: "works with negatives", run: `twoSum([-1,2,4,0], 3) === true` },
        ],
        learn: {
            intro: "Use nested loops to check every pair of numbers.",
            bullets: [
                "Use two nested loops to check all pairs.",
                "Start the inner loop from i+1 to avoid duplicates.",
                "Return true as soon as you find a matching pair."
            ],
            demo: `function twoSum(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) return true;
    }
  }
  return false;
}`
        },
        tips: ["Use nested loops to check all pairs.", "Start inner loop from i+1."]
    },
    {
        id: "mini-max-sum",
        topic: "Math",
        title: "Mini-Max Sum",
        concept: "Given 5 numbers, print the minimum and maximum sum of 4 of them.",
        example: `function miniMaxSum(arr) {
  const total = arr.reduce((a,b)=>a+b,0);
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  console.log((total - max) + ' ' + (total - min));
}`,
        prompt: "Write miniMaxSum(arr) that prints min and max sums (of 4 out of 5 numbers) separated by a space.",
        starter: `function miniMaxSum(arr) {
  // your code here
}`,
        tests: [
            { description: "function exists", run: `typeof miniMaxSum === 'function'` },
            { description: "correct output for sample", run: `(()=>{__RESET__(); miniMaxSum([1,2,3,4,5]); return __LOGS__[0]==='10 14';})()` },
        ],
        learn: {
            intro: "To get the sum of 4 out of 5 numbers, subtract the excluded number from the total.",
            bullets: [
                "Calculate the total sum of all 5 numbers.",
                "Subtract the largest number to get the minimum sum.",
                "Subtract the smallest number to get the maximum sum."
            ],
            demo: `function miniMaxSum(arr) {
  const total = arr.reduce((a,b)=>a+b,0);
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  console.log((total - max) + ' ' + (total - min));
}`
        },
        tips: ["Find total sum, then subtract min/max.", "Use Math.min and Math.max."]
    },
    {
        id: "time-conversion",
        topic: "Strings",
        title: "Time Conversion",
        concept: "Convert a 12-hour AM/PM time to 24-hour format.",
        example: `function timeConversion(s) {
  const ampm = s.slice(-2);
  let [hh, mm, ss] = s.slice(0, 8).split(':');
  if (ampm === 'AM' && hh === '12') hh = '00';
  if (ampm === 'PM' && hh !== '12') hh = String(Number(hh)+12);
  return \`\${hh}:\${mm}:\${ss}\`;
}`,
        prompt: "Write a function timeConversion(s) that returns 24-hour format time string.",
        starter: `function timeConversion(s) {
  // your code here
}`,
        tests: [
            { description: "function exists", run: `typeof timeConversion === 'function'` },
            { description: "midnight case", run: `timeConversion('12:00:00AM') === '00:00:00'` },
            { description: "noon case", run: `timeConversion('12:00:00PM') === '12:00:00'` },
            { description: "normal PM", run: `timeConversion('07:05:45PM') === '19:05:45'` },
        ],
        learn: {
            intro: "Handle special cases for 12 AM (midnight) and 12 PM (noon), then add 12 for PM times.",
            bullets: [
                "Extract AM/PM from the last 2 characters.",
                "Split the time part and convert to numbers.",
                "Handle special cases: 12 AM → 00, 12 PM → 12."
            ],
            demo: `function timeConversion(s) {
  const ampm = s.slice(-2);
  let [hh, mm, ss] = s.slice(0, 8).split(':');
  if (ampm === 'AM' && hh === '12') hh = '00';
  if (ampm === 'PM' && hh !== '12') hh = String(Number(hh)+12);
  return \`\${hh}:\${mm}:\${ss}\`;
}`
        },
        tips: ["Check for 12 AM/PM special cases.", "Add 12 to PM times (except 12 PM)."]
    },
    {
        id: "staircase",
        topic: "Loops + Strings",
        title: "Staircase",
        concept: "Print a staircase of # symbols that is right-aligned.",
        example: `function staircase(n) {
  for (let i = 1; i <= n; i++) {
    console.log(' '.repeat(n - i) + '#'.repeat(i));
  }
}`,
        prompt: "Write staircase(n) that prints a right-aligned staircase of height n.",
        starter: `function staircase(n) {
  // your code here
}`,
        tests: [
            { description: "function exists", run: `typeof staircase === 'function'` },
            { description: "height 3", run: `(()=>{__RESET__(); staircase(3); return __LOGS__[2]==='###';})()` },
            { description: "first line correct", run: `(()=>{__RESET__(); staircase(3); return __LOGS__[0]==='  #';})()` },
        ],
        learn: {
            intro: "Use string.repeat() to create spaces and # symbols, then combine them.",
            bullets: [
                "Use ' '.repeat() for spaces and '#'.repeat() for symbols.",
                "Calculate spaces needed: n - i for each row.",
                "Print each row with the right number of spaces and #s."
            ],
            demo: `function staircase(n) {
  for (let i = 1; i <= n; i++) {
    console.log(' '.repeat(n - i) + '#'.repeat(i));
  }
}`
        },
        tips: ["Use string.repeat() for spaces and #s.", "Calculate spaces as n - i."]
    },
];

// -----------------------------
// Evaluator (MVP, browser-only sandbox)
// -----------------------------

function evaluateJS(code: string, tests: TestSpec[]): EvalResult {
    let LOGS: any[] = [];
    let RETURNS: any[] = [];

    const sandboxConsole = {
        log: (v: any) => {
            LOGS.push(v);
            RETURNS.push(v);
        },
    };

    function __RESET__() {
        LOGS = [];
        RETURNS = [];
    }

    const wrapped = [
        "(function(){",
        "  var console = { log: function(){ sandboxConsole.log(arguments[0]); } };",
        "  var print = function(){ sandboxConsole.log(arguments[0]); };", // prevent window.print()
        "  var __LOGS__ = LOGS;",
        "  var __RETURNS__ = RETURNS;",
        "  var __RESET__ = RESET;",
        code,
        "})()",
    ].join("\n");

    const runner = new Function(
        "sandboxConsole",
        "LOGS",
        "RETURNS",
        "RESET",
        `return ${wrapped}`
    );

    try {
        runner(sandboxConsole, LOGS, RETURNS, __RESET__);

        const results: EvalTestResult[] = [];
        for (const t of tests) {
            try {
                const fn = new Function(
                    "__LOGS__",
                    "__RETURNS__",
                    "__RESET__",
                    `return (${t.run})`
                );
                const ok = !!fn(LOGS, RETURNS, __RESET__);
                results.push({ description: t.description, passed: ok });
            } catch (err: any) {
                results.push({ description: t.description, passed: false, error: String(err) });
            }
        }

        const passed = results.every((r) => r.passed);
        return { passed, results, logs: [...LOGS], returns: [...RETURNS] };
    } catch (err: any) {
        return { passed: false, results: [], error: String(err), logs: [], returns: [] };
    }
}

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
    context?: { topic?: string };
}): string[] {
    const hints: string[] = [];

    if ((result as any)?.error) {
        hints.push("Your code didn't run. Check for missing braces or parentheses.");
    }

    const lower = code.toLowerCase();
    const usesFor = /for\s*\(/.test(lower);
    const usesWhile = /while\s*\(/.test(lower);

    // Basics
    if (context?.topic === "Basics") {
        if (/greet\s*\(/.test(lower)) {
            if (!/console\.log\(/.test(lower)) hints.push("Use `console.log(...)` to print to the console.");
            if (!/'hello'/.test(code) && !/"hello"/.test(code)) hints.push("Log the exact string 'hello' in lowercase.");
        }
        if (/add\s*\(/.test(lower) || /multiply\s*\(/.test(lower)) {
            if (!/return/.test(lower)) hints.push("Don't forget to `return` from the function.");
        }
        if (/total:\s*\$\{\s*3\s*\+\s*4\s*\}/i.test(code) === false && lower.includes("total: 7")) {
            hints.push("Use a template string with backticks and ${3+4} to compute inside the string.");
        }
    }

    // Conditionals
    if (context?.topic === "Conditionals") {
        if (/iseven\s*\(/i.test(lower) && !/%/.test(code)) hints.push("Consider using the modulo operator `%` to check even/odd.");
        if (/max\s*\(/i.test(lower) && !/\?|:|if\s*\(/.test(lower)) hints.push("Pick one path or the other using if/else or a ternary.");
    }

    // Arrays
    if (context?.topic === "Arrays") {
        if (!/\[.*\]/.test(code)) hints.push("Use [ ] to create an array of three strings.");
        if (/length/.test(lower) === false) hints.push("Log the array length with .length.");
    }

    // Loops
    if (context?.topic === "Loops") {
        if (!usesFor && !usesWhile)
            hints.push("Consider using a loop structure (for/while) to repeat actions.");
        if (/i\+1/.test(code))
            hints.push("Use the increment operator: try `i++` instead of `i+1` in the loop header.");
        if (/for\s*\(\s*let\s+i\s*=\s*1;[^;]*<\s*5/.test(code))
            hints.push("Careful with boundaries: to include 5, compare with `<= 5`.");
    }

    const failed = (result as any)?.results?.filter((t: EvalTestResult) => !t.passed) || [];
    for (const f of failed) {
        if (f.description.includes("logs 5 times"))
            hints.push("How many times should your loop run? Count the iterations.");
        if (f.description.includes("starts at 1"))
            hints.push("What value do you initialize the counter with?");
        if (f.description.includes("ends at 5"))
            hints.push("Is your loop condition inclusive of 5? Think `<=`.");
        if (f.description.includes("only numbers"))
            hints.push("Are you logging numbers directly, not strings?");
        if (f.description.includes("matches 'Hello, Ada!'"))
            hints.push("Mind spaces, comma, and exclamation: it must match exactly.");
    }

    if (hints.length === 0) {
        hints.push("Break it down: identify inputs, the operation, then the exact output to log or return.");
    }

    return Array.from(new Set(hints)).slice(0, 4);
}

// -----------------------------
// Escalating Tutor Hints System
// -----------------------------

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
    if (hint.includes("function") || hint.includes("Function")) {
        return "Functions declared normally stay inside the sandbox, so tests can't reach them. Making them global fixes this.";
    }
    if (hint.includes("String") || hint.includes("string") || hint.includes("exact")) {
        return "Your output is close, but spacing or formatting doesn't exactly match.";
    }
    if (hint.includes("return") || hint.includes("Return")) {
        return "`return` sends a value back from the function so the test can use it.";
    }
    if (hint.includes("Log count") || hint.includes("logs") || hint.includes("times")) {
        return "The number of console.log calls didn't match what the test expected.";
    }
    if (hint.includes("loop") || hint.includes("Loop")) {
        return "Loops repeat code multiple times. Check your loop conditions and increments.";
    }
    if (hint.includes("array") || hint.includes("Array")) {
        return "Arrays are lists of values. Make sure you're creating the right type of array.";
    }
    return "This is a common beginner error — try adjusting step by step.";
}

function getExampleSnippet(hint: string): string {
    if (hint.includes("function") || hint.includes("Function")) {
        return "globalThis.add = function(a,b){ return a+b };";
    }
    if (hint.includes("String") || hint.includes("string") || hint.includes("exact")) {
        return "console.log(`Hello, ${name}!`);";
    }
    if (hint.includes("return") || hint.includes("Return")) {
        return "function add(a,b){ return a + b }";
    }
    if (hint.includes("loop") || hint.includes("Loop")) {
        return "for (let i=1; i<=5; i++){ console.log(i) }";
    }
    if (hint.includes("array") || hint.includes("Array")) {
        return "return ['apple', 'banana', 'cherry'];";
    }
    return "";
}

// -----------------------------
// Auto-linking Helper
// -----------------------------

// 🪄 Auto-link dictionary terms to tooltips inside text
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

// -----------------------------
// UI Components
// -----------------------------

// 💬 Simple hover tooltip component
function Tooltip({ term, meaning }: { term: string; meaning: string }) {
    return (
        <div className="group relative inline-block">
            <span className="font-semibold cursor-help text-emerald-400">{term}</span>
            <div className="absolute bottom-full mb-2 hidden w-56 rounded-lg bg-slate-800 p-2 text-xs text-white group-hover:block z-10 shadow-lg border border-slate-600">
                {meaning}
            </div>
        </div>
    );
}

function visibleString(v: any) {
    if (typeof v !== 'string') return String(v);
    return v
        .replace(/ /g, '·')   // spaces
        .replace(/\t/g, '⇥') // tabs
        .replace(/\n/g, '⏎\n'); // newlines (keep line breaks)
}

function Panel({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
            <div className="mb-2 text-sm uppercase tracking-wide text-slate-400">{title}</div>
            {children}
        </div>
    );
}

function CodeBlock({ code }: { code: string }) {
    return (
        <pre className="rounded-xl bg-slate-900 p-3 text-xs text-slate-100 overflow-auto">
            {code}
        </pre>
    );
}

function ProgressBar({ value }: { value: number }) {
    return (
        <div className="h-2 w-full rounded-full bg-slate-700">
            <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${value}%` }} />
        </div>
    );
}

// -----------------------------
// Concept Primer Component
// -----------------------------

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
                <pre className="mt-3 rounded-lg bg-slate-900 text-slate-100 p-3 text-sm overflow-x-auto border border-slate-700">
                    {example}
                </pre>
            )}
        </div>
    );
}

// -----------------------------
// Challenge Library Component
// -----------------------------

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
                    className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-200 w-full mr-2 placeholder-slate-400"
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
                        className="cursor-pointer rounded-lg border border-slate-600 bg-slate-700 p-3 hover:bg-slate-600 transition-colors flex items-center justify-between"
                        onClick={() => onSelect(c.id)}
                    >
                        <div>
                            <div className="font-medium text-slate-200">{c.title}</div>
                            <div className="text-xs text-slate-400">
                                {c.topic} • {c.difficulty || 'easy'}
                            </div>
                        </div>
                        <span
                            className={`text-xs font-semibold ${c.difficulty === "easy"
                                    ? "text-emerald-400"
                                    : c.difficulty === "medium"
                                        ? "text-amber-400"
                                        : "text-red-400"
                                }`}
                        >
                            {c.difficulty || 'easy'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// -----------------------------
// App
// -----------------------------

export default function NodeoApp() {
    const [challengeId, setChallengeId] = useState<string>(CHALLENGES[0].id);
    const challenge = useMemo(
        () => CHALLENGES.find((c) => c.id === challengeId)!,
        [challengeId]
    );

    const [code, setCode] = useState<string>(challenge.starter);
    const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
    const [hints, setHints] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [mode, setMode] = useState<"learn" | "solve">("learn"); // Learn Mode toggle
    const [showNextButton, setShowNextButton] = useState(false);

    // Track how many times the user has attempted the current challenge
    const [attemptCount, setAttemptCount] = useState<number>(0);

    // Challenge Library state
    const [showLibrary, setShowLibrary] = useState(false);

    React.useEffect(() => {
        setCode(challenge.starter);
        setEvalResult(null);
        setHints([]);
        setMode("learn");
        setShowNextButton(false);
        setAttemptCount(0); // Reset attempts when changing challenges
    }, [challenge]);

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

    function onRun() {
        setRunning(true);
        try {
            const result = evaluateJS(code, challenge.tests);
            setEvalResult(result);
            setAttemptCount(prev => prev + 1);  // 🔥 count attempts
            const built = buildHints({ code, result, context: { topic: challenge.topic } });
            const escalatedHints = escalateHints(built, attemptCount + 1); // Use next attempt count
            setHints(result.passed ? [] : escalatedHints);
            setShowNextButton(result.passed);
        } finally {
            setRunning(false);
        }
    }

    function onResetToStarter() {
        setCode(challenge.starter);
        setEvalResult(null);
        setHints([]);
        setShowNextButton(false);
        setAttemptCount(0); // Reset attempts when resetting code
    }

    function goToNextChallenge() {
        const currentIndex = CHALLENGES.findIndex(c => c.id === challengeId);
        if (currentIndex < CHALLENGES.length - 1) {
            setChallengeId(CHALLENGES[currentIndex + 1].id);
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-6 bg-slate-900 text-slate-100 min-h-screen">
            <header className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-400" />
                    <h1 className="text-xl font-semibold text-slate-100">Nodeo</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowLibrary(!showLibrary)}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                        {showLibrary ? "Close Library" : "📚 Challenge Library"}
                    </button>
                    <nav className="text-sm text-slate-400">learn by doing ✨</nav>
                </div>
            </header>

            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
                    <label className="block text-sm text-slate-300">Challenge</label>
                    <select
                        value={challengeId}
                        onChange={(e) => setChallengeId(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 p-2 text-slate-100"
                    >
                        {CHALLENGES.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.topic}: {c.title}
                            </option>
                        ))}
                    </select>
                    <div className="mt-2 text-sm text-slate-300">{challenge.prompt}</div>

                    {/* Mode toggle */}
                    <div className="mt-3 inline-flex overflow-hidden rounded-lg border border-slate-600">
                        <button
                            className={`px-3 py-1 text-sm ${mode === 'learn' ? 'bg-emerald-400 text-slate-900' : 'bg-slate-700 text-slate-300'}`}
                            onClick={() => setMode('learn')}
                        >Learn</button>
                        <button
                            className={`px-3 py-1 text-sm ${mode === 'solve' ? 'bg-emerald-400 text-slate-900' : 'bg-slate-700 text-slate-300'}`}
                            onClick={() => setMode('solve')}
                        >Solve</button>
                    </div>
                </div>
                <div className="hidden items-center md:flex">
                    <div className="min-w-[240px]"><ProgressBar value={evalResult?.passed ? 100 : 0} /></div>
                </div>
            </div>

            {/* Challenge Library */}
            {showLibrary && (
                <div className="my-4">
                    <ChallengeLibrary
                        challenges={CHALLENGES}
                        onSelect={(id) => {
                            setChallengeId(id);
                            setShowLibrary(false);
                        }}
                    />
                </div>
            )}

            {/* Concept Primer */}
            <ConceptPrimer
                concept={challenge.concept}
                example={challenge.example}
                dictionary={dictionary}
            />

            {mode === 'learn' ? (
                <div className="grid gap-4 md:grid-cols-[1fr_320px]">
                    <Panel title="Learn">
                        <p
                            className="text-sm text-slate-300"
                            dangerouslySetInnerHTML={{ __html: linkTermsToTooltips(challenge.learn.intro, dictionary) }}
                        />
                        <ul className="mt-3 list-disc pl-6 text-sm text-slate-300 space-y-1">
                            {challenge.learn.bullets.map((b, i) => (
                                <li
                                    key={i}
                                    dangerouslySetInnerHTML={{ __html: linkTermsToTooltips(b, dictionary) }}
                                />
                            ))}
                        </ul>
                        {challenge.learn.demo && (
                            <div className="mt-3">
                                <div className="text-xs text-slate-400 mb-1">Demo (read-only)</div>
                                <CodeBlock code={challenge.learn.demo} />
                            </div>
                        )}
                        <button
                            onClick={() => setMode('solve')}
                            className="mt-4 rounded-xl bg-emerald-400 px-4 py-2 text-slate-900 font-medium"
                        >Start solving</button>
                    </Panel>

                    <Panel title="Tutor Tips">
                        {challenge.tips?.length ? (
                            <ul className="list-disc pl-6 text-sm text-slate-300 space-y-1">
                                {challenge.tips.map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                        ) : (
                            <div className="text-slate-400 text-sm">Hints will appear here as you learn.</div>
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
                        />
                        <div className="mt-3 flex items-center gap-3">
                            <button
                                onClick={onRun}
                                disabled={running}
                                className="rounded-xl bg-emerald-400 px-4 py-2 text-slate-900 font-medium disabled:opacity-50"
                            >
                                {running ? "Running…" : "Run"}
                            </button>
                            <button
                                onClick={onResetToStarter}
                                className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-slate-300"
                            >
                                Reset to starter
                            </button>
                            {evalResult?.passed && (
                                <span className="text-emerald-400">✅ Tests passed!</span>
                            )}
                            {evalResult && !evalResult.passed && (
                                <span className="text-red-400">❌ Some tests failed</span>
                            )}
                            {showNextButton && (
                                <button
                                    onClick={goToNextChallenge}
                                    className="rounded-xl bg-emerald-400 px-4 py-2 text-slate-900 font-medium"
                                >
                                    Next Challenge →
                                </button>
                            )}
                        </div>
                    </Panel>

                    <Panel title="Tutor Tips & Hints">
                        {hints.length === 0 ? (
                            <div className="text-slate-400">No hints yet. Run your code to get guidance.</div>
                        ) : (
                            <ol className="space-y-2">
                                {hints.map((h, i) => (
                                    <li
                                        key={i}
                                        className="rounded-xl bg-slate-700 p-3 text-slate-300"
                                        dangerouslySetInnerHTML={{ __html: linkTermsToTooltips(h, dictionary) }}
                                    />
                                ))}
                            </ol>
                        )}
                    </Panel>
                </div>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Panel title="Test Results">
                    {!evalResult ? (
                        <div className="text-slate-400">Run the code to see test results.</div>
                    ) : evalResult.error ? (
                        <div className="text-red-400">Runtime error: {String(evalResult.error)}</div>
                    ) : (
                        <>
                            {Array.isArray(evalResult.returns) && evalResult.returns.length > 0 && (
                                <div className="mb-2 rounded-lg border border-slate-600 bg-slate-700 p-2 text-xs text-slate-300">
                                    <div className="font-medium mb-1">Your recent console outputs:</div>
                                    <pre className="overflow-auto">
                                        {(() => {
                                            try {
                                                const shown = evalResult.returns.slice(0, 3).map(v => typeof v === 'string' ? v : JSON.stringify(v));
                                                return shown.join("\n");
                                            } catch {
                                                return String(evalResult.returns[0]);
                                            }
                                        })()}
                                    </pre>
                                    {evalResult.returns.length > 3 && (
                                        <div className="mt-1 text-slate-400">(+{evalResult.returns.length - 3} more)</div>
                                    )}
                                </div>
                            )}
                            <ul className="space-y-2">
                                {evalResult.results.map((r, idx) => (
                                    <li key={idx} className="rounded-lg bg-slate-700 p-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">{r.description}</span>
                                            {r.passed ? (
                                                <span className="text-emerald-400">pass</span>
                                            ) : (
                                                <span className="text-red-400">fail{r.error ? ` – ${r.error}` : ""}</span>
                                            )}
                                        </div>

                                        {!r.passed && (
                                            <div className="mt-2 rounded-md bg-slate-800 p-2 text-xs text-slate-300 border border-slate-600">
                                                {(() => {
                                                    const firstOut = Array.isArray(evalResult.returns) ? evalResult.returns[0] : undefined;
                                                    const outShown = firstOut !== undefined ? visibleString(firstOut) : '—';
                                                    const isStringOut = typeof firstOut === 'string';
                                                    const details: string[] = [];

                                                    if (challenge.id === 'basics-101' && isStringOut) {
                                                        details.push(`Expected: 'Hello, Ada!'`);
                                                        details.push(`You printed: '${outShown}'`);
                                                    } else if (challenge.id === 'basics-103' && isStringOut) {
                                                        details.push(`Expected: 'Total: 7'`);
                                                        details.push(`You printed: '${outShown}'`);
                                                    } else if (/logs/.test(r.description)) {
                                                        const n = Array.isArray(evalResult.logs) ? evalResult.logs.length : 0;
                                                        details.push(`You logged ${n} time(s).`);
                                                    } else if (isStringOut) {
                                                        details.push(`Your first output: '${outShown}'`);
                                                    }

                                                    if (details.length === 0 && Array.isArray(evalResult.returns) && evalResult.returns.length) {
                                                        details.push(`Your first output: '${outShown}'`);
                                                    }

                                                    return <ul className="list-disc pl-5 space-y-1">{details.map((d, i) => (<li key={i}>{d}</li>))}</ul>;
                                                })()}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Panel>

                <Panel title="Dictionary 📖">
                    <ul className="space-y-2 text-sm">
                        {dictionary.map((d, i) => (
                            <li key={i} className="rounded-lg bg-slate-700 p-2">
                                <Tooltip term={d.term} meaning={d.meaning} />
                            </li>
                        ))}
                    </ul>
                </Panel>
            </div>
        </div>
    );
}