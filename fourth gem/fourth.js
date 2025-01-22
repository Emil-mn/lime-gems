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
var xpReqs = [25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500]
var spAmounts = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50]
//character functionality
var playerSprite
var playerX = totW/2
var playerY = totH/2
var playerXmovement = 0
var playerYmovement = 0
var playerAngle = 0
var playerSpeed = 0
var playerMaxSpeed = 5
var playerTurnSpeed = 3
//character stats
var health = 100
var shield = 0
var credits = 0
var xp = 0
var level = 0
var maxHealth = 100
var maxShield = 0
var xpRequired = xpReqs[0]

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

window.onload = function load() {
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
            ctx.fillStyle = 'red'; ctx.font = '25px consolas';
            ctx.fillText('No savefile found',totW/2,380)
            setTimeout(mainMenu,2000)
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
    gameState = states.main; can.style.cursor = 'default'
    ctx.textAlign = 'left'; setInterval(mainLoop,20)
}


function mainLoop() {
    ctx.fillStyle = 'rgb(66,66,66)'; ctx.fillRect(0,0,totW,totH)

    //xp bar
    var xpPercentage = xp / xpRequired
    ctx.fillStyle = background; ctx.fillRect(10,10,170,15)
    ctx.fillStyle = 'gold'; ctx.fillRect(40,10,140*xpPercentage,15)
    ctx.lineWidth = 2; ctx.strokeStyle = foreground; 
    ctx.strokeRect(10,10,170,15); ctx.fillStyle = foreground
    ctx.font = '15px consolas'; ctx.fillText(level,12,23)
    //health bar
    var healthPercentage = health / maxHealth;
    ctx.fillStyle = background; ctx.fillRect(10,35,170,15)
    ctx.fillStyle = 'crimson'; ctx.fillRect(40,35,140*healthPercentage,15)
    ctx.strokeRect(10,35,170,15); ctx.fillStyle = foreground
    ctx.fillText(Math.round(health),12,48)
    //shield bar
    if (maxShield > 0) {
        var shieldPercentage = shield / maxShield;
        ctx.fillStyle = background; ctx.fillRect(10,60,170,15)
        ctx.fillStyle = 'blue'; ctx.fillRect(40,60,140*shieldPercentage,15)
        ctx.strokeRect(10,60,170,15); ctx.fillStyle = foreground
        ctx.fillText(Math.round(shield),12,73)

        ctx.fillStyle = background; ctx.fillRect(10,85,87,15)
        ctx.strokeRect(10,85,87,15); ctx.fillStyle = foreground
        switch (credits.toString().length) {
            case 1: ctx.fillText('cr 000000'+credits,12,98); break 
            case 2: ctx.fillText('cr 00000'+credits,12,98); break
            case 3: ctx.fillText('cr 0000'+credits,12,98); break
            case 4: ctx.fillText('cr 000'+credits,12,98); break
            case 5: ctx.fillText('cr 00'+credits,12,98); break
            case 6: ctx.fillText('cr 0'+credits,12,98); break
            case 7: ctx.fillText('cr '+credits,12,98); break
        }
    }
    //credits counter
    else {
        ctx.fillStyle = background; ctx.fillRect(10,60,87,15)
        ctx.strokeRect(10,60,87,15); ctx.fillStyle = foreground
        switch (credits.toString().length) {
            case 1: ctx.fillText('cr 000000'+credits,12,73); break 
            case 2: ctx.fillText('cr 00000'+credits,12,73); break
            case 3: ctx.fillText('cr 0000'+credits,12,73); break
            case 4: ctx.fillText('cr 000'+credits,12,73); break
            case 5: ctx.fillText('cr 00'+credits,12,73); break
            case 6: ctx.fillText('cr 0'+credits,12,73); break
            case 7: ctx.fillText('cr '+credits,12,73); break
        }
    }

    //if (keysPressed && keysPressed['s']) {maxShield = 42; shield += 0.2}
    if (keysPressed && keysPressed['h'] && health < maxHealth) {health += 0.5}
    if (keysPressed && keysPressed['c']) {credits += 2}
    if (keysPressed && keysPressed['x']) {xp += 0.2}
    
    //levelling up
    if (xp >= xpRequired) { 
        xp -= xpRequired; skillPoints += spAmounts[level];  
        ctx.fillStyle = foreground; ctx.font = '30px consolas'; ctx.fillText('Level up! '+spAmounts[level]+' skillpoints received',250,100)
        level++; xpRequired = xpReqs[level];
    }


    //turn left
    if (keysPressed && (keysPressed['a'] || keysPressed['ArrowLeft'])) {
        playerAngle -= playerTurnSpeed;
        console.log(playerAngle)
    }

    //turn right
    if (keysPressed && (keysPressed['d'] || keysPressed['ArrowRight'])) {
        playerAngle += playerTurnSpeed
        console.log(playerAngle)
    }

    //strafe left
    if (keysPressed && (keysPressed['q'])) {
        playerSpeed = 2
        playerXmovement = playerSpeed * Math.cos((playerAngle) * Math.PI / 180)
        playerYmovement = playerSpeed * Math.sin((playerAngle) * Math.PI / 180)
    }

    //go forwards / backwards
    if (keysPressed && (keysPressed['w'] || keysPressed['ArrowUp'])) {
        if (playerSpeed < playerMaxSpeed) {
            playerSpeed += 0.1
        }
        playerXmovement = playerSpeed * Math.cos((playerAngle - 90) * Math.PI / 180)
        playerYmovement = playerSpeed * Math.sin((playerAngle - 90) * Math.PI / 180)
    }
    else if (keysPressed && (keysPressed['s'] || keysPressed['ArrowDown'])) {
        if (playerSpeed > -playerMaxSpeed/2) {
            playerSpeed -= 0.1
        }
        playerXmovement = playerSpeed * Math.cos((playerAngle - 90) * Math.PI / 180)
        playerYmovement = playerSpeed * Math.sin((playerAngle - 90) * Math.PI / 180)
    }
    else {
        if (playerSpeed > 0.01) {
            playerSpeed -= 0.05
        }
        else if (playerSpeed < -0.01) {
            playerSpeed += 0.05
        }
        else {
            playerSpeed = 0
        }
        playerXmovement = playerSpeed * Math.cos((playerAngle - 90) * Math.PI / 180)
        playerYmovement = playerSpeed * Math.sin((playerAngle - 90) * Math.PI / 180)
    }

    


    //move player
    playerX += playerXmovement;
    playerY += playerYmovement;

    //draw player
    ctx.save();
    ctx.translate(playerX,playerY); 
    ctx.rotate(playerAngle * Math.PI / 180); 
    ctx.translate(-playerX, -playerY); 
    ctx.strokeStyle = 'rgb(100,100,100)'; 
    ctx.fillStyle = 'rgb(130,130,130)'
    ctx.beginPath();
    ctx.moveTo(playerX-11,playerY+40);
    ctx.lineTo(playerX-11,playerY-20);
    ctx.quadraticCurveTo(playerX-11,playerY-35,playerX,playerY-50);
    ctx.quadraticCurveTo(playerX+11,playerY-35,playerX+11,playerY-20)
    ctx.lineTo(playerX+11,playerY+40)
    ctx.closePath(); ctx.fill(); ctx.stroke()
    ctx.beginPath();
    ctx.moveTo(playerX-11,playerY+40);
    ctx.lineTo(playerX-46,playerY+25)
    ctx.lineTo(playerX-46,playerY+20)
    ctx.lineTo(playerX-21,playerY+5)
    ctx.lineTo(playerX-11,playerY-10)
    ctx.closePath(); 
    ctx.moveTo(playerX+11,playerY+40)
    ctx.lineTo(playerX+46,playerY+25)
    ctx.lineTo(playerX+46,playerY+20)
    ctx.lineTo(playerX+21,playerY+5)
    ctx.lineTo(playerX+11,playerY-10)
    ctx.closePath(); 
    ctx.fill(); ctx.stroke()
    ctx.restore();
    
    ctx.fillStyle = 'red'
    ctx.fillRect(playerX-1,playerY-1,2,2)

}