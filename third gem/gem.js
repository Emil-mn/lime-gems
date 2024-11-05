//canvas stuff
var can = document.getElementById('canvas')
var totW = can.width
var totH = can.height
var musx, musy
var clickX, clickY
var ctx = can.getContext("2d")
//states stuff
var states = {stopped:0,menu:1,level:2,paused:3,brik:4,pew:5}
var gameState = states.stopped
var prevState
//weapon stuff
var dmgLvl = 0,frtLvl = 0
var accLvl = 0,crtLvl = 0
var hltLvl = 0,gndLvl = 0
var dmgPrice = 10
var frtPrice = 10
var accPrice = 10
var crtPrice = 10
var hltPrice = 10
var gndPrice = 10
var dmg = [1,2,4,6,8,10]
var frt = [950,800,650,500,350,200]
var acc = [6,5,4,3,2,1]
var crt = [5,10,15,20,25,30]
var hlt = [50,75,100,125,150,200]
var gnd = [1,2,3,4,5,6]
//array stuff
var enemies = []
var projectiles = []
var pickups = []
var floors = []
var walls = []
//char stat stuff
var points = 99
var health
var armor
var grenades = 9
var grenadeCool = true
var maxHealth = hlt[hltLvl]
var maxArmor = 25
//inputs n stuff
var keys
const SPEED = 2
var levelInterval
var fireInterval
//sprites
var player, pGun, arcadeTest, arcade2
//brik-brek
var ball, paddle, bricks, brikBalls = [], brikLives = 0 
var brickArray = [], brickCount = 0, brikLvl = 1
var msgText, msgTime = 0, shieldTime = 0, explodeTime = 0
//pew-pew
var arrow, arrowPArray = [], fireCool = 0, hurtCool = 0
var time, score, pewEnemies, spawnCool
//highscore stuff
var key,keyPress,canEnterName = false, ready = false
var keysEntered = 0, nameListener
var n,a,m,namer,NAMER
const NO_OF_HIGH_SCORES = 4
const HIGH_SCORES = 'pewHighScores'

can.addEventListener('mousedown', function (e) {
    var rect = can.getBoundingClientRect();
    clickX = e.pageX - rect.left;
    clickY = e.pageY - rect.top; 
    console.log('click detected at '+ clickX + ' ' + clickY);
    checkButt(e.button)
})

can.addEventListener('mousemove', function(evt) {
    var rect = canvas.getBoundingClientRect();
    musx = evt.clientX - rect.left;
    musy = evt.clientY - rect.top;
    if (gameState == states.menu) {buttHoverCheck()}
    //console.log('mouse is at '+ musx + ' ' + musy)
},false);

can.addEventListener('contextmenu', function(e){
    e.preventDefault()
})

window.addEventListener('mouseup', function (e) {
    clearInterval(fireInterval);
});

document.addEventListener('keydown', function(e) {
    keys = (keys || []);
    keys[e.key] = true; //console.log(keys)  
})
document.addEventListener('keyup', function(e) {
    //keyPress = null; /*stopit = false*/
    if (e.key != 'F5') {keys[e.key] = false; /*console.log(keys)*/}
})

function buttClicked(x, y, width, height) {
    var myleft = x;
    var myright = x + (width);
    var mytop = y;
    var mybottom = y + (height);
    var clicked = true;
    if ((mybottom < clickY) || (mytop > clickY) || (myright < clickX) || (myleft > clickX)) {
      clicked = false;
    }
    return clicked;
}

function buttHovered(x, y, width, height) {
    var myleft = x;
    var myright = x + (width);
    var mytop = y;
    var mybottom = y + (height);
    var hovered = true;
    if ((mybottom < musy) || (mytop > musy) || (myright < musx) || (myleft > musx)) {
      hovered = false;
    }
    return hovered;
}

function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES-1]?.score ?? 0;

    if (score > lowestScore) {
        canEnterName = true
        console.log('new highscore, can enter name')
    }
    else {
        canEnterName = false
        console.log('no new highscore')
    }
}

function saveHighScore(score,time) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    var timer = Math.floor(time)
    const newScore = { score, NAMER, timer };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(NO_OF_HIGH_SCORES);

    console.log(highScores)
    console.log('new highscore saved')

    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}

function start() {
    if (gameState == states.stopped)
    {
        document.getElementById('butt1').style.backgroundColor = 'green'
        document.getElementById('instructions').style.display = 'none'
        console.log('game loading...')
        ctx.fillStyle = 'green'
        ctx.fillRect(0,0,totW,totH)
        ctx.fillStyle = 'black'
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

        setTimeout(loadMenu,2000)
    }
    else
    {
        if (gameState == states.level || gameState == states.brik || gameState == states.pew) 
        {clearInterval(levelInterval)}
        
        document.getElementById('butt1').style.backgroundColor = 'red'
        gameState = states.stopped; ctx.clearRect(0,0,totW,totH)
        console.log('game stopped'); can.style.cursor = 'default'
        
    }
}

function startBrikBrek() {
    paddle = {
        speed: 5,
        width: 50,
        height: 7,
        x: totW/2 - 25,
        y: totH - 100 
    }  
    
    var x, rand = Math.random() * 2 -1
    
    if (rand > 0) {x = 1}
    else if (rand < 0) {x = -1}

    ball = {
        x: totW/2 - 5,
        y: totH - 125,
        size: 5,
        xSpeed: x,
        ySpeed: -3 
    }
    
    brikBalls = [{x:ball.x,y:ball.y,xSpeed:ball.xSpeed,ySpeed:ball.ySpeed}]

    bricks = {
        rows:4,
        columns:6,
        width:40,
        height:8,
        padding:8,
        offsetTop:112.5, //12.5 from top of game, add 15 for drawing
        offsetLeft:147.5 //12.5 from left of game, add 15 for drawing
    }
    
    brickCount = 0

    for (var c = 0; c < bricks.columns; c++) {
        brickArray[c] = []
        for (var r = 0; r < bricks.rows; r++) {
            switch (brikLvl) {
                case 1:
                    var pUpChance = 10
                    break;
                case 2:
                    var pUpChance = 9
                    break;
                case 3:
                    var pUpChance = 8
                    break;
                case 4:
                    var pUpChance = 7
                    break;
                default:
                    var pUpChance = 6
                    break;
            }
            var pUp = Math.floor(Math.random()*pUpChance)
            console.log('one in '+pUpChance+' bricks has a powerup')
            if (pUp == 1) {pUp = true}
            else {pUp = false}
            brickArray[c][r] = { x: 0, y: 0, status: brikLvl, pUp: pUp}
            brickCount++
        }
    }
    console.log(brickArray)
    levelInterval = setInterval(brikBrek,20)
}

function startPewPew() {
    arrow = {
        health:5,
        angle:0,
        speed:0,
        dx:0,
        dy:0,
        sx:0,
        sy:0,
        frontPoint:{x:300,y:210},
        backLeftPoint:{x:295,y:225},
        backRightPoint:{x:305,y:225},
        centerX:300,
        centerY:217.5
    }
    time = 0; score = 0;
    ctx.textAlign = 'left';
    pewEnemies = []; spawnCool = 2
    levelInterval = setInterval(pewPew,20)
}

function pause() {
    if (gameState == states.level) {prevState = 1}
    else if (gameState == states.brik) {prevState = 2}
    else if (gameState == states.pew) {prevState = 3}

    if (gameState == states.level || gameState == states.brik || gameState == states.pew) {
        console.log('paused'); gameState = states.paused; clearInterval(levelInterval)
        ctx.fillStyle = 'gray'; ctx.font = '45px consolas'; ctx.fillText('Paused',220,totH/2)
    }
    else if (gameState == states.paused) {
        console.log('resumed'); 
        if (prevState == 1) {
            gameState = states.level; levelInterval = setInterval(levelLoop,20)
        }
        else if (prevState == 2) {
            gameState = states.brik; levelInterval = setInterval(brikBrek,20)
        }
        else if (prevState == 3) {
            gameState = states.brik; levelInterval = setInterval(pewPew,20)
        }
    }
}

function checkButt(mButt){
    if (gameState == states.menu){
        if (buttClicked(400,250,100,50)){
            console.log('clicked play button'); 
            player = new character(520,20,10,25,'gray');
            pGun = new gun(40,300,12,5)
            arcadeTest = new Obstacle(450,totH-75,10,20,'blue')
            arcade2 = new Obstacle(536,totH-99,10,20,'black')
            //pickup test
            pickups.push(new character(totW/2,totH-15,5,5,'gold','points',15))
            pickups.push(new character(totW/2+10,totH-15,5,5,'red','health',20))
            pickups.push(new character(totW/2+20,totH-15,5,5,'darkblue','armor',10))
            pickups.push(new character(totW/2+30,totH-15,5,5,'darkslategrey','grenade',1))
            //obstacle test
            floors.push(new Obstacle(300,totH-32,60,5,'gray'))
            floors.push(new Obstacle(430,totH-55,50,5,'gray'))
            floors.push(new Obstacle(515,totH-79,59,5,'gray'))
            walls.push(new Obstacle(320,totH-105,5,45,'gray'))
            walls.push(new Obstacle(320,totH-60,5,28,'darkslategray','breakable'))
            walls.push(new Obstacle(330,totH-105,5,45,'gray'))
            walls.push(new Obstacle(330,totH-60,5,28,'lightslategray','gBreakable'))
            gameState = states.level; can.style.cursor = 'crosshair';
            health = maxHealth
            armor = maxArmor
            levelInterval = setInterval(levelLoop,20); 
        }
        else if (buttClicked(400,130,100,50)){
            console.log('clicked test button'+dmgLvl+frtLvl+accLvl+crtLvl);
            if (dmgLvl < 5 && frtLvl < 5 && accLvl < 5 && crtLvl < 5) {dmgLvl++; frtLvl++; accLvl++; crtLvl++; loadMenu()}
        }
        
        else if (buttClicked(130,270,30,30)){
            console.log('clicked dmg upgrade');
            if (points >= dmgPrice && dmgLvl < 5) {dmgLvl++; points -= dmgPrice; dmgPrice *= 2; loadMenu()}
            else {console.log('not allowed, price is: '+dmgPrice+' and level is: '+dmgLvl)}
        }        
        else if (buttClicked(175,270,30,30)){
            console.log('clicked frt upgrade');
            if (points >= frtPrice && frtLvl < 5) {frtLvl++; points -= frtPrice; frtPrice *= 2; loadMenu()}
            else {console.log('not allowed, price is: '+frtPrice+' and level is: '+frtLvl)}
        }
        else if (buttClicked(220,270,30,30)){
            console.log('clicked acc upgrade');
            if (points >= accPrice && accLvl < 5) {accLvl++; points -= accPrice; accPrice *= 2; loadMenu()}
            else {console.log('not allowed, price is: '+accPrice+' and level is: '+accLvl)}
        }
        else if (buttClicked(265,270,30,30)){
            console.log('clicked crt upgrade');
            if (points >= crtPrice && crtLvl < 5) {crtLvl++; points -= crtPrice; crtPrice *= 2; loadMenu()}
            else {console.log('not allowed, price is: '+crtPrice+' and level is: '+crtLvl)}
        }
        else if (buttClicked(310,270,30,30)){
            console.log('clicked hlt upgrade');
            if (points >= hltPrice && hltLvl < 5) {hltLvl++; maxHealth = hlt[hltLvl]; points -= hltPrice; hltPrice *= 2; loadMenu()}
            else {console.log('not allowed, price is: '+hltPrice+' and level is: '+hltLvl)}
        }
        else if (buttClicked(355,270,30,30)){
            console.log('clicked gnd upgrade');
            if (points >= gndPrice && gndLvl < 5) {gndLvl++; points -= gndPrice; gndPrice *= 2; loadMenu()}
            else {console.log('not allowed, price is: '+gndPrice+' and level is: '+gndLvl)}
        }
    }
    if (gameState == states.level){
        if (mButt == 0) {
            fireInterval = setInterval(() => {
            projectiles.push(new Projectile(3,3,'gold',player.x + 5,player.y + 12,musx-15,musy-15,'frend'))
            //projectiles.push(new Projectile(3,3,'red',player.x + 50, player.y + 12, player.x,player.y+12,'enemi'))
            }, frt[frtLvl])
        }
        if (mButt == 2 && grenadeCool == true && grenades > 0) {
            projectiles.push(new Projectile(5,5,'darkslategray',player.x,player.y,musx,musy,'grenade'))
            grenades--; grenadeCool = false; setTimeout(() => {grenadeCool = true},1000)
        }
    }
}

function buttHoverCheck(){
    if (gameState == states.menu){
        if (buttHovered(400,250,100,50)){console.log('pointing at play button'); can.style.cursor = 'pointer'}
        else if (buttHovered(400,130,100,50)){console.log('pointing at test button'); can.style.cursor = 'pointer'}
        
        else if (buttHovered(130,270,30,30)){
            console.log('pointing at dmg upgrade');
            if (points >= dmgPrice && dmgLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }        
        else if (buttHovered(175,270,30,30)){
            console.log('pointing at frt upgrade');
            if (points >= frtPrice && frtLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(220,270,30,30)){
            console.log('pointing at acc upgrade');
            if (points >= accPrice && accLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(265,270,30,30)){
            console.log('pointing at crt upgrade');
            if (points >= crtPrice && crtLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(310,270,30,30)){
            console.log('pointing at hlt upgrade');
            if (points >= hltPrice && hltLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(355,270,30,30)){
            console.log('pointing at gnd upgrade');
            if (points >= gndPrice && gndLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else {can.style.cursor = 'default'}
    }
}

class Obstacle {
    constructor(x,y,width,height,color,type) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        ctx.fillStyle = color
        this.type = type
        this.update = function() {
            ctx.fillStyle = color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}


class character {
    constructor(x, y, width, height, color, type, amount) {
        this.x = x
        this.y = y
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.width = width
        this.height = height
        ctx.fillStyle = color
        this.type = type
        this.amount = amount
        this.gravity = 0.15
        this.fallSpeed = 0
        this.jumpStrength = -3.5;
        this.grounded = false;
        this.update = function (x, y) {
            if (x == 1) {
                this.x += SPEED
            }
            else if (x == -1) {
                this.x -= SPEED
            }
            if (y == 1 && this.grounded) {
                this.fallSpeed = this.jumpStrength;
                this.grounded = false;
            }
            
            if (!this.grounded)
            {   
                this.fallSpeed += this.gravity
                this.y += this.fallSpeed
            }
            else {this.fallSpeed = 0}
            
            if (this.y + this.height > canvas.height - 5) {
                this.y = canvas.height - this.height - 5;
                this.grounded = true;
            } else {
                this.grounded = false;
            }

            ctx.fillStyle = color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        this.crashWith = function (otherobj) {
            var myleft = this.x
            var myright = this.x + (this.width)
            var mytop = this.y
            var mybottom = this.y + (this.height)
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
        
    
            
    floor(otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mybottom = this.y + (this.height)
        var mycenter = this.y + this.height/2
        var otherleft = otherobj.x
        var otherright = otherobj.x + otherobj.width
        var othertop = otherobj.y
        var otherbottom = otherobj.y + otherobj.height
        var onFloor = false
        if ((mybottom > othertop) && (mycenter < othertop) && (myright > otherleft) && (myleft < otherright)) {
            onFloor = true
        }
        return onFloor
    }
    
    floorBottom(otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mytop = this.y
        var mybottom = this.y + (this.height)
        var otherleft = otherobj.x
        var otherright = otherobj.x + otherobj.width
        var othertop = otherobj.y
        var otherbottom = otherobj.y + otherobj.height
        var belowFloor = false
        if ((mytop < otherbottom) && (mytop > othertop) && (myright > otherleft) && (myleft < otherright)) {
            belowFloor = true
        }
        return belowFloor
    }
    
    wallLeft(otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mytop = this.y
        var mybottom = this.y + (this.height)
        var otherleft = otherobj.x
        var othertop = otherobj.y
        var otherbottom = otherobj.y + otherobj.height
        var leftOfWall = false
        if ((mybottom > othertop) && (mytop < otherbottom) && (myright > otherleft) && (myleft < otherleft)) {
            leftOfWall = true
        }
        return leftOfWall
    }
        
    wallRight(otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mytop = this.y
        var mybottom = this.y + (this.height)
        var otherright = otherobj.x + otherobj.width
        var othertop = otherobj.y
        var otherbottom = otherobj.y + otherobj.height
        var rightOfWall = false
        if ((mybottom > othertop) && (mytop < otherbottom) && (myleft < otherright) && (myright > otherright)) {
            rightOfWall = true
        }
        return rightOfWall
    }    
    
}


class gun {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.angle = 0
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.shootCool = 0

        this.update = function () {
            // Calculate the angle in radians
            this.angle = Math.atan2(musy - this.centerY, musx - this.x);
            this.centerY = this.y + this.height / 2
            // Save the current context state
            ctx.save();
        
            // Translate the context to the point where the angle is calculated
            ctx.translate(this.x - 15, this.centerY - 15);
        
            // Rotate the context by the calculated angle
            ctx.rotate(this.angle);

            // Translate the context to the middle of the left end of the object
            ctx.translate(0, -this.height / 2);

            // Set the fill color and draw the rectangle
            ctx.fillStyle = 'lightslategray';
            ctx.fillRect(0, 0, this.width, this.height);
        
            // Reset the transformation matrix to the identity matrix
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        
            // Restore the context to its original state
            ctx.restore();
        }
        
    }
}


class Projectile {
    constructor(width, height, color, x, y, targetX, targetY, type) {
        this.type = type
        this.width = width
        this.height = height
        ctx.fillStyle = color
        this.x = x
        this.y = y
        var crit = false
        this.targetX = targetX
        this.targetY = targetY
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * acc[accLvl]) - acc[accLvl]) * Math.PI / 180
        this.dx = Math.cos(this.angle)
        this.dy = Math.sin(this.angle)

        //this.damage = Math.floor((Math.random() * (mg.damageMax - mg.damageMin + 1)) + mg.damageMin)
        this.damage = dmg[dmgLvl]

        var rand = Math.random() * 100

        if (rand < crt[crtLvl]) { crit = true}

        console.log('damage: ' + this.damage + ' rand: ' + rand + ' crit: ' + crit)

        if (crit == true) { this.damage *= 1.5; console.log('crit damage: ' + this.damage)} 

        this.update = function () {
            if (crit == true) { ctx.fillStyle = 'red'} 
            else { ctx.fillStyle = color} 
            this.x += this.dx * 8
            this.y += this.dy * 8
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        this.newPos = function () {
            if (this.x > totW || this.x < 0 || this.y > totH || this.y < 0) { return true} 
            return false
        }
        this.crashWith = function (otherobj) {
            var myleft = this.x
            var myright = this.x + (this.width)
            var mytop = this.y
            var mybottom = this.y + (this.height)
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


function loadMenu() {ctx.fillStyle = 'green'; ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'blue'; 
    ctx.fillRect(totW/2-200,totH/2-100,400,200); console.log('game loaded'); 
    gameState = states.menu;
    ctx.fillStyle = 'black'; ctx.font = '40px consolas'; ctx.fillText('Menu',115,140,100);
    ctx.font = '20px consolas'; ctx.fillText('points: '+points,230,140)
    ctx.beginPath(); ctx.moveTo(115,147); ctx.lineTo(370,147); ctx.stroke();
    //right buttons
    ctx.strokeRect(385,235,100,50); ctx.font = '30px consolas'; ctx.fillText('play',400,265);
    ctx.strokeRect(385,115,100,50); ctx.fillText('test',400,145)
    ctx.strokeRect(385,175,100,50); ctx.fillText('test2',400,205);
    //upgrade buttons 
    ctx.strokeRect(115,255,30,30); ctx.strokeRect(160,255,30,30); ctx.strokeRect(205,255,30,30);
    ctx.strokeRect(250,255,30,30); ctx.strokeRect(295,255,30,30); ctx.strokeRect(340,255,30,30);
    //upgrade indicators 1
    if (dmgLvl >= 1) {ctx.fillRect(115,235,30,15)} ctx.strokeRect(115,235,30,15)
    if (frtLvl >= 1) {ctx.fillRect(160,235,30,15)} ctx.strokeRect(160,235,30,15)
    if (accLvl >= 1) {ctx.fillRect(205,235,30,15)} ctx.strokeRect(205,235,30,15)
    if (crtLvl >= 1) {ctx.fillRect(250,235,30,15)} ctx.strokeRect(250,235,30,15)
    if (hltLvl >= 1) {ctx.fillRect(295,235,30,15)} ctx.strokeRect(295,235,30,15)
    if (gndLvl >= 1) {ctx.fillRect(340,235,30,15)} ctx.strokeRect(340,235,30,15)
    //2
    if (dmgLvl >= 2) {ctx.fillRect(115,215,30,15)} ctx.strokeRect(115,215,30,15)
    if (frtLvl >= 2) {ctx.fillRect(160,215,30,15)} ctx.strokeRect(160,215,30,15)
    if (accLvl >= 2) {ctx.fillRect(205,215,30,15)} ctx.strokeRect(205,215,30,15)
    if (crtLvl >= 2) {ctx.fillRect(250,215,30,15)} ctx.strokeRect(250,215,30,15)
    if (hltLvl >= 2) {ctx.fillRect(295,215,30,15)} ctx.strokeRect(295,215,30,15)
    if (gndLvl >= 2) {ctx.fillRect(340,215,30,15)} ctx.strokeRect(340,215,30,15)
    //3
    if (dmgLvl >= 3) {ctx.fillRect(115,195,30,15)} ctx.strokeRect(115,195,30,15)
    if (frtLvl >= 3) {ctx.fillRect(160,195,30,15)} ctx.strokeRect(160,195,30,15)
    if (accLvl >= 3) {ctx.fillRect(205,195,30,15)} ctx.strokeRect(205,195,30,15)
    if (crtLvl >= 3) {ctx.fillRect(250,195,30,15)} ctx.strokeRect(250,195,30,15)
    if (hltLvl >= 3) {ctx.fillRect(295,195,30,15)} ctx.strokeRect(295,195,30,15)
    if (gndLvl >= 3) {ctx.fillRect(340,195,30,15)} ctx.strokeRect(340,195,30,15)
    //4
    if (dmgLvl >= 4) {ctx.fillRect(115,175,30,15)} ctx.strokeRect(115,175,30,15)
    if (frtLvl >= 4) {ctx.fillRect(160,175,30,15)} ctx.strokeRect(160,175,30,15)
    if (accLvl >= 4) {ctx.fillRect(205,175,30,15)} ctx.strokeRect(205,175,30,15)
    if (crtLvl >= 4) {ctx.fillRect(250,175,30,15)} ctx.strokeRect(250,175,30,15)
    if (hltLvl >= 4) {ctx.fillRect(295,175,30,15)} ctx.strokeRect(295,175,30,15)
    if (gndLvl >= 4) {ctx.fillRect(340,175,30,15)} ctx.strokeRect(340,175,30,15)
    //5
    if (dmgLvl == 5) {ctx.fillRect(115,155,30,15)} ctx.strokeRect(115,155,30,15)
    if (frtLvl == 5) {ctx.fillRect(160,155,30,15)} ctx.strokeRect(160,155,30,15)
    if (accLvl == 5) {ctx.fillRect(205,155,30,15)} ctx.strokeRect(205,155,30,15)
    if (crtLvl == 5) {ctx.fillRect(250,155,30,15)} ctx.strokeRect(250,155,30,15)
    if (hltLvl == 5) {ctx.fillRect(295,155,30,15)} ctx.strokeRect(295,155,30,15)
    if (gndLvl == 5) {ctx.fillRect(340,155,30,15)} ctx.strokeRect(340,155,30,15)
    //upgrade names
    ctx.font = '15px consolas'; ctx.fillText('dmg',117,273); ctx.fillText('frt',162,273);
    ctx.fillText('acc',207,273); ctx.fillText('crt',252,273); ctx.fillText('hlt',297,273);
    ctx.fillText('gnd',342,273);
}



function levelLoop() {
    ctx.clearRect(0,0,totW,totH); ctx.fillStyle = 'skyblue'; ctx.fillRect(0,0,totW,totH)
    //grass
    ctx.beginPath(); ctx.lineWidth = 10; ctx.strokeStyle = 'green'; ctx.moveTo(0,totH); ctx.lineTo(totW,totH); ctx.stroke()
    //sun
    ctx.beginPath(); ctx.fillStyle = 'yellow'; ctx.arc(450,120,50,0,360); ctx.fill();
    //house main and windows
    ctx.beginPath(); ctx.fillStyle = 'maroon'; ctx.moveTo(50,totH-5); ctx.lineTo(50,totH-55); ctx.lineTo(100,totH-80); ctx.lineTo(150,totH-55);
    ctx.lineTo(150,totH-5); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'cornflowerblue'; ctx.fillRect(60,totH-40,15,15); ctx.fillRect(125,totH-40,15,15);
    //window frames
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.strokeRect(60,totH-40,15,15); ctx.strokeRect(125,totH-40,15,15);
    //outline
    ctx.beginPath(); ctx.moveTo(50,totH-5); ctx.lineTo(50,totH-55); ctx.lineTo(100,totH-80); ctx.lineTo(150,totH-55); ctx.lineTo(150,totH-5);
    //window detail 1
    ctx.moveTo(67.5,totH-40); ctx.lineTo(67.5,totH-25); ctx.moveTo(60,totH-32.5); ctx.lineTo(75,totH-32.5);
    //window detail 2
    ctx.moveTo(132.5,totH-40); ctx.lineTo(132.5,totH-25); ctx.moveTo(125,totH-32.5); ctx.lineTo(140,totH-32.5); ctx.stroke();
    //door with window
    ctx.fillStyle = 'white'; ctx.fillRect(92.5,totH-35,15,30); ctx.fillStyle = 'cornflowerblue'; ctx.fillRect(95,totH-32.5,10,10);
    //door window detail
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(100,totH-32.5); ctx.lineTo(100,totH-22.5); ctx.moveTo(95,totH-27.5); ctx.lineTo(105,totH-27.5); ctx.stroke();
    //door handle
    ctx.beginPath(); ctx.fillStyle = 'gray'; ctx.arc(96,totH-18,1.5,0,360); ctx.fill();
    //smoky roof thing
    ctx.beginPath(); ctx.moveTo(120,totH-70); ctx.lineTo(130,totH-70); ctx.lineTo(130,totH-65.5); ctx.closePath(); ctx.fill(); ctx.fillRect(120,totH-95,10,25);

    //healtbar+armorbar
    var healthPercentage = health / maxHealth;
    var armorPercentage = armor / maxArmor;
    ctx.fillStyle = 'white'
    ctx.fillRect(15,15,170,15)
    ctx.fillStyle = 'red';
    ctx.fillRect(45,20,140*healthPercentage,10)
    ctx.fillStyle = 'blue';
    ctx.fillRect(45,15,140*armorPercentage,5)
    ctx.lineWidth = 2; ctx.strokeStyle = 'black'; ctx.strokeRect(15,15,170,15)
    ctx.font = '15px consolas'; ctx.fillStyle = 'black'; ctx.fillText(Math.round(health),17,28)
    //points counter
    ctx.fillText(points,17,45); ctx.fillStyle = 'gold'; if (points.toString().length == 3) {ctx.fillRect(45,35,10,10);}
    else if (points.toString().length == 2) {ctx.fillRect(35,35,10,10)};
    //grenade counter
    ctx.fillStyle = 'black'
    ctx.fillText(grenades,17,60); ctx.fillStyle = 'darkslategray'; ctx.fillRect(27,50,10,10)

    //walk and jump
    var xInput, yInput; if(keys && (keys['a'] || keys['ArrowLeft'])) {xInput = -1}; 
    if (keys && (keys['d'] || keys['ArrowRight'])) {xInput = 1}; if (keys && (keys['w'] || keys['ArrowUp'])) {yInput = 1}
    
    //brikbrek
    arcadeTest.update();
    ctx.fillStyle = 'green'; ctx.fillRect(arcadeTest.x+2,arcadeTest.y+2,6,6)    
    if (player.x + player.width > arcadeTest.x - 20 && player.x < arcadeTest.x + arcadeTest.width + 20 && player.y + player.height > arcadeTest.y - 20 && player.y < arcadeTest.y + arcadeTest.height + 20) {
        ctx.fillStyle = 'black'; ctx.font = '12px consolas'; 
        ctx.fillText('[E]Play Brik-Brek',arcadeTest.x-50,arcadeTest.y-8);

        if (keys && keys['e']) {console.log('starting brik-brek'); clearInterval(levelInterval); gameState = states.brik; startBrikBrek()}
    }
    
    //pewpew
    arcade2.update();
    ctx.fillStyle = 'green'; ctx.fillRect(arcade2.x+2,arcade2.y+2,6,6)
    if (player.x + player.width > arcade2.x -20 && player.x < arcade2.x + arcade2.width + 20 && player.y + player.height > arcade2.y - 20 && player.y < arcade2.y + arcade2.height + 20) {
        ctx.fillStyle = 'black'; ctx.font = '12px consolas';
        ctx.fillText('[E]Play Pew-Pew',arcade2.x-47,arcade2.y-8);

        if (keys && keys['e']) {console.log('starting pew-pew'); clearInterval(levelInterval); gameState = states.pew; startPewPew()}
    }

    //render player
    player.update(xInput, yInput); pGun.update(); pGun.x = player.x + 20; pGun.y = player.y + 22; 
    //console.log('playerX: '+player.x+' playerY: '+player.y+' gunX: '+pGun.x+' gunY: '+pGun.y);
    

    floors.forEach(floor => {
        floor.update()
        if (player.floor(floor)) {
            player.y = floor.y - player.height;
            player.grounded = true;
        }
        else if (player.floorBottom(floor)) {
            player.y = floor.y + floor.height;
            player.fallSpeed = 0
        }
    })

    walls.forEach((wall,windex) => {
        wall.update()
        if (player.wallLeft(wall)) {
            player.x = wall.x - player.width
        }
        else if (player.wallRight(wall)) {
            player.x = wall.x + wall.width
        }

        if (wall.type == 'breakable') {
            projectiles.forEach((bullet,bundex) => {
                if (bullet.crashWith(wall))
                {
                    projectiles.splice(bundex,1)
                    walls.splice(windex,1)
                }
            })
        }

        else if (wall.type == 'gBreakable') {
            projectiles.forEach((bullet,bundex) => {
                if (bullet.crashWith(wall) && bullet.type == 'grenade')
                {
                    projectiles.splice(bundex,1)
                    walls.splice(windex,1)
                }
            })
        }
    })

    projectiles.forEach((bullet,index) => {
        bullet.update(); //console.log(projectiles)
        if (bullet.newPos())
        {
            projectiles.splice(index,1); console.log(bullet.type+' spliced')
        }
        if (bullet.type == 'enemi' && bullet.crashWith(player))
        {
            if (armor == 0)
            {
                projectiles.splice(index,1)
                health -= bullet.damage
                console.log('received '+bullet.damage+' damage')
            }   
            else if (armor > bullet.damage)
            {
                projectiles.splice(index,1)
                armor -= bullet.damage / 2
                health -= bullet.damage / 2
                console.log('received '+bullet.damage / 2+' damage, '+bullet.damage / 2+' damage absorbed by armor')
            }
            else if (armor > 0)
            {
                projectiles.splice(index,1)
                var reducedDamage = bullet.damage - armor
                var protected = bullet.damage - reducedDamage
                armor = 0
                health -= reducedDamage
                console.log('received '+reducedDamage+' damage, '+protected+' damage absorbed by armor')
            }
        }
        else if (bullet.type == 'frend')
        {
            enemies.forEach(enemi => {
                if (bullet.crashWith(enemi)){
                    projectiles.splice(index,1)
                    enemi.health -= bullet.damage
                }
            })
        }
    })

    pickups.forEach((pickup,index) => {
        pickup.update()
        if (player.crashWith(pickup)) {
            pickups.splice(index,1)
            if (pickup.type == 'points') {
                points += pickup.amount; console.log('gained '+pickup.amount+' points, have '+points); 
            }
            else if (pickup.type == 'health' && health < maxHealth) {
                health += pickup.amount; console.log('gained '+pickup.amount+' health, have '+health);
            }
            else if (pickup.type == 'armor' && armor < maxArmor) {
                armor += pickup.amount; console.log('gained '+pickup.amount+' armor, have '+armor); 
            }
            else if (pickup.type == 'grenade' && grenades < 9) {
                grenades += pickup.amount; console.log('picked '+pickup.amount+' grenade(s), have '+grenades)
            }
        }
    })
    
    if (health <= 0) 
    {
        console.log('deeeed'); clearInterval(levelInterval); ctx.fillStyle = 'maroon'; ctx.fillRect(0,0,totW,totH)
        ctx.fillStyle = 'crimson'; ctx.font = '35px consolas'; ctx.fillText('You died...',totW/2-200,totH/2);
        ctx.fillStyle = 'gray'; ctx.fillRect(player.x,totH-10,25,10); ctx.fillStyle = 'lightslategrey';
        ctx.fillRect(player.x+5,totH-16,5,12); setTimeout(loadMenu,3000);
    }  
}



function brikBrek() {
    ctx.fillStyle = 'skyblue'; ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'blue'; ctx.fillRect(135,50,335,350);
    ctx.fillStyle = 'white'; ctx.font = '60px consolas'; ctx.fillText('Brik-Brek',150,100);
    ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200); //console.log('paddle.x: '+paddle.x)
       
    
    for (var c = 0; c < bricks.columns; c++) {
        for (var r = 0; r < bricks.rows; r++) {
            if (brickArray[c][r].status > 0) {
                var b = brickArray[c][r];
                var brickX = c * (bricks.width + bricks.padding) + bricks.offsetLeft;
                var brickY = r * (bricks.height + bricks.padding) + bricks.offsetTop;
                b.x = brickX;
                b.y = brickY;
                if (brikLvl == 1) {
                    if (b.pUp == false) {
                        ctx.fillStyle = 'black'
                    }
                    else {
                        ctx.fillStyle = 'goldenrod'
                    }
                }
                else if (brikLvl == 2) {
                    if (b.pUp == false) {
                        if (b.status == 2) {ctx.fillStyle = 'black'}
                        else if (b.status == 1) {ctx.fillStyle = 'darkslategray'}
                    }
                    else {
                        if (b.status == 2) {ctx.fillStyle = 'goldenrod'}
                        else if (b.status == 1) {ctx.fillStyle = 'gold'}
                    }
                }
                else if (brikLvl == 3) {
                    if (b.pUp == false) {
                        if (b.status == 3) {ctx.fillStyle = 'black'}
                        else if (b.status == 2) {ctx.fillStyle = 'darkslategray'}
                        else if (b.status == 1) {ctx.fillStyle = 'lightslategray'}
                    }
                    else {
                        if (b.status == 3) {ctx.fillStyle = 'goldenrod'}
                        else if (b.status == 2) {ctx.fillStyle = 'gold'}
                        else if (b.status == 1) {ctx.fillStyle = 'yellow'}
                    }
                }
                else if (brikLvl >= 4) {
                    if (b.pUp == false) {
                        if (b.status == 4) {ctx.fillStyle = 'black'}
                        else if (b.status == 3) {ctx.fillStyle = 'darkslategray'}
                        else if (b.status == 2) {ctx.fillStyle = 'lightslategray'}
                        else if (b.status == 1) {ctx.fillStyle = 'white'}
                    }
                    else {
                        if (b.status == 4) {ctx.fillStyle = 'goldenrod'}
                        else if (b.status == 3) {ctx.fillStyle = 'gold'}
                        else if (b.status == 2) {ctx.fillStyle = 'yellow'}
                        else if (b.status == 1) {ctx.fillStyle = 'khaki'}
                    }
                }
                ctx.fillRect(brickX + 15,brickY + 15,bricks.width,bricks.height)
            }
        }
    }


    if (keys && (keys['a'] || keys['ArrowLeft'])) {
        if (paddle.x > 150) {
            paddle.x -= paddle.speed;
        }
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.arc(250,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'white'; ctx.fillText('A',233,377)
    }
    else {
        ctx.fillStyle = 'maroon'; ctx.beginPath()
        ctx.arc(250,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.arc(250,350,30,0,360); ctx.fill()
        ctx.fillStyle = 'white'; ctx.fillText('A',233,367)
    }
    
    
    if (keys && (keys['d'] || keys['ArrowRight'])) {
        if ((paddle.x < 405 && paddle.width == 50)||(paddle.x < 380 && paddle.width == 75)||(paddle.x < 355 && paddle.width == 100)) {
            paddle.x += paddle.speed;
        }
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.arc(350,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'white'; ctx.fillText('B',333,377)
    }
    else {
        ctx.fillStyle = 'maroon'; ctx.beginPath()
        ctx.arc(350,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.arc(350,350,30,0,360); ctx.fill()
        ctx.fillStyle = 'white'; ctx.fillText('B',333,367)
    }

    ctx.fillStyle = 'black'; ctx.font = '13px consolas'; ctx.fillText('Press [Q] to quit',10,totH-10)
    
    ctx.font = '16px consolas'; ctx.fillText('♥'+brikLives,155,270)

    if (msgTime > 0) {msgTime -= 0.02; ctx.font = '25px consolas'; ctx.fillText(msgText,totW/2-80,230)}

    if (shieldTime > 0) {
        shieldTime -= 0.02; ctx.lineWidth = 5; ctx.beginPath(); 
        if (shieldTime > 1) {ctx.strokeStyle = 'darkblue'}
        else {ctx.strokeStyle = 'darkred'}
        ctx.lineTo(150,306); ctx.lineTo(455,306); ctx.stroke()
    }

    ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);

    if (explodeTime > 0) {explodeTime -= 0.02}

    brikBalls.forEach(bBall => {
        bBall.x += bBall.xSpeed;
        bBall.y += bBall.ySpeed;
        if (explodeTime > 0) {ctx.fillStyle = 'red'}
        else {ctx.fillStyle = 'black'}
        ctx.fillRect(bBall.x,bBall.y,ball.size,ball.size);
    })
    
    
    //ball hitting edges
    brikBalls.forEach((b,index) => {
        if ( b.y < 115 ) { b.ySpeed = -b.ySpeed; }
        if ( b.x < 150 || b.x > 455 - ball.size ) { b.xSpeed = -b.xSpeed; }
        if ( b.y > 303 ) {
            if (shieldTime <= 0) {
                if (brikBalls.length == 1) {
                    if (brikLives == 0) {
                        clearInterval(levelInterval); console.log('failed'); ctx.font = '45px consolas';
                        ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200); ctx.fillStyle = 'black';
                        ctx.fillText('Game over',190,200); brikLvl = 1; setTimeout(startBrikBrek,2000);
                        shieldTime = 0; msgTime = 0; explodeTime = 0;
                    }
                    else {brikLives -= 1; b.x = totW/2 - 5; b.y = totH - 125; b.xSpeed = 1; b.ySpeed = -3;}
                }
                else {brikBalls.splice(index,1)}
            }
            else {b.ySpeed = -b.ySpeed; shieldTime = 0; msgTime = 0}
        }
    })
    

    
    //ball hitting bricks
    for (var c = 0; c < bricks.columns; c++) {
        for (var r = 0; r < bricks.rows; r++) {
            var b = brickArray[c][r];
            if (b.status > 0) {
                //console.log('ballX: '+ball.x+' brickX: '+b.x+' ballY: '+ball.y+' brickY: '+b.y)
                brikBalls.forEach(baller => {
                    if (baller.x + ball.size > b.x+15 && baller.x < b.x + bricks.width+15 && baller.y + ball.size > b.y+15 && baller.y < b.y + bricks.height+15) {
                        console.log('hit')
                        baller.ySpeed = -baller.ySpeed;
                        if (explodeTime <= 0) {b.status -= 1;}
                        else {
                            b.status -= 2;
                            brickArray[c][r].status -= 1
                        }
                        if (b.status <= 0) {
                           brickCount-- 
                           console.log(brickCount)
                           if (b.pUp == true) {
                                var pup = Math.floor(Math.random() * 5)
                                msgTime = 2
                                switch (pup) {
                                    case 0:
                                        msgText = 'shield';
                                        shieldTime = 10; 
                                    break;
                                    case 1:
                                        msgText = 'bigger paddle';
                                        paddle.width += 25;
                                    break;
                                    case 2:
                                        msgText = 'extra life';
                                        brikLives += 1;
                                    break;
                                    case 3:
                                        msgText = 'extra ball';
                                        brikBalls.push({x:ball.x,y:ball.y,xSpeed:ball.xSpeed,ySpeed:ball.ySpeed});
                                    break;
                                    case 4:
                                        msgText = 'explosive ball';
                                        explodeTime = 8;
                                    break;
                                }
                            }
                        } 
                    }
                })
            }
        }
    }

    if (brickCount == 0) {
        clearInterval(levelInterval); console.log('win!'); ctx.font = '23px consolas';
        ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200); ctx.fillStyle = 'black';
        ctx.fillText('brik-breking completed!',160,180); ctx.fillText('Level '+brikLvl,250,230);
        shieldTime = 0; msgTime = 0; explodeTime = 0;
        setTimeout(() => {console.log('level up'); brikLvl++; ctx.fillStyle = 'green'; ctx.fillRect(230,205,140,40)},2000);
        setTimeout(() => {ctx.fillStyle = 'black'; ctx.fillText('Level '+brikLvl,250,230)},3000); setTimeout(startBrikBrek,5000);
    }


    //ball hitting paddle
    brikBalls.forEach(baller => {
        if ( baller.x > paddle.x && baller.y > paddle.y - ball.size && baller.y < paddle.y + paddle.height && baller.x < paddle.x + paddle.width )
        {   
            var hitPos = (baller.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);

            var refAngle = hitPos * (Math.PI / 4);

            var speed = Math.sqrt(baller.xSpeed * baller.xSpeed + baller.ySpeed * baller.ySpeed);

            baller.xSpeed = speed * Math.sin(refAngle);
            baller.ySpeed = -speed * Math.cos(refAngle);

            baller.y = paddle.y - ball.size;
        }
    })

    if (keys && keys['q']) {
        clearInterval(levelInterval); gameState = states.level; console.log('exiting brik-brek');
        levelInterval = setInterval(levelLoop,20)
    }

}


function pewPew() {
    ctx.fillStyle = 'skyblue'; ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'black'; ctx.fillRect(135,50,335,350);
    ctx.fillStyle = 'white'; ctx.font = '60px consolas'; ctx.fillText('Pew-Pew',185,100);
    ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200);
    if (fireCool > 0) {fireCool -= 0.02}
    if (spawnCool > 0) {spawnCool -= 0.02}
    if (hurtCool > 0) {hurtCool -= 0.02}
    time += 0.02;
    ctx.fillStyle = 'black'; ctx.font = '13px consolas'; ctx.fillText('Press [Q] to quit',10,totH-10)

    arrow.angle = arrow.angle % 360; 
    if (arrow.angle > 180) {
        arrow.angle -= 360; // Adjust to be within -180 to 180 degrees
    } 
    else if (arrow.angle < -180) {
        arrow.angle += 360;
    }

    //left button
    if (keys && (keys['a'] || keys['ArrowLeft'])) {
        arrow.angle -= 3;
        ctx.fillStyle = 'crimson'; ctx.beginPath();
        ctx.moveTo(220,360); ctx.lineTo(255,330); 
        ctx.lineTo(265,330); ctx.lineTo(265,390);
        ctx.lineTo(255,390); ctx.closePath(); ctx.fill()
        
    }
    else {
        ctx.fillStyle = 'maroon'; ctx.beginPath()
        ctx.moveTo(220,360); ctx.lineTo(220,350);
        ctx.lineTo(265,350); ctx.lineTo(265,390);
        ctx.lineTo(255,390); ctx.closePath(); ctx.fill()
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.moveTo(220,350); ctx.lineTo(255,320);
        ctx.lineTo(265,320); ctx.lineTo(265,380);
        ctx.lineTo(255,380); ctx.closePath(); ctx.fill()
    }
    
    //middle button
    if (keys && (keys['s'] || keys['ArrowDown'])) {
        if (fireCool <= 0) {
            fireCool = 0.5; 
            arrow.sx = arrow.speed * Math.cos((arrow.angle - 90) * Math.PI / 180)
            arrow.sy = arrow.speed * Math.sin((arrow.angle - 90) * Math.PI / 180)
            arrowPArray.push({x:arrow.centerX,y:arrow.centerY,xSpeed:arrow.sx * 3,ySpeed:arrow.sy * 3,type:'frend'})
        }
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.arc(300,370,20,0,360); ctx.fill()
    }
    else {
        ctx.fillStyle = 'maroon'; ctx.beginPath()
        ctx.arc(300,370,20,0,360); ctx.fill()
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.arc(300,360,20,0,360); ctx.fill()
    }
    
    //top button
    if (keys && (keys['w'] || keys['ArrowUp'])) {
        arrow.speed = 1;
        arrow.dx = arrow.speed * Math.cos((arrow.angle - 90) * Math.PI / 180)
        arrow.dy = arrow.speed * Math.sin((arrow.angle - 90) * Math.PI / 180)
        arrowPArray.push({x:arrow.centerX,y:arrow.centerY,xSpeed:-arrow.dx + Math.random() - 1,ySpeed:-arrow.dy + Math.random() - 1,lifeTime:0,type:'particle'})
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.moveTo(300,320); ctx.lineTo(270,335)
        ctx.lineTo(270,340); ctx.lineTo(330,340)
        ctx.lineTo(330,335); ctx.closePath(); ctx.fill()
    }
    else {
        ctx.fillStyle = 'maroon'; ctx.beginPath()
        ctx.moveTo(270,330); ctx.lineTo(270,340);
        ctx.lineTo(330,340); ctx.lineTo(330,330);
        ctx.closePath(); ctx.fill()
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.moveTo(300,310); ctx.lineTo(270,325)
        ctx.lineTo(270,330); ctx.lineTo(330,330)
        ctx.lineTo(330,325); ctx.closePath(); ctx.fill()
    }

    //right button
    if (keys && (keys['d'] || keys['ArrowRight'])) {
        arrow.angle += 3
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.moveTo(380,360); ctx.lineTo(345,330)
        ctx.lineTo(335,330); ctx.lineTo(335,390);
        ctx.lineTo(345,390); ctx.closePath(); ctx.fill()
    }
    else {
        ctx.fillStyle = 'maroon'; ctx.beginPath()
        ctx.moveTo(380,360); ctx.lineTo(380,350);
        ctx.lineTo(335,350); ctx.lineTo(335,390);
        ctx.lineTo(345,390); ctx.closePath(); ctx.fill()
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.moveTo(380,350); ctx.lineTo(345,320)
        ctx.lineTo(335,320); ctx.lineTo(335,380);
        ctx.lineTo(345,380); ctx.closePath(); ctx.fill()
    }

    arrow.frontPoint.x += arrow.dx;
    arrow.frontPoint.y += arrow.dy;
    arrow.backLeftPoint.x += arrow.dx;
    arrow.backLeftPoint.y += arrow.dy;
    arrow.backRightPoint.x += arrow.dx;
    arrow.backRightPoint.y += arrow.dy;
    arrow.centerX += arrow.dx;
    arrow.centerY += arrow.dy;

    //draw arrow
    ctx.save(); // Save the current state
    ctx.translate(arrow.centerX, arrow.centerY); // Move the origin to the center
    ctx.rotate(arrow.angle * Math.PI / 180); // Rotate the canvas
    ctx.translate(-arrow.centerX, -arrow.centerY); // Move the origin back
    ctx.fillStyle = 'white'; ctx.beginPath();
    ctx.moveTo(arrow.frontPoint.x,arrow.frontPoint.y);
    ctx.lineTo(arrow.backLeftPoint.x,arrow.backLeftPoint.y);
    ctx.lineTo(arrow.backRightPoint.x,arrow.backRightPoint.y);
    ctx.closePath(); ctx.fill() // Draw the triangle
    ctx.restore(); // Restore the original state
    //console.log('angle: '+arrow.angle+' dx: '+arrow.dx+' dy: '+arrow.dy)

    //spawn asteroids
    if (spawnCool <= 0) {
        spawnCool = 3; 
        var sides = Math.floor(Math.random() * 10 + 5);
        var asteroid = [];
        var radius = Math.random() * 15 + 10;
        var astX = Math.random() * 300 + 150;
        var astY = Math.random() * 200 + 115;
        var xSpeed = Math.random() * 2 - 1;
        var ySpeed = Math.random() * 2 - 1;
        var rotation = Math.random() * 4 -2;
        var health = Math.floor((radius - 10) / 15 * (8 - 3) + 3)

        for (var s = 0; s < sides; s++) {
            var angle = (Math.PI * 2 / sides) * s;
            var x = astX + Math.cos(angle) * (radius + Math.random() * 10 - 5);
            var y = astY + Math.sin(angle) * (radius + Math.random() * 10 - 5);
            asteroid.push({ x: x, y: y });
        }
        
        asteroid.push({xPos:astX, yPos:astY, dx:xSpeed, dy:ySpeed, rot:rotation, angle:0, radius:radius, hp:health, score:health})

        pewEnemies.push(asteroid)
        console.log(pewEnemies)
    }
    
    //move asteroids
    pewEnemies.forEach(steroid => {
        var last = steroid[steroid.length - 1]
        
        last.xPos += last.dx;
        last.yPos += last.dy;

        for (var i = 0; i < steroid.length-1; i++) {
            steroid[i].x += last.dx;
            steroid[i].y += last.dy;
        }
    })

    //draw asteroids
    pewEnemies.forEach(steroid => {
        var last = steroid[steroid.length - 1];
        last.angle += last.rot;

        ctx.save();
        ctx.translate(last.xPos, last.yPos); 
        ctx.rotate(last.angle * Math.PI / 180); 
        ctx.translate(-last.xPos, -last.yPos)

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(steroid[0].x, steroid[0].y);
        for (var i = 1; i < steroid.length; i++) {
            ctx.lineTo(steroid[i].x, steroid[i].y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    });


    //asteroid wall collisions
    pewEnemies.forEach(roid => {
        var last = roid[roid.length - 1];
                
        if (last.xPos - last.radius < 152 || last.xPos + last.radius > 453) {
            last.dx = -last.dx;
            if (last.xPos - last.radius < 150) {
                last.xPos += 10
                for (var i = 0; i < roid.length-1; i++) {
                    roid[i].x += 10;
                }
            }
            if (last.xPos + last.radius > 455) {
                last.xPos -= 10
                for (var i = 0; i < roid.length-1; i++) {
                    roid[i].x -= 10;
                }
            }
        }
        
        if (last.yPos - last.radius < 117 || last.yPos + last.radius > 313) {
            last.dy = -last.dy;
            if (last.yPos - last.radius < 115) {
                last.yPos += 10
                for (var i = 0; i < roid.length-1; i++) {                    
                    roid[i].y += 10;
                }
            }
            if (last.yPos + last.radius > 315) {
                last.yPos -= 10
                for (var i = 0; i < roid.length-1; i++) {
                    roid[i].y -= 10;
                }
            }
        }
    })


    //asteroid player collisions
    pewEnemies.forEach(aroid => {
        var last = aroid[aroid.length - 1];
        if (arrow.centerX > last.xPos - last.radius && arrow.centerX < last.xPos + last.radius
            && arrow.centerY > last.yPos - last.radius && arrow.centerY < last.yPos + last.radius
        ) 
        {
            arrow.dx = -arrow.dx; arrow.dy = -arrow.dy; 
            arrow.frontPoint.x += arrow.dx * 15;
            arrow.frontPoint.y += arrow.dy * 15;
            arrow.backLeftPoint.x += arrow.dx * 15;
            arrow.backLeftPoint.y += arrow.dy * 15;
            arrow.backRightPoint.x += arrow.dx * 15;
            arrow.backRightPoint.y += arrow.dy * 15;
            arrow.centerX += arrow.dx * 15;
            arrow.centerY += arrow.dy * 15;
            if (hurtCool <= 0) {arrow.health -= 1; hurtCool = 2}
        }
    })   
     
    //draw time, score and health
    ctx.fillStyle = 'white';
    ctx.font = '18px consolas';
    ctx.fillRect(155,120,10,15);
    if (arrow.health >= 2) {
        ctx.fillRect(167.5,120,10,15);
    }
    if (arrow.health >= 3) {
        ctx.fillRect(180,120,10,15);
    }
    if (arrow.health >= 4) {
        ctx.fillRect(192.5,120,10,15);
    }
    if (arrow.health == 5) {
        ctx.fillRect(205,120,10,15);
    }
    ctx.fillText(Math.floor(time),155,150);
    ctx.fillText(score,155,165);

    //collide with sides
    if ( arrow.frontPoint.y < 117 || arrow.backLeftPoint.y < 117 || arrow.backRightPoint.y < 117) {
        arrow.dy = -arrow.dy; 
        if (arrow.frontPoint.y < 115 || arrow.backLeftPoint.y < 115 || arrow.backRightPoint.y < 115) {
            arrow.centerY += 10; arrow.frontPoint.y += 10;
            arrow.backLeftPoint.y += 10; arrow.backRightPoint.y += 10
        }
    }
    if ( arrow.frontPoint.x < 152 || arrow.backLeftPoint.x < 152 || arrow.backRightPoint.x < 152) {
        arrow.dx = -arrow.dx; 
        if (arrow.frontPoint.x < 150 || arrow.backLeftPoint.x < 150 || arrow.backRightPoint.x < 150) {
            arrow.centerX += 10; arrow.frontPoint.x += 10;
            arrow.backLeftPoint.x += 10; arrow.backRightPoint.x += 10
        }
    }
    if ( arrow.frontPoint.x > 453 || arrow.backLeftPoint.x > 453 || arrow.backRightPoint.x > 453) {
        arrow.dx = -arrow.dx;
        if (arrow.frontPoint.x > 455 || arrow.backLeftPoint.x > 455 || arrow.backRightPoint.x > 455) {
            arrow.centerX -= 10; arrow.frontPoint.x -= 10;
            arrow.backLeftPoint.x -= 10; arrow.backRightPoint.x -= 10
        }
    }
    if ( arrow.frontPoint.y > 313 || arrow.backLeftPoint.y > 313 || arrow.backRightPoint.y > 313) {
        arrow.dy = -arrow.dy; 
        if (arrow.frontPoint.y > 315 || arrow.backLeftPoint.y > 315 || arrow.backRightPoint.y > 315) {
            arrow.centerY -= 10; arrow.frontPoint.y -= 10;
            arrow.backLeftPoint.y -= 10; arrow.backRightPoint.y -= 10
        }
    }
    
    
    //draw and collide projectiles
    arrowPArray.forEach((bullet,bIndex) => {
        bullet.x += bullet.xSpeed;
        bullet.y += bullet.ySpeed;
        ctx.fillStyle = 'white';
        if (bullet.x < 152 || bullet.x > 453 || bullet.y < 117 || bullet.y > 313) {
            arrowPArray.splice(bIndex,1)
        }

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
        else if (bullet.type == 'particle') {
            bullet.lifeTime += 0.02;
            ctx.fillRect(bullet.x,bullet.y,2,2);
            if (bullet.lifeTime > 1) {
                arrowPArray.splice(bIndex,1)
            }
        }
        
    })

    if (arrow.health == 0) {
        clearInterval(levelInterval); console.log('finished'); ctx.font = '45px consolas';
        ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200); ctx.fillStyle = 'white';
        ctx.textAlign = 'center'; ctx.fillText('Game over',300,200);
        setTimeout(() => {ctx.font = '20px consolas'; ctx.fillText('time: '+Math.floor(time),300,240)},2000)
        setTimeout(() => {ctx.fillText('score: '+score,300,260)},3000)
        checkHighScore(score); window.addEventListener('keypress', nameInput) 
        
        if (canEnterName == true) {
            setTimeout(() => {ctx.fillText('new highscore',300,290)},4000)
            setTimeout(() => {
                ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,190);
                ctx.textAlign = 'left';
                ctx.fillStyle = 'white'; ctx.font = "30px Consolas"; ctx.fillText('submit score', totW/2- 100, 190);
                ctx.font = '50px Consolas'; ctx.fillText('NAME', totW/2 - 55, 240 )
                ctx.beginPath(); ctx.strokeStyle = 'white';
                ready = true;
                ctx.moveTo(totW/2 - 60, 200); ctx.lineTo(360, 200);  
                ctx.lineTo(360, 250); ctx.lineTo(totW/2 - 60, 250);
                ctx.lineTo(totW/2 - 60, 200); ctx.stroke();                      
            },6000)
        }
        else { setTimeout(showHighScores,5000) }
    }

    if (keys && keys['q']) {
        clearInterval(levelInterval); gameState = states.level; console.log('exiting pew-pew');
        levelInterval = setInterval(levelLoop,20)
    }
}

function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    
    const pos1 = highScores[0] ?? null; console.log(pos1); 
    if (pos1 != null) {
        var pos1Name = pos1.NAMER; var pos1Score = pos1.score; var pos1Time = pos1.timer;
        console.log(pos1Name+'  '+pos1Score+'  '+pos1Time);
    }

    const pos2 = highScores[1] ?? null; console.log(pos2);
    if (pos2 != null) {
        var pos2Name = pos2.NAMER; var pos2Score = pos2.score; var pos2Time = pos2.timer;
        console.log(pos2Name+'  '+pos2Score+'  '+pos2Time);
    }

    const pos3 = highScores[2] ?? null; console.log(pos3);
    if (pos3 != null) {
        var pos3Name = pos3.NAMER; var pos3Score = pos3.score; var pos3Time = pos3.timer;
        console.log(pos3Name+'  '+pos3Score+'  '+pos3Time);
    }

    const pos4 = highScores[3] ?? null; console.log(pos4);
    if (pos4 != null) {
        var pos4Name = pos4.NAMER; var pos4Score = pos4.score; var pos4Time = pos4.timer;
        console.log(pos4Name+'  '+pos4Score+'  '+pos4Time);
    }

    ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200);
    ctx.fillStyle = 'white'; ctx.font = '30px consolas'; ctx.fillText('scoreboard', 300,150);
    ctx.font = '15px consolas'; ctx.fillText('pos name score time',300,175)
    
    ctx.font = '20px consolas';

    if (pos1 == null) {ctx.fillText('1 NAME - NaN - NaN', 300, 205)}
    else {ctx.fillText('1 '+pos1Name+' - '+pos1Score+' - '+pos1Time, 300,205)}

    if (pos2 == null) {ctx.fillText('2 NAME - NaN - NaN', 300, 235)}
    else {ctx.fillText('2 '+pos2Name+' - '+pos2Score+' - '+pos2Time, 300, 235)}

    if (pos3 == null) {ctx.fillText('3 NAME - NaN - NaN', 300, 265)}
    else {ctx.fillText('3 '+pos3Name+' - '+pos3Score+' - '+pos3Time, 300, 265)}

    if (pos4 == null) {ctx.fillText('4 NAME - NaN - NaN', 300, 295)}
    else {ctx.fillText('4 '+pos4Name+' - '+pos4Score+' - '+pos4Time, 300, 295);}

    ctx.beginPath(); 
    ctx.moveTo(200, 180); ctx.lineTo(400, 180);
    ctx.moveTo(200, 210); ctx.lineTo(400, 210); 
    ctx.moveTo(200, 240); ctx.lineTo(400, 240); 
    ctx.moveTo(200, 270); ctx.lineTo(400, 270); 
    ctx.moveTo(200, 300); ctx.lineTo(400, 300); 
    ctx.stroke();
}


function nameInput(e) {
    key = e.keyCode
    console.log(key)
    if (canEnterName == true && ready == true && ((key >= 65 && key <= 90) || (key >= 97 && key <= 122))) {
        switch (keysEntered) {
            case 0:
                ctx.fillStyle = 'green'; ctx.fillRect(totW/2 -57, 203, 114, 43); ctx.font = '50px Consolas'; 
                ctx.fillStyle = 'white'; keysEntered++; n = String.fromCharCode(key); console.log(n);           
                ctx.fillText(n.toUpperCase(), totW/2 - 55, 240);
            break;
            case 1:
                keysEntered++; a = String.fromCharCode(key); console.log(a);
                ctx.fillText(a.toUpperCase(), totW/2 - 28, 240); 
            break;
            case 2:
                keysEntered++; m = String.fromCharCode(key); console.log(m);
                ctx.fillText(m.toUpperCase(),totW/2 - 1, 240);
            break;
            case 3:
                ctx.fillText(String.fromCharCode(key).toUpperCase(), totW/2 + 26, 240);
                keysEntered++; namer = n+a+m+String.fromCharCode(key); NAMER = namer.toUpperCase();
                console.log('your name is = '+NAMER); saveHighScore(score,time); canEnterName = false; ready = false;
                ctx.font = '20px consolas'; ctx.textAlign = 'center'; ctx.fillText('score added, press enter',300,290)
            break;
        }
    }

    if (key == 13 && keysEntered == 4) {showHighScores();}
    if (key == 114 && (keysEntered == 4 || canEnterName == false)) {keysEntered = 0; startPewPew()}

    if (key == 32) {localStorage.clear()}

    if (key == 113) {
        gameState = states.level; console.log('exiting pew-pew'); ctx.textAlign = 'left';
        levelInterval = setInterval(levelLoop,20); keysEntered = 0; removeEventListener('keypress',nameInput)
    }
}