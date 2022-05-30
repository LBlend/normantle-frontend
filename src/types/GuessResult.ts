export interface GuessResult {
  word: string;
  similarity: number;
  isClose: boolean;
  isCorrect: boolean;
  ofThousand: number | null;
}
