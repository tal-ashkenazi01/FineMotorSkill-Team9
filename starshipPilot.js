//const { __Graphics__ } = require("../../../../../../.vscode/extensions/samplavigne.p5-vscode-1.2.8/p5types");
//idk why this ^^ is here, keeping in case its important

var debug = 0;//debug var used to control whether debug stuff is shown
var debugNode = null;

// BUTTON PLACEMENT CORRECTIONS
let cnv;

class sprite {
    static len;
    actualIndex = 0;
    a = 0;
    constructor(x, y, speed) {
        this.x = x;//obj x and y cord
        this.y = y;
        //this.animation = animation; //array of images representing sprites
        //this.w = this.animation[0].width;//width of sprite
        //this.len = this.animation.length;//length of sprite
        this.speed = speed;//independent var representing image speed
        this.index = 0;//sprite_index
    }
}

class spaceShip extends sprite{ //all sprite code taken and modified from: Daniel Shiffman
// http://youtube.com/thecodingtrain
// https://thecodingtrain.com/CodingChallenges/111-animated-sprite.html
// https://editor.p5js.org/codingtrain/sketches/vhnFx1mml

    rotation = 0;
    static animation = [];
    currentNode;

    constructor(x, y) {
        super(x, y, 0);
        this.setCurrentNode();
    }
  
    step() {
        this.updateCurrentNode();
        if(this.currentNode == null){
            //we win
            console.log("Winner!!!");
            playerScore += 50;
            restart();
        }
        push();
        angleMode(DEGREES);
        imageMode(CENTER);
        //check if should be lost
        //this should be if distance is greater than X, or if ship cannot get to mouse
        this.calculateDistance();
        this.index = 0;
        var distance = this.distanceVector.mag();
        if(distance > 200){
            this.lost = 1;
        }else{
            this.lost = 0;
        }

        if(!this.lost){
            this.a = atan2(mouseY - this.y, mouseX - this.x);
            //update x and y ship cords to reflect moving towards mouse
            if(distance > 30){
                this.distanceVector.normalize();
                this.index = 3;
                if(!this.checkForXCollision()){
                    this.x += this.distanceVector.x * 2;
                }
                if(!this.checkForYCollision()){
                    this.y += this.distanceVector.y * 2;
                }
                //if x dem is free
                //if y dem is free
            }
            //console.log(a);
        }else{

            //help me!
        }
        translate(this.x, this.y);
        rotate(this.a);//turn sprite based off of rotation var
        this.draw();
        pop();
        rect(this.x, this.y, 1, 1); //rect representing hitbox cords of ship
    }
    //used to check x cord against currentNode x
    updateCurrentNode(){
        //console.log(this.currentNode);
        if(this.currentNode == null){//used to prevent null exception
            return;
        }
        if(abs(this.x - this.currentNode.nodeXPosition) > mazeNode.nodeSize/2){
            if((this.x - this.currentNode.nodeXPosition) < 0){//negative if right
                this.currentNode = this.currentNode.getNodeFromDirection(3);
            }else{
                this.currentNode = this.currentNode.getNodeFromDirection(1);
            }
        }
        if(this.currentNode == null){//used to prevent null exception
            return;
        }
        if(abs(this.y - this.currentNode.nodeYPosition) > mazeNode.nodeSize/2){
            if((this.y - this.currentNode.nodeYPosition) < 0){//negative if above
                this.currentNode = this.currentNode.getNodeFromDirection(0);
            }else{
                this.currentNode = this.currentNode.getNodeFromDirection(2);
            }
        }
    }
    checkForXCollision(){
        if(abs(this.x - this.currentNode.nodeXPosition) > mazeNode.nodeSize/2 - 8){
            if(this.x - this.currentNode.nodeXPosition < 0 && this.currentNode.walls.includes(3)){
                this.x += 2;
                return true;
            }else if(this.x - this.currentNode.nodeXPosition > 0 && this.currentNode.walls.includes(1)){
                this.x -= 2;
                return true;
            }
        }
        return false;
    }
    checkForYCollision(){
        if(abs(this.y - this.currentNode.nodeYPosition) > mazeNode.nodeSize/2 - 8){
            if(this.y - this.currentNode.nodeYPosition < 0 && this.currentNode.walls.includes(0)){
                this.y += 2;
                return true;
            }else if(this.y - this.currentNode.nodeYPosition > 0 && this.currentNode.walls.includes(2)){
                this.y -= 2;
                return true;
            }
        }
        return false;
    }
    setCurrentNode(){
        this.currentNode = mazeObj.startNode;
        this.x = this.currentNode.nodeXPosition;
        this.y = this.currentNode.nodeYPosition;
    }

    //updates distanceVector to be accurate based on current Mouse and ship position
    calculateDistance(){
        this.distanceVector = createVector(mouseX,mouseY).sub(createVector(this.x,this.y));
        //return createVector(mouseX,mouseY).sub(createVector(this.x,this.y)).mag();
    }

    static setSpriteSheet(data, image){
        data.frames.forEach(frame => {
            let pos = frame.position;
            let img = image.get(pos.x, pos.y, pos.w, pos.h);
            spaceShip.animation.push(img);
        });
        spaceShip.len = spaceShip.animation.length;//length of sprite
        console.log("Length in setSPrite: " + spaceShip.len);
    }
    //get node ship is currently in
    getNode(){
        return mazeObj.mazeNodes[this.x/mazeObj.size][this.y/mazeObj.size];
    }
    draw(){
            this.index = floor(this.index) % spaceShip.len;//continueously loop through sprite index using modulus
            image(spaceShip.animation[this.index], 0, 0);//draw sprite onto screen
            //Note: the sprite must be always drawn at 0, 0 because thats where rotate's orgin is, and rotate always rotates relative to orgin
            //we then use translate to offset the rendered sprite to actual position while maintaining 0, 0 render
    }
  }

class asteroidWall{
    x;
    y;
    length;
    isHorizontal;

    asteroids = [];
      constructor(x, y, length, isHorizontal){
        this.x = x;
        this.y = y;
        this.length = length;
        this.isHorizontal = isHorizontal;

        if(isHorizontal){
            this.asteroids.push(new Asteroid(this.x - (this.length/3), this.y, 1));
            this.asteroids.push(new Asteroid(this.x, this.y, 1));
            this.asteroids.push(new Asteroid(this.x + (this.length/3), this.y, 1));
        }else{
            this.asteroids.push(new Asteroid(this.x, this.y - (this.length/3), 1));
            this.asteroids.push(new Asteroid(this.x, this.y, 1));
            this.asteroids.push(new Asteroid(this.x, this.y + (this.length/3), 1));
        }

      }
}

class Asteroid extends sprite{
    
    a = 0;
    rotationSpeed;
    size;
    static animation = [];

    constructor(x, y, size){
        super(x, y, 0);
        this.index = Math.round(Math.random(0,8));
        this.rotationSpeed = Math.random(0.1,2);
    }

    step() {
        push();
        angleMode(DEGREES);
        imageMode(CENTER);
        translate(this.x, this.y);
        this.a += this.rotationSpeed;
        var rotation = (this.a % 360) - 180;
        //console.log(this.a);
        //console.log(rotation);
        rotate(rotation);//turn sprite based off of rotation var
        this.draw();
        pop();
    }

    static setSpriteSheet(data, image){
        data.frames.forEach(frame => {
            let pos = frame.position;
            let img = image.get(pos.x, pos.y, pos.w, pos.h);
            Asteroid.animation.push(img);
        });
        spaceShip.len = Asteroid.animation.length;//length of sprite
    }
    draw(){
        //console.log(this.animation);
        this.index = floor(this.index) % spaceShip.len;//continueously loop through sprite index using modulus
        image(Asteroid.animation[this.index], 0, 0);//draw sprite onto screen
        //Note: the sprite must be always drawn at 0, 0 because thats where rotate's orgin is, and rotate always rotates relative to orgin
        //we then use translate to offset the rendered sprite to actual position while maintaining 0, 0 render
    }
}

class PowerUp extends sprite{
    score = 0;
    homeNode;
    static animation = [];
    constructor(x, y, node){
        super(x, y, (1/7));
        this.score = floor(random(1,5));
        this.homeNode = node;
        //TODO: create spritesheet for powerup
    }

    consume(){
        playerScore += this.score;
        mazeObj.powerups.splice(mazeObj.powerups.indexOf(this), 1);
    }
    step() {
        if(playerShip.currentNode == this.homeNode){
            this.consume();
        }
        push();
        angleMode(DEGREES);
        imageMode(CENTER);
        translate(this.x, this.y);
        //console.log(this.a);
        //console.log(rotation);
        this.draw();
        pop();
    }

    static setSpriteSheet(data, image){
        data.frames.forEach(frame => {
            let pos = frame.position;
            let img = image.get(pos.x, pos.y, pos.w, pos.h);
            PowerUp.animation.push(img);
        });
        PowerUp.len = PowerUp.animation.length;//length of sprite
    }
    draw(){
        //console.log(this.animation);
        this.actualIndex += this.speed;
        this.index = floor(this.actualIndex) % PowerUp.len;//continueously loop through sprite index using modulus
        image(PowerUp.animation[this.index], 0, 0, 40, 40);//draw sprite onto screen
        //Note: the sprite must be always drawn at 0, 0 because thats where rotate's orgin is, and rotate always rotates relative to orgin
        //we then use translate to offset the rendered sprite to actual position while maintaining 0, 0 render
    }
    updateCordinates(){//this is used so we can move powerups to proper nodes after the node cordinates are set(because when first constructed, the mazeNodes are still at 0 ,0)
        this.x = this.homeNode.nodeXPosition;
        this.y = this.homeNode.nodeYPosition;
    }
}

class mazeNode {
    
    //Node Index in maze array
    x;
    y;
    //actual node cordinate
    nodeXPosition;
    nodeYPosition;
    partOfPath; //used to check if this node is part of a path already
    partOfCurrentPath;//used for pathfind function to detect if this node is currently in use by this path but no other previous paths
    static nodeSize;

    pathNodes = [];
    walls = [];
    mazeArray = [];

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.partOfPath = false;
        this.partOfCurrentPath = false;
        this.walls = [0,1,2,3];
    }
    //we need to destroy a wall for every node in the array, so may as well just iterae through array and destroy a wall for every entry
    removeWalls(){
        //
        this.pathNodes.forEach(Node => {
            //this.walls.splice(this.getDirection(Node),1);
            //this.walls.splice(this.walls.indexOf(this.getDirection(Node)),1);
            this.removeWall(this.getDirection(Node));
        });

        //this.getNodeFromDirection(direction) == 
    }

    removeWall(num){
        this.walls.splice(this.walls.indexOf(num),1);
    }

    setArray(array){
        this.mazeArray = array;
    }

    addNodetoPathDir(direction){
        this.pathNodes.push(this.getNodeFromDirection(direction));
    }

    addNodetoPath(node){
        this.pathNodes.push(node);
    }
    //TODO: get rid of for loop and use if statements instead for better efficiency
    getDirection(nextNode){
        for(let i = 0; i < 4; ++i){
            if(this.getNodeFromDirection(i) == nextNode)
                return i;
        }
        return -1;
    }

    getNodeFromDirection(direction){
        if (direction == 0){
            return this.getUpper();
        }else if(direction == 1){
            return this.getRight();
        }else if(direction == 2){
            return this.getLower();
        }else if(direction == 3){
            return this.getLeft();
        }
    }

    getLeft(){
        if(this.x - 1 < 0){
            return null;
        }else{
            return this.mazeArray[this.y][this.x - 1];
        }
    }

    getRight(){
        if(this.x + 1 >= this.mazeArray.length){
            return null;
        }else{
            return this.mazeArray[this.y][this.x + 1];
        }
    }

    getUpper(){
        if(this.y - 1 < 0){
            return null;
        }else{
            return this.mazeArray[this.y - 1][this.x];
        }
    }

    getLower(){
        if(this.y + 1 >= this.mazeArray.length){
            return null;
        }else{
            return this.mazeArray[this.y + 1][this.x];
        }
    }

}

class Maze {

    shouldXBeDynamic;//vars used globally throughout Maze object to determine which cord to use for start and finish cordinates
    randomStartStatic;
    mazeNodes = [];
    startNode;
    x;
    y;
    size;
    asteroidWalls = [];
    powerups = [];

    constructor(x, y, Size) {
        this.x = x;
        this.y = y;
        this.size = Size;

        this.createMaze(this.size);
        this.createMazePaths();

        //generate walls based off of current paths
        mazeNode.nodeSize = (screenWidth*.75)/this.size;//defines size of nodes(75% of screen, then divided by amount of nodes)
        var nodeCenterVar = -0.5*this.size + 0.5;
        

        this.mazeNodes.forEach(nodeArray => {
            nodeArray.forEach(Node => {
                Node.removeWalls();
                Node.nodeXPosition = this.x + ((Node.x+nodeCenterVar)*(mazeNode.nodeSize*(1+debug)));//these are node cordinates scaled up based off of size
                Node.nodeYPosition = this.y + ((Node.y+nodeCenterVar)*(mazeNode.nodeSize*(1+debug)));

                this.powerups.forEach(powerup => {
                    powerup.updateCordinates();
                });

                if(debug){
                    var nodeXPosition = (Node.x-nodeCenterVar)*nodeSize;//these are node cordinates scaled up based off of size
                    var nodeYPosition = (Node.y-nodeCenterVar)*nodeSize;
                    var buttonID =  Node.y*nodeArray.length+Node.x;
                    var button = createButton(buttonID);
                    button.position((this.x+nodeXPosition)*2,(this.y+nodeYPosition)*2);
                    button.mousePressed(function() {debugNode = this.mazeNodes[Node.y][Node.x];}.bind(this));
                }
            });
        });
    }
    createMaze(size){
        this.mazeNodes = [];
        /*
        this.mazeNodes = [
            [new mazeNode(0,0),new mazeNode(1,0),new mazeNode(2,0),new mazeNode(3,0),new mazeNode(4,0)],
            [new mazeNode(0,1),new mazeNode(1,1),new mazeNode(2,1),new mazeNode(3,1),new mazeNode(4,1)],
            [new mazeNode(0,2),new mazeNode(1,2),new mazeNode(2,2),new mazeNode(3,2),new mazeNode(4,2)],
            [new mazeNode(0,3),new mazeNode(1,3),new mazeNode(2,3),new mazeNode(3,3),new mazeNode(4,3)],
            [new mazeNode(0,4),new mazeNode(1,4),new mazeNode(2,4),new mazeNode(3,4),new mazeNode(4,4)]
        ];
        */
        for(var i = 0; i < size; ++i){
            this.mazeNodes.push([]);
            for(var j = 0; j < size; ++j){
                this.mazeNodes[i].push(new mazeNode(j,i));
            }
        }
        //foreach loop used to map all nodes to this array
        this.mazeNodes.forEach(nodeArray => {
            nodeArray.forEach(Node => {
                Node.setArray(this.mazeNodes);
            });
        });
    }

    createMazePaths(){
        //main path generates first
        var sucessful = this.path(this.getStartNode(), this.checkifEndMainPath.bind(this));
        if(!sucessful){
            text(1);
        }
        //for loop used to create a path to every node without a path
        this.mazeNodes.forEach(nodeArray => {
            nodeArray.forEach(Node => {
                if(!Node.partOfPath){
                    //TODO: 20% chance to add powerup to this location
                    if(random(100) < 20){
                        this.powerups.push(new PowerUp(Node.nodeXPosition, Node.nodeYPosition, Node));
                    }
                    this.path(Node, this.checkifEndGenericPath);
                }
            });
        });



        //then we run more path recursion to fill in empty nodes
    }

    drawMaze(){//used to set asteroid walls
        
        var rectSizeBig = mazeNode.nodeSize; //size used to define longer edge of rectangles
        var rectSizeSmall = .5; //size used to define smaller edge

        var wallOffsetX = mazeNode.nodeSize/2;//used to offset walls from the exact center of nodes
        var wallOffsetY = mazeNode.nodeSize/2;

        this.mazeNodes.forEach(nodeArray => {
            nodeArray.forEach(Node => {

                Node.walls.forEach(num => {

                    if(num == 0){//upper wall
                        /*
                        var rectOffsetX = rectSizeBig/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeSmall/2;
                        rect((Node.nodeXPosition)-rectOffsetX,(Node.nodeYPosition)-wallOffsetY-rectOffsetY,rectSizeBig,rectSizeSmall);
                        */
                       this.asteroidWalls.push(new asteroidWall((Node.nodeXPosition),(Node.nodeYPosition)-wallOffsetY,rectSizeBig,true));
                    }else if(num == 1){//right wall
                        /*
                        var rectOffsetX = rectSizeSmall/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeBig/2;
                        rect((Node.nodeXPosition)+wallOffsetX-rectOffsetX,(Node.nodeYPosition)-rectOffsetY,rectSizeSmall,rectSizeBig);
                        */
                        this.asteroidWalls.push(new asteroidWall((Node.nodeXPosition)+wallOffsetX,(Node.nodeYPosition),rectSizeBig,false));
                    }else if(num == 2){//bottom wall
                        /*
                        var rectOffsetX = rectSizeBig/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeSmall/2;
                        rect((Node.nodeXPosition)-rectOffsetX,(Node.nodeYPosition)+wallOffsetY-rectOffsetY,rectSizeBig,rectSizeSmall);
                        */
                        this.asteroidWalls.push(new asteroidWall((Node.nodeXPosition),(Node.nodeYPosition)+wallOffsetY,rectSizeBig,true));
                    }else if(num == 3){//left wall
                        /*
                        var rectOffsetX = rectSizeSmall/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeBig/2;
                        rect((Node.nodeXPosition)-wallOffsetX-rectOffsetX,(Node.nodeYPosition)-rectOffsetY,rectSizeSmall,rectSizeBig);
                        */
                        this.asteroidWalls.push(new asteroidWall((Node.nodeXPosition)-wallOffsetX,(Node.nodeYPosition),rectSizeBig,false));
                    }
                    
                    //this.x-((nodeXPosition)*nodeSize)/this.size
                });
            });
        });
        
    }

    iterations = 0;//var used to safe guard against runaway recursion

    path(startPos, endCheck) {
        this.iterations++;
        var previousConsiderations = []; //used to keep track of previous direction considerations
        var pathComplete = false; //array used to tell if path is complete
        
        var possibleDirections = 4;
        var reason;

        if(this.iterations > 1000){
            console.log("Exited due to too much recursion.");
            return false;
        }
            //check if startPos this is a valid dest

            if(endCheck(startPos)){
                this.iterations = 0;
                //then return a value to end recursion
                startPos.partOfPath = true;
                //console.log("Path found valid destination at ", (startPos.y*5)+startPos.x);
                return true;
            } else {
                while(possibleDirections > 0){ //while there are still viable paths from current node
                    //console.log("started while loop");
                    //we begin forming check for nextnode
                    var inc = 0; //resets inc value : this is used to count how many times we have to increment in the foreach loop
                    var direction = this.getRandom(1,possibleDirections);//assignment of direction to be considered from 0 to possible directions to account for previous iterations
                    previousConsiderations.forEach(element => {//foreach loop used to correct direction var to account for previous considerations
                        if(direction >= element){
                            inc++;
                        }
                    });
                    previousConsiderations.push(direction);//push current consideration to previous considerations array after foreach loop but before correction
                    direction += inc;//corrects direction to account for any previous considerations making sure to offset direction by amount required
                    var nextNode = startPos.getNodeFromDirection(direction);

                    if (nextNode != null && nextNode.partOfCurrentPath == false){//if the nodes next destination is not null and not part of a path already
                        //console.log("Trying to path from ", (startPos.y*5)+startPos.x, " to ",  (nextNode.y*this.mazeNodes.length)+nextNode.x); 
                        startPos.partOfCurrentPath = true;
                        pathComplete = this.path(nextNode, endCheck);//recursive case
                        if(pathComplete){//if pathToEnd is true, it means we have found a valid ending, and should now be building the path
                            //console.log("Created path from ", (startPos.y*5)+startPos.x, " to ",  (nextNode.y*this.mazeNodes.length)+nextNode.x);
                            startPos.partOfPath = true;
                            //TODO: get rid of addNodetoPathDir and use just the regular version
                            startPos.addNodetoPathDir(direction);//add nextNode to current nodes path array
                            nextNode.addNodetoPath(startPos);//add currentNode to nextNodes path array
                            break;//we break here to send execution to the return statement with the new array
                        }//otherwise we continue to find another node to continue pathfinding
                    }
                        if(nextNode == null){
                            reason = "null destination";
                        }else if(nextNode.partOfCurrentPath){
                            reason = "already pathed";
                        }
                        possibleDirections--;//if nextNode is not valid, then subtract possibleDirections and reloop
                        //console.log("Invalid next node: ", (nextNode == null ? "null" : (nextNode.y*this.mazeNodes.length)+nextNode.x) ," found from ", (startPos.y*5)+startPos.x, " reason: ", reason);
                }
                if(!pathComplete){
                    //console.log("Failed path from ", (startPos.y*5)+startPos.x);
                }
                startPos.partOfCurrentPath = false;//reset partofcurrentpath
                return pathComplete; //end condition indicating loop has completed, and will either have been sucessful or not
                //if sucessful, will return an array with at least one element, with the first being the valid end node
                //if it failed, it will return an empty array indicating that no valid path was found from this point
            }
    }

    checkifEndMainPath(currentNode){ //function used to check if end condition of main path is met
        if(!this.shouldXBeDynamic){//if x is static, or being the determining factor in the start and end cords
            if(this.randomStartStatic == 0 && currentNode.x == this.size-1){//if the random static start is a 0 and we have an x with 4
                currentNode.removeWall(1);
                return true;
            }else if(this.randomStartStatic == this.size-1 && currentNode.x == 0){
                currentNode.removeWall(3);
                return true;
            }else{
                return false;
            }
        }else{
            if(this.randomStartStatic == 0 && currentNode.y == this.size-1){//if the random static start is a 0 and we have an x with 4
                currentNode.removeWall(2);
                return true;
            }else if(this.randomStartStatic == this.size-1 && currentNode.y == 0){
                currentNode.removeWall(0);
                return true;
            }else{
                return false;
            }
        }
    }
    //unused as of now
    checkifEndGenericPath(currentNode){//this simply paths until no valid nextNodes are found, used to create a random path with no paticular destination
        //foreach loop checking each direction, if all return null or false onm partOfPath, we are done
        var i;
        for(i = 0; i > 3; ++i){
            if(currentNode.getNextNode(i) != null || !currentNode.getNextNode(i).partOfPath){
                return false;
            }
        }
        return currentNode.partOfPath;
    }
    //checks to see if current path is ending on an already exsisting path
    checkifDestIsPath(currentNode){ //used to create paths from non path nodes to a valid path
        return currentNode.partOfPath;
    }

    //automates the random function of getting a random round number
    getRandom(start, end){
        return Math.round(Math.random(start,end));
    }
    //used to create and then access startNode of the maze
    getStartNode(){
        if(this.startNode != null){
            return this.startNode;
        }else{
            var randomStartDynamic = this.getRandom(0,this.size);//random value between 0 and 4
            this.randomStartStatic = this.getRandom(0,1);
            if (this.randomStartStatic == 1){//sets static var to represent either 1 edge or the other
                this.randomStartStatic = this.size - 1;
            }
            this.shouldXBeDynamic = this.getRandom(0,1); //bool used to determine which variable should be dynamic

            if(this.shouldXBeDynamic){//creates a node with the specific start positions in mind with all combinations leading to edge cordinates 
                this.startNode = this.mazeNodes[this.randomStartStatic][randomStartDynamic];
                /*
                if(targetNode.y == 0){//this removes the outer wall to allow for entry and exit at this Node
                    targetNode.removeWall(0);
                    //targetNode
                }else{
                    targetNode.removeWall(2);
                }
                */
                return this.startNode;
            }else{
                this.startNode = this.mazeNodes[randomStartDynamic][this.randomStartStatic];
                /*
                if(targetNode.x == 0){
                    targetNode.removeWall(3);
                }else{
                    targetNode.removeWall(1);
                }
                */
                return this.startNode;
            }
        }
    }

}

function preload(){
    //load JSON's
    spaceShipData = loadJSON('SpaceShipSpriteSheet.json');
    asteroidData = loadJSON('AsteroidSpriteSheet.json');
    gemData = loadJSON('Gem.json');

    //load spriteSheets
    shipSheet = loadImage('assets/spaceship.png');
    asteroidSheet = loadImage('assets/AsteroidProto.png');
    gemSheet = loadImage('assets/Gem.png');
}

screenHeight = 800;
screenWidth = 800;//copy paste this code at the top of every game to have universal vars for screen size
playerScore = 0;

function setup() {
    // FIND THE MIDDLE POSITION
    cnv = createCanvas(800, 800);  
    // ADD THE MAIN MENU BUTTON
    setUpReturn();

    spaceShip.setSpriteSheet(spaceShipData, shipSheet);
    Asteroid.setSpriteSheet(asteroidData, asteroidSheet);
    PowerUp.setSpriteSheet(gemData, gemSheet);

    mazeObj = new Maze(screenWidth/2,screenHeight/2, 10);
    //TODO: maybe make a fog of war to make maze much harder to traverse
    mazeObj.drawMaze();

    //create player ship
    playerShip = new spaceShip(mazeObj.startNode.nodeXPosition, mazeObj.startNode.nodeYPosition);
}

function draw() {

    //-------------------------Main GUI used to draw rectangle and its associated graphics
    color(153,0,153);
    background(screenWidth);
    stroke(153,0,153);
    strokeWeight(4);
    fill(0,0,0);
    rect(0,0,screenWidth, screenHeight);
    rect(0,0,screenWidth,screenHeight/10);
    //text
    textSize(32);
    text('Starship Pilot',100,40);

    text('Score: ',600,40);
    text(playerScore, 700, 40);
    //playerScore++;
    /*
    rect(100,100,10,10);
    rect(200,200,10,10);
    rect(300,300,10,10);
    rect(400,400,10,10);
    */

    if(debug){
        showNodeDebugInfo();
    }

    //horsey = new Sprite(animation, 0, i * 75, random(0.1, 0.4));
    playerShip.step();

    mazeObj.asteroidWalls.forEach(wallObj => {
        wallObj.asteroids.forEach(asteroid => {
            asteroid.step();
        });
    });

    mazeObj.powerups.forEach(powerup => {
        powerup.step();
    });

    //test circle
    //circle(100,100,100);
}

function showNodeDebugInfo(){//used to display debug info related to the maze
    if(debugNode != null){
        var textStart = 100;
        textSize(20);
        text(debugNode.y*mazeObj.mazeNodes.length+debugNode.x,10,textStart);
        var i = 0;
        debugNode.pathNodes.forEach(Node => {
            text(Node.y*mazeObj.mazeNodes.length+Node.x,10,textStart+i*20+30);//lists path nodes
            i++;
        });
        i = 0;
        debugNode.walls.forEach(num => {
            text(num,10,(textStart+100)+i*20+30);
            i++;
        });
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
  returnButton.class("spaceButton");
  returnButton.mousePressed(function () {
    location.href =
      "index.html";
  }); 
}

function startGame(){//used to run all non foundation functions so game can restart
    mazeObj = new Maze(screenWidth/2,screenHeight/2, 10);
    //TODO: maybe make a fog of war to make maze much harder to traverse
    mazeObj.drawMaze();
    //reset currentNode so ship can be bound to maze again
    playerShip.setCurrentNode();
}

function restart(){
    console.log("restarting")
    mazeObj = null;
    startGame();
}
