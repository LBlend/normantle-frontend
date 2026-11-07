<script lang="ts">
  import { showTopPuzzle, topPuzzleHref } from "../router.svelte";
  import { closeness, type GuessEntry } from "../types/GuessResult";

  let {
    guesses,
    puzzleNumber,
  }: { guesses: GuessEntry[]; puzzleNumber: number } = $props();

  const gaveUp = $derived(guesses.some((guess) => guess.kind === "surrender"));
  const numberOfHints = $derived(
    guesses.filter((guess) => guess.kind === "hint").length,
  );
  const numberOfRealGuesses = $derived(
    guesses.filter((guess) => guess.kind === "guess").length,
  );
  const chronological = $derived(
    [...guesses].sort((a, b) => a.guessNumber - b.guessNumber),
  );
  const correctWord = $derived(guesses.find((guess) => guess.isCorrect)?.word);

  function formatSimilarity(guess: GuessEntry) {
    return (guess.similarity * 100).toFixed(2);
  }

  const shareText = $derived.by(() => {
    if (gaveUp) {
      return `Jeg ga opp på Normantle #${puzzleNumber} etter å ha gjettet ${numberOfRealGuesses} gang${
        numberOfRealGuesses === 1 ? "" : "er"
      } og brukt ${numberOfHints} hint\n\nhttps://normantle.furumo.eu/`;
    }

    const firstTopThousand = chronological.findIndex(
      (guess) => closeness(guess) !== null,
    );
    const lines = [
      `Jeg løste Normantle #${puzzleNumber} og brukte ${numberOfRealGuesses} forsøk på å gjette ordet`,
      "",
      `- Brukte hint: ${numberOfHints}`,
      `- Likhetsgrad på første gjett: ${formatSimilarity(chronological[0])}`,
      `- Antall gjett før første blant topp tusen: ${firstTopThousand}`,
    ];

    const penultimate = chronological.at(-2);
    if (penultimate) {
      const close = closeness(penultimate);
      lines.push(
        `- Likhetsgrad på nest siste gjett: ${formatSimilarity(penultimate)}${
          close === null ? "" : ` (${close}/1000)`
        }`,
      );
    }

    return `${lines.join("\n")}\n\nhttps://normantle.furumo.eu/`;
  });

  const resultText = $derived(
    gaveUp ? "Du ga opp" : "Du løste dagens Normantle",
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Kopiert til utklippstavla!");
    } catch {
      alert("Klarte ikke å kopiere til utklippstavla");
    }
  }
</script>

<div id="summary">
  <p>{resultText}! Dagens ord er: <b>{correctWord}</b></p>
  <p>
    <button onclick={copy}>Trykk her</button> for å dele resultatet ditt. Du kan
    se de nærmeste 1000 ordene for dagen
    <a
      href={topPuzzleHref(puzzleNumber)}
      onclick={(event) => showTopPuzzle(event, puzzleNumber)}>her</a
    >
  </p>

  <table>
    <tbody>
      <tr>
        <th>Antall gjett:</th>
        <td>{numberOfRealGuesses}</td>
      </tr>
      <tr>
        <th>Antall hint brukt:</th>
        <td>{numberOfHints}</td>
      </tr>
      <tr>
        <th>Totalt antall forsøk brukt:</th>
        <td>{numberOfRealGuesses + numberOfHints}</td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  #summary {
    background: #334;
    border: 1px solid #fff;
    padding: 1em;
  }

  table {
    margin-block-start: 1rem;
  }

  th {
    text-align: left;
    padding-right: 2rem;
  }

  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    text-decoration: underline;
  }

  @media screen and (max-width: 600px) {
    td,
    th {
      padding: 0.5rem;
    }
  }
</style>
