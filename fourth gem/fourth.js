//canvas stuff
var can = document.getElementById('canvas')
var totW = can.width
var totH = can.height
var worldWidth = can.width * 100
var worldHeight = can.height * 100
var camera = {x:0,y:0,width:totW,height:totH,deadzoneWidth:350,deadzoneHeight:225}
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
var states = {menu:0,main:1,paused:2,inventory:3}
var gameState = states.menu
var interval
var canPause = true
//inventory
var canOpenInv = true
var hovering = false
var skillPointsTextWidth
var skillPoints = 0
var skillPointsAdding = false
var dmgLvl = 0,frtLvl = 0 //???
var accLvl = 0,crtLvl = 0 //???
var hltLvl = 0 //???
var slotsX = [150,205,260,315]
var slotsY = [140,195,250,305]
//arrays
var enemies = []
var asteroidFields = []
var asteroids = []
var turrets = []
var projectiles = []
var pickups = []
var xpReqs = [25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500]
var spAmounts = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50]
//character functionality
var playerSprite
var spriteSelection = 1
var playerX = worldWidth/2
var playerY = worldHeight/2
var inputVector = [0,0]
var movementVector = [0,0]
var playerAngle = 0
var playerSpeed = 0
var playerMaxSpeed = 5
var playerTurnSpeed = 3
var fireInterval //maybe replace this
var fireIntervals = [] //maybe this to acommodate different firerates
var canFire = true //same
var fireCooldowns = [] //maybe this for non-automatics
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


function updateFighterSprite(x,y) {
    fighterBody = new Path2D
    fighterBody.moveTo(x-11,y+40);
    fighterBody.lineTo(x-11,y-20);
    fighterBody.quadraticCurveTo(x-11,y-35,x,y-50);
    fighterBody.quadraticCurveTo(x+11,y-35,x+11,y-20)
    fighterBody.lineTo(x+11,y+40)
    fighterBody.closePath(); 

    fighterWings = new Path2D
    fighterWings.moveTo(x-11,y+40);
    fighterWings.lineTo(x-46,y+25)
    fighterWings.lineTo(x-46,y+20)
    fighterWings.lineTo(x-21,y+5)
    fighterWings.lineTo(x-11,y-10)
    fighterWings.closePath();

    fighterWings.moveTo(x+11,y+40)
    fighterWings.lineTo(x+46,y+25)
    fighterWings.lineTo(x+46,y+20)
    fighterWings.lineTo(x+21,y+5)
    fighterWings.lineTo(x+11,y-10)
    fighterWings.closePath();

    fighterEngines = new Path2D
    fighterEngines.moveTo(x-11,y+48)
    fighterEngines.quadraticCurveTo(x-11,y+45,x-8,y+40)
    fighterEngines.lineTo(x-5,y+40)
    fighterEngines.quadraticCurveTo(x-2,y+45,x-2,y+48)
    fighterEngines.closePath();

    fighterEngines.moveTo(x+2,y+48)
    fighterEngines.quadraticCurveTo(x+2,y+45,x+5,y+40)
    fighterEngines.lineTo(x+8,y+40)
    fighterEngines.quadraticCurveTo(x+11,y+45,x+11,y+48)
    fighterEngines.closePath();

    fighterWindow = new Path2D
    fighterWindow.moveTo(x-5,y-28)
    fighterWindow.quadraticCurveTo(x-5,y-35,x,y-40)
    fighterWindow.quadraticCurveTo(x+5,y-35,x+5,y-28)
    fighterWindow.closePath();

    fighter = [fighterBody,fighterWings,fighterEngines,fighterWindow]
}

function updateCorvetteSprite(x,y) {
    corvetteBody = new Path2D
    corvetteBody.moveTo(x-17,y+50)
    corvetteBody.lineTo(x-17,y-60)
    corvetteBody.lineTo(x-7,y-75)
    corvetteBody.lineTo(x+7,y-75)
    corvetteBody.lineTo(x+17,y-60)
    corvetteBody.lineTo(x+17,y+50)
    corvetteBody.closePath()
        
    corvetteSides = new Path2D
    corvetteSides.moveTo(x-17,y+50)
    corvetteSides.lineTo(x-33,y+33)
    corvetteSides.lineTo(x-33,y-13)
    corvetteSides.lineTo(x-17,y-30)
    corvetteSides.closePath()
    
    corvetteSides.moveTo(x+17,y+50)
    corvetteSides.lineTo(x+33,y+33)
    corvetteSides.lineTo(x+33,y-13)
    corvetteSides.lineTo(x+17,y-30)
    corvetteSides.closePath()
        
    corvetteWings = new Path2D  
    corvetteWings.moveTo(x-33,y+15)
    corvetteWings.lineTo(x-60,y+18)
    corvetteWings.lineTo(x-60,y+9)
    corvetteWings.lineTo(x-33,y)
    corvetteWings.closePath()
    
    corvetteWings.moveTo(x+33,y+15)
    corvetteWings.lineTo(x+60,y+18)
    corvetteWings.lineTo(x+60,y+9)
    corvetteWings.lineTo(x+33,y)
    corvetteWings.closePath()
        
    corvetteEngines = new Path2D  
    corvetteEngines.moveTo(x-23,y+44)
    corvetteEngines.lineTo(x-23,y+50)
    corvetteEngines.quadraticCurveTo(x-20,y+55,x-20,y+60)
    corvetteEngines.lineTo(x-33,y+60)
    corvetteEngines.quadraticCurveTo(x-33,y+55,x-30,y+50)
    corvetteEngines.lineTo(x-30,y+36)
    corvetteEngines.closePath()
    
    corvetteEngines.moveTo(x+23,y+44)
    corvetteEngines.lineTo(x+23,y+50)
    corvetteEngines.quadraticCurveTo(x+20,y+55,x+20,y+60)
    corvetteEngines.lineTo(x+33,y+60)
    corvetteEngines.quadraticCurveTo(x+33,y+55,x+30,y+50)
    corvetteEngines.lineTo(x+30,y+36)
        
    corvetteBridge = new Path2D
    corvetteBridge.moveTo(x-4,y+30)
    corvetteBridge.lineTo(x-10,y+15)
    corvetteBridge.lineTo(x-10,y-10)
    corvetteBridge.lineTo(x-4,y-20)
    corvetteBridge.lineTo(x+4,y-20)
    corvetteBridge.lineTo(x+10,y-10)
    corvetteBridge.lineTo(x+10,y+15)
    corvetteBridge.lineTo(x+4,y+30)
    corvetteBridge.closePath()
        
    corvetteWindow = new Path2D
    corvetteWindow.moveTo(x-9,y-11)
    corvetteWindow.lineTo(x-4,y-19)
    corvetteWindow.lineTo(x+4,y-19)
    corvetteWindow.lineTo(x+9,y-11)
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

window.addEventListener('mouseup', function() {
    //maybe not useful later
    clearInterval(fireInterval)
    /*maybe this instead
    fireIntervals.forEach(int => {
        clearInterval(int)
    })*/
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
    if (event.key == 'Tab') {event.preventDefault()}
    if (event.key == 'Escape' && gameState == states.paused) {
        console.log('resumed'); gameState = states.main
        ctx.textAlign = 'left'; can.style.cursor = 'none'
        skillPointsAdding = false;
        setTimeout(() => {canPause = true},500)
        interval = setInterval(mainLoop,20)
    }
})
document.addEventListener('keyup', function(event) {
    if (event.key != 'F5') {
        keysPressed[event.key] = false; //console.log(keysPressed)
    }
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

window.onload = function() {
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

function save() {
    ctx.fillStyle = background; ctx.fillRect(0,0,totW,totH);
    ctx.fillStyle = foreground ; ctx.font = '50px consolas'; 
    ctx.textAlign = 'center'; ctx.fillText('Saving...',totW/2,200);
    setTimeout(mainMenu,1000)
}

function load() {
    ctx.fillStyle = background; ctx.fillRect(0,0,totW,totH);
    ctx.fillStyle = foreground ; ctx.font = '50px consolas'; 
    ctx.fillText('Loading...',totW/2,200); gameState = states.main
    ctx.textAlign = 'left'; interval = setInterval(mainLoop,20)
}

function generateWorld() {
    console.log('generation stuff');
    gameState = states.main; can.style.cursor = 'none'
    ctx.fillStyle = background; ctx.fillRect(0,0,totW,totH);
    ctx.fillStyle = foreground ; ctx.font = '50px consolas'; 
    ctx.fillText('Generating world...',totW/2,200);
    ctx.textAlign = 'left'; 
    
    var numberOfAsteroidfields = Math.floor(Math.random() * 3 + 3)
    for (var aField = 0; aField < numberOfAsteroidfields; aField++) {
        var width = Math.random() * (2100-700) + 700;
        var height = Math.random() * (1350-450) + 450;
        var x = Math.random() * (-camera.x + worldWidth - width - 400) + 200;
        var y = Math.random() * (-camera.y + worldHeight - height - 400) + 200;
        var numberOfAsteroids = Math.floor((width - 700) / 2100 * (200 - 50) + 50);
        asteroidFields.push({width:width,height:height,x:x,y:y})

        for (var ass = 0; ass < numberOfAsteroids; ass++) {
            var sides = Math.floor(Math.random() * 10 + 5);
            var asteroid = [];
            var radius = Math.random() * 15 + 10;
            var astX = Math.random() * ((x + width) - x) + x 
            var astY = Math.random() * ((y + height)- y) + y
            var xSpeed = Math.random() * 2 - 1;
            var ySpeed = Math.random() * 2 - 1;
            var rotation = Math.random() * 4 -2;
            var health = Math.floor((radius - 10) / 15 * (8 - 3) + 3)

            for (var s = 0; s < sides; s++) {
                var angle = (Math.PI * 2 / sides) * s;
                var pointX = astX + Math.cos(angle) * (radius + Math.random() * 10 - 5);
                var pointY = astY + Math.sin(angle) * (radius + Math.random() * 10 - 5);
                asteroid.push({ x: pointX, y: pointY });
            }
        
            asteroid.push({xPos:astX, yPos:astY, dx:xSpeed, dy:ySpeed, rot:rotation, angle:0, radius:radius, hp:health, origHp:health, field:aField})

            asteroids.push(asteroid)
        }
        console.log(asteroids)
    }
    interval = setInterval(mainLoop,20)
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
            skillPointsAdding = false
            setTimeout(() => {canPause = true},500)
            interval = setInterval(mainLoop,20)
        }
        else if (buttonClicked(totW/2-130,270,260,50)) {
            console.log('quitting'); gameState = states.menu;
            skillPointsAdding = false
            canPause = true; can.style.cursor = 'default'; save()
        }
        
    }
    else if (gameState == states.main) {
        //firing logic test
        fireInterval = setInterval(() => {
            console.log('pew pew')
            var source = rotatePoint(-camera.x+playerX,-camera.y+playerY-70,-camera.x+playerX,-camera.y+playerY,playerAngle)
            var target = rotatePoint(-camera.x+playerX,-camera.y+playerY-100,-camera.x+playerX,-camera.y+playerY,playerAngle)
            projectiles.push(new Projectile(3,3,source.x,source.y,target.x,target.y,'friendly mg',2.5,6,25,2,2,4))
            //projectiles.push(new Projectile(8,5,'gold',totW-50,totH/2,100,totH/2,'enemi'))//TEST
        }, 200);
    }
    else if (gameState == states.inventory) {
        if (buttonClicked(150+skillPointsTextWidth.width+5,118,15,15)) {
            skillPointsAdding = true; console.log('doing the skillpoint thing')
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
    else if (gameState == states.inventory) {
        if (buttonHovered(150+skillPointsTextWidth.width+5,118,15,15)) {
            hovering = true; console.log('pointing at skillpoint button')
        }
        else {hovering = false}
    }
}

function rotatePoint(px, py, cx, cy, angle) {
    // Convert angle from degrees to radians
    let radians = angle * (Math.PI / 180);

    // Translate point to origin
    let translatedX = px - cx;
    let translatedY = py - cy;

    // Rotate point
    let rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
    let rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

    // Translate point back
    let finalX = rotatedX + cx;
    let finalY = rotatedY + cy;

    return { x: finalX, y: finalY };
}

class Projectile {
    constructor(width, height, x, y, targetX, targetY, type, accuracy, speed, critRate, critDmg, damageMin, damageMax) {
        this.type = type
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.speed = speed
        this.critRate = critRate
        this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * accuracy) - accuracy) * Math.PI / 180
        this.dx = Math.cos(this.angle)
        this.dy = Math.sin(this.angle)
        
        this.lifeTime = 0
        if (this.type == 'particleS' || this.type == 'particleL') {
            this.lifeTimeRand = Math.random()
        }

        this.damage = Math.floor(Math.random() * (2 * damageMax) - damageMin)
        
        var rand = Math.random() * 100
        if (rand < critRate) {this.damage *= critDmg; console.log('crit damage: ' + this.damage)}

        this.update = function() {
            this.lifeTime += 0.02
            this.x += this.dx * speed
            this.y += this.dy * speed
            if (this.type == 'particleS') {
                ctx.fillStyle = 'white'
                
                if (this.lifeTime > 0.5 + this.lifeTimeRand) {projectiles.splice(this,1)}
            }
            else if (this.type == 'particleL') {
                ctx.fillStyle = 'blue'
                

                if (this.lifeTime > 0.5 + this.lifeTimeRand) {projectiles.splice(this,1)}
            }
            else if (this.type == 'friendly mg' || this.type == 'enemy mg') {
                if (rand < this.critRate) { ctx.fillStyle = 'red'} 
                else { ctx.fillStyle = 'gold'}
            }
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        this.crashWith = function (otherobj) {
            var myleft = this.x
            var myright = this.x + this.width
            var mytop = this.y
            var mybottom = this.y + this.height
            var otherleft = otherobj.x
            var otherright = otherobj.x + otherobj.width
            var othertop = otherobj.y
            var otherbottom = otherobj.y + otherobj.height
            var crash = true
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                crash = false
            }
            return crash
        }
    }
}

function mainLoop() {
    ctx.fillStyle = 'rgb(66,66,66)'; ctx.fillRect(0,0,totW,totH)
    ctx.beginPath(); ctx.strokeStyle = 'rgb(76, 76, 76)';       
    ctx.lineWidth = 5;
    for (var y = 1; y < 750; y++) {
        ctx.moveTo(-camera.x,-camera.y+60*y)
        ctx.lineTo(worldWidth,-camera.y+60*y); 
    }
    for (var x = 1; x < 1167; x++) {
        ctx.moveTo(-camera.x+60*x,-camera.y)
        ctx.lineTo(-camera.x+60*x,worldHeight); 
    }
    ctx.stroke(); ctx.strokeStyle = 'red';
    ctx.strokeRect(-camera.x+60,-camera.y+60,worldWidth-120,worldHeight-120)

    if (keysPressed && keysPressed['f']) {spriteSelection = 1}
    else if (keysPressed && keysPressed['c']) {spriteSelection = 2}
    
    if (keysPressed && keysPressed['Tab'] && canOpenInv == true) {
        canOpenInv = false; setTimeout(() => {canOpenInv = true},1000)
        if (gameState != states.inventory) {
            gameState = states.inventory; console.log('inventory open')
        }
        else {
            skillPointsAdding = false;
            gameState = states.main; console.log('inventory closed')
        }
    }

    //levelling up
    if (xp >= xpRequired) { 
        xp -= xpRequired; skillPoints += spAmounts[level]; ctx.fillStyle = foreground;
        ctx.font = '30px consolas'; ctx.fillText('Level up! '+spAmounts[level]+' skillpoints received',250,100)
        level++; xpRequired = xpReqs[level];
    }

    //turning
    if (keysPressed && (keysPressed['a'] || keysPressed['ArrowLeft']) && gameState != states.inventory) {
        playerAngle -= playerTurnSpeed;
        //console.log(playerAngle)
        if (playerSprite == fighter) {
            var rotated1 = rotatePoint(playerX-camera.x+10,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x+20,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x-10,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x-20,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(2,2,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(2,2,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
        else if (playerSprite == corvette) {
            var rotated1 = rotatePoint(playerX-camera.x+17,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x+27,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x-17,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x-27,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(3,3,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(3,3,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
    }
    else if (keysPressed && (keysPressed['d'] || keysPressed['ArrowRight']) && gameState != states.inventory) {
        playerAngle += playerTurnSpeed
        //console.log(playerAngle)
        if (playerSprite == fighter) {
            var rotated1 = rotatePoint(playerX-camera.x-10,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x-20,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x+10,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x+20,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(2,2,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(2,2,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
        else if (playerSprite == corvette) {
            var rotated1 = rotatePoint(playerX-camera.x-17,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x-27,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x+17,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x+27,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(3,3,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(3,3,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
    }

    //strafing
    if (keysPressed && (keysPressed['q']) && gameState != states.inventory) {
        playerSpeed = 0.025
        inputVector = [playerSpeed * Math.cos((playerAngle+180) * Math.PI / 180),playerSpeed * Math.sin((playerAngle+180) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == fighter) {
            var rotated1 = rotatePoint(playerX-camera.x+10,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x+20,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x+10,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x+20,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(2,2,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(2,2,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
        else if (playerSprite == corvette) {
            var rotated1 = rotatePoint(playerX-camera.x+17,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x+27,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x+17,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x+27,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(3,3,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(3,3,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
    }
    else if (keysPressed && (keysPressed['e']) && gameState != states.inventory) {
        playerSpeed = 0.025
        inputVector = [playerSpeed * Math.cos((playerAngle) * Math.PI / 180),playerSpeed * Math.sin((playerAngle) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == fighter) {
            var rotated1 = rotatePoint(playerX-camera.x-10,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x-20,playerY-camera.y-20,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x-10,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x-20,playerY-camera.y+25,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(2,2,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(2,2,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
        else if (playerSprite == corvette) {
            var rotated1 = rotatePoint(playerX-camera.x-17,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x-27,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x-17,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x-27,playerY-camera.y+30,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(3,3,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(3,3,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
    }

    //go forwards / backwards
    if (keysPressed && (keysPressed['w'] || keysPressed['ArrowUp']) && gameState != states.inventory) {
        playerSpeed = 0.05
        inputVector = [playerSpeed * Math.cos((playerAngle-90) * Math.PI / 180),playerSpeed * Math.sin((playerAngle-90) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == fighter) {
            var rotated1 = rotatePoint(playerX-camera.x-7,playerY-camera.y+47,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x-7,playerY-camera.y+57,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x+7,playerY-camera.y+47,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x+7,playerY-camera.y+57,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(3,3,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleL',3,5,0,0,0,0))
            projectiles.push(new Projectile(3,3,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleL',3,5,0,0,0,0))
        }
        else if (playerSprite == corvette) {
            var rotated1 = rotatePoint(playerX-camera.x+27,playerY-camera.y+60,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x+27,playerY-camera.y+70,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x-27,playerY-camera.y+60,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x-27,playerY-camera.y+70,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(4,4,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleL',3,5,0,0,0,0))
            projectiles.push(new Projectile(4,4,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleL',3,5,0,0,0,0))
        }
    }
    else if (keysPressed && (keysPressed['s'] || keysPressed['ArrowDown']) && gameState != states.inventory) {
        playerSpeed = 0.025
        inputVector = [playerSpeed * Math.cos((playerAngle+90) * Math.PI / 180),playerSpeed * Math.sin((playerAngle+90) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == fighter) {
            var rotated1 = rotatePoint(playerX-camera.x-6,playerY-camera.y-40,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x-6,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x+6,playerY-camera.y-40,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x+6,playerY-camera.y-50,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(2,2,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(2,2,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
        else if (playerSprite == corvette) {
            var rotated1 = rotatePoint(playerX-camera.x+12,playerY-camera.y-65,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated2 = rotatePoint(playerX-camera.x+12,playerY-camera.y-75,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated3 = rotatePoint(playerX-camera.x-12,playerY-camera.y-65,playerX-camera.x,playerY-camera.y,playerAngle)
            var rotated4 = rotatePoint(playerX-camera.x-12,playerY-camera.y-75,playerX-camera.x,playerY-camera.y,playerAngle)

            projectiles.push(new Projectile(3,3,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'particleS',3,5,0,0,0,0))
            projectiles.push(new Projectile(3,3,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'particleS',3,5,0,0,0,0))
        }
    }
    
    if (keysPressed && keysPressed['r'] && gameState != states.inventory) {
        if (movementVector[0] > 0) {
            if (movementVector[0] < 0.05) {
                movementVector[0] = 0
            }
            else {movementVector[0] -= 0.05}
        }
        else if (movementVector[0] < 0) {
            if (movementVector[0] > -0.05) {
                movementVector[0] = 0
            }
            else {movementVector[0] += 0.05}
        }
        
        if (movementVector[1] > 0) {
            if (movementVector[1] < 0.05) {
                movementVector[1] = 0
            }
            else {movementVector[1] -= 0.05}
        }
        else if (movementVector[1] < 0) {
            if (movementVector[1] > -0.05) {
                movementVector[1] = 0
            }
            else {movementVector[1] += 0.05}
        }
    }

    // Camera follows player
    if (playerX < camera.x + camera.deadzoneWidth / 2) {
        camera.x = Math.max(0, playerX - camera.deadzoneWidth / 2);
    } 
    else if (playerX > camera.x + camera.width - camera.deadzoneWidth / 2) {
        camera.x = Math.min(worldWidth - camera.width, playerX - camera.width + camera.deadzoneWidth / 2);
    }
    
    if (playerY < camera.y + camera.deadzoneHeight / 2) {
        camera.y = Math.max(0, playerY - camera.deadzoneHeight / 2);
    } 
    else if (playerY > camera.y + camera.height - camera.deadzoneHeight / 2) {
        camera.y = Math.min(worldHeight - camera.height, playerY - camera.height + camera.deadzoneHeight / 2);
    }
    
    //move player
    if (playerX > -camera.x + 60 && playerX < worldWidth - 60)
    {playerX += movementVector[0]}
    else {
        if (playerX < worldWidth/2) {playerX = -camera.x + 100; movementVector[0] = 5}
        else {playerX = worldWidth - 100; movementVector[0] = -5}
    }

    if (playerY > -camera.y + 60 && playerY < worldHeight - 60)
    {playerY += movementVector[1]}
    else {
        if (playerY < worldHeight/2) {playerY = -camera.y + 100; movementVector[1] = 5}
        else {playerY = worldHeight - 100; movementVector[1] = -5}
    }

    //draw asteroids
    asteroidFields.forEach((field,index) => {
        if (-camera.x + field.x + field.width > 0 && -camera.x + field.x < totW && -camera.y + field.y + field.height > 0 && -camera.y + field.y < totH) {
            ctx.strokeStyle = 'rgb(255, 130, 0)'; lineWidth = 5; ctx.strokeRect(-camera.x + field.x,-camera.y + field.y,field.width,field.height)
            asteroids.forEach(steroid => {
                var last = steroid[steroid.length - 1];
                if (last.field == index) {
                    last.angle += last.rot;
                    ctx.save();
                    ctx.translate(-camera.x + last.xPos, -camera.y + last.yPos); 
                    ctx.rotate(last.angle * Math.PI / 180); 
                    ctx.translate(-last.xPos + camera.x, -last.yPos + camera.y)
                    ctx.fillStyle = 'rgb(170, 170, 170)';
                    ctx.beginPath();
                    ctx.moveTo(-camera.x + steroid[0].x, -camera.y + steroid[0].y);
                    for (var i = 1; i < steroid.length; i++) {
                        ctx.lineTo(-camera.x + steroid[i].x, -camera.y + steroid[i].y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                    last.hp -= 0.002
                    if (last.hp < last.origHp) {
                        var healthPc = last.hp / last.origHp
                        ctx.fillStyle = 'white'
                        ctx.fillRect(-camera.x + last.xPos - 50 * healthPc,-camera.y + last.yPos + last.radius + 5,100 * healthPc,6)
                    }
                }
            })
        }
    })

    //draw player
    ctx.save();
    ctx.translate(playerX-camera.x,playerY-camera.y); 
    ctx.rotate(playerAngle * Math.PI / 180); 
    ctx.translate(-(playerX-camera.x), -(playerY-camera.y)); 
    ctx.strokeStyle = shipStroke; 
    ctx.fillStyle = shipFill
    ctx.lineWidth = 2
    
    if (spriteSelection == 1) {updateFighterSprite(playerX-camera.x,playerY-camera.y); playerSprite = fighter}
    else if (spriteSelection == 2) {updateCorvetteSprite(playerX-camera.x,playerY-camera.y); playerSprite = corvette}

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
    ctx.fillStyle = 'red'; ctx.fillRect(playerX-camera.x-1,playerY-camera.y-1,2,2)
    
    ctx.fillStyle = 'green';
    ctx.fillRect(-camera.x+worldWidth-60,-camera.y+playerY,3,3)
    ctx.fillRect(-camera.x + 60,-camera.y+playerY,3,3)
    ctx.fillRect(-camera.x+playerX,-camera.y+worldHeight-60,3,3)
    ctx.fillRect(-camera.x+playerX,-camera.y+60,3,3)
    
    /*playerSprite.forEach(path => {
        if (ctx.isPointInPath(path,-camera.x + worldWidth - 60,-camera.y + playerY)) {
            playerX = worldWidth - 100; movementVector[0] = -5
        }
        else if (ctx.isPointInPath(path,-camera.x + 60,-camera.y + playerY)) {
            playerX = -camera.x + 100; movementVector[0] = 5
        }

        if (ctx.isPointInPath(path,-camera.x+playerX,-camera.y + worldHeight - 60)) {
            playerY = worldHeight - 100; movementVector[1] = -5
        }
        else if (ctx.isPointInPath(path,-camera.x + playerX,-camera.y + 60)) {
            playerY = -camera.y + 100; movementVector[1] = 5
        }
    })*/

    projectiles.forEach((pro,index) => {
        pro.update()

    })
    //projectile logic from pew-pew
    /*arrowPArray.forEach((bullet,bIndex) => {
        if (bullet.type == 'frend') {
            ctx.fillRect(bullet.x,bullet.y,4,4)
            pewEnemies.forEach((roid,index) => {
                var last = roid[roid.length - 1];
                
                if (bullet.x > last.xPos - last.radius && bullet.x < last.xPos + last.radius 
                && bullet.y > last.yPos - last.radius && bullet.y < last.yPos + last.radius) 
                {
                    arrowPArray.splice(bIndex,1); last.hp -= 1;
                    if (last.hp == 0) {
                        pewEnemies.splice(index,1)
                        score += last.score; 
                    }
                }
            });
        }
    })*/
    //projectile logic from third gem
    /*projectiles.forEach((bullet,index) => {        
        if (bullet.type == 'enemi' && bullet.crashWith(player))
        {
            if (armor == 0)
            {
                projectiles.splice(index,1)
                health -= bullet.damage
                //console.log('received '+bullet.damage+' damage')
            }   
            else if (armor > bullet.damage)
            {
                projectiles.splice(index,1)
                armor -= bullet.damage / 2
                health -= bullet.damage / 2
                //console.log('received '+bullet.damage / 2+' damage, '+bullet.damage / 2+' damage absorbed by armor')
            }
            else if (armor > 0)
            {
                projectiles.splice(index,1)
                var reducedDamage = bullet.damage - armor
                var protected = bullet.damage - reducedDamage
                armor = 0
                health -= reducedDamage
                //console.log('received '+reducedDamage+' damage, '+protected+' damage absorbed by armor')
            }
        }
        else if (bullet.type == 'frend' || bullet.type == 'fragment')
        {
            enemies.forEach(enemi => {
                if (bullet.crashWith(enemi)){
                    projectiles.splice(index,1)
                    enemi.health -= bullet.damage
                    console.log(enemi.health)
                }
            })
        }
        else if (bullet.type == 'grenade')
        {
            bullet.gUpdate()
            console.log('angle: '+bullet.angle+'dx: '+bullet.dx+' dy: '+bullet.dy+' fallSpeed: '+bullet.fallSpeed)
            bullet.lifeTime += 0.02;
            if (bullet.lifeTime > 3) {
                projectiles.splice(index,1)
                for (var g = 0; g < 20; g++) {
                    projectiles.push(new Projectile(2,2,'darkslategrey',bullet.x,bullet.y,bullet.x + Math.random() * (2 * 10) - 10,bullet.y + Math.random() * (2 * 10) - 10,'fragment'))
                }
            }
        }
    })*/
    //projectile logic from bes defense
    /*projectiles.forEach(bullet => {
        bullet.update()
        if (bullet.newPos == true)
        {
            projectiles.splice(bullet,1)
        }
        if (bullet.type == 'enemi')
        {
            if (bullet.x < 225 && currentShield > 0)
            {
                projectiles.splice(bullet,1)
                currentShield -= bullet.damage
                shieldJustHit = true
                console.log('shield received '+bullet.damage+' damage')
            }   
            if (bullet.x < 150)
            {
                projectiles.splice(bullet,1)
                currentHealth -= bullet.damage
                console.log('base received '+bullet.damage+' damage')
            }
        }
        else if (bullet.type == 'frend')
        {
            enemies.forEach(enemi => {
                if (bullet.crashWith(enemi)){
                    projectiles.splice(bullet,1)
                    enemi.health -= bullet.damage
                }
            })
        }
    });*/

    //shield logic from bes defense
    /*if (shieldTimeout > 0) {shieldTimeout -= 0.02; console.log('time to shield recharge'+Math.round(shieldTimeout))}
    if (shieldJustHit == true) {
        if (currentShield < 0)
        {
            currentShield = 0; shieldTimeout = 4
        }
        else { shieldTimeout = 4}
        shieldJustHit = false
    }
    if (!shieldJustHit && shieldTimeout <= 0 && shieldPercentage < 1)
    {
        currentShield += maxShield/200
    }
    shieldPercentage = currentShield / maxShield   
    if (shieldPercentage > 0.25) {ctx.strokeStyle = 'blue'}
    if (shieldPercentage < 0.25) {ctx.strokeStyle = 'red'}
    if (currentShield > 0)
    {ctx.beginPath(); ctx.arc(10,totH/2,230,-1,1); ctx.stroke()}*/


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
    ctx.lineWidth = 2; ctx.fillStyle = 'rgba(59, 168, 240, 0.9)'; ctx.fillRect(totW-150,10,140,90); 
    ctx.strokeRect(totW-150,10,140,90); ctx.save(); ctx.translate(totW-150+playerX/500,10+playerY/500);
    ctx.rotate(playerAngle * Math.PI / 180); ctx.beginPath(); ctx.fillStyle = 'green';
    ctx.moveTo(-2,2); ctx.lineTo(2,2); ctx.lineTo(0,-4); ctx.fill();
    ctx.translate(-(totW-150+playerX/500),-(10+playerY/500)); ctx.restore(); 
    ctx.fillStyle = 'gray'
    asteroids.forEach(ass => {
        ctx.fillRect(totW-150+ass[ass.length-1].xPos/500,10+ass[ass.length-1].yPos/500,2,2)
    })
    ctx.fillStyle = foreground; ctx.font = '10px consolas';
    ctx.fillText('X:'+Math.round(playerX*10)/10+' Y:'+Math.round(playerY*10)/10,552.5,97.5)

    //ctx.strokeRect(camera.deadzoneWidth / 2,camera.deadzoneHeight / 2,camera.width - camera.deadzoneWidth,camera.height - camera.deadzoneHeight)

    //inventory and stuff menu
    if (gameState == states.inventory) {
        //background
        ctx.fillStyle = 'rgba(59, 168, 240, 0.9)'; ctx.fillRect(totW/2-210,totH/2-135,420,270);
        //dividers
        ctx.lineWidth = 4; ctx.strokeRect(totW/2-210,totH/2-135,420,270); ctx.beginPath();
        ctx.moveTo(totW/2+20,totH/2-135); ctx.lineTo(totW/2+20,totH/2+135); ctx.moveTo(370,300);
        ctx.lineTo(560,300); ctx.stroke(); 
        //inventory slots
        ctx.lineWidth = 3; slotsX.forEach(x => {slotsY.forEach(y => {ctx.strokeRect(x,y,45,45)})})
        //level related text
        ctx.font = '15px consolas'; ctx.fillStyle = foreground; skillPointsTextWidth = ctx.measureText('Skillpoints: '+skillPoints)
        ctx.fillText('Level '+level+' => '+(level+1)+'  '+xp+'/'+xpRequired,150,110); ctx.fillText('Skillpoints: '+skillPoints,150,130)
        //skillpoint adding button
        ctx.lineWidth = 2; ctx.strokeRect(150+skillPointsTextWidth.width+5,118,15,15); ctx.beginPath(); 
        ctx.moveTo(150+skillPointsTextWidth.width+8,125.5); ctx.lineTo(150+skillPointsTextWidth.width+17,125.5); 
        ctx.moveTo(150+skillPointsTextWidth.width+12.5,121); ctx.lineTo(150+skillPointsTextWidth.width+12.5,130); 
        if (skillPoints > 0) {ctx.strokeStyle = 'red'}; ctx.stroke()
        //ship display
        if (spriteSelection == 1) {updateFighterSprite(465,200); playerSprite = fighter}
        else if (spriteSelection == 2) {updateCorvetteSprite(465,200); playerSprite = corvette; ctx.scale(0.80,0.80); ctx.translate(x*0.1,y*0.1)}
        ctx.strokeStyle = shipStroke; ctx.fillStyle = shipFill; ctx.lineWidth = 2
        playerSprite.forEach((path,index) => {
            if (index == playerSprite.length-1) {
                ctx.fillStyle = shipWindows;
                ctx.fill(path)
            }
            else {
                ctx.fill(path); ctx.stroke(path)
            }
        })
        //ship slots
        ctx.strokeStyle = foreground; ctx.fillStyle = foreground; ctx.resetTransform()
        if (spriteSelection == 1) {
            ctx.beginPath(); ctx.moveTo(440,215); ctx.lineTo(430,170); ctx.lineTo(420,170);
            ctx.moveTo(490,215); ctx.lineTo(500,170); ctx.lineTo(510,170);
            ctx.moveTo(465,200); ctx.lineTo(440,125); ctx.lineTo(430,125); ctx.stroke()
            ctx.strokeRect(380,150,40,40); ctx.strokeRect(510,150,40,40); ctx.strokeRect(390,105,40,40)
            ctx.font = '20px consolas'; ctx.fillText('T1w',383,175); ctx.fillText('T1w',513,175); ctx.fillText('T1w/u',393,130,33);
        }
    }

    //cursor
    if (gameState != states.inventory) {    
        ctx.strokeStyle = foreground; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(mousePosX-6,mousePosY-18); ctx.lineTo(mousePosX-18,mousePosY-18); 
        ctx.lineTo(mousePosX-18,mousePosY-6)
        ctx.moveTo(mousePosX-18,mousePosY+6); ctx.lineTo(mousePosX-18,mousePosY+18); 
        ctx.lineTo(mousePosX-6,mousePosY+18)
        ctx.moveTo(mousePosX+6,mousePosY+18); ctx.lineTo(mousePosX+18,mousePosY+18); 
        ctx.lineTo(mousePosX+18,mousePosY+6)
        ctx.moveTo(mousePosX+18,mousePosY-6); ctx.lineTo(mousePosX+18,mousePosY-18); 
        ctx.lineTo(mousePosX+6,mousePosY-18)
        ctx.moveTo(mousePosX+6,mousePosY)
        ctx.arc(mousePosX,mousePosY,6,0,7); ctx.stroke()
    }
    else {
        ctx.strokeStyle = foreground; ctx.lineWidth = 2;
        ctx.strokeRect(mousePosX - 10,mousePosY - 10,20,20)
        if (hovering == true) {ctx.strokeStyle = 'red'}
        else {ctx.strokeStyle = foreground}; ctx.lineWidth = 2; 
        ctx.beginPath(); ctx.arc(mousePosX,mousePosY,3,0,7); ctx.stroke()
    }

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