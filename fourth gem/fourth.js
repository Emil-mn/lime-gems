//canvas stuff
var can = document.getElementById('canvas')
var totW = can.width
var totH = can.height
var background = 'rgb(59, 168, 240)'
var foreground = 'rgb(13, 84, 238)'
var shipStroke = 'rgb(100,100,100)'
var shipFill = 'rgb(130,130,130)'
var shipWindows = 'rgb(45, 54, 187)'
var mousePosX
var mousePosY
var mouseClickX
var mouseClickY
var keysPressed
var ctx = can.getContext('2d')
//states
var states = {menu:0,main:1,paused:2}
var gameState = states.menu
var interval
var canPause = true
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
var spriteSelection = 1
var playerX = totW/2
var playerY = totH/2
var inputVector = [0,0]
var movementVector = [0,0]
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
//sprites
var fighter
var fighterBody
var fighterWings
var fighterEngines
var fighterWindow

var corvette
var corvetteBody
var corvetteSides
var corvetteWings
var corvetteEngines
var corvetteBridge
var corvetteWindow


function updateFighterSprite() {
    fighterBody = new Path2D
    fighterBody.moveTo(playerX-11,playerY+40);
    fighterBody.lineTo(playerX-11,playerY-20);
    fighterBody.quadraticCurveTo(playerX-11,playerY-35,playerX,playerY-50);
    fighterBody.quadraticCurveTo(playerX+11,playerY-35,playerX+11,playerY-20)
    fighterBody.lineTo(playerX+11,playerY+40)
    fighterBody.closePath(); 

    fighterWings = new Path2D
    fighterWings.moveTo(playerX-11,playerY+40);
    fighterWings.lineTo(playerX-46,playerY+25)
    fighterWings.lineTo(playerX-46,playerY+20)
    fighterWings.lineTo(playerX-21,playerY+5)
    fighterWings.lineTo(playerX-11,playerY-10)
    fighterWings.closePath();

    fighterWings.moveTo(playerX+11,playerY+40)
    fighterWings.lineTo(playerX+46,playerY+25)
    fighterWings.lineTo(playerX+46,playerY+20)
    fighterWings.lineTo(playerX+21,playerY+5)
    fighterWings.lineTo(playerX+11,playerY-10)
    fighterWings.closePath();

    fighterEngines = new Path2D
    fighterEngines.moveTo(playerX-11,playerY+48)
    fighterEngines.quadraticCurveTo(playerX-11,playerY+45,playerX-8,playerY+40)
    fighterEngines.lineTo(playerX-5,playerY+40)
    fighterEngines.quadraticCurveTo(playerX-2,playerY+45,playerX-2,playerY+48)
    fighterEngines.closePath();

    fighterEngines.moveTo(playerX+2,playerY+48)
    fighterEngines.quadraticCurveTo(playerX+2,playerY+45,playerX+5,playerY+40)
    fighterEngines.lineTo(playerX+8,playerY+40)
    fighterEngines.quadraticCurveTo(playerX+11,playerY+45,playerX+11,playerY+48)
    fighterEngines.closePath();

    fighterWindow = new Path2D
    fighterWindow.moveTo(playerX-5,playerY-28)
    fighterWindow.quadraticCurveTo(playerX-5,playerY-35,playerX,playerY-40)
    fighterWindow.quadraticCurveTo(playerX+5,playerY-35,playerX+5,playerY-28)
    fighterWindow.closePath();

    fighter = [fighterBody,fighterWings,fighterEngines,fighterWindow]
}

function updateCorvetteSprite() {
    corvetteBody = new Path2D
    corvetteBody.moveTo(playerX-17,playerY+50)
    corvetteBody.lineTo(playerX-17,playerY-60)
    corvetteBody.lineTo(playerX-7,playerY-75)
    corvetteBody.lineTo(playerX+7,playerY-75)
    corvetteBody.lineTo(playerX+17,playerY-60)
    corvetteBody.lineTo(playerX+17,playerY+50)
    corvetteBody.closePath()
        
    corvetteSides = new Path2D
    corvetteSides.moveTo(playerX-17,playerY+50)
    corvetteSides.lineTo(playerX-33,playerY+33)
    corvetteSides.lineTo(playerX-33,playerY-13)
    corvetteSides.lineTo(playerX-17,playerY-30)
    corvetteSides.closePath()
    
    corvetteSides.moveTo(playerX+17,playerY+50)
    corvetteSides.lineTo(playerX+33,playerY+33)
    corvetteSides.lineTo(playerX+33,playerY-13)
    corvetteSides.lineTo(playerX+17,playerY-30)
    corvetteSides.closePath()
        
    corvetteWings = new Path2D  
    corvetteWings.moveTo(playerX-33,playerY+15)
    corvetteWings.lineTo(playerX-60,playerY+18)
    corvetteWings.lineTo(playerX-60,playerY+9)
    corvetteWings.lineTo(playerX-33,playerY)
    corvetteWings.closePath()
    
    corvetteWings.moveTo(playerX+33,playerY+15)
    corvetteWings.lineTo(playerX+60,playerY+18)
    corvetteWings.lineTo(playerX+60,playerY+9)
    corvetteWings.lineTo(playerX+33,playerY)
    corvetteWings.closePath()
        
    corvetteEngines = new Path2D  
    corvetteEngines.moveTo(playerX-23,playerY+44)
    corvetteEngines.lineTo(playerX-23,playerY+50)
    corvetteEngines.quadraticCurveTo(playerX-20,playerY+55,playerX-20,playerY+60)
    corvetteEngines.lineTo(playerX-33,playerY+60)
    corvetteEngines.quadraticCurveTo(playerX-33,playerY+55,playerX-30,playerY+50)
    corvetteEngines.lineTo(playerX-30,playerY+36)
    corvetteEngines.closePath()
    
    corvetteEngines.moveTo(playerX+23,playerY+44)
    corvetteEngines.lineTo(playerX+23,playerY+50)
    corvetteEngines.quadraticCurveTo(playerX+20,playerY+55,playerX+20,playerY+60)
    corvetteEngines.lineTo(playerX+33,playerY+60)
    corvetteEngines.quadraticCurveTo(playerX+33,playerY+55,playerX+30,playerY+50)
    corvetteEngines.lineTo(playerX+30,playerY+36)
        
    corvetteBridge = new Path2D
    corvetteBridge.moveTo(playerX-4,playerY+30)
    corvetteBridge.lineTo(playerX-10,playerY+15)
    corvetteBridge.lineTo(playerX-10,playerY-10)
    corvetteBridge.lineTo(playerX-4,playerY-20)
    corvetteBridge.lineTo(playerX+4,playerY-20)
    corvetteBridge.lineTo(playerX+10,playerY-10)
    corvetteBridge.lineTo(playerX+10,playerY+15)
    corvetteBridge.lineTo(playerX+4,playerY+30)
    corvetteBridge.closePath()
        
    corvetteWindow = new Path2D
    corvetteWindow.moveTo(playerX-9,playerY-11)
    corvetteWindow.lineTo(playerX-4,playerY-19)
    corvetteWindow.lineTo(playerX+4,playerY-19)
    corvetteWindow.lineTo(playerX+9,playerY-11)
    corvetteWindow.closePath();
    
    corvette = [corvetteBody,corvetteSides,corvetteWings,corvetteEngines,corvetteBridge,corvetteWindow]
}

can.addEventListener('mousedown', function(event) {
    var rect = can.getBoundingClientRect();
    mouseClickX = event.pageX - rect.left;
    mouseClickY = event.pageY - rect.top;
    console.log('click detected at ' + Math.floor(mouseClickX) + ',' + Math.floor(mouseClickY));
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
    keysPressed[event.key] = true; //console.log(keysPressed)
    if (event.key == 'Escape' && gameState == states.paused) {
        console.log('resumed'); gameState = states.main
        ctx.textAlign = 'left'; can.style.cursor = 'none'
        setTimeout(() => {canPause = true},500)
        interval = setInterval(mainLoop,20)
    }
})
document.addEventListener('keyup', function(event) {
    keysPressed[event.key] = false; //console.log(keysPressed)
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
    else if (gameState == states.paused) {
        if (buttonClicked(totW/2-130,180,260,50)) {
            console.log('resumed'); gameState = states.main
            ctx.textAlign = 'left'; can.style.cursor = 'none'
            setTimeout(() => {canPause = true},500)
            interval = setInterval(mainLoop,20)
        }
        else if (buttonClicked(totW/2-130,270,260,50)) {
            console.log('quitting'); gameState = states.menu;
            canPause = true; mainMenu()
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
    else if (gameState == states.paused) {
        if (buttonHovered(totW/2-130,180,260,50)) {
            can.style.cursor = 'pointer'
        }
        else if (buttonHovered(totW/2-130,270,260,50)) {
            can.style.cursor = 'pointer'
        }
        else {can.style.cursor = 'default'}
    }
}


function generateWorld() {
    console.log('generation stuff');
    gameState = states.main; can.style.cursor = 'none'
    ctx.textAlign = 'left'; interval = setInterval(mainLoop,20)
}


function mainLoop() {
    ctx.fillStyle = 'rgb(66,66,66)'; ctx.fillRect(0,0,totW,totH)

    //if (keysPressed && keysPressed['s']) {maxShield = 42; shield += 0.2}
    if (keysPressed && keysPressed['h'] && health < maxHealth) {health += 0.5}
    if (keysPressed && keysPressed['c']) {credits += 2}
    if (keysPressed && keysPressed['x']) {xp += 0.2}

    if (keysPressed && keysPressed['f']) {spriteSelection = 1}
    else if (keysPressed && keysPressed['c']) {spriteSelection = 2}
    
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

    //strafing
    if (keysPressed && (keysPressed['q'])) {
        playerSpeed = 0.025
        inputVector = [playerSpeed * Math.cos((playerAngle+180) * Math.PI / 180),playerSpeed * Math.sin((playerAngle+180) * Math.PI / 180)]
        console.log(inputVector)
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
    }
    else if (keysPressed && (keysPressed['e'])) {
        playerSpeed = 0.025
        inputVector = [playerSpeed * Math.cos((playerAngle) * Math.PI / 180),playerSpeed * Math.sin((playerAngle) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
    }

    //go forwards / backwards
    if (keysPressed && (keysPressed['w'] || keysPressed['ArrowUp'])) {
        /*if (playerSpeed < playerMaxSpeed) {
            playerSpeed += 0.1
        }*/
        playerSpeed = 0.05
        inputVector = [playerSpeed * Math.cos((playerAngle-90) * Math.PI / 180),playerSpeed * Math.sin((playerAngle-90) * Math.PI / 180)]
        console.log(inputVector)
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
    }
    else if (keysPressed && (keysPressed['s'] || keysPressed['ArrowDown'])) {
        playerSpeed = 0.025
        inputVector = [playerSpeed * Math.cos((playerAngle+90) * Math.PI / 180),playerSpeed * Math.sin((playerAngle+90) * Math.PI / 180)]
        
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
    }
    
    if (keysPressed && keysPressed['r']) {
        if (movementVector[0] > 0) {movementVector[0] -= 0.1}
        else if (movementVector[0] < 0) {movementVector[0] += 0.1}
        
        if (movementVector[1] > 0) {movementVector[1] -= 0.1}
        else if (movementVector[1] < 0) {movementVector[1] += 0.1}
    }

    //move player
    playerX += movementVector[0];
    playerY += movementVector[1];

    //draw player
    ctx.save();
    ctx.translate(playerX,playerY); 
    ctx.rotate(playerAngle * Math.PI / 180); 
    ctx.translate(-playerX, -playerY); 
    ctx.strokeStyle = shipStroke; 
    ctx.fillStyle = shipFill
    ctx.lineWidth = 2
    
    if (spriteSelection == 1) {updateFighterSprite(); playerSprite = fighter}
    else if (spriteSelection == 2) {updateCorvetteSprite(); playerSprite = corvette}

    playerSprite.forEach((path,index) => {
        if (index == playerSprite.length-1) {
            ctx.fillStyle = shipWindows;
            ctx.fill(path)
        }
        else {
            ctx.fill(path); ctx.stroke(path)
        }
    })
    ctx.restore();

    ctx.fillStyle = 'red'; ctx.fillRect(playerX-1,playerY-1,2,2)
    ctx.save(); ctx.translate(500,30); ctx.rotate(playerAngle * Math.PI / 180);
    ctx.beginPath(); ctx.moveTo(-10,10); ctx.lineTo(10,10);
    ctx.lineTo(0,-15); ctx.fill(); ctx.translate(-500,-30);
    ctx.restore()
    //hud

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
    //minimap
    ctx.lineWidth = 3; ctx.fillStyle = background; ctx.fillRect(totW-160,10,150,100); 
    ctx.strokeRect(totW-160,10,150,100); ctx.fillStyle = 'green'; ctx.beginPath(); 
    ctx.arc(totW-160+playerX/4.66,10+playerY/4.66,2,0,7); ctx.fill()
    ctx.fillStyle = foreground; ctx.font = '10px consolas'
    ctx.fillText('X:'+Math.round(playerX*10)/10+' Y:'+Math.round(playerY*10)/10,545,105)

    //cursor
    ctx.strokeStyle = foreground; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(mousePosX-2,mousePosY-6); ctx.lineTo(mousePosX-6,mousePosY-6); 
    ctx.lineTo(mousePosX-6,mousePosY-2)
    ctx.moveTo(mousePosX-6,mousePosY-2); ctx.lineTo(mousePosX-6,mousePosY+6); 
    ctx.lineTo(mousePosX-2,mousePosY+6)
    ctx.moveTo(mousePosX+2,mousePosY+6); ctx.lineTo(mousePosX+6,mousePosY+6); 
    ctx.lineTo(mousePosX+6,mousePosY+2)
    ctx.moveTo(mousePosX+6,mousePosY-2); ctx.lineTo(mousePosX+6,mousePosY-6); 
    ctx.lineTo(mousePosX+2,mousePosY-6)
    ctx.arc(mousePosX,mousePosY,2,0,7); ctx.stroke()

    if (keysPressed && keysPressed['Escape'] && canPause == true) {
        clearInterval(interval); console.log('paused');
        gameState = states.paused; canPause = false
        
        ctx.fillStyle = background; ctx.fillRect(totW/2-175,totH/2-125,350,250);
        ctx.fillStyle = foreground ; ctx.font = '50px consolas'; 
        ctx.textAlign = 'center'; ctx.fillText('Paused',totW/2,150);
        ctx.strokeStyle = foreground; ctx.lineWidth = 4
        ctx.strokeRect(totW/2-175,totH/2-125,350,250)
        ctx.strokeRect(totW/2-130,180,260,50)
        ctx.strokeRect(totW/2-130,270,260,50)
        ctx.font = '40px consolas'
        ctx.fillText('Resume', totW/2,215)
        ctx.fillText('Save & quit',totW/2,305)
    }
}