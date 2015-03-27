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