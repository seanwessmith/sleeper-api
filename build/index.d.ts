import { AxiosInstance } from "axios";
export interface User {
    username: string;
    user_id: string;
    display_name: string;
    avatar: string;
}
export declare const getAvatarUrl: (avatar_id: string, thumbnail?: boolean) => string;
export interface League {
    total_rosters: number;
    status: "pre_draft" | "drafting" | "in_season" | "complete";
    sport: string;
    settings: any;
    season_type: string;
    season: string;
    scoring_settings: any;
    roster_positions: string[];
    previous_league_id: string;
    name: string;
    league_id: string;
    draft_id: string;
    avatar: string;
}
export interface Roster {
    starters: string[];
    settings: any;
    roster_id: number;
    reserve: string[];
    players: string[];
    owner_id: string;
    league_id: string;
}
export interface Matchup {
    starters: string[];
    roster_id: number;
    players: string[];
    matchup_id: number;
    points: number;
    custom_points: number | null;
}
export interface BracketMatchup {
    r: number;
    m: number;
    t1: number | {
        w: number;
    };
    t2: number | {
        l: number;
    };
    w: number | null;
    l: number | null;
    t1_from?: object;
    t2_from?: object;
    p?: number;
}
export interface Transaction {
    type: string;
    transaction_id: string;
    status_updated: number;
    status: string;
    settings: any;
    roster_ids: number[];
    metadata: any;
    leg: number;
    drops: any;
    draft_picks: DraftPick[];
    creator: string;
    created: number;
    consenter_ids: number[];
    adds: any;
    waiver_budget: any[];
}
export interface DraftPick {
    season: string;
    round: number;
    roster_id: number;
    previous_owner_id: number;
    owner_id: number;
}
export interface State {
    week: number;
    season_type: string;
    season_start_date: string;
    season: string;
    previous_season: string;
    leg: number;
    league_season: string;
    league_create_season: string;
    display_week: number;
}
export interface Draft {
    type: string;
    status: string;
    start_time: number;
    sport: string;
    settings: any;
    season_type: string;
    season: string;
    metadata: any;
    league_id: string;
    last_picked: number;
    last_message_time: number;
    last_message_id: string;
    draft_order: {
        [userId: string]: number;
    } | null;
    slot_to_roster_id?: {
        [slot: string]: number;
    };
    draft_id: string;
    creators: any;
    created: number;
}
export interface Pick {
    player_id: string;
    picked_by: string;
    roster_id: string;
    round: number;
    draft_slot: number;
    pick_no: number;
    metadata: any;
    is_keeper: boolean | null;
    draft_id: string;
}
export interface Player {
    hashtag: string;
    depth_chart_position: number;
    status: string;
    sport: string;
    fantasy_positions: string[];
    number: number;
    search_last_name: string;
    injury_start_date: string | null;
    weight: string;
    position: string;
    practice_participation: string | null;
    sportradar_id: string;
    team: string;
    last_name: string;
    college: string;
    fantasy_data_id: number;
    injury_status: string | null;
    player_id: string;
    height: string;
    search_full_name: string;
    age: number;
    stats_id: string;
    birth_country: string;
    espn_id: string;
    search_rank: number;
    first_name: string;
    depth_chart_order: number;
    years_exp: number;
    rotowire_id: string | null;
    rotoworld_id: number;
    search_first_name: string;
    yahoo_id: string | null;
}
export interface TrendingPlayer {
    player_id: string;
    count: number;
}
export declare class SleeperAPI {
    private axiosInstance;
    private readonly BASE_URL;
    constructor(axiosInstance?: AxiosInstance);
    /**
     * Fetch a user by username.
     * @param username - The username of the user.
     * @returns Promise<User>
     */
    getUserByUsername(username: string): Promise<User>;
    /**
     * Fetch a user by user ID.
     * @param userId - The ID of the user.
     * @returns Promise<User>
     */
    getUserById(userId: string): Promise<User>;
    /**
     * Get all leagues for a user.
     * @param userId - The user ID.
     * @param sport - The sport (e.g., 'nfl').
     * @param season - The season year (e.g., '2018').
     * @returns Promise<League[]>
     */
    getLeaguesForUser(userId: string, sport: string | undefined, season: string): Promise<League[]>;
    /**
     * Get a specific league by league ID.
     * @param leagueId - The ID of the league.
     * @returns Promise<League>
     */
    getLeague(leagueId: string): Promise<League>;
    /**
     * Get all rosters in a league.
     * @param leagueId - The ID of the league.
     * @returns Promise<Roster[]>
     */
    getRosters(leagueId: string): Promise<Roster[]>;
    /**
     * Get all users in a league.
     * @param leagueId - The ID of the league.
     * @returns Promise<User[]>
     */
    getUsersInLeague(leagueId: string): Promise<User[]>;
    /**
     * Get all matchups in a league for a given week.
     * @param leagueId - The ID of the league.
     * @param week - The week number.
     * @returns Promise<Matchup[]>
     */
    getMatchups(leagueId: string, week: number): Promise<Matchup[]>;
    /**
     * Get the winners bracket for a league.
     * @param leagueId - The ID of the league.
     * @returns Promise<BracketMatchup[]>
     */
    getWinnersBracket(leagueId: string): Promise<BracketMatchup[]>;
    /**
     * Get the losers bracket for a league.
     * @param leagueId - The ID of the league.
     * @returns Promise<BracketMatchup[]>
     */
    getLosersBracket(leagueId: string): Promise<BracketMatchup[]>;
    /**
     * Get all transactions in a league for a specific round.
     * @param leagueId - The ID of the league.
     * @param round - The round number.
     * @returns Promise<Transaction[]>
     */
    getTransactions(leagueId: string, round: number): Promise<Transaction[]>;
    /**
     * Get all traded picks in a league.
     * @param leagueId - The ID of the league.
     * @returns Promise<DraftPick[]>
     */
    getTradedPicks(leagueId: string): Promise<DraftPick[]>;
    /**
     * Get the current state of a sport.
     * @param sport - The sport (e.g., 'nfl').
     * @returns Promise<State>
     */
    getState(sport: string): Promise<State>;
    /**
     * Get all drafts for a user.
     * @param userId - The user ID.
     * @param sport - The sport (e.g., 'nfl').
     * @param season - The season year (e.g., '2018').
     * @returns Promise<Draft[]>
     */
    getDraftsForUser(userId: string, sport: string | undefined, season: string): Promise<Draft[]>;
    /**
     * Get all drafts for a league.
     * @param leagueId - The ID of the league.
     * @returns Promise<Draft[]>
     */
    getDraftsForLeague(leagueId: string): Promise<Draft[]>;
    /**
     * Get a specific draft by draft ID.
     * @param draftId - The ID of the draft.
     * @returns Promise<Draft>
     */
    getDraft(draftId: string): Promise<Draft>;
    /**
     * Get all picks in a draft.
     * @param draftId - The ID of the draft.
     * @returns Promise<Pick[]>
     */
    getPicksInDraft(draftId: string): Promise<Pick[]>;
    /**
     * Get all traded picks in a draft.
     * @param draftId - The ID of the draft.
     * @returns Promise<DraftPick[]>
     */
    getTradedPicksInDraft(draftId: string): Promise<DraftPick[]>;
    /**
     * Fetch all players for a sport.
     * @param sport - The sport (e.g., 'nfl').
     * @returns Promise<{ [playerId: string]: Player }>
     */
    getAllPlayers(sport?: string): Promise<{
        [playerId: string]: Player;
    }>;
    /**
     * Get trending players based on activity.
     * @param sport - The sport (e.g., 'nfl').
     * @param type - 'add' or 'drop'.
     * @param lookbackHours - Number of hours to look back (optional, default 24).
     * @param limit - Number of results to return (optional, default 25).
     * @returns Promise<TrendingPlayer[]>
     */
    getTrendingPlayers(sport: string, type: "add" | "drop", lookbackHours?: number, limit?: number): Promise<TrendingPlayer[]>;
    /**
     * Handle errors from API requests.
     * @param error - The error object.
     */
    private handleError;
}
export default SleeperAPI;
