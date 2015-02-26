game.GameManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();
		this.pause = false;
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

		if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
			game.data.gold += 1;
			console.log("Current gold: " + game.data.gold);
		}
		//prevents from happenning more than once every twenty seconds

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