const board = document.getElementById('board');
const players = document.getElementById('players');
const player0 = document.getElementById('player0');
const player1 = document.getElementById('player1');
const playAgainButton = document.getElementById('play-again');

let currentPlayer = 0;
let boardState = Array(25).fill('');
let gameActive = true;
let playerWins = [0, 0];

function checkWinner() {
  const winPatterns = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  for (let pattern of winPatterns) {
    const [a, b, c, d, e] = pattern;
    if (
      boardState[a] !== '' &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c] &&
      boardState[a] === boardState[d] &&
      boardState[a] === boardState[e]
    ) {
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
  const playerSymbols = ['Queen', 'King'];

  player0.innerHTML = `${playerSymbols[0]} (<img src="queen.png" alt="Queen" height="40">) Wins: ${playerWins[0]}`;
  player1.innerHTML = `${playerSymbols[1]} (<img src="king.png" alt="King" height="40">) Wins: ${playerWins[1]}`;

  if (playerWins[currentPlayer] > 0) {
    players.textContent = `${playerSymbols[currentPlayer]} Wins!`;
  } else if (boardState.every(cell => cell !== '')) {
    players.textContent = "It's a Draw!";
  }
}

function handleClick(index) {
  if (!gameActive || boardState[index] !== '') return;

  const symbol = currentPlayer === 0 ? '<img src="queen.png" alt="Queen" height="30">' : '<img src="king.png" alt="King" height="30">';
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
  boardState = Array(25).fill('');
  gameActive = true;
  currentPlayer = 0;
  playAgainButton.style.display = 'none';

  board.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'tile';
    cell.id = `cell-${i}`;
    cell.addEventListener('click', () => handleClick(i));
    board.appendChild(cell);
  }

  players.innerHTML = `
    <div id="player0">Queen(<img src="queen.png" alt="Queen" height="40">) Wins: ${playerWins[0]}</div>
    <div id="player1">King(<img src="king.png" alt="King" height="40">) Wins: ${playerWins[1]}</div>
  `;
}

restartGame();

playAgainButton.addEventListener('click', () => {
  for (let i = 0; i < 25; i++) {
    document.getElementById(`cell-${i}`).innerHTML = '';
    document.getElementById(`cell-${i}`).classList.remove('winner');
  }
  players.textContent = '';
  restartGame();
});
