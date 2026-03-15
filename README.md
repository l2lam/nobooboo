# Mr. Lam's No Booboos! 👹📚

An educational, game-show style arcade game where knowledge helps you win big and avoid the dreaded Booboos! Inspired by the classic "Press Your Luck," battle your friends in a high-stakes competition of wits and chance.

## 🚀 Features

- **Interactive Game Board**: A dynamic 24-tile grid featuring rewards, special items, and the infamous "Booboo" tiles.
- **Educational Topics**: Built-in questions for Grade 1-12 Math and Science, with support for customizable topics.
- **Mathematical Rendering**: MathJax integration for beautiful rendering of mathematical symbols and equations using AsciiMath syntax.
- **Dynamic Difficulty**: The game gets harder as rounds progress, with Booboos becoming more frequent.
- **Retro Arcade Aesthetics**:
  - Sleek glassmorphism UI.
  - Interactive sound effects built with the Web Audio API.
- **Multiplayer Battle**: Local multiplayer support with custom player names and random animal avatars.
- **Special Items**: Strategic tiles like "Pass", "Steal", and "Swap" to turn the tide of the game.

## 🕹️ How to Play

1. **Setup**: Enter player names and select your preferred topics (Math/Science).
2. **The Board**: The game board consists of perimeter tiles. A selector spins around the board.
3. **Stop & Win**:
   - Click **STOP** to land on a tile.
   - **Reward Tiles**: Answer a question correctly to earn the points.
   - **Booboo Tiles**: Landing here resets your score to zero! 😱
   - **Special Tiles**: Use actions like Steal or Swap to gain an advantage.
4. **Victory**: The player with the highest score at the end of the final round is crowned the champion!

## 🏗️ Technical Architecture

This project is built with a modern, performance-oriented stack:

- **Frontend**: [Vue 3](https://vuejs.org/) with `<script setup>` and TypeScript for a robust, reactive UI.
- **State Management**: [Pinia](https://pinia.vuejs.org/) handles the complex game state, player data, and board generation.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) combined with custom Vanilla CSS for a premium "glassmorphism" look.
- **Mathematical Rendering**: [MathJax 3](https://www.mathjax.org/) for dynamic typesetting of question and answer content.
- **Audio Engine**: A custom synthesizer built on the **Web Audio API** for real-time sound effects.

## 🛠️ Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
