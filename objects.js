var player = {
	x: 64, y: height/2,
	width: 32, height: 32,
	velX: 0, velY: 0,
	speed: 5,
	dirUp: 0, dirRight: 0, dir: 0,
	health: 10, power: 10, defense: 3,
	move: true,
	side1: {x: 0, y: 0, width: 3, height: 20},
	side2: {x: 0, y: 0, width: 3, height: 20},
	top1: {x: 0, y: 0, width: 20, height: 3},
	top2: {x: 0, y: 0, width: 20, height: 3},
	crayon: {x: 0, y: 0, width:32, height: 8},
	displayCrayon: false,
	image: new Image(),
	damageTimer: 0, startDamageTimer: false, canTakeDamage: true,
	update: function(){
		for(var i=0; i<enemies.length;i++){//Goes through all the enemies in the game
			if(isColliding(player, enemies[i])){//Player is colliding with an enemy
				var ePower = enemies[i].power-this.defense;
				if(ePower < 1)//If the enemy is doing less than 1 damage
					ePower = 1;//Enemy does 1 damage always
				if(this.canTakeDamage){
					this.health -= ePower;
					console.log("Player is taking damage " + ePower);
				}
				this.startDamageTimer = true;
				this.canTakeDamage = false;
			}
		}

		if(this.startDamageTimer){
			this.damageTimer++;
			if(this.damageTimer >= 45*3){//3 seconds
				this.startDamageTimer = false;
				this.damageTimer = 0;
				this.canTakeDamage = true;
			}
		}

		for(var i=0; i<hearts.length;i++){//Goes through all drops on the screen
			if(isColliding(player, hearts[i])){
				this.health += 3;
				hearts.splice(i,1);
			}
		}

		for(var i=0; i<powers.length;i++){//Goes through all drops on the screen
			if(isColliding(player, powers[i])){
				this.power += 1;
				powers.splice(i,1);
			}
		}

		for(var i=0; i<defenses.length;i++){//Goes through all drops on the screen
			if(isColliding(player, defenses[i])){
				this.defense += 1;
				defenses.splice(i,1);
			}
		}

		if(this.health <= 0){
			this.health = 5;
			if(this.power > 3)
				this.power--;
			if(this.defense > 3)
				this.defense--;
			this.x = 128;
			this.y = height/2;
			room = 0;
			changeRoom = true;
		}

		if(this.displayCrayon){
			switch(this.dir){
				case 1:
					this.crayon.x = this.x+8;
					this.crayon.y = this.y-30;
					this.crayon.width = 8;
					this.crayon.height = 16;
				break;
				case 2:
					this.crayon.x = this.x+8;
					this.crayon.y = this.y+30;
					this.crayon.width = 8;
					this.crayon.height = 16;
				break;
				case 3:
					this.crayon.x = this.x-30;
					this.crayon.y = this.y+8;
					this.crayon.width = 16;
					this.crayon.height = 8;
				break;
				case 4:
					this.crayon.x = this.x+30;
					this.crayon.y = this.y+8;
					this.crayon.width = 16;
					this.crayon.height = 8;
				break;
			}
		}else{
			this.crayon.x = this.x;
			this.crayon.y = this.y;
		}
	}
};

var crayonBomb = {
	x: 0, y: 0,
	width: 128, height: 128,
	isActive: false,
	destroyTimer: 0,
	color: "#FFFFFF",
	size: 1,
	update: function(){
		if(this.isActive){
			this.destroyTimer++;
			if(this.destroyTimer >= 150){
				this.isActive = false;
				var index = crayonBombs.indexOf(this);
				if(index > -1)
					crayonBombs.splice(index, 1);
			}
		}
	}
};

var block = {
	x: 0, y: 0,
	width: 0, height: 0,
	image: new Image()
};

var enemy = {
	x: 0, y: 0,
	velX: 0, velY: 0,
	width: 32, height: 32,
	health: 13, power: 7, maxHealth: 13,
	isActive: false,
	speed: 3,
	enemyTimer: 0, dir: 1,
	side1: {x: 0, y: 0, width: 3, height: 20},
	side2: {x: 0, y: 0, width: 3, height: 20},
	top1: {x: 0, y: 0, width: 20, height: 3},
	top2: {x: 0, y: 0, width: 20, height: 3},
	still: false,
	healthChance: 15, powerChance: 30, defenseChance: 45,
	damageTimer: 0, startDamageTimer: false, canTakeDamage: true,
	image: new Image(),
	update: function(){
		if(this.isActive){
			this.enemyTimer++;
			if(!this.still){//If the enemy is not still
				this.x += this.velX;
				this.y += this.velY;
			}
			switch(this.dir){
				case 1:
					this.velY = this.speed;
					this.velX = 0;
					break;
				case 2:
					this.velY = -this.speed;
					this.velX = 0;
				break;
				case 3:
					this.velX = -this.speed;
					this.velY = 0;
				break;
				case 4:
					this.velX = this.speed;
					this.velY = 0;
				break;
			}
			if(this.enemyTimer >= 45){
				var newDir = Math.floor((Math.random()*4)+1);//Finds a random number 1-4
				this.dir = newDir;
				this.enemyTimer = 0;
			}

			if(this.y < 32){
				this.dir = 1;
				this.y = 33;
				console.log("Changed direction to down");
			}
			if(this.y > height-64){
				this.dir = 2;
				this.y = height-65;
				console.log("Changed direction to up");
			}
			if(this.x < 32){
				this.dir = 4;
				this.x = 33;
				console.log("Changed direction to right");
			}
			if(this.x > width-64){
				this.dir = 3;
				this.x = width-65;
				console.log("Changed direction to left");
			}

			//Collision
			for(var i = 0; i<crayonBombs.length; i++){
				console.log("Found a bomb");
				if(isColliding(this, crayonBombs[i])){//Colliding with a caryon bomb
					this.health = 0;
				}
			}

			//More collision
			if(isColliding(this, player.crayon)){//Colliding with the players crayon
				if(player.displayCrayon){//Player is displaying crayon
					if(this.canTakeDamage)
						this.health -= player.power;
					this.startDamageTimer = true;
					this.canTakeDamage = false;
				}
			}//End of player crayon

			if(this.startDamageTimer){
				this.damageTimer++;
				if(this.damageTimer >= 45*2){//2 seconds
				this.startDamageTimer = false;
				this.damageTimer = 0;
				this.canTakeDamage = true;
				}
			}

			if(this.health <= 0){//Death
				//Enemy is dying
					var drop = 0;//1 Health    2 Strength     3 Defense
					var chance = Math.floor((Math.random()*100)+1);
					if(chance >= 1 && chance <= this.healthChance)
						drop = 1;

					if(chance >= this.healthChance+1 && chance <= this.powerChance)
						drop = 2;

					if(chance >= this.powerChance+1 && chance <= this.defenseChance)
						drop = 3;
					console.log("Drop Chance: " + chance);

					switch(drop){
						case 1:
							var heart1 = clone(heart);
							heart1.x = this.x; heart1.y = this.y;
							heart1.image.src="res/health.png";
							hearts.push(heart1);
							console.log("Added a heart to the game");
							break;
						case 2:
							var power1 = clone(strength);
							power1.x = this.x; power1.y = this.y;
							power1.image.src="res/power.png";
							powers.push(power1);
							console.log("Added a power to the game");
							break;
						case 3:
							var def1 = clone(defense);
							def1.x = this.x; def1.y = this.y;
							def1.image.src="res/defense.png";
							defenses.push(def1);
							console.log("Added a defense to the game");
						break;
					}
					console.log("Collided with a crayon bomb");
					var index = enemies.indexOf(this);
					if(index > -1)
						enemies.splice(index, 1);
			}
		}//End of is active
	}//End of update
};

var warp = {
	x: 0, y: 0,
	width: 0, height: 0,
	forward: true,
	update: function(){
		if(isColliding(this, player)){//Player is collding with the warp
			if(this.forward){
				changeRoom = true;
			}else
				goBackRoom = true;	
		}
	}
};

var image = {
	x: 0, y: 0,
	image: new Image()
};

var heart = {
	x: 0, y: 0,
	width: 32, height: 32,
	image: new Image()
};

var strength = {
	x: 0, y: 0,
	width: 32, height: 32,
	image: new Image()
};

var defense = {
	x: 0, y: 0,
	width: 32, height: 32,
	image: new Image()
};

var iggyBoss = {
	x: 0, y: 0,
	velX: 0, velY: 4,
	width: 32, height: 32,
	health: 50, power: 7, maxHealth: 50,
	isActive: false,
	speed: 4,
	enemyTimer: 0, dir: 1,
	side1: {x: 0, y: 0, width: 3, height: 20},
	side2: {x: 0, y: 0, width: 3, height: 20},
	top1: {x: 0, y: 0, width: 20, height: 3},
	top2: {x: 0, y: 0, width: 20, height: 3},
	still: false,
	healthChance: 15, powerChance: 30, defenseChance: 45,
	damageTimer: 0, startDamageTimer: false, canTakeDamage: true,
	attackTimer: 0,
	image: new Image(),
	update: function(){
		if(this.isActive){
			this.enemyTimer++;
			if(!this.still){//If the enemy is not still
				this.x += this.velX;
				this.y += this.velY;
			}

			if(this.y <= 33){
				this.velY = this.speed;
			}else if(this.y >= height-65){
				this.velY = -this.speed;
			}

			attackTimer++;
			if(attackTimer >= 80){//Iggy does an attack
				attackTimer = 0;

			}

			//Collision
			for(var i = 0; i<crayonBombs.length; i++){
				console.log("Found a bomb");
				if(isColliding(this, crayonBombs[i])){//Colliding with a caryon bomb
					this.health -= 15;
				}
			}

			//More collision
			if(isColliding(this, player.crayon)){//Colliding with the players crayon
				if(player.displayCrayon){//Player is displaying crayon
					if(this.canTakeDamage)
						this.health -= player.power;
					this.startDamageTimer = true;
					this.canTakeDamage = false;
				}
			}//End of player crayon

			if(this.startDamageTimer){
				this.damageTimer++;
				if(this.damageTimer >= 45*2){//2 seconds
				this.startDamageTimer = false;
				this.damageTimer = 0;
				this.canTakeDamage = true;
				}
			}

			if(this.health <= 0){//Death
				//Enemy is dying
					var drop = 0;//1 Health    2 Strength     3 Defense
					var chance = Math.floor((Math.random()*100)+1);
					if(chance >= 1 && chance <= this.healthChance)
						drop = 1;

					if(chance >= this.healthChance+1 && chance <= this.powerChance)
						drop = 2;

					if(chance >= this.powerChance+1 && chance <= this.defenseChance)
						drop = 3;
					console.log("Drop Chance: " + chance);

					switch(drop){
						case 1:
							var heart1 = clone(heart);
							heart1.x = this.x; heart1.y = this.y;
							heart1.image.src="res/health.png";
							hearts.push(heart1);
							console.log("Added a heart to the game");
							break;
						case 2:
							var power1 = clone(strength);
							power1.x = this.x; power1.y = this.y;
							power1.image.src="res/power.png";
							powers.push(power1);
							console.log("Added a power to the game");
							break;
						case 3:
							var def1 = clone(defense);
							def1.x = this.x; def1.y = this.y;
							def1.image.src="res/defense.png";
							defenses.push(def1);
							console.log("Added a defense to the game");
						break;
					}
					console.log("Collided with a crayon bomb");
					var index = enemies.indexOf(this);
					if(index > -1)
						enemies.splice(index, 1);
			}
		}//End of is active
	}//End of update
};

var crayonImage1 = new Image();
var crayonImage2 = new Image();
var crayonImage3 = new Image();
var crayonImage4 = new Image();

window.onload = function(){//Init function goes through only once
	
	player.image.src = "res/player.png";
	crayonImage1.src = "res/crayon.png";
	crayonImage2.src = "res/crayon2.png";
	crayonImage3.src = "res/crayon3.png";
	crayonImage4.src = "res/crayon4.png";
	enemy.image.src = "res/enemy.png";
	iggyBoss.image.src = "res/enemy.png";
	if(screen.width <= 1000){
		mobile = true;
		console.log("Mobile is true and dpad will be there");
	}else{
		mobile = false;
		console.log("Game is not mobile and there will be no dpad");
	}
	changeRoom = true;

	iggyBossFight = clone(iggyBoss);
	iggyBossFight.x = 755;
	iggyBossFight.y = 128;
}