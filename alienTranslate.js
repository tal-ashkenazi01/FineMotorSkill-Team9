// BUTTON PLACEMENT CORRECTIONS
let cnv;

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
  
  // ADD THE MAIN MENU BUTTON
  setUpReturn();
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
