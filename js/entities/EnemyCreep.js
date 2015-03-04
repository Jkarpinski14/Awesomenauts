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
		//console.log(this.health);
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