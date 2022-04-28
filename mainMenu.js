let ring_graphics;
// CANVAS ELEMENT
let cnv;
let coords = [];
let screenHeight = 400;
let screenWidth = 400; //copy paste this code at the top of every game to have universal vars for screen size

function preload() {
  // LOADING IN THE TEXTURE FOR THE PLANET
  planet_texture = loadImage("assets/planet_texture_map.jpeg");
  // LOAD IN THE FONT FOR THE TEXT
  SpaceMono = loadFont("assets/SpaceMono-Bold.ttf");
  // LOAD THE SOUND
  soundFormats('mp3');
  bgMusic = loadSound("assets/BackgroundMusic-MM.mp3");
  buttonClick = loadSound("assets/buttonPress.mp3");
}

function setup() {
  cnv = createCanvas(800, 800, WEBGL);
  noStroke();
  
  // PLAY THE BG MUSIC
  bgMusic.play();
  bgMusic.loop();

  // GENERATE THE IMAGE FOR THE RINGS
  generateRingImage();

  // MAKE THE CAMERA
  sceneCamera = createCamera();
  sceneCamera.lookAt(0, 0, 0);
  sceneCamera.ortho(-200, 200, -200, 200, 0, 1000); //-width / 2, width / 2, -height / 2, height / 2, 0, 500)

  // MAKE STAR COORDS;
  if (coords) {
    for (let i = 0; i < 500; i++) {
      coords.push([
        random(-windowWidth / 2, windowWidth / 2),
        random(-height / 2, height / 2),
      ]);
    }
  }

  // CREATE BUTTONS FOR NAVIGATION
  MiningButton = createButton("Asteroid Mining");
  MiningButton.parent(cnv.parent());
  MiningButton.position(150, 600);
  MiningButton.size(200);
  MiningButton.style("color", "#FFC600");
  MiningButton.style("background-color", "#5800FF");
  MiningButton.style("font-size", "20px");
  MiningButton.style("border", "none");
  MiningButton.style("box-shadow", "0 0 0 .5em #5800FF");
  MiningButton.class("spaceButton");
  MiningButton.mousePressed(function () {
    buttonClick.onended(function () {location.href = "asteroidMine.html";})
    buttonClick.play();
  }); //put your game URL here

  ShootButton = createButton("Asteroid Shoot");
  ShootButton.parent(cnv.parent());
  ShootButton.position(450, 600);
  ShootButton.size(200);
  ShootButton.style("color", "#FFC600");
  ShootButton.style("background-color", "#5800FF");
  ShootButton.style("font-size", "20px");
  ShootButton.style("border", "none");
  ShootButton.style("box-shadow", "0 0 0 .5em #5800FF");
  ShootButton.class("spaceButton");
  ShootButton.mousePressed(function () {
    buttonClick.onended(function () {location.href = "asteroidShoot.html";})
    buttonClick.play();
  }); //put your game URL here

  PilotButton = createButton("Starship Pilot");
  PilotButton.parent(cnv.parent());
  PilotButton.position(450, 675);
  PilotButton.size(200);
  PilotButton.style("color", "#FFC600");
  PilotButton.style("background-color", "#5800FF");
  PilotButton.style("font-size", "20px");
  PilotButton.style("border", "none");
  PilotButton.style("box-shadow", "0 0 0 .5em #5800FF");
  PilotButton.class("spaceButton");
  PilotButton.mousePressed(function () {
    buttonClick.onended(function () {location.href = "starshipPilot.html";})
    buttonClick.play();
  });

  TranslateButton = createButton("Alien Translate");
  TranslateButton.parent(cnv.parent());
  TranslateButton.position(150, 675);
  TranslateButton.size(200);
  TranslateButton.style("color", "#FFC600");
  TranslateButton.style("background-color", "#5800FF");
  TranslateButton.style("font-size", "20px");
  TranslateButton.style("border", "none");
  TranslateButton.style("box-shadow", "0 0 0 .5em #5800FF");
  TranslateButton.class("spaceButton");
  TranslateButton.mousePressed(function () {
    buttonClick.onended(function () {location.href = "alienTranslate.html";})
    buttonClick.play();
  }); 
}

function draw() {
  background(0);

  // ORBIT CONTROL
  // orbitControl(10, 10);

  // DEFINE CAMERA ROTATION
  let rotation = map(mouseX, 0, windowWidth, -PI / 20, PI / 20, 0);

  // GENERATE THE TEXT
  push();
  noStroke();
  blendMode(ADD);
  fill("#FFC600");
  textAlign(CENTER, CENTER);
  textSize(40);
  textFont(SpaceMono);
  text("Planet Games", 0, -170);
  pop();

  // GENERATE STARRY BACKGROUND
  generateStarSky(rotation);

  // CONTROL CAMERA ROTATION
  rotateY(rotation);
  rotateX(rotation / 2);

  // ADD SOME LIGHT SOURCES
  ambientLight(70);
  directionalLight(250, 250, 250, 0.4, 0.4, -1);

  generatePlanet();
  makeRings();
}

function generatePlanet() {
  push();
  // ROTATE THE PLANET ALONG THE Y AXIS
  rotateY(frameCount * 0.01);

  // SET THE TEXTURE OF THE PLANET
  texture(planet_texture);

  // CREATE THE PLANET
  shininess(10);
  blendMode(ADD);
  sphere(70);
  pop();
}

function generateRingImage() {
  // SET UP THE RING COLOR
  ring_graphics = createGraphics(200, 200);
  ring_graphics.background(255);
  ring_graphics.noStroke();
  ring_graphics.drawingContext.globalAlpha = 1;
  ring_graphics.ellipse(
    ring_graphics.width / 2,
    ring_graphics.height / 2,
    100,
    100
  );
  let grad_color = ring_graphics.drawingContext.createRadialGradient(
    100,
    100,
    50,
    100,
    100,
    100
  );
  grad_color.addColorStop(0, "black");
  grad_color.addColorStop(0.15, "#cc8237"); // #6A0572
  grad_color.addColorStop(0.25, "#e1913f"); // #9A0F98
  grad_color.addColorStop(0.45, "#cc8237"); // #6A0572
  grad_color.addColorStop(0.5, "black");
  grad_color.addColorStop(0.55, "#f4a15c"); // #180750
  grad_color.addColorStop(0.75, "#ffc594"); // #6A0572
  grad_color.addColorStop(0.99, "#cc8237"); // #EA0599
  grad_color.addColorStop(1, "black");
  ring_graphics.drawingContext.fillStyle = grad_color;
  ring_graphics.circle(100, 100, 300);

  // MAKE SMALL ASTEROIDS
  for (k = 0; k < 50; k++) {
    let pos = random(0, TWO_PI);
    let radius = 80 + random(-3, 3);

    ring_graphics.fill("black");
    ring_graphics.drawingContext.shadowBlur = 1;
    ring_graphics.drawingContext.shadowColor = "white";

    ring_graphics.circle(
      cos(pos) * radius + 100,
      sin(pos) * radius + 100,
      random(1, 2)
    );

    let outer_pos = pos - random(0, PI);
    let outer_radius = radius + random(10, 15);

    ring_graphics.circle(
      cos(outer_pos) * outer_radius + 100,
      sin(outer_pos) * outer_radius + 100,
      random(1, 3)
    );
  }
}

function makeRings() {
  // MAKE THE RING TURN DIFFERENTLY FROM THE PLANET
  push();

  // APPLY THE RING TEXTURE
  texture(ring_graphics);

  // ROTATE THE RING
  rotateX(PI / 4);
  rotateY(-PI / 4);
  rotate(frameCount * -0.01);

  // SET TRANSPARENCY
  tint(255, 90);
  blendMode(SCREEN);
  smooth();
  ellipse(0, 0, 300, 300, 50);

  pop();

  // SHOW THE RING IMAGE
  // image(ring_graphics, 0, 0)
}

function generateStarSky(rotation) {
  let posX = 0;
  let posY = 0;

  for (let i = 0; i < 500; i++) {
    push();
    translate(posX, posY, -30);
    posX = coords[i][0] - map(rotation, -PI / 10, PI / 10, -20, 20, 0);
    posY = coords[i][1];

    // EMISSIVE MATERIAL
    // CHOOSE A RANDOM STARLIGHT COLOR
    // emissiveMaterial(random(["#ffcda5", "#ffd250", "#ff8220", "#fff220", "#ff5000"]))
    // CREATE THE STARS
    sphere(1);
    pop();
  }
}
