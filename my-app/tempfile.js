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
    if (calculateGameState(current.squares).winner || squares[i]) {
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
    const gameStateInfo = calculateGameState(current.squares);
    const winner = gameStateInfo.winner;
    const isDraw = gameStateInfo.isDraw;
    
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
    } else if (isDraw) {
      status = "Game ended in a draw"
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





