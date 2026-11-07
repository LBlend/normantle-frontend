<script lang="ts">
  import Result from "./Result.svelte";
  import Summary from "./Summary.svelte";
  import { ApiError, describeError, request } from "../api";
  import type {
    GuessEntry,
    GuessKind,
    GuessResult,
  } from "../types/GuessResult";
  import type { TodayInfoType } from "../types/TodayInfo";

  let { apiRoot, todayInfo }: { apiRoot: string; todayInfo: TodayInfoType } =
    $props();

  let guesses: GuessEntry[] = $state([]);
  let word = $state("");
  let errorMessage = $state("");
  let pending = $state(false);
  let container: HTMLDivElement;
  let input: HTMLInputElement;

  const sortedGuesses = $derived(
    [...guesses].sort((a, b) => b.similarity - a.similarity),
  );
  const mostRecentGuess = $derived(guesses.at(-1) ?? null);
  const hasGuessed = $derived(guesses.length > 0);
  const hasCompleted = $derived(guesses.some((guess) => guess.isCorrect));

  function addGuess(result: GuessResult, kind: GuessKind) {
    guesses.push({ ...result, kind, guessNumber: guesses.length + 1 });
  }

  async function run(action: () => Promise<void>) {
    if (pending) {
      return;
    }

    pending = true;
    errorMessage = "";
    try {
      await action();
    } catch (error) {
      errorMessage = describeError(error);
    } finally {
      pending = false;
    }
  }

  async function onWordSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (pending) {
      return;
    }

    const guess = word.trim().toLowerCase().normalize("NFC");
    word = "";

    if (guess === "") {
      return;
    }

    if (guesses.some((entry) => entry.word === guess)) {
      errorMessage = "Du har allerede gjettet dette ordet!";
      return;
    }

    await run(async () => {
      try {
        const result = await request<GuessResult>(apiRoot, "/guess", {
          word: guess,
          puzzleNumber: todayInfo.puzzleNumber,
        });
        addGuess(result, "guess");
      } catch (error) {
        const retryable = !(
          error instanceof ApiError && [404, 422].includes(error.status)
        );
        if (retryable && word === "") {
          word = guess;
        }
        throw error;
      }
    });

    input.focus();
  }

  async function onHintSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (sortedGuesses[0].ofThousand === 1) {
      errorMessage = "Du kan ikke motta flere hint!";
      return;
    }

    await run(async () => {
      const result = await request<GuessResult>(apiRoot, "/hint", {
        puzzleNumber: todayInfo.puzzleNumber,
        bestGuess: sortedGuesses[0].word,
      });
      addGuess(result, "hint");
    });

    container.scrollIntoView();
  }

  async function onSurrender(event: SubmitEvent) {
    event.preventDefault();

    await run(async () => {
      const result = await request<GuessResult>(
        apiRoot,
        `/surrender?puzzle=${todayInfo.puzzleNumber}`,
      );
      addGuess(result, "surrender");
    });

    container.scrollIntoView();
  }
</script>

<div id="guess" bind:this={container}>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <form class="guessForm" onsubmit={onWordSubmit}>
    <input
      class="guessField"
      type="text"
      name="ord"
      placeholder="Gjett"
      maxlength="64"
      bind:value={word}
      bind:this={input}
      disabled={hasCompleted}
    />
    <input
      class="submitButton guessButton"
      type="submit"
      value="Gjett"
      disabled={hasCompleted || pending}
    />
  </form>

  {#if hasCompleted}
    <Summary
      guesses={sortedGuesses}
      puzzleNumber={todayInfo.puzzleNumber}
      {apiRoot}
    />
  {/if}

  <Result guesses={sortedGuesses} {mostRecentGuess} />

  {#if hasGuessed && !hasCompleted}
    <div id="hintSurrender">
      <form onsubmit={onHintSubmit}>
        <input
          class="submitButton"
          type="submit"
          value="Hint"
          disabled={pending}
        />
      </form>
      <form onsubmit={onSurrender}>
        <input
          class="submitButton"
          type="submit"
          value="Gi opp"
          disabled={pending}
        />
      </form>
    </div>
  {/if}
</div>

<style>
  #guess {
    display: grid;
    gap: 1rem;
  }
  .guessForm {
    width: 100%;
    display: flex;
    gap: 0.5rem;
  }
  .guessField {
    font-size: 1.5rem;
    width: 85%;
  }
  .guessField:disabled {
    cursor: not-allowed;
  }
  .submitButton {
    background-color: #666666;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    padding: 0.5em;
  }
  .submitButton:disabled {
    cursor: not-allowed;
  }
  .guessButton {
    flex: 1;
    font-size: 1.25rem;
  }
  #hintSurrender {
    display: flex;
    gap: 0.5rem;
  }
</style>
