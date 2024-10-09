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
var grenades = 1
var grenadeCool = true
var maxHealth = hlt[hltLvl]
var maxArmor = 25
//inputs n stuff
var stopit = false
var keyPress, keys
const SPEED = 2
var levelInterval
var fireInterval
//sprites
var player, pGun, arcadeTest, arcade2
//brik-brek
var ball, paddle, bricks, brikBalls = [], brikLives = 0 
var brickArray = [], brickCount = 0, brikLvl = 1
var msgText, msgTime = 0, shieldTime = 0, explodeTime = 0

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
    //if (!stopit)
    /*{stopit = true; keyPress = e.key; console.log(keyPress);}*/
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
        //setTimeout(startBrikBrek,2000)
    }
    else if (gameState == states.menu || gameState == states.level || gameState == states.paused || gameState == states.brik)
    {
        if (gameState == states.level || gameState == states.brik) {clearInterval(levelInterval)}
        
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


function pause() {
    if (gameState == states.level) {prevState = 1}
    else if (gameState == states.brik) {prevState = 2}

    if (gameState == states.level || gameState == states.brik) {
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
    }
}

function checkButt(mButt){
    if (gameState == states.menu){
        if (buttClicked(400,250,100,50)){
            console.log('clicked play button'); 
            player = new character(40,200,10,25,'gray');
            pGun = new gun(40,300,12,5)
            arcadeTest = new Obstacle(450,totH-75,10,20,'blue')
            arcade2 = new Obstacle(536,totH-99,10,20,'black')
            //pickup test
            pickups.push(new character(totW/2,totH-15,5,5,'green','points',15))
            pickups.push(new character(totW/2+10,totH-15,5,5,'red','health',20))
            pickups.push(new character(totW/2+20,totH-15,5,5,'darkblue','armor',10))
            pickups.push(new character(totW/2+30,totH-15,5,5,'darkslategrey','grenade',1))
            //obstacle test
            floors.push(new Obstacle(300,totH-32,60,5,'gray'))
            floors.push(new Obstacle(430,totH-55,50,5,'gray'))
            floors.push(new Obstacle(515,totH-79,59,5,'gray'))
            walls.push(new Obstacle(320,totH-105,5,75,'gray'))
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
        this.floor = function (otherobj) {
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
        this.floorBottom = function (otherobj) {
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
        this.wallLeft = function (otherobj) {
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
        this.wallRight = function (otherobj) {
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
    //grenade counter
    ctx.fillText(grenades,17,45); ctx.fillStyle = 'darkslategray'; ctx.fillRect(27,35,10,10)
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
        ctx.fillText('[E]Play Pew-Pew',arcade2.x-50,arcade2.y-8);

        if (keys && keys['e']) {console.log('starting pew-pew'); clearInterval(levelInterval); gameState = states.pew;}
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

    walls.forEach(wall => {
        wall.update()
        if (player.wallLeft(wall)) {
            player.x = wall.x - player.width
        }
        else if (player.wallRight(wall)) {
            player.x = wall.x + wall.width
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
                                var pup = 4 //Math.floor(Math.random() * 5)
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
