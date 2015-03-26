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

game.spendGold = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.lastBuy = new Date().getTime();
		this.paused = false;
		this.alwaysUpdate = true;
		this.updateWhenPaused = true;
		this.buying = false;	
	},

	update: function(){
		this.now = new Date().getTime();

		if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >=1000){
			this.lastBuy = this.now;
			if(!this.buying){
				this.startBuying();
			}
			//calls the startBuying function
			else{
				this.stopBuying();
			}
			//calls the stopBuying function
		}

		return true;
	},

	startBuying: function(){
		this.buying = true;
		me.state.pause(me.state.PLAY);
		game.data.pausePos = me.game.viewport.localToWorld(0, 0);
		game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
		game.data.buyscreen.updateWhenPaused = true;
		game.data.buyscreen.setOpacity(0.8);
		me.game.world.addChild(game.data.buyscreen, 34);
		game.data.player.body.setVelocity(0, 0);
		me.input.bindKey(me.input.KEY.F1, "F1", true);
		me.input.bindKey(me.input.KEY.F2, "F2", true);
		me.input.bindKey(me.input.KEY.F3, "F3", true);
		me.input.bindKey(me.input.KEY.F4, "F4", true);
		me.input.bindKey(me.input.KEY.F5, "F5", true);
		me.input.bindKey(me.input.KEY.F6, "F6", true);
		this.setByText();
	},
	//brings up an opaque pause screen

	setBuyText: function(){
		game.data.buytext = new (me.Renderable.extend({
			init: function(){
				this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
				this.font = new me.Font("Arial", 26, "black");
				this.updateWhenPaused =  true;
				this.alwaysUpdate = true;
			},

			draw: function(renderer){
				this.font.draw(renderer.getContext(), "Press F1-F6 to buy, B to Exit. Current Gold: " + game.data.gold, this.pos.x, this.pos.y);
				this.font.draw(renderer.getContext(), "Skill 1: Turnt Up Damage. Current Level: " + game.data.skill1 + " ; Cost: " + ((game.data.skill1+1)*10), this.pos.x, this.pos.y + 40);
				this.font.draw(renderer.getContext(), "Skill 2: Andale! Ariba! Current Level: " + game.data.skill2 + " ; Cost: " + ((game.data.skill1+2)*10), this.pos.x, this.pos.y + 80);
				this.font.draw(renderer.getContext(), "Skill 3: Turnt Up Health. Current Level: " + game.data.skill3 + " ; Cost: " + ((game.data.skill3+1)*10), this.pos.x, this.pos.y + 120);
				this.font.draw(renderer.getContext(), "Q Ability: Speedy Gonzales. Current Level: " + game.data.ability1 + " ; Cost: " + ((game.data.ability1+1)*10), this.pos.x, this.pos.y + 160);
				this.font.draw(renderer.getContext(), "W Ability: Eat Creep For Health: " + game.data.ability2 + " ; Cost: " + ((game.data.ability2+1)*10), this.pos.x, this.pos.y + 200);
				this.font.draw(renderer.getContext(), "E Ability: Throw Your Spear: " + game.data.ability3 + " ; Cost: " + ((game.data.ability3+1)*10), this.pos.x, this.pos.y + 240);
				//these lines of code add text to the buy screen and keep track of the gold and experience variables
				//the variables in turn allow us to purchase abilities and skills
			}
			//missing bracket here was causing error	
				
		}));
		me.game.world.addChild(game.data.buytext, 35);
	},
	//makes sure the text only appears on the pause screen

	stopBuying: function(){
		this.buying = false;
		me.state.resume(me.state.PLAY);
		game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
		me.game.world.removeChild(game.data.buyscreen);
		me.input.unbindKey(me.input.KEY.F1, "F1", true);
		me.input.unbindKey(me.input.KEY.F2, "F2", true);
		me.input.unbindKey(me.input.KEY.F3, "F3", true);
		me.input.unbindKey(me.input.KEY.F4, "F4", true);
		me.input.unbindKey(me.input.KEY.F5, "F5", true);
		me.input.unbindKey(me.input.KEY.F6, "F6", true);
		//prevents the keys from being activated on any screen besides the one they're designated for
		me.game.world.removeChild(game.data.buytext);
	}
	//removes the pause screen when "B" is pressed again

});