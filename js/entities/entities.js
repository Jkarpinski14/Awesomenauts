game.PlayerEntity = me.Entity.extend({
	init: function(x, y, settings){
		this.setSuper(x, y);
		this.setPlayerTimers();
		this.setAttributes();
		this.type = "PlayerEntity";
		this.setFlags();

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.addAnimation();
		this.renderable.setCurrentAnimation("idle");
	},

	setSuper: function(x, y){
		this._super(me.Entity, 'init', [x, y, {
			image: "player", 
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function(){
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);
	},

	setPlayerTimers: function(){
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastSpear = this.now;
		this.lastAttack = new Date().getTime();
		//haven't used attack as of video 17
	},

	setAttributes: function(){
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		//sets movement speed
		//the "20" allows the y-location to change
		this.attack = game.data.playerAttack;
		//added for the gold feature, used when a creep is killed by the player
	},

	setFlags: function(){
		this.facing = "right";
		this.dead = false;
		//added to serve as an initial value for the player's ability to die
		this.attacking = false;
	},
	//flags are things that only have one or two values

	addAnimation: function(){
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 667, 68, 69, 70, 71, 72], 80)
	},

	update: function(delta){
		this.now = new Date().getTime();
		this.dead = this.checkIfDead();
		this.checkKeyPressesAndMove();
		this.checkAbilityKeys();
		this.setAnimation();
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		//passing on paramaters about character pertaining to collision
		this.body.update(delta);
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	checkIfDead: function(){
		if(this.health <= 0){
			return true;
			//the lines of code that were previously here were eliminated because the melonJS update rendered them obsolete
		}
	},

	checkKeyPressesAndMove: function(){
		if(me.input.isKeyPressed("right")){
			this.moveRight();
		}
		else if(me.input.isKeyPressed("left")){
			this.moveLeft();
		}
		else{
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
			this.jump();
		}
		//allows our player to jump, binds to key pressed in play.js
		this.attacking = me.input.isKeyPressed("attack");
	},

	moveRight: function(){
		//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
		//me.timer.tick makes the movement appear smooth
		this.body.vel.x += this.body.accel.x * me.timer.tick;
		this.facing = "right";
		//keeps track of what direction your character is going
		this.flipX(true);
	},

	moveLeft: function(){
		this.facing = "left";
		//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
		//me.timer.tick makes the movement appear smooth
		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		//keeps track of what direction your character is going
		this.flipX(false);
	},

	jump: function(){
		this.body.jumping = true;
		this.body.vel.y -= this.body.accel.y * me.timer.tick;
	},

	checkAbilityKeys: function(){
		if(me.input.isKeyPressed("skill1")){
			//this.speedBurst();
		}
		else if(me.input.isKeyPressed("skill2")){
			//this.eatCreep();
		}
		else if(me.input.isKeyPressed("skill3")){
			this.throwSpear();
		}
	},

	throwSpear: function(){
		if(this.lastSpear >= game.data.spearTimer && game.data.ability3 >= 0){
			this.lastSpear = this.now;
			var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {});
			me.game.world.addChild(spear, 10);
		}	
	}

	setAnimation: function(){
		if(this.attacking){
			if(!this.renderable.isCurrentAnimation("attack")){
				//sets the current animation to attack and once that is over goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//makes it so that the next time we start this sequence we begin from the first animation, not wherever we left off when we switched to another animation
				this.renderable.setAnimationFrame();
			}
		}

		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");
			}
		}
		//allows the character to walk
		else if(!this.renderable.isCurrentAnimation("attack")){
			this.renderable.setCurrentAnimation("idle");
		}
		//makes the character return to idle when not moving
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
	},
	//causes depletion of health

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity'){
			this.collideWithEnemyBase(response);
			}
			//checking to see if it's been 1000 milliseconds (1 second) since the base was hit, so the player doesn't keep attacking over and over again
			else if(response.b.type==='EnemyCreep'){
				this.collideWithEnemyCreep(response);
			}

		},
	

	collideWithEnemyBase: function(response){
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;
			//response.b represents whatever we're colliding with

			if(ydif<-40 && xdif<70 && xdif>-35){
				this.body.falling = false;
				this.body.vel.y = -1;
			}
			//the ydif was moved to before the xdif because the console reads from top to bottom, and should take collisions from above as a first priority
			
			else if(xdif>-35 && this.facing==='right' && (xdif<0)){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x -1;
			}
			else if(xdif<70 && this.facing==='left' && (xdif>0)){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x +1;
			}
			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
				this.lastHit = this.now;
				response.b.loseHealth(game.data.playerAttack);
			};
	},

	collideWithEnemyCreep: function(response){
			var xdif = this.pos.x - response.b.pos.x;
			var ydif = this.pos.y - response.b.pos.y;
			this.stopMovement(xdif);

			if(this.checkAttack(xdif, ydif)){
				this.hitCreep(response);
			};	
	},

	stopMovement: function(xdif){
		if (xdif>0){
					this.pos.x = this.pos.x +1;
					if(this.facing==="left"){
						this.body.vel.x = 0;	
					}
				}
				else{
					this.pos.x = this.pos.x -1;
					if(this.facing==="right"){
						this.body.vel.x = 0;
					} 
				}
				//these lines of code keep the player from walking through the enemy
	},

	checkAttack: function(xdif, ydif){
		//if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
				//had error on line 152 for a while, realized an additional parentheses was added by mistake
				///&& (Math.abs(ydif <=40) && 
				//(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
				//the two parallel lines indicate "or"
				//){
		if (this.renderable.isCurrentAnimation('attack') && this.now-this.lastHit >= game.data.playerAttackTimer && (Math.abs(ydif<=40) && 
			((xdif>0) && this.facing === 'left') || ((xdif < 0 ) && this.facing === 'right')
			)){
				this.lastHit = this.now;
				//if the creeps' health is less than our attack, execute code in an if statement
				return true;
				//this will execute all the code that is inside the above brackets
			}
			return false;
			//if the attack check is false then the function will not happen
	},

	hitCreep: function(response){
		if(response.b.health <= game.data.playerAttack){
					game.data.gold += 1;
					console.log("Current gold: " + game.data.gold);
				}
				//adds one gold for our creep kill
				response.b.loseHealth(game.data.playerAttack);
	}
});
//classes have both entities capitalized, while methods have only the second entity in caps