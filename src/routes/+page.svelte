<script lang="ts">
    import type {Schedule} from 'src/mlb';
    import Game from "$lib/Game.svelte";
    let schedule_promise: Promise<Schedule> = fetch("https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1").then(r => r.json())
</script>

<svelte:head>
    <title>MLB Matchup Statistics Viewer</title>
    <meta name="description" content="View the seasonal statistics of players currently matching up in Major League Baseball.">
    <meta property="og:title" content="MLB Matchup Statistics Viewer">
    <meta property="og:description" content="View the seasonal statistics of players currently matching up in Major League Baseball.">
    <meta property="og:url" content="https://mlb.qixils.dev/">
    <link rel="canonical" href="https://mlb.qixils.dev/">
</svelte:head>

<main class="mx-auto w-full h-screen max-w-lg px-5 pt-1 bg-base-200">
    <h1 class="text-center text-primary-content bg-primary p-2 my-4 rounded-t">Live Games</h1>
    {#await schedule_promise}
        <div class="text-center"><button class="btn btn-square loading"></button></div>
    {:then schedule}
        {@const games = schedule.dates[0]?.games?.filter(game => game.status.statusCode !== "f") ?? []}
        {#if games.length === 0}
            <p class="text-center bg-error text-error-content p-2 rounded">No games are currently scheduled or in progress.</p>
        {:else}
            <div class="flex flex-col gap-2">
                {#each games as game}
                    <Game {game} />
                {/each}
            </div>
        {/if}
    {/await}
</main>
