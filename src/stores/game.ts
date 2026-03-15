import { defineStore } from 'pinia';
import type { GameState, Tile, PlayerId, Character } from '../types';

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    isPlaying: false,
    currentRound: 1,
    totalRounds: 3,
    players: [],
    currentPlayerIndex: 0,
    board: [],
    activeIndex: 0,
    isSpinning: false,
    spinSpeed: 100,
    winner: null,
  }),
  
  getters: {
    currentPlayer: (state) => state.players[state.currentPlayerIndex],
    activeTile: (state) => state.board[state.activeIndex] || null,
  },
  
  actions: {
    addPlayer(name: string, character: Character, topics: string[]) {
      const id = Date.now().toString() + Math.random().toString().slice(2, 6);
      this.players.push({
        id,
        name,
        score: 0,
        character,
        topics,
      });
    },

    removePlayer(id: PlayerId) {
      this.players = this.players.filter(p => p.id !== id);
    },

    setRounds(rounds: number) {
      this.totalRounds = rounds;
    },

    startGame() {
      if (this.players.length === 0) return;
      this.isPlaying = true;
      this.currentRound = 1;
      this.currentPlayerIndex = 0;
      this.winner = null;
      this.generateBoard();
    },

    generateBoard() {
      // Create a 24-tile board (typical perimeter for a 7x7 grid: 7+7+5+5)
      // For now, let's just do 24 simple tiles.
      const tiles: Tile[] = [];
      const boardSize = 24;
      
      const maxBooboos = Math.floor(boardSize * 0.5); // Never more than 50% booboos
      const boobooCount = Math.min(maxBooboos, this.currentRound * 3); // More booboos in later rounds
      
      for (let i = 0; i < boardSize; i++) {
        tiles.push({
          id: `tile-${i}`,
          type: 'reward',
          name: `Reward ${i}`,
          value: 100 + Math.floor(Math.random() * 5) * 100 // 100 to 500
        });
      }

      // Randomly replace some with booboos
      const boobooEmojis = ['👹', '👺', '👻', '👾', '👽', '🤡', '😈', '👿', '💩', '💀', '☠️', '🧟', '🧛'];
      let booboosPlaced = 0;
      while (booboosPlaced < boobooCount) {
        const idx = Math.floor(Math.random() * boardSize);
        if (tiles[idx].type !== 'booboo') {
          tiles[idx] = {
            id: `tile-${idx}`,
            type: 'booboo',
            name: 'Booboo!',
            emoji: boobooEmojis[Math.floor(Math.random() * boobooEmojis.length)]
          };
          booboosPlaced++;
        }
      }

      // Add a couple of specials
      const specials: ['pass', 'steal', 'swap'] = ['pass', 'steal', 'swap'];
      specials.forEach(sp => {
        let placed = false;
        while (!placed) {
          const idx = Math.floor(Math.random() * boardSize);
          if (tiles[idx].type === 'reward') {
            tiles[idx] = {
              id: `tile-${idx}`,
              type: 'special',
              action: sp,
              name: sp.toUpperCase()
            };
            placed = true;
          }
        }
      });

      this.board = tiles;
      this.activeIndex = 0;
    },

    startSpin() {
      this.isSpinning = true;
      // Speed increases (delay decreases) as rounds progress
      this.spinSpeed = Math.max(50, 200 - ((this.currentRound - 1) * 40)); 
    },

    stopSpin() {
      this.isSpinning = false;
      // The component will handle the final "land" trigger
    },

    setActiveIndex(index: number) {
      this.activeIndex = index;
    },

    applyBooboo() {
      const player = this.players[this.currentPlayerIndex];
      if (player) {
        player.score = 0;
      }
    },

    addPoints(points: number) {
      const player = this.players[this.currentPlayerIndex];
      if (player) {
        player.score += points;
      }
    },

    nextTurn() {
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex >= this.players.length) {
        this.currentPlayerIndex = 0;
        this.currentRound++;
        
        if (this.currentRound > this.totalRounds) {
          this.endGame();
        } else {
          this.generateBoard(); // new board for new round
        }
      }
    },

    endGame() {
      this.isPlaying = false;
      let highestScore = -1;
      let winnerId = null;
      
      for (const p of this.players) {
        if (p.score > highestScore) {
          highestScore = p.score;
          winnerId = p.id;
        }
      }
      this.winner = winnerId;
    }
  }
});
