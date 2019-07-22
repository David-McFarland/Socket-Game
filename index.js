var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
/*
app.get('/', function(req, res){
  res.sendFile('/index.html', {'root': '../html'});
  //res.sendFile('/Game.js', {'root': '../script'});
});
*/
let state = {
	players: [],
	speed: 10,
	width: 5000,
	height: 5000
}

let numOfPlayers = 3;
let livingPlayers = 3;
/*
	Bugs: Resizing

	You need to fix the resizing bug. Offsets do not work
	well when you change the screen size.

	Add living and dead paths. This will allow me to draw players
	that are alive ontop of dead players to fix redering issue. 
	This should include the user's playing.

	Clean up structure of code.

	When goes too fast reders poorly.
*/


io.on('connection', function(socket){
	//console.log(socket.id);

  
  
	//console.log("Ahhhh")
  socket.on('windowSize', function(data){
  	for(let i = 0; i<state.players.length; i++){
  		if(state.players[i].id === socket.id){
  			state.players[i].screenWidth = data.width;
  			state.players[i].screenHeight = data.height;
  			break;
  		}
  	}
  });

  socket.on("name", function(name, screen){
  	if(!start){
  		makePlayer(name, socket.id, 600, 450 - 100 * state.players.length, "d", "a", "#808000", screen.width, screen.height);
	  	io.emit("newPlayer", state.players.length + " out of " + numOfPlayers + " players.");
  	}
  });

  socket.on("keyPressed", function(key){
  	//console.log(key);
	let oldDirections = [];
	//console.log(key);
	if(key === "ArrowLeft"){
		key = "a";
	}
	else if(key === "ArrowRight"){
		key = "d";
	}
	for(let i = 0; i<state.players.length; i++){
		oldDirections.push(state.players[i].direction);
		if(state.players[i].id !== socket.id){
			//console.log(state.players.name)
			//console.log(socket.id)
			continue;
		}
		if(state.players[i].turn){
			continue;
		}
		if(key == state.players[i].right){
			state.players[i].direction = (state.players[i].direction + 1) % 4;
			state.players[i].turn = true;
		}
		else if(key == state.players[i].left){
			state.players[i].direction = (state.players[i].direction + 3) % 4;
			state.players[i].turn = true;
		}

		if(state.players[i].speed == 0){
			state.players[i].turn = false;
			state.players[i].direction = oldDirections[i];
			
		}

		if(state.players[i].turn){
			state.players[i].path.push(makeRectangle(state.players[i].x, state.players[i].y, 
				state.players[i].lastX, state.players[i].lastY, oldDirections[i]));
		}
	}

	


  });

  socket.on('disconnect', function(){
		//console.log("diconnect");
		for(let i = 0; i<state.players.length; i++){
			if(state.players[i].id === socket.id){
				state.players.splice(i, 1);
				io.emit("newPlayer", state.players.length + " out of " + numOfPlayers + " players.");
				//io.to(`${socket.id}`).emit("newPlayer", state.players.length + " out of " + numOfPlayers + " players.");
			}
		}
		
	});



});

//io.to(`${socketId}`).emit('hey', 'I just met you');
//io.emit('some event', { for: 'everyone' });

let num = 0;
let start = false;
setInterval(sendMessage, 1000);




//makePlayer(socket.id, 600, 400 - 100 * ids.length, "d", "a", "#808000", 1536, 900);
let stopUpdate;

function sendMessage(){
	//console.log(state.players.length)
	//console.log(ids.length)
	if(state.players.length === numOfPlayers && !start){
		//io.emit('start');
		stopUpdate = setInterval(update, 16);

		start = true;
		//console.log("Start");
		//console.log(state.players[0].offsetX)
	}
	//io.to(`${ids[num % 3]}`).emit('hey', 'I just met you');  	
	//num++;
}
http.listen(3000, function(){
  console.log('listening on *:3000');
});




//console.log(io.sockets);

/*
app.get('/', function(req, res){
  res.sendFile("index.html", {'root': '../'});
});
*/

//let canvas = {width: 1500, height: 900};


let border = [{x: 0, y: 0, width: state.width, height: 20}, {x: 0, y: 0, width: 20, height: state.height}, {x: state.width-20, y: 0, width: 20, height: state.height}, {x: 0, y: state.height - 20, width: state.width, height: 20}];



function makePlayer(name, id, x, y, right, left, color, width, height){
	let offsetX = 0;
	let offsetY = 0;

	if(x > state.width - width / 2){
		offsetX = state.width - width;
	}
	else{
		offsetX = x - width / 2;
	}

	if(y > state.height - height / 2){
		offsetY = state.height - height;
	}
	else{
		offsetY = y - height / 2;
	}
	//console.log(offsetX);
	state.players.push({
		name: name,
		id: id,
		x: x,
		y: y,
		lastX: x,
		lastY: y,
		offsetX: offsetX,
		offsetY: offsetY,
		screenWidth: width,
		screenHeight: height,
		direction: 1,
		turn: false,
		right: right, //This will be removed. 
		left: left, //This will be removed.
		path: [],
		speed: state.speed,
		color: color,
		headColor: "#000000",
		alive: true
	})
}


function update(){
	data = [];
	for(let i = 0; i<state.players.length; i++){
		if(state.players[i].turn){
			state.players[i].lastX = state.players[i].x;
			state.players[i].lastY = state.players[i].y;
			state.players[i].turn = false;
		}

		if(state.players[i].alive == false){
			state.players[i].color = fadeToWhite(state.players[i].color, 3);
			state.players[i].headColor = fadeToWhite(state.players[i].headColor, 3);
		}
		data.push({otherPath: [], yourPath: [], names: []});
	}
	
/*
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "Red";
	ctx.font = "30px Arial";
*/
	let rects = [];

	for(let i = 0; i<state.players.length; i++){
		
		if(state.players[i].direction == 0){ //Up
			state.players[i].y -= state.players[i].speed;
			state.players[i].offsetY -= state.players[i].speed;
			rects.push({x: state.players[i].x, y: state.players[i].y, width: 20, height: state.players[i].speed});
		}
		else if(state.players[i].direction == 1){ //Right
			rects.push({x: state.players[i].x+20, y: state.players[i].y, width: state.players[i].speed, height:20});
			state.players[i].x += state.players[i].speed;	
			state.players[i].offsetX += state.players[i].speed;
		}
		else if(state.players[i].direction == 2){ //Down
			rects.push({x: state.players[i].x, y: state.players[i].y+20, width: 20, height: state.players[i].speed});
			state.players[i].y += state.players[i].speed;
			state.players[i].offsetY += state.players[i].speed;
		}
		else if(state.players[i].direction == 3){ //Left
			state.players[i].x -= state.players[i].speed;
			state.players[i].offsetX -= state.players[i].speed;
			rects.push({x: state.players[i].x, y: state.players[i].y, width: state.players[i].speed, height: 20});
		}
		
		if(state.players[i].x < state.players[i].screenWidth/2 || state.players[i].offsetX < 0){
			state.players[i].offsetX = 0;
		}
		if(state.players[i].y < state.players[i].screenHeight/2 || state.players[i].offsetY < 0){
			state.players[i].offsetY = 0;
		}
		if(state.players[i].x > state.width - state.players[i].screenWidth/2 || state.players[i].offsetX > state.width - state.players[i].screenWidth){
			state.players[i].offsetX = state.width - state.players[i].screenWidth;
		}
		if(state.players[i].y > state.height - state.players[i].screenHeight/2 || state.players[i].offsetY > state.height - state.players[i].screenHeight){
			state.players[i].offsetY = state.height - state.players[i].screenHeight;
		}
		//data[i].x = state.players[i].x - state.players[i].offsetX;
		//data[i].y = state.players[i].y - state.players[i].offsetY;
	}

	

	
	
	let playersView = []
	for(let i = 0; i<state.players.length; i++){
		playersView.push({x: state.players[i].offsetX, y: state.players[i].offsetY, width: state.players[i].screenWidth, height: state.players[i].screenHeight});	
	} 
	//console.log(playersView);

	
	for(let i = 0; i<state.players.length; i++){
		state.players[i].path.push(makeRectangle(state.players[i].x,
			state.players[i].y, state.players[i].lastX, state.players[i].lastY,
			state.players[i].direction));
	}
	
	for(let k = 0; k<state.players.length; k++){
		for(let j = 0; j<state.players.length; j++){
			for(let i = 0; i<state.players[j].path.length; i++){
				let check = checkCollision(state.players[j].path[i], rects[k]);
				if(check  && state.players[j].alive == true){
					state.players[k].speed = 0;
					state.players[k].alive = false;
					livingPlayers--;
					if(livingPlayers === 1){
						win();
					}
					lose(state.players[k].id)
				}
			}
		}
	}

	for(let j = 0; j<state.players.length; j++){
		
		for(let i = 0; i<border.length; i++){
			
			let check = checkCollision(border[i], rects[j]);
			if(check  && state.players[j].alive == true){
				state.players[j].speed = 0;
				state.players[j].alive = false;
				livingPlayers--;
				if(livingPlayers === 1){
					win();
				}
				lose(state.players[j].id)
			}
		}
	}
	
	for(let k = 0; k<state.players.length; k++){
		for(let j = 0; j<state.players.length; j++){
			for(let i = 0; i<state.players[j].path.length; i++){
				if(checkCollision(playersView[k], state.players[j].path[i])){
					if(k !== j){
						data[k].otherPath.push({x: state.players[j].path[i].x - state.players[k].offsetX, y: state.players[j].path[i].y  - state.players[k].offsetY,
						width: state.players[j].path[i].width, height: state.players[j].path[i].height, color: state.players[j].color})
					}
					else{
						data[k].yourPath.push({x: state.players[j].path[i].x - state.players[k].offsetX, y: state.players[j].path[i].y  - state.players[k].offsetY,
						width: state.players[j].path[i].width, height: state.players[j].path[i].height, color: state.players[j].color})	
					}
					/*
					ctx.fillStyle = state.players[j].color;
					ctx.fillRect(state.players[j].path[i].x - offsetX, state.players[j].path[i].y  - offsetY, 
					state.players[j].path[i].width, state.players[j].path[i].height);
					*/
				}
			}
		}
	}
	
	/*
		Have logic to check head on colisions. 
	*/
	
	for(let k = 0; k<state.players.length; k++){
		for(let i = 0; i<state.players.length; i++){
			if(checkCollision(playersView[k], {x: state.players[i].x, y: state.players[i].y, width: 20, height: 20})){
				if(k !== i){
					data[k].otherPath.push({x: state.players[i].x - state.players[k].offsetX, y: state.players[i].y - state.players[k].offsetY, width: 20, height: 20, color: state.players[i].headColor})
				}
				else{
					data[k].yourPath.push({x: state.players[i].x - state.players[k].offsetX, y: state.players[i].y - state.players[k].offsetY, width: 20, height: 20, color: state.players[i].headColor})
				}
				
				/*
				ctx.fillStyle = state.players[i].headColor;
				ctx.fillRect(state.players[i].x - offsetX, state.players[i].y - offsetY, 20, 20);
				*/
			}
			//ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
			
			//ctx.fillStyle = state.players[i].color;
			//ctx.fillText(state.players[i].name, state.players[i].x  - offsetX, state.players[i].y-20 - offsetY);
			for( let j = 0; j<border.length; j++){
				data[k].otherPath.push({x: border[j].x - state.players[k].offsetX, y: border[j].y - state.players[k].offsetY, width: border[j].width, height: border[j].height, color: "#000000"});
				//ctx.fillRect(border[i].x - offsetX, border[i].y - offsetY, border[i].width, border[i].height)
			}
			data[k].names.push({name: state.players[i].name, x: state.players[i].x - state.players[k].offsetX, y: state.players[i].y - state.players[k].offsetY, color: state.players[i].color});
		}
	}
	

	for(let i = 0; i<state.players.length; i++){
		state.players[i].path.pop();
	}
//	ctx.fillStyle = "Black";
		
	for( let i = 0; i<border.length; i++){
		//ctx.fillRect(border[i].x - offsetX, border[i].y - offsetY, border[i].width, border[i].height)
	}
	
	//ctx.fillStyle = "Blue";
	//ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
//	ctx.fillStyle = "Black";

	for(let i = 0; i<state.players.length; i++){

		io.to(`${state.players[i].id}`).emit("draw", data[i]);

	}
	//requestAnimationFrame(update);
}

function win(){
	for(let i = 0; i<state.players.length; i++){
		if(state.players[i].alive){
			io.to(state.players[i].id).emit("win");
		}
	}
	clearInterval(stopUpdate);
	setTimeout(restart, 1000);
}

function restart(){
	for(let i = 0; i<state.players.length; i++){
		state.players[i].path = [];

		state.players[i].x = 100;
		state.players[i].y = 100 + 300*i;
		state.players[i].lastX = 100;
		state.players[i].lastY = 100 + 300*i;

		if(state.players[i].x > state.width - state.players[i].screenWidth / 2){
			state.players[i].offsetX = state.width - state.players[i].width;
		}
		else{
			state.players[i].offsetX = state.players[i].x - state.players[i].screenWidth / 2;
		}

		if(state.players[i].y > state.height - state.players[i].screenHeight / 2){
			state.players[i].offsetY = state.height - state.players[i].height;
		}
		else{
			state.players[i].offsetY = state.players[i].y - state.players[i].screenHeight / 2;
		}
		state.players[i].color = "#808000";
		state.players[i].headColor = "#000000";
		livingPlayers = numOfPlayers;
		state.players[i].direction = 1
		state.players[i].alive = true;
		state.players[i].speed = 10;
	}
	stopUpdate = setInterval(update, 16);
	io.emit("restart");
}

function lose(id){
	//console.log("Winner");
	io.to(id).emit("lose");
}

function fadeToWhite(color, speed = 1){
	let string = "#"
	
	let nums = [];
	for(let i = 0; i<3; i++){
		nums.push(parseInt(color.substring(1+2*i, 3+2*i), 16) + speed)
		if(nums[i] > 255){
			nums[i] = 255;
		}
		if(nums[i] < 16){
			string += "0";
		}
		string += nums[i].toString(16);
	}	
	return string;
}

function makeRectangle(x, y, lastX, lastY, direction){
	let x1, x2, y1, y2;
	if(x > lastX){
		x1 = lastX;
		x2 = x;
	}
	else if(x == lastX){
		x1 = x;
		x2 = x+20;
	}
	else{
		x1 = x;
		x2 = lastX;	
	}

	if(y > lastY){
		y1 = lastY;
		y2 = y;
	}
	else if(y == lastY){
		y1 = y;
		y2 = y+20;
	}
	else{
		y1 = y;
		y2 = lastY;	
	}

	if(direction == 0){
		y1 += 20;
		y2 += 20;
	}
	else if(direction == 3){
		x1 += 20;
		x2 += 20;
	}

	if(direction == 0){
		y1 -= (20 - state.speed);
	}
	else if(direction == 1){
		x2 += (20 - state.speed);
	}
	else if(direction == 2){
		y2 += (20 - state.speed);
	}
	else{
		x1 -= (20 - state.speed);
	}

	return {x: x1, y: y1, width: (x2 - x1), height: (y2 - y1)};
}

function checkCollision(rect1, rect2){
	if(!(rect1.x && rect1.y && rect1.width && rect1.height)){
		if(rect1.width == 0 || rect1.height == 0){
			return false;
		}
		if(!(rect1.x == 0 || rect1.y == 0)){
			console.log("Rect1 is not a rectangle");
			return false
		}
		
	}
	if(!(rect2.x && rect2.y && rect2.width && rect2.height)){
		if(rect2.width == 0 || rect2.height == 0){
			return false;
		}

		if(!(rect2.x == 0 || rect2.y == 0)){
			console.log("Rect2 is not a rectangle");
			return false
		}
		
	}

	if(rect1.x + rect1.width <= rect2.x
	|| rect2.x + rect2.width <= rect1.x
	|| rect1.y + rect1.height <= rect2.y
	|| rect2.y + rect2.height <= rect1.y){
		return false;
	}
	
	return true;
}