<script lang="ts">
  import Result from "./Result.svelte";
  import Summary from "./Summary.svelte";

  // Types
  import type { GuessResult } from "../types/GuessResult";
  import type { TodayInfoType } from "../types/TodayInfo";

  export let apiRoot: string;
  export let todayInfo: TodayInfoType;

  let guesses = [];

  let hasGuessed = false;
  let hasCompleted = false;
  let errorMessage = "";
  let mostRecentGuess = null;

  function addGuess(guess: GuessResult) {
    const guessResult = { ...guess, guessNumber: guesses.length + 1 };
    guesses = [guessResult, ...guesses];
    guesses = guesses.sort((a, b) => b.similarity - a.similarity);
    mostRecentGuess = guessResult;
  }

  async function onWordSubmit(e) {
    errorMessage = "";

    const word = e.target.word.value.trim().toLowerCase();
    e.target.word.value = ""; // Clear input

    if (word === "") {
      return;
    }

    if (guesses.map((guess) => guess.word).includes(word)) {
      errorMessage = "Du har allerede gjettet dette ordet!";
      return;
    }

    const response = await fetch(`${apiRoot}/guess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: word,
        puzzleNumber: todayInfo.puzzleNumber,
      }),
    });

    if (response.ok) {
      const guessResponse: GuessResult = await response.json();
      hasGuessed = true;
      addGuess(guessResponse);

      if (guessResponse.isCorrect) {
        hasCompleted = true;
      }
    } else {
      if (response.status === 404) {
        errorMessage = "Ordet finnes ikke/er fjernet fra ordlisten";
      } else {
        errorMessage = "Noe gikk galt! Prøv igjen senere";
      }
    }

    e.target.word.focus(); // Refocus on guess input after submitting a guess
  }

  async function onHintSubmit() {
    if (guesses[0].ofThousand === 1) {
      errorMessage = "Du kan ikke motta flere hint!";
      return;
    }

    const response = await fetch(`${apiRoot}/hint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        puzzleNumber: todayInfo.puzzleNumber,
        bestGuess: guesses[0].word.split(" ")[0],
      }),
    });

    if (response.ok) {
      let hintResponse = await response.json();
      hintResponse.word = `${hintResponse.word} 💡`;
      addGuess(hintResponse);

      if (hintResponse.isCorrect) {
        hasCompleted = true;
      }
    } else {
      errorMessage = "Noe gikk galt! Prøv igjen senere";
    }

    // Scroll back up to guess bar when requesting hint. Janky solution but hey it works
    window.location.href = window.location.href.split("#")[0] + "#guess";
  }

  async function onSurrender() {
    errorMessage = ""; // Clear any remaining error messages

    const response = await fetch(
      `${apiRoot}/surrender?puzzle=${todayInfo.puzzleNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      let surrenderResponse: GuessResult = await response.json();
      surrenderResponse.word = `${surrenderResponse.word} 🏳️🇫🇷`;
      addGuess(surrenderResponse);
      hasCompleted = true;
    } else {
      errorMessage = "Noe gikk galt! Prøv igjen senere";
    }

    // Scroll back up to guess bar when requesting hint. Janky solution but hey it works
    window.location.href = window.location.href.split("#")[0] + "#guess";
  }
</script>

<div id="guess">
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <form class="guessForm" on:submit|preventDefault={onWordSubmit}>
    <input
      class="guessField"
      type="text"
      id="word"
      name="ord"
      placeholder="Gjett"
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
    <Summary bind:guesses puzzleNumber={todayInfo.puzzleNumber} {apiRoot} />
  {/if}

  <Result bind:guesses bind:mostRecentGuess />

  {#if hasGuessed && !hasCompleted}
    <div id="hintSurrender">
      <form on:submit|preventDefault={onHintSubmit}>
        <input class="submitButton" type="submit" value="Hint" />
      </form>
      <form on:submit|preventDefault={onSurrender}>
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
