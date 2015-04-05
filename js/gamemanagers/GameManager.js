game.ExperienceManager = Object.extend({
	init: function(x, y, settings){
		this.alwaysUpdate = true;
		this.gameover = false;
	},

	update: function(){
		if(game.data.win === true && !this.gameover){
			this.gameOver(true);
			alert("YOU WIN!!!");
		}
		//gives 10 experience points if a base is successfully destroyed
		else if(game.data.win === false && !this.gameover){
			this.gameOver(false);
			alert("YOU'RE A FAILURE AT LIFE!");
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

			$.ajax({
				type: "POST",
				url: "php/controller/save-user.php",
				data: {
					exp: game.data.exp,
					exp1: game.data.exp1,
					exp2: game.data.exp2,
					exp3: game.data.exp3,
					exp4: game.data.exp4,
				},
				dataType: "text"
			})
			.success(function(response){
				if(response==="true"){
					me.state.change(me.state.MENU);
				}
				else{
					alert(response);
				}
			})
			.fail(function(response){
				alert("Fail");
			});
			//runs the AJAX code when the player loses the game
			//saves the experience through the save-user file
			//reverts the player to the main menu screen
	}
	//boolean means either set to true or false
});