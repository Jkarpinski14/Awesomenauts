game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10);
		//the -10 is the z-axis for putting our title screen in the back
		//the above line of code adds an image to the title screen

		me.game.world.addChild(new (me.Renderable.extend({
			init: function(){
				this._super(me.Renderable, 'init', [270, 240, 300, 50]);
				this.font = new me.Font("Arial", 54, "red");
				me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
				//"pointerdown" listens for the mouse to be clicked down
				//"this" checks if you are clicking on the defined object
			},

			draw: function(renderer){
				this.font.draw(renderer.getContext(), "START A NEW GAME", this.pos.x, this.pos.y);
				//adds text to the title screen
			},

			update: function(dt){
				return true;
			},

			newGame: function(){
				me.input.releasePointerEvent('pointerdown', this);
				//"releasePointerEvent" makes sure the computer doesn't keep listening for the clicker event as the game goes on
				me.save.remove('exp');
				me.save.remove('exp1');
				me.save.remove('exp2');
				me.save.remove('exp3');
				me.save.remove('exp4');
				me.state.change(me.state.PLAY);
				//eliminates the saved data in the exp variables when a new game is started
			}
		})));

		me.game.world.addChild(new (me.Renderable.extend({
			init: function(){
				this._super(me.Renderable, 'init', [380, 340, 250, 50]);
				this.font = new me.Font("Arial", 54, "red");
				me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
				//"pointerdown" listens for the mouse to be clicked down
				//"this" checks if you are clicking on the defined object
			},

			draw: function(renderer){
				this.font.draw(renderer.getContext(), "CONTINUE", this.pos.x, this.pos.y);
				//adds text to the title screen
			},

			update: function(dt){
				return true;
			},

			newGame: function(){
				game.data.exp = me.save.exp;
				game.data.exp1 = me.save.exp1;
				game.data.exp2 = me.save.exp2;
				game.data.exp3 = me.save.exp3;
				game.data.exp4 = me.save.exp4;
				//loads the experience points from a previously saved game
				me.input.releasePointerEvent('pointerdown', this);
				//"releasePointerEvent" makes sure the computer doesn't keep listening for the clicker event as the game goes on
				me.state.change(me.state.SPENDEXP);
				//doesn't delete the values saved in the exp variables
			}
		})));
		//continues the game you were previously playing instead of starting a new one

	},
	 
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function(renderer) {
		
	}
});
