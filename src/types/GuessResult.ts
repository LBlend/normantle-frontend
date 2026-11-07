export interface GuessResult {
  word: string;
  similarity: number;
  isClose: boolean;
  isCorrect: boolean;
  ofThousand: number | null;
}

export type GuessKind = "guess" | "hint" | "surrender";

export interface GuessEntry extends GuessResult {
  guessNumber: number;
  kind: GuessKind;
}
