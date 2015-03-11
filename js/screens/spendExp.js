game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('exp-screen')), -10);
		//the -10 is the z-axis for putting our title screen in the back
		//the above line of code adds an image to the title screen

		me.input.bindKey(me.input.KEY.F1, "F1");
		me.input.bindKey(me.input.KEY.F2, "F2");
		me.input.bindKey(me.input.KEY.F3, "F3");
		me.input.bindKey(me.input.KEY.F4, "F4");
		me.input.bindKey(me.input.KEY.F5, "F5");

		me.game.world.addChild(new (me.Renderable.extend({
			init: function(){
				this._super(me.Renderable, 'init', [10, 10, 300, 50]);
				this.font = new me.Font("Arial", 45, "black");
			},

			draw: function(renderer){
				this.font.draw(renderer.getContext(), "Press F1-F4 to buy, F5 to skip", this.pos.x, this.pos.y);
				this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
				this.font.draw(renderer.getContext(), "F1: INCREASE GOLD PRODUCTION " + game.data.exp1.toString() + " ; cost: " + ((game.data.exp1 + 1) * 10), this.pos.x, this.pos.y + 100);
				this.font.draw(renderer.getContext(), "F2: ADD STARTING GOLD ", this.pos.x, this.pos.y + 150);
				this.font.draw(renderer.getContext(), "F3: INCREASE ATTACK DAMAGE ", this.pos.x, this.pos.y + 200);
				this.font.draw(renderer.getContext(), "F4: INCREASE HEALTH ", this.pos.x, this.pos.y + 250);
				//adds text to the screen
				//the numbers added to the x and y positions move the text down as to not overlap
			},	
		})));

		this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge){
			if(action === "F1"){

			}
			else if(action === "F2"){

			}
			else if(action === "F3"){

			}
			else if(action === "F4"){

			}
			else if(action === "F5"){
				me.state.change(me.state.PLAY);
			}
		});
	},
	 
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function(renderer) {
		me.input.unbindKey(me.input.KEY.F1, "F1");
		me.input.unbindKey(me.input.KEY.F2, "F2");
		me.input.unbindKey(me.input.KEY.F3, "F3");
		me.input.unbindKey(me.input.KEY.F4, "F4");
		me.input.unbindKey(me.input.KEY.F5, "F5");
		me.event.unsubscribe(this.handler);
	}
});
//this new file is run when you select "continue" and is proceeded by the option to spend experience or play the game