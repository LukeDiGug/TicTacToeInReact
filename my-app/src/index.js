import React, { useState } from 'react';
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
  
function Game(props) {
  const [fullHistory, setHistory] = useState([{
    squares: Array(9).fill(null),
    lastChoice: null,
  }])
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXIsNext] = useState(true)
  const [listDescending, setListDescending] = useState(true)

  function handleClick(i) {
    let history = fullHistory.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateGameState(current.squares).winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    console.log(fullHistory)
    
    history.push({
      squares: squares,
      lastChoice: convertToCoord(i),
    })

    setHistory(
      history
    )

    setStepNumber(
      fullHistory.length - 1
    )

    setXIsNext(
      !xIsNext
    )
  }

  function jumpTo(step) {
    setStepNumber(
      step
    )
    setXIsNext(
      (step % 2) === 0
    )
  }

  function reverseList() {
    setListDescending(
      !listDescending
    )
  }
  
  console.log(fullHistory)
  console.log(stepNumber)
  console.log(fullHistory[stepNumber])
  const gameStateInfo = calculateGameState(fullHistory[stepNumber].squares);
  const winner = gameStateInfo.winner;
  const isDraw = gameStateInfo.isDraw;
    
  const moves = fullHistory.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      const isBold = stepNumber === move
    return ( isBold ?
      <li key={move}>
        <button className={'boldOption'} onClick={() => jumpTo(move)}>
          {desc} {step.lastChoice}
        </button>
      </li>
      :
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {desc} {step.lastChoice}
        </button>
      </li>
    )
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = "Game ended in a draw"
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={fullHistory[stepNumber].squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{listDescending ? moves : moves.reverse()}</ol>
        <button onClick={() => reverseList()}>
          Sort by {listDescending ? "most recent" : "turn order"}
        </button>
      </div>
    </div>
  );
  
}

function calculateGameState(squares) {
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
        winner: squares[a], 
        isDraw: false
      };
    }
  }

  return {
    winner: null, 
    isDraw: !squares.includes(null)
  };;
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
  