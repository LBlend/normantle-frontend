<script>
    export let guesses;
</script>

<table>
    <tr>
        <th>#</th>
        <th>Ord</th>
        <th>Likhetsgrad</th>
        <th>Nærme?</th>
    </tr>
    {#each guesses as guess}
    <tr>
        <td>{guess.guessNumber}</td>
        <td>{guess.word}</td>
        <td>{(guess.similarity * 100).toFixed(2)}</td>
        <td>{guess.isClose}</td>
    </tr>
    {/each}
</table>

<style>
    td, th {
        padding: 1rem;
    }
    th {
        border-bottom: 2px solid white;
        text-align: left;
    }
</style>
