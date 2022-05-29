<script>
    export let todayInfo;
</script>

<div>
    <p>Dagens ord er <b>#{todayInfo.puzzleNumber}</b>. Det nærmeste ordet har en likhetsgrad på <b>{(todayInfo.similarity * 100).toFixed(2)}</b>. Det tiende nærmeste har en likhetsgrad på <b>{(todayInfo.similarityTenth * 100).toFixed(2)}</b> og det tusende nærmeste ordet har en likhetsgrad på <b>{(todayInfo.similarityThousandth * 100).toFixed(2)}</b>.</p>
</div>
