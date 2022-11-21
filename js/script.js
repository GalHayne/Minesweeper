const BOMB = "💣";
let FLAG = "🚩";
let QEUSTION = "❔";

let gRowSize = 5;
let gColSize = 5;
let gNumberOfBomb = 4;
let gEmptyCells = gRowSize * gColSize - gNumberOfBomb;
let gStartTime;
let gIntervalID;

let gGame = {
  healthPoint: 3,
  level: "Easy",
  gameOn: true,
  isWin: false,
  isFirstCell: true,
};

let gBoard = [];
let gBombsLocations = [];
let gFlagLocations = [];
let gHelath;

function init() {
  zeroTimer();
  endTimer();
  gHelath = ["❤", "❤", "❤"];
  gGame.isFirstCell = true;
  gStartTime = 0;
  gGame.gameOn = true;
  gGame.healthPoint = 3;
  gGame.isWin = false;
  gFlagLocations = [];
  gBombsLocations = [];
  gBoard = createBoard();
  BombOnBoard(gBoard);
  gBoard = countBoomsNeighbors(gBoard);
  calcBoardSize();
  changeSmileyFace();
  printMat(gBoard, ".board-container");
  printHealth();
}

function createBoard() {
  let borad = [];

  for (let i = 0; i < gRowSize; ++i) {
    borad[i] = [];
    for (let j = 0; j < gColSize; ++j) {
      let cell = borad[i][j];
      borad[i][j] = { value: 0, isBomb: false, isFlag: false, isOpen: false };
    }
  }
  return borad;
}

function cellClick(elCell) {
  let location = getCellLocation(elCell);
  if (gGame.isFirstCell === true) {
    gGame.isFirstCell = false;
    startTimer();
  }

  checkCell(location, elCell);
}

function checkCell(location, elCell) {
  let board = gBoard;
  let cell = board[location.i][location.j];
  cell.isOpen = true;
  if (cell.value === BOMB) {
    --gGame.healthPoint;
    gHelath.pop();
    printHealth();
    elCell.classList.add("cellWithBomb");
    renderCell(elCell, cell.value);
    removeBomb(location);
    if (gGame.healthPoint === 0) {
      gameOver();
    }
  } else if (cell.value === 0) {
    openNeight(location, elCell);
    if (cell.isFlag === true) {
      renderCell(elCell, "");
      cell.isFlag = false;
    }
    elCell.classList.add("cellClicked");
  } else if (cell.value > 0) {
    renderCell(elCell, cell.value);
    elCell.classList.add("cellWithNumber");
  }
  removeClickAtt(elCell);
}

function openNeight(location, elCell) {
  let board = gBoard;
  let fromRow = location.i - 1;
  let fromCol = location.j - 1;
  let toRow = fromRow + 3;
  let toCol = fromCol + 3;
  for (let i = fromRow; i < toRow; ++i) {
    if (i < 0 || i === gRowSize) {
      continue;
    }
    for (let j = fromCol; j < toCol; ++j) {
      if (j < 0 || j === gColSize || (location.i === i && location.j === j)) {
        continue;
      } else if (board[i][j].isOpen === false) {
        let selector = getSelector({ i, j });
        let elCell = document.querySelector(selector);
        checkCell({ i, j }, elCell);
      }
    }
  }
}

function rightClick(event, elCell) {
  let location = getCellLocation(elCell);
  let value = gBoard[location.i][location.j];

  switch (value.isFlag) {
    case false: {
      value.isFlag = true;
      value.isOpen = true;
      renderCell(elCell, FLAG);
      addFlag(location);
      if (checkForWinner()) {
        gameOver();
      }
      break;
    }
    case true: {
      value.isFlag = false;
      value.isOpen = false;
      renderCell(elCell, "");
      removeFlag(location);
      break;
    }
  }
}

function renderCell(elCell, value) {
  elCell.innerHTML = value;
}
function removeBomb(location) {
  for (let i = 0; i < gBombsLocations.length; ++i) {
    let bomb = gBombsLocations[i];
    if (bomb.i === location.i && bomb.j === location.j) {
      gBombsLocations.splice(i, 1);
      break;
    }
  }
}

function addBomb(location) {
  gBombsLocations.push({ i: location.i, j: location.j });
}

function removeFlag(location) {
  for (let i = 0; i < gFlagLocations.length; ++i) {
    let flag = gFlagLocations[i];
    if (flag.i === location.i && flag.j === location.j) {
      gFlagLocations.splice(i, 1);
      break;
    }
  }
}

function addFlag(location) {
  gFlagLocations.push({ i: location.i, j: location.j });
}

function checkForWinner() {
  if (gFlagLocations.length !== gBombsLocations.length) {
    return false;
  } else {
    let found;
    for (let i = 0; i < gFlagLocations.length; ++i) {
      found = false;
      let flag = gFlagLocations[i];

      for (let j = 0; j < gBombsLocations.length; ++j) {
        let bomb = gBombsLocations[j];
        if (bomb.i === flag.i && bomb.j === flag.j) {
          found = true;
          continue;
        }
      }

      if (found === false) {
        return;
      }
    }
    gGame.isWin = true;
    gameOver();
  }
}

function gameOver() {
  for (let i = 0; i < gRowSize; ++i) {
    for (let j = 0; j < gColSize; ++j) {
      if (gBoard[i][j].isFlag === true || gBoard[i][j].isOpen === false) {
        let selector = getSelector({ i, j });
        let elCell = document.querySelector(selector);
        let cell = gBoard[i][j];
        if (cell.value === BOMB || cell.value > 0) {
          renderCell(elCell, cell.value);
        }
        elCell.classList.add("cellClicked");
        removeClickAtt(elCell);
      }
    }
  }

  endTimer();
  gGame.gameOn = false;
  changeSmileyFace();
}

function changeSmileyFace() {
  let smiley = document.querySelector(".imgBtn");

  if (gGame.gameOn === true) {
    smiley.innerHTML = '<img class="smiley" src="img/smileyReg.png"/>';
  } else if (gGame.isWin === false) {
    smiley.innerHTML = '<img class="smiley" src="img/smiley.png"/>';
  } else {
    smiley.innerHTML = '<img class="smiley" src="img/smileyWin.png"/>';
  }
}
