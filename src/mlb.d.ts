export interface RootResponse {
    copyright: string,
}

export interface PartialDateTime {
    dateTime: string, // UTC instant
    officialDate: string, // US date of the event as YYYY-MM-DD
    dayNight: string, // 'day' or 'night'
}

export interface IdentifiableObject {
    id: number, // int
    link: string,
}

export interface NameableObject extends IdentifiableObject {
    name: string,
}

// misc

export interface Record {
    wins: number, // int; games won in the series/league/best of whatever
    losses: number, // int; games lost in the you know
} 

export interface LeagueRecord extends Record {
    pct: string, // percent of games won as a 0-1 float as a string
}

export interface FullLeagueRecord extends LeagueRecord {
    ties: number, // int; games tied in the you know
}

// games

export interface GameStatus {
    abstractGameState: string, // can be 'Live', 'Final', 'Preview'
    abstractGameCode: string, // first char of abstractGameState ig
    detailedState: string, // can be 'In Progress', 'Final', 'Scheduled'
    statusCode: string, // first char of detailedState
    codedGameState: string, // dupe of statusCode?
    startTimeTBD: boolean,
}

export interface Game {
    doubleHeader: string, // unknown (to me) single-char code
    gamedayType: string, // unknown (to me) single-char code
    tiebreaker: string, // unknown (to me) single-char code
    calendarEventID: string,
    season: string, // year as string (i suppose it might not always be the year)
    seasonDisplay: string, // display name of the season (generally the same)
    gameNumber: number, // int
}

// player

export interface Player extends IdentifiableObject {
    fullName: string,
    firstName: string,
    middleName: string,
    lastName: string,
    useName: string, // preferred name?
    boxscoreName: string,
    gender: string, // i assume the MLB isn't based and this is just M or F
    primaryNumber: string, // this is a string i think because of zero padding?
    birthDate: string, // YYYY-MM-DD
    currentAge: number, // int
    birthCity: string,
    birthStateProvince: string,
    birthCountry: string,
    height: string, // X' X"
    weight: number, // int
    active: boolean,
    primaryPosition: PrimaryPosition,
    isPlayer: boolean,
    isVerified: boolean,
    draftYear: number,
    mlbDebutDate: string, // YYYY-MM-DD
    batSide: Side,
    pitchHand: Side,
    nameSlug: string,
    nameFirstLast: string,
    firstLastName: string,
    lastFirstName: string,
    lastInitName: string,
    initLastName: string,
    fullFMLName: string,
    fullLFMName: string,
    strikeZoneTop: number, // float
    strikeZoneBottom: number, // float
}

export interface PrimaryPosition {
    code: string,
    name: string,
    type: string,
    abbreviation: string,
}

export interface Side {
    description: string,
    code: string, // first character of the above
}

// team

export interface Team extends NameableObject {
    springLeague: SpringLeague,
    allStarStatus: string, // i think N or Y
    season: number, // int; year
    venue: NameableObject,
    springVenue: IdentifiableObject,
    teamCode: string,
    fileCode: string,
    abbreviation: string, // team abbreviation
    teamName: string, // team short name
    locationName: string,
    firstYearOfPlay: string, // YYYY
    league: NameableObject,
    division: NameableObject,
    sport: NameableObject,
    shortName: string,
    franchiseName: string,
    clubName: string,
    active: boolean,
}

export interface SpringLeague extends NameableObject {
    abbreviation: string,
}

// venue

export interface Venue extends NameableObject {
    location: Location,
    timeZone: TimeZone,
    fieldInfo: FieldInfo,
    active: boolean,
}

export interface Location {
    address1: string,
    city: string,
    state: string,
    stateAbbrev: string,
    postalCode: string, // int as a string?
    defaultCoordinates: LatLong,
    country: string,
    phone: string, // (XXX) XXX-XXXX
}

export interface LatLong {
    latitude: number, // float
    longitude: number, // float
}

export interface TimeZone {
    id: string, // timezone id a la America/New_York
    offset: number, // int; UTC offset
    tz: string, // timezone code a la EDT
}

export interface FieldInfo {
    capacity: number,
    turfType: string, // can be 'Grass' and idk what else
    roofType: string, // presumably 'Open' or 'Closed'
    leftLine: number, // int
    left: number, // int
    leftCenter: number, // int
    center: number, // int
    rightCenter: number, // int
    right: number, // int
    rightLine: number, // int
}

// misc

export interface Weather {
    condition: string,
    temp: string, // int; temp in fahrenheit
    wind: string,
}

export interface GameInfo {
    firstPitch: string, // UTC instant
}

export interface Review {
    hasChallenges: boolean,
    away: TeamChallenges,
    home: TeamChallenges,
}

export interface TeamChallenges {
    used: number,
    remaining: number,
}

export interface Flags {
    noHitter: boolean,
    perfectGame: boolean,
    awayTeamNoHitter: boolean,
    awayTeamPerfectGame: boolean,
    homeTeamNoHitter: boolean,
    homeTeamPerfectGame: boolean,
}

export interface Alert {
    // TODO: dunno what this is
}

export interface ProbablePitchers {
    away: NameableObject,
    home: NameableObject,
}

// schedule

export interface Schedule extends RootResponse {
    totalItems: number, // int
    totalEvents: number, // int
    totalGames: number, // int
    totalGamesInProgress: number, // int
    dates: ScheduleDate[],
}

export interface ScheduleDate {
    date: string, // YYYY-MM-DD
    totalItems: number, // int
    totalEvents: number, // int
    totalGames: number, // int
    totalGamesInProgress: number, // int
    games: ScheduleGame[],
    events: ScheduleEvent[],
}

export interface ScheduleGame extends PartialDateTime, Game {
    gamePk: number, // int
    link: string,
    gameType: string,
    status: GameStatus,
    teams: ScheduleTeams,
    venue: NameableObject,
    content: GameContent,
    publicFacing: boolean,
    description: string, // display name of the game (i.e. 'World Series Game 1')
    scheduledInnings: number, // int
    reverseHomeAwayStatus: boolean,
    inningBreakLength: number, // int (seconds?)
    gamesInSeries: number, // int; best of <this variable>
    seriesGameNumber: number, // int
    seriesDescription: string, // display name of the series (i.e. 'World Series')
    recordSource: string, // unknown (to me) single-char code
    ifNecessary: string, // unknown (to me) single-char code
    ifNecessaryDescription: string, // full string of whatever the above is
}

export interface ScheduleEvent {
    // idk what this is
}

export interface ScheduleTeams {
    away: ScheduleTeam,
    home: ScheduleTeam,
}

export interface ScheduleTeam {
    splitSquad: boolean,
    seriesNumber: number, // int
    score: number, // int; current game score
    team: NameableObject,
    leagueRecord: LeagueRecord,
}

export interface GameContent {
    link: string,
}

// live

export interface LiveData extends RootResponse {
    gamePk: number, // int
    link: string,
    metaData: LiveMetaData,
    gameData: LiveGameData,
    liveData: LiveMatchData,
}

export interface LiveMetaData {
    wait: number,
    timeStamp: string, // YYYYMMDD_hhmmss
    gameEvents: string[], // describes the most recent action from the batter?
    logicalEvents: string[], // describes the state of play (current count and inning status)
}

export interface LiveGameData {
    game: LiveGame,
    datetime: GameDateTime,
    status: GameStatus,
    teams: LiveTeams,
    players: Map<string, Player>, // keys are of the format "IDXXXXXX" where XXXXXX is the player's ID
    venue: Venue,
    officialVenue: IdentifiableObject,
    weather: Weather,
    gameInfo: GameInfo,
    review: Review,
    flags: Flags,
    alerts: Alert[],
    probablePitchers: ProbablePitchers,
    officialScorer: NameableObject,
    primaryDatacaster: NameableObject,
}

export interface LiveGame {
    pk: number, // int
    type: string, // unknown (to me) single-char code
    doubleHeader: string, // unknown (to me) single-char code
    id: string,
    gamedayType: string, // unknown (to me) single-char code
}

export interface GameDateTime extends PartialDateTime {
    originalDate: string, // date of the event as YYYY-MM-DD
    time: string, // h:mm; local tz?
    ampm: string, // AM or PM
}

export interface LiveTeams {
    away: LiveTeam,
    home: LiveTeam,
}

export interface LiveTeam extends Team {
    record: LiveRecord,
}

export interface LiveRecord extends Record {
    gamesPlayed: number,
    wildCardGamesBack: string,
    leagueGamesBack: string,
    springLeagueGamesBack: string,
    sportGamesBack: string,
    divisionGamesBack: string,
    conferenceGamesBack: string,
    leagueRecord: FullLeagueRecord,
    records: Records,
    divisionLeader: boolean,
    winningPercentage: string, // percent of games won as a 0-1 float as a string
}

export interface Records {
    // TODO: idk what this is, it's empty
}

export interface LiveMatchData {
    plays: LivePlays,
    linescore: LiveLineScore,
    boxscore: LiveBoxScore,
    leaders: LiveLeaders,
}

export interface LivePlays {
    // TODO
}

export interface LiveLineScore {
    currentInning: number, // int
    currentInningOrdinal: string, // above as an ordinal, i.e. "1st"
    inningState: string, // "Top", "Middle", "Bottom"
    inningHalf: string, // "Top", "Bottom"
    scheduledInnings: number,
    innings: Inning[],
}

export interface Inning {
    num: number,
}

export interface InningTeam {

}

export interface LiveLeaders {
    hitDistance: any, // dunno
    hitSpeed: any, // dunno
    pitchSpeed: any, // dunno
}