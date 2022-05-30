<script>
  import Clipboard from "svelte-clipboard";

  export let guesses;
  export let puzzleNumber;
  export let apiRoot;

  let numberOfGuesses = guesses.length;
  let numberOfHints = guesses.filter((guess) =>
    guess.word.includes("💡")
  ).length;
  let numberOfRealGuesses = numberOfGuesses - numberOfHints;
  let correctWord = guesses[0].word.split(" ")[0];

  let firstGuess = guesses.find((guess) => guess.guessNumber === 1);
  let firstTopThousand = guesses
    .filter((guess) => guess.ofThousand !== null && guess.ofThousand <= 1000)
    .sort((a, b) => a.guessNumber - b.guessNumber)[0];

  let lastIncorrect = guesses[0];
  if (guesses.length > 1) {
    lastIncorrect = guesses[1];
  }

  let shareText = "";
  const gaveUp = guesses[0].word.includes("🏳️");
  if (gaveUp) {
    shareText = `Jeg ga opp på Normanle #${puzzleNumber} etter å ha gjettet ${
      numberOfRealGuesses - 1
    } gang${
      numberOfRealGuesses - 1 === 1 ? "" : "er"
    } og brukt ${numberOfHints} hint`;
  } else {
    shareText = `Jeg løste Normanlte #${puzzleNumber} og brukte ${numberOfRealGuesses} forsøk på å gjette ordet

- Brukte hint: ${numberOfHints}
- Likhetsgrad på første gjett: ${(firstGuess.similarity * 100).toFixed(2)}
- Antall gjett før første blant topp tusen: ${
      firstTopThousand ? firstTopThousand.guessNumber - 1 : 0
    }`;

    if (firstTopThousand) {
      shareText =
        shareText +
        `\n- Likhetsgrad på nest siste gjett: ${(
          lastIncorrect.similarity * 100
        ).toFixed(2)} (${1000 - lastIncorrect.ofThousand}/1000)`;
    }
  }
  shareText = `${shareText}\n\nhttps://normantle.lblend.moe/`;

  let resultText = gaveUp ? "Du ga opp" : "Du løste dagens Normanlte";
</script>

<div id="summary">
  <p>{resultText}! Dagens ord er: <b>{correctWord}</b></p>
  <p>
    <Clipboard
      text={shareText}
      let:copy
      on:copy={() => {
        alert("Kopiert til utklippstavla!");
      }}
    >
      <button on:click={copy}>Trykk her</button>
    </Clipboard> for å dele resultatet ditt. Du kan se de nærmeste 1000 ordene for
    dagen
    <a href={`${apiRoot}/top1000?puzzle=${puzzleNumber}`} target="_blank">her</a
    >
  </p>

  <table>
    <tr>
      <th>Antall gjett:</th>
      <td>{gaveUp ? numberOfRealGuesses - 1 : numberOfRealGuesses}</td>
    </tr>
    <tr>
      <th>Antall hint brukt:</th>
      <td>{numberOfHints}</td>
    </tr>
    <tr>
      <th>Totalt antall forsøk brukt:</th>
      <td>{gaveUp ? numberOfGuesses - 1 : numberOfGuesses}</td>
    </tr>
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
