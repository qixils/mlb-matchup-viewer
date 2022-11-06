<script lang="ts">
    import type {BoxScoreTeam, BoxScoreTeamPlayer, PitchingStats, BattingStats} from 'src/mlb';

    export let playersById = new Map<number, BoxScoreTeamPlayer>();
    export let playerStatsById = new Map<number, PitchingStats | BattingStats>();
    export let teamsByPlayer = new Map<number, BoxScoreTeam>();
    export let playerId: number | undefined;
    export let isBatter: boolean;
    let bg = isBatter ? "bg-primary" : "bg-secondary";
    let fg = isBatter ? "text-primary-content" : "text-secondary-content";

    $: player = playerId === undefined ? undefined : playersById.get(playerId);
    $: team = playerId === undefined ? undefined : teamsByPlayer.get(playerId);
    $: batterStats = playerId === undefined || !isBatter ? undefined : (playerStatsById.get(playerId) as BattingStats);
    $: pitcherStats = playerId === undefined || isBatter ? undefined : (playerStatsById.get(playerId) as PitchingStats);

    // shhh.. don't tell anyone but statMap is only a parameter here to force svelte to update when it changes
    function calcRank(statMap: Map<number, PitchingStats | BattingStats>, playerId: number, stat: string, ascending: boolean, isFloat: boolean = true): number {
        let stats = Array.from(statMap.entries())
        // filter out undefined values (i.e. batting stat for pitcher) and undefined floats ("-.--" or ".---")
        .filter(entry => entry[1][stat] !== undefined && (!isFloat || !(entry[1][stat] as string).includes("--")));
        // sort
        let mult = ascending ? 1 : -1;
        let sorted = isFloat
        ? stats.sort((a, b) => mult * (parseFloat(a[1][stat] as string) - parseFloat(b[1][stat] as string)))
        : stats.sort((a, b) => mult * (a[1][stat] as number - b[1][stat] as number));
        // ret
        return 1 + sorted.findIndex(entry => entry[0] === playerId);
    }
</script>

<div class="p-4 max-lg:basis-[50dvh] max-lg:w-full {isBatter ? "shrink" : ""} lg:h-full lg:basis-[50dvw] {bg} {fg}">
    {#if player === undefined || team === undefined}
        <!-- TODO: center align -->
        <div class="text-center"><button class="btn loading">
            {#if playersById.size === 0}
                LOADING PLAYERS
            {:else}
                WAITING FOR THE GAME
            {/if}
        </button></div>
    {:else}
        <div class="mb-4">
            <h2>{player.person.fullName}</h2>
            <h3>{player.position.name}</h3>
            <h3>
                {#if isBatter}
                    Batting for the
                {:else}
                    Pitching for the
                {/if}
                {team.team.name}
            </h3>
        </div>

        <table class="table max-lg:table-compact static max-w-xs lg:max-w-xl">
            <tr>
                <th>Statistic</th>
                <th>Value</th>
                <th>Team Rank</th>
            </tr>
            {#if batterStats !== undefined}
                <tr>
                    <td>Batting average</td>
                    <td>{batterStats.avg}</td>
                    <td>#{calcRank(playerStatsById, player.person.id, "avg", false)}</td>
                </tr>
                <tr>
                    <td>On-base percentage</td>
                    <td>{batterStats.obp}</td>
                    <td>#{calcRank(playerStatsById, player.person.id, "obp", false)}</td>
                </tr>
                <tr>
                    <td>Slugging percentage</td>
                    <td>{batterStats.slg}</td>
                    <td>#{calcRank(playerStatsById, player.person.id, "slg", false)}</td>
                </tr>
                <tr>
                    <td>On-base plus slugging</td>
                    <td>{batterStats.ops}</td>
                    <td>#{calcRank(playerStatsById, player.person.id, "ops", false)}</td>
                </tr>
            {:else if pitcherStats !== undefined}
                <tr>
                    <td>Earned run average</td>
                    <td>{pitcherStats.era}</td>
                    <td>#{calcRank(playerStatsById, player.person.id, "era", true)}</td>
                </tr>
                <tr>
                    <td>Walks & hits per inning pitched</td>
                    <td>{pitcherStats.whip}</td>
                    <td>#{calcRank(playerStatsById, player.person.id, "whip", true)}</td>
                </tr>
            {:else}
                <tr>
                    <td colspan="3" class="text-center">
                        <button class="btn btn-square loading"></button>
                    </td>
                </tr>
            {/if}
        </table>
    {/if}
</div>

<style lang="postcss">
    h2 {
        @apply text-4xl;
    }

    h3 {
        @apply text-xl lg:text-2xl;
    }

    table {
        @apply xl:text-xl bg-neutral bg-opacity-50 rounded;
    }

    tr :nth-child(2) {
        @apply text-center;
    }

    tr :nth-child(3) {
        @apply text-right;
    }

    tr {
        @apply hover;
    }
</style>