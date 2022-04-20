let timerVal = 60;
let x, y;
let radius = 50;
let score = 0;
let crater_list = {};

// SET THE TEXT FONT
function preload() {
  SpaceMono = loadFont("assets/SpaceMono-Bold.ttf");
}

function setup() {
  // SET THE TEXT FONT
  textFont(SpaceMono);
  
  createCanvas(800, 800);
  background(0);
  x = random(0, 800);
  y = random(0, 800);
  drawAsteroid(x - 400, y - 400, true);

  
  // SET UP THE INITIAL TEXT
  fill('#FFC600')
  textSize(30);
  text("Score: " + score, 340, 55);
  text("Asteroid Shooter", 290, 30);
  setInterval(timeGame, 1000);
  frameRate(30);  
}

function draw() {
  background(0);
  fill('#FFC600');
  noStroke(); 
  
  //These create surrounding stars
  star(100, 700, 30, 70, 1000);
  star(700, 100, 30, 70, 1000);
  star(100, 100, 30, 70, 1000);
  star(700, 700, 30, 70, 500);
  
  stars(400, 400, 30, 70, 1500);  //Creates a sun in the center
  
  textSize(30);
  text("Score: " + score, 340, 55);
  text("Asteroid Shooter", 290, 30);
  
  if(timerVal <= 60) {             
  text("" + timerVal, 375, 82);
  }
  if(timerVal == 0) {
  text('Game Over', 320, 105);
  }
  
  if(crater_list == false){
    drawAsteroid(x - 400, y - 400, true);
  } else {
    drawAsteroid(x - 400, y - 400, false);
  }
}

function mousePressed(){
  let d = dist(mouseX, mouseY, x, y);
    if (d < radius) {
      x = random(0, 800);
      y = random(0, 800);
      background(0);
      drawAsteroid(x - 400, y - 400, true);
      score++;
    }
    else {
      background(0);
      drawAsteroid(x - 400, y - 400, false);
      score--;
    }

  fill('#FFC600')
  text("Score: " + score, 340, 55);
  text("Asteroid Shooter", 290, 30);
}

function timeGame() {    //Function to decrease time from the timer
  if(timerVal > 0) {
    timerVal--;
  }
}

function star(x, y, radius1, radius2, points) {    //Function of the moving stars
  
  //Sets the color of the stars
  fill('#00FFFF')
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  
  //Begins the shape of the star
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    
    let sx = x + cos(a) * 15;  //Sets the radius 2 of the star
    let sy = y + sin(a) * 15;  //Sets the radius 2 of the star
    
    vertex(sx, sy);
    
    sx = x + cos(a + halfAngle) * 75;  //Sets the radius 1 of the star
    sy = y + sin(a + halfAngle) * 75;  //Sets the radius 1 of the star
    
    vertex(sx, sy);
}
  endShape(CLOSE);
}
  
function stars(x, y, radius1, radius2, points) {    //Function of the non-moving stars
  
  //Sets the color of the stars
  fill('#FFFF00')
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  
  //Begins the shape of the star
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    
    let sx = x + cos(a) * 50;  //Sets the radius 2 of the star
    let sy = y + sin(a) * 50;  //Sets the radius 2 of the star
    
    vertex(sx, sy);
    
    sx = x + cos(a + halfAngle) * 150;  //Sets the radius 1 of the star
    sy = y + sin(a + halfAngle) * 150;  //Sets the radius 1 of the star
    
    vertex(sx, sy);
}
  endShape(CLOSE);
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
