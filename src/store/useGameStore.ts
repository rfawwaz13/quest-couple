import { create } from 'zustand';

export interface Question {
  id: number;
  category: string;
  text: string;
  discussed: boolean;
}

export interface ScoreRecord {
  question: string;
  category: string;
  player1Score: number;
  player2Score: number;
}

export interface Player {
  id: number;
  name: string;
  position: number;
  score: number;
  avatar: string;
}

interface GameState {
  step: 'upload' | 'setup' | 'playing' | 'question' | 'icebreaker' | 'summary';
  questions: Question[];
  players: Player[];
  turnIndex: number;
  activeQuestion: Question | null;
  answeringPlayerIndex: number | null;
  isScoringPhase: boolean;
  history: ScoreRecord[];
  totalQuestionsAsked: number;
  currentRoundScores: { player1: number | null; player2: number | null };
  
  photos: string[];
  lastIceBreakerMilestone: number;
  // State Baru: Menentukan jenis ice breaker
  iceBreakerType: 'photo' | 'story' | null;

  setQuestions: (q: Question[]) => void;
  setPlayers: (p: Player[]) => void;
  setStep: (step: GameState['step']) => void;
  rollDice: () => void;
  submitScore: (score: number) => void;
  skipQuestion: () => void;
  saveIceBreakerPhoto: (photoBase64: string) => void;
  resumeFromIceBreaker: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  step: 'upload',
  questions: [],
  players: [],
  turnIndex: 0,
  activeQuestion: null,
  answeringPlayerIndex: null,
  isScoringPhase: false,
  history: [],
  totalQuestionsAsked: 0,
  currentRoundScores: { player1: null, player2: null },
  photos: [],
  lastIceBreakerMilestone: 0,
  iceBreakerType: null,

  setQuestions: (questions) => set({ questions, step: 'setup' }),
  setPlayers: (players) => set({ players }),
  setStep: (step) => set({ step }),

  rollDice: () => {
    const state = get();
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = state.players[state.turnIndex];
    const newPosition = currentPlayer.position + diceValue;

    const availableQuestions = state.questions.filter(q => !q.discussed);
    
    if (availableQuestions.length === 0) {
      set({ step: 'summary' });
      return;
    }

    const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    set((prev) => ({
      players: prev.players.map((p, i) => 
        i === prev.turnIndex ? { ...p, position: newPosition } : p
      ),
      activeQuestion: randomQ,
      answeringPlayerIndex: prev.turnIndex,
      isScoringPhase: false,
      step: 'question',
      totalQuestionsAsked: prev.totalQuestionsAsked + 1,
      currentRoundScores: { player1: null, player2: null }
    }));
  },

  submitScore: (scoreValue) => {
    const state = get();
    const isP1Answering = state.answeringPlayerIndex === 0;

    const newRoundScores = {
      ...state.currentRoundScores,
      [isP1Answering ? 'player1' : 'player2']: scoreValue
    };

    if (newRoundScores.player1 !== null && newRoundScores.player2 !== null) {
      const newRecord: ScoreRecord = {
        question: state.activeQuestion?.text || '',
        category: state.activeQuestion?.category || '',
        player1Score: newRoundScores.player1,
        player2Score: newRoundScores.player2,
      };

      const updatedQuestions = state.questions.map(q => 
        q.id === state.activeQuestion?.id ? { ...q, discussed: true } : q
      );

      // LOGIC ICE BREAKER: Cek Milestone & Tentukan Tipenya
      const answeredCount = updatedQuestions.filter(q => q.discussed).length;
      const milestoneInterval = 10; // Setiap 10 pertanyaan
      const isMilestone = answeredCount > 0 && answeredCount % milestoneInterval === 0 && answeredCount !== state.lastIceBreakerMilestone;
      
      const milestoneMultiplier = answeredCount / milestoneInterval;
      // Ganjil (10, 30) = photo, Genap (20, 40) = story
      const nextIceBreakerType = isMilestone ? (milestoneMultiplier % 2 !== 0 ? 'photo' : 'story') : null;

      set({
        questions: updatedQuestions,
        history: [...state.history, newRecord],
        activeQuestion: null,
        answeringPlayerIndex: null,
        currentRoundScores: { player1: null, player2: null },
        isScoringPhase: false,
        step: isMilestone ? 'icebreaker' : 'playing',
        turnIndex: state.turnIndex === 0 ? 1 : 0,
        ...(isMilestone ? { lastIceBreakerMilestone: answeredCount, iceBreakerType: nextIceBreakerType } : {})
      });
    } else {
      set({
        currentRoundScores: newRoundScores,
        answeringPlayerIndex: state.answeringPlayerIndex === 0 ? 1 : 0
      });
    }
  },

  skipQuestion: () => {
    const state = get();
    set({
      activeQuestion: null,
      answeringPlayerIndex: null,
      currentRoundScores: { player1: null, player2: null },
      isScoringPhase: false,
      step: 'playing',
      turnIndex: state.turnIndex === 0 ? 1 : 0
    });
  },

  saveIceBreakerPhoto: (photoBase64) => {
    const state = get();
    set({
      photos: [...state.photos, photoBase64],
      step: 'playing',
      iceBreakerType: null
    });
  },

  resumeFromIceBreaker: () => {
    set({ step: 'playing', iceBreakerType: null });
  }
}));