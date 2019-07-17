// Get the canvas element form the page
var canvas = document.getElementById("myCanvas");
 
/* Rresize the canvas to occupy the full page, 
   by getting the widow width and height and setting it to canvas*/
 
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

ctx = canvas.getContext('2d');

let path = [];
let speed = 5;
let counter = 0;
let turn = false;
let x = canvas.width * (1/3);
let y = canvas.height * (3/4);
let lastX = x;
let lastY = y;
let direction = 2; //0: Right, 1: Left, 2: Up, 3: Down

/*
let state = {
	player1: {
		last:x
		x: ...,
		y: ...,
		direction: ...
	},
	player2: {
		x: ...
		y: ...
		direction: ...
	},
	speed: 5,

}

let newState = update(state)
*/


document.addEventListener('keydown', function (e) {
	if(e.key == "ArrowRight" && direction != 1 && direction != 0){
		direction = 0;
		path.push(makeRectangle(x, y, lastX, lastY));
		turn = true;
	}
	else if(e.key == "ArrowLeft" && direction != 0  && direction != 1){
		direction = 1;
		path.push(makeRectangle(x, y, lastX, lastY));
		turn = true;
	}
	else if(e.key == "ArrowUp"  && direction != 3  && direction != 2){
		direction = 2;
		path.push(makeRectangle(x, y, lastX, lastY));
		turn = true;
	}
	else if(e.key == "ArrowDown"  && direction != 2  && direction != 3){
		direction = 3;
		path.push(makeRectangle(x, y, lastX, lastY));
		turn = true;
	}
});



function update(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "Red";
	let rect;
	path.push(makeRectangle(x, y, lastX, lastY));
	if(direction == 0){ //Right
		rect = {x: x+20, y: y, width: speed, height:20};
		x += speed;	
	}
	else if(direction == 1){ //Left
		x -= speed;
		rect = {x: x, y: y, width: speed, height: 20};
	}
	else if(direction == 2){ //Up
		y -= speed;
		rect = {x: x, y: y, width: 20, height: speed};
	}
	else if(direction == 3){ //Down
		rect = {x: x, y: y+20, width: 20, height: speed};
		y += speed;
	}
	ctx.rect(rect.x, rect.y, rect.width, rect.height)
	
	for(let i = 0; i<path.length; i++){
		let check = checkCollision(path[i], rect);
		console.log(checkCollision(path[i], rect));
		console.log(rect)
			console.log(path[i])
			
		if(check  && speed != 0){
			console.log("Collision!!!");
			console.log(rect)
			console.log(path[i])
			console.log(check)
			speed = 0;
		}
	}



/*
	counter++;
	if(counter % 100 == 0){
		speed++;
	}
*/
	
	ctx.fill();
	ctx.fillStyle = "Black";
	ctx.fillRect(x, y, 20, 20);

	if(turn){
		lastX = x;
		lastY = y;
		turn = false;
	}

	path.pop();
	//requestAnimationFrame(update);
}
//update();

function makeRectangle(x, y, lastX, lastY){
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

	return {x: x1, y: y1, width: (x2 - x1), height: (y2 - y1)};
}

function checkCollision(rect1, rect2){
	//console.log(rect2);
	if(!(rect1.x && rect1.y && rect1.width && rect1.height)){
		if(rect1.width == 0 || rect1.height == 0){
			return false;
		}
		console.log("Rect1 is not a rectangle");
		return
	}
	if(!(rect2.x && rect2.y && rect2.width && rect2.height)){
		if(rect2.width == 0 || rect2.height == 0){
			return false;
		}
		console.log("Rect2 is not a rectangle");
		return
	}

	if(rect1.x + rect1.width <= rect2.x
	|| rect2.x + rect2.width <= rect2.x
	|| rect1.y + rect1.height <= rect2.y
	|| rect2.y + rect2.height <= rect2.y){
		return false;
	}
	return true;
}