import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const className = "square " + (props.highlight ? "winningSquares" : null);
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={"square " + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.winningSquares.includes(i)}
      />
    );
  }

  renderSquares(n) {
    let squares = [];
    for (let i = n; i < n + 3; i++) {
      squares.push(this.renderSquare(i));
    }
    return squares;
  }

  renderRows(i) {
    return <div className="board-row">{this.renderSquares(i)}</div>;
  }

  render() {
    // Use two loops to make the squares
    const boardSize = 4;
    let squares = [];
    for (let i = 0; i < boardSize; ++i) {
      let row = [];
      for (let j = 0; j < boardSize; ++j) {
        row.push(this.renderSquare(i * boardSize + j));
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }

    return (
      <div>{squares}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true,
    };
  }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4]
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: locations[i],
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  sortToggle() {
    this.setState({
      isDescending: !this.state.isDescending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const stepNumber = this.state.stepNumber;
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      //const latestMoveSquare = step.latestMoveSquare;
      const desc = move
      ? "Go to move #" + move + "(" + history[move].location + ")"
      : "Go to game start";
        return (
            <li key={move}>
              {/* Bold the currently selected item */ }
              <button
                className={move === stepNumber ? 'move-list-item-selected' : ''}
                onClick={() => this.jumpTo(move)}>{desc}
              </button>
            </li>
      );
    });

    let status;
    if (winner) {
      status = "Player  " + winner.player + " Won @ line [" + winner.line + "]"
    } else if (!current.squares.includes(null)) {
      status = "Draw, Cats' Game!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const isDescending = this.state.isDescending;
    if (!isDescending) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningSquares={winner ? winner.line : []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.sortToggle()}>
            {isDescending ? 'ascending' : 'descending'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [12, 9, 6 ,3]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return { player: squares[a], line: [a, b, c, d] };
    }
  }
  return null;
}
