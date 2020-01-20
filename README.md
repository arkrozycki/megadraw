# MegaDraw 4000!

Telnet enabled drawing program full of awe and wonder.

## Installation

No dependencies on frameworks. No real reason why except that its fun! Installation is a cinch. Does require at least `node 13.6`.

```
npm install
```

## Features

- Robust draw modes
- Amazing response
- Cloud Native
- Multi-user support
- CCPA + GDPR compliant

## Quick Start

The quickest way is to use run via docker.

```
docker-compose up
```

Don't like docker? NO PROBLEM. Just run:

```
npm start
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

## Directions

The cursor direction defaults to ↑.

↑ ↗ → ↘ ↓ ↙ ← ↖

## Commands

### `steps n`
Based on current brush direction and type, repeat steps `n` times.

### `left n`

Moves the current cursor direction to the left from the list above `n` times. Default 1.

### `right n`

Moves the current cursor direction to the right from the list above `n` times. Default 1.

### `hover`
Set the brush mode to simply hover and not add or remove any glyps at position.

### `draw`

Set the brush mode to draw.

### `eraser`

Set the brush mode to erase.

### `coord`

Returns the current cursor position in (x,y) format.

### `render`

Prints out the current drawing to client.

### `clear`

Clears out the canvas of all glyphs.

### `quit`

Exit or disconnect from the client session.