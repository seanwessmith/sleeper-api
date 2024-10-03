# SleeperAPI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/sleeper-api.svg)](https://badge.fury.io/js/sleeper-api)
![NPM Downloads](https://img.shields.io/npm/dm/sleeper-api)

SleeperAPI is a TypeScript client library for interacting with the [Sleeper API](https://docs.sleeper.app/). It provides a comprehensive set of methods to fetch and manage data related to users, leagues, rosters, matchups, drafts, players, and more. Whether you're building a fantasy sports application or automating league management tasks, SleeperAPI offers a robust and type-safe way to integrate with Sleeper's platform.

## Table of Contents

- [SleeperAPI](#sleeperapi)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Using Bun](#using-bun)
    - [Using npm](#using-npm)
    - [Using Yarn](#using-yarn)
  - [Usage](#usage)
    - [Initialization](#initialization)
    - [Examples](#examples)
      - [Fetch a User by Username](#fetch-a-user-by-username)
      - [Get All Leagues for a User](#get-all-leagues-for-a-user)
      - [Retrieve All Players for a Sport](#retrieve-all-players-for-a-sport)
  - [API Reference](#api-reference)
    - [User Methods](#user-methods)
    - [League Methods](#league-methods)
    - [Roster Methods](#roster-methods)
    - [Matchup Methods](#matchup-methods)
    - [Draft Methods](#draft-methods)
    - [Player Methods](#player-methods)
  - [Error Handling](#error-handling)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **TypeScript Support**: Fully typed interfaces and classes for type-safe development.
- **Comprehensive Coverage**: Access to users, leagues, rosters, matchups, drafts, players, and more.
- **Customizable Axios Instance**: Option to provide a custom Axios instance for advanced configurations.
- **Error Handling**: Graceful handling of API errors with meaningful messages.
- **Utility Functions**: Helper functions like `getAvatarUrl` for common tasks.

## Installation

You can install SleeperAPI using [Bun](https://bun.sh/), [npm](https://www.npmjs.com/), or [Yarn](https://yarnpkg.com/).

### Using Bun

```bash
bun add sleeperapi axios
```

### Using npm

```bash
npm install sleeperapi axios
```

### Using Yarn

```bash
yarn add sleeperapi axios
```

**Note**: This package depends on `axios`. Ensure it's installed in your project.

## Usage

### Initialization

Import the `SleeperAPI` class and create an instance. You can optionally provide a custom Axios instance if you need to customize request configurations.

```typescript
import SleeperAPI from 'sleeperapi';
import axios from 'axios';

// Optional: Create a custom Axios instance
const customAxios = axios.create({
  baseURL: 'https://api.sleeper.app/v1',
  timeout: 15000, // 15 seconds timeout
});

// Initialize SleeperAPI with the custom Axios instance
const sleeper = new SleeperAPI(customAxios);

// Or initialize with default settings
const sleeperDefault = new SleeperAPI();
```

### Examples

#### Fetch a User by Username

```typescript
import SleeperAPI from 'sleeperapi';

const sleeper = new SleeperAPI();

async function fetchUser() {
  try {
    const user = await sleeper.getUserByUsername('john_doe');
    console.log(user);
  } catch (error) {
    console.error(error.message);
  }
}

fetchUser();
```

#### Get All Leagues for a User

```typescript
import SleeperAPI from 'sleeperapi';

const sleeper = new SleeperAPI();

async function fetchLeagues() {
  try {
    const leagues = await sleeper.getLeaguesForUser('user_id_123', 'nfl', '2023');
    console.log(leagues);
  } catch (error) {
    console.error(error.message);
  }
}

fetchLeagues();
```

#### Retrieve All Players for a Sport

```typescript
import SleeperAPI from 'sleeperapi';

const sleeper = new SleeperAPI();

async function fetchPlayers() {
  try {
    const players = await sleeper.getAllPlayers('nfl');
    console.log(players);
  } catch (error) {
    console.error(error.message);
  }
}

fetchPlayers();
```

## API Reference

### User Methods

- `getUserByUsername(username: string): Promise<User>`
  - Fetch a user by their username.
  
- `getUserById(userId: string): Promise<User>`
  - Fetch a user by their user ID.

### League Methods

- `getLeaguesForUser(userId: string, sport: string, season: string): Promise<League[]>`
  - Retrieve all leagues for a specific user.

- `getLeague(leagueId: string): Promise<League>`
  - Get details of a specific league.

- `getRosters(leagueId: string): Promise<Roster[]>`
  - Fetch all rosters within a league.

- `getUsersInLeague(leagueId: string): Promise<User[]>`
  - Get all users participating in a league.

- `getMatchups(leagueId: string, week: number): Promise<Matchup[]>`
  - Retrieve all matchups for a given week in a league.

- `getWinnersBracket(leagueId: string): Promise<BracketMatchup[]>`
  - Get the winners bracket of a league.

- `getLosersBracket(leagueId: string): Promise<BracketMatchup[]>`
  - Get the losers bracket of a league.

- `getTransactions(leagueId: string, round: number): Promise<Transaction[]>`
  - Fetch all transactions for a specific round in a league.

- `getTradedPicks(leagueId: string): Promise<DraftPick[]>`
  - Retrieve all traded draft picks in a league.

### Roster Methods

*(Similar methods related to rosters can be documented here if applicable.)*

### Matchup Methods

*(Similar methods related to matchups can be documented here if applicable.)*

### Draft Methods

- `getDraftsForUser(userId: string, sport: string, season: string): Promise<Draft[]>`
  - Fetch all drafts associated with a user.

- `getDraftsForLeague(leagueId: string): Promise<Draft[]>`
  - Retrieve all drafts within a league.

- `getDraft(draftId: string): Promise<Draft>`
  - Get details of a specific draft.

- `getPicksInDraft(draftId: string): Promise<Pick[]>`
  - Fetch all picks in a draft.

- `getTradedPicksInDraft(draftId: string): Promise<DraftPick[]>`
  - Retrieve all traded picks in a draft.

### Player Methods

- `getAllPlayers(sport: string): Promise<{ [playerId: string]: Player }>`
  - Fetch all players for a specific sport.

- `getTrendingPlayers(sport: string, type: 'add' | 'drop', lookbackHours?: number, limit?: number): Promise<TrendingPlayer[]>`
  - Get trending players based on recent activity.

## Error Handling

SleeperAPI handles errors gracefully by catching them and throwing meaningful error messages. Ensure to use `try-catch` blocks when making asynchronous calls to handle potential errors.

```typescript
try {
  const user = await sleeper.getUserByUsername('invalid_username');
} catch (error) {
  console.error(error.message); // Outputs a user-friendly error message
}
```

Common error messages include:

- **Bad Request**: Invalid request parameters.
- **Not Found**: Resource does not exist.
- **Too Many Requests**: Rate limiting in effect.
- **Internal Server Error**: Server-side issues.
- **Service Unavailable**: Service is temporarily offline.
- **No Response**: No response received from the server.
- **Unexpected Error**: Other unforeseen errors.

## Contributing

Contributions are welcome! If you'd like to contribute to SleeperAPI, please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

Please ensure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the [MIT License](LICENSE).

If you encounter any issues or have suggestions for improvements, feel free to [open an issue](https://github.com/yourusername/sleeperapi/issues) or submit a pull request.