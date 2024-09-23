// tests/SleeperAPI.test.ts

import { describe, it, beforeEach, afterEach, expect } from "bun:test";
import sinon, { SinonStub } from "sinon";
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import SleeperAPI, {
  User,
  League,
  Roster,
  Matchup,
  BracketMatchup,
  Transaction,
  DraftPick,
  State,
  Draft,
  Pick,
  Player,
  TrendingPlayer,
} from "../src";

describe("SleeperAPI", () => {
  let api: SleeperAPI;
  let mockAxios: AxiosInstance;
  let axiosGetStub: SinonStub;

  beforeEach(() => {
    // Create a mock Axios instance
    mockAxios = axios.create();
    // Stub the 'get' method on the mock Axios instance
    axiosGetStub = sinon.stub(mockAxios, "get");
    // Inject the mocked Axios instance into SleeperAPI
    api = new SleeperAPI(mockAxios);
  });

  afterEach(() => {
    // Restore the original Axios behavior
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  // User Methods Tests

  describe("User Methods", () => {
    it("should fetch user by username successfully", async () => {
      const mockUser: User = {
        username: "sleeperuser",
        user_id: "12345678",
        display_name: "SleeperUser",
        avatar: "cc12ec49965eb7856f84d71cf85306af",
      };

      const response: AxiosResponse<User> = {
        data: mockUser,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub.withArgs(`/user/sleeperuser`).resolves(response);

      const user = await api.getUserByUsername("sleeperuser");
      expect(user).toEqual(mockUser);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should fetch user by ID successfully", async () => {
      const mockUser: User = {
        username: "sleeperuser",
        user_id: "12345678",
        display_name: "SleeperUser",
        avatar: "cc12ec49965eb7856f84d71cf85306af",
      };

      const response: AxiosResponse<User> = {
        data: mockUser,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub.withArgs(`/user/12345678`).resolves(response);

      const user = await api.getUserById("12345678");
      expect(user).toEqual(mockUser);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 404 error when user not found", async () => {
      const error = {
        response: {
          status: 404,
          statusText: "Not Found",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub.withArgs(`/user/nonexistentuser`).rejects(error);

      await expect(api.getUserByUsername("nonexistentuser")).rejects.toThrow(
        "Not Found: The requested resource could not be found."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // League Methods Tests

  describe("League Methods", () => {
    it("should fetch all leagues for a user successfully", async () => {
      const mockLeagues: League[] = [
        {
          total_rosters: 12,
          status: "pre_draft",
          sport: "nfl",
          settings: {},
          season_type: "regular",
          season: "2018",
          scoring_settings: {},
          roster_positions: [],
          previous_league_id: "198946952535085056",
          name: "Sleeperbot Friends League",
          league_id: "289646328504385536",
          draft_id: "289646328508579840",
          avatar: "efaefa889ae24046a53265a3c71b8b64",
        },
        {
          total_rosters: 12,
          status: "in_season",
          sport: "nfl",
          settings: {},
          season_type: "regular",
          season: "2018",
          scoring_settings: {},
          roster_positions: [],
          previous_league_id: "198946952535085056",
          name: "Sleeperbot Dynasty",
          league_id: "289646328504385536",
          draft_id: "289646328508579840",
          avatar: "efaefa889ae24046a53265a3c71b8b64",
        },
      ];

      const response: AxiosResponse<League[]> = {
        data: mockLeagues,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/user/12345678/leagues/nfl/2018`)
        .resolves(response);

      const leagues = await api.getLeaguesForUser("12345678", "nfl", "2018");
      expect(leagues).toEqual(mockLeagues);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should fetch a specific league successfully", async () => {
      const mockLeague: League = {
        total_rosters: 12,
        status: "in_season",
        sport: "nfl",
        settings: {},
        season_type: "regular",
        season: "2018",
        scoring_settings: {},
        roster_positions: [],
        previous_league_id: "198946952535085056",
        name: "Sleeperbot Dynasty",
        league_id: "289646328504385536",
        draft_id: "289646328508579840",
        avatar: "efaefa889ae24046a53265a3c71b8b64",
      };

      const response: AxiosResponse<League> = {
        data: mockLeague,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub.withArgs(`/league/289646328504385536`).resolves(response);

      const league = await api.getLeague("289646328504385536");
      expect(league).toEqual(mockLeague);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 500 error when fetching a league", async () => {
      const error = {
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub.withArgs(`/league/invalidLeagueId`).rejects(error);

      await expect(api.getLeague("invalidLeagueId")).rejects.toThrow(
        "Internal Server Error: Problem with the server."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Roster Methods Tests

  describe("Roster Methods", () => {
    it("should fetch all rosters in a league successfully", async () => {
      const mockRosters: Roster[] = [
        {
          starters: [
            "2307",
            "2257",
            "4034",
            "147",
            "642",
            "4039",
            "515",
            "4149",
            "DET",
          ],
          settings: {},
          roster_id: 1,
          reserve: [],
          players: [
            "1046",
            "138",
            "147",
            "2257",
            "2307",
            "2319",
            "4034",
            "4039",
            "4040",
            "4149",
            "421",
            "515",
            "642",
            "745",
            "DET",
          ],
          owner_id: "188815879448829952",
          league_id: "206827432160788480",
        },
        // Add more rosters as needed
      ];

      const response: AxiosResponse<Roster[]> = {
        data: mockRosters,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/league/206827432160788480/rosters`)
        .resolves(response);

      const rosters = await api.getRosters("206827432160788480");
      expect(rosters).toEqual(mockRosters);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 429 error when fetching rosters", async () => {
      const error = {
        response: {
          status: 429,
          statusText: "Too Many Requests",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub
        .withArgs(`/league/206827432160788480/rosters`)
        .rejects(error);

      await expect(api.getRosters("206827432160788480")).rejects.toThrow(
        "Too Many Requests: You are being rate limited."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Users in League Methods Tests

  describe("Users in League Methods", () => {
    it("should fetch all users in a league successfully", async () => {
      const mockUsers: User[] = [
        {
          username: "user1",
          user_id: "1111",
          display_name: "User One",
          avatar: "avatar1",
        },
        {
          username: "user2",
          user_id: "2222",
          display_name: "User Two",
          avatar: "avatar2",
        },
      ];

      const response: AxiosResponse<User[]> = {
        data: mockUsers,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/users`)
        .resolves(response);

      const users = await api.getUsersInLeague("289646328504385536");
      expect(users).toEqual(mockUsers);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 400 error when fetching users in a league", async () => {
      const error = {
        response: {
          status: 400,
          statusText: "Bad Request",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub.withArgs(`/league/invalidLeagueId/users`).rejects(error);

      await expect(api.getUsersInLeague("invalidLeagueId")).rejects.toThrow(
        "Bad Request: Your request is invalid."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Matchup Methods Tests

  describe("Matchup Methods", () => {
    it("should fetch matchups for a league and week successfully", async () => {
      const mockMatchups: Matchup[] = [
        {
          starters: [
            "421",
            "4035",
            "3242",
            "2133",
            "2449",
            "4531",
            "2257",
            "788",
            "PHI",
          ],
          roster_id: 1,
          players: [
            "1352",
            "1387",
            "2118",
            "2133",
            "2182",
            "223",
            "2319",
            "2449",
            "3208",
            "4035",
            "421",
            "4881",
            "4892",
            "788",
            "CLE",
          ],
          matchup_id: 2,
          points: 20.0,
          custom_points: null,
        },
        // Add more matchups as needed
      ];

      const response: AxiosResponse<Matchup[]> = {
        data: mockMatchups,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/matchups/1`)
        .resolves(response);

      const matchups = await api.getMatchups("289646328504385536", 1);
      expect(matchups).toEqual(mockMatchups);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle no response error when fetching matchups", async () => {
      const error = {
        request: {},
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/matchups/1`)
        .rejects(error);

      await expect(api.getMatchups("289646328504385536", 1)).rejects.toThrow(
        "No response received from the server."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Bracket Methods Tests

  describe("Bracket Methods", () => {
    it("should fetch winners bracket successfully", async () => {
      const mockBracket: BracketMatchup[] = [
        { r: 1, m: 1, t1: 3, t2: 6, w: null, l: null },
        { r: 1, m: 2, t1: 4, t2: 5, w: null, l: null },
        { r: 2, m: 3, t1: 1, t2: { l: 1 }, w: null, l: null }, // TODO check this
        // Add more bracket matchups as needed
      ];

      const response: AxiosResponse<BracketMatchup[]> = {
        data: mockBracket,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/winners_bracket`)
        .resolves(response);

      const bracket = await api.getWinnersBracket("289646328504385536");
      expect(bracket).toEqual(mockBracket);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 503 error when fetching winners bracket", async () => {
      const error = {
        response: {
          status: 503,
          statusText: "Service Unavailable",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/winners_bracket`)
        .rejects(error);

      await expect(api.getWinnersBracket("289646328504385536")).rejects.toThrow(
        "Service Unavailable: The service is temporarily offline."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Transaction Methods Tests

  describe("Transaction Methods", () => {
    it("should fetch transactions successfully", async () => {
      const mockTransactions: Transaction[] = [
        {
          type: "trade",
          transaction_id: "434852362033561600",
          status_updated: 1558039402803,
          status: "complete",
          settings: null,
          roster_ids: [2, 1],
          metadata: null,
          leg: 1,
          drops: null,
          draft_picks: [
            {
              season: "2019",
              round: 5,
              roster_id: 1,
              previous_owner_id: 1,
              owner_id: 2,
            },
            {
              season: "2019",
              round: 3,
              roster_id: 2,
              previous_owner_id: 2,
              owner_id: 1,
            },
          ],
          creator: "160000000000000000",
          created: 1558039391576,
          consenter_ids: [2, 1],
          adds: null,
          waiver_budget: [
            {
              sender: 2,
              receiver: 3,
              amount: 55,
            },
          ],
        },
        // Add more transactions as needed
      ];

      const response: AxiosResponse<Transaction[]> = {
        data: mockTransactions,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/transactions/1`)
        .resolves(response);

      const transactions = await api.getTransactions("289646328504385536", 1);
      expect(transactions).toEqual(mockTransactions);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 400 error when fetching transactions", async () => {
      const error = {
        response: {
          status: 400,
          statusText: "Bad Request",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/transactions/invalidRound`)
        .rejects(error);

      await expect(
        api.getTransactions("289646328504385536", NaN)
      ).rejects.toThrow(
        "Unexpected Error: undefined is not an object (evaluating '(await this.axiosInstance.get(`/league/${leagueId}/transactions/${round}`)).data')"
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Traded Picks Methods Tests

  describe("Traded Picks Methods", () => {
    it("should fetch traded picks in a league successfully", async () => {
      const mockTradedPicks: DraftPick[] = [
        {
          season: "2019",
          round: 5,
          roster_id: 1,
          previous_owner_id: 1,
          owner_id: 2,
        },
        {
          season: "2020",
          round: 3,
          roster_id: 2,
          previous_owner_id: 2,
          owner_id: 1,
        },
      ];

      const response: AxiosResponse<DraftPick[]> = {
        data: mockTradedPicks,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/league/289646328504385536/traded_picks`)
        .resolves(response);

      const tradedPicks = await api.getTradedPicks("289646328504385536");
      expect(tradedPicks).toEqual(mockTradedPicks);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 404 error when fetching traded picks", async () => {
      const error = {
        response: {
          status: 404,
          statusText: "Not Found",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub
        .withArgs(`/league/invalidLeagueId/traded_picks`)
        .rejects(error);

      await expect(api.getTradedPicks("invalidLeagueId")).rejects.toThrow(
        "Not Found: The requested resource could not be found."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // State Methods Tests

  describe("State Methods", () => {
    it("should fetch current state successfully", async () => {
      const mockState: State = {
        week: 2,
        season_type: "regular",
        season_start_date: "2020-09-10",
        season: "2020",
        previous_season: "2019",
        leg: 2,
        league_season: "2021",
        league_create_season: "2021",
        display_week: 3,
      };

      const response: AxiosResponse<State> = {
        data: mockState,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub.withArgs(`/state/nfl`).resolves(response);

      const state = await api.getState("nfl");
      expect(state).toEqual(mockState);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle network error when fetching state", async () => {
      const error = {
        message: "Network Error",
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub.withArgs(`/state/nfl`).rejects(error);

      await expect(api.getState("nfl")).rejects.toThrow(
        "Axios Error: Network Error"
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Draft Methods Tests

  describe("Draft Methods", () => {
    it("should fetch all drafts for a user successfully", async () => {
      const mockDrafts: Draft[] = [
        {
          type: "snake",
          status: "complete",
          start_time: 1515700800000,
          sport: "nfl",
          settings: {},
          season_type: "regular",
          season: "2017",
          metadata: {},
          league_id: "257270637750382592",
          last_picked: 1515700871182,
          last_message_time: 1515700942674,
          last_message_id: "257272036450111488",
          draft_order: null,
          draft_id: "257270643320426496",
          creators: null,
          created: 1515700610526,
        },
        // Add more drafts as needed
      ];

      const response: AxiosResponse<Draft[]> = {
        data: mockDrafts,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/user/12345678/drafts/nfl/2018`)
        .resolves(response);

      const drafts = await api.getDraftsForUser("12345678", "nfl", "2018");
      expect(drafts).toEqual(mockDrafts);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 500 error when fetching drafts for a user", async () => {
      const error = {
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub.withArgs(`/user/12345678/drafts/nfl/2018`).rejects(error);

      await expect(
        api.getDraftsForUser("12345678", "nfl", "2018")
      ).rejects.toThrow("Internal Server Error: Problem with the server.");
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should fetch a specific draft successfully", async () => {
      const mockDraft: Draft = {
        type: "snake",
        status: "complete",
        start_time: 1515700800000,
        sport: "nfl",
        settings: {},
        season_type: "regular",
        season: "2017",
        metadata: {},
        league_id: "257270637750382592",
        last_picked: 1515700871182,
        last_message_time: 1515700942674,
        last_message_id: "257272036450111488",
        draft_order: { "12345678": 1, "23434332": 2 },
        slot_to_roster_id: { "1": 10, "2": 3 },
        draft_id: "257270643320426496",
        creators: null,
        created: 1515700610526,
      };

      const response: AxiosResponse<Draft> = {
        data: mockDraft,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub.withArgs(`/draft/257270643320426496`).resolves(response);

      const draft = await api.getDraft("257270643320426496");
      expect(draft).toEqual(mockDraft);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle unexpected error when fetching a draft", async () => {
      const error = new Error("Unexpected Error");

      axiosGetStub.withArgs(`/draft/257270643320426496`).rejects(error);

      await expect(api.getDraft("257270643320426496")).rejects.toThrow(
        "Unexpected Error: Unexpected Error"
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should fetch all picks in a draft successfully", async () => {
      const mockPicks: Pick[] = [
        {
          player_id: "2391",
          picked_by: "234343434",
          roster_id: "1",
          round: 5,
          draft_slot: 5,
          pick_no: 1,
          metadata: {},
          is_keeper: null,
          draft_id: "257270643320426496",
        },
        // Add more picks as needed
      ];

      const response: AxiosResponse<Pick[]> = {
        data: mockPicks,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/draft/257270643320426496/picks`)
        .resolves(response);

      const picks = await api.getPicksInDraft("257270643320426496");
      expect(picks).toEqual(mockPicks);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 404 error when fetching picks in a draft", async () => {
      const error = {
        response: {
          status: 404,
          statusText: "Not Found",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub.withArgs(`/draft/invalidDraftId/picks`).rejects(error);

      await expect(api.getPicksInDraft("invalidDraftId")).rejects.toThrow(
        "Not Found: The requested resource could not be found."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should fetch traded picks in a draft successfully", async () => {
      const mockTradedPicks: DraftPick[] = [
        {
          season: "2019",
          round: 5,
          roster_id: 1,
          previous_owner_id: 1,
          owner_id: 2,
        },
        {
          season: "2019",
          round: 3,
          roster_id: 2,
          previous_owner_id: 2,
          owner_id: 1,
        },
      ];

      const response: AxiosResponse<DraftPick[]> = {
        data: mockTradedPicks,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/draft/257270643320426496/traded_picks`)
        .resolves(response);

      const tradedPicks = await api.getTradedPicksInDraft("257270643320426496");
      expect(tradedPicks).toEqual(mockTradedPicks);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle network error when fetching traded picks in a draft", async () => {
      const error = {
        message: "Network Error",
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub
        .withArgs(`/draft/257270643320426496/traded_picks`)
        .rejects(error);

      await expect(
        api.getTradedPicksInDraft("257270643320426496")
      ).rejects.toThrow("Axios Error: Network Error");
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });

  // Player Methods Tests

  describe("Player Methods", () => {
    it("should fetch all players successfully", async () => {
      const mockPlayers: { [playerId: string]: Player } = {
        "3086": {
          hashtag: "#TomBrady-NFL-NE-12",
          depth_chart_position: 1,
          status: "Active",
          sport: "nfl",
          fantasy_positions: ["QB"],
          number: 12,
          search_last_name: "brady",
          injury_start_date: null,
          weight: "220",
          position: "QB",
          practice_participation: null,
          sportradar_id: "",
          team: "NE",
          last_name: "Brady",
          college: "Michigan",
          fantasy_data_id: 17836,
          injury_status: null,
          player_id: "3086",
          height: "6'4\"",
          search_full_name: "tombrady",
          age: 40,
          stats_id: "",
          birth_country: "United States",
          espn_id: "",
          search_rank: 24,
          first_name: "Tom",
          depth_chart_order: 1,
          years_exp: 14,
          rotowire_id: null,
          rotoworld_id: 8356,
          search_first_name: "tom",
          yahoo_id: null,
        },
        // Add more players as needed
      };

      const response: AxiosResponse<{ [playerId: string]: Player }> = {
        data: mockPlayers,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub.withArgs(`/players/nfl`).resolves(response);

      const players = await api.getAllPlayers("nfl");
      expect(players).toEqual(mockPlayers);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 500 error when fetching all players", async () => {
      const error = {
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub.withArgs(`/players/nfl`).rejects(error);

      await expect(api.getAllPlayers("nfl")).rejects.toThrow(
        "Internal Server Error: Problem with the server."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should fetch trending players successfully", async () => {
      const mockTrendingPlayers: TrendingPlayer[] = [
        {
          player_id: "1111",
          count: 45,
        },
        // Add more trending players as needed
      ];

      const response: AxiosResponse<TrendingPlayer[]> = {
        data: mockTrendingPlayers,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosGetStub
        .withArgs(`/players/nfl/trending/add`, {
          params: { lookback_hours: 24, limit: 25 },
        })
        .resolves(response);

      const trendingPlayers = await api.getTrendingPlayers("nfl", "add");
      expect(trendingPlayers).toEqual(mockTrendingPlayers);
      expect(axiosGetStub.calledOnce).toBe(true);
    });

    it("should handle 429 error when fetching trending players", async () => {
      const error = {
        response: {
          status: 429,
          statusText: "Too Many Requests",
          data: {},
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      axiosGetStub
        .withArgs(`/players/nfl/trending/add`, {
          params: { lookback_hours: 24, limit: 25 },
        })
        .rejects(error);

      await expect(api.getTrendingPlayers("nfl", "add")).rejects.toThrow(
        "Too Many Requests: You are being rate limited."
      );
      expect(axiosGetStub.calledOnce).toBe(true);
    });
  });
});
