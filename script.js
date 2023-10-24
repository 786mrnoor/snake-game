const board = document.getElementById('board');
const canvas = document.getElementById('canvas');
const wrapper = document.getElementsByClassName('wrapper')[0];
const scoreBoard = document.getElementById('score-board');
const controlBoard = document.getElementById('control-board');
const levelBoard = document.getElementsByClassName('level')[0];
const gameOverBoard = document.getElementsByClassName('game-over')[0];
const settingBoard = document.getElementsByClassName('setting')[0];

let myGame = {
    size: 0,
    speed: 0,
    block: 30,
    score: 0,
    intervalId: false,
}
myGame.highScore = window.localStorage.getItem('high-score') || 0;
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    myGame.controls = true;
}

let dirX = 1, dirY = 0;
let myFood;
let snakeBody = [];
resize();

function startGame() {
    myGameArea.start();

    myFood = new component(0, 0, 'red');
    changeFoodPosition();
    snakeBody[0] = new component(0, 0, 'yellow');
    myFood.update();
    snakeBody[0].update();

    myGame.intervalId = setInterval(updateGame, myGame.speed);
    console.log(myGame.speed);
    window.addEventListener('keydown', changeDirection);
}

function updateGame() {
    //if snake has eaten the food;
    if (snakeBody[0].crash(myFood)) {
        snakeBody.push(new component(myFood.x, myFood.y, 'white'));
        changeFoodPosition();
        myGame.score += 1;
        scoreBoard.innerText = `Score: ${myGame.score}`;
    }

    myGameArea.clear();
    myFood.update();

    let head = {
        x: snakeBody[0].x + dirX,
        y: snakeBody[0].y + dirY
    };

    for (let i = snakeBody.length - 1; i > 0; i -= 1) {
        snakeBody[i].x = snakeBody[i - 1].x;
        snakeBody[i].y = snakeBody[i - 1].y;
        snakeBody[i].update();
        // if snake hit his own body
        if (snakeBody[i].crash(head)) {
            gameOver();
        }
    }
    if (head.x < 0 || head.x >= myGame.block || head.y < 0 || head.y >= myGame.block) {
        gameOver();
    }

    snakeBody[0].x += dirX;
    snakeBody[0].y += dirY;

    snakeBody[0].update();


}

function clearGame() {
    dirX = 1;
    dirY = 0;
    myGame.score = 0;
    scoreBoard.innerText = `Score: 0`;
    snakeBody = [];
}
function tryAgain() {
    clearGame()
    gameOverBoard.classList.add('out');
    // if touch device then we show controls
    if (myGame.controls) {
        controlBoard.classList.add('active');
    }
    setTimeout(() => {
        gameOverBoard.style.display = 'none';
        startGame();
    }, 800)
}

function gameOver() {
    clearInterval(myGame.intervalId);
    window.removeEventListener('keydown', changeDirection);
    gameOverBoard.style.display = 'flex';
    gameOverBoard.classList.remove('out');
    controlBoard.classList.remove('active');
    if (myGame.score > myGame.highScore) {
        myGame.highScore = myGame.score;
        window.localStorage.setItem('high-score', myGame.score);
        console.log('new HighScore');
    }
}

function changeFoodPosition() {
    myFood.x = Math.floor(Math.random() * myGame.block);
    myFood.y = Math.floor(Math.random() * myGame.block);
}

function chooseLevel(t) {
    myGame.speed = t;
    levelBoard.classList.add('out');
    scoreBoard.style.display = 'inline';
    // if touch device then we show controls
    if (myGame.controls) {
        controlBoard.classList.add('active');
    }
    setTimeout(() => {
        levelBoard.style.display = 'none';
        levelBoard.classList.remove('out');
        startGame();
    }, 1200);
}

function openSetting(t) {
    if (settingBoard.style.display == 'none') {
        settingBoard.style.display = 'flex';
        scoreBoard.style.display = 'none';
        setTimeout(() => {
            settingBoard.classList.remove('out');
            t.classList.remove('fa-gear');
            t.classList.add('fa-xmark');
        }, 500);
    }
    else {
        settingBoard.classList.add('out');
        setTimeout(() => {
            settingBoard.style.display = 'none';
            settingBoard.classList.remove('out');
            t.classList.add('fa-gear');
            t.classList.remove('fa-xmark');
        }, 600);
    }
}

function component(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.update = function () {
        myGameArea.ctx.fillStyle = this.color;
        myGameArea.ctx.fillRect(
            this.x * myGame.size,
            this.y * myGame.size,
            myGame.size,
            myGame.size);
    }
    this.crash = function (other) {
        if (this.x === other.x && this.y === other.y) {
            return true;
        }
        return false;
    }
}

const myGameArea = {
    ctx: canvas.getContext('2d'),
    start: function () {
        canvas.width = myGame.size * 30;
        canvas.height = myGame.size * 30;
        canvas.style.display = 'block';
    },
    clear: function () {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function changeDirection(e) {
    let { key } = e;
    let t = false;
    if (key === 'ArrowUp' && dirY !== 1) {
        dirX = 0;
        dirY = -1;
        t = true;
    }
    else if (key === 'ArrowDown' && dirY !== -1) {
        dirX = 0;
        dirY = 1;
        t = true;
    }
    else if (key === 'ArrowRight' && dirX !== -1) {
        dirX = 1;
        dirY = 0;
        t = true;
    }
    else if (key === 'ArrowLeft' && dirX !== 1) {
        dirX = -1;
        dirY = 0;
        t = true;
    }
    if (t) {
        updateGame();
    }
}

window.addEventListener('resize', () => {
    console.log('resize', innerWidth);
    resize();
})

function resize() {
    let w = window.innerWidth;
    w = w > 390 ? 390 : w;
    myGame.size = Math.floor(w / myGame.block);
    wrapper.style.width = myGame.size * myGame.block + 'px';
}

function openLevelBoard() {
    clearGame();
    gameOverBoard.classList.add('out');
    setTimeout(() => {
        levelBoard.style.display = 'flex';
        gameOverBoard.style.display = 'none';
        gameOverBoard.classList.remove('out');
    }, 600)
}


// setTimeout(()=>{
//     gameOverBoard.classList.add('out');
// },400)