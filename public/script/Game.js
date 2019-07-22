let socket = null;

var canvas = document.getElementById("myCanvas");

 
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.overflow = 'hidden';

ctx = canvas.getContext('2d');


let start = false;
let end = false;
let name = "";

ctx.font = "72px Arial";
ctx.fillText("Enter name then hit enter.", canvas.width * (1 / 3), canvas.height * (1 / 3));
ctx.fillText("Name: ", canvas.width * (1 / 3), canvas.height * (2 / 3));

document.addEventListener('keydown', function (e) {
	if(start){
		socket.emit("keyPressed", e.key);
	}
	else{
		if(e.key.length > 1){
			//console.log(e.key);
			if(e.key === "Backspace"){
				name = name.substring(0,name.length-1);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillText("Enter name then hit enter.", canvas.width * (1 / 3), canvas.height * (1 / 3));
				ctx.fillText("Name: " + name, canvas.width * (1 / 3), canvas.height * (2 / 3));
			}
			else if(e.key === "Enter"){
				socket = io();
				socket.emit("name", name, {width: canvas.width, height: canvas.height});
				socket.on('draw', function(rects){
					if(!end){
						draw(rects);
					}
				});
				socket.on('newPlayer', function(text){
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.font = "72px Arial";
					ctx.fillText(text, canvas.width * (1 / 3), canvas.height * (1 / 2));
				});

				socket.on("win", function(){
					end = true;
					//console.log("Win");
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.font = "72px Arial";
					ctx.fillText("Winner! :)", canvas.width / 2 - 100, canvas.height / 2);
				});

				socket.on("lose", function(){
					end = true;
					//console.log("Lose");
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.font = "72px Arial";
					ctx.fillText("Loser! :(", canvas.width / 2 - 100, canvas.height / 2);
				});

				socket.on("restart", function(){
					end = false;
				});

				start = true;
			}
			return;
		}
		name += e.key;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillText("Enter name then hit enter.", canvas.width * (1 / 3), canvas.height * (1 / 3));
		ctx.fillText("Name: " + name, canvas.width * (1 / 3), canvas.height * (2 / 3));
	}
});

window.addEventListener('resize', function (e) {
	canvas.width  = this.innerWidth;
	canvas.height = this.innerHeight;
	if(start){
		socket.emit("windowSize", {width: canvas.width, height: canvas.height});
	}
});

function draw(data){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(let i = 0; i<data.otherPath.length; i++){
		ctx.fillStyle = data.otherPath[i].color;
		ctx.fillRect(data.otherPath[i].x, data.otherPath[i].y, data.otherPath[i].width, data.otherPath[i].height)
	}

	for(let i = 0; i<data.yourPath.length; i++){
		ctx.fillStyle = data.yourPath[i].color;
		ctx.fillRect(data.yourPath[i].x, data.yourPath[i].y, data.yourPath[i].width, data.yourPath[i].height)
	}
	ctx.font = "30px Arial";
	
	for(let i = 0; i<data.names.length; i++){
		ctx.fillStyle = data.names[i].color;
		ctx.fillText(data.names[i].name, data.names[i].x, data.names[i].y);
	}
}

