game.GameTimerManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();
		this.pause = false;
		this.alwaysUpdate = true;
	},

	update: function(){
		this.now = new Date().getTime();
		this.goldTimerCheck();
		this.creepTimerCheck();
		return true;
	},

	goldTimerCheck: function(){
		if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
			game.data.gold += game.data.exp1+1;
			//replaced the number with a variable for gold incrementing purposes
			console.log("Current gold: " + game.data.gold);
		}
		//prevents from happenning more than once every twenty seconds
	},

	creepTimerCheck: function(){
		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
			//% (mod) checks to see if we have a multiple of 10
			//makes u wait at least a second for the next creep to spawn
			this.lastCreep = this.now;
			//this.now is the timer
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}
		//keeps track of our timer and whether or not new creeps should be made
	}
});