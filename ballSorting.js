const availableColors = ['red', 'blue', 'orange', 'yellow', 'green', 'purple'];
let numTubesComplete = 0;
const tubes = document.querySelectorAll("div.tube");
const balls = document.querySelectorAll("div.ball");
let selectedBalls = document.querySelectorAll("div.selected");

function initializeGame() {
    const tubesContainer = document.getElementById("tubes-container");
    let randomDifficulty = Math.floor(Math.random() * (availableColors.length - 3) + 3);

    for (let f = 0; f < randomDifficulty; f++) {
        tubesContainer.append(createTube(filled=true));
    };

    tubesContainer.append(createTube());
    tubesContainer.append(createTube());
}

function createTube(filled=false) {
    const tube = document.createElement("div");
    tube.classList.add("tube");

    if (filled == true) {
        for (let b = 0; b < 4; b++) {
            const ball = document.createElement("div");
            ball.classList.add("ball");

            tube.append(ball);
        };
    };

    return tube;
}

function chooseRandomColors(diff) {
    let gameColors = []
    let attemptedColors = [];

    let i = 0;

    do {
        let randomColor = Math.floor(Math.random() * availableColors.length);
        let color = availableColors[randomColor]
        
        if (!(attemptedColors.includes(color))) {
            attemptedColors.push(color);
            gameColors.push(color);
            i++;
        };
    } while(i < diff);

    return gameColors;
}

function randomizeBalls() {
    const tubes = document.querySelectorAll("div.tube");
    const balls = document.querySelectorAll("div.ball");
    let diff = (tubes.length - 2);
    console.log(diff);
    let colors = chooseRandomColors(diff);
    let colorList = [];

    for (let i = 0; i < colors.length; i++) {
        colorList.push(colors[i]);
        colorList.push(colors[i]);
        colorList.push(colors[i]);
        colorList.push(colors[i]);
    }

    let currentIndex = colorList.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [colorList[currentIndex], colorList[randomIndex]] = [
            colorList[randomIndex], colorList[currentIndex]];
    }

    for (let b = 0; b < balls.length; b++) {
        balls[b].classList.add(colorList[b]);
    }
}

function pickUpBall(ball) {
    ball.stopPropagation();

    selectedBalls = document.querySelectorAll("div.selected");
    const parentTube = ball.target.parentNode;

    if (selectedBalls.length < 1 || ball.target.classList.contains("selected")) {
        if (ball.target == parentTube.firstElementChild) {
            ball.target.classList.toggle("selected");
            clearErrors();
        } else {
            logMessage("Must pick up ball from the top of the tube");
        };
    };

    selectedBalls = document.querySelectorAll("div.selected");
}

function checkTubeComplete(tube, color) {
    let ballCount = tube.target.childElementCount;
    let ballColors = []

    if (ballCount === 4) {
        let balls = tube.target.children
        for (var i = 0; i < (balls.length); i++) {
            ballColors.push(balls[i].classList[1]);
        }

        let isComplete = ballColors.every(val => val === color);

        if (isComplete) {
            numTubesComplete++;
            return "yes";
        } else {
            return "no";
        };
    } else {
        return "no";
    }
}

function dropBall(ball, tube) {
    tube.target.prepend(ball);
    ball.classList.toggle("selected");
    clearErrors();

    let tubeComplete = checkTubeComplete(tube, ball.classList[1]);

    if (tubeComplete === "yes") {
        tube.target.classList.toggle("tube-complete");
    };

    if (numTubesComplete === 3) {
        logMessage("You win");
    };
}

function moveBall(tube) {
    tube.stopPropagation();

    selectedBalls = document.querySelectorAll("div.selected");
    let ballCount = tube.target.childElementCount;

    if (selectedBalls.length === 1) {
        ballToMove = selectedBalls[0];

        if (ballCount === 4) {
            logMessage("Tube is full");
        } else if (ballCount === 0) {
            dropBall(ballToMove, tube);
        } else {
            let topBall = tube.target.firstElementChild;
            let topBallColor = topBall.classList[1];
            let selBallColor = ballToMove.classList[1]

            if (topBallColor == selBallColor) {
                dropBall(ballToMove, tube);
            } else {
                logMessage("Must drop ball on the same color");
            }
        }

    } else {
        logMessage("No ball is selected");
    };
}

function logMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    errorMessage.textContent = message;
}

function clearErrors() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
}


balls.forEach((ball) => {
    ball.addEventListener("click", pickUpBall);
})

tubes.forEach((tube) => {
    tube.addEventListener("click", moveBall);
})

document.addEventListener("DOMContentLoaded", function() {
    initializeGame();
    randomizeBalls();
});