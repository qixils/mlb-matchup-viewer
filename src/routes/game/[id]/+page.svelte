<script lang="ts">
    import {page} from "$app/stores";
    let players = new Map<number, any>();
    var live = null;

    function run() {
        fetch(`https://statsapi.mlb.com/api/v1.1/game/${$page.params.id}/feed/live`).then(data => data.json()).then(data => {
            live = data;
            if (players.size === 0) {
                live.gameData.players.forEach(player => {
                    fetch(`https://statsapi.mlb.com/api/v1/people/${player.}/stats?stats=career`)
                });
            }
            setTimeout(run, 1000 * live.metaData.wait)
        })
    }

    run();
</script>

<main class="mx-auto w-full h-screen max-w-lg px-5 pt-1 bg-base-200">

</main>
