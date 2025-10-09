const boardEl = document.getElementById("board");
const statusDiv = document.getElementById("status");
const resetBoardBtn = document.getElementById("resetBoard");
const resetScoreBtn = document.getElementById("resetScore");
const modeSelect = document.getElementById("mode");

let cells = [];
let currentPlayer = "X";
let scoreX = parseInt(localStorage.getItem("scoreX")) || 0;
let scoreO = parseInt(localStorage.getItem("scoreO")) || 0;
let scoreDraw = parseInt(localStorage.getItem("scoreDraw")) || 0;
let vsComputer = false;
let aiMode = "easy";

// Update scoreboard from localStorage
document.getElementById("scoreX").textContent = scoreX;
document.getElementById("scoreO").textContent = scoreO;
document.getElementById("scoreDraw").textContent = scoreDraw;

// Create board
function createBoard() {
  boardEl.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    boardEl.appendChild(cell);
    cells.push(cell);
  }
}
createBoard();

// Handle cell click
function handleClick(e) {
  const cell = e.target;
  if (cell.textContent !== "") return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  if (checkWin(currentPlayer)) {
    endGame(`${currentPlayer} wins!`);
    updateScore(currentPlayer);
    return;
  }

  if (isDraw()) {
    endGame("Draw!");
    updateScore("Draw");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDiv.textContent = `Turn: ${currentPlayer}`;
  statusDiv.style.color = currentPlayer === "X" ? "#ff4d4d" : "#4da6ff";

  if (vsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 300);
  }
}

// Check win
function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => pattern.every(i => cells[i].textContent === player));
}

// Check draw
function isDraw() {
  return cells.every(c => c.textContent !== "");
}

// End game
function endGame(message) {
  statusDiv.textContent = message;
  cells.forEach(c => c.classList.add("disabled"));
}

// Update score
function updateScore(player) {
  if (player === "X") scoreX++;
  else if (player === "O") scoreO++;
  else scoreDraw++;

  document.getElementById("scoreX").textContent = scoreX;
  document.getElementById("scoreO").textContent = scoreO;
  document.getElementById("scoreDraw").textContent = scoreDraw;

  localStorage.setItem("scoreX", scoreX);
  localStorage.setItem("scoreO", scoreO);
  localStorage.setItem("scoreDraw", scoreDraw);
}

// Reset board
resetBoardBtn.addEventListener("click", () => {
  cells.forEach(c => {
    c.textContent = "";
    c.classList.remove("x", "o", "disabled");
  });
  currentPlayer = "X";
  statusDiv.textContent = "Turn: X";
  statusDiv.style.color = "#ff4d4d";
});

// Reset score
resetScoreBtn.addEventListener("click", () => {
  scoreX = scoreO = scoreDraw = 0;
  document.getElementById("scoreX").textContent = scoreX;
  document.getElementById("scoreO").textContent = scoreO;
  document.getElementById("scoreDraw").textContent = scoreDraw;
  localStorage.clear();
});

// Mode select
modeSelect.addEventListener("change", function() {
  vsComputer = this.value !== "pvp";
  aiMode = this.value;
  resetBoardBtn.click();
  resetScoreBtn.click();
});

// Computer move AI
function computerMove() {
  let move;
  if (aiMode === "easy") move = easyMove();
  else if (aiMode === "medium") move = mediumMove();
  else move = hardMove();

  cells[move].textContent = "O";
  cells[move].classList.add("o");

  if (checkWin("O")) {
    endGame("O wins!");
    updateScore("O");
    return;
  }
  if (isDraw()) {
    endGame("Draw!");
    updateScore("Draw");
    return;
  }

  currentPlayer = "X";
  statusDiv.textContent = `Turn: ${currentPlayer}`;
  statusDiv.style.color = "#ff4d4d";
}

// Easy AI → random
function easyMove() {
  const empty = cells.map((c,i)=>c.textContent===""?i:null).filter(i=>i!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

// Medium AI → block & win
function mediumMove() {
  return findWinningMove("O") ?? findWinningMove("X") ?? easyMove();
}

// Hard AI → minimax
function hardMove() {
  return minimax(getBoardArray(), "O").index;
}

// Helpers for AI
function findWinningMove(player) {
  for (let i=0;i<9;i++){
    if(cells[i].textContent===""){
      cells[i].textContent=player;
      if(checkWin(player)){ cells[i].textContent=""; return i; }
      cells[i].textContent="";
    }
  }
  return null;
}

function getBoardArray() {
  return cells.map(c => c.textContent === "X" ? "X" : c.textContent === "O" ? "O" : "");
}

// Minimax
function minimax(newBoard, player) {
  const avail = newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  const winner = checkWinner(newBoard);
  if (winner === "X") return {score: -10};
  if (winner === "O") return {score: 10};
  if (winner === "Draw") return {score: 0};

  const moves = [];
  for (let i of avail) {
    const move = {};
    move.index = i;
    newBoard[i] = player;
    const result = minimax(newBoard, player === "O" ? "X" : "O");
    move.score = result.score;
    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
    return bestMove;
  } else {
    let bestScore = Infinity;
    for (let m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
    return bestMove;
  }
}

function checkWinner(board) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every(v => v !== "") ? "Draw" : null;
}
