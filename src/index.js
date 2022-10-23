import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).player || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
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

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  toggleSortOrder() {
    this.setState({
      isAscending: !this.state.isAscending
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerInfo = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const column = 1 + step.squareIndex % 3;
      const row = 1 + Math.floor(step.squareIndex / 3);

      const desc = move ?
        'Go to move #' + move + ' (Column: ' + column + ', Row: ' + row + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button className={this.state.stepNumber == move ? 'selected' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.isAscending) {
      moves.reverse();
    }

    let status;
    if (winnerInfo.player) {
      status = "Winner: " + winnerInfo.player;
    } else if (winnerInfo.isDraw) {
      status = "Game Draw!";
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
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        'player': squares[a],
        'combination': lines[i]
      };
    }
  }

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
