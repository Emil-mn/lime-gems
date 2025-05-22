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
var zoomLevel = 1
var zoomOffset = 1
//states
var states = {menu:0,main:1,paused:2,inventory:3,map:4,escaping:5}
var gameState = states.menu
var interval
var canPause = true
var hovering = false
//inventory
var canOpenInv = true
var canSwitchShip = true
var skillPointsTextWidth
var skillPoints = 0
var skillPointsAdding = false
var dmgLvl = 0,frtLvl = 0 //???
var accLvl = 0,crtLvl = 0 //???
var hltLvl = 0 //???
var slotsX = [150,205,260,315]
var slotsY = [140,195,250,305]
var fighterSlotsPos = [{x:380,y:150},{x:510,y:150},{x:390,y:105}]
var fighterTierAndTurret = [{tier:1,turreted:false},{tier:1,turreted:false},{tier:1,turreted:true}]
var corvSlotsPos = [{x:380,y:105},{x:380,y:150},{x:380,y:230},{x:510,y:105},{x:510,y:150},{x:510,y:230}]
var corvTierAndTurret = [{tier:2,turreted:false},{tier:1,turreted:true},{tier:1,turreted:true},{tier:2,turreted:false},{tier:1,turreted:true},{tier:1,turreted:true}]
var beingDragged = {item:null,origin:null,type:null}
var fighterSlots = {slot1:null,slot2:null,slot3:null}
var corvetteSlots = {slot1:null,slot2:null,slot3:null,slot4:null,slot5:null,slot6:null}
var equipmentSlotsPos = fighterSlotsPos
var equipmentSlotsTierAndTurret = fighterTierAndTurret
var equipmentSlots = fighterSlots
//map
var canOpenMap = true
var deathLocation = {x:0,y:0,ship:0,angle:0}
var hoverTarget = null
var waypoint = {x:0,y:0}
var waypointTimer = 2
//misc
var healingAccumulator = 0
var timeoutThing = true
var pickupTarget = null
//arrays
var enemies = []
var asteroidFields = []
var asteroids = []
var weapons = []
var damageNumbers = []
var explosions = []
var inventoryContent = {slot1:null,slot2:null,slot3:null,slot4:null,slot5:null,slot6:null,slot7:null,slot8:null,
    slot9:null,slot10:null,slot11:null,slot12:null,slot13:null,slot14:null,slot15:null,slot16:null
}
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
var fireInterval
var shieldJustHit = false
var shieldTimeout = 0
var displayLevelUpMessage = 0
var healedHealth = 0
//character stats
var fighterMaxSpeed = 0.05
var fighterTurnSpeed = 3
var fighterMaxHealth = 100

var corvetteMaxSpeed = 0.04
var corvetteTurnSpeed = 2.75
var corvetteMaxHealth = 150

var playerMaxSpeed = fighterMaxSpeed
var playerTurnSpeed = fighterTurnSpeed
var maxHealth = fighterMaxHealth
var maxShield = 0
var health = 100
var shield = 0

var credits = 0
var xp = 0
var level = 0
var xpRequired = xpReqs[0]
//sprites
var escapePod
var escapePodBody
var escapePodWindow

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

function updateEscapepodSprite(x,y) {
    escapePodBody = new Path2D
    escapePodBody.moveTo(x-2.5,y+18)
    escapePodBody.lineTo(x-5,y+5)
    escapePodBody.lineTo(x-5,y-15)
    escapePodBody.quadraticCurveTo(x,y-23,x+5,y-15)
    escapePodBody.lineTo(x+5,y+5)
    escapePodBody.lineTo(x+2.5,y+18)
    escapePodBody.closePath()

    escapePodWindow = new Path2D
    escapePodWindow.moveTo(x-3,y-10)
    escapePodWindow.lineTo(x-3,y-12)
    escapePodWindow.quadraticCurveTo(x,y-18,x+3,y-12)
    escapePodWindow.lineTo(x+3,y-10)
    escapePodWindow.closePath()

    escapePod = [escapePodBody,escapePodWindow]
}

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
    clearInterval(fireInterval)
    if (beingDragged.item != null) {checkDrop()}
})

can.addEventListener('mousemove', function(event) {
    var rect = can.getBoundingClientRect();
    mousePosX = event.pageX - rect.left;
    mousePosY = event.pageY - rect.top;
    hoverCheck()
    //console.log('mouse is at '+ mousePosX + ',' + mousePosY);
})

document.addEventListener('keydown', function(event) {
    keysPressed = (keysPressed || {});
    keysPressed[event.code] = true; //console.log(event.code)
    if (event.code == 'Tab') {event.preventDefault()}
    if (event.code == 'Escape' && gameState == states.paused) {
        console.log('resumed'); gameState = states.main
        ctx.textAlign = 'left'; can.style.cursor = 'none'
        setTimeout(() => {canPause = true},500)
        interval = setInterval(mainLoop,20)
    }
    if ((event.key == 'f' || event.key == 'Shift') && gameState == states.main && !event.repeat) {
        clearInterval(fireInterval); fireInterval = setInterval(fire,20)
    }
})
document.addEventListener('keyup', function(event) {
    if (event.key != 'F5' && event.key != 'ControlLeft') {
        keysPressed[event.code] = false; //console.log(keysPressed)
        if (event.key == 'f' || event.key == 'Shift') {clearInterval(fireInterval)}
    }
})

can.addEventListener('wheel', function(scroll) {
    if (scroll.deltaY > 0 && zoomLevel > 0.5) {zoomLevel -= 0.1;}
    else if (scroll.deltaY < 0 && zoomLevel < 1.0) {zoomLevel += 0.1}
    zoomLevel = Math.round(zoomLevel * 10) / 10
    
    zoomOffset = 1 / zoomLevel
    
    console.log(zoomLevel+':'+zoomOffset)
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
    ctx.fillStyle = foreground; ctx.font = '50px consolas'; 
    ctx.fillText('Generating world...',totW/2,200);
    ctx.textAlign = 'left';
    inventoryContent.slot1 = new weapon('mg',1,1,0.2,false,true,2,6,10,2,1.5,2)
    inventoryContent.slot2 = new weapon('mg',1,1,0.2,false,true,2,6,10,2,1.5,2)
    inventoryContent.slot3 = new weapon('sg',1,1,1,false,true,8,6,5,1.5,1,1.5)
    inventoryContent.slot4 = new weapon('sg',1,1,1,false,true,8,6,5,1.5,1,1.5)
    inventoryContent.slot5 = new weapon('cnn',2,1,2,false,true,1,8,5,1.5,15,30)
    inventoryContent.slot6 = new weapon('cnn',2,1,2,false,true,1,8,5,1.5,15,30)
    inventoryContent.slot7 = new weapon('rlg',2,1,4,false,true,1,15,2,1.25,25,50)
    inventoryContent.slot8 = new weapon('rlg',2,1,4,false,true,1,15,2,1.25,25,50)

    inventoryContent.slot13 = new weapon('lsr',1,1,0,false,true,0,0,0,1,0.1,0.2)
    inventoryContent.slot14 = new weapon('lsr',1,1,0,false,true,0,0,0,1,0.1,0.2)
    inventoryContent.slot15 = new weapon('lsr',1,1,0,false,true,0,0,0,1,0.1,0.2)
    inventoryContent.slot16 = new weapon('lsr',1,1,0,false,true,0,0,0,1,0.1,0.2)

    enemies.push(new mine(worldWidth/2 + 3000,worldHeight/2 + 500,'impact','tiny'))
    //enemies.push(new mine(worldWidth/2 + 620,worldHeight/2 + 500,'impact','small'))
    //enemies.push(new mine(worldWidth/2 + 760,worldHeight/2 + 500,'impact','medium'))
    //enemies.push(new mine(worldWidth/2 + 920,worldHeight/2 + 500,'impact','large'))
    //enemies.push(new mine(worldWidth/2 + 1100,worldHeight/2 + 500,'impact','huge'))
    
    var numberOfAsteroidfields = Math.floor(Math.random() * 3 + 3)
    for (var aField = 0; aField < numberOfAsteroidfields; aField++) {
        var width = Math.random() * (3000-1000) + 1000;
        var height = Math.random() * (2000-750) + 750;
        var x = Math.random() * (-camera.x + worldWidth - width - 400) + 200;
        var y = Math.random() * (-camera.y + worldHeight - height - 400) + 200;
        var numberOfAsteroids = Math.floor((width - 700) / 2100 * (100 - 25) + 25);
        asteroidFields.push({width:width,height:height,x:x,y:y,
        limitOfAsteroids:numberOfAsteroids,currentAsteroids:numberOfAsteroids,respawnTime:30})
        console.log('asteroids in field '+aField+' :'+numberOfAsteroids)
        for (var ass = 0; ass < numberOfAsteroids; ass++) {
            var sides = Math.floor(Math.random() * 10 + 5);
            var asteroid = [];
            var radius = Math.random() * (100-25) + 25;
            var astX = Math.random() * ((x + width) - x) + x 
            var astY = Math.random() * ((y + height)- y) + y
            var xSpeed = Math.random() * 2 - 1;
            var ySpeed = Math.random() * 2 - 1;
            var rotation = Math.random() * 4 -2;
            var health = Math.floor((radius - 25) / 100 * (100 - 25) + 25)
            var experience = Math.floor((health - 25) / 100 * (20 - 5) + 5)

            for (var s = 0; s < sides; s++) {
                var angle = (Math.PI * 2 / sides) * s;
                var pointX = astX + Math.cos(angle) * (radius + Math.random() * 25 - 12);
                var pointY = astY + Math.sin(angle) * (radius + Math.random() * 25 - 12);
                asteroid.push({ x: pointX, y: pointY });
            }
        
            asteroid.push({xPos:astX, yPos:astY, dx:xSpeed, dy:ySpeed, rot:rotation, angle:0, radius:radius, hp:health, origHp:health, field:aField, xp:experience})

            asteroids.push(asteroid)
        }
        console.log(asteroids.length)
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
    else if (gameState == states.main) {
        if (buttonClicked(550,10,140,90) && canOpenMap == true) {
            canOpenMap = false; setTimeout(() => {canOpenMap = true},500)
            gameState = states.map; console.log('map clicked open')
        }
        else {
            clearInterval(fireInterval)
            fireInterval = setInterval(fire,20)
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
    else if (gameState == states.map) {
        var scaleFactor = 166.6666666666667
        var mapX = totW/2-210; var mapY = totH/2-135
        var mapWidth = 420; var mapHeight = 270
        if (buttonClicked(155,70,20,20)) {
            gameState = states.main; console.log('map closed')
            hovering = false
        }
        else if (buttonClicked(185,70,125,20) && canOpenInv == true) {
            canOpenInv = false; setTimeout(() => {canOpenInv = true},500)
            skillPointsAdding = false;
            gameState = states.inventory; console.log('inventory clicked open from map')
        }
        else if (mouseClickX > mapX && mouseClickX < mapX + mapWidth && mouseClickY > mapY && mouseClickY < mapY + mapHeight) {
            waypoint.x = Math.floor((mouseClickX - mapX) * scaleFactor); waypoint.y = Math.floor((mouseClickY - mapY) * scaleFactor);
        }
    }
    else if (gameState == states.inventory) {
        if (buttonClicked(155,70,20,20)) {
            gameState = states.main; console.log('inventory closed')
            hovering = false
        }
        else if (buttonClicked(320,70,60,20) && canOpenMap == true) {
            canOpenMap = false; setTimeout(() => {canOpenMap = true},500)
            gameState = states.map; console.log('map clicked open from inventory')
        }
        else if (buttonClicked(150+skillPointsTextWidth.width+5,118,15,15)) {
            console.log('doing the skillpoint thing')
            skillPointsAdding == true ? skillPointsAdding = false : skillPointsAdding = true
        }
        else if (skillPointsAdding == false) {
            var lipsum = true
            slotsX.some((x,xIndex) => {
                slotsY.some((y,yIndex) => {
                    if (buttonClicked(x,y,45,45)) {
                        var target = 'slot'
                        switch (yIndex) {
                            case 0: target += xIndex+1; break
                            case 1: target += xIndex+5; break
                            case 2: target += xIndex+9; break
                            case 3: target += xIndex+13; break
                        }
                        console.log('clicked on '+target)
                        if (inventoryContent[target] != null) {
                            beingDragged.item = inventoryContent[target]
                            beingDragged.origin = target
                            beingDragged.type = 'inventory'
                            console.log('dragging '+beingDragged.item+' from the '+beingDragged.type+' slot '+beingDragged.origin)
                        }
                        else {console.log('nothing to drag')}
                        lipsum = true; return true
                    }
                    else {lipsum = false; return false}
                })
                if (lipsum == true) {return true}
                else {return false}
            })
            if (lipsum == false) {
                equipmentSlotsPos.some((pos,posIndex) => {
                    if (buttonClicked(pos.x,pos.y,40,40)) {
                        var target = 'slot'+(posIndex+1)
                        console.log('clicked on '+target)
                        if (equipmentSlots[target] != null) {
                            beingDragged.item = equipmentSlots[target]
                            beingDragged.origin = target
                            beingDragged.type = 'equipment'
                            console.log('dragging '+beingDragged.item+' from the '+beingDragged.type+' slot '+beingDragged.origin)
                        }
                        else {console.log('nothing to drag')}
                        return true
                    }
                    else {return false}
                })
            }
        }
    }
}

function checkDrop() {
    var lipsum = true,lapsum = true;
    slotsX.some((x,xIndex) => {
        slotsY.some((y,yIndex) => {
            if (buttonHovered(x,y,45,45)) {
                var target = 'slot'
                switch (yIndex) {
                    case 0: target += xIndex+1; break
                    case 1: target += xIndex+5; break
                    case 2: target += xIndex+9; break
                    case 3: target += xIndex+13; break
                }
                console.log('attempting drop on '+target)
                if (inventoryContent[target] == null) {
                    inventoryContent[target] = beingDragged.item
                    if (beingDragged.type == 'inventory') {
                        inventoryContent[beingDragged.origin] = null
                    }
                    else if (beingDragged.type == 'equipment') {
                        equipmentSlots[beingDragged.origin] = null
                        weapons.splice(weapons.findIndex(gun => gun.slot == beingDragged.origin),1)
                        beingDragged.item.slot = null
                    }
                    console.log('moved '+beingDragged.item+' from the '+beingDragged.type+' slot '+beingDragged.origin+' to the inventory slot '+target)
                    beingDragged.item = null
                    beingDragged.origin = null
                    beingDragged.type = null
                }
                else {
                    console.log('slot already occupied')
                    beingDragged.item = null
                    beingDragged.origin = null
                    beingDragged.type = null
                }
                lipsum = true; return true
            }
            else {lipsum = false; return false}
        })
        if (lipsum == true) {return true}
        else {return false}
    })

    if (lipsum == false) {
        equipmentSlotsPos.some((pos,posIndex) => {
            if (buttonHovered(pos.x,pos.y,40,40)) {
                var target = 'slot'+(posIndex+1)
                console.log('attempting drop on '+target)
                if (equipmentSlots[target] == null) {
                    if (equipmentSlotsTierAndTurret[posIndex].tier == beingDragged.item.tier) {
                        equipmentSlots[target] = beingDragged.item
                        beingDragged.item.slot = target
                        if (spriteSelection == 1) {
                            var weaponspos = [{x:playerX-30,y:playerY},{x:playerX+30,y:playerY},{x:playerX,y:playerY}]
                        }
                        else if (spriteSelection == 2) {
                            var weaponspos = [{x:playerX-25,y:playerY-40},{x:playerX-25,y:playerY-5},{x:playerX-25,y:playerY+25},{x:playerX+25,y:playerY-40},{x:playerX+25,y:playerY-5},{x:playerX+25,y:playerY+25}]
                        }
                        beingDragged.item.x = weaponspos[posIndex].x
                        beingDragged.item.y = weaponspos[posIndex].y
                        if (equipmentSlotsTierAndTurret[posIndex].turreted == true) {
                            beingDragged.item.isTurret = true;
                            console.log('weapon is now turreted')
                        }
                        else {
                            beingDragged.item.isTurret = false;
                            console.log('weapon is now fixed')
                        }
                        if (beingDragged.type == 'inventory') {
                            inventoryContent[beingDragged.origin] = null
                            weapons.push(beingDragged.item)
                        }
                        else if (beingDragged.type == 'equipment') {
                            equipmentSlots[beingDragged.origin] = null
                        }
                        console.log('moved '+beingDragged.item+' from the '+beingDragged.type+' slot '+beingDragged.origin+' to the equipment slot '+target)
                        beingDragged.item = null
                        beingDragged.origin = null
                        beingDragged.type = null
                    }
                    else {
                        console.log('wrong tier')
                        beingDragged.item = null
                        beingDragged.origin = null
                        beingDragged.type = null
                    }
                }
                else {
                    console.log('slot already occupied')
                    beingDragged.item = null
                    beingDragged.origin = null
                    beingDragged.type = null
                }
                lapsum = true; return true
            }
            else {lapsum = false; return false}
        })
    }
    

    if (lipsum == false && lapsum == false) {
        if (mousePosX > 140 && mousePosX < 560 && mousePosY > 90 && mousePosY < 360) {
            console.log('not a drop location')
            beingDragged.item = null
            beingDragged.origin = null
            beingDragged.type = null
        }
        else {
            var pos = rotatePoint(playerX,playerY+250,playerX,playerY,playerAngle)
            if (beingDragged.type == 'inventory') {
                inventoryContent[beingDragged.origin] = null
            }
            else if (beingDragged.type == 'equipment') {
                equipmentSlots[beingDragged.origin] = null
                weapons.splice(weapons.findIndex(gun => gun.slot == beingDragged.origin),1)
                beingDragged.item.slot = null
            }
            pickups.push(new pickup(pos.x,pos.y,5,5,'orange','item',beingDragged.item))
            console.log('threw '+beingDragged.item+' out of inventory')
            beingDragged.item = null
            beingDragged.origin = null
            beingDragged.type = null
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
    else if (gameState == states.main) {
        if (buttonHovered(550,10,140,90)) {
            hovering = true; console.log('pointing at minimap')
        }
        else {hovering = false}
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
        if (buttonHovered(155,70,20,20)) {
            hovering = true; console.log('pointing at close button')
        }
        else if (buttonHovered(320,70,60,20)) {
            hovering = true; console.log('pointing at map tab')
        }
        else if (buttonHovered(150+skillPointsTextWidth.width+5,118,15,15)) {
            hovering = true; console.log('pointing at skillpoint button')
        }
        else if (skillPointsAdding == false) {
            var lipsum = true
            slotsX.some((x,xIndex) => {
                slotsY.some((y,yIndex) => {
                    if (buttonHovered(x,y,45,45)) {
                        hovering = true
                        var target = 'slot'
                        switch (yIndex) {
                            case 0: target += xIndex+1; break
                            case 1: target += xIndex+5; break
                            case 2: target += xIndex+9; break
                            case 3: target += xIndex+13; break
                        }
                        hoverTarget = inventoryContent[target];
                        console.log('pointing at '+target)
                        lipsum = true; return true
                    }
                    else {hovering = false; hoverTarget = null; lipsum = false; return false}
                })
                if (lipsum == true) {return true}
                else {return false}
            })
            if (lipsum == false) {
                equipmentSlotsPos.some((pos,posIndex) => {
                    if (buttonHovered(pos.x,pos.y,40,40)) {
                        hovering = true
                        var target = 'slot'+(posIndex+1)
                        console.log('pointing at '+target)
                        hoverTarget = equipmentSlots[target];
                        return true
                    }
                    else {hovering = false; hoverTarget = null; return false}
                })
            }
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

function doesLineIntersectCircle(x1, y1, x2, y2, cx, cy, r) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let fx = x1 - cx;
    let fy = y1 - cy;

    let a = dx * dx + dy * dy;
    let b = 2 * (fx * dx + fy * dy);
    let c = fx * fx + fy * fy - r * r;

    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return null;
    }

    let sqrtD = Math.sqrt(discriminant);
    let t1 = (-b - sqrtD) / (2 * a);
    let t2 = (-b + sqrtD) / (2 * a);

    let intersections = [];

    if (t1 >= 0 && t1 <= 1) {
        let ix1 = x1 + t1 * dx;
        let iy1 = y1 + t1 * dy;
        intersections.push({ x: ix1, y: iy1 });
    }

    if (t2 >= 0 && t2 <= 1) {
        let ix2 = x1 + t2 * dx;
        let iy2 = y1 + t2 * dy;
        intersections.push({ x: ix2, y: iy2 });
    }

    return intersections.length > 0 ? intersections : null;
}

function dropStuff(mode,last) {
    if (mode == 'asteroid') {
        for (var n = 0; n < 10; n++) {
            var x = last.xPos + (Math.random() * (last.radius*2)) - last.radius
            var y = last.yPos + (Math.random() * (last.radius*2)) - last.radius
            pickups.push(new pickup(x,y,3,3,'yellow','xp',last.xp/10))
        }
        for (var o = 0; o < 6; o++) {
            var x = last.xPos + (Math.random() * (last.radius*2)) - last.radius
            var y = last.yPos + (Math.random() * (last.radius*2)) - last.radius
            switch (Math.floor(Math.random()*3)) {
                case 0: var type = 'stone'; break
                case 1: var type = 'iron ore'; break
                case 2: var type = 'copper ore'; break
            }
            pickups.push(new pickup(x,y,4,4,'gray','mineral',{type:type,amount:Math.round(last.xp/6)}))
        }
    }
    else if (mode == 'enemy') {
        for (var h = 0; h < 8; h++) {
            var x = last.xPos + (Math.random() * (last.radius*2)) - last.radius
            var y = last.yPos + (Math.random() * (last.radius*2)) - last.radius
            pickups.push(new pickup(x,y,3,3,'red','health',last.xp/8))
        }
        for (var c = 0; c < 8; c++) {
            var x = last.xPos + (Math.random() * (last.radius*2)) - last.radius
            var y = last.yPos + (Math.random() * (last.radius*2)) - last.radius
            pickups.push(new pickup(x,y,3,3,'green','credits',last.xp/8))
        }
        pickups.push(new pickup(x+10,y+10,5,5,'hotpink','item',new weapon('mg',1,1,0.2,false,true,2,6,10,1.5,1.5,2)))
    }
}

function blastDamage(hitX,hitY,damage,radius) {
    asteroidFields.forEach((field,fIndex) => {
        if (-camera.x + field.x + field.width > 0 && -camera.x + field.x < camera.width && -camera.y + field.y + field.height > 0 && -camera.y + field.y < camera.height) {    
            for (var ast = 0; ast < asteroids.length; ast++) {
                var roid = asteroids[ast]
                var last = roid[roid.length - 1];
                if (last.field == fIndex) {
                    //if roid inside blast radius
                    if (last.xPos > hitX-radius && last.xPos < hitX+radius && last.yPos > hitY-radius && last.yPos < hitY+radius)
                    {
                        //calculate damage based on how far the center of the roid is between the edge and center of the radius
                        var distanceFromCenter = Math.hypot(last.xPos - hitX,last.yPos - hitY)
                        var fraction = distanceFromCenter / radius;
                        var blastDmg = damage * fraction

                        //roid hit by blast dmg
                        last.hp -= blastDmg;
                        damageNumbers.unshift({type:'damage',x:last.xPos+(Math.random()*100 - 50) - camera.x,y:last.yPos+(Math.random()*100 - 50) - camera.y,amount:blastDmg,lifetime:1})

                        //roid killed by blast dmg
                        if (last.hp <= 0) {
                            asteroids.splice(ast,1)
                            dropStuff('asteroid',last)
                            field.currentAsteroids--
                            ast--
                        }
                    }  
                }
            }
        }
    })
    if (playerX > hitX-radius && playerX < hitX+radius && playerY > hitY-radius && playerY < hitY+radius)
    {
        //calculate damage based on how far the center of the ship is between the edge and center of the radius
        var distanceFromCenter = Math.hypot(playerX - hitX,playerY - hitY)
        var fraction = distanceFromCenter / radius;
        var blastDmg = damage * fraction

        //ship hit by blast dmg
        health -= blastDmg;
        damageNumbers.unshift({type:'damage',x:playerX+(Math.random()*100 - 50) - camera.x,y:playerY+(Math.random()*100 - 50) - camera.y,amount:blastDmg,lifetime:1})
    }  
}

function steeringParticles(mode,x1,y1,x2,y2,projectileSize) {
    if (mode == 'turnLeft') {
        var rotated1 = rotatePoint(playerX+x1,playerY-y1,playerX,playerY,playerAngle)
        var rotated2 = rotatePoint(playerX+x1*2,playerY-y1,playerX,playerY,playerAngle)
        var rotated3 = rotatePoint(playerX-x2,playerY+y2,playerX,playerY,playerAngle)
        var rotated4 = rotatePoint(playerX-x2*2,playerY+y2,playerX,playerY,playerAngle)
    }
    else if (mode == 'turnRight') {
        var rotated1 = rotatePoint(playerX-x1,playerY-y1,playerX,playerY,playerAngle)
        var rotated2 = rotatePoint(playerX-x1*2,playerY-y1,playerX,playerY,playerAngle)
        var rotated3 = rotatePoint(playerX+x2,playerY+y2,playerX,playerY,playerAngle)
        var rotated4 = rotatePoint(playerX+x2*2,playerY+y2,playerX,playerY,playerAngle)
    }
    else if (mode == 'strafeLeft') {
        var rotated1 = rotatePoint(playerX+x1,playerY-y1,playerX,playerY,playerAngle)
        var rotated2 = rotatePoint(playerX+x1*2,playerY-y1,playerX,playerY,playerAngle)
        var rotated3 = rotatePoint(playerX+x2,playerY+y2,playerX,playerY,playerAngle)
        var rotated4 = rotatePoint(playerX+x2*2,playerY+y2,playerX,playerY,playerAngle)
    }
    else if (mode == 'strafeRight') {
        var rotated1 = rotatePoint(playerX-x1,playerY-y1,playerX,playerY,playerAngle)
        var rotated2 = rotatePoint(playerX-x1*2,playerY-y1,playerX,playerY,playerAngle)
        var rotated3 = rotatePoint(playerX-x2,playerY+y2,playerX,playerY,playerAngle)
        var rotated4 = rotatePoint(playerX-x2*2,playerY+y2,playerX,playerY,playerAngle)
    }
    else if (mode == 'goFwd') {
        var rotated1 = rotatePoint(playerX-x1,playerY+y1,playerX,playerY,playerAngle)
        var rotated2 = rotatePoint(playerX-x1,playerY+y1+10,playerX,playerY,playerAngle)
        var rotated3 = rotatePoint(playerX+x2,playerY+y2,playerX,playerY,playerAngle)
        var rotated4 = rotatePoint(playerX+x2,playerY+y2+10,playerX,playerY,playerAngle)
    }
    else if (mode == 'goBwd') {
        var rotated1 = rotatePoint(playerX-x1,playerY-y1,playerX,playerY,playerAngle)
        var rotated2 = rotatePoint(playerX-x1,playerY-(y1+10),playerX,playerY,playerAngle)
        var rotated3 = rotatePoint(playerX+x2,playerY-y2,playerX,playerY,playerAngle)
        var rotated4 = rotatePoint(playerX+x2,playerY-(y2+10),playerX,playerY,playerAngle)
    }
    
    if (mode != 'goFwd') {
        projectiles.push(new Projectile(projectileSize,projectileSize,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'friendly','particleS',3,5,movementVector,0,0,0,0))
        projectiles.push(new Projectile(projectileSize,projectileSize,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'friendly','particleS',3,5,movementVector,0,0,0,0))
    }
    else {
        projectiles.push(new Projectile(projectileSize,projectileSize,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'friendly','particleL',3,5,movementVector,0,0,0,0))
        projectiles.push(new Projectile(projectileSize,projectileSize,rotated3.x,rotated3.y,rotated4.x,rotated4.y,'friendly','particleL',3,5,movementVector,0,0,0,0))
    }
}

function fire() {
    weapons.forEach(gun => {
        if (gun.currCool <= 0) {
            if (gun.isTurret == false) {
                var source = rotatePoint(gun.x,gun.y,playerX,playerY,playerAngle)
                var target = rotatePoint(gun.x,gun.y-100,playerX,playerY,playerAngle)
            }
            else {
                var point1 = rotatePoint(gun.x,gun.y,playerX,playerY,playerAngle)
                var source = rotatePoint(point1.x,point1.y-15,point1.x,point1.y,gun.angle)
                
                if (gun.isPlayer == true) {
                    var target = {x:(mousePosX*zoomOffset)+camera.x,y:(mousePosY*zoomOffset)+camera.y}
                }
                else {
                    var target = {x:playerX,y:playerY}
                }
            }
            if (gun.isPlayer == true) {
                if (gun.type == 'sg') {
                    for (var shot = 0; shot < 7; shot++) {
                        projectiles.push(new Projectile(3,3,source.x,source.y,target.x,target.y,'friendly',gun.type,gun.projAccuracy,gun.projSpeed,movementVector,gun.projCritRate,gun.projCritDmg,gun.projDmgMin,gun.projDmgMax))
                    }
                }
                else if (gun.type == 'mg' || gun.type == 'lsr') {
                    projectiles.push(new Projectile(3,3,source.x,source.y,target.x,target.y,'friendly',gun.type,gun.projAccuracy,gun.projSpeed,movementVector,gun.projCritRate,gun.projCritDmg,gun.projDmgMin,gun.projDmgMax))
                }
                else if (gun.type == 'cnn' || gun.type == 'rlg') {
                    projectiles.push(new Projectile(5,15,source.x,source.y,target.x,target.y,'friendly',gun.type,gun.projAccuracy,gun.projSpeed,movementVector,gun.projCritRate,gun.projCritDmg,gun.projDmgMin,gun.projDmgMax))
                }
                
            }
            else {
                projectiles.push(/* something */)
            }
            gun.currCool = gun.fireCooldown;
        }
    })
}

class mine {
    constructor(x,y,type,size) {
        this.x = x
        this.y = y
        this.centerX = this.x + this.size / 2
        this.centerY = this.y + this.size / 2
        switch (size) {
            case 'tiny':
                this.size = 50
                this.damage = 30
                this.radius = 100
            break
            case 'small':
                this.size = 75
                this.damage = 50
                this.radius = 125
            break
            case 'medium':
                this.size = 100
                this.damage = 70
                this.radius = 150
            break
            case 'large':
                this.size = 125
                this.damage = 90
                this.radius = 175
            break
            case 'huge':
                this.size = 150
                this.damage = 110
                this.radius = 200
            break
        }
        this.type = type
        this.angle = 0
        this.rotation = ((Math.random() * 1) - 0.5) * Math.PI / 180
        this.points = [
            {x:this.x+this.size/3,y:this.y},
            {x:this.x+(this.size/3)*2,y:this.y},
            {x:this.x+this.size,y:this.y+this.size/3},
            {x:this.x+this.size,y:this.y+(this.size/3)*2},
            {x:this.x+(this.size/3)*2,y:this.y+this.size},
            {x:this.x+this.size/3,y:this.y+this.size},
            {x:this.x,y:this.y+(this.size/3)*2},
            {x:this.x,y:this.y+this.size/3}
        ]
        this.update = function() {
            this.centerX = this.x + this.size / 2
            this.centerY = this.y + this.size / 2
            ctx.fillStyle = 'darkslategray'
            this.angle += this.rotation; ctx.save();
            ctx.translate(-camera.x+this.centerX,-camera.y+this.centerY)
            ctx.rotate(this.angle); 
            ctx.translate(-(-camera.x+this.centerX),-(-camera.y+this.centerY))
            ctx.beginPath(); ctx.moveTo(-camera.x+this.x+this.size/3,-camera.y+this.y)
            ctx.lineTo(-camera.x+this.x+(this.size/3)*2,-camera.y+this.y)
            ctx.lineTo(-camera.x+this.x+this.size,-camera.y+this.y+this.size/3)
            ctx.lineTo(-camera.x+this.x+this.size,-camera.y+this.y+(this.size/3)*2)
            ctx.lineTo(-camera.x+this.x+(this.size/3)*2,-camera.y+this.y+this.size)
            ctx.lineTo(-camera.x+this.x+this.size/3,-camera.y+this.y+this.size)
            ctx.lineTo(-camera.x+this.x,-camera.y+this.y+(this.size/3)*2)
            ctx.lineTo(-camera.x+this.x,-camera.y+this.y+this.size/3)
            ctx.closePath(); ctx.fill(); ctx.restore()
        }
    }
}

class pickup {
    constructor(x, y, width, height, color, type, amount) {
        this.x = x
        this.y = y
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.width = width
        this.height = height
        this.type = type
        this.amount = amount
        this.update = function() {
            ctx.fillStyle = color
            this.centerX = this.x + this.width / 2
            this.centerY = this.y + this.height / 2
            ctx.fillRect(-camera.x + this.x, -camera.y + this.y, this.width, this.height)
        }
    }
}

class weapon {
    constructor(type,tier,level,fireCooldown,isTurret,isPlayer,accuracy, speed, critRate, critDmg, damageMin, damageMax) {
        this.x = 0
        this.y = 0
        this.type = type
        this.tier = tier
        this.level = level
        this.slot = null
        this.fireCooldown = fireCooldown
        this.currCool = 0
        this.angle = 0
        this.isTurret = isTurret
        this.isPlayer = isPlayer
        this.projAccuracy = accuracy
        this.projSpeed = speed
        this.projCritRate = critRate
        this.projCritDmg = critDmg
        this.projDmgMin = damageMin
        this.projDmgMax = damageMax

        this.update = function() {
            if (isPlayer == true) {
                var point1 = rotatePoint(this.x,this.y,playerX,playerY,playerAngle)
                this.angle = Math.atan2((mousePosY*zoomOffset)+camera.y - point1.y, (mousePosX*zoomOffset)+camera.x - point1.x)*(180 / Math.PI)+90
                //console.log(this.angle)
            }
            else {
                this.angle = Math.atan2(playerY - this.y, playerX - this.x)*(180 / Math.PI)
            }
        }
    }
}

class Projectile {
    constructor(width, height, x, y, targetX, targetY, fof, type, accuracy, speed, shipSpeed, critRate, critDmg, damageMin, damageMax) {
        this.fof = fof
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
        this.critRand = Math.random() * 100
        this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * accuracy) - accuracy) * Math.PI / 180
        if (this.type != 'lsr') {
            this.dx = Math.cos(this.angle) * speed + shipSpeed[0]
            this.dy = Math.sin(this.angle) * speed + shipSpeed[1]
        }
        else {
            this.dx = Math.cos(this.angle)
            this.dy = Math.sin(this.angle)
            this.startPoint = {x:this.x,y:this.y}
            this.endPoint = {x:this.x+this.dx*1100,y:this.y+this.dy*1100}
            this.hits = []
            this.path = new Path2D()
            this.path.moveTo(-camera.x+this.x,-camera.y+this.y);
            this.path.lineTo(-camera.x+this.x+this.dx*1100,-camera.y+this.y+this.dy*1100);
        }
        this.lifeTime = 0
        if (this.type == 'particleS' || this.type == 'particleL') {
            this.lifeTimeRand = Math.random()
        }

        this.damage = Math.floor((Math.random() * (damageMax - damageMin + 1)) + damageMin)
        
        
        if (this.critRand < this.critRate) {this.damage *= critDmg; /*console.log('crit damage: ' + this.damage)*/}

        this.update = function(path) {
            this.lifeTime += 0.02
            if (this.type != 'lsr') {
                this.x += this.dx
                this.y += this.dy
                this.centerX = this.x + this.width / 2
                this.centerY = this.y + this.height / 2

                if (this.width == this.height) {
                    ctx.fillRect(-camera.x+this.x, -camera.y+this.y, this.width, this.height)
                }
                else {
                    ctx.save(); ctx.translate(-camera.x+this.centerX,-camera.y+this.centerY)
                    ctx.rotate(this.angle - 1.570796); ctx.translate(-(-camera.x+this.centerX),-(-camera.y+this.centerY))
                    ctx.fillRect(-camera.x+this.x, -camera.y+this.y, this.width, this.height); ctx.restore()
                }
                
            }
            else {
                ctx.lineWidth = 2; ctx.strokeStyle = 'red';
                if (path == false) {
                    ctx.beginPath()
                    ctx.moveTo(-camera.x+this.x,-camera.y+this.y);
                    ctx.lineTo(-camera.x+this.endPoint.x,-camera.y+this.endPoint.y);
                    ctx.stroke()
                }
                else {ctx.stroke(this.path)}
            }
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
    ctx.scale(zoomLevel,zoomLevel)
    camera.width = 700 * zoomOffset
    camera.height = 450 * zoomOffset
    camera.deadzoneWidth = 350 * zoomOffset
    camera.deadzoneHeight = 225 * zoomOffset
    
    
    ctx.fillStyle = 'rgb(66,66,66)'; ctx.fillRect(0,0,totW * zoomOffset,totH * zoomOffset)
    ctx.beginPath(); ctx.strokeStyle = 'rgb(76, 76, 76)';       
    ctx.lineWidth = 5;
    
    //grid with only visible lines
    const startX = Math.floor(camera.x / 60) * 60; // Start at the nearest 60px grid line
    const startY = Math.floor(camera.y / 60) * 60;
    const endX = camera.x + camera.width; // End at the visible section's boundary
    const endY = camera.y + camera.height;
    
    // Draw horizontal grid lines
    for (let y = startY; y <= endY; y += 60) {
        ctx.moveTo(-camera.x, y - camera.y);
        ctx.lineTo(worldWidth, y - camera.y);
    }
    
    // Draw vertical grid lines
    for (let x = startX; x <= endX; x += 60) {
        ctx.moveTo(x - camera.x, -camera.y);
        ctx.lineTo(x - camera.x, worldHeight);
    }

    ctx.stroke(); ctx.strokeStyle = 'red';
    ctx.strokeRect(-camera.x+60,-camera.y+60,worldWidth-120,worldHeight-120)

    //waypoints
    if (waypoint.x != 0 && waypoint.y != 0) {
        ctx.lineWidth = 5; ctx.strokeStyle = 'green'; ctx.beginPath();
        ctx.arc(-camera.x + waypoint.x,-camera.y + waypoint.y,120,0,7);
        ctx.stroke()
    }

    if (keysPressed && keysPressed['IntlBackslash'] && gameState != states.escaping && canSwitchShip == true) {
        canSwitchShip = false; setTimeout(function() {canSwitchShip = true},500)
        if (spriteSelection == 2) {
            spriteSelection = 1
            playerMaxSpeed = fighterMaxSpeed
            playerTurnSpeed = fighterTurnSpeed
            maxHealth = fighterMaxHealth
            equipmentSlotsPos = fighterSlotsPos
            equipmentSlotsTierAndTurret = fighterTierAndTurret
            equipmentSlots = fighterSlots
        }
        else if (spriteSelection == 1) {
            spriteSelection = 2
            playerMaxSpeed = corvetteMaxSpeed
            playerTurnSpeed = corvetteTurnSpeed
            maxHealth = corvetteMaxHealth
            equipmentSlotsPos = corvSlotsPos
            equipmentSlotsTierAndTurret = corvTierAndTurret
            equipmentSlots = corvetteSlots
        }
    }
    
    if (keysPressed && keysPressed['Tab'] && canOpenInv == true && gameState != states.escaping) {
        canOpenInv = false; setTimeout(() => {canOpenInv = true},500)
        if (gameState != states.inventory) {
            gameState = states.inventory; console.log('inventory open')
        }
        else {
            gameState = states.main; console.log('inventory closed')
        }
    }

    if (keysPressed && keysPressed['KeyM'] && canOpenMap == true && gameState != states.escaping) {
        canOpenMap = false; setTimeout(() => {canOpenMap = true},500)
        if (gameState != states.map) {
            skillPointsAdding = false;
            gameState = states.map; console.log('map open')
        }
        else {
            gameState = states.main; console.log('map closed')
        }
    }

    //levelling up
    if (xp >= xpRequired && gameState != states.escaping) { 
        xp -= xpRequired; skillPoints += spAmounts[level];
        displayLevelUpMessage = 3; level++
        xpRequired = xpReqs[level];
    }

    //turning
    if (keysPressed && (keysPressed['KeyA'] || keysPressed['ArrowLeft']) && gameState != states.inventory) {
        playerAngle -= playerTurnSpeed;
        //console.log(playerAngle)
        if (playerSprite == escapePod) {
            steeringParticles('turnLeft',4,13,3,13,1)
        }
        else if (playerSprite == fighter) {
            steeringParticles('turnLeft',10,20,10,25,2)
        }
        else if (playerSprite == corvette) {
            steeringParticles('turnLeft',17,50,17,30,3)
        }
    }
    else if (keysPressed && (keysPressed['KeyD'] || keysPressed['ArrowRight']) && gameState != states.inventory) {
        playerAngle += playerTurnSpeed
        //console.log(playerAngle)
        if (playerSprite == escapePod) {
            steeringParticles('turnRight',4,13,3,13,1)
        }
        else if (playerSprite == fighter) {
            steeringParticles('turnRight',10,20,10,25,2)
        }
        else if (playerSprite == corvette) {
            steeringParticles('turnRight',17,50,17,30,3)
        }
    }

    //strafing
    if (keysPressed && keysPressed['KeyQ'] && gameState != states.inventory) {
        playerSpeed = playerMaxSpeed/2
        inputVector = [playerSpeed * Math.cos((playerAngle+180) * Math.PI / 180),playerSpeed * Math.sin((playerAngle+180) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == escapePod) {
            steeringParticles('strafeLeft',4,13,3,13,1)
        }
        else if (playerSprite == fighter) {
            steeringParticles('strafeLeft',10,20,10,25,2)
        }
        else if (playerSprite == corvette) {
            steeringParticles('strafeLeft',17,50,17,30,3)
        }
    }
    else if (keysPressed && keysPressed['KeyE'] && gameState != states.inventory) {
        playerSpeed = playerMaxSpeed/2
        inputVector = [playerSpeed * Math.cos((playerAngle) * Math.PI / 180),playerSpeed * Math.sin((playerAngle) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == escapePod) {
            steeringParticles('strafeRight',4,13,3,13,1)
        }
        else if (playerSprite == fighter) {
            steeringParticles('strafeRight',10,20,10,25,2)
        }
        else if (playerSprite == corvette) {
            steeringParticles('strafeRight',17,50,17,30,3)
        }
    }

    //go forwards / backwards
    if (keysPressed && (keysPressed['KeyW'] || keysPressed['ArrowUp']) && gameState != states.inventory) {
        playerSpeed = playerMaxSpeed
        inputVector = [playerSpeed * Math.cos((playerAngle-90) * Math.PI / 180),playerSpeed * Math.sin((playerAngle-90) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == escapePod) {
            var rotated1 = rotatePoint(playerX,playerY+18,playerX,playerY,playerAngle)
            var rotated2 = rotatePoint(playerX,playerY+28,playerX,playerY,playerAngle)

            projectiles.push(new Projectile(2,2,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'friendly','particleL',3,5,movementVector,0,0,0,0))
        }
        else if (playerSprite == fighter) {
            steeringParticles('goFwd',7,47,7,47,3)
        }
        else if (playerSprite == corvette) {
            steeringParticles('goFwd',27,60,27,60,4)
        }
    }
    else if (keysPressed && (keysPressed['KeyS'] || keysPressed['ArrowDown']) && gameState != states.inventory) {
        playerSpeed = playerMaxSpeed/2
        inputVector = [playerSpeed * Math.cos((playerAngle+90) * Math.PI / 180),playerSpeed * Math.sin((playerAngle+90) * Math.PI / 180)]
        movementVector[0] += inputVector[0]
        movementVector[1] += inputVector[1]
        if (playerSprite == escapePod) {
            var rotated1 = rotatePoint(playerX,playerY-18,playerX,playerY,playerAngle)
            var rotated2 = rotatePoint(playerX,playerY-28,playerX,playerY,playerAngle)

            projectiles.push(new Projectile(1,1,rotated1.x,rotated1.y,rotated2.x,rotated2.y,'friendly','particleS',3,5,movementVector,0,0,0,0))
        }
        else if (playerSprite == fighter) {
            steeringParticles('goBwd',6,40,6,40,2)
        }
        else if (playerSprite == corvette) {
            steeringParticles('goBwd',12,65,12,65,3)
        }
    }
    
    if (keysPressed && keysPressed['KeyR'] && gameState != states.inventory) {
        if (movementVector[0] > 0) {
            if (movementVector[0] < 0.05) {
                movementVector[0] = 0
            }
            else {movementVector[0] -= 0.1}
        }
        else if (movementVector[0] < 0) {
            if (movementVector[0] > -0.05) {
                movementVector[0] = 0
            }
            else {movementVector[0] += 0.1}
        }
        
        if (movementVector[1] > 0) {
            if (movementVector[1] < 0.05) {
                movementVector[1] = 0
            }
            else {movementVector[1] -= 0.1}
        }
        else if (movementVector[1] < 0) {
            if (movementVector[1] > -0.05) {
                movementVector[1] = 0
            }
            else {movementVector[1] += 0.1}
        }
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
    ctx.strokeStyle = 'red'; ctx.lineWidth = 5
    /* ctx.strokeRect(camera.deadzoneWidth / 2,camera.deadzoneHeight / 2,camera.width - camera.deadzoneWidth,camera.height - camera.deadzoneHeight)
    ctx.strokeRect(-camera.x + camera.x,-camera.y + camera.y,camera.width,camera.height) */

    weapons.forEach(gun => {
        if (gun.currCool > 0) {
            gun.currCool -= 0.02;
        }
        gun.x += movementVector[0];
        gun.y += movementVector[1]
    })
    
    if (playerX > waypoint.x -120 && playerX < waypoint.x + 120 && playerY > waypoint.y - 120 && playerY < waypoint.y + 120) {
        waypointTimer -= 0.02;
        if (waypointTimer < 0) {waypoint.x = 0; waypoint.y = 0}
    }
    else if (waypointTimer < 2) {waypointTimer = 2}

    //respawn and draw asteroids
    asteroidFields.forEach((field,index) => {
        if (field.currentAsteroids < field.limitOfAsteroids) {
            field.respawnTime -= 0.02;
            if (field.respawnTime <= 0) {
                field.respawnTime = 30;
                field.currentAsteroids++
                var sides = Math.floor(Math.random() * 10 + 5);
                var asteroid = [];
                var radius = Math.random() * (100-25) + 25;
                var astX = Math.random() * ((field.x + field.width) - field.x) + field.x 
                var astY = Math.random() * ((field.y + field.height)- field.y) + field.y
                var xSpeed = Math.random() * 2 - 1;
                var ySpeed = Math.random() * 2 - 1;
                var rotation = Math.random() * 4 -2;
                var health = Math.floor((radius - 25) / 100 * (100 - 25) + 25)
                var experience = Math.floor((health - 25) / 100 * (20 - 5) + 5)

                for (var s = 0; s < sides; s++) {
                    var angle = (Math.PI * 2 / sides) * s;
                    var pointX = astX + Math.cos(angle) * (radius + Math.random() * 25 - 12);
                    var pointY = astY + Math.sin(angle) * (radius + Math.random() * 25 - 12);
                    asteroid.push({ x: pointX, y: pointY });
                }
        
                asteroid.push({xPos:astX, yPos:astY, dx:xSpeed, dy:ySpeed, rot:rotation, angle:0, radius:radius, hp:health, origHp:health, field:index, xp:experience})

                asteroids.push(asteroid)
            }
        }
        if (-camera.x + field.x + field.width > 0 && -camera.x + field.x < camera.width && -camera.y + field.y + field.height > 0 && -camera.y + field.y < camera.height) {
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
                    ctx.fillStyle = 'red'
                    ctx.fillText(last.hp,-camera.x + last.xPos,-camera.y + last.yPos+3)
                    if (last.hp < last.origHp) {
                        var healthPc = last.hp / last.origHp
                        ctx.fillStyle = 'white'
                        ctx.fillRect(-camera.x + last.xPos - 50 * healthPc,-camera.y + last.yPos + last.radius + 5,100 * healthPc,5)
                    }
                }
            })
        }
    })


    enemies.forEach((enemy,index) => {
        if (playerX > enemy.x - 2000 && playerX < enemy.x + 2000 && playerY > enemy.y - 2000 && playerY < enemy.y + 2000) {
            enemy.update()
            if (enemy instanceof mine) {
                if (enemy.type == 'impact') {
                    enemy.points.forEach((point) => {
                        ctx.fillStyle = 'green'
                        ctx.fillRect(-camera.x+point.x,-camera.y+point.y,3,3)
                        var rotateAroundMineCenter = rotatePoint(point.x,point.y,enemy.centerX,enemy.centerY,enemy.angle)
                        ctx.fillStyle = 'red'
                        ctx.fillRect(-camera.x+rotateAroundMineCenter.x,-camera.y+rotateAroundMineCenter.y,3,3)
                        var thenRotateAroundPlayerPos = rotatePoint(rotateAroundMineCenter.x,rotateAroundMineCenter.y,playerX,playerY,-playerAngle)
                        ctx.fillStyle = 'chartreuse'
                        ctx.fillRect(-camera.x+thenRotateAroundPlayerPos.x,-camera.y+thenRotateAroundPlayerPos.y,3,3)
                        playerSprite.forEach(path => {
                            if (ctx.isPointInPath(path,(-camera.x+thenRotateAroundPlayerPos.x)/zoomOffset,(-camera.y+thenRotateAroundPlayerPos.y)/zoomOffset)) {
                                movementVector[0] = -movementVector[0] / 2
                                movementVector[1] = -movementVector[1] / 2
                                playerX += movementVector[0] * 42;
                                playerY += movementVector[1] * 42;
                                weapons.forEach(gun => {gun.x += movementVector[0] * 42; gun.y += movementVector[1] * 42})
                                damageNumbers.unshift({type:'damage',x:playerX+(Math.random()*100 - 50) - camera.x,y:playerY+(Math.random()*100 - 50) - camera.y,amount:enemy.damage,lifetime:1})
                                enemies.splice(index,1)
                                blastDamage(enemy.centerX,enemy.centerY,enemy.damage,enemy.radius)
                                explosions.push({x:enemy.centerX,y:enemy.centerY,radius:enemy.radius,currRadius:0})
                            }
                        })
                    })
                }
            }
        }
        
    })



    //draw wrecked version of ship
    if (-camera.x + deathLocation.x > 0 && -camera.x + deathLocation.x < camera.width && -camera.y + deathLocation.y > 0 && -camera.y + deathLocation.y < camera.height) {
        if (deathLocation.x != 0 && deathLocation.y != 0) {
            ctx.save();
            ctx.translate(-camera.x + deathLocation.x, -camera.y + deathLocation.y); 
            ctx.rotate(deathLocation.angle * Math.PI / 180);
            deathLocation.angle += 0.1
            ctx.translate(-(-camera.x + deathLocation.x), -(-camera.y + deathLocation.y)); 
            ctx.strokeStyle = 'rgb(82,82,82)'; 
            ctx.fillStyle = 'rgb(26,26,26)';
            ctx.lineWidth = 2
            
            if (deathLocation.ship == 1) {updateFighterSprite(-camera.x+deathLocation.x,-camera.y+deathLocation.y); playerSprite = fighter}
            else if (deathLocation.ship == 2) {updateCorvetteSprite(-camera.x+deathLocation.x,-camera.y+deathLocation.y); playerSprite = corvette}

            playerSprite.forEach((path,index) => {
            if (index == playerSprite.length-1) {
                ctx.fillStyle = 'rgb(46,54,150)';
                ctx.fill(path)
            }
            else {
                ctx.fill(path); ctx.stroke(path)
            }
            })
            ctx.restore();
        }
    }

    //draw fixed guns
    if (gameState != states.escaping) {
        weapons.forEach(gun => {
            if (gun.isTurret == false) {
                if (gun.tier == 1) {
                    ctx.beginPath()
                    ctx.strokeStyle = shipStroke;
                    ctx.lineWidth = 3;
                    var point1 = rotatePoint(gun.x,gun.y,playerX,playerY,playerAngle)
                    var point2 = rotatePoint(gun.x,gun.y+30,playerX,playerY,playerAngle)
                    ctx.moveTo(-camera.x+point1.x,-camera.y+point1.y)
                    ctx.lineTo(-camera.x+point2.x,-camera.y+point2.y)
                    ctx.stroke()
                }
                else if (gun.tier == 2) {
                    ctx.beginPath()
                    ctx.strokeStyle = shipStroke;
                    ctx.lineWidth = 6;
                    var point1 = rotatePoint(gun.x,gun.y,playerX,playerY,playerAngle)
                    var point2 = rotatePoint(gun.x,gun.y+50,playerX,playerY,playerAngle)
                    ctx.moveTo(-camera.x+point1.x,-camera.y+point1.y)
                    ctx.lineTo(-camera.x+point2.x,-camera.y+point2.y)
                    ctx.stroke()
                }
            }
        })
    }
    

    //draw player
    ctx.save();
    ctx.translate(playerX-camera.x,playerY-camera.y); 
    ctx.rotate(playerAngle * Math.PI / 180); 
    ctx.translate(-(playerX-camera.x), -(playerY-camera.y)); 
    ctx.strokeStyle = shipStroke; 
    ctx.fillStyle = shipFill
    ctx.lineWidth = 2
    
    if (gameState == states.escaping) {updateEscapepodSprite(playerX-camera.x,playerY-camera.y); playerSprite = escapePod}
    else if (spriteSelection == 1) {updateFighterSprite(playerX-camera.x,playerY-camera.y); playerSprite = fighter}
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
    
    //draw turrets
    if (gameState != states.escaping) {
        weapons.forEach(turret => {
            if (turret.isTurret == true) {
                ctx.beginPath()
                ctx.strokeStyle = shipStroke;
                ctx.fillStyle = shipFill;
                ctx.lineWidth = 3;
                turret.update()
                var point1 = rotatePoint(turret.x,turret.y,playerX,playerY,playerAngle)
                var point2 = rotatePoint(point1.x,point1.y-15,point1.x,point1.y,turret.angle)
                ctx.moveTo(-camera.x+point1.x,-camera.y+point1.y)
                ctx.lineTo(-camera.x+point2.x,-camera.y+point2.y)
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(-camera.x+point1.x,-camera.y+point1.y,5,0,69)
                ctx.fill(); ctx.stroke()
            }
        })
    }

    //new collision detection
    if (playerX < -camera.x + 2000 || playerX > worldWidth - 2000 || playerY < -camera.y + 2000 || playerY > worldHeight - 2000) {
        console.log('colission detection running'); ctx.fillStyle = 'blue'
        playerSprite.forEach(path => {
            for (var xy = -100; xy < 100; xy += 10) {
                var rot1 = rotatePoint((-camera.x + worldWidth - 60)/zoomOffset,(-camera.y + playerY + xy)/zoomOffset, (-camera.x + playerX)/zoomOffset,(-camera.y + playerY)/zoomOffset,-playerAngle)
                ctx.fillRect(-camera.x + worldWidth - 60,-camera.y + playerY + xy,2,2)
                ctx.fillRect(rot1.x,rot1.y,2,2)
            
                var rot2 = rotatePoint((-camera.x + 60)/zoomOffset,(-camera.y + playerY + xy)/zoomOffset,(-camera.x + playerX)/zoomOffset,(-camera.y + playerY)/zoomOffset,-playerAngle)
                ctx.fillRect((-camera.x + 60)/zoomOffset,(-camera.y + playerY + xy)/zoomOffset,2,2)
                ctx.fillRect(rot2.x,rot2.y,2,2)
            
                if (ctx.isPointInPath(path,rot1.x,rot1.y)) {
                    playerX -= 200; movementVector[0] = -3
                    weapons.forEach(gun => {gun.x -= 200})
                }
                else if (ctx.isPointInPath(path,rot2.x,rot2.y)) {
                    playerX += 200; movementVector[0] = 3
                    weapons.forEach(gun => {gun.x += 200})
                }

                var rot3 = rotatePoint((-camera.x + playerX + xy)/zoomOffset,(-camera.y + worldHeight - 60)/zoomOffset,(-camera.x + playerX)/zoomOffset,(-camera.y + playerY)/zoomOffset,playerAngle)
                ctx.fillRect((-camera.x + playerX + xy)/zoomOffset,(-camera.y + worldHeight - 60)/zoomOffset,2,2)
                ctx.fillRect(rot3.x,rot3.y,2,2)

                var rot4 = rotatePoint((-camera.x + playerX + xy)/zoomOffset,(-camera.y + 60)/zoomOffset,(-camera.x + playerX)/zoomOffset,(-camera.y + playerY)/zoomOffset,playerAngle)
                ctx.fillRect((-camera.x + playerX + xy)/zoomOffset,(-camera.y + 60)/zoomOffset,2,2)
                ctx.fillRect(rot4.x,rot4.y,2,2)

                if (ctx.isPointInPath(path,rot3.x,rot3.y)) {
                    playerY -= 200; movementVector[1] = -3
                    weapons.forEach(gun => {gun.y -= 200})
                }
                else if (ctx.isPointInPath(path,rot4.x,rot4.y)) {
                    playerY += 200; movementVector[1] = 3
                    weapons.forEach(gun => {gun.y += 200})
                }
            }
        })
    }
    //ctx.fillStyle = 'red'; ctx.fillRect(playerX-camera.x-1,playerY-camera.y-1,2,2)//center of player

    //pickups
    for (var i = 0; i < pickups.length; i++) {
        pickups[i].update()
        if (playerX > pickups[i].centerX - 150 && playerX < pickups[i].centerX + 150 && playerY > pickups[i].centerY - 150 && playerY < pickups[i].centerY + 150) {
            if (pickups[i].type != 'mineral' && pickups[i].type != 'item') {
                if (playerX < pickups[i].x) {pickups[i].x -= 4}
                else if (playerX > pickups[i].x) {pickups[i].x += 4}
                
                if (playerY < pickups[i].y) {pickups[i].y -= 4}
                else if (playerY > pickups[i].y) {pickups[i].y += 4}
            }
        }
        if (playerX > pickups[i].centerX - 100 && playerX < pickups[i].centerX + 100 && playerY > pickups[i].centerY - 100 && playerY < pickups[i].centerY + 100) {
            if (pickups[i].type == 'mineral') {
                if (playerX < pickups[i].x) {pickups[i].x -= 2.5}
                else if (playerX > pickups[i].x) {pickups[i].x += 2.5}
                
                if (playerY < pickups[i].y) {pickups[i].y -= 2.5}
                else if (playerY > pickups[i].y) {pickups[i].y += 2.5}
            }
        }
        if (playerX > pickups[i].centerX - 25 && playerX < pickups[i].centerX + 25 && playerY > pickups[i].centerY - 25 && playerY < pickups[i].centerY + 25) {
            if (pickups[i].type == 'xp') {
                xp += pickups[i].amount; console.log('gained '+pickups[i].amount+' xp');
                damageNumbers.unshift({type:'xp',x:playerX+(Math.random()*100-50) - camera.x,y:playerY+(Math.random()*100-50) - camera.y,amount:pickups[i].amount,lifetime:1})
            }
            else if (pickups[i].type == 'mineral') {
                var inventoryFull = false;
                Object.entries(inventoryContent).some(entry => {
                    if (entry[1] == null) {
                        inventoryContent[entry[0]] = pickups[i].amount;
                        console.log('picked up '+pickups[i].amount.type+' ×'+pickups[i].amount.amount+' into '+entry[0])
                        inventoryFull = false; return true
                    }
                    else if (!(entry[1] instanceof weapon) && entry[1].type == pickups[i].amount.type && entry[1].amount + pickups[i].amount.amount < 64) {
                        inventoryContent[entry[0]].amount += pickups[i].amount.amount;
                        console.log('added '+pickups[i].amount.type+' ×'+pickups[i].amount.amount+' to '+entry[0])
                        inventoryFull = false; return true
                    }
                    else if (!(entry[1] instanceof weapon) && entry[1].type == pickups[i].amount.type && entry[1].amount + pickups[i].amount.amount >= 64 && entry[1].amount < 64) {
                        inventoryContent[entry[0]].amount = 64
                        console.log('filled '+entry[0]+' with '+pickups[i].amount.type)
                        inventoryFull = false; return true
                    }
                    else {
                        console.log(entry[0]+' full'); inventoryFull = true; return false
                    }
                })
                if (inventoryFull == true) {
                    damageNumbers.unshift({type:'inventory full',x:playerX+(Math.random()*100-50) - camera.x,y:playerY+(Math.random()*100-50) - camera.y,amount:'inventory full',lifetime:1})
                }
                else {
                    damageNumbers.unshift({type:'mineral',x:playerX+(Math.random()*100-50) - camera.x,y:playerY+(Math.random()*100-50) - camera.y,amount:pickups[i].amount,lifetime:1})
                }
            }
            else if (pickups[i].type == 'health') {
                if (health < maxHealth && healedHealth < maxHealth - health) {
                    healedHealth += pickups[i].amount;
                }
            }
            else if (pickups[i].type == 'credits') {
                credits += pickups[i].amount; console.log('gained '+pickups[i].amount+' credits');
                damageNumbers.unshift({type:'credits',x:playerX+(Math.random()*100 - 50) - camera.x,y:playerY+(Math.random()*100 - 50) - camera.y,amount:pickups[i].amount,lifetime:1})
            }
            
            if (pickups[i].type != 'item') {
                pickups.splice(i,1);
                i--
            }
            else {
                pickups[i].amount.x = pickups[i].x
                pickups[i].amount.y = pickups[i].y
                pickupTarget = pickups[i].amount
                if (keysPressed && keysPressed['KeyG']) {
                    var inventoryFull = false;
                    Object.entries(inventoryContent).some(entry => {
                        if (entry[1] == null) {
                            inventoryContent[entry[0]] = pickups[i].amount;
                            console.log('picked up'+pickups[i].amount+'into '+entry[0])
                            pickups.splice(i,1); i--; pickupTarget = null
                            inventoryFull = false; return true
                        }
                        else {
                            console.log(entry[0]+' full'); inventoryFull = true; return false
                        }
                        
                    })
                    if (inventoryFull == true) {
                        damageNumbers.unshift({type:'inventory full',x:playerX+(Math.random()*100-50) - camera.x,y:playerY+(Math.random()*100-50) - camera.y,amount:'inventory full',lifetime:1})
                    }
                }
            }
        }
    }


    projectiles.forEach((pro,index) => {
        var drawPath = true
        if (pro.type == 'particleS') {
            ctx.fillStyle = 'white'
            if (pro.lifeTime > 0.5 + pro.lifeTimeRand) {projectiles.splice(index,1)}
        }
        else if (pro.type == 'particleL') {
            ctx.fillStyle = 'blue'
            if (pro.lifeTime > 0.5 + pro.lifeTimeRand) {projectiles.splice(index,1)}
        }
        else {
            if (pro.type != 'lsr') {
                if (pro.critRand < pro.critRate) { ctx.fillStyle = 'red'} 
                else { ctx.fillStyle = 'gold'}
                if (pro.lifeTime > 10) {projectiles.splice(index,1)}
            }
            
            if (pro.fof == 'friendly') {
                //shooting asteroids
                asteroidFields.forEach((field,fIndex) => {
                    if (-camera.x + field.x + field.width > 0 && -camera.x + field.x < camera.width && -camera.y + field.y + field.height > 0 && -camera.y + field.y < camera.height) {    
                        asteroids.forEach((roid,roidIndex) => {
                            var last = roid[roid.length - 1];
                            if (last.field == fIndex) {
                                if (pro.type != 'lsr' && pro.x > last.xPos - last.radius && pro.x < last.xPos + last.radius 
                                && pro.y > last.yPos - last.radius && pro.y < last.yPos + last.radius)
                                {
                                    if (pro.type != 'rlg') {
                                        last.hp -= pro.damage
                                        damageNumbers.unshift({type:'damage',x:last.xPos+(Math.random()*100 - 50) - camera.x,y:last.yPos+(Math.random()*100 - 50) - camera.y,amount:pro.damage,lifetime:1})
                                    }
                                    else {
                                        //railgun logic
                                        if (pro.damage <= last.hp) {
                                            last.hp -= pro.damage
                                            damageNumbers.unshift({type:'damage',x:last.xPos+(Math.random()*100 - 50) - camera.x,y:last.yPos+(Math.random()*100 - 50) - camera.y,amount:pro.damage,lifetime:1})
                                            projectiles.splice(index,1)
                                        }
                                        else {
                                            pro.damage -= last.hp
                                            damageNumbers.unshift({type:'damage',x:last.xPos+(Math.random()*100 - 50) - camera.x,y:last.yPos+(Math.random()*100 - 50) - camera.y,amount:last.hp,lifetime:1})
                                            last.hp = 0
                                        }
                                    }
                                    
                                    if (pro.type == 'cnn') {
                                        blastDamage(pro.x,pro.y,pro.damage,150);
                                        explosions.push({x:pro.x,y:pro.y,radius:150,currRadius:0})
                                    }
                                    
                                    if (pro.type != 'rlg') {projectiles.splice(index,1)}
                                    
                                    
                                    if (last.hp <= 0) {
                                        dropStuff('asteroid',last)
                                        asteroids.splice(roidIndex,1)
                                        field.currentAsteroids--
                                    }
                                }
                                else if (pro.type == 'lsr') {
                                    intersections = doesLineIntersectCircle(pro.startPoint.x,pro.startPoint.y,pro.endPoint.x,pro.endPoint.y,last.xPos,last.yPos,last.radius)
                                    if (intersections != null) {
                                        /* ctx.fillStyle = 'red';
                                        ctx.fillRect(-camera.x+intersections[0].x,-camera.y+intersections[0].y,5,5) */
                                        pro.hits.push({hit:intersections[0],roid:last,index:roidIndex,distance:NaN})
                                        drawPath = false
                                        /* if (intersections[1] != null) {
                                            ctx.fillRect(-camera.x+intersections[1].x,-camera.y+intersections[1].y,5,5)
                                        } */
                                    }
                                }
                            }
                        })
                        if (pro.type == 'lsr' && pro.hits.length > 0) {
                            pro.hits.forEach(hit => {
                                hit.distance = Math.hypot(pro.startPoint.x - hit.hit.x,pro.startPoint.y - hit.hit.y)
                            })
                            pro.hits.sort((a,b) => a.distance - b.distance)
                            pro.endPoint.x = pro.hits[0].hit.x
                            pro.endPoint.y = pro.hits[0].hit.y
                            ctx.fillStyle = 'orange';
                            ctx.fillRect(-camera.x+pro.hits[0].hit.x,-camera.y+pro.hits[0].hit.y,4,4)
                            pro.hits[0].roid.hp -= pro.damage
                            damageNumbers.unshift({type:'damage',x:pro.hits[0].roid.xPos+(Math.random()*100 - 50) - camera.x,y:pro.hits[0].roid.yPos+(Math.random()*100 - 50) - camera.y,amount:pro.damage,lifetime:1})
                            if (pro.hits[0].roid.hp <= 0) {
                                asteroids.splice(pro.hits[0].index,1)
                                field.currentAsteroids--
                                dropStuff('asteroid',pro.hits[0].roid)
                            } 
                        }
                    }
                })
            }
            else if (pro.fof = 'enemy') {
                //getting hit by enemies
                playerSprite.forEach(path => {
                    if (ctx.isPointInPath(path,pro.centerX,pro.centerY)) {
                        projectiles.splice(index,1)
                        if (shield > 0) {
                            shield -= pro.damage
                            damageNumbers.unshift({type:'shieldDamage',x:playerX+(Math.random()*100 - 50) - camera.x,y:playerY+(Math.random()*100 - 50) - camera.y,amount:pro.damage,lifetime:1})
                            shieldJustHit = true
                            console.log('shield absorbed '+pro.damage+' damage')
                        }
                        else {
                            health -= pro.damage
                            damageNumbers.unshift({type:'damage',x:playerX+(Math.random()*100 - 50) - camera.x,y:playerY+(Math.random()*100 - 50) - camera.y,amount:pro.damage,lifetime:1})
                            //console.log('ship received '+pro.damage+' damage')
                        }
                    }
                })
            }
        }
        pro.update(drawPath)
        if (pro.type == 'lsr') {projectiles.splice(index,1)}
    })
    

    //asteroid player collisions
    asteroidFields.forEach((field,fIndex) => {
        if (-camera.x + field.x + field.width > 0 && -camera.x + field.x < camera.width && -camera.y + field.y + field.height > 0 && -camera.y + field.y < camera.height) {
            asteroids.forEach((aroid,roidIndex) => {
                var last = aroid[aroid.length - 1];
                if (last.field == fIndex) {
                    var assPointX, assPointY
                    aroid.forEach((point,pIndex) => {
                        if (pIndex != aroid.length-1) {
                            assPointX = point.x;
                            assPointY = point.y;
                            var rotateAroundAsteroidCenter = rotatePoint(assPointX,assPointY,last.xPos,last.yPos,last.angle)
                            ctx.fillStyle = 'red'
                            ctx.fillRect(-camera.x+rotateAroundAsteroidCenter.x,-camera.y+rotateAroundAsteroidCenter.y,3,3)
                            var thenRotateAroundPlayerPos = rotatePoint(rotateAroundAsteroidCenter.x,rotateAroundAsteroidCenter.y,playerX,playerY,-playerAngle)
                            ctx.fillStyle = 'chartreuse'
                            ctx.fillRect(-camera.x+thenRotateAroundPlayerPos.x,-camera.y+thenRotateAroundPlayerPos.y,3,3)
                            playerSprite.forEach(path => {
                                if (ctx.isPointInPath(path,(-camera.x+thenRotateAroundPlayerPos.x)/zoomOffset,(-camera.y+thenRotateAroundPlayerPos.y)/zoomOffset)) {
                                    movementVector[0] = -movementVector[0] / 2
                                    movementVector[1] = -movementVector[1] / 2
                                    playerX += movementVector[0] * 42;
                                    playerY += movementVector[1] * 42;
                                    weapons.forEach(gun => {gun.x += movementVector[0] * 42; gun.y += movementVector[1] * 42})
                                    health -= 1; last.hp -= 1; //these numbers should change depending on the size of the asteroid and the size/strength of the ship. butt HOW?
                                    damageNumbers.unshift({type:'damage',x:last.xPos+(Math.random()*100 - 50) - camera.x,y:last.yPos+(Math.random()*100 - 50) - camera.y,amount:1,lifetime:1})
                                    damageNumbers.unshift({type:'damage',x:playerX+(Math.random()*100 - 50) - camera.x,y:playerY+(Math.random()*100 - 50) - camera.y,amount:1,lifetime:1})
                                    if (last.hp <= 0) {
                                        asteroids.splice(roidIndex,1)
                                        field.currentAsteroids--
                                        dropStuff('enemy',last)
                                    }
                                }
                            })
                        }
                    })
                }
            }) 
        }  
    })

    //repair logic
    if (healedHealth > 0 && health < maxHealth) {
        health += maxHealth/2000;
        healedHealth -= maxHealth/2000
        healingAccumulator++
        if (healingAccumulator > 50) {
            damageNumbers.unshift({type:'heal',x:playerX+(Math.random()*100 - 50) - camera.x,y:playerY+(Math.random()*100 - 50) - camera.y,amount:maxHealth*0.025,lifetime:1})
            healingAccumulator = 0
        }
    }

    //shield logic
    if (shieldTimeout > 0) {shieldTimeout -= 0.02; console.log(Math.floor(shieldTimeout))}
    if (shieldJustHit == true) {
        if (shield < 0)
        {
            shield = 0; shieldTimeout = 4
        }
        else {shieldTimeout = 4}
        shieldJustHit = false
    }
    if (!shieldJustHit && shieldTimeout <= 0 && shield < maxShield)
    {
        shield += maxShield/200
    }

    //explosions
    for (var x = 0; x < explosions.length; x++) {
        var xplode = explosions[x]
        xplode.currRadius += xplode.radius / 10
        ctx.globalAlpha = 1 - xplode.currRadius / xplode.radius
        ctx.strokeStyle = 'orange'; ctx.beginPath()
        ctx.arc(-camera.x+xplode.x,-camera.y+xplode.y,xplode.currRadius,0,69)
        ctx.stroke(); ctx.globalAlpha = 1
        if (xplode.currRadius >= xplode.radius) {
            explosions.splice(x,1); x--
        }
    }

    //damage(and other stuff) numbers
    ctx.font = '15px consolas';
    var prefix,suffix;
    for (var i = damageNumbers.length-1; i > -1; i--) {
        damageNumbers[i].y -= 1.5 + (Math.random() * 1.5 - 0.75)
        damageNumbers[i].lifetime -= 0.01;
        switch (damageNumbers[i].type) {
            case 'xp':
                ctx.fillStyle = 'yellow';
                prefix = '+';
                suffix = 'xp';
            break;
            case 'credits':
                ctx.fillStyle = 'gold';
                prefix = '+';
                suffix = 'cr';
            break;
            case 'damage':
                ctx.fillStyle = 'red';
                prefix = '-';
                suffix = 'hp';
            break;
            case 'shieldDamage':
                ctx.fillStyle = 'blue';
                prefix = '-';
                suffix = 'sp';
            break;
            case 'heal':
                ctx.fillStyle = 'rgb(39, 169, 52)';
                prefix = '+';
                suffix = 'hp';
            break;
            case 'mineral':
                ctx.fillStyle = 'gray';
                prefix = '+';
                suffix = ' ×'+damageNumbers[i].amount.amount
            break;
            case 'inventory full':
                ctx.fillStyle = 'red';
                prefix = '!';
                suffix = '!';
            break;
        }
        if (damageNumbers[i].lifetime > 0) {ctx.globalAlpha = damageNumbers[i].lifetime;}
        else {ctx.globalAlpha = 0}
        if (damageNumbers[i].type != 'mineral') {
            ctx.fillText(prefix+damageNumbers[i].amount+suffix,damageNumbers[i].x,damageNumbers[i].y)
        }
        else {
            ctx.fillText(prefix+damageNumbers[i].amount.type+suffix,damageNumbers[i].x,damageNumbers[i].y)
        }
        ctx.globalAlpha = 1;
        if (damageNumbers[i].lifetime <= 0) {damageNumbers.pop()}
    }

    ctx.resetTransform()

    //weapon pickup info
    if (pickupTarget != null) {
        switch (pickupTarget.type) {
            case 'mg':
                var type = ' machinegun'
            break;
            case 'sg':
                var type = ' shotgun'
            break;
            case 'lsr':
                var type = ' laser'
            break;
            case 'cnn':
                var type = ' cannon'
            break;
            case 'rlg':
                var type = ' railgun'
            break;
            default:
                var type = ' missing'
            break;
        }
        ctx.lineWidth = 4; ctx.font = '10px consolas'; ctx.fillStyle = background;
        ctx.fillRect(500,380,190,60); ctx.fillStyle = foreground; ctx.strokeStyle = foreground;
        ctx.strokeRect(500,380,190,60); 
        
        ctx.beginPath(); ctx.lineWidth = 2; ctx.moveTo(500,380); 
        ctx.lineTo((-camera.x + pickupTarget.x + 2.5)/zoomOffset,(-camera.y + pickupTarget.y + 2.5)/zoomOffset); 
        ctx.stroke();
        
        ctx.fillText('tier '+pickupTarget.tier+type+' level '+pickupTarget.level,505,395)
        var DPSmin = pickupTarget.projDmgMin*(1/pickupTarget.fireCooldown)
        var DPSmax = pickupTarget.projDmgMax*(1/pickupTarget.fireCooldown)
        ctx.fillText('firerate: '+(1/pickupTarget.fireCooldown)+' shots/sec',505,405)
        ctx.fillText('damage: '+pickupTarget.projDmgMin+'-'+pickupTarget.projDmgMax+' | DPS: '+DPSmin+'-'+DPSmax,505,415)
        ctx.fillText('inaccuracy: '+pickupTarget.projAccuracy+'° | proj speed: '+pickupTarget.projSpeed,505,425)
        ctx.fillText('critrate: '+pickupTarget.projCritRate+'% | crit multi: ×'+pickupTarget.projCritDmg,505,435)
        
        ctx.font = '18px consolas'; ctx.textAlign = 'center';
        ctx.fillText('[G]',(-camera.x + pickupTarget.x + 2.5)/zoomOffset,(-camera.y + pickupTarget.y - 10)/zoomOffset)
        ctx.textAlign = 'left'; pickupTarget = null
    }

    //guide arrows
    if (waypoint.x != 0 && waypoint.y != 0) {
        var angle = Math.atan2((camera.y + camera.height / 2) - waypoint.y,(camera.x + camera.width / 2) - waypoint.x) - 1.570796
        ctx.save(); ctx.translate(totW/2,totH/2);
        ctx.rotate(angle); ctx.translate(-totW/2,-totH/2);
        ctx.strokeStyle = 'green'; ctx.lineWidth = 3; ctx.beginPath()
        ctx.moveTo(totW/2-15,totH/2-185); ctx.lineTo(totW/2,totH/2-200)
        ctx.lineTo(totW/2+15,totH/2-185); ctx.stroke(); ctx.restore()
    }
    if (deathLocation.x != 0 && deathLocation.y != 0) {
        var angle = Math.atan2((camera.y + camera.height / 2) - deathLocation.y,(camera.x + camera.width / 2) - deathLocation.x) - 1.570796
        ctx.save(); ctx.translate(totW/2,totH/2);
        ctx.rotate(angle); ctx.translate(-totW/2,-totH/2);
        ctx.strokeStyle = 'black'; ctx.lineWidth = 3; ctx.beginPath()
        ctx.moveTo(totW/2-15,totH/2-185); ctx.lineTo(totW/2,totH/2-200)
        ctx.lineTo(totW/2+15,totH/2-185); ctx.stroke(); ctx.restore()
    }

    //xp bar
    var xpPercentage = xp / xpRequired
    ctx.fillStyle = background; ctx.fillRect(10,10,170,15)
    ctx.fillStyle = 'gold'; ctx.fillRect(40,10,140*xpPercentage,15)
    ctx.lineWidth = 2; ctx.strokeStyle = foreground; 
    ctx.strokeRect(10,10,170,15); ctx.fillStyle = foreground
    ctx.font = '15px consolas'; ctx.fillText(level,12,23)
    
    //health bar
    var healthPercentage = health / maxHealth;
    var healPercentage = healedHealth / maxHealth;
    ctx.fillStyle = background; ctx.fillRect(10,35,170,15)
    ctx.fillStyle = 'crimson'; ctx.fillRect(40,35,140*healthPercentage,15)
    ctx.fillStyle = 'firebrick'; ctx.fillRect(40 + 140*healthPercentage,35, 140 * healPercentage,15)
    ctx.strokeRect(10,35,170,15); ctx.fillStyle = foreground
    ctx.fillText(Math.round(health),12,48)
    
    //shield bar
    if (maxShield > 0 && gameState != states.escaping) {
        var shieldPercentage = shield / maxShield;
        ctx.fillStyle = background; ctx.fillRect(10,60,170,15)
        ctx.fillStyle = 'blue'; ctx.fillRect(40,60,140*shieldPercentage,15)
        ctx.strokeRect(10,60,170,15); ctx.fillStyle = foreground
        ctx.fillText(Math.round(shield),12,73)
        var y1 = 85; var y2 = 98
    }
    else if (maxShield == 0) {
        var y1 = 60; var y2 = 73
    }
    
    //credits counter
    if (gameState != states.escaping) {
        ctx.fillStyle = background; ctx.fillRect(10,y1,87,15)
        ctx.strokeRect(10,y1,87,15); ctx.fillStyle = foreground
        switch (Math.floor(credits).toString().length) {
            case 1: ctx.fillText('cr 000000'+Math.floor(credits),12,y2); break 
            case 2: ctx.fillText('cr 00000'+Math.floor(credits),12,y2); break
            case 3: ctx.fillText('cr 0000'+Math.floor(credits),12,y2); break
            case 4: ctx.fillText('cr 000'+Math.floor(credits),12,y2); break
            case 5: ctx.fillText('cr 00'+Math.floor(credits),12,y2); break
            case 6: ctx.fillText('cr 0'+Math.floor(credits),12,y2); break
            case 7: ctx.fillText('cr '+Math.floor(credits),12,y2); break
        }
    }
    
    if (displayLevelUpMessage > 0) {
        displayLevelUpMessage -= 0.02;
        ctx.font = '15px consolas'; ctx.fillStyle = background;
        ctx.fillText('Level up! +'+spAmounts[level-1]+'SP',200,22.5)
    }

    //minimap
    {
        //background
        ctx.fillStyle = 'rgba(59, 168, 240, 0.9)'; ctx.fillRect(totW-150,10,140,90); 
    
        ctx.strokeStyle = 'rgb(76,76,76)';
        ctx.lineWidth = 0.5;

        // Define minimap dimensions and position
        const minimapWidth = 140;
        const minimapHeight = 90;
        const minimapX = 550;
        const minimapY = 10;

        // Define how much of the world the minimap displays
        const visibleWorldWidth = 7000;  // Portion of the world visible on the minimap
        const visibleWorldHeight = 4500;

        // Calculate scaling factors
        const scaleX = minimapWidth / visibleWorldWidth;
        const scaleY = minimapHeight / visibleWorldHeight;

        // Calculate the minimap's top-left corner in world coordinates
        const minimapWorldX = playerX - visibleWorldWidth / 2;
        const minimapWorldY = playerY - visibleWorldHeight / 2;

        // Draw horizontal grid lines on the minimap
        ctx.beginPath();
        for (let y = 0; y <= 45000; y += 60) { // World grid interval is 60
            // Calculate the grid line's position relative to the minimap's world representation
            const relativeY = y - minimapWorldY * scaleY;

            // Only draw lines within the minimap's vertical bounds
            if (relativeY >= 0 && relativeY <= minimapHeight) {
                ctx.moveTo(minimapX, minimapY + relativeY);
                ctx.lineTo(minimapX + minimapWidth, minimapY + relativeY);
            }
        }
        ctx.stroke();

        // Draw vertical grid lines on the minimap
        ctx.beginPath();
        for (let x = 0; x <= 70000; x += 60) { // World grid interval is 60
            // Calculate the grid line's position relative to the minimap's world representation
            const relativeX = x - minimapWorldX * scaleX;

            // Only draw lines within the minimap's horizontal bounds
            if (relativeX >= 0 && relativeX <= minimapWidth) {
                ctx.moveTo(minimapX + relativeX, minimapY);
                ctx.lineTo(minimapX + relativeX, minimapY + minimapHeight);
            }
        }
        ctx.stroke();


        //draw asteroids
        ctx.fillStyle = 'gray'; ctx.strokeStyle = 'grey';
        asteroidFields.forEach(field => {
            const relativeX = field.x - (playerX - 7000 / 2);
            const relativeY = field.y - (playerY - 4500 / 2);
            const relativeRight = field.x + field.width - (playerX - 7000 / 2);
            const relativeBottom = field.y + field.height - (playerY - 4500 / 2);

            if (relativeX >= 0 && relativeRight <= 7000 && relativeY >= 0 && relativeBottom <= 4500) {
                const scaledX = (relativeX / 7000) * 140;
                const scaledY = (relativeY / 4500) * 90;

                ctx.strokeRect(550 + scaledX, 10 + scaledY, field.width / 7000 * 140, field.height / 4500 * 90)
            }
        })
        asteroids.forEach(ass => {
            const asteroid = ass[ass.length - 1];
        
            // Calculate the asteroid's position relative to the visible section
            const relativeX = asteroid.xPos - (playerX - 7000 / 2);
            const relativeY = asteroid.yPos - (playerY - 4500 / 2);
        
            // Check if the asteroid is within the visible section
            if (relativeX >= 0 && relativeX <= 7000 && relativeY >= 0 && relativeY <= 4500) {
                // Scale the asteroid's position to the minimap
                const scaledX = (relativeX / 7000) * 140;
                const scaledY = (relativeY / 4500) * 90;
            
                // Apply the minimap offset and draw the asteroid
                ctx.fillRect(550 + scaledX, 10 + scaledY, 2, 2);
            }
        });

        projectiles.forEach(proj => {
            const relativeX = (-camera.x+proj.x) + camera.x - (playerX - 7000 / 2);
            const relativeY = (-camera.y+proj.y) + camera.y - (playerY - 4500 / 2);

            if (relativeX >= 0 && relativeX <= 7000 && relativeY >= 0 && relativeY <= 4500) {
                const scaledX = (relativeX / 7000) * 140;
                const scaledY = (relativeY / 4500) * 90;

                if (proj.type == 'particleS' || proj.type == 'particleL') {ctx.fillStyle = 'white'}
                else if (proj.fof == 'friendly') {ctx.fillStyle = 'green'}
                else {ctx.fillStyle = 'red'}
                ctx.fillRect(550 + scaledX, 10 + scaledY, 1, 1);
            }
        })

        //death location
        if (deathLocation.x != 0 && deathLocation.y != 0) {
            var relativeX = deathLocation.x - (playerX - 7000 / 2)
            var relativeY = deathLocation.y - (playerY - 4500 / 2)
            if (relativeX >= 0 && relativeX <= 7000 && relativeY >= 0 && relativeY <= 4500) {
                const scaledX = (relativeX / 7000) * 140;
                const scaledY = (relativeY / 4500) * 90;
                ctx.fillStyle = 'black'; ctx.fillRect(550+scaledX,10+scaledY,3,3)
            }
        }

        //waypoint
        if (waypoint.x != 0 && waypoint.y != 0) {
            var relativeX = waypoint.x - (playerX - 7000 / 2)
            var relativeY = waypoint.y - (playerY - 4500 / 2)
            if (relativeX >= 0 && relativeX <= 7000 && relativeY >= 0 && relativeY <= 4500) {
                const scaledX = (relativeX / 7000) * 140;
                const scaledY = (relativeY / 4500) * 90;
                ctx.fillStyle = 'green'; ctx.fillRect(550+scaledX,10+scaledY,3,3)
            }
        }
    
        //frame and trans to player loc
        ctx.lineWidth = 2; ctx.strokeStyle = foreground;
        ctx.strokeRect(totW-150,10,140,90); ctx.save(); ctx.translate(totW-150+70,10+45);
        //rotate and draw player
        ctx.rotate(playerAngle * Math.PI / 180); ctx.beginPath(); ctx.fillStyle = 'green';
        ctx.moveTo(-2,2); ctx.lineTo(2,2); ctx.lineTo(0,-4); ctx.fill();
        //restore canvas
        ctx.translate(-(totW-150+playerX/500),-(10+playerY/500)); ctx.restore();
    
        //write coordinates
        ctx.fillStyle = foreground; ctx.font = '10px consolas';
        ctx.fillText('X:'+Math.round(playerX)+' Y:'+Math.round(playerY),552.5,97.5)

        //pointing overlay
        if (hovering == true && gameState == states.main) {
            ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.font = '15px consolas'
            ctx.fillRect(minimapX+1,minimapY+1,minimapWidth-2,minimapHeight-2)
            ctx.fillStyle = foreground; ctx.textAlign = 'center';
            ctx.fillText('Open map[M]',minimapX+minimapWidth/2,minimapHeight/2+15)
            ctx.textAlign = 'left';
        }
    }
    //end minimap

    //inventory and stuff menu
    if (gameState == states.inventory) {
        //background
        ctx.fillStyle = background; ctx.fillRect(totW/2-210,totH/2-135,420,270);
        
        //frame and dividers
        ctx.lineWidth = 4; ctx.strokeRect(totW/2-210,totH/2-135,420,270); ctx.beginPath();
        ctx.moveTo(totW/2+20,totH/2-135); ctx.lineTo(totW/2+20,totH/2+135); ctx.moveTo(370,300);
        ctx.lineTo(560,300); ctx.stroke(); 
        
        //closing button
        ctx.beginPath(); ctx.moveTo(155,90); ctx.lineTo(155,70); ctx.lineTo(175,70);
        ctx.lineTo(175,90); ctx.stroke(); ctx.fillRect(157,72,16,16); ctx.lineWidth = 2; 
        ctx.strokeStyle = 'red'; ctx.beginPath(); ctx.moveTo(160,75); ctx.lineTo(170,85);
        ctx.moveTo(160,85); ctx.lineTo(170,75); ctx.stroke()
        
        //tab things
        ctx.strokeStyle = foreground; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(185,90); ctx.lineTo(185,70); ctx.lineTo(310,70); 
        ctx.lineTo(310,90); ctx.moveTo(320,90); ctx.lineTo(320,70); ctx.lineTo(379,70);
        ctx.lineTo(379,90); ctx.stroke(); ctx.fillRect(187,72,121,20); ctx.fillRect(322,72,55,16)
        ctx.fillStyle = foreground; ctx.font = '15px consolas'; ctx.fillText('Inventory[Tab]',190,85);
        ctx.fillText('Map[M]',325,85);
        
        //level related text
        ctx.font = '15px consolas'; ctx.fillStyle = foreground; skillPointsTextWidth = ctx.measureText('Skillpoints: '+skillPoints)
        ctx.fillText('Level '+level+' => '+(level+1)+'  '+Math.floor(xp)+'/'+xpRequired,150,110); ctx.fillText('Skillpoints: '+skillPoints,150,130)
        
        //skillpoint adding button
        ctx.lineWidth = 2; ctx.strokeRect(150+skillPointsTextWidth.width+5,118,15,15); ctx.beginPath(); 
        ctx.moveTo(150+skillPointsTextWidth.width+8,125.5); ctx.lineTo(150+skillPointsTextWidth.width+17,125.5); 
        ctx.moveTo(150+skillPointsTextWidth.width+12.5,121); ctx.lineTo(150+skillPointsTextWidth.width+12.5,130); 
        if (skillPoints > 0) {ctx.strokeStyle = 'red'}; ctx.stroke()
        
        //inventory slots
        ctx.lineWidth = 3; ctx.strokeStyle = foreground;
        slotsX.forEach((x,xIndex) => {
            slotsY.forEach((y,yIndex) => {
                ctx.strokeRect(x,y,45,45)
                var target = 'slot'
                switch (yIndex) {
                    case 0: target += xIndex+1; break
                    case 1: target += xIndex+5; break
                    case 2: target += xIndex+9; break
                    case 3: target += xIndex+13; break
                }
                ctx.font = '10px consolas'; 
                ctx.fillStyle = foreground;
                ctx.fillText(target.substring(4),x+3,y+10)
                var inventoryTarget = inventoryContent[target];
                if (inventoryTarget == null) {
                    ctx.fillText('empty',x+9,y+25)
                }
                else if (inventoryTarget instanceof weapon) {
                    ctx.font = '13px consolas'; 
                    ctx.textAlign = 'center';
                    ctx.fillText(inventoryTarget.type,x+22.5,y+13)
                    ctx.fillText('tier'+inventoryTarget.tier,x+22.5,y+26)
                    ctx.fillText('lvl'+inventoryTarget.level,x+22.5,y+39)
                    ctx.textAlign = 'left';
                }
                else {
                    switch (inventoryTarget.type) {
                        case 'iron ore': var ore = 'Fe'; break
                        case 'copper ore': var ore = 'Cu'; break
                        
                        case 'silver': var ore = 'Ag'; break
                        case 'gold': var ore = 'Au'; break

                        default: var ore = 'stn'; break
                    }
                    ctx.font = '13px consolas'; 
                    ctx.textAlign = 'center';
                    ctx.fillText(ore,x+22.5,y+17)
                    ctx.fillText('×'+inventoryTarget.amount,x+22.5,y+30)
                    ctx.textAlign = 'left';
                }
            })
        })

        
        //ship display
        if (spriteSelection == 1) {updateFighterSprite(465,200); playerSprite = fighter}
        else if (spriteSelection == 2) {updateCorvetteSprite(465,180); playerSprite = corvette; ctx.scale(0.80,0.80); ctx.translate(totW*0.165,totH*0.165)}
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
        }
        else if (spriteSelection == 2) {
            ctx.beginPath(); 
            ctx.moveTo(445,195); ctx.lineTo(430,125); ctx.lineTo(420,125);
            ctx.moveTo(445,205); ctx.lineTo(430,170); ctx.lineTo(420,170);
            ctx.moveTo(445,220); ctx.lineTo(430,250); ctx.lineTo(420,250);
            ctx.moveTo(485,195); ctx.lineTo(500,125); ctx.lineTo(510,125);
            ctx.moveTo(485,205); ctx.lineTo(500,170); ctx.lineTo(510,170);
            ctx.moveTo(485,220); ctx.lineTo(500,250); ctx.lineTo(510,250);
            ctx.stroke()
            ctx.strokeRect(380,105,40,40); ctx.strokeRect(510,105,40,40);
            ctx.strokeRect(380,150,40,40); ctx.strokeRect(510,150,40,40);
            ctx.strokeRect(380,230,40,40); ctx.strokeRect(510,230,40,40);
        }
        equipmentSlotsPos.forEach((pos,posIndex) => {
            var target = 'slot'+(posIndex+1) 
            var equipmentTarget = equipmentSlots[target];
            if (equipmentTarget == null) {
                ctx.font = '20px consolas'; ctx.textAlign = 'center';
                var tier = equipmentSlotsTierAndTurret[posIndex].tier;
                ctx.fillText('T'+tier,pos.x+20,pos.y+25)
                ctx.textAlign = 'left';
            }
            else {
                ctx.fillStyle = foreground;
                ctx.font = '13px consolas'; 
                ctx.textAlign = 'center';
                ctx.fillText(equipmentTarget.type,pos.x+20,pos.y+10)
                ctx.fillText('tier'+equipmentTarget.tier,pos.x+20,pos.y+23)
                ctx.fillText('lvl'+equipmentTarget.level,pos.x+20,pos.y+36)
                ctx.textAlign = 'left';
            }
        })
        
        //information box
        if (hoverTarget == null) {
            switch (spriteSelection) {
                case 1:
                    var sprite = 'fighter'
                    break;
                case 2:
                    var sprite = 'corvette'
                    break;
            }
            ctx.font = '10px consolas'; ctx.fillText(sprite,375,315)
            ctx.fillText('turning speed: '+playerTurnSpeed*50+'°/s',375,325)
            ctx.fillText('forwards accel: '+playerMaxSpeed*50+'px/s',375,335)
            ctx.fillText('health: '+Math.round(health)+'/'+maxHealth,375,345)
            if (maxShield == 0) {
                ctx.fillText('shield: not installed',375,355)
            }
            else { ctx.fillText('shield: '+Math.round(shield)+'/'+maxShield,375,355) }
        }
        else if (hoverTarget instanceof weapon) {
            switch (hoverTarget.type) {
                case 'mg':
                    var type = ' machinegun'
                break;
                case 'sg':
                    var type = ' shotgun'
                break;
                case 'lsr':
                    var type = ' laser'
                break;
                case 'cnn':
                    var type = ' cannon'
                break;
                case 'rlg':
                    var type = ' railgun'
                break;
                default:
                    var type = ' missing'
                break;
            }
            ctx.font = '10px consolas';
            ctx.fillText('tier '+hoverTarget.tier+type+' level '+hoverTarget.level,375,315)
            var DPSmin = hoverTarget.projDmgMin*(1/hoverTarget.fireCooldown)
            var DPSmax = hoverTarget.projDmgMax*(1/hoverTarget.fireCooldown)
            if (hoverTarget.type != 'lsr') {
                ctx.fillText('firerate: '+(1/hoverTarget.fireCooldown)+' shots/sec',375,325)
                ctx.fillText('damage: '+hoverTarget.projDmgMin+'-'+hoverTarget.projDmgMax+' | DPS: '+DPSmin+'-'+DPSmax,375,335)
                ctx.fillText('inaccuracy: '+hoverTarget.projAccuracy+'° | proj speed: '+hoverTarget.projSpeed,375,345)
            }
            else {
                ctx.fillText('firerate: '+50+' shots/sec',375,325)
                ctx.fillText('damage: '+hoverTarget.projDmgMin+'-'+hoverTarget.projDmgMax+' | DPS: '+hoverTarget.projDmgMin*50+'-'+hoverTarget.projDmgMax*50,375,335)
                ctx.fillText('inaccuracy: '+hoverTarget.projAccuracy+'° | proj speed: ∞',375,345)
            }
            ctx.fillText('critrate: '+hoverTarget.projCritRate+'% | crit multi: ×'+hoverTarget.projCritDmg,375,355)
        }
        else {
            switch (hoverTarget.type) {
                case 'iron ore': var ore = 'ferrum'; break
                case 'copper ore': var ore = 'cyprum'; break
                
                case 'silver': var ore = 'argentum'; break
                case 'gold': var ore = 'aurum'; break
            }
            ctx.font = '10px consolas';
            if (hoverTarget.type == 'stone') {
                ctx.fillText(hoverTarget.type+' ×'+hoverTarget.amount,375,315)
            }
            else {
                ctx.fillText(ore+'/'+hoverTarget.type+' ×'+hoverTarget.amount,375,315)
            }
        }

        //ghost thing
        if (beingDragged.item != null) {
            if (beingDragged.item instanceof weapon) {
                ctx.font = '13px consolas'; 
                ctx.fillStyle = 'rgba(13, 84, 238, 0.69)'//nice
                ctx.textAlign = 'center';
                ctx.fillText(beingDragged.item.type,mousePosX,mousePosY-13)
                ctx.fillText('tier'+beingDragged.item.tier,mousePosX,mousePosY)
                ctx.fillText('lvl'+beingDragged.item.level,mousePosX,mousePosY+13)
                ctx.textAlign = 'left';
            }
            else {
                switch (beingDragged.item.type) {
                    case 'iron ore': var ore = 'Fe'; break
                    case 'copper ore': var ore = 'Cu'; break
                    
                    case 'silver': var ore = 'Ag'; break
                    case 'gold': var ore = 'Au'; break
                    
                    default: var ore = 'stn'; break
                }
                ctx.font = '13px consolas'; 
                ctx.fillStyle = 'rgba(13, 84, 238, 0.69)'//nice
                ctx.textAlign = 'center';
                ctx.fillText(ore,mousePosX,mousePosY-5)
                ctx.fillText('×'+beingDragged.item.amount,mousePosX,mousePosY+8)
                ctx.textAlign = 'left';
            }
        }
        //skillpoint window
        if (skillPointsAdding == true) {
            ctx.fillStyle = background; ctx.fillRect(totW/2-131.25,totH/2-84.375,262.5,168.75);
            ctx.lineWidth = 3; ctx.strokeRect(totW/2-131.25,totH/2-84.375,262.5,168.75);
            ctx.lineWidth = 2; //buttons
            ctx.strokeRect(228,270,30,30); ctx.strokeRect(270.5,270,30,30); ctx.strokeRect(313,270,30,30);
            ctx.strokeRect(355.5,270,30,30); ctx.strokeRect(398,270,30,30); ctx.strokeRect(440.5,270,30,30);
            //how many upgrades?? health?, damage?, shield?, firerate?, crit?(chance?,multiP), luck/loot rarity??,
            //how big upgrades??? one or a few %???
        }
    }

    if (gameState == states.map) {
        var scaleFactor = 166.6666666666667
        var mapX = totW/2-210
        var mapY = totH/2-135
        var mapWidth = 420
        var mapHeight = 270
        //background & frame
        ctx.fillStyle = background; ctx.fillRect(totW/2-210,totH/2-135,420,270);
        ctx.lineWidth = 4; ctx.strokeStyle = foreground; ctx.strokeRect(totW/2-210,totH/2-135,420,270);
        //closing button
        ctx.beginPath(); ctx.moveTo(155,90); ctx.lineTo(155,70); ctx.lineTo(175,70);
        ctx.lineTo(175,90); ctx.stroke(); ctx.fillRect(157,72,16,16); ctx.lineWidth = 2; 
        ctx.strokeStyle = 'red'; ctx.beginPath(); ctx.moveTo(160,75); ctx.lineTo(170,85);
        ctx.moveTo(160,85); ctx.lineTo(170,75); ctx.stroke()
        //tab things
        ctx.lineWidth = 4; ctx.strokeStyle = foreground;
        ctx.beginPath(); ctx.moveTo(185,90); ctx.lineTo(185,70); ctx.lineTo(310,70); 
        ctx.lineTo(310,90); ctx.moveTo(320,90); ctx.lineTo(320,70); ctx.lineTo(379,70);
        ctx.lineTo(379,90); ctx.stroke(); ctx.fillRect(187,72,121,16); ctx.fillRect(322,72,55,20)
        ctx.fillStyle = foreground; ctx.font = '15px consolas'; ctx.fillText('Inventory[Tab]',190,85);
        ctx.fillText('Map[M]',325,85);
        //asteroid fields
        ctx.strokeStyle = 'gray'; ctx.lineWidth = 2
        asteroidFields.forEach(field => {
            var fieldMapX = mapX+field.x/scaleFactor
            var fieldMapY = mapY+field.y/scaleFactor
            var fieldMapWidth = field.width/scaleFactor
            var fieldMapHeight = field.height/scaleFactor
            ctx.strokeRect(fieldMapX,fieldMapY,fieldMapWidth,fieldMapHeight)
        })
        if (buttonHovered(155,70,20,20)) {
            hovering = true; console.log('pointing at close button')
        }
        else if (buttonHovered(185,70,125,20)) {
            hovering = true; console.log('pointing at inventory tab')
        }
        else {
            asteroidFields.some(field => {
                var fieldMapX = mapX+field.x/scaleFactor
                var fieldMapY = mapY+field.y/scaleFactor
                var fieldMapWidth = field.width/scaleFactor
                var fieldMapHeight = field.height/scaleFactor
                if (mousePosX > fieldMapX && mousePosX < fieldMapX + fieldMapWidth &&
                mousePosY > fieldMapY && mousePosY < fieldMapY + fieldMapHeight) {
                    hovering = true; ctx.font = '10px consolas'; ctx.fillStyle = foreground; ctx.lineWidth = 1;
                    ctx.strokeStyle = foreground; var xPos1,xPos2,yPos

                    if (fieldMapX > 450) {xPos1 = fieldMapX-88; xPos2 = fieldMapX-86}
                    else {xPos1 = fieldMapX+fieldMapWidth+3; xPos2 = fieldMapX+fieldMapWidth+5}

                    if (fieldMapY > 260) {yPos = fieldMapY-78}
                    else {yPos = fieldMapY+fieldMapHeight+3}

                    ctx.strokeRect(xPos1,yPos,85,75)
                    ctx.fillText('X:'+Math.round(field.x),xPos2,yPos+10)
                    ctx.fillText('Y:'+Math.round(field.y),xPos2,yPos+20)
                    ctx.fillText('Width:'+Math.round(field.width),xPos2,yPos+30)
                    ctx.fillText('Height:'+Math.round(field.height),xPos2,yPos+40)
                    ctx.fillText('Max roids:'+field.limitOfAsteroids,xPos2,yPos+50)
                    ctx.fillText('Roids:'+field.currentAsteroids,xPos2,yPos+60)
                    ctx.fillText('New roid in:'+Math.round(field.respawnTime),xPos2,yPos+70)
                    return true
                }
                hovering = false; return false
            })
        }
        //death location
        if (deathLocation.x != 0 && deathLocation.y != 0) {
            ctx.fillStyle = 'black'; 
            ctx.fillRect(mapX + deathLocation.x / scaleFactor,mapY + deathLocation.y / scaleFactor,3,3)
        }
        //waypoint
        if (waypoint.x != 0 && waypoint.y != 0) {
            ctx.fillStyle = 'green';
            ctx.fillRect(mapX + waypoint.x / scaleFactor,mapY + waypoint.y / scaleFactor,3,3)
        }
        //player arrow
        ctx.save(); ctx.translate(mapX+playerX/scaleFactor,mapY+playerY/scaleFactor);
        ctx.rotate(playerAngle * Math.PI / 180); ctx.beginPath(); ctx.fillStyle = 'green';
        ctx.moveTo(-4,4); ctx.lineTo(4,4); ctx.lineTo(0,-8); ctx.fill();
        ctx.translate(-(mapX+playerX/scaleFactor),-(mapY+playerY/scaleFactor)); ctx.restore();
        //write mouse coordinates
        ctx.fillStyle = foreground; ctx.font = '20px consolas'; 
        var mouseMapX = Math.floor((mousePosX-mapX)*scaleFactor)
        var mouseMapY = Math.floor((mousePosY-mapY)*scaleFactor)
        if (mouseMapX > 0 && mouseMapX < 70000 && mouseMapY > 0 && mouseMapY < 45000) {
            ctx.fillText('X:'+mouseMapX+' Y:'+mouseMapY,mapX+5,mapY+mapHeight-5)
        }
        else {ctx.fillText('X:'+NaN+' Y:'+NaN,mapX+5,mapY+mapHeight-5)}
        //help text
        ctx.font = '10px consolas'; ctx.textAlign = 'right'; 
        ctx.fillText('Click anywhere to set waypoint',mapX+mapWidth-5,mapY+mapHeight-5)
        ctx.textAlign = 'left';
    }

    //cursor
    if (gameState != states.inventory && gameState != states.map) {    
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

    if (keysPressed && keysPressed['Escape'] && canPause == true && gameState != states.escaping) {
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
    
    
    //ship destroyed
    if (health <= 0) 
    {
        console.log('ship destroyed'); ctx.fillStyle = 'red'; 
        ctx.font = '30px consolas'; ctx.textAlign = 'center'; 
        ctx.fillText('!!!Catastrofic hull failure imminent!!!',totW/2,totH/2-80);
        ctx.fillText('!!Deploying escape pod!!',totW/2,totH/2-40); ctx.textAlign = 'left';
        if (timeoutThing == true) {
            timeoutThing = false; 
            setTimeout(function() {
                maxHealth = 5; health = maxHealth; maxShield = 0; healedHealth = 0;
                gameState = states.escaping; deathLocation.x = playerX;
                deathLocation.y = playerY; deathLocation.ship = spriteSelection; 
                deathLocation.angle = playerAngle; movementVector[1] = -5; timeoutThing = true
            },3000)
        }
    } 
    
    if (gameState == states.escaping) {
        ctx.font = '25px consolas'; ctx.textAlign = 'center'; ctx.fillStyle = 'red';
        ctx.fillText('!!Go to the nearest station to get a new ship!!',totW/2,totH/2-80);
        ctx.textAlign = 'left';
        //escape pod destroyed
        if (health <= 0) 
        {
            clearInterval(interval); console.log('dead'); 
            ctx.fillStyle = 'maroon'; ctx.fillRect(0,0,totW,totH)
            ctx.fillStyle = 'crimson'; ctx.font = '35px consolas'; 
            ctx.fillText('You died...',totW/2-200,totH/2);
            setTimeout(function() {
                /* gameState = states.menu
                canPause = true; can.style.cursor = 'default';
                mainMenu() */ window.location.reload()
            },3000)
        }
    }
    
}