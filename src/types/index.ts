export type PlayerId = string;

export interface Character {
    id: string;
    name: string;
    emoji: string;
}

export interface PlayerState {
    id: PlayerId;
    name: string;
    score: number;
    character: Character;
    topics: string[];
}

export type TileType = 'reward' | 'booboo' | 'special';
export type SpecialAction = 'pass' | 'steal' | 'swap';

export interface Tile {
    id: string;
    type: TileType;
    value?: number; // for reward
    action?: SpecialAction; // for special
    name: string;
}

export interface VariableDefinition {
    type?: 'integer';
    min: number;
    max: number;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    topicId: string;
}

export interface QuestionTemplate extends Question {
    variables?: Record<string, VariableDefinition>;
}

export interface Topic {
    id: string;
    name: string;
    description?: string;
    category?: string;
    questions?: QuestionTemplate[];
}

export interface GameState {
    isPlaying: boolean;
    currentRound: number;
    totalRounds: number;
    players: PlayerState[];
    currentPlayerIndex: number;
    board: Tile[];
    activeIndex: number;
    isSpinning: boolean;
    spinSpeed: number;
    winner: PlayerId | null;
}
