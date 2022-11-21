function countBoomsNeighbors(gBoard) {
  let board = gBoard;
  for (let i = 0; i < gRowSize; ++i) {
    for (let j = 0; j < gColSize; ++j) {
      let cell = board[i][j];
      if (cell.value !== BOMB) {
        board[i][j].value = countTheBomb({ i, j });
      }
    }
  }
  return board;
}

function countTheBomb(location) {
  let board = gBoard;
  let count = 0;
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
      } else if (board[i][j].value === BOMB) {
        gBoard[i][j].isBomb = true;
        ++count;
      }
    }
  }
  return count;
}

function calcBoardSize() {
  let elBorder = document.querySelector(".allBoard");
  let backGroundSize = gRowSize * 60 + 10;
  backGroundSize += "px";
  elBorder.style.width = `${backGroundSize}`;

  let elLevel = document.querySelector(".selectLevel");
  elLevel.style.width = `${backGroundSize}`;
}

function BombOnBoard(board) {
  //Manual Bomb
  // board[0][0].value = BOMB;
  // gBombsLocations.push({ i: 0, j: 0 });
  // board[0][1] = BOMB;
  // board[0][2] = BOMB;
  // board[0][3] = BOMB;
  // board[0][4] = BOMB;
  // board[1][0] = BOMB;
  // board[1][1] = BOMB;
  // board[1][2] = BOMB;
  // board[1][3] = BOMB;
  // board[1][4] = BOMB;
  // board[2][0] = BOMB;
  // board[2][1] = BOMB;
  // board[2][2] = BOMB;
  // board[2][3] = BOMB;
  // board[2][4] = BOMB;
  // board[3][0] = BOMB;
  // board[3][1] = BOMB;
  // board[3][2] = BOMB;
  // board[3][3] = BOMB;
  // board[3][4] = BOMB;
  // board[4][0] = BOMB;
  // board[4][1] = BOMB;
  // board[4][2] = BOMB;
  //   board[4][4].value = BOMB;
  //   board[4][3].value = BOMB;
  //   board[4][2].value = BOMB;
  //   board[3][2].value = BOMB;
  //   board[1][2].value = BOMB;
  //   board[0][2].value = BOMB;

  //Random Bomb
  let numberOfBomb = gNumberOfBomb;
  for (let i = 0; i < numberOfBomb; ++i) {
    let location = getRandomLocation();
    while (!isCellEmpty(location)) {
      location = getRandomLocation();
    }
    gBombsLocations.push(location);
    gBoard[location.i][location.j].value = BOMB;
  }
}

function isCellEmpty(location) {
  for (let i = 0; i < gBombsLocations.length; ++i) {
    let cell = gBombsLocations[i];
    if (cell.i === location.i && cell.j === location.j) {
      return false;
    }
  }
  return true;
}

function getRandomLocation() {
  let i = getRandomInRange(0, gRowSize);
  let j = getRandomInRange(0, gColSize);

  return { i, j };
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function printBoard(borad) {
  let table = [];
  for (let i = 0; i < gRowSize; ++i) {
    table[i] = [];
    for (let j = 0; j < gColSize; ++j) {
      let cell = borad[i][j];
      if (cell.value === BOMB) {
        table[i][j] = BOMB;
      } else {
        table[i][j] = cell.value;
      }
    }
  }
  console.table(table);
}

function printMat(mat, selector) {
  let strHTML = `<table border="0"><tbody>`;
  let cell;
  for (let i = 0; i < mat.length; ++i) {
    strHTML += `<tr>`;
    for (let j = 0; j < mat.length; ++j) {
      cell = "";
      strHTML += `<td oncontextmenu="rightClick(event,this)" onclick="cellClick(this)" class="cell cell-${i}-${j}">${cell}</td>`;
    }
    strHTML += `<tr>`;
  }
  strHTML += `</tbody></table>`;
  let elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function getCellLocation(elCell) {
  let cellClass = elCell.classList[1];
  let arr = cellClass.split("-");
  let i = parseInt(arr[1]);
  let j = parseInt(arr[2]);

  return { i, j };
}

function getSelector(location) {
  return `.cell-${location.i}-${location.j}`;
}

function changeLevel(elBtn) {
  let nextLevel = elBtn.innerHTML;

  let currLevel = gGame.level;
  let elDisabledBtn = document.querySelector(`.${currLevel}`);
  elDisabledBtn.removeAttribute("disabled", "");

  switch (nextLevel) {
    case "Easy":
      gRowSize = 5;
      gColSize = 5;
      gNumberOfBomb = 4;
      gGame.level = "Easy";
      disableCurrntLevel(elBtn);
      break;
    case "Medium":
      gRowSize = 8;
      gColSize = 8;
      gNumberOfBomb = 11;
      gGame.level = "Medium";
      disableCurrntLevel(elBtn);
      break;
    case "Hard":
      gRowSize = 10;
      gColSize = 10;
      gNumberOfBomb = 20;
      gGame.level = "Hard";
      disableCurrntLevel(elBtn);
      break;
  }
  init();
}

function disableCurrntLevel(elBtn) {
  elBtn.setAttribute("disabled", "");
}

function removeClickAtt(elCell) {
  elCell.removeAttribute("onclick");
  elCell.removeAttribute("oncontextmenu");
}

function endTimer() {
  if (gIntervalID) {
    clearInterval(gIntervalID);
  }
}

function startTimer() {
  let elMinutesLabel = document.getElementById("minutes");
  let elSecondsLabel = document.getElementById("seconds");

  gStartTime = Date.now();
  gIntervalID = setInterval(function () {
    let timeDiff = Date.now() - gStartTime;
    let currTime = new Date(timeDiff);

    elSecondsLabel.innerHTML = pad(currTime.getSeconds());
    elMinutesLabel.innerHTML = pad(currTime.getMinutes());
  }, 1000);
}

function pad(time) {
  if (time < 10) {
    return `0${time}`;
  }
  return time;
}

function zeroTimer() {
  let elMinutesLabel = document.getElementById("minutes");
  elMinutesLabel.innerHTML = "00";

  let elSecondsLabel = document.getElementById("seconds");
  elSecondsLabel.innerHTML = "00";
}

function printHealth() {
  let elHealth = document.querySelector(".health");

  let innerHealth = "";

  for (let i = 0; i < gHelath.length; ++i) {
    innerHealth += gHelath[i];
  }

  elHealth.innerHTML = innerHealth;
}
