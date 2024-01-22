// Creating canvas elemnet and its 2d rendering tool
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//defining variables which helps to move
let x= canvas.width/2;
let y= canvas.height-30;

let dx=2;
let dy=-2;

//defining paddle Variables
let paddleHeight=10;
let paddleWidth=75;
let paddleX= (canvas.width-paddleWidth)/2;

//defining variables for moving paddle
let rightPressed=false;
let leftPressed=false;

// For Checking the collison defining radius 
let ballRadius=10;

// defining addeventlistener
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUphandler,false);
document.addEventListener("mousemove",mouseMoveHandler,false);
//Defining variables for bricks
const brickRowCount=1;
const brickColumnCount=5;
const brickWidth=75;
const brickHeight=20;
const brickPadding=10;
const brickTopOffset=30;
const brickLeftOfset=30;

//defining variables for score
let score=0;

//defining variables for lives
let lives=3;

//here we holding our bricks in a 2dimensional way , x and y is positions
const bricks=[];
for(let col=0;col<brickColumnCount;col++)
{
    bricks[col]=[];
    for(let row=0;row<brickRowCount;row++){
        bricks[col][row]={x:0,y:0,status:1}
    }
}


function keyDownHandler(e)
{
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
}

function keyUphandler(e)
{
   
    if(e.key==="Right" || e.key==="ArrowRight")
    {
        rightPressed=false;
    }else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }

}

function mouseMoveHandler(e)
{
    const relativeX= e.clientX-canvas.offsetLeft;
    if(relativeX>0 && relativeX<canvas.width){
        paddleX= relativeX-paddleWidth/2;
    }
}
//creating colision detection function
function collisionDetection()
{
    for(let col=0;col<brickColumnCount;col++)
    {
        for(let row=0;row<brickRowCount;row++)
        {
            const brickObject= bricks[col][row];
            if(brickObject.status===1){
                if(x>brickObject.x && x<brickObject.x+brickWidth && y>brickObject.y && y<brickObject.y+brickHeight){
               
                    dy=-dy;
                    brickObject.status=0;
                    score++;
                    if(score===brickColumnCount*brickRowCount){
                        alert('YOU WIN !!!!!!  CONGRATULATIONS!!!!!');
                        document.location.reload();
                        requestAnimationFrame(draw);
                    }
                }
            }
           
        }
    }
} 
//defining lives
function drawLives(){
    ctx.font="16px Arial";
    ctx.fillStyle="#fff";
    ctx.fillText(`Lives:${lives}`,canvas.width-65,20);
}
//defining score 
function drawScore()
{
    ctx.font="16px Arial";
    ctx.fillStyle="#fff";
    ctx.fillText(`Score :${score}`,8,20)
}
// creating a ball and give code to move it 
function drawBall()
{
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,2*Math.PI);
    ctx.fillStyle="#fff";
    ctx.fill();
    ctx.closePath()
}
//creating a paddle
function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle="#fff";
    ctx.fill();
    ctx.closePath()

}
//drawing bricks
function drawBricks(){
    for(let col=0;col<brickColumnCount;col++)
    {
        for(let row=0;row<brickRowCount;row++)
        {
            if(bricks[col][row].status===1)
            {
                const brickX= col*(brickWidth+brickPadding)+brickLeftOfset;
                const brickY= row*(brickHeight+brickPadding)+brickTopOffset;
                bricks[col][row].x=brickX;
                bricks[col][row].y=brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                ctx.fillStyle="#fff";
                ctx.fill();
                ctx.closePath();
            }
            
        }
    }
}
function draw()
{
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    if(x+dx>canvas.width-ballRadius || x+dx<ballRadius)
    {
        dx=-dx;
    }
   if(y+dy<ballRadius) {
    dy=-dy;
   }
   else if( y+dy>canvas.height-ballRadius){
    if(x<paddleX+paddleWidth && x>paddleX ){
        
        dy=-dy
    }
    else{
       lives--;
       if(!lives)
       {
        alert("Game Over");
        document.location.reload();
        requestAnimationFrame(draw);
       }
       else{
            x= canvas.width/2;
            y= canvas.height-30;
            dx=2;
            dy=-2;
            paddleX = (canvas.width - paddleWidth) / 2;
       }
        
    }

    
   }
   if(rightPressed)
   {
    paddleX=Math.min(paddleX+7,canvas.width-paddleWidth);
   }
   else if(leftPressed)
   {
    paddleX=Math.max(paddleX-7,0);
   }
    x+=dx;
    y+=dy;
    requestAnimationFrame(draw);

}
draw();

// Adding Full screen Feature
document.addEventListener("keydown",

(e)=>{
    if(e.key==="Enter")
    {
        toggleFullScreen();
    }
},false)

function toggleFullScreen(){
    if(!document.fullscreenElement){
        canvas.requestFullscreen().catch((err)=>{
            alert(`Error attempting to enable fullscreen mode :${err.message} (${err.name})`)
        })
    }else{
        document.exitFullscreen();
    }
}