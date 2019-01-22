import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={"square" + (props.winner ? " winner" : "")}
      onClick={props.onClick}
    >
      {props.sign}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
        sign={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        winner={winner}
      />
    );
  }

  renderBoard() {
    let rows = [];

    for (let row = 0; row < 3; row++) {
      let children = [];

      for (let col = 0; col < 3; col++) {
        let index = row * 3 + col;
        let winner = false;
        const winningLine = this.props.winningLine;

        if (winningLine) {
          for (let line = 0; line < winningLine.length; line++) {
            if (winningLine[line] === index) {
              winner = true;
            }
          }
        }

        let square = this.renderSquare(index, winner);
        children.push(square);
      }

      rows.push(
        <div className="board-row" key={row}>
          {children}
        </div>
      );
    }

    return rows;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          move: {
            col: null,
            row: null,
            sign: null
          }
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
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
          col: (i % 3) + 1,
          row: Math.ceil((i + 1) / 3),
          sign: squares[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Got to move # " + move : "Go to game start";
      const selected = move === this.state.stepNumber;
      const location = move
        ? "Col: " + step.col + " Row: " + step.row + " Move: " + step.sign
        : "";

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={selected ? "is-active" : ""}
          >
            {desc} {location}
          </button>
        </li>
      );
    });

    let status;
    let winningLine;
    if (winner) {
      winningLine = winner.line;
      status = "Winner: " + winner.sign;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningLine={winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { sign: squares[a], line: lines[i] };
    }
  }

  return null;
}
