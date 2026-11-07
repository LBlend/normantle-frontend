export interface GuessResult {
  word: string;
  similarity: number;
  isClose: boolean;
  isCorrect: boolean;
  ofThousand: number | null;
}

export function closeness(guess: GuessResult): number | null {
  if (guess.isCorrect) {
    return 1000;
  }
  return guess.ofThousand === null ? null : 1000 - guess.ofThousand;
}

export type GuessKind = "guess" | "hint" | "surrender";

export interface GuessEntry extends GuessResult {
  guessNumber: number;
  kind: GuessKind;
}
