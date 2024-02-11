const canvas = document.getElementById("casseBrique");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let paddleX = (canvas.width - 75) / 2;
const paddleHeight = 5;
const paddleWidth = 75;

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 4;
const brickColumnCount = 8;
const brickWidth = 60;
const brickHeight = 30;
const brickPadding = 10;
const brickOffsetTop = 60;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status == 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    const ballImage = new Image();
    ballImage.src = '../../assets/casse_briques/balle.png';
    ctx.drawImage(ballImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    const paddleImage = new Image();
    paddleImage.src = '../../assets/casse_briques/raquette.png';
    ctx.drawImage(paddleImage, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                const brickImage = new Image();
                brickImage.src = '../../assets/casse_briques/briques.png';
                ctx.drawImage(brickImage, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

let gameoverDialogShown = false; 

function showGameOverDialog() {
    if (!gameoverDialogShown) {
        gameoverDialogShown = true;

        const gameOverDialog = document.createElement("div");
        gameOverDialog.className = "game-over-dialog";
        gameOverDialog.innerHTML = `
            <div style="text-align: center;">
                <p>Vous avez perdu ! Votre score est : ${score}</p>
                <button onclick="rejouer()">Rejouer</button>
                <button onclick="arreter()">Arrêter</button>
            </div>
        `;
        gameOverDialog.style.position = "fixed";
        gameOverDialog.style.top = "50%";
        gameOverDialog.style.left = "50%";
        gameOverDialog.style.transform = "translate(-50%, -50%)";
        gameOverDialog.style.backgroundColor = "#ffffff";
        gameOverDialog.style.padding = "20px";
        gameOverDialog.style.borderRadius = "5px";
        gameOverDialog.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
        gameOverDialog.style.zIndex = "1000000";

        document.body.appendChild(gameOverDialog);
    }
}

function rejouer() {
    document.location.reload();
}

function arreter() {
    gameoverDialogShown = true;

    const gameOverDialog = document.querySelector(".game-over-dialog");
    gameOverDialog.parentNode.removeChild(gameOverDialog);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scoreElement.textContent = score;

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            showGameOverDialog();
            dx = 0;
            dy = 0;
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();

function retourAccueil() {
    window.location.href = "../../index.html";
}