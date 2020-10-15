var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;
var count=0;
var gameOver, restart;
var backgroundImg;
localStorage["HighestScore"] = 0;

function preload(){
  mario_running =   loadAnimation("mario1.png","mario1.png","mario1.png","mario2.png","mario2.png","mario2.png");
  mario_collided = loadAnimation("mario_collided.png");
  
  groundImage = loadImage("ground2.png");
  backgroundImg=loadImage("LongBrickWall.jpg")
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("snake.png");
  obstacle2 = loadImage("lion.png");
  obstacle3 = loadImage("light.png");
  obstacle4 = loadImage("sword.png");
  obstacle5 = loadImage("fire.png");
  obstacle6 = loadImage("hurricane.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth,displayHeight-100);
  
  mario = createSprite(0,displayHeight-150,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.09;
  //mario.velocityX=5;
  
  
  
 // ground = createSprite(displayWidth/2-200,displayHeight-100,400,20);
  //ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(camera.position.x+300,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.position.x+300,400);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.05;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(mario.x,displayHeight-100,displayWidth*10,10);
  invisibleGround.visible = false;
  //invisibleGround.velocityX=mario.velocityX;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //mario.debug = true;
  background(backgroundImg, displayWidth,displayHeight);
  fill("white");
  stroke("red");
  strokeWeight(15);
  textSize(30);
  text("SCORE  :   "+ score, camera.position.x+300,50);

 

  if (gameState===PLAY){
  score = score + Math.round(getFrameRate()/60);
   


   // ground.velocityX = -(6 + 3*score/100);

   //make mario move forward
  mario.velocityX=4;

    if(keyDown("space")) {
      mario.velocityY = -25;
    }
  
 //camera.position.y= displayHeight/2;
  camera.position.x=mario.x;

    mario.velocityY = mario.velocityY + 0.8
    
   /* if (ground.x < 0){
      ground.x = ground.width/2;
    } */
  
    mario.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if(cloudsGroup.isTouching(mario)){
      mario.velocityY=0;
  }
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    restart.depth = mario.depth;
    restart.depth = restart.depth + 1;
    //to make them move along 
    gameOver.x=camera.position.x-100;
    restart.x=camera.position.x-100;
    
    //set velcity of each game object to 0
   // ground.velocityX = 0;
    mario.velocityY = 0;
    mario.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the mario animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale=0.3;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (camera.position.x % 700 === 0) {
    var cloud = createSprite(camera.position.x+displayWidth,120,40,10);
    cloud.y = Math.round(random(50,350));
    //cloud.debug=true;
    cloud.setCollider("rectangle",0,-50,200,5);
    cloud.addImage(cloudImage);
   cloud.scale=0.8
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth/3;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(camera.position.x % 1200 === 0) {
    var obstacle = createSprite(camera.position.x+displayWidth,displayHeight-250,10,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
     case 3 : obstacle.scale = 0.3;
     obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
   obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth/(6 + 3*score/100);
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale = 0.09;
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}