game.PlayerEntity = me.Entity.extend({
	init: function(x, y, settings){
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

		this.type = "PlayerEntity";
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		//sets movement speed
		//the "20" allows the y-location to change
		this.facing = "right";
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.dead = false;
		//added to serve as an initial value for the player's ability to die
		this.lastAttack = new Date().getTime();
		//havent used attack as of video 17
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 667, 68, 69, 70, 71, 72], 80)

		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		this.now = new Date().getTime();

		if(this.health <= 0){
			this.dead = true;
			//the lines of code that were previously here were eliminated because the melonJS update rendered them obsolete
		}

		if(me.input.isKeyPressed("right")){
			//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement appear smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.facing = "right";
			//keeps track of what direction your character is going
			this.flipX(true);
		}
		else if(me.input.isKeyPressed("left")){
			//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement appear smooth
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.facing = "left";
			//keeps track of what direction your character is going
			this.flipX(false);
		}
		else{
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
			this.body.jumping = true;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}
		//allows our player to jump, binds to key pressed in play.js

		if(me.input.isKeyPressed("attack")){
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

		me.collision.check(this, true, this.collideHandler.bind(this), true);
		//passing on paramaters about character pertaining to collision

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
		console.log(this.health - damage);
	},
	//causes depletion of health

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity'){
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;
			//response.b represents whatever we're colliding with
			
			console.log("xdif" + xdif + "ydif" + ydif);

			if(ydif<-40 && xdif<70 && xdif>-35){
				this.body.falling = false;
				this.body.vel.y = -1;
			}
			//the ydif was moved to before the xdif because the console reads from top to bottom, and should take collisions from above as a first priority
			
			else if(xdif>-35 && this.facing==='right' && (xdif<0)){
				this.body.vel.x = 0;
				//this.pos.x = this.pos.x - 1;
			}
			else if(xdif<70 && this.facing==='left' && (xdif>0)){
				this.body.vel.x = 0;
				//this.pos.x = this.pos.x + 1;
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
				console.log("tower Hit");
				this.lastHit = this.now;
				response.b.loseHealth(game.data.playerAttack);
			}
			//checking to see if it's been 1000 milliseconds (1 second) since the base was hit, so the player doesn't keep attacking over and over again
			else if(response.b.type==='EnemyCreep'){
				var xdif = this.pos.x - response.b.pos.x;
				var ydif = this.pos.y - response.b.pos.y;

				if (xdif>0){
					//this.pos.x = this.pos.x + 1;
					if(this.facing==="left"){
						this.body.vel.x = 0;
					}
				}
				else{
					//this.pos.x = this.pos.x - 1;
					if(this.facing==="right"){
						this.body.vel.x = 0;
					} 
				}
				//these lines of code keep the player from walking through the enemy

				if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
					//had error on line 152 for a while, realized an additional parentheses was added by mistake
					&& (Math.abs(ydif) <=40) && 
					(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
					//the two parallel lines indicate "or"
					){
					this.lastHit = this.now;
					response.b.loseHealth(game.playerAttack);
				}
			}

		}
	}

});
//classes have both entities capitalized, while methods have only the second entity in caps
game.PlayerBaseEntity = me.Entity.extend({
	init : function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}

		}]);

		this.broken = false;
		this.health = game.data.playerBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		this.type = "PlayerBase";

		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
		//adds the animation of the player base to the game screen
	},

	update:function(delta){
		if(this.health<=0){
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		//kills the game if the health reaches or goes below zero
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
	},

	onCollision: function(){

	}
});

game.EnemyBaseEntity = me.Entity.extend({
	init : function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}

		}]);

		this.broken = false;
		this.health = game.data.enemyBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		this.type = "EnemyBaseEntity";

		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
		//adds the animation of the enemy base to the game screen
	},

	update:function(delta){
		if(this.health<=0){
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		//renders the base obsolite should it reach zero
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
		//delta represents time
	},

	onCollision: function(){
		
	},

	loseHealth: function(){
		this.health--;
	}
});
//this second "base" entity is for the enemy tower

game.EnemyCreep = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "creep1", 
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function(){
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);
		this.health = game.data.enemyCreepHealth;
		this.alwaysUpdate = true;
		this.attacking = false;
		//this.attacking lets us know if the enemy is currently attacking
		this.lastAttacking = new Date().getTime();
		//keeps track of when our creep last attacked anything
		this.lastHit = new Date().getTime();
		//keeps track of the last time our creep hit anything
		this.now = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type = "EnemyCreep";

		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
	},

	update: function(delta){
		console.log(this.health);
		if(this.health <= 0){
			me.game.world.removeChild(this);
		}
		//removes the creep from the map if its health goes beneath zero

		this.now = new Date().getTime();

		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		//makes the creep land on the ground floor and animate in a negative direction (left)
		
		me.collision.check(this, true, this.collideHandler.bind(this), true);

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		//calls to the super

		return true;
	},

	collideHandler: function(response){
		if(response.b.type==='PlayerBase'){
			this.attacking=true;
			this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to maintain its position
			this.pos.x = this.pos.x + 1;
			//checks that it has been at least one second since this creep hit a base

			if((this.now-this.lastHit >= 1000)){
				//updates the lastHit timer
				this.lastHit = this.now;
				response.b.loseHealth(game.data.enemyCreepAttack);
				//makes the player base call its loseHealth function and passes it a damage of one
			}
		}
		else if(response.b.type === 'PlayerEntity'){
			var xdif = this.pos.x - response.b.pos.x;

			this.attacking=true;
			//this.lastAttacking=this.now;
			if(xdif>0){
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
			}
			//makes sure you have to be behind the creep

			if((this.now-this.lastHit >= 1000 && xdif>0)){
				this.lastHit = this.now;
				response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}
	}
});
//more or less the same code as our previous entities - this time for the creeps

game.GameManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();

		this.alwaysUpdate = true;
	},

	update: function(){
		this.now = new Date().getTime();

		if(game.data.player.dead){
			me.game.world.removeChild(game.data.player);
			//line of code added to make the initial dead player disappear
			me.state.current().resetPlayer(10, 0);
			//line of code added to respawn a player when health reaches zero
		}

		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
			//% (mod) checks to see if we have a multiple of 10
			//makes u wait at least a second for the next creep to spawn
			this.lastCreep = this.now;
			//this.now is the timer
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}
		//keeps track of our timer and whether or not new creeps should be made

		return true;
	}
});