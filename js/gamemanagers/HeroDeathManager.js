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