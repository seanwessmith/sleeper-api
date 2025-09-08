# SleeperAPI

A lightweight, type-safe TypeScript client for the official Sleeper API. Fetch users, leagues, rosters, matchups, drafts, players (including trending), state, and more—using native fetch (no external HTTP dependency).

- **Type-safe**: Strong TS interfaces (User, League, Roster, etc.)
- **Zero deps**: Uses built-in fetch (Node 18+, modern browsers)
- **Browser-ready**: Works in the browser out of the box
- **Helpful utils**: Includes getAvatarUrl(avatarId, thumbnail)

---

## Table of Contents

- [Installation](#installation)
- [Quickstart](#quickstart)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Examples](#examples)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
# npm
npm install sleeperapi

# bun
bun add sleeperapi

# yarn
yarn add sleeperapi
```

This package targets ESM and relies on global fetch:
- Node 18+, Bun 1.1+, or any modern browser.

---

## Quickstart

```typescript
import SleeperAPI, { getAvatarUrl } from 'sleeperapi';

const sleeper = new SleeperAPI();

const run = async () => {
  // 1) Find a user
  const user = await sleeper.getUserByUsername('john_doe');

  // 2) Their NFL leagues for 2024
  const leagues = await sleeper.getLeaguesForUser(user.user_id, 'nfl', '2024');

  // 3) Current display week (from Sleeper state)
  const state = await sleeper.getState('nfl');
  const week = state.display_week;

  // 4) Matchups for first league this week
  const leagueId = leagues[0].league_id;
  const matchups = await sleeper.getMatchups(leagueId, week);

  // 5) Handy: avatar URL
  const avatarUrl = getAvatarUrl(user.avatar, true);

  console.log({
    user: user.display_name,
    league: leagues[0].name,
    week,
    matchups: matchups.length,
    avatarUrl
  });
};

run();
```

---

## Usage

### Initialization

```typescript
import SleeperAPI from 'sleeperapi';

// Default base URL (https://api.sleeper.app/v1) and 10s timeout
const sleeper = new SleeperAPI();
```

### Examples

#### Get a user by username

```typescript
const user = await sleeper.getUserByUsername('john_doe');
```

#### Leagues for a user

```typescript
const leagues = await sleeper.getLeaguesForUser('user_id_123', 'nfl', '2024');
```

#### Rosters & users in a league

```typescript
const rosters = await sleeper.getRosters('league_id_abc');
const users   = await sleeper.getUsersInLeague('league_id_abc');
```

#### Weekly matchups

```typescript
const state    = await sleeper.getState('nfl');
const matchups = await sleeper.getMatchups('league_id_abc', state.display_week);
```

#### Transactions for a round

```typescript
const txns = await sleeper.getTransactions('league_id_abc', 1);
```

#### Playoffs brackets

```typescript
const winners = await sleeper.getWinnersBracket('league_id_abc');
const losers  = await sleeper.getLosersBracket('league_id_abc');
```

#### Drafts & picks

```typescript
const drafts      = await sleeper.getDraftsForLeague('league_id_abc');
const draft       = await sleeper.getDraft(drafts[0].draft_id);
const picks       = await sleeper.getPicksInDraft(draft.draft_id);
const tradedPicks = await sleeper.getTradedPicksInDraft(draft.draft_id);
```

#### Players & trending

```typescript
const players  = await sleeper.getAllPlayers('nfl');  // { [playerId]: Player }
const trending = await sleeper.getTrendingPlayers('nfl', 'add', 24, 25);
```

#### State (season/week info)

```typescript
const state = await sleeper.getState('nfl'); // { week, season, display_week, ... }
```

#### Avatars

```typescript
import { getAvatarUrl } from 'sleeperapi';
const url = getAvatarUrl('avatar_hash', true); // true => thumbnail
```

---

## API Reference

### Users
- `getUserByUsername(username: string): Promise<User>`
- `getUserById(userId: string): Promise<User>`

### Leagues
- `getLeaguesForUser(userId: string, sport: string, season: string): Promise<League[]>`
- `getLeague(leagueId: string): Promise<League>`
- `getUsersInLeague(leagueId: string): Promise<User[]>`
- `getRosters(leagueId: string): Promise<Roster[]>`
- `getMatchups(leagueId: string, week: number): Promise<Matchup[]>`
- `getWinnersBracket(leagueId: string): Promise<BracketMatchup[]>`
- `getLosersBracket(leagueId: string): Promise<BracketMatchup[]>`
- `getTransactions(leagueId: string, round: number): Promise<Transaction[]>`
- `getTradedPicks(leagueId: string): Promise<DraftPick[]>`

### State
- `getState(sport: string): Promise<State>`

### Drafts
- `getDraftsForUser(userId: string, sport: string, season: string): Promise<Draft[]>`
- `getDraftsForLeague(leagueId: string): Promise<Draft[]>`
- `getDraft(draftId: string): Promise<Draft>`
- `getPicksInDraft(draftId: string): Promise<Pick[]>`
- `getTradedPicksInDraft(draftId: string): Promise<DraftPick[]>`

### Players
- `getAllPlayers(sport?: string): Promise<{ [playerId: string]: Player }>`
- `getTrendingPlayers(sport: string, type: 'add' | 'drop', lookbackHours?: number, limit?: number): Promise<TrendingPlayer[]>`

**Exported Types**: `User`, `League`, `Roster`, `Matchup`, `BracketMatchup`, `Transaction`, `DraftPick`, `State`, `Draft`, `Pick`, `Player`, `TrendingPlayer`, plus `getAvatarUrl`.

---

## Error Handling

All methods may throw. Errors are normalized to friendly Error messages (including timeouts). Typical cases:
- **400** — Bad Request (invalid params)
- **404** — Not Found
- **429** — Too Many Requests (rate limited)
- **500 / 503** — Server issues
- **Timeout** — "Request timeout"

Use try/catch:

```typescript
try {
  const user = await sleeper.getUserByUsername('nope');
} catch (err: any) {
  console.error(err.message);
}
```

---

## FAQ

**What environments are supported?**  
Node 18+, Bun 1.1+, and modern browsers (global fetch available).

**Do I need an HTTP client like axios?**  
No—this library uses native fetch and has no external HTTP dependency.

**How big is getAllPlayers?**  
It can be large. Consider caching and refreshing periodically (e.g., on startup + daily).

**How do I pick the "current week"?**  
Call `getState('nfl')` and use `display_week`.

**What sports are supported?**  
Sleeper's common sport path is 'nfl'. Other sports depend on Sleeper's public endpoints.

---

## License

MIT © seanwessmith. See LICENSE.