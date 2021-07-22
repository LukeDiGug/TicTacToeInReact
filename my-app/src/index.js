import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
function Board(props) {
  
  function renderSquare(i) {
    return (
      <Square 
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  const boardSize = 3
  let squares = []
  for (let i = 0; i < boardSize; i++) {
    let row = []
    for (let j = 0; j < boardSize; j++) {
      row.push(renderSquare(i * boardSize + j));
    }
    squares.push(<div key = {i} className="board-row">{row}</div>);
  }
    
  return (
    <div>
      {squares}
    </div>
  );
  
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastChoice: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      listDescending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastChoice: convertToCoord(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseList() {
    this.setState({
      listDescending: !this.state.listDescending
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        const isBold = this.state.stepNumber === move
      return ( isBold ?
        <li key={move}>
          <button className={'boldOption'} onClick={() => this.jumpTo(move)}>
            {desc} {step.lastChoice}
          </button>
        </li>
        :
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc} {step.lastChoice}
          </button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.listDescending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.reverseList()}>
            Sort by {this.state.listDescending ? "most recent" : "turn order"}
          </button>
        </div>
      </div>
    );
  }
}

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
      return squares[a];
    }
  }
  return null;
}

function convertToCoord(index) {
  let row, column;
  if (index < 3) { 
    row = 1; 
  } else if (index > 5) { 
    row = 3; 
  } else { 
    row = 2;
  }

  if (index % 3 === 0) {
    column = 1;
  } else if (index % 3 === 1) {
    column = 2;
  } else {
    column = 3;
  }

  return (
    '(' + column + ', ' + row + ')'
  );
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  