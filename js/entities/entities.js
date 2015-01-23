game.PlayerEntity = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "player", 
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function(){
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);

		this.body.setVelocity(5, 20);
		//sets movement speed
		//the "20" allows the y-location to change
	},

	update: function(delta){
		if(me.input.isKeyPressed("right")){
			//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement appear smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}
		else if(me.input.isKeyPressed("left")){
			//adds to the position of my "x" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement appear smooth
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
		}
		else{
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("up")){
			//adds to the position of my "y" by the velocity defined above in setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement appear smooth
			this.body.vel.y += this.body.accel.y * me.timer.tick;
		}
		else{
			this.body.vel.y = 0;
		}

		this.body.update(delta);
		return true;
	}
});
//classes have both entities capitalized, while methods have only the second entity in caps