let canvas;
let paddle1;
let paddle2;
let ball;
let xvel;
let yvel;
let score1 = 0;
let score2 = 0;
let bcolor = 0;
function setup() {
    canvas = createCanvas(windowWidth/2, windowHeight*0.75);
    canvas.position(windowWidth/4, windowHeight*0.225);
    paddle1 = new Paddle(width*0.05, height/2, color(255, 0, 0));
    paddle2 = new Paddle(width*0.95, height/2, color(0, 0, 255));
    ball = new Ball(width*0.5, height*0.55);
    xvel = random(5, 10);
    yvel = random(3, 5);
}
function draw() {
    background(bcolor);
    stroke(255);
    strokeWeight(3);
    line(width/2, 0, width/2, height);
    paddle1.draw();
    paddle2.draw();
    ball.draw();
    if(ball.y - ball.radius >= 0) {
        yvel = -yvel;
    }
    if(ball.y + ball.radius <= height) {
        yvel = -yvel;
    }
    if(keyIsDown(87) && keyIsDown(83) || !keyIsDown(87) && !keyIsDown(83)) {
        paddle1.yvel = 0;
    }
    else if(keyIsDown(87) && ((paddle1.y - paddle1.height/2) >= 0)) {
        paddle1.yvel = -5;
    }
    else if(keyIsDown(83) && ((paddle1.y + paddle1.height/2) <= height)) {
        paddle1.yvel = 5;
    }
    if(keyIsDown(UP_ARROW) && keyIsDown(DOWN_ARROW) || !keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW)) {
        paddle2.yvel = 0;
    }
    else if(keyIsDown(UP_ARROW) && ((paddle2.y - paddle2.height/2) >= 0)) {
        paddle2.yvel = -5;
    }
    else if(keyIsDown(DOWN_ARROW) && ((paddle2.y + paddle2.height/2) <= height)) {
        paddle2.yvel = 5;
    }
    if(keyIsDown(LEFT_ARROW)) {
        if(ball.hit() === 2) {
            xvel -= 5;
        }
    }
    if(keyIsDown(68)) {
        if(ball.hit() === 1) {
            xvel += 5;
        }
    }
    paddle1.move();
    paddle2.move();
    ball.move();
    if(ball.hit() === 1 || ball.hit() === 2) {
        xvel = -xvel;
    }
    if(ball.bounce() === 3 || ball.bounce() === 4) {
        yvel = -yvel;
    }
    if(ball.x <= width/2) {
        if(ball.x - ball.radius <= 0) {
            score2++;
            score(1);
        }
    }
    if(ball.x >= width/2) {
        if(ball.x + ball.radius >= width) {
            score1++;
            score(-1);
        }
    }
    stroke(0);
    textSize(12);
    fill("red");
    text("Red: " + score1, width*0.425, height*0.1);
    fill("blue");
    text("Blue: " + score2, width*0.525, height*0.1);
}
function keyPressed() {
    if(keyCode === LEFT_ARROW) {
        paddle2.strike(-5);
    }
    if(keyCode === 68) {
        paddle1.strike(5);
    }
    return false;
}
function keyReleased() {
    if(keyCode === LEFT_ARROW) {
        paddle2.release(-5);
    }
    if(keyCode === 68) {
        paddle1.release(5);
    }
    return false;
}
function score(scorer) {
    noLoop();
    background(0);
    xvel = scorer*5;
    ball.x = width/2;
    ball.y = height/2;
    if(score1 === 5) {
        textSize(20);
        stroke(0);
        fill("red");
        text("Red Paddle Wins!", width*0.4, height/2);
        setTimeout(() => {
            score1 = 0;
            score2 = 0;
            paddle1.y = height/2;
            paddle2.y = height/2;
            loop();
        }, 2000);
    }
    else if(score2 === 5) {
        textSize(20);
        stroke(0);
        fill("blue");
        text("Blue Paddle Wins!", width*0.4, height/2);
        setTimeout(() => {
            score1 = 0;
            score2 = 0;
            paddle1.y = height/2;
            paddle2.y = height/2;
            loop();
        }, 2000);
    }
    else {
        setTimeout(() => {
            paddle1.y = height/2;
            paddle2.y = height/2;
            bcolor = color(random(1, 255), random(1, 255), random(1, 255));
            if(bcolor === color(255, 0, 0) || bcolor === color(0, 0, 255)) {
                bcolor = color(0);
            }
            loop();
        }, 1000);
    }
}
class Paddle {
    constructor(xpos, ypos, color) {
        rectMode(CENTER);
        this.x = xpos;
        this.y = ypos;
        this.color = color;
        this.width = 10;
        this.height = 100;
        this.xvel = 1;
    }
    draw() {
        fill(this.color);
        stroke(0);
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height);
    }
    move() {
        this.y += this.yvel;
    }
    strike(facing) {
        this.x += this.xvel*facing;
    }
    release(facing) {
        this.x -= this.xvel*facing;
    }
}
class Ball {
    constructor(xpos, ypos) {
        this.x = xpos;
        this.y = ypos;
        this.radius = 15;
        this.color = color(255);
    }
    draw() {
        fill(this.color);
        stroke(this.color);
        ellipseMode(CENTER);
        circle(this.x, this.y, this.radius);
    }
    move() {
        this.x += xvel;
        this.y += yvel;
    }
    hit() {
        if((this.x - this.radius <= paddle1.x + paddle1.width/2) && (this.y - this.radius <= paddle1.y + (paddle1.height/2)) && (this.y + this.radius >= paddle1.y - (paddle1.height/2))) {
            return 1;
        }
        if((this.x + this.radius >= paddle2.x - paddle2.width/2) && (this.y - this.radius <= paddle2.y + (paddle2.height/2)) && (this.y + this.radius >= paddle2.y - (paddle2.height/2))) {
            return 2;
        }
    }
    bounce() {
        if((this.y - this.radius <= paddle1.y + (paddle1.height/2))) {
            if((this.x + this.radius >= paddle1.x - (paddle1.width/2)) && (this.x - this.radius <= paddle1.x + (paddle1.width/2)) && (dist(this.x, this.y, paddle1.x, paddle1.y) <= this.radius + (paddle1.height/2))) {
                return 3;
            }
        }
        if((this.y - this.radius <= paddle2.y + (paddle2.height/2))) {
            if((this.x + this.radius >= paddle2.x - (paddle2.width/2)) && (this.x - this.radius <= paddle2.x + (paddle2.width/2)) && (dist(this.x, this.y, paddle2.x, paddle2.y) <= this.radius + (paddle2.height/2))) {
                return 4;
            }
        }
    }
}