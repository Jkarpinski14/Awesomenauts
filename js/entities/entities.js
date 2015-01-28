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
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);

		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		if(me.input.isKeyPressed("right")){
			//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement appear smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.flipX(true);
		}
		else if(me.input.isKeyPressed("left")){
			//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement appear smooth
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.flipX(false);
		}
		else{
			this.body.vel.x = 0;
		}

		if(this.body.vel.x !== 0){
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");
			}
		}
		//allows the character to walk
		else{
			this.renderable.setCurrentAnimation("idle");
		}
		//makes the character return to idle when not moving

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
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
				return (new me.Rect(0, 0, 100, 100)).toPolygon();
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
				return (new me.Rect(0, 0, 100, 100)).toPolygon();
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
		
	}
});
//this second "base" entity is for the enemy tower