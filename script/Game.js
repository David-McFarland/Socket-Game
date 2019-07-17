// Get the canvas element form the page
var canvas = document.getElementById("myCanvas");
 
/* Rresize the canvas to occupy the full page, 
   by getting the widow width and height and setting it to canvas*/
 
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

ctx = canvas.getContext('2d');

let path = [];
let speed = 20;
let counter = 0;
let turn = false;
let x = canvas.width * (1/3);
let y = canvas.height * (3/4);
let lastX = x;
let lastY = y;
let direction = 2; //0: Right, 1: Left, 2: Up, 3: Down

document.addEventListener('keydown', function (e) {
	if(e.key == "ArrowRight" && direction != 1 && direction != 0){
		direction = 0;
		path.push(makeRectangle(x, y, lastX, lastY))
		turn = true;
	}
	else if(e.key == "ArrowLeft" && direction != 0  && direction != 1){
		direction = 1;
		path.push(makeRectangle(x, y, lastX, lastY))
		turn = true;
	}
	else if(e.key == "ArrowUp"  && direction != 3  && direction != 2){
		direction = 2;
		path.push(makeRectangle(x, y, lastX, lastY))
		turn = true;
	}
	else if(e.key == "ArrowDown"  && direction != 2  && direction != 3){
		direction = 3;
		path.push(makeRectangle(x, y, lastX, lastY))
		turn = true;
	}
});



function update(){
	
	ctx.fillStyle = "Red";
	
	if(direction == 0){ //Right
		ctx.rect(x+20, y, speed, 20);
		x += speed;	/*
		if(backgroundColor){
					console.log(ctx.getImageData(x, y, speed, 20).data);
		}*/
	}
	else if(direction == 1){ //Left
		x -= speed;
		ctx.rect(x, y, speed, 20);
		path.push({x: x, y: y, width: speed, height: 20});
	}
	else if(direction == 2){ //Up
		y -= speed;
		ctx.rect(x, y, 20, speed);
		
	}
	else if(direction == 3){ //Down
		ctx.rect(x, y+20, 20, speed);
		y += speed;
	}
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	

	counter++;
	if(counter % 100 == 0){
		speed++;
	}

	if(direction < 2){ //Horizontal
		
	}
	else{ //Vertical
		ctx.rect(x, y, 20, 20);
	}
	ctx.fill();
	ctx.fillStyle = "Black";
	ctx.fillRect(x, y, 20, 20);

	if(turn){
		lastX = x;
		lastY = y;
		turn = false;
	}

	requestAnimationFrame(update);
}
update();

function compareColors(){

}

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