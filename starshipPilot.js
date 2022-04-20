//const { __Graphics__ } = require("../../../../../../.vscode/extensions/samplavigne.p5-vscode-1.2.8/p5types");
//idk why this ^^ is here, keeping in case its important

var debug = 0;//debug var used to control whether debug stuff is shown
var debugNode = null;

class spaceShip { //all sprite code taken and modified from: Daniel Shiffman
// http://youtube.com/thecodingtrain
// https://thecodingtrain.com/CodingChallenges/111-animated-sprite.html
// https://editor.p5js.org/codingtrain/sketches/vhnFx1mml

    rotation = 0;

    constructor(animation, x, y, speed) {
      this.x = x;//obj x and y cord
      this.y = y;
      this.animation = animation; //array of images representing sprites
      this.w = this.animation[0].width;//width of sprite
      this.len = this.animation.length;//length of sprite
      this.speed = speed;//independent var representing image speed
      this.index = 0;//sprite_index
    }
  
    step() {

        //imageMode(CORNER);
        angleMode(DEGREES);  
        imageMode(CENTER)
        let a = atan2(mouseY - this.y, mouseX - this.x);
        console.log(a);
        translate(this.x, this.y);
        rotate(a);//turn sprite based off of rotation var



        let index = floor(this.index) % this.len;//continueously loop through sprite index using modulus
        image(this.animation[index], 0, 0);//draw sprite onto screen
        rotate(0);
    }

  }

class mazeNode {

    x;
    y;
    partOfPath; //used to check if this node is part of a path already
    partOfCurrentPath;//used for pathfind function to detect if this node is currently in use by this path but no other previous paths

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
    x;
    y;
    size;

    constructor(x, y, Size) {
        this.x = x;
        this.y = y;
        this.size = Size;

        this.createMaze(this.size);
        this.createMazePaths();

        //generate walls based off of current paths
        var nodeSize = (screenWidth*.25)/this.size;//defines size of nodes(75% of screen, then divided by amount of nodes)
        var nodeCenterVar = this.size / 2.5;

        this.mazeNodes.forEach(nodeArray => {
            nodeArray.forEach(Node => {
                Node.removeWalls();
                if(debug){
                    var nodeXPosition = (Node.x-nodeCenterVar)*nodeSize;//these are node cordinates scaled up based off of size
                    var nodeYPosition = (Node.y-nodeCenterVar)*nodeSize;
                    var buttonID =  Node.y*nodeArray.length+Node.x;
                    var button = createButton(buttonID);
                    button.position((this.x+nodeXPosition)*2,(this.y+nodeYPosition)*2);
                    button.mousePressed(function() {debugNode = this.mazeNodes[Node.y][Node.x];}.bind(this));
                    /*
                    HomeButton = createButton('Home');
                    HomeButton.position(15,15);
                    HomeButton.mousePressed(function() {window.location.href = "http://127.0.0.1:5500/MainMenu/";});//home button
                    */
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
                    this.path(Node, this.checkifEndGenericPath);
                }
            });
        });



        //then we run more path recursion to fill in empty nodes
    }

    drawMaze(){//used to draw maze
        var nodeSize = (screenWidth*.75)/this.size;//defines size of nodes(75% of screen, then divided by amount of nodes)
        var nodeCenterVar = -0.5*this.size + 0.5;
        var rectSizeBig = nodeSize; //size used to define longer edge of rectangles
        var rectSizeSmall = .5; //size used to define smaller edge

        var wallOffsetX = nodeSize/2;//used to offset walls from the exact center of nodes
        var wallOffsetY = nodeSize/2;

        this.mazeNodes.forEach(nodeArray => {
            nodeArray.forEach(Node => {

                //TODO: make this based off of maze cords instead of node.x and y cords
                var nodeXPosition = (Node.x+nodeCenterVar)*(nodeSize*(1+debug));//these are node cordinates scaled up based off of size
                var nodeYPosition = (Node.y+nodeCenterVar)*(nodeSize*(1+debug));
                
                Node.walls.forEach(num => {

                    if(num == 0){//upper wall
                        var rectOffsetX = rectSizeBig/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeSmall/2;
                        rect((this.x+nodeXPosition)-rectOffsetX,(this.y+nodeYPosition)-wallOffsetY-rectOffsetY,rectSizeBig,rectSizeSmall);
                    }else if(num == 1){//right wall
                        var rectOffsetX = rectSizeSmall/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeBig/2;
                        rect((this.x+nodeXPosition)+wallOffsetX-rectOffsetX,(this.y+nodeYPosition)-rectOffsetY,rectSizeSmall,rectSizeBig);
                    }else if(num == 2){//bottom wall
                        var rectOffsetX = rectSizeBig/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeSmall/2;
                        rect((this.x+nodeXPosition)-rectOffsetX,(this.y+nodeYPosition)+wallOffsetY-rectOffsetY,rectSizeBig,rectSizeSmall);
                    }else if(num == 3){//left wall
                        var rectOffsetX = rectSizeSmall/2;//var used for offsetting rectangles due to them rendering from top left
                        var rectOffsetY = rectSizeBig/2;
                        rect((this.x+nodeXPosition)-wallOffsetX-rectOffsetX,(this.y+nodeYPosition)-rectOffsetY,rectSizeSmall,rectSizeBig);
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
                console.log("Path found valid destination at ", (startPos.y*5)+startPos.x);
                return true;
            } else {
                while(possibleDirections > 0){ //while there are still viable paths from current node
                    console.log("started while loop");
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
                        console.log("Trying to path from ", (startPos.y*5)+startPos.x, " to ",  (nextNode.y*this.mazeNodes.length)+nextNode.x); 
                        startPos.partOfCurrentPath = true;
                        pathComplete = this.path(nextNode, endCheck);//recursive case
                        if(pathComplete){//if pathToEnd is true, it means we have found a valid ending, and should now be building the path
                            console.log("Created path from ", (startPos.y*5)+startPos.x, " to ",  (nextNode.y*this.mazeNodes.length)+nextNode.x);
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
                        console.log("Invalid next node: ", (nextNode == null ? "null" : (nextNode.y*this.mazeNodes.length)+nextNode.x) ," found from ", (startPos.y*5)+startPos.x, " reason: ", reason);
                }
                if(!pathComplete){
                    console.log("Failed path from ", (startPos.y*5)+startPos.x);
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

    getStartNode(){
        var randomStartDynamic = this.getRandom(0,this.size);//random value between 0 and 4
        this.randomStartStatic = this.getRandom(0,1);
        if (this.randomStartStatic == 1){//sets static var to represent either 0 or 4
            this.randomStartStatic = this.size - 1;
        }
        this.shouldXBeDynamic = this.getRandom(0,1); //bool used to determine which variable should be dynamic

        if(this.shouldXBeDynamic){//creates a node with the specific start positions in mind with all combinations leading to edge cordinates 
            var targetNode = this.mazeNodes[this.randomStartStatic][randomStartDynamic];
            if(targetNode.y == 0){//this removes the outer wall to allow for entry and exit at this Node
                targetNode.removeWall(0);
                //targetNode
            }else{
                targetNode.removeWall(2);
            }
            return targetNode;
        }else{
            var targetNode = this.mazeNodes[randomStartDynamic][this.randomStartStatic];
            if(targetNode.x == 0){
                targetNode.removeWall(3);
            }else{
                targetNode.removeWall(1);
            }
            return targetNode;
        }
    }

}

function preload(){
    spritedata = loadJSON('SpaceShipSpriteSheet.json');
    spritesheet = loadImage('spaceship.png');
}

screenHeight = 800;
screenWidth = 800;//copy paste this code at the top of every game to have universal vars for screen size

function setup() {
    createCanvas(screenWidth, screenHeight);

    //--------------------GUI code used to create button at the top

    HomeButton = createButton('Home');
    HomeButton.position(15,15);
    HomeButton.mousePressed(function() {window.location.href = "http://127.0.0.1:5500/MainMenu/";});//home button

    mazeObj = new Maze(screenWidth/2,screenHeight/2, 10);
    let frames = spritedata.frames;
    let animation = [];
    frames.forEach(sprite => {
        let pos = sprite.position;
        let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
        animation.push(img);
    });
    //create player ship
    spaceShip = new spaceShip(animation, 100, 100, 0);
    //TODO: make some node paths after main generation have powerups or rewards so their is incentive to explore the maze
    //TODO: maybe make a fog of war to make maze much harder to traverse
    //TODO: add in assets and realistic graphics to make this more like space
    
}

function draw() {
    background(screenWidth);

    //-------------------------Main GUI used to draw rectangle and its associated graphics
    color(153,0,153);
    stroke(153,0,153);
    strokeWeight(4);
    fill(0,0,0);
    rect(0,0,screenWidth,screenHeight/10);
    //text
    textSize(32);
    text('Starship Pilot',100,40);
    /*
    rect(100,100,10,10);
    rect(200,200,10,10);
    rect(300,300,10,10);
    rect(400,400,10,10);
    */

    mazeObj.drawMaze();

    if(debug){
        showNodeDebugInfo();
    }

    //horsey = new Sprite(animation, 0, i * 75, random(0.1, 0.4));
    spaceShip.step();

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
