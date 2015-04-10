game.MiniMap = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, "init", [x, y, {
			image: "minimap",
			width: 223,
			height: 281,
			spritewidth: "223",
			spriteheight: "281",
			getShape: function(){
				return (new me.Rect(0, 0, 223, 281)).toPolygon();
			}
		}]);
		this.floating = true;
	}
});