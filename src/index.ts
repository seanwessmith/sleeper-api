import axios, { AxiosInstance, AxiosResponse } from "axios";
import { fetch } from 'bun';

// Define Interfaces for the API responses

// User Interface
export interface User {
  username: string;
  user_id: string;
  display_name: string;
  avatar: string;
}

// Avatar URLs
export const getAvatarUrl = (
  avatar_id: string,
  thumbnail: boolean = false
): string => {
  const base = "https://sleepercdn.com/avatars";
  return thumbnail ? `${base}/thumbs/${avatar_id}` : `${base}/${avatar_id}`;
};

// League Interface
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

// Roster Interface
export interface Roster {
  starters: string[];
  settings: any;
  roster_id: number;
  reserve: string[];
  players: string[];
  owner_id: string;
  league_id: string;
}

// Matchup Interface
export interface Matchup {
  starters: string[];
  roster_id: number;
  players: string[];
  matchup_id: number;
  points: number;
  custom_points: number | null;
}

// Bracket Matchup Interface
export interface BracketMatchup {
  r: number;
  m: number;
  t1: number | { w: number };
  t2: number | { l: number };
  w: number | null;
  l: number | null;
  t1_from?: object;
  t2_from?: object;
  p?: number;
}

// Transaction Interfaces
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

// State Interface
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

// Draft Interfaces
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
  draft_order: { [userId: string]: number } | null;
  slot_to_roster_id?: { [slot: string]: number };
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

// Player Interface
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

// Trending Player Interface
export interface TrendingPlayer {
  player_id: string;
  count: number;
}

export class SleeperAPI {
  private axiosInstance: AxiosInstance;
  private readonly BASE_URL: string = "https://api.sleeper.app/v1";

  constructor(axiosInstance?: AxiosInstance) {
    this.axiosInstance =
      axiosInstance ||
      axios.create({
        baseURL: this.BASE_URL,
        timeout: 10000, // 10 seconds timeout
      });
  }

  // User Methods

  /**
   * Fetch a user by username.
   * @param username - The username of the user.
   * @returns Promise<User>
   */
  public async getUserByUsername(username: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.axiosInstance.get(
        `/user/${username}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Fetch a user by user ID.
   * @param userId - The ID of the user.
   * @returns Promise<User>
   */
  public async getUserById(userId: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.axiosInstance.get(
        `/user/${userId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // League Methods

  /**
   * Get all leagues for a user.
   * @param userId - The user ID.
   * @param sport - The sport (e.g., 'nfl').
   * @param season - The season year (e.g., '2018').
   * @returns Promise<League[]>
   */
  public async getLeaguesForUser(
    userId: string,
    sport: string = "nfl",
    season: string
  ): Promise<League[]> {
    try {
      const response: AxiosResponse<League[]> = await this.axiosInstance.get(
        `/user/${userId}/leagues/${sport}/${season}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get a specific league by league ID.
   * @param leagueId - The ID of the league.
   * @returns Promise<League>
   */
  public async getLeague(leagueId: string): Promise<League> {
    try {
      const response: AxiosResponse<League> = await this.axiosInstance.get(
        `/league/${leagueId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all rosters in a league.
   * @param leagueId - The ID of the league.
   * @returns Promise<Roster[]>
   */
  public async getRosters(leagueId: string): Promise<Roster[]> {
    try {
      const response: AxiosResponse<Roster[]> = await this.axiosInstance.get(
        `/league/${leagueId}/rosters`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all users in a league.
   * @param leagueId - The ID of the league.
   * @returns Promise<User[]>
   */
  public async getUsersInLeague(leagueId: string): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await this.axiosInstance.get(
        `/league/${leagueId}/users`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all matchups in a league for a given week.
   * @param leagueId - The ID of the league.
   * @param week - The week number.
   * @returns Promise<Matchup[]>
   */
  public async getMatchups(leagueId: string, week: number): Promise<Matchup[]> {
    try {
      const response: AxiosResponse<Matchup[]> = await this.axiosInstance.get(
        `/league/${leagueId}/matchups/${week}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get the winners bracket for a league.
   * @param leagueId - The ID of the league.
   * @returns Promise<BracketMatchup[]>
   */
  public async getWinnersBracket(leagueId: string): Promise<BracketMatchup[]> {
    try {
      const response: AxiosResponse<BracketMatchup[]> =
        await this.axiosInstance.get(`/league/${leagueId}/winners_bracket`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get the losers bracket for a league.
   * @param leagueId - The ID of the league.
   * @returns Promise<BracketMatchup[]>
   */
  public async getLosersBracket(leagueId: string): Promise<BracketMatchup[]> {
    try {
      const response: AxiosResponse<BracketMatchup[]> =
        await this.axiosInstance.get(`/league/${leagueId}/losers_bracket`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all transactions in a league for a specific round.
   * @param leagueId - The ID of the league.
   * @param round - The round number.
   * @returns Promise<Transaction[]>
   */
  public async getTransactions(
    leagueId: string,
    round: number
  ): Promise<Transaction[]> {
    try {
      const response: AxiosResponse<Transaction[]> =
        await this.axiosInstance.get(
          `/league/${leagueId}/transactions/${round}`
        );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all traded picks in a league.
   * @param leagueId - The ID of the league.
   * @returns Promise<DraftPick[]>
   */
  public async getTradedPicks(leagueId: string): Promise<DraftPick[]> {
    try {
      const response: AxiosResponse<DraftPick[]> = await this.axiosInstance.get(
        `/league/${leagueId}/traded_picks`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // State Methods

  /**
   * Get the current state of a sport.
   * @param sport - The sport (e.g., 'nfl').
   * @returns Promise<State>
   */
  public async getState(sport: string): Promise<State> {
    try {
      const response: AxiosResponse<State> = await this.axiosInstance.get(
        `/state/${sport}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Draft Methods

  /**
   * Get all drafts for a user.
   * @param userId - The user ID.
   * @param sport - The sport (e.g., 'nfl').
   * @param season - The season year (e.g., '2018').
   * @returns Promise<Draft[]>
   */
  public async getDraftsForUser(
    userId: string,
    sport: string = "nfl",
    season: string
  ): Promise<Draft[]> {
    try {
      const response: AxiosResponse<Draft[]> = await this.axiosInstance.get(
        `/user/${userId}/drafts/${sport}/${season}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all drafts for a league.
   * @param leagueId - The ID of the league.
   * @returns Promise<Draft[]>
   */
  public async getDraftsForLeague(leagueId: string): Promise<Draft[]> {
    try {
      const response: AxiosResponse<Draft[]> = await this.axiosInstance.get(
        `/league/${leagueId}/drafts`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get a specific draft by draft ID.
   * @param draftId - The ID of the draft.
   * @returns Promise<Draft>
   */
  public async getDraft(draftId: string): Promise<Draft> {
    try {
      const response: AxiosResponse<Draft> = await this.axiosInstance.get(
        `/draft/${draftId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all picks in a draft.
   * @param draftId - The ID of the draft.
   * @returns Promise<Pick[]>
   */
  public async getPicksInDraft(draftId: string): Promise<Pick[]> {
    try {
      const response: AxiosResponse<Pick[]> = await this.axiosInstance.get(
        `/draft/${draftId}/picks`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all traded picks in a draft.
   * @param draftId - The ID of the draft.
   * @returns Promise<DraftPick[]>
   */
  public async getTradedPicksInDraft(draftId: string): Promise<DraftPick[]> {
    try {
      const response: AxiosResponse<DraftPick[]> = await this.axiosInstance.get(
        `/draft/${draftId}/traded_picks`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Player Methods

  /**
   * Fetch all players for a sport.
   * @param sport - The sport (e.g., 'nfl').
   * @returns Promise<{ [playerId: string]: Player }>
   */
  public async getAllPlayers(
    sport: string = "nfl"
  ): Promise<{ [playerId: string]: Player }> {
    try {
      const response: AxiosResponse<{ [playerId: string]: Player }> =
        await this.axiosInstance.get(`/players/${sport}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get trending players based on activity.
   * @param sport - The sport (e.g., 'nfl').
   * @param type - 'add' or 'drop'.
   * @param lookbackHours - Number of hours to look back (optional, default 24).
   * @param limit - Number of results to return (optional, default 25).
   * @returns Promise<TrendingPlayer[]>
   */
  public async getTrendingPlayers(
    sport: string,
    type: "add" | "drop",
    lookbackHours: number = 24,
    limit: number = 25
  ): Promise<TrendingPlayer[]> {
    try {
      const response: AxiosResponse<TrendingPlayer[]> =
        await this.axiosInstance.get(`/players/${sport}/trending/${type}`, {
          params: {
            lookback_hours: lookbackHours,
            limit: limit,
          },
        });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Helper Methods

  /**
   * Handle errors from API requests.
   * @param error - The error object.
   */
  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 400:
            throw new Error("Bad Request: Your request is invalid.");
          case 404:
            throw new Error(
              "Not Found: The requested resource could not be found."
            );
          case 429:
            throw new Error("Too Many Requests: You are being rate limited.");
          case 500:
            throw new Error("Internal Server Error: Problem with the server.");
          case 503:
            throw new Error(
              "Service Unavailable: The service is temporarily offline."
            );
          default:
            throw new Error(`Unexpected Error: ${status}`);
        }
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(`Axios Error: ${error.message}`);
      }
    } else {
      throw new Error(`Unexpected Error: ${error.message}`);
    }
  }
}

export default SleeperAPI;
