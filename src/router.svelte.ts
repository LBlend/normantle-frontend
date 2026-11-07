import { tick } from "svelte";

function parseTopPuzzle(): number | null {
  const value = new URLSearchParams(location.search).get("topp1000");
  return value && /^\d+$/.test(value) ? Number(value) : null;
}

const initialTopPuzzle = parseTopPuzzle();

export const route = $state({
  topPuzzle: initialTopPuzzle,
  gameStarted: initialTopPuzzle === null,
});

function setTopPuzzle(puzzle: number | null) {
  route.topPuzzle = puzzle;
  if (puzzle === null) {
    route.gameStarted = true;
  }
}

history.scrollRestoration = "manual";

addEventListener("popstate", async () => {
  setTopPuzzle(parseTopPuzzle());
  await tick();
  scrollTo(0, history.state?.scrollY ?? 0);
});

export function topPuzzleHref(puzzle: number) {
  return `?topp1000=${puzzle}`;
}

export function showTopPuzzle(event: MouseEvent, puzzle: number) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
    return;
  }
  event.preventDefault();
  history.replaceState({ ...history.state, scrollY }, "");
  history.pushState({ fromGame: true }, "", topPuzzleHref(puzzle));
  setTopPuzzle(puzzle);
  scrollTo(0, 0);
}

export function showGame(event: MouseEvent) {
  event.preventDefault();
  if (history.state?.fromGame) {
    history.back();
    return;
  }
  history.pushState(null, "", location.pathname);
  setTopPuzzle(null);
  scrollTo(0, 0);
}
