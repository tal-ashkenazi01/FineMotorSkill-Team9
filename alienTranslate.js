// BUTTON PLACEMENT CORRECTIONS
let cnv;

// WORD COMPARISON STORAGE
let word;
let count = 0;

// SCORE TRACKING
let score = 0;
let timerVal = 60;

// INPUT BOX 
let inp;

// BUTTON
let playAgain;

// SET THE TEXT FONT
function preload() {
  SpaceMono = loadFont("assets/SpaceMono-Bold.ttf");
  Horizon = loadFont("assets/HorizonElements2.otf")
}

function setup() {
  // FIND THE MIDDLE POSITION
  cnv = createCanvas(800, 800);
  
  // SET TO A RANDOM PHRASE
  chooseRandomWords();
  
  // CREATE A PLAY AGAIN BUTTON
  playAgain = createButton("Play again?");
  playAgain.parent(cnv.parent());
  playAgain.position(200, 500);
  playAgain.size(400);
  playAgain.style("color", "#FFC600");
  playAgain.style("background-color", "#5800FF");
  playAgain.style("font-size", "20px");
  playAgain.style("border", "none");
  playAgain.style("box-shadow", "0 0 0 .5em #5800FF");
  playAgain.class("spaceButton");
  playAgain.hide();
  playAgain.mousePressed(startNewGame); 
  
  // CREATE THE INPUT BOX
  inp = createInput('');
  inp.parent(cnv.parent());
  inp.position(200, 400);
  inp.size(400);
  inp.style('text-align', 'center')
  inp.style('color', "#FFC600");
  inp.style("background-color", "#5800FF");
  inp.style("font-size", "20px");
  inp.style("border", "none");
  inp.style("box-shadow", "0 0 0 .5em #5800FF");
  inp.class("spaceInput");
  
  // SET THE CALLBACK FUNCTION OF THE INPUT BOX
  inp.input(compareWords);
  
  // ADD THE MAIN MENU BUTTON
  setUpReturn();
  
  // CALL THE TIMER ON THE GAME
  setInterval(timeGame, 1000);
}

function draw() {
  background("black");  
  
  // TEXT SETUP
  noStroke();
  textFont(SpaceMono);
  fill("#FFC600");
  textAlign(CENTER);
  textSize(50);
  text(word, 400, 300);
  
  // CHANGING TEXT
  push();
  textFont(Horizon);
  for (let i = 1; i <= 10; i++) {
    textAlign(CENTER);
    text(alteredText(), 100 + (i * 50), 150);
  }
  pop();
    
  text(`Score: ${score}`, 400, 600);
  textSize(30);
  text(`Time remaining: ${timerVal}`, 400, 700);
}

function compareWords() {
  // SET THE INPUTSTRING EQUAL TO THE VALUE IN THE INPUT BOX
  let inputString = this.value();
  
  // IF THE STRING IS EMPTY, RETURN FALSE
  if (inputString.length == 0) {
    return false;
  }

  // LOOP THROUGH THE VALUES IN THE STRING TO SEE IF THEY ARE EQUAL AT ALL POSITIONS
  for (let i = 0; i < inputString.length; i++) {
    if (inputString.charAt(i) !== word.charAt(i)) {
      count--;
      inp.style('color', '#ff0000');
      inp.attribute('maxLength', inputString.length);
      return false;
    } 
  }
  
  // IF ALL LETTERS AT ALL INDEXES ARE EQUAL, RETURN TRUE
  count++;
  inp.attribute('maxLength', word.length);
  inp.style('color', "#FFC600");
    
  if (inputString.length == word.length) {
    score++;
    chooseRandomWords();
    inp.value("");
    return true;
  }
  
  return true;
}

function chooseRandomWords() {
  // CREATING THE WORD TO COMPARE THE NEW INPUT TOO
  word = random(["Know any Klingon?", "This is Major Tom", "Ground control?", "Rocket boosters", "Light speed captain", "Engage warp drive", "Blast them!", "Engage boosters!", "Set to stun!", "Eject warpcore!"]);
}

function alteredText() {
  let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  return random(letters);
}

function timeGame() {
  if (timerVal > 0) {
    timerVal--;
  } else if (timerVal <= 0) {
    endScreen();
  }
}

function endScreen() {
  noLoop();
  inp.hide();
  background("black");
  textSize(50);
  text(`Final Score: ${score}`, 400, 400);
  playAgain.show();
}

function startNewGame() {
  playAgain.hide();
  inp.show();
  timerVal = 60;
  loop();
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
  returnButton.class("spaceButton");
  returnButton.mousePressed(function () {
    location.href =
      "index.html";
  }); 
}
