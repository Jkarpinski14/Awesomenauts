game.SpendGold = Object.extend({
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

		this.checkBuyKeys();

		return true;
	},

	startBuying: function(){
		this.buying = true;
		me.state.pause(me.state.PLAY);
		game.data.pausePos = me.game.viewport.localToWorld(0, 0);
		game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('title-screen'));
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
		this.setBuyText();
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
	},
	//removes the pause screen when "B" is pressed again

	checkBuyKeys: function(){
		if(me.input.isKeyPressed("F1")){
			if(this.checkCost(1)){
				this.makePurchase(1);
			}
		}
		else if(me.input.isKeyPressed("F2")){
			if(this.checkCost(2)){
				this.makePurchase(2);
			}
		}
		else if(me.input.isKeyPressed("F3")){
			if(this.checkCost(3)){
				this.makePurchase(3);
			}
		}
		else if(me.input.isKeyPressed("F4")){
			if(this.checkCost(4)){
				this.makePurchase(4);
			}
		}
		else if(me.input.isKeyPressed("F5")){
			if(this.checkCost(5)){
				this.makePurchase(5);
			}
		}
		else if(me.input.isKeyPressed("F6")){
			if(this.checkCost(6)){
				this.makePurchase(6);
			}
		}
	},

	checkCost: function(skill){
		if(skill===1 && (game.data.gold >= ((game.data.skill1+1)*10))){
			return true;
		}
		else if(skill===2 && (game.data.gold >= ((game.data.skill2+1)*10))){
			return true;
		}
		else if(skill===3 && (game.data.gold >= ((game.data.skill3+1)*10))){
			return true;
		}
		else if(skill===4 && (game.data.gold >= ((game.data.ability1+1)*10))){
			return true;
		}
		else if(skill===5 && (game.data.gold >= ((game.data.ability2+1)*10))){
			return true;
		}
		else if(skill===6 && (game.data.gold >= ((game.data.ability3+1)*10))){
			return true;
		}
		else{
			return false;
		}
	},
	//checks that the gold content is more than what is required to purchase the skill upgrade
	//returns as true and runs the makePurchase function

	makePurchase: function(){
		if(skill === 1){
			game.data.gold -= ((game.data.skill1 +1)* 10);
			game.data.skill1 += 1;
			game.data.playerAttack += 1;
		}
		else if(skill === 2){
			game.data.gold -= ((game.data.skill2 +1)* 10);
			game.data.skill2 += 1;
		}
		else if(skill === 3){
			game.data.gold -= ((game.data.skill3 +1)* 10);
			game.data.skill3 += 1;
		}
		else if(skill === 4){
			game.data.gold -= ((game.data.ability1 +1)* 10);
			game.data.ability1 += 1;
		}
		else if(skill === 5){
			game.data.gold -= ((game.data.ability2 +1)* 10);
			game.data.ability2 += 1;
		}
		else if(skill === 6){
			game.data.gold -= ((game.data.ability3 +1)* 10);
			game.data.ability3 += 1;
		}	
	}
	//checks if the skill level for each particular skill is at a certain amount
	//if so, the amount (at the time) of gold that it would take to power up that ability is removed from the player's current gold content
	//then it adds to the skill level total

});