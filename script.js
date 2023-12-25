
  const board = document.getElementById('board');
  const players = document.getElementById('players');
  const player0 = document.getElementById('player0');
  const player1 = document.getElementById('player1');
  const playAgainButton = document.getElementById('play-again');

  let currentPlayer = 0;
  let boardState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  let playerWins = [0, 0];

  function checkWinner() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (boardState[a] !== '' && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return pattern;
      }
    }

    return null;
  }

  function endGame(winningPattern) {
    gameActive = false;
    if (winningPattern) {
      winningPattern.forEach(index => {
        document.getElementById(`cell-${index}`).classList.add('winner');
      });
    }
    playAgainButton.style.display = 'block';
  }

  function updatePlayerWins() {
    player0.innerHTML = `Player 0 (<img src="https://cdn-icons-png.flaticon.com/512/1600/1600918.png" alt="Queen" height="40">) Wins: ${playerWins[0]}`;
    player1.innerHTML = `Player 1 (<img src="https://png.pngtree.com/png-vector/20220629/ourmid/pngtree-blue-king-icon-flat-vector-png-image_5523073.png" alt="King" height="40">) Wins: ${playerWins[1]}`;
  }

  function handleClick(index) {
    if (!gameActive || boardState[index] !== '') return;

    const symbol = currentPlayer === 0 ? '<img src="https://cdn-icons-png.flaticon.com/512/1600/1600918.png" alt="Queen" height="40">' : '<img src="https://png.pngtree.com/png-vector/20220629/ourmid/pngtree-blue-king-icon-flat-vector-png-image_5523073.png" alt="King" height="40">';
    boardState[index] = symbol;
    document.getElementById(`cell-${index}`).innerHTML = symbol;

    const winningPattern = checkWinner();
    if (winningPattern) {
      playerWins[currentPlayer]++;
      updatePlayerWins();
      endGame(winningPattern);
    } else if (boardState.every(cell => cell !== '')) {
      players.textContent = 'It\'s a Draw!';
      endGame(null);
    } else {
      currentPlayer = 1 - currentPlayer; // Switch players
    }
  }

  function restartGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 0;
    playAgainButton.style.display = 'none';

    // Reset the board
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'tile';
      cell.id = `cell-${i}`;
      cell.addEventListener('click', () => handleClick(i));
      board.appendChild(cell);
    }

    // Reset the players display
    players.innerHTML = `
      <div id="player0">Player 0 (<img src="https://cdn-icons-png.flaticon.com/512/1600/1600918.png" alt="Queen" height="40">) Wins: ${playerWins[0]}</div>
      <div id="player1">Player 1 (<img src="https://png.pngtree.com/png-vector/20220629/ourmid/pngtree-blue-king-icon-flat-vector-png-image_5523073.png" alt="King" height="40">) Wins: ${playerWins[1]}</div>
    `;
  }

  // Initial setup
  restartGame();

  // Play again button click event
  playAgainButton.addEventListener('click', () => {
    // Reset the board
    for (let i = 0; i < 9; i++) {
      document.getElementById(`cell-${i}`).innerHTML = '';
      document.getElementById(`cell-${i}`).classList.remove('winner');
    }
    players.textContent = '';
    restartGame();
  });
