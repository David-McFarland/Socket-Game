var socket = io();
console.log(socket)
socket.emit('chat message', "It works!");
// Get the canvas element form the page
var canvas = document.getElementById("myCanvas");
 
/* Rresize the canvas to occupy the full page, 
   by getting the widow width and height and setting it to canvas*/
 
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.overflow = 'hidden';

ctx = canvas.getContext('2d');

let path = [];
let path2 = [];
let speed = 2;
let counter = 0;
let turn = false;
let turn2 = false;
let x = canvas.width * (1/3);
x = Math.round(x + x%5)
let y = canvas.height * (3/4);
y = Math.round(y + y%5)


let x2 = canvas.width * (2/3);
x2 = Math.round(x2 + x%5)
let y2 = canvas.height * (3/4);
y2 = Math.round(y2 + y%5)
let lastX = x;
let lastY = y;
let lastX2 = x2;
let lastY2 = y2;
let direction = 0; //0: Up, 1: Right, 2: Down, 3: Left
let direction2 = 0; //0: Up, 1: Right, 2: Down, 3: Left
let border = [{x: 0, y: 0, width: canvas.width, height: 20}, {x: 0, y: 0, width: 20, height: canvas.height}, {x: canvas.width-20, y: 0, width: 20, height: canvas.height}, {x: 0, y: canvas.height - 20, width: canvas.width, height: 20}];
let highlight = -1;

let state = {
	players: [],
	speed: 10
}

//let newState = update(state)

function makePlayer(name, x, y, right, left, color){
	state.players.push({
		name: name,
		x: x,
		y: y,
		lastX: x,
		lastY: y,
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

makePlayer("Victoria", 300, 200, "l", "j", "#008080")

makePlayer("Max", 300, 400, "d", "a", "#800080")

//makePlayer("Victoria", 400, 600, "l", "j", "#808000")


makePlayer("David", 300, 600, "6", "4", "#808000")

//state.players[0].speed = 5;

//makePlayer("David", 900, 600, "ArrowRight", "ArrowLeft", "#808000")

//makePlayer(1000, 600, "4", "6", "#808080")

document.addEventListener('keydown', function (e) {
	let oldDirections = [];
	for(let i = 0; i<state.players.length; i++){
		oldDirections.push(state.players[i].direction);
		if(state.players[i].turn){
			continue;
		}
		if(e.key == state.players[i].right){
			state.players[i].direction = (state.players[i].direction + 1) % 4;
			state.players[i].turn = true;
		}
		else if(e.key == state.players[i].left){
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

window.addEventListener('resize', function (e) {
	canvas.width  = this.innerWidth;
	canvas.height = this.innerHeight;
	border = [{x: 0, y: 0, width: canvas.width, height: 20}, {x: 0, y: 0, width: 20, height: canvas.height}, {x: canvas.width-20, y: 0, width: 20, height: canvas.height}, {x: 0, y: canvas.height - 20, width: canvas.width, height: 20}];
});


function update(){
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
	}
	

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "Red";
	ctx.font = "30px Arial";
	let rects = [];

	for(let i = 0; i<state.players.length; i++){
		
		if(state.players[i].direction == 0){ //Up
			state.players[i].y -= state.players[i].speed;
			rects.push({x: state.players[i].x, y: state.players[i].y, width: 20, height: state.players[i].speed});
		}
		else if(state.players[i].direction == 1){ //Right
			rects.push({x: state.players[i].x+20, y: state.players[i].y, width: state.players[i].speed, height:20});
			state.players[i].x += state.players[i].speed;	
		}
		else if(state.players[i].direction == 2){ //Down
			rects.push({x: state.players[i].x, y: state.players[i].y+20, width: 20, height: state.players[i].speed});
			state.players[i].y += state.players[i].speed;
		}
		else if(state.players[i].direction == 3){ //Left
			state.players[i].x -= state.players[i].speed;
			rects.push({x: state.players[i].x, y: state.players[i].y, width: state.players[i].speed, height: 20});
		}
	}

	
	
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
			}
		}
	}
	

	for(let j = 0; j<state.players.length; j++){
		for(let i = 0; i<state.players[j].path.length; i++){
			ctx.fillStyle = state.players[j].color;
			ctx.fillRect(state.players[j].path[i].x, state.players[j].path[i].y, 
				state.players[j].path[i].width, state.players[j].path[i].height)			
		}
	}
	
	/*
		Have logic to check head on colisions. 
	*/
	

	for(let i = 0; i<state.players.length; i++){
		ctx.fillStyle = state.players[i].headColor;
		ctx.fillRect(state.players[i].x, state.players[i].y, 20, 20);
		//ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
		state.players[i].path.pop();
		ctx.fillStyle = state.players[i].color;
		ctx.fillText(state.players[i].name, state.players[i].x, state.players[i].y-20);
	}
	
	ctx.fillStyle = "Black";
		
	for( let i = 0; i<border.length; i++){
		ctx.fillRect(border[i].x, border[i].y, border[i].width, border[i].height)
	}
	
	//ctx.fillStyle = "Blue";
	//ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
	ctx.fillStyle = "Black";


	requestAnimationFrame(update);
}
update();

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

function checkIntersection(horizontal, vertical){

}

function addBorder(rect){

}

function checkCollision2(line1, line2){
	return false;
}