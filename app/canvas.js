
const EOL = '\r\n' // end of line

// supported command list
const COMMANDS = [
  'steps',
  'left',
  'right',
  'hover',
  'draw',
  'erase',
  'coord',
  'render',
  'clear',
  'quit',
  'test'
]

// grid directions [col, row] (e.g. [0,1] === same column, up one row)
const DIRECTIONS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]
const DIRECTIONS_ARROWS = ['\u2191', '\u2197', '\u2192', '\u2198', '\u2193', '\u2199', '\u2190', '\u2196'] // used for console debug

const CONFIG = {
  COLS: parseInt(process.env.COLS) || 30, // use env variable or default to 30
  ROWS: parseInt(process.env.ROWS) || 30, // use env variable or default to 30
  FRAME: { // stores the unicode characters for generating the canvas frame
    HORIZ: '\u2550',
    VERT: '\u2551',
    TOPLEFT: '\u2554',
    TOPRIGHT: '\u2557',
    BOTLEFT: '\u255A',
    BOTRIGHT: '\u255D'
  },
  BRUSH_GLYPH: '*',
  BRUSH_EMPTY: ' ',
  DEFAULT_BRUSH_MODE: 'draw',
  DEFAULT_BRUSH_DIR: 0,
  DEFAULT_BRUSH_POS_COL: 15, 
  DEFAULT_BRUSH_POS_ROW: 14
}

/** Class creates a canvas used to draw */
class Canvas {
  /*
  * Create a new canvas.
  * @param {socket} client - The socket connection to connected client.
  */
  constructor (client) {
    this.client = client // set the client
    this.grid = {} // object that stores glyphs and their positions
    this.buffer = '' // the output buffer for this canvas
    this.brush = {
      dir: CONFIG.DEFAULT_BRUSH_DIR,
      mode: CONFIG.DEFAULT_BRUSH_MODE,
      col: CONFIG.DEFAULT_BRUSH_POS_COL,
      row: CONFIG.DEFAULT_BRUSH_POS_ROW
    }

    // once we recieve data, call this function
    this.client.on('data', d => this._recData(d))

    console.log(`created canvas ${CONFIG.COLS} x ${CONFIG.ROWS}`)
    console.log(`canvas config ${JSON.stringify(this.brush)}`)
  }

  /*
  * Command <steps n>. Based on current brush mode and direction, repeats steps
  * @param {number} num - Number of times to repeat the action. Default 0.
  */
  steps (num = 0) {
    console.log(`stepping ${num} time(s) in ${this.brush.mode} mode in ${DIRECTIONS_ARROWS[this.brush.dir]} direction`)
    while (num > 0) {
      this._move() // move current position of brush
      num--
    }
    return this
  }

  /*
  * Command <left n>. Moves the current direction to the left. Moves to end if moved past the beginning of array.
  * @param {number} num - The number of places to move in the left direction. Default 1.
  */
  left (num = 1) {
    const rem = (this.brush.dir - parseInt(num)) % DIRECTIONS.length
    this.brush.dir = (rem >= 0) ? rem : DIRECTIONS.length + rem
    return this
  }

  /*
  * Command <right n>. Moves the current direction to the right. Loops back to beginning if moved past the array length.
  * @param {number} num - The number of places to move in the right direction. Default 1.
  */
  right (num = 1) {
    this.brush.dir = (parseInt(num) + this.brush.dir) % DIRECTIONS.length
    return this
  }

  /*
  * Command <draw>. Changes brush mode to insert a glyph on the grid at the current brush col, row position.
  */
  draw () {
    this.brush.mode = 'draw'
    return this
  }

  /*
  * Command <hover>. Changes brush mode to hover over the grid location, nothing inserted, nothing removed.
  */
  hover () {
   this.brush.mode = 'hover'
   return this
  }

  /*
  * Command <eraser>. Changes brush mode to erase or rather insert an empty space at current grid location.
  */
  eraser () {
    this.brush.mode = 'eraser'
    return this
  }

  /*
  * Renders canvas to client
  */
  render () {
    this._borderTop() // renders top frame
      ._grid() // renders the grid
      ._borderBot() // renders bottom frame
      ._print(EOL)
    return this
  }

  /*
  * Command <coord>. Print to client the current brush position.
  * @return {string} The (col,row) position of the brush.
  */
  coord () {
    this._print(`(${this.brush.col},${CONFIG.ROWS - (this.brush.row+1)})` + EOL) // grid is zero based, one is being added to satisfy requirements of being 1 based
    return this
  }

  /*
  * Command <clear>. Clear all glyphs from grid, leaving cursor at current position.
  */
  clear(){
    this.grid = {}
    return this
  }

  /*
  * Command <quit>. Disconnect the client connection
  */
  quit () {
    this.client.end()
  }

  /*
  * Moves the current brush to a position based on the current direction
  * @return {object} this - chainable
  */
  _move () {
    // based on brush mode we are adding or erasing
    switch(this.brush.mode){
      case 'draw':
        this.grid[this.brush.col + 'x' + this.brush.row] = CONFIG.BRUSH_GLYPH
        break;
      case 'eraser':
        delete this.grid[this.brush.col + 'x' + this.brush.row]
      break;
    }

    // move our cursor position based on direction configured
    const nextCol = this.brush.col + DIRECTIONS[this.brush.dir][0]
    const nextRow = this.brush.row + DIRECTIONS[this.brush.dir][1]

    // if the next cursor is out of bounds for the grid, ignore and leave where it is
    if(nextCol >= CONFIG.COLS || nextCol < 0 || nextRow >= CONFIG.ROWS || nextRow < 0) {
      return this
    }

    this.brush.col = nextCol 
    this.brush.row = nextRow

    return this
  }

  /*
  * Data is received from the client
  * @param {Buffer} buffer - The buffer received from the client
  */
  _recData (buffer) {
    const commands = buffer.toString().split('\r\n') // convert buffer to string and split on line ending

    // loop over all commands
    commands.forEach(c => {
      const [cmd, val = undefined] = c.replace(/^\s+|\s+$|\r\n|\r|\n/g, '') // remove any leading, trailing spaces or line breaks from command
        .toLowerCase() // all commands are lowercase, in case of uppercase -> lower
        .split(' ') // commands are singluar or contain params

      // if the client has requested to execute a command not supported, send back message saying such
      // for now, we will simply ignore the command if we do not have an implmentation for it
      if (!this[cmd]) {
        return // do nothing
        // TODO:// this.print(`Command '${command}' not supported. Try one of the following: ${COMMANDS.join(', ')}.`) // client should recieve message when command is not supported
      }

      // execute the command the client has requested
      this[cmd](val)
    })
  }

  /*
  * Prints desired output to client, if param undefined, prints buffer.
  * @param {string} s - The string to output.
  */
  _print (s) {
    this.client.write(s || this.buffer)
    return this
  }

  /*
  * Generates the canvas board and saves it to buffer.
  * @return {object} this - chainable
  */
  _grid () {
    this.buffer = ''
    for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
      this.buffer += CONFIG.FRAME.VERT
      for (let col = 0; col < CONFIG.COLS; col++) {
        this.buffer += (this.grid[col + 'x' + row] ) ? this.grid[col + 'x' + row] : CONFIG.BRUSH_EMPTY
      }
      this.buffer += CONFIG.FRAME.VERT + EOL
    }
    this._print()
    return this
  }

  /*
  * Generates a top or bottom frame.
  * @param {string} tb - A string of either 'top' or 'bot'
  * @return {string} Frame border using unicode box drawing chars.
  */
  _border (tb) {
    let s = (tb === 'top') ? CONFIG.FRAME.TOPLEFT : CONFIG.FRAME.BOTLEFT

    for (let i = 0; i < CONFIG.COLS; i++) {
      s += CONFIG.FRAME.HORIZ
    }

    s += (tb === 'top') ? CONFIG.FRAME.TOPRIGHT : CONFIG.FRAME.BOTRIGHT
    return s
  }

  /*
  * Helper func to set internal buffer to top border.
  * @return {object} this - chainable
  */
  _borderTop () {
    this.buffer = this._border('top') + EOL
    this._print()
    return this
  }

  /*
  * Helper func to set internal buffer to bottom border.
  * @return {object} this - chainable
  */
  _borderBot () {
    this.buffer = this._border('bot') + EOL
    this._print()
    return this
  }

  test(){
    this.steps(5)
      .right(2)
      .steps(5)
      .right(2)
      .steps(5)
      .right(2)
      .steps(5)
      .right(2)
      .render()
  }
}

module.exports = Canvas
