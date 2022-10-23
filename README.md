Practicing React through React's Tic-Tac-Toe tutorial - https://reactjs.org/tutorial/tutorial.html.

The following are my solutions to the improvement practice included at the end of the tutorial.

## 1. Display the location for each move in the format (col, row) in the move history list.

Add in `squareIndex` in `handleClick()` function of `Game` class to keep track of the square's index for every move made.

```javascript
  handleClick(i) {
    // ...
    this.setState({
      history: history.concat([
        {
          squares: squares,
          squareIndex: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
```

In `render` function of `Game` class, we calculate the column and row using `squareIndex`. After which, we simply append the column and row numbers to the button label.

```javascript
  render() {
    // ...
    const moves = history.map((step, move) => {
      const column = 1 + step.squareIndex % 3;
      const row = 1 + Math.floor(step.squareIndex / 3);

      const desc = move ?
        'Go to move #' + move + ' (Column: ' + column + ', Row: ' + row + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    // ...
```

## 2. Bold the currently selected item in the move list.

Add the `selected` CSS class in `index.css`. This CSS class will be used to bold the text of the currently selected move's button.

```css
.selected {
  font-weight: 700;
}
```

In `render` function of `Game` class, we can simply check if value of `this.state.stepNumber` is the same as `move`. If it is, then that is the currently selected move, and we can add the `selected` CSS class to it.

```javascript
  render() {
    // ...
      return (
        <li key={move}>
          <button className={this.state.stepNumber == move ? 'selected' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    // ...
```

## 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.

This is the existing code for `Board` class for rendering of the squares, which is hardcoded: 

```javascript
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

To complete this task, we simply have to render the squares in two for-loops. In the first for-loop, we render the board row and second for-loop, we render the squares for each board row.

```javascript
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardSize = 3;
    let board = [];

    for (let i = 0; i < boardSize; i ++) {
      let row = [];

      for (let j = 0; j < boardSize; j ++) {
        row.push(this.renderSquare(i * boardSize + j));
      }

      board.push(<div key={i} className="board-row">{row}</div>);
    }

    return (
      <div>{board}</div>
    );
  }
}
```

## 4. Add a toggle button that lets you sort the moves in either ascending or descending order.

We add a new `isAscending` state to indicate the current order of the moves list.

```javascript
class Game extends React.Component {
  constructor(props) {
    super(props);
    // ...
      isAscending: true
    };
  }
  // ...
```

In `Game` class, we define a new `toggleSortOrder` function to toggle the `isAscending` state. This will be used later on to toggle the button text, as well as to toggle the order of the moves list.

```javascript
  toggleSortOrder() {
    this.setState({
      isAscending: !this.state.isAscending
    })
  }
```

In the `render` function of `Game` class, we create a new `button` to toggle the order of the moves list. Based on the `isAscending` state, we will toggle the order of the moves list using the `reverse` function. On top of that, the button's text will be updated based on the `isAscending` state.

```javascript
  render() {
    // ...
    const moves = history.map((step, move) => {
      // ...
    });

    if (!this.state.isAscending) {
      moves.reverse();
    }
    // ...
    return (
      // ...
        <div className="game-info">
          <div>{status}</div><br />
          <div>
            <button onClick={() => this.toggleSortOrder()}>Sort Moves {this.state.isAscending ? 'Descending' : 'Ascending'}</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

## 5. When someone wins, highlight the three squares that caused the win.

In the `calculateWinner` function, we change the return values to include the winning player and the winning combination.

```javascript
function calculateWinner(squares) {
  // ...
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        'player': squares[a],
        'combination': lines[i]
      };
    }
  }

  return {
    'player': null
  };
}
```

Since the return values of `calculateWinner` was changed, we have to update `handleClick` function of `Game` class.

```javascript
  handleClick(i) {
    // ...
    if (calculateWinner(squares).player || squares[i]) {
      return;
    }
    // ...
  }
```

Also, we have to update `render` function of `Game` class. We will pass the winning combination through props to `Board`.

```javascript
  render() {
    // ...
    const winnerInfo = calculateWinner(current.squares);
    // ...
    let status;
    if (winnerInfo.player) {
      status = "Winner: " + winnerInfo.player;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningCombi={winnerInfo.combination}
          />
        </div>
        <div className="game-info">
          <div>{status}</div><br />
          <div>
            <button onClick={() => this.toggleSortOrder()}>Sort Moves {this.state.isAscending ? 'Descending' : 'Ascending'}</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

We then update `renderSquare` function of `Board` class to check if a winning combination exists. If yes, we pass `highlight` as true through props to `Square`.

```javascript
class Board extends React.Component {
  renderSquare(i) {
    let highlight = false;

    if (this.props.winningCombi && this.props.winningCombi.includes(i)) {
      highlight = true;
    }

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={highlight}
      />
    );
  }
  // ...
```

Then, in `Square` class, we add the `highlighted` CSS class to the square button element depending on the value of `highlight`.

```javascript
function Square(props) {
  const className = 'square' + (props.highlight ? ' highlighted' : '');

  return (
    <button
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
```

Finally, not forgetting the CSS class `highlighted` itself, which we will add to `index.css`.

```css
.highlighted {
  background-color: #afe1af;
}
```

## 6. When no one wins, display a message about the result being a draw.

This is relatively straightforward after completing Improvement #5. In `calculateWinner` function, we declare an `isDraw` variable as true and use a for-loop to loop through all the squares to check if every square has been filled up. If yes, then isDraw will be true. Otherwise, we break the for-loop and set `isDraw` as false. We will also update the return values of `calculateWinner`.

```javascript
function calculateWinner(squares) {
  // ...
  let isDraw = true;

  for (let i = 0; i < squares.length; i ++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }

  return {
    'player': null,
    'isDraw': isDraw
  };
}
```

Then, in the `render` function of `Board` class, we add in a new condition to check if the game is a draw using the `isDraw` variable.

```javascript
  render() {
    // ...
    if (winnerInfo.player) {
      status = "Winner: " + winnerInfo.player;
    } else if (winnerInfo.isDraw) {
      status = "Game Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    // ...
```