<script lang="ts">
    export let game;

    export let time_format = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
    export function time(dt: string) {
        return time_format.format(new Date(dt));
    }
</script>

<a class="block bg-accent text-accent-content rounded p-3 flex-grow" href="/game/{game.gamePk}">
    <h2>{game.description}</h2>
    {#if game.status.abstractGameState === "Live"}
        <h6>In Progress</h6>
    {:else}
        <h6>Beginning at {time(game.gameDate)}</h6>
    {/if}
    <h3>{game.teams.home.team.name} {game.teams.home.score} - {game.teams.away.score} {game.teams.away.team.name}</h3>
</a>