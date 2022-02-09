class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1",child1_img)  ;
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", child2_img);
    car2.scale = 0.07;
     
    car3 = createSprite(width / 2 + 150, height - 100);
    car3.addImage("car3", child3_img);
    car3.scale = 0.07;

    cars = [car1, car2,car3];

    //fuels = new Group();
    //powerCoins = new Group();

    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle_img },
      { x: width / 2 - 150, y: height - 1300, image: obstacle_img },
      { x: width / 2 + 250, y: height - 1800, image: obstacle_img },
      { x: width / 2 - 180, y: height - 2300, image: obstacle_img },
      { x: width / 2, y: height - 2800, image:  obstacle_img},
      { x: width / 2 - 180, y: height - 3300, image: obstacle_img },
      { x: width / 2 + 180, y: height - 3300, image: obstacle_img },
      { x: width / 2 + 250, y: height - 3800, image: obstacle_img },
      { x: width / 2 - 150, y: height - 4300, image: obstacle_img },
      { x: width / 2 + 250, y: height - 4800, image: obstacle_img },
      { x: width / 2, y: height - 5300, image: obstacle_img },
      { x: width / 2 - 180, y: height - 5500, image: obstacle_img }
    ];

    // Adding fuel sprite in the game
    //this.addSprites(fuels, 4, fuelImage, 0.02);

    // Adding coin sprite in the game
    //this.addSprites(powerCoins, 18, powerCoinImage, 0.09);

    //Adding obstacles sprite in the game
    this.addSprites(
      obstacles,
      obstaclesPositions.length,
      obstacle_img,
      0.04,
      obstaclesPositions
    );
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

   

  play() {
     
    this.handleResetButton();

    Player.getPlayerInfo();

    if (allPlayers !== undefined) {
      image(  track_img, 0, -height * 5, width, height * 6);

      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
  
         // this.handleFuel(index);
          //this.handlePowerCoins(index);

          // Changing camera position in y direction
          camera.position.y = cars[index - 1].position.y;
        }
      }
      
      // handling keyboard events
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }

   
 // handlePowerCoins(index) {
   // cars[index - 1].overlap(powerCoins, function(collector, collected) {
     // player.score += 21;
    //  player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
    //  collected.remove();
   // });
 // }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }
}

  