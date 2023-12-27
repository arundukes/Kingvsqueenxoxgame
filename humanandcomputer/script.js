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
  if (winningPattern) {
    winningPattern.forEach(index => {
      document.getElementById(`cell-${index}`).classList.add('winner');
    });
    playerWins[currentPlayer]++;
    updatePlayerWins();
  }

  gameActive = false;

  playAgainButton.style.display = 'block';
}

function updatePlayerWins() {
  const playerSymbols = ['Human', 'Robot'];

  player0.innerHTML = `${playerSymbols[0]} (<img src="queen.png" alt="Queen" height="80">) Wins: ${playerWins[0]}`;
  player1.innerHTML = `${playerSymbols[1]} (<img src="king.png" alt="King" height="80">) Wins: ${playerWins[1]}`;

  // Check if there's a winner and update the players' div
  if (playerWins[currentPlayer] > 0) {
    players.textContent = `${playerSymbols[currentPlayer]} Wins!`;
  } else if (boardState.every(cell => cell !== '')) {
    players.textContent = "It's a Draw!";
  }
}

function getRandomEmptyCell() {
  const emptyCells = [];
  for (let i = 0; i < 9; i++) {
    if (boardState[i] === '') {
      emptyCells.push(i);
    }
  }
  if (emptyCells.length === 0) {
    return null; // No empty cells
  }
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

function computerMove() {
  if (!gameActive) return;

  const index = getRandomEmptyCell();
  if (index !== null) {
    const symbol = currentPlayer === 0 ? '<img src="queen.png" alt="Queen" height="80">' : '<img src="king.png" alt="King" height="80">';
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
}

function handleClick(index) {
  if (!gameActive || boardState[index] !== '') return;

  const symbol = currentPlayer === 0 ? '<img src="queen.png" alt="Queen" height="80">' : '<img src="king.png" alt="King" height="80">';
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
    setTimeout(computerMove, 500); // Introduce a delay for the computer move
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
    <div id="player0">Human(<img src="queen.png" alt="Queen" height="40">) Wins: ${playerWins[0]}</div>
    <div id="player1">Robot(<img src="king.png" alt="King" height="40">) Wins: ${playerWins[1]}</div>
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