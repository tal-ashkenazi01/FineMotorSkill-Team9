// BUTTON PLACEMENT CORRECTIONS
let cnv;

// WORD COMPARISON STORAGE
let word;
let count = 0;


// SET THE TEXT FONT
function preload() {
  SpaceMono = loadFont("assets/SpaceMono-Bold.ttf");
}

function setup() {
  // SET THE TEXT FONT
  textFont(SpaceMono);
  textAlign(CENTER);
  
  // FIND THE MIDDLE POSITION
  cnv = createCanvas(800, 800);
  
  // CREATING THE WORD TO COMPARE THE NEW INPUT TOO
  word = "this is the letters";
  
  // CREATE THE INPUT BOX
  let inp = createInput('');
  inp.parent(cnv.parent());
  inp.position(0, 0);
  inp.size(100);
  
  // SET THE CALLBACK FUNCTION OF THE INPUT BOX
  inp.input(compareWords);
  
  // ADD THE MAIN MENU BUTTON
  setUpReturn();
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
      console.log("Unequal");
      count--;
      return false;
    } 
  }
  
  // IF ALL LETTERS AT ALL INDEXES ARE EQUAL, RETURN TRUE
  console.log("Equal");
  count++;
  return true;
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
