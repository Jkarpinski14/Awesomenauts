game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('exp-screen')), -10);
		//the -10 is the z-axis for putting our title screen in the back
		//the above line of code adds an image to the title screen

		me.game.world.addChild(new (me.Renderable.extend({
			init: function(){
				this._super(me.Renderable, 'init', [270, 240, 300, 50]);
				this.font = new me.Font("Arial", 54, "black");
			},

			draw: function(renderer){
				this.font.draw(renderer.getContext(), "SPEND", this.pos.x, this.pos.y);
				//adds text to the title screen
			},
		})));

	},
	 
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function(renderer) {
		
	}
});	