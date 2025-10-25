#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(q) {
    return new Promise((res) => rl.question(q, res));
}

const template = (id, title, topic, difficulty, concept, example, prompt) => `{
  "id": "${id}",
  "topic": "${topic}",
  "title": "${title}",
  "difficulty": "${difficulty}",
  "tags": ["${topic.toLowerCase()}", "algorithm"],
  "unlocked": true,
  "concept": "${concept}",
  "example": "${example}",
  "prompt": "${prompt}",
  "languages": {
    "javascript": {
      "starter": "// Your JavaScript solution here\\nfunction solution() {\\n    // your code here\\n}\\n\\nsolution();",
      "tests": [
        { "description": "sample test", "run": "(()=>{__RESET__(); solution(); return __LOGS__[0]==='expected';})()" },
        { "description": "edge case", "run": "(()=>{__RESET__(); solution(); return __LOGS__[0]==='expected';})()" }
      ]
    },
    "python": {
      "starter": "# Your Python solution here\\n# Read input and process\\nprint('your output here')",
      "tests": [
        { "description": "sample test", "stdin": "sample input\\n", "expected_output": "expected output\\n" },
        { "description": "edge case", "stdin": "edge case input\\n", "expected_output": "expected output\\n" }
      ]
    },
    "cpp": {
      "starter": "#include <bits/stdc++.h>\\nusing namespace std;\\n\\nint main() {\\n    // Your C++ solution here\\n    cout << \\"your output here\\" << endl;\\n    return 0;\\n}",
      "tests": [
        { "description": "sample test", "stdin": "sample input\\n", "expected_output": "expected output\\n" },
        { "description": "edge case", "stdin": "edge case input\\n", "expected_output": "expected output\\n" }
      ]
    },
    "java": {
      "starter": "import java.util.*;\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        // Your Java solution here\\n        System.out.println(\\"your output here\\");\\n    }\\n}",
      "tests": [
        { "description": "sample test", "stdin": "sample input\\n", "expected_output": "expected output\\n" },
        { "description": "edge case", "stdin": "edge case input\\n", "expected_output": "expected output\\n" }
      ]
    }
  },
  "starter": "// Your JavaScript solution here\\nfunction solution() {\\n    // your code here\\n}\\n\\nsolution();",
  "tests": [
    { "description": "sample test", "run": "(()=>{__RESET__(); solution(); return __LOGS__[0]==='expected';})()" },
    { "description": "edge case", "run": "(()=>{__RESET__(); solution(); return __LOGS__[0]==='expected';})()" }
  ],
  "learn": {
    "intro": "This challenge teaches fundamental programming concepts.",
    "bullets": [
      "Understand the problem requirements",
      "Break down the solution into steps",
      "Implement the solution in your chosen language",
      "Test with different inputs"
    ]
  },
  "tips": [
    "Start with a simple approach",
    "Test your solution with edge cases",
    "Consider time and space complexity"
  ]
}`;

async function main() {
    console.log("🚀 Nodeo Challenge Creator");
    console.log("─".repeat(50));

    const id = await ask("🆔 Challenge ID (e.g. two-sum): ");
    const title = await ask("📝 Title: ");
    const topic = await ask("📚 Topic: ");
    const difficulty = await ask("🏷️ Difficulty (easy/medium/hard): ");
    const concept = await ask("💡 Concept (short explanation): ");
    const example = await ask("📋 Example (Input/Output format): ");
    const prompt = await ask("📝 Prompt (task description): ");

    console.log("\n🔧 Generating challenge...");

    const challenge = template(id, title, topic, difficulty, concept, example, prompt);
    const filePath = path.resolve(`./challenges/${id}.json`);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write file
    fs.writeFileSync(filePath, challenge, "utf8");

    console.log(`✅ Created ${filePath}`);
    console.log("\n🎯 Next steps:");
    console.log("1. Edit the generated JSON file");
    console.log("2. Update starter code for each language");
    console.log("3. Add proper test cases");
    console.log("4. Run the app to test your challenge!");

    rl.close();
}

main().catch(console.error);
