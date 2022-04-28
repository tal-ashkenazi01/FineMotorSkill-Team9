let timerVal = 60;  
let x, y;
let radius = 50;
let score = 0;
let crater_list = {};
let playAgain;

// BUTTON PLACEMENT CORRECTIONS
let cnv;

// SET THE TEXT FONT
function preload() {
  SpaceMono = loadFont("assets/SpaceMono-Bold.ttf");
  backgroundMusic = loadSound('assets/BackgroundMusic-AM.mp3')
  buttonClick = loadSound("assets/buttonPress.mp3");
  asteroidExplosion = loadSound('assets/explosion.mp3');
}

function setup() {
  // PLAY THE BACKGROUND MUSIC  
  backgroundMusic.play();
  backgroundMusic.loop();
  
  // SET THE TEXT FONT
  textFont(SpaceMono);
  textAlign(CENTER);
  
  // FIND THE MIDDLE POSITION
  cnv = createCanvas(800, 800);
  
  // ADD THE MAIN MENU BUTTON
  setUpReturn();
  
  //CREATES THE CANVAS AND SETS UP THE BACKGROUND AND INTIALIZES X AND Y
  background(0);
  x = random(0, 800);
  y = random(0, 800);
  drawAsteroid(x - 400, y - 400, true);

  // SET UP THE INITIAL TEXT
  textAlign(CENTER);
  fill('#FFC600')
  textSize(30);
  text("Score: " + score, 400, 55);
  text("Asteroid Shooter", 400, 30);
  setInterval(timeGame, 1000);
  frameRate(30);  
  
  //CREATES A PLAY AGAIN BUTTON TO RESTART THE GAME
  playAgain = createButton("Play again?");
  playAgain.parent(cnv.parent());
  playAgain.position(200, 500);
  playAgain.size(400);
  playAgain.style("color", "#FFC600");
  playAgain.style("background-color", "#5800FF");
  playAgain.style("font-size", "20px");
  playAgain.style("border", "none");
  playAgain.style("box-shadow", "0 0 0 .5em #5800FF");
  playAgain.mouseOver(function () {
    playAgain.style("box-shadow", "0 0 0 .55em #5800FF");
  });
  playAgain.mouseOut(function () {
    playAgain.style("box-shadow", "0 0 0 .5em #5800FF");
  });
  playAgain.class("spaceButton");
  playAgain.hide();
  playAgain.mousePressed(function () {
    buttonClick.play();
    startNewGame()});
}

function draw() {
  background(0);
  fill('#FFC600');
  noStroke(); 
  
  //CREATE SURROUNDING STARS TO CREATE SPACE
  star(100, 700, 100, 300, 5);
  star(700, 100, 30, 70, 5);
  star(100, 100, 30, 70, 5);
  star(700, 700, 30, 70, 5);
  star(500, 200, 30, 70, 5);
  star(300, 600, 30, 70, 5);
  star(150, 375, 30, 70, 5);
  star(600, 450, 30, 70, 5);
  
  //CREATES THE SUN IN THE CENTER OF THE SCREEN
  stars(400, 400, 30, 70, 1500); 
  
  //SETS UP TEXT SIZE TO 30
  textSize(30);
  text("Score: " + score, 400, 55);
  text("Asteroid Shooter", 400, 30);
  
  //SETS UP TIMER TO COUNT DOWN FROM 60 SECONDS
  if(timerVal <= 60) {             
  text("" + timerVal, 400, 82);
  }
  if(timerVal == 0) {
  text('Game Over', 400, 105);
  }
  
  //IF-ELSE STATEMENT TO CORRECTLY REDRAW ASTEROIDS WHILE THE TIMER COUNTS DOWN
  if(crater_list == false){
    drawAsteroid(x - 400, y - 400, true);
  } else {
    drawAsteroid(x - 400, y - 400, false);
  }
}

//FUNCTION MOUSEPRESSED TO INCREMENT SCORE AND RANDOMLY PLACE ASTEROIDS AFTER BEING CLICKED
function mousePressed(){
  let d = dist(mouseX, mouseY, x, y);
    if (d < radius) {
      x = random(0, 800);
      y = random(0, 800);
      background(0);
      asteroidExplosion.play();
      drawAsteroid(x - 400, y - 400, true);
      score++;
    }
    else {
      background(0);
      drawAsteroid(x - 400, y - 400, false);
      score--;
    }

  //REDRAWS TEXT AFTER EACH PRESS AND UPDATES THE SCORE COUNTER
  fill('#FFC600')
  text("Score: " + score, 340, 55);
  text("Asteroid Shooter", 290, 30);
}

//FUNCTION TIMEGAME THAT COUNTS DOWN FROM 60
function timeGame() {   
  if(timerVal > 0) {
    timerVal--;
  } else if(timerVal <= 0){
    endScreen();
  }
}

//FUNCTION TO CREATE STARS
function star(x, y, radius_1, radius_2, points) { 
  
  //SETS THE COLOR OF THE STARS
  fill('#ffffa1')
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  
  //CALCULATES THE SHAPE OF THE STARS
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    
    //SETS THE VARIBLE FOR SX AND SY
    let sx = x + cos(a) * 10;  
    let sy = y + sin(a) * 10; 
    
    vertex(sx, sy);
    
    //CALCULATES THE VARIABLE FOR SX AND SY
    sx = x + cos(a + halfAngle) * 5; 
    sy = y + sin(a + halfAngle) * 5;
    
    vertex(sx, sy);
}
  endShape(CLOSE);
}
  
//FUNCTION TO CREATE THE SUN IN THE CENTER OF THE SCREEN
function stars(x, y, radius1, radius2, points) { 
  
  //SETS THE COLOR OF THE SUN TO YELLOW
  fill('#FFFF00')
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  
  //CALCULATES THE SHAPE OF THE STARS
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    
    //SETS THE VARIABLES SX AND SY
    let sx = x + cos(a) * 50;  
    let sy = y + sin(a) * 50;  
    
    vertex(sx, sy);
    
    //CALCULATES THE VARIABLE FOR SX AND SY
    sx = x + cos(a + halfAngle) * 150;  
    sy = y + sin(a + halfAngle) * 150;  
    
    vertex(sx, sy);
}
  endShape(CLOSE);
}

function endScreen() {
  noLoop();
  background(0);
  textSize(50);
  text(`Final Score: ${score}`, 400, 400);
  fill('#ffc600')
  playAgain.show();
}

function startNewGame() {
  playAgain.hide();
  timerVal = 60;
  score = 0;
  loop();
}

function drawAsteroid(x_offset, y_offset, new_drawing) {  
  // RANDOMIZE THE SEED
  if (new_drawing) {
    noiseSeed(random(1000));
  }
    
  // BEGIN ASTEROID SHAPE
  beginShape();
  for (let i = 0; i <= TWO_PI; i += 0.01) {
    let xoff = map(cos(i), -1, 1, 0, 2);
    let yoff = map(sin(i), -1, 1, 0, 2);
    let r = map(noise(xoff, yoff, 0), 0, 1, 30, 50);
    let x = r * cos(i) + (width / 2) + x_offset;
    let y = r * sin(i) + (height / 2) + y_offset;
    vertex(x,  y);
  }
  
  // ASTEROID DISPLAY SETTINGS
  fill("#94908D")
  stroke("black");
  strokeWeight(1);
  
  // BORDER SHADOWS FOR THE ASTEROID BODY
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'white'
  endShape(CLOSE);
  
  // SET VALUES FOR THE CRATERS
  drawingContext.shadowBlur = 0;
  strokeWeight(1);
  stroke("#31302E")
  
  // CREATE A NUMBER OF CRATERS ACROSS THE ASTEROID
  for (let k = 0; k < TWO_PI; k += (PI/4)) {
    let xoff = map(cos(k), -1, 1, 0, 2);
    let yoff = map(sin(k), -1, 1, 0, 2);
    let random_radius = map(noise(xoff, yoff, 0), 0, 1, 3, 45); //random(50, 90)
    let x = random_radius * cos(k);
    let y = random_radius * sin(k);
    let crater_radius = 0;
    
    // IF NEW DRAWING DO CERTAIN ACTIONS
    if (new_drawing) {
      random_radius = random(5, 10);
      crater_list[`${k}`] = random_radius;
      crater_radius = random_radius;
    } else {
      crater_radius = crater_list[`${k}`]
    }
        
    // CREATE A GRADIENT FOR THE COLOR OF THE CRATERS STARTING IN THE MIDDLE OF THE CRATER
    let grad_color = drawingContext.createRadialGradient(x+(width / 2) + x_offset, y+(height / 2) + y_offset, crater_radius, x+(width / 2) + x_offset, y+(height / 2) + y_offset, crater_radius * 0.3);
    
    // ADD THE COLOR STOPS FOR THE CRATER
    grad_color.addColorStop(0, "#000000");
    grad_color.addColorStop(1, "#827e7c");
    drawingContext.fillStyle = grad_color;
    
    // CREATE THE CRATERS
    circle(x+(width / 2) + x_offset, y+(height / 2) + y_offset, crater_radius)  
  }
}

function setUpReturn() {
// CREATE THE BUTTON TO RETURN TO THE MAIN MENU WHEN THE GAME IS OVER
  returnButton = createButton("Main Menu");
  returnButton.parent(cnv.parent());
  returnButton.position(200, 825);
  returnButton.size(400);
  returnButton.style("color", "#FFC600");
  returnButton.style("background-color", "#5800FF");
  returnButton.style("font-size", "20px");
  returnButton.style("border", "none");
  returnButton.style("box-shadow", "0 0 0 .5em #5800FF");
  returnButton.mouseOver(function () {
    returnButton.style("box-shadow", "0 0 0 .55em #5800FF");
  });
  returnButton.mouseOut(function () {
    returnButton.style("box-shadow", "0 0 0 .5em #5800FF");
  });
  returnButton.class("spaceButton");
  returnButton.mousePressed(function () {
    buttonClick.onended(function () {location.href = "index.html";})
    buttonClick.play();
  }); 
}
