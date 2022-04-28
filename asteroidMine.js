// LOGGING FLAG TO CONTROL THE PRINTING STATEMENTS
let logging = false;

// ARRAY FOR THE POINTS OF THE ARRAY
let vertex_array = [];

// ARRAY FOR THE DISTANCES OF THE POINTS
let distance_array = [];
// INDEX 0: point 0 to 1
// INDEX 1: point 1 to 2
// INDEX 2: point 2 to 3
// INDEX 3: point 3 to 0

// FLAG FOR STARTING THE GAME
let started = false;

///////////////////////////
// SET UP THE GAME SESSION
let passed_menu = false;
let casual = false;
let scored;
let casual_game;
let astCount = 0;
let endScreenFlag = false;
///////////////////////////

// MAXIMUM SCORE
let MAX_SCORE = 100;
let user_score = 0;

// THE TWO VARAIBLES MARK THE START OF THE LINE DRAWING
let start_x = 0;
let start_y = 0;

// VARIABLES TO SCORE THE ACCURACY
let correct = 0.0;
let incorrect = 0.0;
let accuracy = 0.0;
let total_accuracy = 0.0;
let average_accuracy = 0.0;
let objects_run_through = 0.0;

// BUTTON PLACEMENT CORRECTIONS
let cnv;
let cnvPos;

// LOAD FONTS FOR THE GAME
function preload() {
  SpaceMono = loadFont("assets/SpaceMono-Bold.ttf");
  // LOAD THE SOUND FOR THE GAME
  soundFormats('mp3');
  backgroundMusic = loadSound('assets/BackgroundMusic-AM.mp3')
  buttonClick = loadSound('assets/buttonPress.mp3');
  miningLaser = loadSound('assets/MiningLaser.mp3');
  miningSounds = loadSound('assets/MiningSounds.mp3');
  asteroidExplosion = loadSound('assets/explosion.mp3');
}

function setup() {
  // PLAY THE BACKGROUND MUSIC  
  backgroundMusic.play();
  backgroundMusic.loop();
  
  // SCREEN SIZE MODIFIERS
  // MODIFY THE SCREEN SIZE VALUES TO CHANGE THE SIZE OF THE GAME
  screen_size = [800, 800];
  center = [screen_size[0] / 2, screen_size[1] / 2];

  cnv = createCanvas(screen_size[0], screen_size[1]);
  cnvPos = cnv.position();
  background("#000000");

  // TEXT SETUP
  noStroke();
  fill("#FFC600");
  textAlign(CENTER);
  textSize((center[0] / 200) * 25);
  textFont(SpaceMono);
  text("Click anywhere to begin!", center[0], center[1] * 0.2);

  // RESET TEXT SIZE FOR ALL OTHER TEXT
  textSize((center[0] / 200) * 15);

  // CREATE THE BUTTON FOR TYPE OF GAME SESSION
  scored = createButton("Play!");
  scored.parent(cnv.parent());
  scored.size(200);
  scored.position(300, 350);
  scored.mousePressed(setScored);

  // CREATE THE BUTTON FOR THE CASUAL GAME SESSION
  casual_game = createButton("Practice");
  casual_game.parent(cnv.parent());
  casual_game.size(200);
  casual_game.position(300, 450);
  casual_game.mousePressed(setCasual);

  // STYLES OF THE BUTTONS
  scored.style("color", "#FFC600");
  scored.style("background-color", "#5800FF");
  scored.style("font-size", "20px");
  scored.style("border", "none");
  scored.style("box-shadow", "0 0 0 .5em #5800FF");
  scored.class("spaceButton");

  casual_game.style("color", "#FFC600");
  casual_game.style("background-color", "#5800FF");
  casual_game.style("font-size", "20px");
  casual_game.style("border", "none");
  casual_game.style("box-shadow", "0 0 0 .5em #5800FF");
  casual_game.class("spaceButton");
  
  // SET UP THE HOME BUTTON ON THE BOTTOM OF THE SCREEN
  setUpReturn();

  // THE ACTUAL INITIAL OBJECT SETUP
  stroke("#E900FF");
  strokeWeight(6);
  drawNewTrace();
}

function draw() {
  // UPDATE THE POSITION OF THE CANVAS
  cnvPos = cnv.position();
  calculateAccuracy();

  if (!mouseIsPressed && started && !endScreenFlag) {
    miningLaser.stop();
    miningSounds.stop();
    // RESET TEXT SIZE FOR ALL OTHER TEXT
    textSize((center[0] / 200) * 15);

    // UPDATE GAME STATE
    started = false;
    background("#000000");

    // NEW TRACE GENERATION
    noFill();
    stroke("#E900FF");
    strokeWeight(6);
    if (logging) {
      console.log(
        `Generating a new trace: mouse pressed ${mouseIsPressed} & ${started}`
      );
    }
    drawNewTrace();

    // SHOW THE ACCURACY TEXT
    noStroke();
    fill("#FFC600");
    text(`Accuracy: ${accuracy.toFixed(2)}`, center[0], center[1] * 0.2);

    // CALCULATE THE SCORE BASED ON ACCURACY
    user_score = user_score + MAX_SCORE * accuracy;
    text(`Score: ${user_score.toFixed(0)}`, center[0], center[1] * 1.8);

    // CALCULATE THE AVERAGE ACCURACY
    if (total_accuracy == 0) {
      objects_run_through = 1;
    }
    total_accuracy += accuracy;
    average_accuracy = total_accuracy / objects_run_through;
    objects_run_through++;


    // DISPLAY THE AVERAGE ACCURACY
    text(
      `Average accuracy: ${average_accuracy.toFixed(2)}`,
      center[0],
      center[1] * 1.6
    );

    // RESET THE ACCURACY SCORES
    correct = 0.0;
    incorrect = 0.0;

    ///////////////////////////
    // IF THE GAME IS A SCORED ONE, THEN SHOW THE REMAINING SHAPES
    if (!casual) {
      push();
      noStroke();
      fill("#FFC600");
      textAlign(CENTER, BASELINE);
      textSize((center[0] / 200) * 25);
      textFont(SpaceMono);
      text(`${astCount}/10`, center[0] * 1.8, center[1] * 0.2);
      astCount++;
      pop();

      // IF THE USER HAS GONE THROUGH TEN DIFFERENT ASTEROIDS, RESET THEM TO THE START
      if (astCount > 10) {
        // CALL THE END SCREEN
        endScreen();
      }
    }
    ///////////////////////////
  }
}

function mouseDragged() {
  ///////////////////////////
  // CHECK IF THE USER HAS GOTTEN PASSED THE MENU
  if (passed_menu && !endScreenFlag) {
    ///////////////////////////
    // CHECK IF THE DRAWING HAS BEEN STARTED YET
    if (!started && mouseIsPressed) {
      // SET THE START POSITION OF THE LINE
      start_x = mouseX;
      start_y = mouseY;
      started = true;
    } else if (
      abs(start_x - mouseX) <= 5 &&
      abs(start_y - mouseY) <= 5 &&
      (correct > 10 || incorrect > 10)
    ) {
      // RETURN IF THE MOUSE IS AT THE START POSITION
      // console.log("THIS BLOCK WAS ENTERED")
      asteroidExplosion.play();
      mouseIsPressed = false;
    }
    
    // IF THE STARTING LASER SOUND IS NO LONGER PLAYING, LOOP THE OTHER SOUND
    if (!miningLaser.isPlaying() && !miningSounds.isPlaying() && started) {
      miningSounds.play();
      miningSounds.loop();
    } else if (!started) {
      if (miningSounds.isLooping()) {
        miningSounds.setLoop();
      }
    }

    // DECLARE A NEW BOOOLEAN TO CONTROL WHETHER THE LINE IS ON THE OBJECT OR NOT
    let on_line = calculateCollision();

    // CHANGE THE STOKE WEIGHT OF THE LINE
    strokeWeight(3);

    // BOOLEAN CHECK TO CONTROL THE COLOR OF THE LINE
    if (mouseIsPressed) {
      if (on_line) {
        stroke("green");
        correct += 1.0;
      } else {
        stroke("red");
        incorrect += 1.0;
      }
    }

    // DRAW THE ACTUAL LINE
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function drawNewTrace() {
  // GENERATE AN ASTEROID UNDERNEATH THE TRACE
  drawAsteroid();

  // RESET THE STROKE
  stroke("#E900FF");
  strokeWeight(6);

  // CREATE A NEW SHAPE TO TRACE
  beginShape();
  for (let count = 0; count < 4; count++) {
    // GENERATE NEW VERTEX POINT COORDINATES
    if (count == 0) {
      vertex_x = center[0] - 50 - random(50);
      vertex_y = center[1] - 50 - random(50);
    } else if (count == 1) {
      vertex_x = random(50) + (center[0] + 50);
      vertex_y = center[1] - 50 - random(50);
    } else if (count == 2) {
      vertex_x = center[0] + 50 + random(50);
      vertex_y = center[1] + 100 - random(50);
    } else if (count == 3) {
      vertex_x = center[0] - 50 - random(50);
      vertex_y = random(50) + (center[1] + 50);
    }

    // LOGGING THE COORDINATES
    if (logging) {
      console.log(
        `Point ${count}\nX Coordinate: ${vertex_x}\nY Coordinate: ${vertex_y}`
      );
    }

    // CREATE A NEW VERTEX POINT
    vertex(vertex_x, vertex_y);

    // CREATE CIRCLE AT THIS POINT
    drawingContext.setLineDash([0, 0]);
    fill("#E900FF");
    circle(vertex_x, vertex_y, 10);

    // ADD THE ARRAY POINTS TO THE ARRAY THAT TRACKS THE POINT
    vertex_array[count] = [vertex_x, vertex_y];
  }

  // FINAL SETTINGS FOR THE NEW TRACE THAT IS GENERATED
  drawingContext.setLineDash([10, 10]);
  noFill();

  // COMPLETE THE TRACE
  endShape(CLOSE);
  calculateDistances();

  // RESET THE LINE DASHES BEFORE EXITING
  drawingContext.setLineDash([0, 0]);

  return vertex_array;
}

function drawOldTrace(oldVertex) {
  let points = [];

  // RESET THE STOKE
  stroke("#E900FF");
  strokeWeight(6);

  // BEGIN THE OLD SHAPE
  beginShape();
  // ADD ALL THE POINTS AS VERTEXES
  for (points of oldVertex) {
    vertex(points[0], points[1]);

    // CREATE CIRCLE AT THIS POINT
    circle(points[0], points[1], 10);
  }
  endShape(CLOSE);
}

function calculateDistances() {
  // LOGGING TO CHECK FOR EXTRANEOUS RUNS
  if (logging) {
    console.log("DISTANCES BETWEEN VERTEXES CALCULATED");
  }

  // FOR ALL THE POINTS, CALCULATE THEIR DISTANCES FROM EACH OTHER AND RECORD THEM TO THE DISTANCE ARRAY
  for (i = 0; i < 4; i++) {
    if (i == 3) {
      distance_array[i] = dist(
        vertex_array[i][0],
        vertex_array[i][1],
        vertex_array[0][0],
        vertex_array[0][1]
      );
    } else {
      distance_array[i] = dist(
        vertex_array[i][0],
        vertex_array[i][1],
        vertex_array[i + 1][0],
        vertex_array[i + 1][1]
      );
    }
  }
}

function calculateCollision() {
  // VARIABLES TO SET UP THE DISTANCES
  let first_point_dist = 0;
  let second_point_dist = 0;

  // LOGGING
  if (logging) {
    console.log("\n\nNEW CALCULATION");
  }

  // ITERATION THROUGH THE POINTS AND THE DISTANCES
  for (i = 0; i < 4; i++) {
    // GET THE VALUES OF THE DISTANCES AND CREATE NEW DISTANCES
    first_point_dist = dist(
      mouseX,
      mouseY,
      vertex_array[i][0],
      vertex_array[i][1]
    );

    // IF THE LOOP IS ON 3, CALCULATE THE DISTANCE TO POINT 0
    if (i == 3) {
      second_point_dist = dist(
        mouseX,
        mouseY,
        vertex_array[0][0],
        vertex_array[0][1]
      );
    } else {
      second_point_dist = dist(
        mouseX,
        mouseY,
        vertex_array[i + 1][0],
        vertex_array[i + 1][1]
      );
    }

    // LOGGING TO SHOW THE DISTANCES
    if (logging) {
      console.log(`NEW ITERATION ${i}`);
      console.log(`First point distance ${first_point_dist}\nSecond point 
                distance ${second_point_dist}\nDistance: ${distance_array[i]}`);
    }

    // IF THERE IS A COLLISION, RETURN TRUE; .5 CONTROLS MAX DISTANCE
    if (
      first_point_dist + second_point_dist - distance_array[i] < 0.5 ||
      first_point_dist < 3
    ) {
      // LOGGING
      // console.log("There was a hit");
      return true;
    }
  }

  return false;
}

function calculateAccuracy() {
  // CHECK TO RECALCULATE THE ACCURACY
  if ((correct != 0 || incorrect != 0) && started) {
    // LOGGING
    if (logging) {
      console.log("CALCULATING ACCURACY");
    }

    // CALCULATE THE ACCURACY
    accuracy = float(correct) / (float(incorrect) + float(correct));

    // LOGGING VALUES
    if (logging) {
      console.log("correct: " + correct);
      console.log("incorrect: " + incorrect);
      console.log(`Accuracy: ${accuracy.toFixed(2)}`);
    }
  }
}

function drawAsteroid() {
  // RANDOMIZE THE SEED
  noiseSeed(random(1000));

  // BEGIN ASTEROID SHAPE
  beginShape();
  for (let i = 0; i <= TWO_PI; i += 0.01) {
    let xoff = map(cos(i), -1, 1, 0, 2);
    let yoff = map(sin(i), -1, 1, 0, 2);
    let r = map(noise(xoff, yoff, 0), 0, 1, center[0] * 0.4, center[0] * 0.55);
    let x = r * cos(i) + center[0];
    let y = r * sin(i) + center[1];
    vertex(x, y);
  }

  // ASTEROID DISPLAY SETTINGS
  fill("#94908D");
  stroke("black");
  strokeWeight(1);

  // BORDER SHADOWS FOR THE ASTEROID BODY
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "white";
  endShape(CLOSE);

  // SET VALUES FOR THE CRATERS
  drawingContext.shadowBlur = 0;
  strokeWeight(1);
  stroke("#31302E");

  // CREATE A NUMBER OF CRATERS ACROSS THE ASTEROID
  for (let k = 0; k < TWO_PI; k += PI / 4) {
    let xoff = map(cos(k), -1, 1, 0, 2);
    let yoff = map(sin(k), -1, 1, 0, 2);
    let random_radius = map(
      noise(xoff, yoff, 0),
      0,
      1,
      center[0] * 0.2,
      center[0] * 0.45
    ); //random(50, 90)
    let x = random_radius * cos(k);
    let y = random_radius * sin(k);
    let crater_radius = random(center[0] / 20, center[0] / 10);

    // CREATE A GRADIENT FOR THE COLOR OF THE CRATERS STARTING IN THE MIDDLE OF THE CRATER
    let grad_color = drawingContext.createRadialGradient(
      x + center[0],
      y + center[1],
      crater_radius,
      x + center[0],
      y + center[1],
      crater_radius * 0.3
    );

    // ADD THE COLOR STOPS FOR THE CRATER
    grad_color.addColorStop(0, "#000000");
    grad_color.addColorStop(1, "#827e7c");
    drawingContext.fillStyle = grad_color;

    // CREATE THE CRATERS
    circle(x + center[0], y + center[1], crater_radius);
  }
}

///////////////////////////
function setScored() {
  buttonClick.play();
  // RESET THE TEXT INSIDE OF THE PLAY AGAIN BUTTON
  scored.html("Play!");

  // IF THE PLAY BUTTON IS PRESSED, THE GAME IS NOT A CASUAL ONE
  casual = false;
  scored.hide();
  casual_game.hide();

  // NO LONG ON THE END SCREEN OR THE START MENU
  endScreenFlag = false;
  passed_menu = true;
  started = true;

  // REDRAW THE MAIN MENU
  redraw();
}

function setCasual() {
  buttonClick.play();
  // IF THE PRACTICE BUTTON IS PRESSED, THE GAME IS A CASUAL ONE
  if (!casual) {
    casual = true;
    scored.hide();
    casual_game.hide();

    // MOVE THE CASUAL GAME BUTTON SO THAT IT ALLOWS USERS TO STOP THEIR PROGRESS
    casual_game.html("End Practice");
    casual_game.position(300, center[1] * 0.3);

    // NO LONG ON THE END SCREEN OR THE START MENU
    endScreenFlag = false;
    passed_menu = true;
    started = true;

    // REDRAW THE MAIN MENU
    redraw();
    casual_game.show();
  } else {
    // THE GAME IS RUNNING A CASUAL ONE
    casual = false;
    casual_game.hide();

    // RESET THE VALUES OF THE BUTTONS
    casual_game.html("Practice");
    endScreen();
  }
}

function endScreen() {
  // STOP THE DRAW LOOP THAT THE GAME OPERATES ON
  endScreenFlag = true;
  background("#000000");

  noStroke();
  fill("#FFC600");
  textAlign(CENTER);
  textSize((center[0] / 200) * 25);
  textFont(SpaceMono);
  text(`Final score: ${user_score.toFixed(0)}`, 400, 100);
  text(`Average accuracy: ${average_accuracy.toFixed(2)}`, 400, 200);

  // RESET ALL OF THE VALUES FOR THE GAME
  average_accuracy = 0.0;
  accuracy = 0.0;
  total_accuracy = 0.0;
  objects_run_through = 0.0;
  user_score = 0.0;
  astCount = 0.0;

  // MOVE THE BUTTONS
  scored.position(300, 400);
  scored.html("Play again?");
  casual_game.position(300, 500);

  // SHOW THE BUTTONS AGAIN
  scored.show();
  casual_game.show();
}
///////////////////////////

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
  returnButton.class("spaceButton");
  returnButton.mousePressed(function () {
    buttonClick.onended(function () {location.href = "index.html";})
    buttonClick.play();
  }); 
}
