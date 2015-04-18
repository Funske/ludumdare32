var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var keys = [];

var width = 900, height = 600;
var fps = 45;
var mobile = false;

var crayonTimerOn = false;
var crayonTimer = 0;
var crayonDone = false;

var crayonBombs = [];
var enemies = [];
var walls = [];
var images = [];
var warps = [];
var hearts = [];
var powers = [];
var defenses = [];

//Room that the play is in
var room = 0;
var changeRoom = false;
var goBackRoom = false;
var movingForward = true;

var background = new Image();

var mouseClick = false;
var mouseX = 0;
var mosueY = 0;

var iggyBossFight;

window.addEventListener("keydown", function(e){
	keys[e.keyCode] = true;
}, false);

window.addEventListener("keyup", function(e){
	delete keys[e.keyCode];
}, false);

window.addEventListener("touchdown", function(e){
	mouseClick = true;
}, false);

window.addEventListener("touchup", function(e){
	mouseClick = false;
}, false);

window.addEventListener("touchmove", function(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
}, false);

function update(){//Updates the game
	if(mobile){
		var dZero = height-200;
		if(mouseClick){
			console.log("hello from the mouse");
			if(mouseX >= 60 && mouseX <= 60+80){
				if(mouseY >= dZero && mouseY <= dZero+66){//Up d-pad has been pushed
					player.velY = -player.speed; player.dirUp = 1;
					console.log("something is pushing the up d-pad");
				}else if(mouseY >= dZero+130 && mouseY <= height){//Down d-pad has been pushed
					player.velY = player.speed; player.dirUp = 2;
					console.log("something is pushing the down d-pad");
				}
			}
		}
	}

	if(player.move){
		player.x += player.velX;
		player.y += player.velY;

		player.side1.x = player.x;
		player.side1.y = player.y+6;
		player.side2.x = (player.x+32)-3;
		player.side2.y = player.y+6;

		player.top1.x = player.x+6;
		player.top1.y = player.y;
		player.top2.x = player.x+6;
		player.top2.y = (player.y+32)-3;

		for(var i = 0; i < walls.length; i++){
			if(isColliding(player.side1, walls[i])){
				player.x = walls[i].x+walls[i].width-1;
			}
			if(isColliding(player.side2, walls[i])){
				player.x = walls[i].x-walls[i].width+1;
			}
			if(isColliding(player.top1, walls[i])){
				player.y = walls[i].y+walls[i].height-1;
			}
			if(isColliding(player.top2, walls[i])){
				player.y = walls[i].y-walls[i].height+1;
			}
		}
	}

	player.update();

	if(keys[38]){player.velY = -player.speed; player.dirUp = 1; player.dir=1;}
	if(keys[40]){player.velY = player.speed; player.dirUp = 2;player.dir=2;}
	if(keys[37]){player.velX = -player.speed; player.dirRight = 1;player.dir=3;}
	if(keys[39]){player.velX = player.speed; player.dirRight = 2;player.dir=4;}

	if(!keys[38] && player.dirUp == 1)player.velY = 0;
	if(!keys[40] && player.dirUp == 2)player.velY = 0;
	if(!keys[37] && player.dirRight == 1)player.velX = 0;
	if(!keys[39] && player.dirRight == 2)player.velX = 0;

	if(keys[90])//Z key does a crayon stab
		player.displayCrayon = true;

	if(!keys[90])
		player.displayCrayon = false;

	if(keys[32] && !crayonDone)
		crayonTimerOn = true
	
	if(!keys[32]){
		crayonTimerOn = false;
		crayonTimer = 0;
		crayonDone = false;
	}

	if(crayonTimerOn && !crayonDone){
		crayonTimer++;//Loads up crayon attack
	}

	if(crayonTimer >= 60){//crayon attack is charged up
		crayonDone = true;
		crayonTimer = false;
		crayonTimer = 0;
		var tempcrayon = clone(crayonBomb);
		tempcrayon.x = player.x-64;
		tempcrayon.y = player.y-64;
		tempcrayon.isActive = true;
		tempcrayon.color = '#'+Math.floor(Math.random()*16777215).toString(16);
		//tempcrayon.size = Math.floor((Math.random*3)+1);
		crayonBombs.push(tempcrayon);
		console.log("Created Crayon Bomb");
	}

	//Imediate attack

	for(var i = 0; i < enemies.length; i++){
		enemies[i].update();
	}

	for(var i = 0; i < crayonBombs.length; i++){
		crayonBombs[i].update();
	}

	for(var i = 0; i<warps.length;i++){
		warps[i].update();
	}

	if(changeRoom){
		//TODO Transition
		room++;
		loadRooms();
		changeRoom = false;
		movingForward = true;
	}
	if(goBackRoom){
		//TODO Transition
		room--;
		loadRooms();
		goBackRoom = false;
		movingForward = false;
	}
}

function render(){//Renders things to the screen
	ctx.clearRect(0, 0, width, height);//Clears the screen so new things may render

	if(background.src == null || background.src == "")background.src = "res/background/grasstree_bg.png";
	ctx.drawImage(background, 0, 0);

	ctx.drawImage(player.image, player.x, player.y);
	if(player.displayCrayon){//Crayon is displaying
		switch(player.dir){
			case 1:
				ctx.drawImage(crayonImage4, player.crayon.x, player.crayon.y);
			break;
			case 2:
			ctx.drawImage(crayonImage3, player.crayon.x, player.crayon.y);
			break;
			case 3:
			ctx.drawImage(crayonImage2, player.crayon.x, player.crayon.y);
			break;
			case 4:
			ctx.drawImage(crayonImage1, player.crayon.x, player.crayon.y);
			break;
		}
	}

	for(var i = 0; i < crayonBombs.length; i++){
		ctx.fillStyle = crayonBombs[i].color;
		switch(crayonBombs[i].size){
			case 1://Square
				ctx.fillRect(crayonBombs[i].x, crayonBombs[i].y, crayonBombs[i].width, crayonBombs[i].height);
				break;
			case 2://Triangle

				break;
			case 3://Circle

				break;
		}
	}

	for(var i = 0; i < enemies.length; i++){
		ctx.drawImage(enemies[i].image, enemies[i].x, enemies[i].y);
		ctx.fillStyle = "#000000";
		ctx.fillRect(enemies[i].x+1, enemies[i].y-10, 30, 8);
		var currentEHealth = (enemies[i].health/enemies[i].maxHealth)*30
		console.log(currentEHealth);
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(enemies[i].x+1, enemies[i].y-10, currentEHealth, 8);
	}

	for(var i = 0; i < images.length; i++){
		ctx.drawImage(images[i].image, images[i].x, images[i].y);
	}

	for(var i=0; i<hearts.length;i++){
		ctx.drawImage(hearts[i].image, hearts[i].x, hearts[i].y);
	}

	for(var i=0; i<powers.length;i++){
		ctx.drawImage(powers[i].image, powers[i].x, powers[i].y);
	}

	for(var i=0; i<defenses.length;i++){
		ctx.drawImage(defenses[i].image, defenses[i].x, defenses[i].y);
	}

	ctx.fillStyle="#FFFFFF";
	ctx.font="20px Arial";
	ctx.fillText("Health: " + player.health, 32, 47);
	ctx.fillText("Power: " + player.power, 32, 67);
	ctx.fillText("Defense: " + player.defense, 32, 87);

	ctx.fillRect(150, 45, 150, 35);

	ctx.fillStyle="#FF0000";
	var maxPart = (150/100)/2;
	var currentPart = crayonTimer/(maxPart/2);
	ctx.fillRect(150, 45, currentPart, 35);

	if(mobile){
		var dpad = new Image();
		dpad.src = "res/dpad.png";
		ctx.drawImage(dpad, 0, height-200);
	}
}

function game(){//Calls the update and render functions
	update();
	render();
}

function clone(obj){
	if(null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for(var attr in obj){
		if(obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

function isColliding(obj1, obj2){
	if(obj1.x < obj2.x+obj2.width  && obj1.x+obj1.width > obj2.x && 
	   obj1.y < obj2.y+obj2.height && obj1.y+obj1.height > obj2.y){
		return true;
		console.log("Collision is true");
	}else 
		return false;
}

function loadRooms(){
	switch(room){
		case 1:
			console.log("Init room 1");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			if(movingForward){
				player.x = 64;
			}else{
				player.x = width-65;
			}

			background.src = "res/background/grasstree_bg.png";

			var wall1 = clone(block);
			wall1.x = 0; wall1.y = 0;
			wall1.width = width;
			wall1.height = 32;
			walls.push(wall1);
			var wall2 = clone(block);
			wall2.x = 0; wall2.y = 0;
			wall2.width = 32;
			wall2.height = height;
			walls.push(wall2);
			var wall3 = clone(block);
			wall3.x = width-32; wall3.y = 0;
			wall3.width = 32;
			wall3.height = height;
			walls.push(wall3);
			var wall4 = clone(block);
			wall4.x = 0; wall4.y = height-32;
			wall4.width = width;
			wall4.height = 32;
			walls.push(wall4);

			var grass1 = clone(image);
			grass1.image.src = "res/grass.png";
			grass1.x = width-36; grass1.y = 224;
			var grass2 = clone(image);
			grass2.image.src = "res/grass.png";
			grass2.x = width-36; grass2.y = 224+32;
			var grass3 = clone(image);
			grass3.image.src = "res/grass.png";
			grass3.x = width-36; grass3.y = 224+64;
			images.push(grass1);
			images.push(grass2);
			images.push(grass3);

			var warp1 = clone(warp);
			warp1.x = width-37; warp1.y = 224;
			warp1.width = 38; warp1.height = 128;
			warps.push(warp1);
			break;
		case 2:
			console.log("Init room 2");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			if(movingForward)
				player.x = 40;
			else
				player.x = width-65;
			background.src = "res/background/room2.png";

			var wall1 = clone(block);
			wall1.x = 0; wall1.y = 0;
			wall1.width = width;
			wall1.height = 32;
			walls.push(wall1);
			var wall2 = clone(block);
			wall2.x = 0; wall2.y = height-32;
			wall2.width = width;
			wall2.height = 32;
			walls.push(wall2);
			var wall3 = clone(block);
			wall3.x = 0; wall3.y = 0;
			wall3.width = 32; wall3.height = 224;
			walls.push(wall3);
			var wall4 = clone(block);
			wall4.x = 0; wall4.y = 318;
			wall4.width = 32; wall4.height = 284;
			walls.push(wall4);

			var wall5 = clone(block);
			wall5.x = width-32; wall5.y = 0;
			wall5.width = 32; wall5.height = 224;
			walls.push(wall5);
			var wall6 = clone(block);
			wall6.x = width-32; wall6.y = 318;
			wall6.width = 32; wall6.height = 284;
			walls.push(wall6);

			var healthEnemy = clone(enemy);
			healthEnemy.still = true;
			healthEnemy.x = 640; healthEnemy.y = 160;
			healthEnemy.healthChance = 100; healthEnemy.powerChance = 0; healthEnemy.defenseChance = 0;
			healthEnemy.isActive = true;
			enemies.push(healthEnemy);
			var powerEnemy = clone(enemy);
			powerEnemy.still = true;
			powerEnemy.x = 640; powerEnemy.y = 160+64*2;
			powerEnemy.healthChance = 0; powerEnemy.powerChance = 100; powerEnemy.defenseChance = 0;
			powerEnemy.isActive = true;
			enemies.push(powerEnemy);
			var defenseEnemy = clone(enemy);
			defenseEnemy.still = true;
			defenseEnemy.x = 640; defenseEnemy.y = 160+64*4;
			defenseEnemy.healthChance = 0; defenseEnemy.powerChance = 0; defenseEnemy.defenseChance = 100;
			defenseEnemy.isActive = true;
			enemies.push(defenseEnemy);

			var warp2 = clone(warp);
			warp2.x = width-37; warp2.y = 224;
			warp2.width = 38; warp2.height = 128;
			warps.push(warp2);

			var warp3 = clone(warp);
			warp3.forward = false;
			warp3.x = 0; warp3.y = 224;
			warp3.width = 38; warp3.height = 128;
			warps.push(warp3);
			break;
		case 3:
			console.log("Init room 3");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			if(movingForward)
				player.x = 40;
			else
				player.x = width-65;

			background.src = "res/background/room3.png";

			var wall1 = clone(block);
			wall1.x = 0; wall1.y = 0;
			wall1.width = 32; wall1.height = 224;
			walls.push(wall1);
			var wall2 = clone(block);
			wall2.x = 0; wall2.y = 318;
			wall2.width = 32; wall2.height = 284;
			walls.push(wall2);
			var wall3 = clone(block);
			wall3.x = 0; wall3.y = height-32;
			wall3.width = width;
			wall3.height = 32;
			walls.push(wall3);
			var wall4 = clone(block);
			wall4.x = 0; wall4.y = 0;
			wall4.width = width;
			wall4.height = 32;
			walls.push(wall4);

			var enemy1 = clone(enemy);
			enemy1.x = 700; enemy1.y = 400;
			enemy1.isActive = true;
			enemies.push(enemy1);

			var enemy2 = clone(enemy);
			enemy2.x = 850; enemy2.y = 200;
			enemy2.isActive = true;
			enemies.push(enemy2);

			var warp2 = clone(warp);
			warp2.x = width-32; warp2.y = 0;
			warp2.height = height; warp2.width = 32;
			warps.push(warp2);

			var warp3 = clone(warp);
			warp3.forward = false;
			warp3.x = 0; warp3.y = 224;
			warp3.width = 38; warp3.height = 128;
			warps.push(warp3);
			break;
		case 4:
			console.log("Init room 4");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			if(movingForward)
				player.x = 40;
			else 
				player.x = width-65;
			background.src = "res/background/room4.png";

			var wall1 = clone(block);
			wall1.x = 0; wall1.y = 0;
			wall1.width = width;
			wall1.height = 32;
			walls.push(wall1);
			var wall4 = clone(block);
			wall4.x = 0; wall4.y = height-32;
			wall4.width = width;
			wall4.height = 32;
			walls.push(wall4);

			iggyBossFight.isActive = true;
			enemies.push(iggyBossFight);
			break;
	}
}

setInterval(function(){//Game loop
	game();
}, 1000/fps);