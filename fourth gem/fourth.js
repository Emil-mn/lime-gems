//canvas stuff
var can = document.getElementById('canvas')
var totW = can.width
var totH = can.height
var background = 'rgb(59, 168, 240)'
var foreground = 'rgb(13, 84, 238)'
var mousePosX
var mousePosY
var mouseClickX
var mouseClickY
var keysPressed
var ctx = can.getContext('2d')
//states
var states = {menu:0,main:1,paused:2}
var gameState = states.menu
var prevState
//skillpoint boosts on level-up???
var skillPoints = 0
var dmgLvl = 0,frtLvl = 0 //???
var accLvl = 0,crtLvl = 0 //???
var hltLvl = 0 //???
//arrays
var enemies = []//???
var asteroids = []
var turrets = []//???
var projectiles = []//???
var pickups = []//???
//character stats
var playerX
var playerY
var credits = 0
var speed = 2//???
var health = 100
var shield = 0
var maxHealth = 100
var maxShield = 0
var level = 0
var xp = 0

can.addEventListener('mousedown', function(event) {
    var rect = can.getBoundingClientRect();
    mouseClickX = event.pageX - rect.left;
    mouseClickY = event.pageY - rect.top;
    console.log('click detected at ' + mouseClickX + ',' + mouseClickY);
    checkClick()
})

can.addEventListener('mousemove', function(event) {
    var rect = can.getBoundingClientRect();
    mousePosX = event.pageX - rect.left;
    mousePosY = event.pageY - rect.top;
    hoverCheck()
    //console.log('mouse is at '+ mousePosX + ',' + mousePosY);
})

document.addEventListener('keydown', function(event) {
    keysPressed = (keysPressed || []);
    keysPressed[event.key] = true; console.log(keysPressed)
})
document.addEventListener('keyup', function(event) {
    keysPressed[event.key] = false; console.log(keysPressed)
})

function buttonClicked(x,y,width,height) {
    var myleft = x;
    var myright = x + width;
    var mytop = y;
    var mybottom = y + height;
    var clicked = true;
    if ((mybottom < mouseClickY) || (mytop > mouseClickY) || (myright < mouseClickX) || (myleft > mouseClickX)) {
      clicked = false;
    }
    return clicked;
}

function buttonHovered(x,y,width,height) {
    var myleft = x;
    var myright = x + width;
    var mytop = y;
    var mybottom = y + height;
    var hovered = true;
    if ((mybottom < mousePosY) || (mytop > mousePosY) || (myright < mousePosX) || (myleft > mousePosX)) {
      hovered = false;
    }
    return hovered;
}

window.onload = load()

function load() {
    ctx.fillStyle = background
    ctx.fillRect(0,0,totW,totH)
    ctx.fillStyle = foreground
    ctx.font = '40px consolas'
    ctx.textAlign = 'left'
    ctx.fillText('Loading',100,totH/2)
    
    setTimeout(function() {ctx.fillText('Loading.',100,totH/2)},700)
    setTimeout(function() {ctx.fillText('Loading..',100,totH/2)},1000)
    setTimeout(function() {ctx.fillText('Loading...',100,totH/2)},1100)
    setTimeout(function() {ctx.fillText('Loading....',100,totH/2)},1150)
    setTimeout(function() {ctx.fillText('Loading.....',100,totH/2)},1200)
    setTimeout(function() {ctx.fillText('Loading......',100,totH/2)},1250)
    setTimeout(function() {ctx.fillText('Loading.......',100,totH/2)},1300)
    setTimeout(function() {ctx.fillText('Loading........',100,totH/2)},1350)
    setTimeout(function() {ctx.fillText('Loading.........',100,totH/2)},1400)
    setTimeout(mainMenu,2000)
}

function mainMenu() {
    ctx.fillStyle = background; ctx.fillRect(0,0,totW,totH);
    
    ctx.fillStyle = foreground ; ctx.font = '50px consolas'; 
    ctx.textAlign = 'center'; ctx.fillText('Fourth Gem',totW/2,100);
    ctx.font = '30px consolas'; ctx.fillText('bottom text',totW/2,140)

    ctx.strokeStyle = foreground; ctx.lineWidth = 4
    ctx.strokeRect(totW/2-100,200,200,50)
    ctx.strokeRect(totW/2-100,300,200,50)
    ctx.font = '40px consolas'
    ctx.fillText('New game', totW/2,235)
    ctx.fillText('Load game',totW/2,335,180)
}

function checkClick() {
    if (gameState == states.menu) {
        if (buttonClicked(totW/2-100,200,200,50)) {
            console.log('starting new game');
            generateWorld()
        }
        else if (buttonClicked(totW/2-100,300,200,50)) {
            console.log('loading save');
        }
    }
}

function hoverCheck() {
    if (gameState == states.menu) {
        if (buttonHovered(totW/2-100,200,200,50)) {
            console.log('new game button');
            can.style.cursor = 'pointer'
        }
        else if (buttonHovered(totW/2-100,300,200,50)) {
            console.log('load game button');
            can.style.cursor = 'pointer'
        }
        else {can.style.cursor = 'default'}
    }
}


function generateWorld() {
    console.log('generation stuff')
    gameState = states.main; can.style.cursor = 'grab'
    ctx.textAlign = 'left'; setInterval(mainLoop,20)
}


function mainLoop() {
    ctx.fillStyle = 'rgb(66,66,66)'; ctx.fillRect(0,0,totW,totH)

    var healthPercentage = health / maxHealth;
    
    ctx.fillStyle = background
    ctx.fillRect(15,15,170,15)
    ctx.fillStyle = 'red';
    ctx.fillRect(45,15,140*healthPercentage,15)
    
    ctx.lineWidth = 2; ctx.strokeStyle = foreground; ctx.strokeRect(15,15,170,15)
    ctx.font = '15px consolas'; ctx.fillStyle = foreground; ctx.fillText(Math.round(health),17,28)
}