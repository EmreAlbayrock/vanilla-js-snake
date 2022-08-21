const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed;

let tileCount;
let tileSize;
let tileDrawSize;

let headX;
let headY;

let snakeParts;

let tailLength;

let appleX;
let appleY;

let xVelocity;
let yVelocity;

let score;

let gameOver;

resetGlobalVariables();

function drawGame() {
  document.body.addEventListener("keydown", keyDown);
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    document.body.removeEventListener("keydown", keyDown);
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();
  console.log(snakeParts);
  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";
    ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 1.9);

    let restartButton = document.createElement("button");
    restartButton.innerHTML = "Restart";
    restartButton.id = "restart";
    document.body.appendChild(restartButton);
    restartButton.focus();
    restartButton.addEventListener("click", restartGame);
  }
  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "15px Verdana";
  ctx.fillText("Score " + score, canvas.width - 70, 15);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(
      part.x * tileSize,
      part.y * tileSize,
      tileDrawSize,
      tileDrawSize
    );
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = "lightgreen";
  ctx.fillRect(headX * tileSize, headY * tileSize, tileDrawSize, tileDrawSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(
    appleX * tileSize,
    appleY * tileSize,
    tileDrawSize,
    tileDrawSize
  );
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    tailLength++;
    score++;
    speed = speed + increaseSpeed;
    generateApple();
  }
}

function generateApple() {
  appleX = Math.floor(Math.random() * tileCount);
  appleY = Math.floor(Math.random() * tileCount);
  checkValidApple();
}

function checkValidApple() {
  if (
    snakeParts.some((part) => part.x === appleX && part.y === appleY) ||
    (appleX === headX && appleY === headY)
  ) {
    generateApple();
  }
}

function keyDown(event) {
  document.body.removeEventListener("keydown", keyDown);
  if (
    (event.keyCode == 38 || event.keyCode == 87) &&
    !(xVelocity === 0 && yVelocity === 1)
  ) {
    yVelocity = -1;
    xVelocity = 0;
  }

  if (
    (event.keyCode == 40 || event.keyCode == 83) &&
    !(xVelocity === 0 && yVelocity === -1)
  ) {
    yVelocity = 1;
    xVelocity = 0;
  }

  if (
    (event.keyCode == 37 || event.keyCode == 65) &&
    !(xVelocity === 1 && yVelocity === 0)
  ) {
    yVelocity = 0;
    xVelocity = -1;
  }

  if (
    (event.keyCode == 39 || event.keyCode == 68) &&
    !(xVelocity === -1 && yVelocity === 0)
  ) {
    yVelocity = 0;
    xVelocity = 1;
  }
}

drawGame();

function restartGame() {
  resetGlobalVariables();
  removeButton();
  drawGame();
}

function resetGlobalVariables() {
  speed = 10;
  increaseSpeed = 0.2;

  tileCount = 20;
  tileSize = canvas.width / tileCount;
  tileDrawSize = tileSize - 2;

  headX = Math.floor(Math.random() * tileCount);
  headY = Math.floor(Math.random() * tileCount);

  snakeParts = [];

  tailLength = 2;

  appleX = Math.floor(Math.random() * tileCount);
  appleY = Math.floor(Math.random() * tileCount);

  xVelocity = 0;
  yVelocity = 0;

  score = 0;

  gameOver = false;
}

function removeButton() {
  let restart = document.getElementById("restart");
  restart.remove();
}
