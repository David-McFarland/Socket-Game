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
let speed = 5;
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
	turn = false;
	turn2 = false;
	let oldDirection = direction;
	let oldDirection2 = direction2;
	if(e.key == "ArrowRight"){
		direction = (direction + 1) % 4;
		turn = true;
	}
	else if(e.key == "ArrowLeft"){
		direction = (direction + 3) % 4;
		turn = true;
	}
	if(e.key == "d"){
		direction2 = (direction2 + 1) % 4;
		turn2 = true;
	}
	else if(e.key == "a"){
		direction2 = (direction2 + 3) % 4;
		turn2 = true;
	}
	if(speed == 0){
		turn = false;
		turn2 = false;
		direction = oldDirection;
		direction2 = oldDirection2;
	}
	if(turn){
		path.push(makeRectangle(x, y, lastX, lastY, oldDirection));
	}
	if(turn2){
		path.push(makeRectangle(x2, y2, lastX2, lastY2, oldDirection2));
	}
});

window.addEventListener('resize', function (e) {
	canvas.width  = this.innerWidth;
	canvas.height = this.innerHeight;
	border = [{x: 0, y: 0, width: canvas.width, height: 20}, {x: 0, y: 0, width: 20, height: canvas.height}, {x: canvas.width-20, y: 0, width: 20, height: canvas.height}, {x: 0, y: canvas.height - 20, width: canvas.width, height: 20}];
});


function update(){
	if(turn){
		lastX = x;
		lastY = y;
		//turn = false;
	}

	if(turn2){
		lastX2 = x2;
		lastY2 = y2;
		//turn = false;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "Red";
	let rect;
	let rect2;

	if(direction == 0){ //Up
		y -= speed;
		rect = {x: x, y: y, width: 20, height: speed};
	}
	else if(direction == 1){ //Right
		rect = {x: x+20, y: y, width: speed, height:20};
		x += speed;	
	}
	else if(direction == 2){ //Down
		rect = {x: x, y: y+20, width: 20, height: speed};
		y += speed;
	}
	else if(direction == 3){ //Left
		x -= speed;
		rect = {x: x, y: y, width: speed, height: 20};
	}

	if(direction2 == 0){ //Up
		y2 -= speed;
		rect2 = {x: x2, y: y2, width: 20, height: speed};
	}
	else if(direction2 == 1){ //Right
		rect2 = {x: x2+20, y: y2, width: speed, height:20};
		x2 += speed;	
	}
	else if(direction2 == 2){ //Down
		rect2 = {x: x2, y: y2+20, width: 20, height: speed};
		y2 += speed;
	}
	else if(direction2 == 3){ //Left
		x2 -= speed;
		rect2 = {x: x2, y: y2, width: speed, height: 20};
	}

	path.push(makeRectangle(x, y, lastX, lastY, direction));
	path2.push(makeRectangle(x2, y2, lastX2, lastY2, direction2));
	if(turn){
		//path.push({x:0, y:0, width:0, height: 0});
		
	}
	
	for(let i = 0; i<path.length; i++){
		
		let check = checkCollision(path[i], rect);
		if(check  && speed != 0){
			speed = 0;
			console.log("Victoria Wins!!!");
		}

		check = checkCollision(path[i], rect2);
		if(check  && speed != 0){
			speed = 0;
			console.log("David Wins!!!");
		}
	}
	for(let i = 0; i<border.length; i++){
		
		let check = checkCollision(border[i], rect);
		if(check  && speed != 0){
			speed = 0;
			console.log("Victoria Wins!!!");
		}


		
	}


	for(let i = 0; i<path2.length; i++){
		
		let check = checkCollision(path2[i], rect);
		if(check  && speed != 0){
			speed = 0;
			console.log("Victoria Wins!!!");
		}


		check = checkCollision(path2[i], rect2);
		if(check  && speed != 0){
			speed = 0;
			console.log("David Wins!!!");
		}
	}
	for(let i = 0; i<border.length; i++){
		
		let check = checkCollision(border[i], rect2);
		if(check  && speed != 0){
			speed = 0;
			console.log("David Wins!!!");
		}
		
	}

	

/*
	counter++;
	if(counter % 100 == 0){
		speed++;
	}
*/

	for(let i = 0; i<path.length; i++){
		if(i == highlight){
			ctx.fillStyle = "blue";
		}
		ctx.fillRect(path[i].x, path[i].y, path[i].width, path[i].height)
		ctx.fillStyle = "red";
	}

	for(let i = 0; i<path2.length; i++){
		if(i == highlight){
			ctx.fillStyle = "blue";
		}
		ctx.fillRect(path2[i].x, path2[i].y, path2[i].width, path2[i].height)
		ctx.fillStyle = "red";
	}
	
	ctx.fillStyle = "Black";
	ctx.fillRect(x, y, 20, 20);
	
	ctx.fillRect(x2, y2, 20, 20);
	
	for( let i = 0; i<border.length; i++){
		ctx.fillRect(border[i].x, border[i].y, border[i].width, border[i].height)
	}
	
	//ctx.fillStyle = "Blue";
	//ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
	ctx.fillStyle = "Black";

	
	if(!turn){
		path.pop();
	}
	else{
		turn = false;
		path.pop();
	}

	if(!turn2){
		path2.pop();
	}
	else{
		turn2 = false;
		path2.pop();
	}
	requestAnimationFrame(update);
}
update();

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