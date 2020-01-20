# MegaDraw 4000!

Telnet enabled drawing program full of awe and wonder.

## Features

- Robust draw modes
- Amazing response
- Cloud Native
- Multi-user support
- CCPA + GDPR compliant

## Installation

Installation is a cinch. Does require at least `node 13.6` if running native. You could install via `nvm i 13.6` if you like. Or use the docker compose method for easy breezy installation.

## Quick Start

The quickest way to get up and running is via docker.

```
docker-compose up
```

Don't like docker? NO PROBLEM. Run natively via:

```
node -v # ensure it is 13.6 at least, if not install or use nvm i 13.6
npm i -g nodemon # install nodemon to monitor for file changes
npm install
npm start:dev
```

Don't have `npm`? Why not? Fine, whatever, run:

```
node index.js
```

Once the server is up and running, connect via `telnet localhost 8124`. And you're off into pixel nirvana.

## Configuration

Supports an abundance of environment variables.

- `PORT` - defaults to 8124
- `ROWS` - defaults to 30
- `COLS` - defaults to 30


## Commands

### `steps n`
Based on current brush direction and type, repeat steps `n` times.

### `left n` direction change

Changes the current cursor direction to the left from the list below `n` times. Default 1.

### `right n` direction change

Changes the current cursor direction to the right from the list below `n` times. Default 1.

### `hover`

Set the brush mode to hover and not add or remove any glyps at position.

### `draw`

Set the brush mode to draw. Which inserts a glyph at current position.

### `eraser`

Set the brush mode to erase. Which removes any glyph at current position.

### `coord`

Returns the current cursor position in (x,y) format.

### `render`

Prints out the current drawing to client.

### `clear`

Clears out the canvas of all glyphs.

### `quit`

Exit or disconnect from the client session.

## Directions

The initial cursor direction defaults to ↑. You can cycle through directions by using the `left` and `right` commands. The directions are listed in the following order ↑ ↗ → ↘ ↓ ↙ ← ↖.