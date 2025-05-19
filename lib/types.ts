export type GameMode = "classic" | "timed" | "endless" | "freePlay"
export type Difficulty = "easy" | "medium" | "hard"
export type Theme = "light" | "dark" | "neon" | "frosted"
export type SoundSet = "piano" | "synth" | "retro" | "drums"

export interface Settings {
  difficulty: Difficulty
  speed: number
  strictMode: boolean
  theme: Theme
  soundSet: SoundSet
  volume: number
  muted: boolean
}

export interface GameStats {
  gamesPlayed: number
  highScores: {
    classic: Record<Difficulty, number>
    timed: Record<Difficulty, number>
    endless: Record<Difficulty, number>
  }
  totalCorrect: number
  totalMistakes: number
  bestStreak: number
  achievements: string[]
}
