const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 500;
const canvasHeight = 500;


const circleRadius = 15;
const bigCircleRadius = 250;
// global circles array
let circles = [];
const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

//spawner
spawned = 0;
let canSpawn = true;
const howManyCircles = 50;
let initialVelocity = { x: 1, y: 1 }
spawnerDelay = 200;

// nice square... i tried to do circle but i'm not sure how to do it
const directions = [
    {x: 0, y: -1},
    
    {x: 0.25, y: -1},
    {x: 0.5, y: -1},
    {x: 0.75, y: -1},

    {x: 1, y: -1},

    {x: 1.5, y: -1},
    {x: 1.75, y: -1},
    {x: 2, y: -1},

    {x: 1, y: 0},

    // {x: 1, y: 0.5},
    // {x: 1, y: 1},
    // {x: 1, y: 2},

    // {x: 0, y: 1},
    


    // {x: -1, y: 1},
]

const getNormalizedVector = (vector) => {
    if(vector.x == 0 || vector.y == 0){
        return {x: 2*vector.x, y: 2*vector.y}
    }
    mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    const newVector = {x: 2*vector.x/mag, y: 2*vector.y/mag}
    return newVector
}

const drawAllElements = () => {
    for (let i = 0; i < circles.length; i++) {
        ctx.beginPath();
        ctx.arc(circles[i].position.x, circles[i].position.y, circleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
}

const getRandomFloat = (min, max, decimals) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

const spawnCircle = (velocity) => {
    circlePosition = { x: center.x, y: center.y };
    circleVelocity = { x: velocity.x, y: velocity.y };
    const c1 = new Circle(circlePosition, circleVelocity);
    circles.push(c1);
}
let startingIndex = 0;
const spawnerManager = () => {
    if (!canSpawn) { return; }
    if (spawned < howManyCircles) {
        const velocity = directions[startingIndex];
        const normalizedVelocity = getNormalizedVector(velocity);

        spawnCircle(normalizedVelocity);
        spawned += 1;
        startingIndex += 1;
        setTimeout(spawnerManager, spawnerDelay)
    } else {
        canSpawn = false;
    }
}

const start = () => {

    spawnerManager();
    update();
}

const updateAllPositions = () => {
    // if distance from circle position to center of canvas is more than big circle radius then change the position.
    for (let i = 0; i < circles.length; i++) {
        circles[i].position.x += circles[i].velocity.x;
        circles[i].position.y += circles[i].velocity.y;
        // checking if not too far
        var a = circles[i].position.x - center.x;
        var b = circles[i].position.y - center.y;

        var c = Math.sqrt(a * a + b * b);
        if (c > (bigCircleRadius - circleRadius)) {
            // change velocity sign
            circles[i].velocity = { x: -circles[i].velocity.x, y: -circles[i].velocity.y }
        }
    }
}

const refreshCanvas = () => {
    // clear canvas
    ctx.fillStyle = "rgb(169, 169, 169)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // draw big circle
    drawBigCircle();

    // drawAllCircles
    drawAllElements();

}

const drawBigCircle = () => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, bigCircleRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}

const update = () => {
    updateAllPositions();
    refreshCanvas();
    setTimeout(update, 1);
}

class Circle {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
}

window.onload = start;