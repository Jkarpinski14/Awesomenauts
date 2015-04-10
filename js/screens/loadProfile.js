game.LoadProfile = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('gold-screen')), -10);
		//places the load-screen image as the background image for the loading page
		document.getElementById("input").style.visibility = "visible";
		document.getElementById("load").style.visibility = "visible";

		me.input.unbindKey(me.input.KEY.B);
		me.input.unbindKey(me.input.KEY.Q);
		me.input.unbindKey(me.input.KEY.E);
		me.input.unbindKey(me.input.KEY.W);
		me.input.unbindKey(me.input.KEY.A);
		//these keys are unbinded so that you can enter them into the username and password

		me.game.world.addChild(new (me.Renderable.extend({
			init: function(){
				this._super(me.Renderable, 'init', [10, 10, 300, 50]);
				this.font = new me.Font("Arial", 45, "black");
			},

			draw: function(renderer){
				this.font.draw(renderer.getContext(), "ENTER YOUR USERNAME AND PASSWORD", this.pos.x, this.pos.y);

			},	

		})));
	},
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function(renderer) {
		document.getElementById("input").style.visibility = "hidden";
		document.getElementById("load").style.visibility = "hidden";
	}
});