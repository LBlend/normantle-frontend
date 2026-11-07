<script lang="ts">
  import Result from "./Result.svelte";
  import Summary from "./Summary.svelte";
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

  async function onWordSubmit(event: SubmitEvent) {
    event.preventDefault();
    errorMessage = "";

    const guess = word.trim().toLowerCase();
    word = "";

    if (guess === "") {
      return;
    }

    if (guesses.some((entry) => entry.word === guess)) {
      errorMessage = "Du har allerede gjettet dette ordet!";
      return;
    }

    const response = await fetch(`${apiRoot}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word: guess,
        puzzleNumber: todayInfo.puzzleNumber,
      }),
    });

    if (response.ok) {
      addGuess(await response.json(), "guess");
    } else if (response.status === 404) {
      errorMessage = "Ordet finnes ikke/er fjernet fra ordlisten";
    } else {
      errorMessage = "Noe gikk galt! Prøv igjen senere";
    }

    input.focus();
  }

  async function onHintSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (sortedGuesses[0].ofThousand === 1) {
      errorMessage = "Du kan ikke motta flere hint!";
      return;
    }

    const response = await fetch(`${apiRoot}/hint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        puzzleNumber: todayInfo.puzzleNumber,
        bestGuess: sortedGuesses[0].word,
      }),
    });

    if (response.ok) {
      addGuess(await response.json(), "hint");
    } else {
      errorMessage = "Noe gikk galt! Prøv igjen senere";
    }

    container.scrollIntoView();
  }

  async function onSurrender(event: SubmitEvent) {
    event.preventDefault();
    errorMessage = "";

    const response = await fetch(
      `${apiRoot}/surrender?puzzle=${todayInfo.puzzleNumber}`,
      { headers: { "Content-Type": "application/json" } },
    );

    if (response.ok) {
      addGuess(await response.json(), "surrender");
    } else {
      errorMessage = "Noe gikk galt! Prøv igjen senere";
    }

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
      bind:value={word}
      bind:this={input}
      disabled={hasCompleted}
    />
    <input
      class="submitButton guessButton"
      type="submit"
      value="Gjett"
      disabled={hasCompleted}
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
        <input class="submitButton" type="submit" value="Hint" />
      </form>
      <form onsubmit={onSurrender}>
        <input class="submitButton" type="submit" value="Gi opp" />
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
  .error {
    background-color: rgb(245, 110, 110);
    padding: 1em;
    border: red solid 2px;
    color: black;
  }
  #hintSurrender {
    display: flex;
    gap: 0.5rem;
  }
</style>
