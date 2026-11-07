<script lang="ts">
  import type { GuessEntry } from "../types/GuessResult";

  let {
    guesses,
    puzzleNumber,
    apiRoot,
  }: { guesses: GuessEntry[]; puzzleNumber: number; apiRoot: string } =
    $props();

  const gaveUp = $derived(guesses.some((guess) => guess.kind === "surrender"));
  const numberOfHints = $derived(
    guesses.filter((guess) => guess.kind === "hint").length,
  );
  const numberOfRealGuesses = $derived(
    guesses.filter((guess) => guess.kind === "guess").length,
  );
  const correctWord = $derived(guesses[0].word);
  const firstGuess = $derived(
    guesses.find((guess) => guess.guessNumber === 1) ?? guesses[0],
  );
  const firstTopThousand = $derived(
    guesses
      .filter((guess) => guess.ofThousand !== null && guess.ofThousand <= 1000)
      .sort((a, b) => a.guessNumber - b.guessNumber)[0],
  );
  const lastIncorrect = $derived(guesses[1] ?? guesses[0]);

  const shareText = $derived.by(() => {
    if (gaveUp) {
      return `Jeg ga opp på Normanle #${puzzleNumber} etter å ha gjettet ${numberOfRealGuesses} gang${
        numberOfRealGuesses === 1 ? "" : "er"
      } og brukt ${numberOfHints} hint\n\nhttps://normantle.furumo.eu/`;
    }

    let text = `Jeg løste Normanlte #${puzzleNumber} og brukte ${numberOfRealGuesses} forsøk på å gjette ordet

- Brukte hint: ${numberOfHints}
- Likhetsgrad på første gjett: ${(firstGuess.similarity * 100).toFixed(2)}
- Antall gjett før første blant topp tusen: ${
      firstTopThousand ? firstTopThousand.guessNumber - 1 : 0
    }`;

    if (firstTopThousand) {
      text += `\n- Likhetsgrad på nest siste gjett: ${(
        lastIncorrect.similarity * 100
      ).toFixed(2)} (${1000 - (lastIncorrect.ofThousand ?? 0)}/1000)`;
    }

    return `${text}\n\nhttps://normantle.furumo.eu/`;
  });

  const resultText = $derived(
    gaveUp ? "Du ga opp" : "Du løste dagens Normanlte",
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
    <a href={`${apiRoot}/top1000?puzzle=${puzzleNumber}`} target="_blank">her</a
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
