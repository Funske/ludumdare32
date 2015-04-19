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
var bullets = [];
var tickets = [];

//Room that the play is in
var room = 0;
var changeRoom = false;
var goBackRoom = false;
var movingForward = true;
var song = 0;

var backgroundImages = [];
var background = new Image();

var mouseClick = false;
var mouseX = 0;
var mosueY = 0;

var iggyBossFight;
var iggyWall;
var room4Warps = false;
var finalBoss;
var secretEnding = false;

var finalFight;
var hasAlertFinal = false;
var hasAlertHalfFinal = false;

var displayMenu = true;
var displayStatChange = false;
var showInfoText = false;

var editStat = false;

window.addEventListener("keydown", function(e){
	keys[e.keyCode] = true;
}, false);

window.addEventListener("keyup", function(e){
	delete keys[e.keyCode];
}, false);

document.addEventListener("click", function(e){
	mouseClick = true;
	mouseX = e.pageX;
	mouseY = e.pageY;
	console.log("Click " + mouseX + " "+ mouseY);
});

document.addEventListener("touchstart", function(e){
	mouseClick = true;
	mouseX = e.pageX;
	mouseY = e.pageY;
	console.log("Touch");
});

document.addEventListener("mouseup", function(e){
	mouseClick = false;
	editStat = false;
	console.log("Mouse Up");
});

document.addEventListener("touchend", function(e){
	mouseClick = false;
	editStat = false;
});

function update(){//Updates the game

	if(room == 1 || room == 2 || room == 3 || room == 5 || room == 6 || room == 8 || room == 9){
		if(song != 1){
			song = 1;
			document.getElementById("boss").pause();
			document.getElementById("final").pause();
			document.getElementById("overworld").play();
			document.getElementById("overworld").loop = true;
		}
	}else if(room == 7 || room == 4){
		if(song != 2){
			song = 2;
			document.getElementById("final").pause();
			document.getElementById("overworld").pause();
			document.getElementById("boss").play();
			document.getElementById("boss").loop = true;
		}
	}else if(room == 10){
		if(song != 3){
			song = 3;
			document.getElementById("boss").pause();
			document.getElementById("overworld").pause();
			document.getElementById("final").play();
			document.getElementById("final").loop = true;
			//Play song
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

	if(keys[38] || keys[87]){player.velY = -player.speed; player.dirUp = 1; player.dir=1;}
	if(keys[40] || keys[83]){player.velY = player.speed; player.dirUp = 2;player.dir=2;}
	if(keys[37] || keys[65]){player.velX = -player.speed; player.dirRight = 1;player.dir=3;}
	if(keys[39] || keys[68]){player.velX = player.speed; player.dirRight = 2;player.dir=4;}

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
		var newSize = 1+Math.floor(Math.random()*3);
		tempcrayon.size = newSize;
		console.log("Creating a new size of " + newSize);
		tempcrayon.color = '#'+Math.floor(Math.random()*16777215).toString(16);
		document.getElementById('bomb').play();
		crayonBombs.push(tempcrayon);
		if(player.power > 1)
			player.power -= 0.25;
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

	for(var i = 0; i<bullets.length;i++){
		bullets[i].update();
	}

	if(changeRoom){
		//TODO Transition
		room++;
		movingForward = true;
		loadRooms();
		changeRoom = false;
	}
	if(goBackRoom){
		//TODO Transition
		room--;
		movingForward = false;
		loadRooms();
		goBackRoom = false;
	}

	if(room == 4){
		if(iggyBossFight.isDead && !room4Warps){
			var index = walls.indexOf(iggyWall);
			if(index > -1){
				walls.splice(index, 1);
				console.log("removed the wall");
			}
			room4Warps = true;
			var warp1 = clone(warp);
			warp1.x = width-32; warp1.y = 32;
			warp1.width = 32; warp1.height = height-64;
			warp1.roomNum = false;
			forward = true;
			warps.push(warp1);
			console.log("Added the iggy warp");
		}
	}else if(room == 7){//Final boss room
		bulletTimer++;
		bulletTimer2++;
		if(bulletTimer >= 45){
			bulletTimer = 0;
			var tempBullet = clone(bullet);
			tempBullet.x = 200;
			tempBullet.y = 0;
			tempBullet.velY = 5;
			tempBullet.image.src = "res/bulletdown.png";
			bullets.push(tempBullet);
		}
		if(bulletTimer2 >= 45){
			bulletTimer2 = 0;
			var tempBullet = clone(bullet);
			tempBullet.x = 600;
			tempBullet.y = height-16;
			tempBullet.velY = -5;
			tempBullet.image.src = "res/bulletup.png";
			bullets.push(tempBullet);
		}
	}else if(room == 10){
		
	}
}

var bulletTimer = 0, bulletTimer2 = 0;

function render(){//Renders things to the screen
	ctx.clearRect(0, 0, width, height);//Clears the screen so new things may render

	if(background.src == null || background.src == "")background.src = "res/background/grasstree_bg.png";
	ctx.drawImage(background, 0, 0);

	if(player.visable){
		ctx.drawImage(player.image, player.x, player.y);
	}
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
		console.log(crayonBombs[i].size);
		switch(crayonBombs[i].size){
			case 1://Square
				ctx.fillRect(crayonBombs[i].x, crayonBombs[i].y, crayonBombs[i].width, crayonBombs[i].height);
				console.log("Square");
				break;
			case 2://Triangle
				ctx.beginPath();
				var newX = crayonBombs[i].x+64;
				ctx.moveTo(newX, crayonBombs[i].y);
				ctx.lineTo(newX+64, crayonBombs[i].y+128);
				ctx.lineTo(newX-64, crayonBombs[i].y+128);
				ctx.lineTo(newX, crayonBombs[i].y);
				ctx.fill();
				console.log("Triangle");
				break;
			case 3://Circle
				ctx.beginPath();
				ctx.arc(crayonBombs[i].x+64, crayonBombs[i].y+64, 64, 0, (Math.PI*2), true);
				ctx.fill();
				console.log("Circle");
				break;
		}
	}

	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].visable)
			ctx.drawImage(enemies[i].image, enemies[i].x, enemies[i].y);
		ctx.fillStyle = "#000000";
		ctx.fillRect(enemies[i].x+1, enemies[i].y-10, 30, 8);
		var currentEHealth = (enemies[i].health/enemies[i].maxHealth)*30
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

	for(var i = 0; i<bullets.length;i++){
		ctx.drawImage(bullets[i].image, bullets[i].x, bullets[i].y);
	}

	for(var i = 0; i<tickets.length;i++){
		ctx.drawImage(tickets[i].image, tickets[i].x, tickets[i].y);
	}

	ctx.font="20px Arial";
	if(player.health > 3)
		ctx.fillStyle="#FFFFFF";//White
	else
		ctx.fillStyle="#FF0000";//Red
	ctx.fillText("Health: " + player.health, 32, 47);
	ctx.fillStyle="#FFFFFF";
	ctx.fillText("Power: " + player.power, 32, 67);
	ctx.fillText("Defense: " + player.defense, 32, 87);

	ctx.fillRect(150, 45, 150, 35);

	ctx.fillStyle="#FF0000";
	var maxPart = (150/100)/2;
	var currentPart = crayonTimer/(maxPart/2);
	ctx.fillRect(150, 45, currentPart, 35);

	switch(room){
		case 1:
			ctx.font="36px Arial";
			ctx.fillStyle="#FFFFFF";//White
			ctx.fillText("Hollywood has been taken over by Nialxliv!", 80, 420);
			ctx.fillText("Go defeat him ASAP", 80, 470);
			break;
		case 2:
			ctx.font="36px Arial";
			ctx.fillStyle="#000000";//Black
			ctx.fillText("Press Z to use your crayon attack", 40, 120);
			ctx.fillText("and defeat these enemies! Press, and", 40, 160);
			ctx.fillText("hold your space to use a crayon bomb", 40, 200);
			ctx.fillText("Crayon bombs drain your power so watch out", 40, 240);
		break;
		case 4:
			ctx.font="36px Arial";
			ctx.fillStyle="#000000";//Black
			ctx.fillText("Iggy Azalia Attacks!", 40, height-60);
		break;
		case 7:
			if(finalBoss.isDead){
				ctx.font="36px Arial";
				ctx.fillStyle="#000000";//Black
				ctx.fillText("You Win? Thanks so much for playing!", width/2-350, height/2-25);
				if(secretEnding){
					console.log("Secret Ending activated");
					room = 9;
					changeRoom = true;
				}else if(!hasAlertHalfFinal){
					alert("Hollywood is saved?");
					hasAlertHalfFinal = true;
				}
			}else{
				ctx.font="28px Arial";
				ctx.fillStyle="#000000";//Black
				ctx.fillText("Defeat Shia LaBeouf!", 33, height-35);
			}
		break;
		case 10:
			if(finalFight.isDead){
				ctx.font="36px Arial";
				ctx.fillStyle="#000000";//Black
				ctx.fillText("You Win! Thanks so much for playing!", width/2-200, height/2-25);
				if(!hasAlertFinal){
					alert("Hollywood is saved!");
					hasAlertFinal = true;
				}
			}else{
				ctx.font="28px Arial";
				ctx.fillStyle="#000000";//Black
				ctx.fillText("Defeat Nialxliv!", 33, height-35);
			}
		break;
	}

	if(displayMenu){
		var menu = new Image();
		menu.src = "res/background/menu.png";
		ctx.drawImage(menu, 0, 0);
		if(mouseX >= 264 && mouseX <= 264+371 && mouseY >= 203 && mouseY <= 203+90 && !showInfoText){//Play button pushed
			displayStatChange = true;
		}

		if(mouseX >= 264 && mouseX <= 264+371 && mouseY >= 355 && mouseY <= 355+90 && !displayStatChange){//Info button pushed
			showInfoText = true;
		}
	}

	if(showInfoText){
		var infoImage = new Image();
		infoImage.src = "res/info.png";
		ctx.drawImage(infoImage, width/2-(599/2), height/2-(334/2));

		if(mouseX >= width/2-(599/2)+509 && mouseX <= width/2-(599/2)+509+68 && mouseY >= height/2-(334/2)+249 &&
			mouseY <= height/2-(334/2)+249+68){
			showInfoText = false;
		}

	}

	if(displayStatChange){
		ctx.fillStyle = "#FFFFFF";
		var newX = (width/2)-150;
		var newY = (height/2)-250;
		ctx.fillRect((width/2)-150, height/2-250, 300, 500);
		ctx.fillStyle = "#000000";
		ctx.font="36px Arial";
		ctx.fillText("Set your stats", newX, newY+30);

		var totalStats = 25;
		var statsLeft = totalStats-(tempHealth+tempAttack+tempDefense);
		var plus = new Image();
		plus.src = "res/plus.png";
		var minus = new Image();
		minus.src = "res/minus.png";

		ctx.fillText("Health", (newX+150)-60, newY+100);
		ctx.fillText("Attack", (newX+150)-60, newY+230);
		ctx.fillText("Defense", (newX+150)-65, newY+360);

		ctx.fillText(tempHealth, (newX+150)-30, newY+130);
		ctx.fillText(tempAttack, (newX+150)-30, newY+260);
		ctx.fillText(tempDefense, (newX+150)-30, newY+390);

		ctx.drawImage(plus, (newX+150)-(60+35), newY+100-30);
		ctx.drawImage(plus, (newX+150)-(60+35), newY+230-30);
		ctx.drawImage(plus, (newX+150)-(60+35), newY+360-30);

		ctx.drawImage(minus, (newX+150)+(45+35), newY+100-30);
		ctx.drawImage(minus, (newX+150)+(45+35), newY+230-30);
		ctx.drawImage(minus, (newX+150)+(45+35), newY+360-30);

		ctx.fillText("Stats left: " + statsLeft.toString(), (newX+150)-80, newY+500-30);

		ctx.fillStyle = "#00FF00";
		ctx.fillRect(newX, newY+500, 300, 50);

		if(mouseX >= (newX+150)-(60+35) && mouseX <= (newX+150)-(60+35)+32){
			if(mouseY >= newY+100-30 && mouseY <= newY+100-30+32){
				if(!editStat){
					if(statsLeft > 0){
						tempHealth++;
						statsLeft--;
						editStat = true;
					}
				}
			}
			if(mouseY >= newY+230-30 && mouseY <= newY+230-30+32){
				if(!editStat){
					if(statsLeft > 0){
						tempAttack++;
						statsLeft--;
						editStat = true;
					}
				}
			}
			if(mouseY >= newY+360-30 && mouseY <= newY+360-30+32){
				if(!editStat){
					if(statsLeft > 0){
						tempDefense++;
						statsLeft--;
						editStat = true;
					}
				}
			}
		}//End of plus x's

		if(mouseX >= (newX+150)+(45+35) && mouseX <= (newX+150)+(45+35)+32){
			if(mouseY >= newY+100-30 && mouseY <= newY+100-30+32){
				if(!editStat){
					if(tempHealth > 1){
						tempHealth--;
						statsLeft++;
						editStat = true;
					}
				}
			}

			if(mouseY >= newY+230-30 && mouseY <= newY+230-30+32){
				if(!editStat){
					if(tempAttack > 1){
						tempAttack--;
						statsLeft++;
						editStat = true;
					}
				}
			}

			if(mouseY >= newY+360-30 && mouseY <= newY+360-30+32){
				if(!editStat){
					if(tempDefense > 1){
						tempDefense--;
						statsLeft++;
						editStat = true;
					}
				}
			}
		}

		if(mouseX >= newX && mouseX <= newX+300 && mouseY >= newY+500 && mouseY <= height){
			displayStatChange = false;
			displayMenu = false;
			player.health = tempHealth;
			player.power = tempAttack;
			player.defense = tempDefense;
		}
	}
}

var tempHealth = 10; var tempAttack = 8; var tempDefense = 7;

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
			bullets = [];
			if(movingForward){
				player.x = 64;
			}else{
				player.x = width-65;
			}

			background = backgroundImages[1];

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
			warp1.forward = true;
			warp1.roomNum = false;
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
			bullets = [];
			if(movingForward)
				player.x = 40;
			else
				player.x = width-65;
			background = backgroundImages[2];

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
			healthEnemy.image = new Image();
			healthEnemy.image.src="res/enemyW.png";
			enemies.push(healthEnemy);
			var powerEnemy = clone(enemy);
			powerEnemy.still = true;
			powerEnemy.x = 640; powerEnemy.y = 160+64*2;
			powerEnemy.healthChance = 0; powerEnemy.powerChance = 100; powerEnemy.defenseChance = 0;
			powerEnemy.isActive = true;
			powerEnemy.image = new Image();
			powerEnemy.image.src="res/enemyB.png";
			enemies.push(powerEnemy);
			var defenseEnemy = clone(enemy);
			defenseEnemy.still = true;
			defenseEnemy.x = 640; defenseEnemy.y = 160+64*4;
			defenseEnemy.healthChance = 0; defenseEnemy.powerChance = 0; defenseEnemy.defenseChance = 100;
			defenseEnemy.isActive = true;
			defenseEnemy.image = new Image();
			defenseEnemy.image.src="res/enemyW.png";
			enemies.push(defenseEnemy);

			var warp2 = clone(warp);
			warp2.forward = true;
			warp2.x = width-37; warp2.y = 224;
			warp2.width = 38; warp2.height = 128;
			warp2.roomNum = false;
			warps.push(warp2);

			var warp3 = clone(warp);
			warp3.forward = false;
			warp3.x = 0; warp3.y = 224;
			warp3.roomNum = false;
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
			bullets = [];
			if(movingForward)
				player.x = 40;
			else{
				player.y = 35;
			}

			background = backgroundImages[3];

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
			enemy1.image = new Image();
			enemy1.image.src="res/enemyW.png";
			enemies.push(enemy1);

			var enemy2 = clone(enemy);
			enemy2.x = 850; enemy2.y = 200;
			enemy2.isActive = true;
			enemy2.image = new Image();
			enemy2.image.src="res/enemyB.png";
			enemies.push(enemy2);

			var warp2 = clone(warp);
			warp2.forward = true;;
			warp2.x = width-32; warp2.y = 0;
			warp2.height = height; warp2.width = 32;
			warp2.roomNum = false;
			warps.push(warp2);

			var warp3 = clone(warp);
			warp3.forward = false;
			warp3.x = 0; warp3.y = 224;
			warp3.width = 38; warp3.height = 128;
			warp3.roomNum = false;
			warps.push(warp3);

			var warp4 = clone(warp);
			warp4.forward = true;
			warp4.x = 263; warp4.y = 0;
			warp4.width = 155; warp4.height = 40;
			warp4.roomNum = true; warp4.numRoom = 8;
			warps.push(warp4);
			break;
		case 4:
			console.log("Init room 4");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			bullets = [];
			if(movingForward)
				player.x = 40;
			else 
				player.x = width-65;
			background = backgroundImages[4];

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
			var wall2 = clone(block);
			wall2.x = 0; wall2.y = 0;
			wall2.width = 32;
			wall2.height = height;
			walls.push(wall2);
			iggyWall = clone(block);
			iggyWall.x = 755; iggyWall.y = 0;
			iggyWall.width = 32; iggyWall.height = height;
			walls.push(iggyWall);
			iggyBossFight.isDead = false;
			iggyBossFight.health = iggyBossFight.maxHealth;
			iggyBossFight.isActive = true;
			enemies.push(iggyBossFight);
			break;
		case 5:
			console.log("Init room 5");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			bullets = [];
			if(movingForward){
				player.x = 40;
				if(player.y < 360)
					player.y = 361;
			}else{
				player.x = width-68;
			}

			background = backgroundImages[5];

			var wall1 = clone(block);
			wall1.x = 0; wall1.y = 0;
			wall1.width = 900; wall1.height = 360;
			walls.push(wall1);
			var wall2 = clone(block);
			wall2.x = 0; wall2.y = height;
			wall2.width = 900; wall2.height = 32;
			walls.push(wall2);
			var wall3 = clone(block);
			wall3.x = 0; wall3.y = 0;
			wall3.width = 32;
			wall3.height = height;
			walls.push(wall3);

			var enemy1 = clone(enemy);
			enemy1.x = 900/2; enemy1.y = 380;
			enemy1.isActive = true;
			enemy1.yStop = 359;
			enemy1.image = new Image();
			enemy1.image.src="res/enemyW.png";
			enemies.push(enemy1);

			var enemy2 = clone(enemy);
			enemy2.x = 850; enemy2.y = 475;
			enemy2.isActive = true;
			enemy2.yStop = 359;
			enemy2.image = new Image();
			enemy2.image.src="res/enemyB.png";
			enemies.push(enemy2);

			var enemy3 = clone(enemy);
			enemy3.x = 900/2+50; enemy3.y = 475;
			enemy3.isActive = true;
			enemy3.yStop = 359;
			enemy3.image = new Image();
			enemy3.image.src="res/enemyB.png";
			enemies.push(enemy3);

			var warp1 = clone(warp);
			warp1.x = width-32; warp1.y = 360;
			warp1.width = 32; warp1.height = height-360;
			warp1.forward = true;
			warp1.roomNum = false;
			warps.push(warp1);

			var secretWarp = clone(warp);
			secretWarp.x = 320; secretWarp.y = 317;
			secretWarp.width = 119; secretWarp.height = 58;
			secretWarp.forward = true; secretWarp.roomNum = true;
			secretWarp.numRoom = 9;
			warps.push(secretWarp);
		break;
		case 6:
			console.log("Init room 6");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			bullets = [];
			tickets = [];
			if(forward){
				player.x = 40;
			}

			background = backgroundImages[6];

			var wall1 = clone(block);
			wall1.x = 0; wall1.y = 0;
			wall1.width = 900; wall1.height = 360;
			walls.push(wall1);
			var wall2 = clone(block);
			wall2.x = 0; wall2.y = height;
			wall2.width = 900; wall2.height = 32;
			walls.push(wall2);

			var enemy1 = clone(enemy);
			enemy1.x = 900/2-100; enemy1.y = 380;
			enemy1.isActive = true;
			enemy1.yStop = 359;
			enemy1.image = new Image();
			enemy1.image.src="res/enemyW.png";
			enemies.push(enemy1);

			var enemy2 = clone(enemy);
			enemy2.x = 900/2; enemy2.y = 475;
			enemy2.isActive = true;
			enemy2.yStop = 359;
			enemy2.image = new Image();
			enemy2.image.src="res/enemyW.png";
			enemies.push(enemy2);

			var enemy3 = clone(enemy);
			enemy3.x = 900/2; enemy3.y = 550;
			enemy3.isActive = true;
			enemy3.yStop = 359;
			enemy3.image = new Image();
			enemy3.image.src="res/enemyB.png";
			enemies.push(enemy3);

			var warp1 = clone(warp);
			warp1.x = 858; warp1.y = 411;
			warp1.width = 33; warp1.height = 95;
			warp1.forward = true;
			warp1.roomNum = false;
			warps.push(warp1);

			var warp2 = clone(warp);
			warp2.x = 0; warp2.y = 360;
			warp2.width = 20; warp2.height = 240;
			warp2.forward = false;
			warp2.roomNum = false;
			warps.push(warp2);
			break;
		case 7://Final boss
			console.log("Init room 7");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			bullets = [];
			if(movingForward){
				player.x = 40;
			}
			background = backgroundImages[7];

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

			finalBoss = clone(shiaFight);
			finalBoss.x = width-96; finalBoss.y = height-96;
			finalBoss.isActive = true;
			finalBoss.isDead = false;
			finalBoss.health = finalBoss.maxHealth;
			enemies.push(finalBoss);
			break;
		case 8:
			console.log("Init room 8");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			bullets = [];
			if(movingForward){
				player.y = height-68;
			}else{
				player.y = 40;
			}
			background = backgroundImages[8];

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
			var wall4 = clone(block);
			wall4.x = 0; wall4.y = height-32;
			wall4.width = width;
			wall4.height = 32;
			walls.push(wall4);

			var enemy1 = clone(enemy);
			enemy1.x = 900/2-100; enemy1.y = 380;
			enemy1.isActive = true;
			enemy1.yStop = 359;
			enemy1.image = new Image();
			enemy1.image.src="res/enemyW.png";
			enemies.push(enemy1);

			var enemy2 = clone(enemy);
			enemy2.x = 40; enemy2.y = 250;
			enemy2.isActive = true;
			enemy2.yStop = 359;
			enemy2.image = new Image();
			enemy2.image.src="res/enemyW.png";
			enemies.push(enemy2);

			var enemy3 = clone(enemy);
			enemy3.x = 850; enemy3.y = 50;
			enemy3.isActive = true;
			enemy3.yStop = 359;
			enemy3.image = new Image();
			enemy3.image.src="res/enemyB.png";
			enemies.push(enemy3);

			var enemy4 = clone(enemy);
			enemy4.x = 900/2; enemy4.y = 100;
			enemy4.isActive = true;
			enemy4.yStop = 359;
			enemy4.image = new Image();
			enemy4.image.src="res/enemyB.png";
			enemies.push(enemy4);

			var warp1 = clone(warp);
			warp1.x = width-32; warp1.y = 0;
			warp1.width = 32; warp1.height = height;
			warp1.forward = true; warp1.roomNum = true; warp1.numRoom = 4;
			warps.push(warp1);

			var warp2 = clone(warp);
			warp2.x = 131; warp2.y = 565;
			warp2.width = 156; warp2.height = 33;
			warp2.forward = false; warp2.roomNum = true; warp2.numRoom = 3;
			warps.push(warp2);

			var warp3 = clone(warp);
			warp3.x = 131; warp3.y = 0;
			warp3.width = 156; warp3.height = 33;
			warp3.forward = true; warp3.roomNum = true; warp3.numRoom = 8;
			warps.push(warp3);

			break;
		case 9:
			console.log("Init room 9");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			bullets = [];
			if(movingForward){
				player.y = height-68;
			}
			background = backgroundImages[9];

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

			var warp1 = clone(warp);
			warp1.x = 416; warp1.y = 565;
			warp1.width = 64; warp1.height = 35;
			warp1.roomNum = true; warp1.numRoom = 5;
			warps.push(warp1);

			var ticket1 = clone(secretTicket);
			ticket1.x = 100; ticket1.y = 85;
			tickets.push(ticket1);

			break;
		case 10://Final boss room
			console.log("Init room 10");
			crayonBombs = [];
			enemies = [];
			walls = [];
			images = [];
			warps = [];
			bullets = [];
			background = backgroundImages[7];

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

			finalFight = clone(finalFBoss);
			finalFight.isActive = true;
			enemies.push(finalFight);
			break;
	}
}

setInterval(function(){//Game loop
	game();
}, 1000/fps);