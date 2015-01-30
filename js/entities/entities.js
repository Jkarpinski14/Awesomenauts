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

		this.body.setVelocity(5, 20);
		//sets movement speed
		//the "20" allows the y-location to change
		this.facing = "right";
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime();
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80)

		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		this.now = new Date().getTime();
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
				this.pos.x = this.pos.x - 1;
			}
			else if(xdif<70 && this.facing==='left' && (xdif>0)){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x + 1;
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000){
				console.log("tower Hit");
				this.lastHit = this.now;
				response.b.loseHealth();
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
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "PlayerBaseEntity";

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
		this.health = 10;
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