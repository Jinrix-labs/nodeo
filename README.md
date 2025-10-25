# Nodeo - Hands-on Coding Tutor

A React-based coding tutor that helps learners practice JavaScript through interactive challenges with real-time feedback and adaptive hints.

## Features

- **Interactive Code Editor**: Write and test JavaScript code in a safe sandbox
- **Real-time Testing**: Automatic test execution with immediate feedback
- **Adaptive Hints**: Smart hints that guide learners without giving away solutions
- **Multiple Challenges**: Various coding exercises to practice different concepts
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## How It Works

1. **Select a Challenge**: Choose from available coding exercises
2. **Write Your Code**: Use the editor to implement your solution
3. **Run Tests**: Click "Run" to execute your code and see results
4. **Get Hints**: If tests fail, you'll receive helpful hints to guide you
5. **Iterate**: Keep refining your solution until all tests pass

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles with Tailwind CSS
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Custom JavaScript Evaluator** - Safe code execution

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
