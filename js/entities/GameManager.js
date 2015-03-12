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

game.HeroDeathManager = Object.extend({
	init: function(x, y, settings){
		this.alwaysUpdate = true;
	},

	update: function(){
		if(game.data.player.dead){
			me.game.world.removeChild(game.data.player);
			//line of code added to make the initial dead player disappear
			me.state.current().resetPlayer(10, 0);
			//line of code added to respawn a player when health reaches zero
		}

		return true;
	}
});

game.ExperienceManager = Object.extend({
	init: function(x, y, settings){
		this.alwaysUpdate = true;
		this.gameover = false;
	},

	update: function(){
		if(game.data.win === true && !this.gameover){
			this.gameOver(true);
		}
		//gives 10 experience points if a base is successfully destroyed
		else if(game.data.win === false && !this.gameover){
			this.gameOver(false);
		}
		//only 1 experience point given if there's a loss
		//only allows the if and else if statements to run if the game is NOT over

		return true;
		//if your base is broken first, then you lose
	},

	gameOver: function(win){
		if(win){
			game.data.exp += 10;
		}
		else{
			game.data.exp += 1;
		}
		console.log(game.data.exp);
		this.gameover = true;
		//will make the game end if your base is crushed
		me.save.exp = game.data.exp;
	}
	//boolean means either set to true or false
});