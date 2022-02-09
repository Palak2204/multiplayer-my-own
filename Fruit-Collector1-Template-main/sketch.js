var database;
var track_img,backgroundimg;
var child1,child2,child3,coins,obstacles;
 var child=[];
 var distance = 0;
 var form,game,player;
var child1_img, child2_img, child3_img;  
 var coin_img,obstacle_img; 
 var playerCount;
 var gameState =0;
 var allPlayers;
 var canvas;
 var cars,car1,car2,car3;
function preload(){
  track_img = loadImage("images/tracking.jpg");
   backgroundimg = loadImage("images/background.png");
 child1_img = loadImage("images/12.png");
  child2_img = loadImage("images/23.png");
  child3_img = loadImage("images/56.png");
  coin_img = loadImage("images/goldCoin.png");
  obstacle_img=loadImage("images/obstacle.png");
   
   
}
function setup() {
  canvas = createCanvas(windowWidth,windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  
}

function draw() {
  background(backgroundimg);
   
    if(playerCount === 3){
   game.update(1);
    }
    if(gameState === 1){
      clear();
      game.play();
     
    }
    if(gameState === 2){
     game.end();
    }
    
  }
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }