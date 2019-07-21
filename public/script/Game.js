
var socket = io();
//socket.emit('chat message', "It works!");

socket.on('hey', function(msg){
      console.log(msg)
 });

socket.on('start', function(){
	//update();
});

socket.on('draw', function(rects){
	draw(rects);
});

socket.on('windowSize', function(data){
	console.log(data.width)
	console.log(data.height)
});
// Get the canvas element form the page
var canvas = document.getElementById("myCanvas");
 
/* Rresize the canvas to occupy the full page, 
   by getting the widow width and height and setting it to canvas*/
 
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
socket.emit("windowSize", {width: canvas.width, height: canvas.height});
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


let highlight = -1;

let offsetX = 0;
let offsetY = 0;








//let newState = update(state)


//makePlayer("Victoria", 300, 200, "l", "j", "#008080")

//makePlayer("Max", 300, 400, "d", "a", "#800080")

//makePlayer("Victoria", 400, 600, "l", "j", "#808000")


//makePlayer("David", 600, 1600, "6", "4", "#808000")





//state.players[0].speed = 5;

//makePlayer("David", 900, 600, "ArrowRight", "ArrowLeft", "#808000")

//makePlayer(1000, 600, "4", "6", "#808080")

document.addEventListener('keydown', function (e) {

	socket.emit("keyPressed", e.key);
	/*
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
	*/
});

window.addEventListener('resize', function (e) {
	canvas.width  = this.innerWidth;
	canvas.height = this.innerHeight;
	socket.emit("windowSize", {width: canvas.width, height: canvas.height});
	//border = [{x: 0, y: 0, width: canvas.width, height: 20}, {x: 0, y: 0, width: 20, height: canvas.height}, {x: canvas.width-20, y: 0, width: 20, height: canvas.height}, {x: 0, y: canvas.height - 20, width: canvas.width, height: 20}];
});

function draw(rects){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(let i = 0; i<rects.length; i++){
		ctx.fillStyle = rects[i].color;
		ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height)
	}
}





function checkIntersection(horizontal, vertical){

}

function addBorder(rect){

}

function checkCollision2(line1, line2){
	return false;
}