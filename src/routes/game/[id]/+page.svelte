<script lang="ts">
    import type {LiveData, StatData, BoxScoreTeam, BoxScoreTeamPlayer, PitchingStats, BattingStats} from 'src/mlb';
    import Player from '$lib/Player.svelte';
    import {page} from "$app/stores";
    let playersById = new Map<number, BoxScoreTeamPlayer>();
    let playerStatsById = new Map<number, PitchingStats | BattingStats>();
    let teamsByPlayer = new Map<number, BoxScoreTeam>();
    var batter: number | undefined;
    var pitcher: number | undefined;

    function addPlayers(team: BoxScoreTeam) {
        for (const key in team.players) {
            const player: BoxScoreTeamPlayer = team.players[key];
            playersById.set(player.person.id, player);
            teamsByPlayer.set(player.person.id, team);

            if (playerStatsById.has(player.person.id)) {
                return;
            }
            let statType = player.position.abbreviation === "P" ? "pitching" : "hitting";
            fetch(`https://statsapi.mlb.com/api/v1/people/${player.person.id}/stats?stats=season&sportId=1`).
            then(data => data.json()).
            then((data : StatData) => {
                let stats = data.stats.filter(stat => stat.group.displayName === statType)[0] ?? data.stats[0];
                // ensure we fetch the split representing the stats for the whole season regardless of team
                let split = stats.splits.filter(split => split.numTeams !== undefined)[0] ?? stats.splits[0];
                playerStatsById.set(player.person.id, split.stat);
                playerStatsById = playerStatsById; // force svelte to update
            })
        }
    }

    function run() {
        fetch(`https://statsapi.mlb.com/api/v1.1/game/${$page.params.id}/feed/live`).
        then(data => data.json()).
        then((data : LiveData) => {
            addPlayers(data.liveData.boxscore.teams.away);
            addPlayers(data.liveData.boxscore.teams.home);
            batter = data.liveData.plays.currentPlay.matchup.batter.id;
            pitcher = data.liveData.plays.currentPlay.matchup.pitcher.id;
            if (data.gameData.status.statusCode !== "F") {
                setTimeout(run, 1000 * data.metaData.wait);
            }
        })
    }

    run();
</script>

<!-- svelte-ignore non-top-level-reactive-declaration -->
<main class="w-screen h-screen flex flex-col lg:flex-row gap-0">
    <Player {playersById} {playerStatsById} {teamsByPlayer} playerId={batter} isBatter={true} />
    <Player {playersById} {playerStatsById} {teamsByPlayer} playerId={pitcher} isBatter={false} />
</main>
