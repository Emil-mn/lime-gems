//canvas stuff
var can = document.getElementById('canvas')
var totW = can.width
var totH = can.height
var musx, musy
var clickX, clickY
var ctx = can.getContext("2d")
//states stuff
var states = {stopped:0,menu:1,intro:2,level:3,paused:4,brik:5,pew:6,slot:7,brik2:8}
var gameState = states.stopped
var prevState
//weapon stuff
var dmgLvl = 0,frtLvl = 0
var accLvl = 0,crtLvl = 0
var hltLvl = 0,gndLvl = 0
var dmgPrice = [10,15,26,48,64,'Max']
var frtPrice = [10,15,26,48,64,'Max']
var accPrice = [10,15,26,48,64,'Max']
var crtPrice = [10,15,26,48,64,'Max']
var hltPrice = [10,15,26,48,64,'Max']
var gndPrice = [10,15,26,48,64,'Max']
var dmg = [1,2,4,6,8,10,'Max']
var frt = [800,700,600,500,400,300,'Max']
var acc = [6,5,4,3,2,1,'Max']
var crt = [5,10,15,20,25,30,'Max']
var hlt = [50,75,100,125,150,200,'Max']
var gnd = [1,2,3,4,5,6,'Max']
//array stuff
var enemies = []
var guns = []
var projectiles = []
var pickups = []
var floors = []
var walls = []
//char stat stuff
var points = 0
var health
var armor
var grenades = 0
var grenadeCool = true
var maxHealth = hlt[hltLvl]
var maxArmor = 25
var keyCards = [false,false,false,false,false]
//inputs n misc stuff
var keys
const SPEED = 2
var levelInterval
var fireInterval
var level = 1
var demo = false
var showingInfo = false
var scrolled = false
var infoX = [105,185,190,270,275,355,360,450,455,535,540]
//intro stuff
var introTime = 0
var messageThingY = 0
var playerX = 125
var playerY = totH-30
var hueyX, hueyY, hueyAngle = -10
var hueyArray = [
    370,250,370,240,360,220,345,220,340,205,295,205,290,220,195,220,180,190,170,190,180,
    220,180,230,270,250,280,260,370,260,290,260,290,270,280,270,370,270,375,265,360,260,
    360,270,310,205,310,200,325,200,325,205,317.5,205,317.5,190,200,190,435,190,185,225,
    165,225,205,225,185,225,370,240,355,240,355,220,360,220,370,250,370,250,290,225,290,
    245,300,245,297,245,297,255,345,245,335,245,338,245,338,255
]
for (i = 0; i < hueyArray.length; i++) {
    //x movement
    if (i % 2 == 0) {hueyArray[i] -= 400;}
    //y movement
    else {hueyArray[i] -= 150;}
}
//level 1 stuff
var gunTimer = 0, greenLight = false; gunSight = 0, trapDoor = false
var speakers = [{x:0,y:0},{x:215,y:-20},{x:415,y:80},{x:389,y:80},{x:-90,y:35},{x:34,y:190},{x:234,y:190},{x:429,y:190}]
var triggerX = [120,310,585,]
var dialogX = []
var dialogY = []
var dialogTriggered = [false,false,false,false,false,false,false,false,false,false,false,false]
var dialogTimer = [0,0,0,0,0,0,0,0,0,0,0,0]
//sprites
var player, pGun, arcadeTest, arcade2, arcade3, arcade4
var arcadeGrad = ctx.createLinearGradient(205,235,205,255); arcadeGrad.addColorStop(0,'green'); arcadeGrad.addColorStop(1,'blue')
var arcadeGradBig = ctx.createLinearGradient(totW/2,50,totW/2,1050); arcadeGradBig.addColorStop(0,'green'); arcadeGradBig.addColorStop(1,'blue')
//brik-brek
var ball, paddle, bricks, brikBalls = [], brikLives = 0 
var brickArray = [], brickCount = 0, brikLvl = 1
var msgText, msgTime = 0, shieldTime = 0, explodeTime = 0
//brik-brek 2
var ball2, paddle2, brik2Balls = [], brik2Lives = 0, brik2Lvl = 1
var brikTime = 0
//pew-pew
var arrow, arrowPArray = [], fireCool = 0, hurtCool = 0
var time, score, pewEnemies = [], spawnCool, justReleased = false
//slot-man
var credits = 0, showingHud = 0, cPressed = false, mPressed = false, lit = 1, spinning = false, actuallySpinning = false, mode = 'auto', cost = 5
var slowing1 = false, slowing2 = false, slowing3 = false, slowing4 = false, slowing5 = false, slowing6 = false
var light1 = true, light2 = true, light3 = true, light4 = true, light5 = true
var addedCoins = 0, addedGrenades = 0, addedHealth = 0, addedArmor = 0;
var rewards = ['oneCoin','twoCoins','threeCoins','moneyBag','moneyChest','grenade','twoGrenades','oneHeart','twoHearts','armor']
var coin = new Image(), twoCoins = new Image(), threeCoins = new Image(), moneyBag = new Image(), moneyChest = new Image();
var grenade = new Image(), twoGrenades = new Image(), oneHeart = new Image(), twoHearts = new Image(), newArmor = new Image();
coin.src = 'oneCoin.png'; twoCoins.src = 'twoCoins.png'; threeCoins.src = 'threeCoins.png'; moneyBag.src = 'moneyBag.png'; moneyChest.src = 'moneyChest.png';
grenade.src = 'grenade.png'; twoGrenades.src = 'twoGrenades.png'; oneHeart.src = 'oneHeart.png'; twoHearts.src = 'twoHearts.png'; newArmor.src = 'armor.png';
var roll1 = [], roll2 = [], roll3 = []
var roll4 = [], roll5 = [], roll6 = []
var roll1X = 150, roll2X = 200.833, roll3X = 251.666
var roll4X = 302.5, roll5X = 353.333, roll6X = 404.166
var rolls = [[roll1,roll1X],[roll2,roll2X],[roll3,roll3X],[roll4,roll4X],[roll5,roll5X],[roll6,roll6X]]
var spinTime = 0, spinDuration, offset1 = 0, offset2 = 0, offset3 = 0, offset4 = 0, offset5 = 0;
var speed1 = 0, speed2 = 0, speed3 = 0, speed4 = 0, speed5 = 0, speed6 = 0;
var speeds = [speed1,speed2,speed3,speed4,speed5,speed6]
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
        if (gameState != states.menu)  
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

    ball = {
        x: totW/2 - 5,
        y: totH - 125,
        size: 5,
        xSpeed: 0,
        ySpeed: -3 
    }
    
    brikBalls = [{x:ball.x,y:ball.y,xSpeed:ball.xSpeed,ySpeed:ball.ySpeed,extraSize:0}]

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
                case 5:
                    var pUpChance = 6
                    break;
                default:
                    var pUpChance = 5
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

function startBrikBrek2() {
    paddle2 = {
        speed: 5,
        width: 50,
        height: 7,
        x: totW/2 - 25,
        y: totH - 100 
    }  

    ball2 = {
        x: totW/2 - 5,
        y: totH - 125,
        size: 5,
        xSpeed: 0,
        ySpeed: -3 
    }

    brik2Balls = [{x:ball2.x,y:ball2.y,xSpeed:ball2.xSpeed,ySpeed:ball2.ySpeed,extraSize:0}]

    levelInterval = setInterval(brikBrek2,20)
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

function startSlotMan() {
    for (var r = 0; r < rolls.length; r++) {
        for (var t = 0; t < 11; t++) {
            var rand = Math.floor(Math.random() * 10)
            rolls[r][0].push({icon:rewards[rand],yPos:-5+(40*t)})
        }
    }
    console.log(roll1); console.log(roll2); console.log(roll3);
    console.log(roll4); console.log(roll5); console.log(roll6);
    levelInterval = setInterval(slotMan,20)
}

function startLevel1() {
    player = new character(70,50,10,25,'gray');
    //player = new character(420,260,10,25,'gray');
    //player = new character(530,340,10,25,'gray');

    pGun = new gun(80,50,12,5,'yes')
    //floor beginning and left top spikearea
    floors.push(new Obstacle(5,75,315,5,'gray'))
    //ceiling beginning
    floors.push(new Obstacle(60,40,250,5,'gray'))
    //entrance
    walls.push(new Obstacle(60,45,5,30,'crimson'))
    //upper left wall spikebutton
    walls.push(new Obstacle(305,20,5,20,'gray'))
    //lower left wall spikebutton && guardpost wall
    walls.push(new Obstacle(305,80,5,80,'gray'))
    //floor spikebutton and grenadewall
    floors.push(new Obstacle(310,120,255,5,'gray'))
    //ceiling spikebutton
    floors.push(new Obstacle(305,20,160,5,'gray'))
    //spikes spikebutton
    floors.push(new Spikes(310,120,17))
    //platform spikebutton
    floors.push(new Obstacle(375,75,40,5,'gray'))
    //buttonplatform spikebutton && ceiling grenadewall
    floors.push(new Obstacle(435,55,150,5,'gray'))
    //right wall spikebutton
    walls.push(new Obstacle(465,20,5,70,'gray'))
    //door spikebutton
    walls.push(new Obstacle(465,90,5,30,'yellow','button',1,450,40))  
    //spikes grenadewall
    floors.push(new Spikes(510,120,9))
    //right wall grenadewall and right wall breakarea
    walls.push(new Obstacle(585,55,5,240,'gray'))
    //platform grenadewall
    floors.push(new Obstacle(510,90,55,5,'gray'))
    //grenade grenadewall
    pickups.push(new character(525,80,5,5,'darkslategrey','grenade',1))
    //lower floor grenadewall
    floors.push(new Obstacle(495,200,90,5,'gray'))
    //lower wall grenadewall
    walls.push(new Obstacle(505,125,5,45,'gray'))
    //grenadewall
    walls.push(new Obstacle(505,170,5,30,'lightslategray','gBreakable'))
    //right spikepit wall spikearea
    walls.push(new Obstacle(505,205,5,30,'gray'))
    //spikepit floor spikearea
    floors.push(new Obstacle(50,230,495,5,'gray'))
    //spikes spikearea
    floors.push(new Spikes(50,230,76))
    //right guardpost spikearea
    floors.push(new Obstacle(275,160,65,5,'gray'))
    //rightmost guard spikearea
    enemies.push(new character(315,140,10,25,'crimson','enemy',2))
    guns.push(new gun(315,155,12,5))
    //second rightmost guard spikearea
    enemies.push(new character(290,140,10,25,'crimson','enemy',2))
    guns.push(new gun(290,155,12,5))
    //right guardpost right railing spikearea
    walls.push(new Obstacle(335,153,5,7,'gray'))
    //right guardpost left railing spikearea
    walls.push(new Obstacle(275,153,5,7,'gray'))
    //left guardpost wall spikearea
    walls.push(new Obstacle(90,80,5,35,'gray'))
    //left guardpost floor spikearea
    floors.push(new Obstacle(60,115,65,5,'gray'))
    //left guardpost right railing spikearea
    walls.push(new Obstacle(120,108,5,7,'gray'))
    //left guardpost left railing spikearea
    walls.push(new Obstacle(60,108,5,7,'gray'))
    //leftmost guard spikearea
    enemies.push(new character(70,85,10,25,'crimson','enemy',2))
    guns.push(new gun(70,85,12,5))
    //second leftmost guard spikearea
    enemies.push(new character(95,85,10,25,'crimson','enemy',2))
    guns.push(new gun(95,85,12,5))
    //first platform spikearea
    floors.push(new Obstacle(400,190,40,5,'gray'))
    //second platform spikearea
    floors.push(new Obstacle(320,210,40,5,'gray'))
    //third platform spikearea
    floors.push(new Obstacle(250,210,40,5,'gray'))
    //fourth platform spikearea
    floors.push(new Obstacle(200,180,40,5,'gray'))
    //fifth platform spikearea
    floors.push(new Obstacle(170,130,40,5,'gray'))
    //sixth platform spikearea
    floors.push(new Obstacle(115,190,40,5,'gray'))
    //seventh platform spikearea
    floors.push(new Obstacle(50,170,40,5,'gray'))
    //eight platform spikearea
    floors.push(new Obstacle(10,130,20,5,'gray'))
    //left wall spikearea && left wall gunarea
    walls.push(new Obstacle(0,75,5,295,'gray'))
    //platform traparea
    floors.push(new Obstacle(10,260,20,5,'gray'))
    //keycard
    pickups.push(new Obstacle(70,105,15,10,'green','card',1))
    //floor traparea
    floors.push(new Obstacle(50,290,450,5,'gray'))
    //bottom spikepit traparea
    floors.push(new Obstacle(5,320,45,5,'gray'))
    //right spikepit traparea
    walls.push(new Obstacle(50,295,5,40,'gray'))
    //spikes traparea
    floors.push(new Spikes(2,320,8))
    //keycard door traparea
    walls.push(new Obstacle(150,260,5,30,'green','keycard',1))
    //enemy traparea
    enemies.push(new character(100,260,10,25,'crimson','enemy',2))
    guns.push(new gun(100,260,12,5))
    //barricade traparea
    walls.push(new Obstacle(90,280,5,10,'gray'))
    //wall traparea
    walls.push(new Obstacle(150,235,5,25,'grey'))
    //left trap wall traparea
    walls.push(new Obstacle(250,235,5,25,'grey'))
    //right trap wall traparea
    walls.push(new Obstacle(350,235,5,25,'grey'))
    //shootable wall traparea
    walls.push(new Obstacle(350,260,5,30,'darkslategray','breakable'))
    //arcade machines breakarea
    arcadeTest = new Obstacle(380,270,10,20,'blue')
    arcade2 = new Obstacle(420,270,10,20,'black')
    arcade3 = new Obstacle(460,270,10,20,'yellow')
    //right floor breakarea
    floors.push(new Obstacle(540,290,60,5,'gray'))
    //grenadewall breakarea
    walls.push(new Obstacle(545,260,5,30,'lightslategrey','gBreakable'))
    //upper wall breakarea
    walls.push(new Obstacle(545,230,5,30,'gray'))
    //jumping thing breakarea
    floors.push(new Obstacle(575,255,10,5,'gray'))
    //floor hatch and power box breakarea
    floors.push(new Obstacle(500,290,40,5,'crimson','shootToOpen',1,516,212))
    //rightmost floor gunarea
    floors.push(new Obstacle(460,365,140,5,'grey'))
    //exit door gunarea
    walls.push(new Obstacle(totW-30,335,5,30,'yellow','button',2,20,345))
    //rigth wall gunarea
    walls.push(new Obstacle(totW-30,295,5,40,'grey')) 
    //right side of first pit gunarea
    walls.push(new Obstacle(460,370,5,25,'grey'))
    //bottom of first pit gunarea
    floors.push(new Obstacle(430,390,30,5,'grey'))
    //left side of first pit gunarea
    walls.push(new Obstacle(425,355,5,40,'grey'))
    //second floor gunarea
    floors.push(new Obstacle(355,365,75,5,'gray'))
    //right side of second pit gunarea
    walls.push(new Obstacle(355,370,5,25,'grey'))
    //bottom of second pit gunarea
    floors.push(new Obstacle(325,390,30,5,'grey'))
    //left side of second pit gunarea
    walls.push(new Obstacle(320,355,5,40,'grey'))
    //third floor gunarea
    floors.push(new Obstacle(250,365,75,5,'gray'))
    //right side of third pit gunarea
    walls.push(new Obstacle(250,370,5,25,'grey'))
    //bottom of third pit gunarea
    floors.push(new Obstacle(220,390,30,5,'grey'))
    //left side of third pit gunarea
    walls.push(new Obstacle(215,355,5,40,'grey'))
    //fourth floor gunarea
    floors.push(new Obstacle(145,365,75,5,'gray'))
    //right side of fourth pit gunarea
    walls.push(new Obstacle(145,370,5,25,'grey'))
    //bottom of fourth pit gunarea
    floors.push(new Obstacle(115,390,30,5,'grey'))
    //left side of fourth pit gunarea
    walls.push(new Obstacle(110,355,5,40,'grey'))
    //leftmost floor gunarea
    floors.push(new Obstacle(5,365,110,5,'gray'))
    //grenadewall gunarea
    walls.push(new Obstacle(50,335,5,30,'lightslategrey','gBreakable'))
}   


function runLevel1() {
    ctx.fillStyle = 'red'; ctx.font = '11px cursive'; ctx.fillText('definitely not a',165,245)
    ctx.fillStyle = 'black'; ctx.font = '13px consolas'; ctx.fillText('Trap Area 1',165,255);

    ctx.font = '30px consolas'; ctx.fillText('Testing Area 1',210,330)
    
    ctx.fillStyle = 'lightslategray'; ctx.fillRect(100,50,11,11); ctx.fillRect(315,30,11,11);
    ctx.fillRect(515,130,11,11); ctx.fillRect(500,130,-11,11); ctx.fillRect(10,85,11,11);
    ctx.fillRect(145,240,-11,11); ctx.fillRect(345,240,-11,11); ctx.fillRect(540,240,-11,11);

    ctx.fillStyle = 'darkslategrey'; 
    for(s=0;s<8;s++) {
        ctx.fillRect(103+speakers[s].x,53+speakers[s].y,1,1); ctx.fillRect(105+speakers[s].x,55+speakers[s].y,1,1); ctx.fillRect(107+speakers[s].x,57+speakers[s].y,1,1); 
        ctx.fillRect(103+speakers[s].x,51+speakers[s].y,1,1); ctx.fillRect(105+speakers[s].x,53+speakers[s].y,1,1); ctx.fillRect(107+speakers[s].x,55+speakers[s].y,1,1); ctx.fillRect(109+speakers[s].x,57+speakers[s].y,1,1);
        ctx.fillRect(105+speakers[s].x,51+speakers[s].y,1,1); ctx.fillRect(107+speakers[s].x,53+speakers[s].y,1,1); ctx.fillRect(109+speakers[s].x,55+speakers[s].y,1,1);
        ctx.fillRect(107+speakers[s].x,51+speakers[s].y,1,1); ctx.fillRect(109+speakers[s].x,53+speakers[s].y,1,1);
        ctx.fillRect(101+speakers[s].x,53+speakers[s].y,1,1); ctx.fillRect(103+speakers[s].x,55+speakers[s].y,1,1); ctx.fillRect(105+speakers[s].x,57+speakers[s].y,1,1); ctx.fillRect(107+speakers[s].x,59+speakers[s].y,1,1);
        ctx.fillRect(101+speakers[s].x,55+speakers[s].y,1,1); ctx.fillRect(103+speakers[s].x,57+speakers[s].y,1,1); ctx.fillRect(105+speakers[s].x,59+speakers[s].y,1,1);
        ctx.fillRect(101+speakers[s].x,57+speakers[s].y,1,1); ctx.fillRect(103+speakers[s].x,59+speakers[s].y,1,1);
    }

    ctx.beginPath(); if (greenLight == true) {ctx.fillStyle = 'limegreen'} else {ctx.fillStyle = 'darkgreen'}
    ctx.moveTo(180,315); ctx.lineTo(180,330); ctx.lineTo(165,322.5); ctx.fill();

    ctx.beginPath(); if (greenLight == true)  {ctx.fillStyle = 'maroon'} else {ctx.fillStyle = 'red'}
    ctx.moveTo(185,315); ctx.lineTo(200,315); ctx.lineTo(192.5,330); ctx.fill();

    ctx.beginPath(); if (greenLight == true) {ctx.fillStyle = 'limegreen'} else {ctx.fillStyle = 'darkgreen'}
    ctx.moveTo(470,315); ctx.lineTo(470,330); ctx.lineTo(455,322.5); ctx.fill();
    
    ctx.beginPath(); if (greenLight == true)  {ctx.fillStyle = 'maroon'} else {ctx.fillStyle = 'red'}
    ctx.moveTo(475,315); ctx.lineTo(490,315); ctx.lineTo(482.5,330); ctx.fill();

    ctx.fillStyle = 'green'; ctx.fillRect(530,310,25,12); ctx.beginPath();
    ctx.moveTo(555,310); ctx.lineTo(563,316); ctx.lineTo(555,322); ctx.fill()
    ctx.fillStyle = 'white'; ctx.font = '10px consolas'; ctx.fillText('EXIT>',532,319);

    if (trapDoor == false && player.x > 260 && player.y > 240) {trapDoor = true; walls.push(new Obstacle(250,260,5,30,'crimson'))}

    gradient = ctx.createLinearGradient(575,330,600,330); gradient.addColorStop(0,'lightgray')
    gradient.addColorStop(1,'white'); ctx.fillStyle = gradient; ctx.fillRect(575,295,25,70)
    
    ctx.save(); 
    angel = Math.atan2((player.y+player.height/2)-310,(player.x+player.width/2)-75); 
    ctx.translate(75,310); 
    if (player.x > 110 && player.x < 500 && player.y > 300) {ctx.rotate(angel)} else {ctx.rotate(0.2)}
    ctx.translate(-75,-310); 
    
    ctx.fillStyle = 'darkslategray'; ctx.fillRect(65,305,18,10); ctx.beginPath(); ctx.lineWidth = 2; 
    ctx.strokeStyle = 'darkslategray'; ctx.moveTo(83,306); ctx.lineTo(125,306); 
    ctx.moveTo(83,314); ctx.lineTo(125,314); ctx.moveTo(83,310); ctx.lineTo(125,310); 
    ctx.moveTo(87,305); ctx.lineTo(87,315); ctx.moveTo(98,305); ctx.lineTo(98,315);
    ctx.moveTo(110,305); ctx.lineTo(110,315); ctx.moveTo(121,305); ctx.lineTo(121,315); ctx.stroke()
    ctx.restore()
    
    ctx.fillStyle = 'lightslategray'; ctx.fillRect(73,295,4,17)
    
    for (d = 0; d < dialogTriggered.length; d++) {
        if (player.y + player.height < 135) {
            if (player.x > triggerX[d] && dialogTriggered[d] == false) {
                dialogTriggered[d] = true; console.log('triggered dialogs: '+dialogTriggered)
            }
        }
        else if (player.y + player.height < 245) {
            if (player.x < triggerX[d] && dialogTriggered[d] == false) {
                dialogTriggered[d] = true; console.log('triggered dialogs: '+dialogTriggered)
            }
        }
        
        
    }
    console.log('playerX'+player.x+'playerY'+player.y+'triggered'+dialogTriggered)
    for (d = 0; d < dialogTimer.length; d++) {
        if (dialogTriggered[d] == true && dialogTimer[d] < 35) {
            dialogTimer[d] += 0.02; //console.log('dialog timers: '+dialogTimer)
        }
    }
    
    /*if (dialogTimer[0] > 0 && dialogTimer[0] < 30) {
        ctx.font = '15px consolas'
        ctx.strokeStyle = 'darkslategray'; ctx.fillStyle = 'darkslategray'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(225,255); ctx.lineTo(205,285); ctx.lineTo(215,245); ctx.closePath(); ctx.fill(); 
        ctx.beginPath(); ctx.moveTo(495,255); ctx.lineTo(515,285); ctx.lineTo(505,245); ctx.closePath(); ctx.fill(); 
        ctx.beginPath(); ctx.moveTo(225,205); ctx.lineTo(205,175); ctx.lineTo(215,215); ctx.closePath(); ctx.fill(); 
        ctx.beginPath(); ctx.moveTo(495,205); ctx.lineTo(515,175); ctx.lineTo(505,215); ctx.closePath(); ctx.fill(); 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(200,200,320,60); ctx.strokeRect(200,200,320,60);    
        ctx.fillStyle = 'darkslategray';   
        if (dialogTimer[0] < 3) {
            ctx.fillText('well well well if it isnt my favorite agent, x!',205,215)
            ctx.fillText('I guess you\'ve come for my z device?',205,233)
            ctx.fillText('alright, we\'ll see if you make it that far mwahahahaha',205,266) 
        }
        
    }*/

    //dialog
    //well well well if it isnt my favorite agent, x! I guess you came for the z device. well, you definitely wont survive that far mwahahahaha
    //oh no a locked door, maybe you should just give up and jump into the spikes...
    //too bad it would take explosives to get through this wall. wait, who put that there!?
    //heres a massive spikepit for you, and some guards. you're definitely not surviving this mwaahahah
    //no keycard? well, all  you can do is jump into the spikepit...
    //hey you cant grab that!
    //come inside, this is definitely not a trap
    //ha, i got you now, try shooting your way out of this one! no wait, dont!
    //i put this room here to congratulate you on your surprising survival, its definitely not just the guards' breakroom

    if (player.y > 300) {
        gunTimer -= 0.02;
        if (gunTimer <= 0) {
            gunTimer = 0.5 + Math.random()
            if (greenLight == false) {greenLight = true}
            else {greenLight = false}
        }
    }

    if (player.x > 110 && player.x < 500 && player.y > 300) {
        console.log(Math.floor(angel*57.2957795))
        projectiles.push(new Projectile(2,2,'white',75,310,player.x,player.y+5,'detector',69))
        if (gunSight > 0 && greenLight == false) {
            gunSight -= 0.02;
            projectiles.push(new Projectile(3,3,'maroon',75,310,player.x,player.y+5,'enemi'))
        }
    }
}

function pause() {
    if (gameState == states.level) {prevState = 1}
    else if (gameState == states.brik) {prevState = 2}
    else if (gameState == states.pew) {prevState = 3}
    else if (gameState == states.intro) {prevState = 4}
    else if (gameState == states.slot) {prevState = 5}
    else if (gameState == states.brik2) {prevState = 6}

    if (gameState != states.menu && gameState != states.stopped && gameState != states.paused) {
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
            gameState = states.pew; levelInterval = setInterval(pewPew,20)
        }
        else if (prevState == 4) {
            gameState = states.intro; levelInterval = setInterval(introLoop,20)
        }
        else if (prevState == 5) {
            gameState = states.slot; levelInterval = setInterval(slotMan,20)
        }
        else if (prevState == 6) {
            gameState = states.brik2; levelInterval = setInterval(brikBrek2,20)
        }
    }
}

function checkButt(mButt){
    if (gameState == states.menu){
        if (buttClicked(400,250,100,50)){
            console.log('clicked play button'); 
            enemies = []; guns = []; pickups = []; 
            floors = []; walls = []
            if (mButt == 2) {
                demo = true
                player = new character(520,20,10,25,'gray');
                pGun = new gun(40,300,12,5,'yes')
                arcadeTest = new Obstacle(450,totH-75,10,20,'blue')
                arcade2 = new Obstacle(536,totH-99,10,20,'black')
                arcade3 = new Obstacle(380,295,10,20,'yellow')
                arcade4 = new Obstacle(200,235,10,20,arcadeGrad)
                //enemy test
                enemies.push(new character(265,240,10,25,'crimson','enemy',2))
                guns.push(new gun(265,240,12,5))
                //pickup test
                pickups.push(new character(totW/2,totH-15,5,5,'gold','points',15))
                pickups.push(new character(totW/2+10,totH-15,5,5,'red','health',20))
                pickups.push(new character(totW/2+20,totH-15,5,5,'darkblue','armor',10))
                pickups.push(new character(totW/2+30,totH-15,5,5,'darkslategrey','grenade',1))
                pickups.push(new Obstacle(80,totH-15,15,10,'green','card',1))
                //obstacle test
                //floors
                floors.push(new Obstacle(170,totH-32,190,5,'gray'))
                floors.push(new Obstacle(430,totH-55,50,5,'gray'))
                floors.push(new Obstacle(515,totH-79,59,5,'gray'))
                floors.push(new Obstacle(360,315,50,5,'gray'))
                floors.push(new Spikes(400,totH-5,20))
                floors.push(new Obstacle(260,280,69,5,'red'))
                floors.push(new Obstacle(175,255,60,5,'gray'))
                //walls
                walls.push(new Obstacle(225,totH-105,5,45,'gray'))
                walls.push(new Obstacle(290,totH-105,5,45,'gray'))
                walls.push(new Obstacle(320,totH-105,5,45,'gray'))
                walls.push(new Obstacle(320,totH-60,5,28,'darkslategray','breakable'))
                walls.push(new Obstacle(330,totH-105,5,45,'gray'))
                walls.push(new Obstacle(330,totH-60,5,28,'lightslategray','gBreakable'))
                //doors
                walls.push(new Obstacle(225,totH-60,5,28,'green','keycard',1))
                walls.push(new Obstacle(290,totH-60,5,28,'yellow','button',1,550,375))
            }
            else if (mButt == 0) {
                startLevel1(); console.log('starting level 1')
            }
            gameState = states.level; can.style.cursor = 'crosshair';
            health = maxHealth
            armor = maxArmor
            levelInterval = setInterval(levelLoop,20); 
        }
        else if (buttClicked(400,130,100,50)){
            console.log('clicked info button');
            if (!showingInfo) {showingInfo = true} 
            else if (showingInfo) {showingInfo = false} loadMenu()
        }
        else if (buttClicked(400,190,100,50)) { console.log('clicked intro button'); can.style.cursor = 'default';
            gameState = states.intro; levelInterval = setInterval(introLoop,20)
        }
        
        else if (buttClicked(130,270,30,30)){
            console.log('clicked dmg upgrade');
            if (points >= dmgPrice[dmgLvl] && dmgLvl < 5) {points -= dmgPrice[dmgLvl]; dmgLvl++; loadMenu()}
            else {console.log('not allowed, price is: '+dmgPrice[dmgLvl]+' and level is: '+dmgLvl)}
        }        
        else if (buttClicked(175,270,30,30)){
            console.log('clicked frt upgrade');
            if (points >= frtPrice[frtLvl] && frtLvl < 5) {points -= frtPrice[frtLvl]; frtLvl++;  loadMenu()}
            else {console.log('not allowed, price is: '+frtPrice[frtLvl]+' and level is: '+frtLvl)}
        }
        else if (buttClicked(220,270,30,30)){
            console.log('clicked acc upgrade');
            if (points >= accPrice[accLvl] && accLvl < 5) {points -= accPrice[accLvl]; accLvl++;  loadMenu()}
            else {console.log('not allowed, price is: '+accPrice[accLvl]+' and level is: '+accLvl)}
        }
        else if (buttClicked(265,270,30,30)){
            console.log('clicked crt upgrade');
            if (points >= crtPrice[crtLvl] && crtLvl < 5) {points -= crtPrice[crtLvl]; crtLvl++; loadMenu()}
            else {console.log('not allowed, price is: '+crtPrice[crtLvl]+' and level is: '+crtLvl)}
        }
        else if (buttClicked(310,270,30,30)){
            console.log('clicked hlt upgrade');
            if (points >= hltPrice[hltLvl] && hltLvl < 5) {points -= hltPrice[hltLvl]; hltLvl++; maxHealth = hlt[hltLvl]; loadMenu()}
            else {console.log('not allowed, price is: '+hltPrice[hltLvl]+' and level is: '+hltLvl)}
        }
        else if (buttClicked(355,270,30,30)){
            console.log('clicked gnd upgrade');
            if (points >= gndPrice[gndLvl] && gndLvl < 5) {points -= gndPrice[gndLvl]; gndLvl++; loadMenu()}
            else {console.log('not allowed, price is: '+gndPrice[gndLvl]+' and level is: '+gndLvl)}
        }

        if (showingInfo == true) {
            if (scrolled == false && buttClicked(495,330,20,55)) {
                scrolled = true; for (n=0;n<infoX.length;n++) {infoX[n] -= 120}; loadMenu()
            }
            else if (scrolled == true && buttClicked(115,330,20,55)) {
                scrolled = false; for (n=0;n<infoX.length;n++) {infoX[n] += 120}; loadMenu()
            }
        }
    }
    if (gameState == states.level){
        if (mButt == 0) {
            projectiles.push(new Projectile(3,3,'goldenrod',player.x + 5,player.y + 12,musx-15,musy-15,'frend'))
            fireInterval = setInterval(() => {
                projectiles.push(new Projectile(3,3,'goldenrod',player.x + 5,player.y + 12,musx-15,musy-15,'frend'))
            }, frt[frtLvl])
        }
        if (mButt == 2 && grenadeCool == true && grenades > 0) {
            projectiles.push(new Grenade(player.x,player.y,4,4,'darkslategray',musx,musy))
            grenades--; grenadeCool = false; setTimeout(() => {grenadeCool = true},1000)
        }
    }
}

function buttHoverCheck(){
    if (gameState == states.menu) {
        if (buttHovered(400,250,100,50)) {console.log('pointing at play button'); can.style.cursor = 'pointer'}
        else if (buttHovered(400,130,100,50)) {console.log('pointing at info button'); can.style.cursor = 'pointer'}
        else if (buttHovered(400,190,100,50)) {console.log('pointing at intro button'); can.style.cursor = 'pointer'}

        else if (buttHovered(130,270,30,30)) {
            console.log('pointing at dmg upgrade');
            if (points >= dmgPrice[dmgLvl] && dmgLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }        
        else if (buttHovered(175,270,30,30)) {
            console.log('pointing at frt upgrade');
            if (points >= frtPrice[frtLvl] && frtLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(220,270,30,30)) {
            console.log('pointing at acc upgrade');
            if (points >= accPrice[accLvl] && accLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(265,270,30,30)) {
            console.log('pointing at crt upgrade');
            if (points >= crtPrice[crtLvl] && crtLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(310,270,30,30)) {
            console.log('pointing at hlt upgrade');
            if (points >= hltPrice[hltLvl] && hltLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(355,270,30,30)) {
            console.log('pointing at gnd upgrade');
            if (points >= gndPrice[gndLvl] && gndLvl < 5) {can.style.cursor = 'pointer'}
            else {can.style.cursor = 'not-allowed'}
        }
        else {can.style.cursor = 'default'}
        
        if (showingInfo == true) {
        
            if (scrolled == false && buttHovered(495,330,20,55)) {
                console.log('pointing at right scroll button');
                can.style.cursor = 'pointer';
            }
            else if (scrolled == true && buttHovered(115,330,20,55)) {
                console.log('pointing at left scroll button');
                can.style.cursor = 'pointer'
            }
        }
    }
}

class Obstacle {
    constructor(x,y,width,height,color,type,id,lx,ly) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        ctx.fillStyle = color
        this.type = type
        this.id = id
        this.lx = lx
        this.ly = ly
        this.unlocked = false
        this.update = function() {
            if ((this.type != 'keycard' && this.type != 'button') || this.unlocked == false)
            { 
                ctx.fillStyle = color; ctx.fillRect(this.x, this.y, this.width, this.height)
            }
            if (this.type == 'keycard') {
                ctx.font = '13px consolas';
                ctx.fillStyle = 'gray';
                ctx.fillRect(this.x-17,this.y+12,8,10);
                ctx.fillRect(this.x+13,this.y+12,8,10);
                ctx.fillStyle = 'black'; 
                ctx.fillText('K'+this.id,this.x-20,this.y+10);
                ctx.fillText('K'+this.id,this.x+10,this.y+10);
                ctx.beginPath(); ctx.lineWidth = 1;
                ctx.moveTo(this.x-11,this.y+12);
                ctx.lineTo(this.x-11,this.y+22); 
                ctx.moveTo(this.x+19,this.y+12);
                ctx.lineTo(this.x+19,this.y+22); ctx.stroke();
                if (!this.unlocked) {ctx.fillStyle = 'red';}
                else {ctx.fillStyle = 'green'}
                ctx.fillRect(this.x-16,this.y+13,3,3);
                ctx.fillRect(this.x+14,this.y+13,3,3);
            }
            else if (this.type == 'button') {
                ctx.font = '13px consolas'
                ctx.fillStyle = 'black'
                ctx.fillText('B'+this.id,this.x-20,this.y+10);
                ctx.fillText('B'+this.id,this.x+10,this.y+10);
                ctx.fillText('B'+this.id,this.lx-3,this.ly-2)
                ctx.fillStyle = 'gray'
                ctx.fillRect(this.lx,this.ly,8,8);
                if (!this.unlocked) {ctx.fillStyle = 'red';}
                else {ctx.fillStyle = 'green'}
                ctx.fillRect(this.x-16,this.y+13,5,5);
                ctx.fillRect(this.x+14,this.y+13,5,5);
                ctx.fillRect(this.lx+1.5,this.ly+1.5,5,5)
            }
            else if (this.type == 'card') {
                ctx.font = '10px consolas';
                ctx.fillStyle = 'black';
                ctx.fillText('K'+this.id,this.x+2,this.y+this.height-2);
            }
            else if (this.type == 'shootToOpen') {
                ctx.fillStyle = 'gray'
                ctx.fillRect(this.lx,this.ly,12,12)
                ctx.fillStyle = 'yellow'
                ctx.beginPath()
                ctx.moveTo(this.lx + 2,this.ly + 10)
                ctx.lineTo(this.lx + 6, this.ly + 2)
                ctx.lineTo(this.lx + 10,this.ly + 10)
                ctx.fill()
            }
        }
    }
}

class Spikes {
    constructor(x,y,length) {
        this.x = x
        this.y = y
        this.type = 'spikes'
        this.length = length
        this.update = function() {
            ctx.fillStyle = 'crimson'
            ctx.beginPath()
            ctx.moveTo(this.x,this.y)
            ctx.lineTo(this.x,this.y-2)
            var spikeX = this.x
            for (var spike = 0; spike < length; spike++)
            {
                spikeX += 3
                ctx.lineTo(spikeX,this.y-15)
                spikeX += 3
                ctx.lineTo(spikeX,this.y-2)
            }
            ctx.lineTo(spikeX,this.y)
            ctx.closePath(); ctx.fill()
        }
    }
}

class Grenade {
    constructor(x,y,width,height,color,targetX,targetY) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.gravity = 0.15
        this.fallSpeed = 0
        this.bounceStrength = -4
        this.grounded = false;
        this.type = 'grenade'
        this.targetX = targetX
        this.targetY = targetY
        this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX)
        this.dx = Math.cos(this.angle)
        this.dy = Math.sin(this.angle)
        this.lifeTime = 0
        this.gUpdate = function() {
            if (!this.grounded) {
                this.x += this.dx * 5
                this.fallSpeed += this.gravity
                this.y += this.dy * 5 + this.fallSpeed
            }
            if (this.dx > 0) {this.dx -= 0.01}
            else if (this.dx < 0) {this.dx += 0.01}
            
            if (this.grounded) {
                this.fallSpeed = this.bounceStrength
                this.bounceStrength /= 2
                this.grounded = false;
            }
            
            if (this.y + this.height > totH - 5) {
                this.y = totH - this.height - 5;
                this.grounded = true;
            } 
            
            ctx.fillStyle = color
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
        if ((mybottom > othertop) && (mybottom < otherbottom) && (myright > otherleft) && (myleft < otherright)) {
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
        this.health = amount
        this.gravity = 0.15
        this.fallSpeed = 0
        this.jumpStrength = -3.5;
        this.grounded = false;
        this.shootTime = 0
        this.attacking = false
        this.attackTimer = 0
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
            if (otherobj.type != 'spikes') {
                var otherright = otherobj.x + otherobj.width
                var othertop = otherobj.y
                var otherbottom = otherobj.y + otherobj.height
            }
            else {
                var otherright = otherobj.x + otherobj.length * 6 
                var othertop = otherobj.y - 15
                var otherbottom = otherobj.y
            }
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
    constructor(x, y, width, height, isPlayer) {
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
            if (isPlayer == 'yes') {
                this.angle = Math.atan2(musy - this.centerY, musx - this.x);
            }
             
            this.centerY = this.y + this.height / 2
            ctx.save();
        
            // Translate the context to the point where the angle is calculated
            ctx.translate(this.x - 15, this.centerY - 15);
        
            ctx.rotate(this.angle);

            // Translate the context to the middle of the left end of the object
            ctx.translate(0, -this.height / 2);

            ctx.fillStyle = 'lightslategray';
            ctx.fillRect(0, 0, this.width, this.height);
        
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        
            ctx.restore();
        }
        
    }
}


class Projectile {
    constructor(width, height, color, x, y, targetX, targetY, type, enemyIndex) {
        this.type = type
        this.width = width
        this.height = height
        ctx.fillStyle = color
        this.enemyIndex = enemyIndex
        this.x = x
        this.y = y
        var crit = false
        this.targetX = targetX
        this.targetY = targetY
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        if (this.type != 'detector') {
            this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * 3) - 3) * Math.PI / 180
        }
        else {this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX)}
        this.dx = Math.cos(this.angle)
        this.dy = Math.sin(this.angle)

        //this.damage = Math.floor((Math.random() * (mg.damageMax - mg.damageMin + 1)) + mg.damageMin)
        if (this.type == 'frend') {this.damage = dmg[dmgLvl]}
        else if (this.type == 'enemi') {this.damage = 2}
        else if (this.type == 'fragment') [this.damage = gnd[gndLvl]]

        if (this.type != 'detector') {
            var rand = Math.random() * 100
            if (rand < crt[crtLvl]) { crit = true}
            //console.log('damage: ' + this.damage + ' rand: ' + rand + ' crit: ' + crit)
            if (crit == true) { this.damage *= 1.5; console.log('crit damage: ' + this.damage)}
        }

        this.update = function () {
            if (crit == true) { ctx.fillStyle = 'red'} 
            else { ctx.fillStyle = color} 
            if (this.type != 'detector')
            {this.x += this.dx * 7
            this.y += this.dy * 7}
            else {
                this.x += this.dx * 4
                this.y += this.dy * 4
            }
            if (this.type != 'detector') {
                ctx.fillRect(this.x, this.y, this.width, this.height)
            }
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
            if (otherobj.type != 'spikes') {
                var otherright = otherobj.x + otherobj.width
                var othertop = otherobj.y
                var otherbottom = otherobj.y + otherobj.height
            }
            else {
                var otherright = otherobj.x + otherobj.length * 6 
                var othertop = otherobj.y - 15
                var otherbottom = otherobj.y
            }
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
    gameState = states.menu; ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    ctx.fillStyle = 'black'; ctx.font = '40px consolas'; ctx.fillText('Menu',115,140,100);
    ctx.font = '20px consolas'; ctx.fillText('Points: '+points,230,140)
    ctx.beginPath(); ctx.moveTo(115,147); ctx.lineTo(370,147); ctx.stroke();
    //right buttons
    ctx.lineWidth = 3;
    ctx.strokeRect(385,235,100,50); ctx.font = '30px consolas'; ctx.fillText('Play',400,267.5);
    ctx.strokeRect(385,115,100,50); ctx.fillText('Info',400,147.5)
    ctx.strokeRect(385,175,100,50); ctx.fillText('Intro',393,207.5);
    //upgrade buttons 
    ctx.lineWidth = 2;
    ctx.strokeRect(115,255,30,30); ctx.strokeRect(160,255,30,30); ctx.strokeRect(205,255,30,30);
    ctx.strokeRect(250,255,30,30); ctx.strokeRect(295,255,30,30); ctx.strokeRect(340,255,30,30);
    //upgrade indicators 1
    ctx.lineWidth = 1;
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

    if (showingInfo == true) {
        ctx.fillStyle = 'blue'; ctx.fillRect(totW/2 - 200,315,400,55);
        ctx.beginPath(); ctx.fillStyle = 'black';
        //damage
        if (scrolled == false) {
            ctx.fillText('damage ',infoX[0],330);
            ctx.fillText(dmg[dmgLvl]+'=>'+dmg[dmgLvl+1],infoX[0],345);
            ctx.fillText('price:'+dmgPrice[dmgLvl],infoX[0],360);
            ctx.moveTo(infoX[1],320); ctx.lineTo(infoX[1],365);
        }
        //firerate
        ctx.fillText('firerate',infoX[2],330); 
        ctx.fillText(frt[frtLvl]+'=>'+frt[frtLvl+1],infoX[2],345);
        ctx.fillText('price:'+frtPrice[frtLvl],infoX[2],360);
        ctx.moveTo(infoX[3],320); ctx.lineTo(infoX[3],365);
        //accuracy
        ctx.fillText('accuracy',infoX[4],330);
        ctx.fillText(acc[accLvl]+'=>'+acc[accLvl+1],infoX[4],345);
        ctx.fillText('price:'+accPrice[accLvl],infoX[4],360);
        ctx.moveTo(infoX[5],320); ctx.lineTo(infoX[5],365);
        //critical hits
        ctx.fillText('critchance',infoX[6],330);
        ctx.fillText(crt[crtLvl]+'=>'+crt[crtLvl+1],infoX[6],345);
        ctx.fillText('price:'+crtPrice[crtLvl],infoX[6],360);
        ctx.moveTo(infoX[7],320); ctx.lineTo(infoX[7],365); ctx.stroke();
        //health
        ctx.fillText('health',infoX[8],330);
        ctx.fillText(hlt[hltLvl]+'=>'+hlt[hltLvl+1],infoX[8],345);
        ctx.fillText('price:'+hltPrice[hltLvl],infoX[8],360);
        
        if (scrolled == true) {
            ctx.beginPath(); ctx.moveTo(infoX[9],320); 
            ctx.lineTo(infoX[9],365); ctx.stroke();
        
            //grenades
            ctx.fillText('grenades',infoX[10],330);
            ctx.fillText(gnd[gndLvl]+'=>'+gnd[gndLvl+1],infoX[10],345);
            ctx.fillText('price:'+gndPrice[gndLvl],infoX[10],360);
        }
        
        if (scrolled == false) {
            ctx.fillStyle = 'green';
            ctx.fillRect(totW/2 + 200,315,35,55);
            
            ctx.fillStyle = 'blue';
            ctx.fillRect(totW/2 + 180,315,20,55)
            
            ctx.fillStyle = 'black';
            ctx.fillText('>',totW/2 + 185,349)
        }
        else if (scrolled == true) {
            ctx.fillStyle = 'green';
            ctx.fillRect(totW/2-235,315,35,55);

            ctx.fillStyle = 'blue';
            ctx.fillRect(totW/2-200,315,20,55)

            ctx.fillStyle = 'black'
            ctx.fillText('<',totW/2-195,349)
        }
    }
}

function introLoop() {
    introTime += 0.02; console.log(Math.floor(introTime * 10)/10)
    if (introTime < 28 || (introTime > 31 && introTime < 47)) {
        ctx.clearRect(0,0,totW,totH); ctx.fillStyle = 'skyblue'; ctx.fillRect(0,0,totW,totH)
        //grass
        ctx.beginPath(); ctx.lineWidth = 10; ctx.strokeStyle = 'green'; ctx.moveTo(0,totH); ctx.lineTo(totW,totH); ctx.stroke()
        //sun
        ctx.beginPath(); ctx.fillStyle = 'yellow'; ctx.arc(450,120,50,0,360); ctx.fill();
    }
    else if (introTime > 28 && introTime < 31) {ctx.fillStyle = 'white'; ctx.fillRect(0,0,totW,totH)}
    else if (introTime > 47 && introTime < 50) {ctx.fillStyle = 'black'; ctx.fillRect(0,0,totW,totH)}
    else if (introTime > 50) {
        ctx.clearRect(0,0,totW,totH); ctx.fillStyle = 'rgb(40,40,40)'; ctx.fillRect(0,0,totW,totH)
        //nightgrass
        ctx.beginPath(); ctx.lineWidth = 10; ctx.strokeStyle = 'darkgreen'; ctx.moveTo(0,totH); ctx.lineTo(totW,totH); ctx.stroke();
        //moon
        ctx.beginPath(); ctx.fillStyle = 'khaki'; ctx.arc(450,120,39,0,360); ctx.fill();
        
        ctx.beginPath(); ctx.fillStyle = 'rgb(42,42,42)'; ctx.arc(450,120,40,-90 * Math.PI / 180,90 * Math.PI / 180, true); 
        ctx.ellipse(450,120,20,40,0,-90 * Math.PI / 180,90 * Math.PI / 180); ctx.fill();
        
        //lair
        ctx.beginPath(); ctx.fillStyle = 'rgb(66,66,66)'; ctx.moveTo(525,totH-5); ctx.lineTo(525,totH-60);
        ctx.lineTo(435,totH-150); ctx.lineTo(350,totH-150); ctx.lineTo(350,totH-5); ctx.closePath(); ctx.fill();
        
        var IT = introTime

        if (IT < 51 || (IT > 54.5 && IT < 55) || (IT > 55.5 && IT < 56) || (IT > 56.5 && IT < 57) || (IT > 57.5 && IT < 61.5) || (IT > 65 && IT < 65.5)) 
        {ctx.fillStyle = 'maroon'} 
        else {ctx.fillStyle = 'red'}
        ctx.fillText('Doctor Y\'s',355,totH-125); 
        
        if (IT < 51.5 || (IT > 54.5 && IT < 55) || (IT > 55.5 && IT < 56) || (IT > 56.5 && IT < 57) || (IT > 58 && IT < 62) || (IT > 65 && IT < 65.5)) 
        {ctx.fillStyle = 'maroon'} 
        else {ctx.fillStyle = 'red'}
        ctx.fillText('secret',355,totH-107);
        
        if (IT < 52 || (IT > 54.5 && IT < 55) || (IT > 55.5 && IT < 56) || (IT > 56.5 && IT < 57) || (IT > 58.5 && IT < 62.5) || (IT > 65 && IT < 65.5)) 
        {ctx.fillStyle = 'maroon'} 
        else {ctx.fillStyle = 'red'}
        ctx.fillText('underground',355,totH-89);
        
        if (IT < 52.5 || (IT > 54.5 && IT < 55) || (IT > 55.5 && IT < 56) || (IT > 56.5 && IT < 57) || (IT > 59 && IT < 63) || (IT > 65 && IT < 65.5)) 
        {ctx.fillStyle = 'maroon'}
        else {ctx.fillStyle = 'red'}
        ctx.fillText('lair',355,totH-71); 

        if (IT < 53 || (IT > 54.5 && IT < 55) || (IT > 55.5 && IT < 56) || (IT > 56.5 && IT < 57) || (IT > 59.5 && IT < 63.5) || (IT > 65 && IT < 65.5)) 
        {ctx.fillStyle = 'maroon'} 
        else {ctx.fillStyle = 'red'}
        ctx.fillText('Home of the Z device',355,totH-53);
        
        if (IT < 53.5 || (IT > 54.5 && IT < 55) || (IT > 55.5 && IT < 56) || (IT > 56.5 && IT < 57) || (IT > 60 && IT < 64) || (IT > 65 && IT < 65.5)) 
        {ctx.fillStyle = 'maroon'} 
        else {ctx.fillStyle = 'red'}
        ctx.fillText('Visitors welcome!',355,totH-35);

        if (IT < 54 || (IT > 54.5 && IT < 55) || (IT > 55.5 && IT < 56) || (IT > 56.5 && IT < 57) || (IT > 60.5 && IT < 64.5) || (IT > 65 && IT < 65.5)) 
        {ctx.fillStyle = 'maroon'} 
        else {ctx.fillStyle = 'red'}
        ctx.fillText('except you, Agent X',355,totH-17);
    }


    if (introTime < 28) {
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
    }
    else if (introTime > 31 && introTime < 47) {
        ctx.beginPath(); ctx.fillStyle = 'black'; ctx.moveTo(50,totH-5); ctx.lineTo(50,totH-35); ctx.lineTo(65,totH-20); 
        ctx.lineTo(80,totH-42); ctx.lineTo(90,totH-30); ctx.lineTo(105,totH-20); ctx.lineTo(130,totH-50); ctx.lineTo(145,totH-25); 
        ctx.lineTo(150,totH-30); ctx.lineTo(150,totH-5); ctx.closePath(); ctx.fill();
    }

    ctx.font = '15px consolas'

    if (introTime > 2 && introTime < 5) {
        ctx.strokeStyle = 'darkslategray'; ctx.fillStyle = 'darkslategray'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(135-20,255); ctx.lineTo(115-20,285); ctx.lineTo(125-20,245); ctx.closePath(); ctx.fill(); 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(110-20,200,110+295,60); ctx.strokeRect(110-20,200,110+295,60);
        
        ctx.fillStyle = 'darkslategray'; ctx.fillText('Aah, finally my first vacation in three years...',115-20,215)
    }
    else if (introTime > 6 && introTime < 7) {
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(122.5,messageThingY,5,12); messageThingY += 6
    }
    else if (introTime > 8 && introTime < 9) {
        ctx.strokeStyle = 'darkslategray'; ctx.fillStyle = 'darkslategray'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(135-20,255); ctx.lineTo(115-20,285); ctx.lineTo(125-20,245); ctx.closePath(); ctx.fill(); 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(110-20,200,110+25,60); ctx.strokeRect(110-20,200,110+25,60);
        
        ctx.fillStyle = 'darkslategray'; ctx.fillText('A new mission!?',115-20,215)
    }
    else if (introTime > 10 && introTime < 23) {
        ctx.strokeStyle = 'darkslategray'; ctx.fillStyle = 'darkslategray'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(135,255); ctx.lineTo(115,285); ctx.lineTo(125,245); ctx.closePath(); ctx.fill(); 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(110,200,110+375,60); ctx.strokeRect(110,200,110+375,60);
        
        ctx.fillStyle = 'darkslategray'; 
        if (introTime < 13) {
            ctx.fillText('Agent X, I\'m sorry to interrupt your vacation,',115,215)
            ctx.fillText('but we have received some disturbing intel.',115,233)
        }
        else if (introTime < 16) {
            ctx.fillText('It seems the evil Doctor Y has yet another',115,215)
            ctx.fillText('plan for world domination; the Z device.',115,233)
        }
        else if (introTime < 20) {
            ctx.fillText('Your mission, which you can\'t choose to not accept,',115,215)
            ctx.fillText('will be to infiltrate Doctor Y\'s secret underground lair,',115,233)
            ctx.fillText('identify the Z device, and make sure it\'s never activated.',115,251)
        }
        else if (introTime < 23) {
            ctx.fillText('Good luck, the fate of the world is in your hands.',115,215)
            ctx.fillText('This message will self-destruct in five seconds.',115,233)
        }
    }
    else if (introTime > 23 && introTime < 24) {
        ctx.strokeStyle = 'darkslategray'; ctx.fillStyle = 'darkslategray'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(135-20,255); ctx.lineTo(115-20,285); ctx.lineTo(125-20,245); ctx.closePath(); ctx.fill(); 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(110-20,200,110,60); ctx.strokeRect(110-20,200,110,60);
        
        ctx.fillStyle = 'darkslategray'; ctx.fillText('Oh no!',115-20,215)
    }
    else if ((introTime > 24 && introTime < 28)||(introTime > 31 && introTime < 47)) {
        ctx.fillStyle = 'gray'; ctx.fillRect(playerX,playerY,10,25); 
        if (introTime < 28) {playerX += 2;}
    }
    if (introTime > 31 && introTime < 36) {
        ctx.strokeStyle = 'darkslategray'; ctx.fillStyle = 'darkslategray'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(195+300,255); ctx.lineTo(215+300,285); ctx.lineTo(205+300,245); ctx.closePath(); ctx.fill(); 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(110+90,200,320,60); ctx.strokeRect(110+90,200,320,60);
        
        ctx.fillStyle = 'darkslategray'; 
        if (introTime < 33) {ctx.fillText('My house!',115+90,215)}
        else if (introTime < 36) {
            ctx.fillText('Oh well, i have a mission to complete.',115+90,215)
            ctx.fillText('Let\'s go!',115+90,233)
        }
    }
    else if ((introTime > 38 && introTime < 47) || (introTime > 50 && introTime < 66)) {
        ctx.save(); 
        ctx.translate(hueyArray[52], hueyArray[53]); 
        ctx.rotate(hueyAngle * Math.PI / 180); 
        ctx.translate(-hueyArray[52], -hueyArray[53]); 
        
        //main body
        ctx.beginPath(); ctx.lineWidth = 2; ctx.fillStyle = 'gray'; 
        ctx.arc(hueyArray[0],hueyArray[1],10,-90 * Math.PI / 180,90 * Math.PI / 180); 
        ctx.moveTo(hueyArray[2],hueyArray[3]); ctx.lineTo(hueyArray[4],hueyArray[5]); 
        ctx.lineTo(hueyArray[6],hueyArray[7]); ctx.lineTo(hueyArray[8],hueyArray[9]); 
        ctx.lineTo(hueyArray[10],hueyArray[11]); ctx.lineTo(hueyArray[12],hueyArray[13]); 
        ctx.lineTo(hueyArray[14],hueyArray[15]); ctx.lineTo(hueyArray[16],hueyArray[17]); 
        ctx.lineTo(hueyArray[18],hueyArray[19]); ctx.lineTo(hueyArray[20],hueyArray[21]); 
        ctx.lineTo(hueyArray[22],hueyArray[23]);ctx.lineTo(hueyArray[24],hueyArray[25]); 
        ctx.lineTo(hueyArray[26],hueyArray[27]); ctx.lineTo(hueyArray[28],hueyArray[29]); ctx.fill(); 
        //landing gear
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.strokeStyle = 'gray'; ctx.moveTo(hueyArray[30],hueyArray[31]);
        ctx.lineTo(hueyArray[32],hueyArray[33]); ctx.moveTo(hueyArray[34],hueyArray[35]); 
        ctx.lineTo(hueyArray[36],hueyArray[37]); ctx.lineTo(hueyArray[38],hueyArray[39]); 
        ctx.moveTo(hueyArray[40],hueyArray[41]); ctx.lineTo(hueyArray[42],hueyArray[43]); ctx.stroke();
        //collective
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hueyArray[44],hueyArray[45]); ctx.lineTo(hueyArray[46],hueyArray[47]); 
        ctx.lineTo(hueyArray[48],hueyArray[49]); ctx.lineTo(hueyArray[50],hueyArray[51]); ctx.stroke()
        //rotor shaft
        ctx.beginPath(); ctx.lineWidth = 4; ctx.moveTo(hueyArray[52],hueyArray[53]); 
        ctx.lineTo(hueyArray[54],hueyArray[55]); ctx.stroke();
        //rotor
        ctx.beginPath(); ctx.strokeStyle = 'lightgray'; 
        ctx.moveTo(hueyArray[56],hueyArray[57]); ctx.lineTo(hueyArray[58],hueyArray[59]); ctx.stroke();
        //tail rotor
        ctx.beginPath(); ctx.fillStyle = 'lightgray'; ctx.arc(hueyArray[60],hueyArray[61],20,0,360); ctx.fill();
        ctx.beginPath(); ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.moveTo(hueyArray[62],hueyArray[63]);
        ctx.lineTo(hueyArray[64],hueyArray[65]); ctx.stroke();
        ctx.beginPath(); ctx.fillStyle = 'gray'; ctx.arc(hueyArray[66],hueyArray[67],2.5,0,360); ctx.fill();
        //main window
        ctx.beginPath(); ctx.fillStyle = 'cornflowerblue'; ctx.moveTo(hueyArray[68],hueyArray[69]); 
        ctx.lineTo(hueyArray[70],hueyArray[71]); ctx.lineTo(hueyArray[72],hueyArray[73]); 
        ctx.lineTo(hueyArray[74],hueyArray[75]); ctx.closePath(); ctx.fill();
        //nose window
        ctx.beginPath(); ctx.arc(hueyArray[76],hueyArray[77],10,0,90 * Math.PI / 180);
        ctx.lineTo(hueyArray[78],hueyArray[79]); ctx.closePath(); ctx.fill();
        //opening
        if (introTime > 50) {ctx.fillStyle = 'rgb(40,40,40)'} else {ctx.fillStyle = 'skyblue'} 
        ctx.fillRect(hueyArray[80],hueyArray[81],55,30);
        //benches
        ctx.beginPath(); ctx.strokeStyle = 'gray'; 
        ctx.moveTo(hueyArray[82],hueyArray[83]); ctx.lineTo(hueyArray[84],hueyArray[85]); 
        ctx.moveTo(hueyArray[86],hueyArray[87]); ctx.lineTo(hueyArray[88],hueyArray[89]);
        ctx.moveTo(hueyArray[90],hueyArray[91]); ctx.lineTo(hueyArray[92],hueyArray[93]); 
        ctx.moveTo(hueyArray[94],hueyArray[95]); ctx.lineTo(hueyArray[96],hueyArray[97]);
        ctx.stroke()
        
        ctx.restore(); 

        if (introTime < 46 || introTime > 50) {
            console.log(hueyX+' : '+hueyY+' : '+hueyAngle)
            
            if (introTime < 40) {hueyX = 2; hueyY = 0.5}
            else if (introTime < 43) {hueyX = 1.5; hueyY = 0.6}
            else if (introTime < 44) {hueyX = 0.75; hueyY = 0.75}
            else if (introTime < 46) {hueyX = 0; hueyY = 0.8}
            
            if (introTime > 50 && introTime < 51) {hueyX = 0.8; hueyY = 0.5}
            else if (introTime > 51 && introTime < 52) {hueyX = 0.5; hueyY = 0.75}
            else if (introTime > 52 && introTime < 54) {hueyX = 0.25; hueyY = 1}
            else if (introTime > 54 && introTime < 56) {hueyX = 0; hueyY = 0.75}
            else if (introTime > 56 && introTime < 58) {hueyX = 0; hueyY = 0}
            
            if (introTime > 58 && introTime < 59) {hueyY = -0.5}
            else if (introTime > 59 && introTime < 60) {hueyY = -1}
            else if (introTime > 60 && introTime < 61) {hueyX = 0.5}
            else if (introTime > 61 && introTime < 62) {hueyX = 1}
            else if (introTime > 62) {hueyX = 1.75}
            

            if (introTime > 39 && introTime < 40) {hueyAngle -= 0.25}
            else if (introTime > 43 && introTime < 44) {hueyAngle += 0.45}
            else if (introTime > 59 && introTime < 61) {hueyAngle += 0.25}
            
            for (i = 0; i < hueyArray.length; i++) {
                //x movement
                if (i % 2 == 0) {hueyArray[i] += hueyX;}
                //y movement
                else {hueyArray[i] += hueyY;}
            }
        }
    }

    if (introTime > 50) {
        ctx.fillStyle = 'gray'; ctx.fillRect(playerX,playerY,10,25); 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(playerX+5,playerY+7,12,5)
        if (introTime > 50 && introTime < 51) {playerX += 0.8; playerY += 0.5}
        else if (introTime > 51 && introTime < 52) {playerX += 0.5; playerY += 0.75}
        else if (introTime > 52 && introTime < 54) {playerX += 0.25; playerY += 1}
        else if (introTime > 54 && introTime < 56) {playerY += 0.75}
        else if (introTime > 56 && introTime < 57) {playerY += 0}
        
        if (introTime > 57) {playerY = totH-30}

        if (introTime > 63) {playerX += 0.75}
    }

    if (introTime > 48 && introTime < 48.1) {
        playerX = 125; playerY = 90;
        for (i = 0; i < hueyArray.length; i++) {
            //x movement
            if (i % 2 == 0) {hueyArray[i] -= 50;}
            //y movement
            else {hueyArray[i] -= 50;}
        }
    }
     
    if (introTime > 66) { 
        clearInterval(levelInterval); introTime = 0; messageThingY = 0; playerX = 125; playerY = totH-30; hueyAngle = -10;
        hueyArray = [-30,100,-30,90,-40,70,-55,70,-60,55,-105,55,-110,70,-205,70,-220,40,-230,40,-220,70,-220,80,
            -130,100,-120,110,-30,110,-110,110,-110,120,-120,120,-30,120,-25,115,-40,110,-40,120,-90,55,-90,50,-75,
            50,-75,55,-82.5,55,-82.5,40,-200,40,35,40,-215,75,-235,75,-195,75,-215,75,-30,90,-45,90,-45,70,-40,70,-30,
            100,-30,100,-110,75,-110,95,-100,95,-103,95,-103,105,-55,95,-65,95,-62,95,-62,105];
        console.log('intro finished'); ctx.fillStyle = 'black'; ctx.fillRect(0,0,totW,totH); setTimeout(loadMenu,2000)
    }
}


function levelLoop() {
    if (demo == true) {
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
    }
    else {ctx.fillStyle = 'lightgray'; ctx.fillRect(0,0,totW,totH)}
    //healtbar+armorbar
    var healthPercentage = health / maxHealth;
    var armorPercentage = armor / maxArmor;
    ctx.fillStyle = 'white'
    ctx.fillRect(15,15,170,15)
    ctx.fillStyle = 'red';
    if (health <= maxHealth) {
        ctx.fillRect(45,20,140*healthPercentage,10)
    }
    else if (health > maxHealth) {
        ctx.fillRect(45,20,140,10)
        var overflowHealthPercentage = (health - maxHealth) / maxHealth
        ctx.fillStyle = 'maroon'; 
        ctx.fillRect(45,20,140*overflowHealthPercentage,10)
    }
    ctx.fillStyle = 'blue';
    if (armor <= maxArmor) {
        ctx.fillRect(45,15,140*armorPercentage,5)
    }
    else if (armor > maxArmor) {
        ctx.fillRect(45,15,140,5)
        var overflowArmorPercentage = (armor - maxArmor) / maxArmor
        ctx.fillStyle = 'darkblue';
        ctx.fillRect(45,15,140*overflowArmorPercentage,5)
    }
    ctx.lineWidth = 2; ctx.strokeStyle = 'black'; ctx.strokeRect(15,15,170,15)
    ctx.font = '15px consolas'; ctx.fillStyle = 'black'; ctx.fillText(Math.round(health),17,28)
    //points counter
    ctx.fillText(points,17,45); ctx.fillStyle = 'gold'; 
    if (points.toString().length == 1) {ctx.fillRect(27,35,10,10)}
    else if (points.toString().length == 2) {ctx.fillRect(35,35,10,10);}
    else if (points.toString().length == 3) {ctx.fillRect(45,35,10,10)}
    else if (points.toString().length == 4) {ctx.fillRect(55,35,10,10)}
    //grenade counter
    ctx.fillStyle = 'black'
    ctx.fillText(grenades,17,60); ctx.fillStyle = 'darkslategray'; ctx.fillRect(27,50,10,10)

    if (keys && keys['g']) {grenades = 9; health += 0.4; armor += 0.2; points += 20}

    //walk and jump
    var xInput, yInput; if(keys && (keys['a'] || keys['ArrowLeft'])) {xInput = -1}; 
    if (keys && (keys['d'] || keys['ArrowRight'])) {xInput = 1}; if (keys && (keys['w'] || keys['ArrowUp'])) {yInput = 1}
    

    floors.forEach((floor,flindex) => {
        floor.update()
        if (player.floor(floor)) {
            player.y = floor.y - player.height;
            player.grounded = true;
        }
        else if (player.floorBottom(floor)) {
            player.y = floor.y + floor.height;
            player.fallSpeed = 0
        }
        
        if (player.crashWith(floor) && floor.type == 'spikes') {health = 0}

        projectiles.forEach((bullet,bindex) => {
            if (bullet.type == 'grenade') {
                if (bullet.floor(floor)) {
                    bullet.y = floor.y - bullet.height;
                    bullet.grounded = true;
                    bullet.dy = -bullet.dy;
                    console.log('bounce on floor')
                }
                if (bullet.floorBottom(floor)) {
                    bullet.y = floor.y + floor.height;
                    bullet.dy = 0
                }
            }
            else {
                if (bullet.crashWith(floor)) {
                    projectiles.splice(bindex,1)
                    //console.log('bullet spliced by floor:'+floor)
                }
            }

            if (floor.type == 'shootToOpen' && bullet.type == 'frend') {
                if (bullet.x > floor.lx && bullet.x < floor.lx + 12 && bullet.y > floor.ly && bullet.y < floor.ly + 12) {
                    projectiles.splice(bindex,1)
                    floors.splice(flindex,1)
                }
            }
        })
    })

    walls.forEach((wall,windex) => {
        wall.update()
        if (wall.unlocked == false) {
            if (player.wallLeft(wall)) {
                player.x = wall.x - player.width
            }
            else if (player.wallRight(wall)) {
                player.x = wall.x + wall.width
            }
        }
        
        if (wall.type == 'breakable') {
            projectiles.forEach((bullet,bundex) => {
                if (bullet.crashWith(wall))
                {
                    if (bullet.type == 'grenade') {
                        bullet.dx = -bullet.dx
                    }   
                    else if (bullet.type == 'enemi') {
                        projectiles.splice(bundex,1)
                    }
                    else if (bullet.type == 'frend' || bullet.type == 'fragment') {
                        walls.splice(windex,1)
                        projectiles.splice(bundex,1)
                    }
                    else {
                        projectiles.splice(bundex,1)
                    }
                }
            })
        }

        else if (wall.type == 'gBreakable') {
            projectiles.forEach((bullet,bundex) => {
                if (bullet.crashWith(wall))
                {
                    if (bullet.type == 'grenade') {
                        bullet.dx = -bullet.dx
                    }
                    else if (bullet.type == 'frend' || bullet.type == 'enemi') {
                        projectiles.splice(bundex,1)
                    }
                    else if (bullet.type == 'fragment') {
                        if (walls.includes(wall,windex-1))
                        {
                            walls.splice(windex,1)
                            projectiles.splice(bundex,1)
                        }
                    }
                    else {
                        projectiles.splice(bundex,1)
                    }
                }
            })
        }
        
        else {
            projectiles.forEach((bullet,bundex) => {
                if (bullet.crashWith(wall) && wall?.unlocked == false) {
                    if (bullet.type == 'frend' || bullet.type == 'enemi' || bullet.type == 'fragment') {
                        projectiles.splice(bundex,1)
                        console.log('bullet spliced by wall')
                    }
                    else if (bullet.type == 'grenade') {
                        bullet.dx = -bullet.dx
                    }
                    else {
                        projectiles.splice(bundex,1)
                    }
                }
            })
        }

        if (wall.type == 'keycard' && wall.unlocked == false) {
            if (player.x + player.width > wall.x - 20 && player.x + player.width < wall.x && player.y + player.height > wall.y - 10 && player.y < wall.y + wall.height + 10) {
                ctx.fillStyle = 'black'; ctx.font = '12px consolas'; 
                if (keyCards[wall.id-1] == false) {
                    ctx.fillText('Keycard',wall.x-55,wall.y-15);
                    ctx.fillText('required',wall.x-55,wall.y-3);
                }
                else if (keyCards[wall.id-1] == true) {
                    ctx.fillText('[E]Insert',wall.x-65,wall.y-15);
                    ctx.fillText('keycard',wall.x-50,wall.y-3);
                    if (keys && keys['e']) {console.log('unlocking key door '+wall.id); wall.unlocked = true}
                }
            }
            else if (player.x < wall.x + wall.width + 20 && player.x > wall.x + wall.width && player.y + player.height > wall.y - 10 && player.y < wall.y + wall.height + 10) {
                ctx.fillStyle = 'black'; ctx.font = '12px consolas'; 
                if (keyCards[wall.id-1] == false) {
                    ctx.fillText('Keycard',wall.x+8,wall.y-15);
                    ctx.fillText('required',wall.x+8,wall.y-3);
                }
                else if (keyCards[wall.id-1] == true) {
                    ctx.fillText('[E]Insert',wall.x+8,wall.y-15);
                    ctx.fillText('keycard',wall.x+23,wall.y-3);
                    if (keys && keys['e']) {console.log('unlocking key door '+wall.id); wall.unlocked = true}
                }
            }
        }

        else if (wall.type == 'button' && wall.unlocked == false) {
            if (player.x + player.width > wall.lx - 20 && player.x < wall.lx + 28 && player.y + player.height > wall.ly - 10 && player.y < wall.ly + 28) {
                ctx.fillStyle = 'black'; ctx.font = '12px consolas'
                ctx.fillText('[E]Press button',wall.lx - 50,wall.ly - 15)
                if (keys && keys['e']) {console.log('opening butt door '+wall.id); wall.unlocked = true}
            }
        }
    })

    //brikbrek
    arcadeTest.update();
    ctx.fillStyle = 'green'; ctx.fillRect(arcadeTest.x+2,arcadeTest.y+2,6,6)    
    if (player.x + player.width > arcadeTest.x - 20 && player.x < arcadeTest.x + arcadeTest.width + 20 && player.y + player.height > arcadeTest.y - 10 && player.y < arcadeTest.y + arcadeTest.height + 5) {
        ctx.fillStyle = 'black'; ctx.font = '12px consolas'; 
        ctx.fillText('[E]Play Brik-Brek',arcadeTest.x-50,arcadeTest.y-8);

        if (keys && keys['e']) {console.log('starting brik-brek'); clearInterval(levelInterval); gameState = states.brik; startBrikBrek()}
    }

    //pewpew
    arcade2.update();
    ctx.fillStyle = 'green'; ctx.fillRect(arcade2.x+2,arcade2.y+2,6,6)
    if (player.x + player.width > arcade2.x - 20 && player.x < arcade2.x + arcade2.width + 20 && player.y + player.height > arcade2.y - 10 && player.y < arcade2.y + arcade2.height + 5) {
        ctx.fillStyle = 'black'; ctx.font = '12px consolas';
        ctx.fillText('[E]Play Pew-Pew',arcade2.x-47,arcade2.y-8);

        if (keys && keys['e']) {console.log('starting pew-pew'); clearInterval(levelInterval); gameState = states.pew; startPewPew()}
    }

    //slotman
    arcade3.update()
    ctx.fillStyle = 'green'; ctx.fillRect(arcade3.x+2,arcade3.y+2,6,6)
    if (player.x + player.width > arcade3.x - 20 && player.x < arcade3.x + arcade3.width + 20 && player.y + player.height > arcade3.y - 10 && player.y < arcade3.y + arcade3.height + 5) {
        ctx.fillStyle = 'black'; ctx.font = '12px consolas';
        ctx.fillText('[E]Play Slot-Man',arcade3.x-47,arcade3.y-8);

        if (keys && keys['e']) {console.log('starting slot-man'); clearInterval(levelInterval); gameState = states.slot; startSlotMan()}
    }

    //brikbrek 2
    if (level != 1 || demo == true) {
        arcade4.update()
        ctx.fillStyle = 'blue'; ctx.fillRect(arcade4.x+2,arcade4.y+2,6,6)
        if (player.x + player.width > arcade4.x - 20 && player.x < arcade4.x + arcade4.width + 20 && player.y + player.height > arcade4.y - 10 && player.y < arcade4.y + arcade4.height + 5) {
            ctx.fillStyle = 'black'; ctx.font = '12px consolas';
            ctx.fillText('[E]Play Brik-Brek 2',arcade4.x-50,arcade4.y-8);

            if (keys && keys['e']) {console.log('starting brik-brek 2'); clearInterval(levelInterval); gameState = states.brik2; startBrikBrek2()}
        }
    }
    

    if (level == 1 && demo == false) {runLevel1()}
    
    //render player
    player.update(xInput, yInput); pGun.x = player.x + 20; pGun.y = player.y + 22; pGun.update();
    //console.log('playerX: '+player.x+' playerY: '+player.y+' gunX: '+pGun.x+' gunY: '+pGun.y);

    enemies.forEach((enemy,index) => {
        enemy.shootTime += 0.02;
        if (enemy.attacking == true) {
            if (enemy.shootTime > 0.5) {
                projectiles.push(new Projectile(3,3,'maroon',enemy.x,enemy.y+5,player.x,player.y+5,'enemi'))
            }
            var jump = 0
            if (player.x < enemy.x) {
                if (player.x < enemy.x - 120) {enemy.x -= 1.5; /*console.log('following to left')*/}
                else if (player.x > enemy.x - 75) {enemy.x += 1.5; /*console.log('retreating to rigth')*/}
            }
            else if (player.x > enemy.x) {
                if (player.x > enemy.x + 120) {enemy.x += 1.5; /*console.log('following to right')*/}
                else if (player.x < enemy.x + 75) {enemy.x -= 1.5; /*console.log('retreating to left')*/}
            }
            if (player.y < enemy.y) {jump = 1; console.log('jumping')}
            enemy.attackTimer -= 0.02
        }    
        if (enemy.attackTimer <= 0) {enemy.attacking = false}

        floors.forEach(floor => {
            if (enemy.floor(floor)) {
                enemy.y = floor.y - enemy.height;
                enemy.grounded = true;
            }
            else if (enemy.floorBottom(floor)) {
                enemy.y = floor.y + floor.height;
                enemy.fallSpeed = 0
            }
            if (enemy.crashWith(floor) && floor.type == 'spikes') {enemy.health = 0}
        })
        walls.forEach(wall => {
            if (wall.unlocked == false) {
                if (enemy.wallLeft(wall)) {
                    enemy.x = wall.x - enemy.width
                }
                else if (enemy.wallRight(wall)) {
                    enemy.x = wall.x + wall.width
                }
            }
        })
        
        
        if (enemy.shootTime > 0.5) {
            projectiles.push(new Projectile(2,2,'white',enemy.x,enemy.y+5,player.x,player.y+5,'detector',index))
            enemy.shootTime = 0
        }
        if (enemy.health <= 0) {enemies.splice(index,1); guns.splice(index,1)}
        enemy.update(0,jump);
    })

    guns.forEach((gunner,index) => {
        gunner.x = enemies[index].x + 20;
        gunner.y = enemies[index].y + 22;
        if (gunner.isPlayer != 'yes') {
            if (enemies[index].attacking == true) {
                gunner.angle = Math.atan2((player.y+20) - gunner.centerY, (player.x+20) - gunner.x)
            }
            else (gunner.angle = gunner.angle)
        }
        gunner.update()
    })

    projectiles.forEach((bullet,index) => {
        if (bullet.type != 'grenade') {
            bullet.update();
        }
        
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
        else if (bullet.type == 'detector' && bullet.crashWith(player)) {
            projectiles.splice(index,1)
            if (bullet.enemyIndex == 69) {gunSight = 1}
            else {
                enemies[bullet.enemyIndex].attackTimer = 2 ?? console.log('404 enemy not found')
                enemies[bullet.enemyIndex].attacking = true
            }
        }
    })

    pickups.forEach((pickup,index) => {
        pickup.update()
        floors.forEach(floor => {
            if (pickup.type != 'card' && pickup.floor(floor)) {
                pickup.y = floor.y - pickup.height;
                pickup.grounded = true;
            }
        })
        if (player.crashWith(pickup)) {
            pickups.splice(index,1)
            if (pickup.type == 'points') {
                points += pickup.amount; console.log('gained '+pickup.amount+' points, have '+points); 
            }
            else if (pickup.type == 'health' && health < maxHealth) {
                health += pickup.amount; console.log('gained '+pickup.amount+' health, have '+health);
                if (health > maxHealth) {health = maxHealth}
            }
            else if (pickup.type == 'armor' && armor < maxArmor) {
                armor += pickup.amount; console.log('gained '+pickup.amount+' armor, have '+armor);
                if (armor > maxArmor) {armor = maxArmor}
            }
            else if (pickup.type == 'grenade' && grenades < 9) {
                grenades += pickup.amount; console.log('picked '+pickup.amount+' grenade(s), have '+grenades)
            }
            else if (pickup.type == 'card') {var index = pickup.id; keyCards[index-1] = true; console.log(keyCards)}
        }
    })
    
    if (health <= 0) 
    {
        console.log('deeeed'); clearInterval(levelInterval); ctx.fillStyle = 'maroon'; ctx.fillRect(0,0,totW,totH)
        ctx.fillStyle = 'crimson'; ctx.font = '35px consolas'; ctx.fillText('You died...',totW/2-200,totH/2);
        ctx.fillStyle = 'gray'; ctx.fillRect(player.x,totH-10,25,10); ctx.fillStyle = 'lightslategrey';
        ctx.fillRect(player.x+5,totH-16,5,12); setTimeout(loadMenu,3000); demo = false; trapDoor = false
    }
    if (keys && keys['Escape']) {
        clearInterval(levelInterval); console.log('exiting level');
        setTimeout(loadMenu,1000); demo = false; trapDoor = false
    }
}



function brikBrek() {
    if (demo == true) {ctx.fillStyle = 'skyblue'} else {ctx.fillStyle = 'lightgray'}; 
    ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'blue'; ctx.fillRect(135,50,335,350);
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
                        if (b.status >= 4) {ctx.fillStyle = 'black'}
                        else if (b.status == 3) {ctx.fillStyle = 'darkslategray'}
                        else if (b.status == 2) {ctx.fillStyle = 'lightslategray'}
                        else if (b.status == 1) {ctx.fillStyle = 'white'}
                    }
                    else {
                        if (b.status >= 4) {ctx.fillStyle = 'goldenrod'}
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
        ctx.fillRect(bBall.x,bBall.y,ball.size+bBall.extraSize,ball.size+bBall.extraSize);
        console.log(bBall.extraSize)
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
                    else {brikLives -= 1; b.x = totW/2 - 5; b.y = totH - 125; b.xSpeed = 0; b.ySpeed = -3;}
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
                            //brickArray[c][r-1].status -= 1
                            //brickArray[c][r+1].status -= 1
                            //brickArray[c-1][r].status -= 1
                            //brickArray[c+1][r].status -= 1
                        }
                        if (b.status <= 0) {
                           brickCount-- 
                           console.log(brickCount)
                           if (b.pUp == true) {
                                var pup = Math.floor(Math.random() * 7)
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
                                        brikBalls.push({x:ball.x,y:ball.y,xSpeed:ball.xSpeed,ySpeed:ball.ySpeed,extraSize:0});
                                    break;
                                    case 4:
                                        msgText = 'explosive ball';
                                        explodeTime = 8;
                                    break;
                                    case 5:
                                        msgText = 'bigger ball';
                                        baller.extraSize += 3
                                    break;
                                    case 6:
                                        if (baller.extraSize == -2) {
                                            msgText = 'bigger ball';
                                            baller.extraSize += 2
                                        }
                                        else {
                                            msgText = 'smaller ball';
                                            baller.extraSize -= 2
                                        }
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

function brikBrek2() {
    if (demo == true) {ctx.fillStyle = 'skyblue'} else {ctx.fillStyle = 'lightgray'}; 
    ctx.fillRect(0,0,totW,totH); ctx.fillStyle = arcadeGradBig; ctx.fillRect(135,50,335,350);
    ctx.fillStyle = 'yellow'; ctx.font = '60px consolas'; ctx.fillText('Brik-Brek 2',150,100,300);
    ctx.fillStyle = 'blue'; ctx.fillRect(150,115,305,200); //console.log('paddle.x: '+paddle.x)

    if (keys && (keys['a'] || keys['ArrowLeft'])) {
        if (paddle2.x > 150) {
            paddle2.x -= paddle2.speed;
        }
        ctx.fillStyle = 'yellow'; ctx.beginPath()
        ctx.arc(250,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'black'; ctx.fillText('A',233,377)
    }
    else {
        ctx.fillStyle = 'gold'; ctx.beginPath()
        ctx.arc(250,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'yellow'; ctx.beginPath()
        ctx.arc(250,350,30,0,360); ctx.fill()
        ctx.fillStyle = 'black'; ctx.fillText('A',233,367)
    }

    if (keys && (keys['d'] || keys['ArrowRight'])) {
        if ((paddle2.x < 405 && paddle2.width == 50)||(paddle2.x < 380 && paddle2.width == 75)||(paddle2.x < 355 && paddle2.width == 100)) {
            paddle2.x += paddle2.speed;
        }
        ctx.fillStyle = 'yellow'; ctx.beginPath()
        ctx.arc(350,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'black'; ctx.fillText('B',333,377)
    }
    else {
        ctx.fillStyle = 'gold'; ctx.beginPath()
        ctx.arc(350,360,30,0,360); ctx.fill()
        ctx.fillStyle = 'yellow'; ctx.beginPath()
        ctx.arc(350,350,30,0,360); ctx.fill()
        ctx.fillStyle = 'black'; ctx.fillText('B',333,367)
    }

    ctx.fillStyle = 'black'; ctx.font = '13px consolas'; ctx.fillText('Press [Q] to quit',10,totH-10)
    
    ctx.fillStyle = 'darkslategray'; ctx.fillRect(paddle2.x,paddle2.y,paddle2.width,paddle2.height);
    ctx.beginPath(); ctx.ellipse(paddle2.x+paddle2.width/2,paddle2.y,paddle2.width/2,5,0,0,180*Math.PI/180,true)
    ctx.fill()

    brikTime += 0.02
    ctx.fillStyle = 'crimson'; ctx.font = '18px consolas'; ctx.fillText('♥'+brik2Lives,155,280)
    ctx.fillStyle = 'black'; ctx.font = '16px consolas'; ctx.fillText(Math.round(brikTime*10)/10,155,300)

    brik2Balls.forEach(bBall => {
        bBall.x += bBall.xSpeed;
        bBall.y += bBall.ySpeed;
        if (explodeTime > 0) {ctx.fillStyle = 'red'}
        else {ctx.fillStyle = 'darkslategrey'}
        ctx.beginPath(); 
        ctx.arc(bBall.x+(ball2.size+bBall.extraSize)/2,bBall.y+(ball2.size+bBall.extraSize)/2,(ball2.size+bBall.extraSize)/2,0,10)
        ctx.fill()
        console.log(bBall.extraSize)
    })

    brik2Balls.forEach((b,index) => {
        if ( b.y < 115 ) { b.ySpeed = -b.ySpeed; }
        if ( b.x < 150 || b.x + ball2.size + b.extraSize > 455) { b.xSpeed = -b.xSpeed; }
        if ( b.y > 303 ) {
            if (shieldTime <= 0) {
                if (brik2Balls.length == 1) {
                    if (brik2Lives == 0) {
                        clearInterval(levelInterval); console.log('failed'); ctx.font = '45px consolas';
                        ctx.fillStyle = 'blue'; ctx.fillRect(150,115,305,200); ctx.fillStyle = 'red';
                        ctx.fillText('Game over',190,200); brik2Lvl = 1; setTimeout(startBrikBrek2,2000);
                        shieldTime = 0; msgTime = 0; explodeTime = 0; brikTime = 0
                    }
                    else {brik2Lives -= 1; b.x = totW/2 - 5; b.y = totH - 125; b.xSpeed = 0; b.ySpeed = -3;}
                }
                else {brik2Balls.splice(index,1)}
            }
            else {b.ySpeed = -b.ySpeed; shieldTime = 0; msgTime = 0}
        }
    })

    brik2Balls.forEach(baller => {
        if ( baller.x > paddle2.x && baller.y + (ball2.size+baller.extraSize) / 2 > paddle2.y&& baller.y < paddle2.y + paddle2.height && baller.x < paddle2.x + paddle2.width )
        {   
            var hitPos = (baller.x - (paddle2.x + paddle2.width / 2)) / (paddle2.width / 2);

            var refAngle = hitPos * (Math.PI / 4);

            var speed = Math.sqrt(baller.xSpeed * baller.xSpeed + baller.ySpeed * baller.ySpeed);

            baller.xSpeed = speed * Math.sin(refAngle);
            baller.ySpeed = -speed * Math.cos(refAngle);

            baller.y = paddle2.y - ball2.size;
        }
    })

    if (keys && keys['q']) {
        clearInterval(levelInterval); gameState = states.level; console.log('exiting brik-brek 2');
        levelInterval = setInterval(levelLoop,20)
    }
}

function pewPew() {
    if (demo == true) {ctx.fillStyle = 'skyblue'} else {ctx.fillStyle = 'lightgray'};
    ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'black'; ctx.fillRect(135,50,335,350);
    ctx.fillStyle = 'white'; ctx.font = '60px consolas'; ctx.fillText('Pew-Pew',185,100);
    ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200);
    if (fireCool > 0) {fireCool -= 0.02}
    if (spawnCool > 0 && pewEnemies.length < 10) {spawnCool -= 0.02}
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
        arrow.angle -= 5;
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
        arrow.speed = 2;
        arrow.dx = arrow.speed * Math.cos((arrow.angle - 90) * Math.PI / 180)
        arrow.dy = arrow.speed * Math.sin((arrow.angle - 90) * Math.PI / 180)
        arrowPArray.push({x:arrow.centerX,y:arrow.centerY,xSpeed:-arrow.dx + Math.random() - 1,ySpeed:-arrow.dy + Math.random() - 1,lifeTime:0,type:'particle'})
        ctx.fillStyle = 'crimson'; ctx.beginPath()
        ctx.moveTo(300,320); ctx.lineTo(270,335)
        ctx.lineTo(270,340); ctx.lineTo(330,340)
        ctx.lineTo(330,335); ctx.closePath(); ctx.fill()
        justReleased = true
    }
    else {  
        if (justReleased == true)
        {
            arrow.speed = 1;
            arrow.dx = arrow.speed * Math.cos((arrow.angle - 90) * Math.PI / 180)
            arrow.dy = arrow.speed * Math.sin((arrow.angle - 90) * Math.PI / 180)
            justReleased = false
        }
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
        arrow.angle += 5
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
    console.log('speed: '+arrow.speed+' dx: '+arrow.dx+' dy: '+arrow.dy)

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
        
        ctx.fillStyle = 'lightslategray'
        ctx.textAlign = 'center'
        ctx.fillText(last.hp,last.xPos,last.yPos+3)  
    });

    ctx.textAlign = 'left'

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

     
    //draw time, score and health
    ctx.fillStyle = 'black';
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

function slotMan() {
    if (demo == true) {ctx.fillStyle = 'skyblue'} else {ctx.fillStyle = 'lightgray'};
    ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'yellow'; ctx.fillRect(135,50,335,350);
    ctx.fillStyle = 'green'; ctx.fillRect(150,115,305,200);

    //roll dividers vertical
    ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'black'; 
    ctx.moveTo(200.833,115); ctx.lineTo(200.833,315);ctx.moveTo(251.666,115); ctx.lineTo(251.666,315); 
    ctx.moveTo(302.5,115); ctx.lineTo(302.5,315); ctx.moveTo(353.333,115); ctx.lineTo(353.333,315);
    ctx.moveTo(404.166,115); ctx.lineTo(404.166,315); ctx.stroke()


    //symbol/icon drawing
    for (var r = 0; r < 6; r++) { 
        rolls[r][0].forEach(symbol => {
            var icon
            if (symbol.icon == 'oneCoin') {icon = coin}
            else if (symbol.icon == 'twoCoins') {icon = twoCoins}
            else if (symbol.icon == 'threeCoins') {icon = threeCoins}
            else if (symbol.icon == 'moneyBag') {icon = moneyBag}
            else if (symbol.icon == 'moneyChest') {icon = moneyChest}
            else if (symbol.icon == 'grenade') {icon = grenade}
            else if (symbol.icon == 'twoGrenades') {icon = twoGrenades}
            else if (symbol.icon == 'oneHeart') {icon = oneHeart}
            else if (symbol.icon == 'twoHearts') {icon = twoHearts}
            else if (symbol.icon == 'armor') {icon = newArmor}
            
            if (symbol.yPos > 75 && symbol.yPos < 315) {
                ctx.beginPath();ctx.moveTo(rolls[r][1],symbol.yPos);
                ctx.lineTo(rolls[r][1]+50.833,symbol.yPos); ctx.stroke()
                ctx.drawImage(icon,rolls[r][1],symbol.yPos,50,40)
            }
        })
    }
    
    ctx.fillStyle = 'yellow'; ctx.fillRect(150,60,305,55); ctx.fillRect(150,315,305,50);
    ctx.fillStyle = 'black'; ctx.font = '60px consolas'; ctx.fillText('Slot-Man',170,100);

    //win area
    ctx.beginPath(); ctx.strokeStyle = 'crimson'; ctx.moveTo(150,195); ctx.lineTo(455,195); 
    ctx.moveTo(150,235); ctx.lineTo(455,235); ctx.stroke();

    //coin slot
    ctx.strokeStyle = 'black'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(200,337.5); ctx.lineTo(200,377.5); ctx.stroke();

    //bottom thing
    if (spinning != true) {
        ctx.fillStyle = 'blue'; ctx.fillRect(150,275,305,40)
        ctx.font = '18px consolas'; ctx.fillStyle = 'black';
        ctx.fillText('credits:'+credits+'|mode:'+mode+'|cost:'+cost,155,300,290)
    }

    //mode button
    if (keys && keys['m']) {
        ctx.fillStyle = 'crimson';
        ctx.fillRect(400,342.5,30,30)
        if (mPressed == false && spinning == false) {
            mPressed = true
            if (mode == 'auto') {mode = 'manual'; cost = 10}
            else {mode = 'auto'; cost = 5}
            setTimeout(() => {mPressed = false},1000)
        }
    }
    else {
        ctx.fillStyle = 'maroon';
        ctx.fillRect(400,342.5,30,30)
        ctx.fillStyle = 'crimson';
        ctx.fillRect(400,332.5,30,30)
    }

    //main button
    if (keys && keys[' ']) {
        ctx.fillStyle = 'crimson'; 
        ctx.fillRect(240,337.5,120,40)
        if (spinning == false && credits >= cost) {
            spinning = true; actuallySpinning = true; credits -= cost; console.log('spinning!!!');
            spinDuration = 5 + Math.random() * 2 - 1; 
            offset1 = 0.5 + Math.random() / 2 - 0.25;
            offset2 = 0.5 + Math.random() / 2 - 0.25;
            offset3 = 0.5 + Math.random() / 2 - 0.25;
            offset4 = 0.5 + Math.random() / 2 - 0.25;
            offset5 = 0.5 + Math.random() / 2 - 0.25;
            console.log(spinDuration+' '+offset1+' '+offset2+' '+offset3+' '+offset4+' '+offset5)
        }
    }
    else {
        ctx.fillStyle = 'maroon'; 
        ctx.fillRect(240,337.5,120,40)
        if ((credits < cost && spinning == false) || lit <= 0 || (spinning == true && mode == 'auto')) {ctx.fillStyle = 'crimson';}
        else if (lit > 0) {
            if (spinning == false) {lit -= 0.02}
            var gradient = ctx.createRadialGradient(300,347.5,5,300,347.5,30)
            gradient.addColorStop(0,'yellow')
            gradient.addColorStop(0.5,'orange')
            gradient.addColorStop(1,'red')
            ctx.fillStyle = gradient
            if (lit <= 0 && spinning == false) {setTimeout(() => {lit = 1},1000)}
        }
        ctx.fillRect(240,327.5,120,40)
    }

    ctx.fillStyle = 'black'; ctx.font = '13px consolas'; ctx.fillText('Press [Q] to quit',10,totH-10)
    ctx.fillText('[C]insert coins',10,totH-25)

    //inserting coins
    if (keys && keys['c'] && cPressed == false && spinning == false && points >= cost) {
        cPressed = true
        showingHud = 2; console.log('inserted 5 coins')
        setTimeout(()=>{points -= 5; credits += 5; cPressed = false},1000)
    }
    
    if (actuallySpinning == true) {
        //console.log('s1:'+speeds[0]+'|s2:'+speeds[1]+'|s3:'+speeds[2]+'|s4:'+speeds[3]+'|s5:'+speeds[4]+'|s6:'+speeds[5])
        if (spinTime < 1) {speeds[0] += 0.2}
        spinTime += 0.02; //console.log(Math.floor(spinTime));
        if (spinTime > offset1 && spinTime < offset1 + 1) {speeds[1] += 0.2}
        if (spinTime > offset1 + offset2 && spinTime < offset1 + offset2 + 1) {speeds[2] += 0.2}
        if (spinTime > offset1 + offset2 + offset3 && spinTime < offset1 + offset2 + offset3 + 1) {speeds[3] += 0.2}
        if (spinTime > offset1 + offset2 + offset3 + offset4 && spinTime < offset1 + offset2 + offset3 + offset4 + 1) {speeds[4] += 0.2}
        if (spinTime > offset1 + offset2 + offset3 + offset4 + offset5 && spinTime < offset1 + offset2 + offset3 + offset4 + offset5 + 1) {speeds[5] += 0.2}
        console.log(lit+'<lit  1>'+light1+' 2>'+light2+' 3>'+light3+' 4>'+light4+' 5>'+light5)
        
        if (mode == 'manual' && speeds[0] > 9.99 && keys && keys[' ']) {slowing1 = true; lit = 0}
        else if (mode == 'manual' && speeds[1] > 9.99 && speeds[0] < 0.01 && keys && keys[' ']) {slowing2 = true; lit = 0}
        else if (mode == 'manual' && speeds[2] > 9.99 && speeds[1] < 0.01 && keys && keys[' ']) {slowing3 = true; lit = 0}
        else if (mode == 'manual' && speeds[3] > 9.99 && speeds[2] < 0.01 && keys && keys[' ']) {slowing4 = true; lit = 0}
        else if (mode == 'manual' && speeds[4] > 9.99 && speeds[3] < 0.01 && keys && keys[' ']) {slowing5 = true; lit = 0}
        else if (mode == 'manual' && speeds[5] > 9.99 && speeds[4] < 0.01 && keys && keys[' ']) {slowing6 = true; lit = 0}

        if ((spinTime > spinDuration && spinTime < spinDuration + 1 && mode == 'auto') || (mode == 'manual' && slowing1 == true && speeds[0] > 0.02)) {speeds[0] -= 0.2}
        else if ((spinTime > spinDuration + 1 && mode == 'auto') || (mode == 'manual' && speeds[0] < 0.02 && spinTime > 3)) {
            slowing1 = false; if (light1 == true) {lit = 1; light1 = false}
            if (rolls[0][0].some(element => element.yPos > 34.9 && element.yPos < 35.1)) {console.log('kinda aligned1')}
            else {
                var reward = rolls[0][0].find(element => element.yPos > 195 && element.yPos < 235);
                console.log(reward); var move; 
                if (reward.yPos > 215) {
                    move = 235 - reward.yPos;
                    rolls[0][0].forEach(symbol => {
                        symbol.yPos += move
                        if (symbol.yPos > 435) {
                            var overflow = symbol.yPos - 435;
                            symbol.yPos = -5 + overflow;
                        }
                    })
                }
                else if (reward.yPos < 215) {
                    move = reward.yPos - 195;
                    rolls[0][0].forEach(symbol => {
                        symbol.yPos -= move
                        if (symbol.yPos < -5) {
                            var overflow = -5 - symbol.yPos;
                            symbol.yPos = 435 - overflow;
                        }
                    })
                }
            }
        }
        if ((spinTime > spinDuration + offset3 && spinTime < spinDuration + offset3 + 1 && mode == 'auto') || (mode == 'manual' && slowing2 == true && speeds[1] > 0.02)) {speeds[1] -= 0.2}
        else if ((spinTime > spinDuration + offset3 + 1 && mode == 'auto') || (mode == 'manual' && speeds[1] < 0.02 && spinTime > 3)) {
            slowing2 = false; if (light2 == true) {lit = 1; light2 = false}
            if (rolls[1][0].some(element => element.yPos > 34.9 && element.yPos < 35.1)) {console.log('kinda aligned2')}
            else {
                var reward = rolls[1][0].find(element => element.yPos > 195 && element.yPos < 235);
                console.log(reward); var move; 
                if (reward.yPos > 215) {
                    move = 235 - reward.yPos;
                    rolls[1][0].forEach(symbol => {
                        symbol.yPos += move
                        if (symbol.yPos > 435) {
                            var overflow = symbol.yPos - 435;
                            symbol.yPos = -5 + overflow;
                        }
                    })
                }
                else if (reward.yPos < 215) {
                    move = reward.yPos - 195;
                    rolls[1][0].forEach(symbol => {
                        symbol.yPos -= move
                        if (symbol.yPos < -5) {
                            var overflow = -5 - symbol.yPos;
                            symbol.yPos = 435 - overflow;
                        }
                    })
                }
            }
        }
        if ((spinTime > spinDuration + offset3 + offset5 && spinTime < spinDuration + offset3 + offset5 + 1 && mode == 'auto') || (mode == 'manual' && slowing3 == true && speeds[2] > 0.02)) {speeds[2] -= 0.2}
        else if ((spinTime > spinDuration + offset3 + offset5 + 1 && mode == 'auto') || (mode == 'manual' && speeds[2] < 0.02 && spinTime > 3)) {
            slowing3 = false; if (light3 == true) {lit = 1; light3 = false}
            if (rolls[2][0].some(element => element.yPos > 34.9 && element.yPos < 35.1)) {console.log('kinda aligned3')}
            else {
                var reward = rolls[2][0].find(element => element.yPos > 195 && element.yPos < 235);
                console.log(reward); var move; 
                if (reward.yPos > 215) {
                    move = 235 - reward.yPos;
                    rolls[2][0].forEach(symbol => {
                        symbol.yPos += move
                        if (symbol.yPos > 435) {
                            var overflow = symbol.yPos - 435;
                            symbol.yPos = -5 + overflow;
                        }
                    })
                }
                else if (reward.yPos < 215) {
                    move = reward.yPos - 195;
                    rolls[2][0].forEach(symbol => {
                        symbol.yPos -= move
                        if (symbol.yPos < -5) {
                            var overflow = -5 - symbol.yPos;
                            symbol.yPos = 435 - overflow;
                        }
                    })
                }
            }
        }
        if ((spinTime > spinDuration + offset3 + offset5 + offset2 && spinTime < spinDuration + offset3 + offset5 + offset2 + 1 && mode == 'auto') || (mode == 'manual' && slowing4 == true && speeds[3] > 0.02)) {speeds[3] -= 0.2}
        else if ((spinTime > spinDuration + offset3 + offset5 + offset2 + 1 && mode == 'auto') || (mode == 'manual' && speeds[3] < 0.02 && spinTime > 3)) {
            slowing4 = false; if (light4 == true) {lit = 1; light4 = false}
            if (rolls[3][0].some(element => element.yPos > 34.9 && element.yPos < 35.1)) {console.log('kinda aligned4')}
            else {
                var reward = rolls[3][0].find(element => element.yPos > 195 && element.yPos < 235);
                console.log(reward); var move; 
                if (reward.yPos > 215) {
                    move = 235 - reward.yPos;
                    rolls[3][0].forEach(symbol => {
                        symbol.yPos += move
                        if (symbol.yPos > 435) {
                            var overflow = symbol.yPos - 435;
                            symbol.yPos = -5 + overflow;
                        }
                    })
                }
                else if (reward.yPos < 215) {
                    move = reward.yPos - 195;
                    rolls[3][0].forEach(symbol => {
                        symbol.yPos -= move
                        if (symbol.yPos < -5) {
                            var overflow = -5 - symbol.yPos;
                            symbol.yPos = 435 - overflow;
                        }
                    })
                }
            }
        }
        if ((spinTime > spinDuration + offset3 + offset5 + offset2 + offset1 && spinTime < spinDuration + offset3 + offset5 + offset2 + offset1 + 1 && mode == 'auto') || (mode == 'manual' && slowing5 == true && speeds[4] > 0.02)) {speeds[4] -= 0.2}
        else if ((spinTime > spinDuration + offset3 + offset5 + offset2 + offset1 + 1 && mode == 'auto') || (mode == 'manual' && speeds[4] < 0.02 && spinTime > 3)) {
            slowing5 = false; if (light5 == true) {lit = 1; light5 = false}
            if (rolls[4][0].some(element => element.yPos > 34.9 && element.yPos < 35.1)) {console.log('kinda aligned5')}
            else {
                var reward = rolls[4][0].find(element => element.yPos > 195 && element.yPos < 235);
                console.log(reward); var move; 
                if (reward.yPos > 215) {
                    move = 235 - reward.yPos;
                    rolls[4][0].forEach(symbol => {
                        symbol.yPos += move
                        if (symbol.yPos > 435) {
                            var overflow = symbol.yPos - 435;
                            symbol.yPos = -5 + overflow;
                        }
                    })
                }
                else if (reward.yPos < 215) {
                    move = reward.yPos - 195;
                    rolls[4][0].forEach(symbol => {
                        symbol.yPos -= move
                        if (symbol.yPos < -5) {
                            var overflow = -5 - symbol.yPos;
                            symbol.yPos = 435 - overflow;
                        }
                    })
                }
            }
        }
        if ((spinTime > spinDuration + offset3 + offset5 + offset2 + offset1 + offset4 && spinTime < spinDuration + offset3 + offset5 + offset2 + offset1 + offset4 + 1 && mode == 'auto') || (mode == 'manual' && slowing6 == true && speeds[5] > 0.02)) {speeds[5] -= 0.2}
        else if ((spinTime > spinDuration + offset3 + offset5 + offset2 + offset1 + offset4 + 1 && mode == 'auto') || (mode == 'manual' && speeds[5] < 0.02 && spinTime > 2)) {
            slowing6 = false
            if (rolls[5][0].some(element => element.yPos > 34.9 && element.yPos < 35.1)) {console.log('kinda aligned6')}
            else {
                var reward = rolls[5][0].find(element => element.yPos > 195 && element.yPos < 235);
                console.log(reward); var move; 
                if (reward.yPos > 215) {
                    move = 235 - reward.yPos;
                    rolls[5][0].forEach(symbol => {
                        symbol.yPos += move
                        if (symbol.yPos > 435) {
                            var overflow = symbol.yPos - 435;
                            symbol.yPos = -5 + overflow;
                        }
                    })
                }
                else if (reward.yPos < 215) {
                    move = reward.yPos - 195;
                    rolls[5][0].forEach(symbol => {
                        symbol.yPos -= move
                        if (symbol.yPos < -5) {
                            var overflow = -5 - symbol.yPos;
                            symbol.yPos = 435 - overflow;
                        }
                    })
                }
            }
        }
                
        if (mode == 'manual' && spinTime < offset1 + offset2 + offset3 + offset4 + offset5 + 1) {lit = 0}
        else if (mode == 'manual' && speeds[0] > 9.99) {lit = 1}

        if ((spinTime < spinDuration + offset3 + offset5 + offset2 + offset1 + offset4 + 1 && mode == 'auto') || speeds[5] > 0 || slowing6 == true || spinTime < offset1 + offset2 + offset3 + offset4 + offset5 + 1) {
            rolls.forEach((roller, index) => {
                roller[0].forEach(symbol => {
                    symbol.yPos += speeds[index]
                    if (symbol.yPos > 435) {
                        var overflow = symbol.yPos - 435;
                        symbol.yPos = -5 + overflow;
                    }
                })
            })
        }
        else {
            console.log(rolls); var currSymbols = [];
            actuallySpinning = false; spinTime = 0;
            rolls.forEach(rolly => {
                var reward = rolly[0].find(symbol => symbol.yPos > 194.9 && symbol.yPos < 195.1)
                currSymbols.push(reward.icon)
            })
            console.log(currSymbols) 
            var rewards1 = [], rewards2 = [], rewards3 = [];
            currSymbols.forEach((symbol,index) => {
                if (index == 0) {rewards1.push(symbol)}
                else {
                    if (symbol == rewards1[0]) {rewards1.push(symbol)} //if same as adjacent symbol, add to array
                    else { //if not same as adjacent symbol
                        if (rewards1.length < 2) {rewards1.splice(0,1,symbol)} //if there is no previous match in array1, replace
                        else {//if there is a previous match
                            if (rewards2.length < 1 || symbol == rewards2[0]) { //if there is no previous match in array2, or the adjacent symbol is the same, add to array2
                                rewards2.push(symbol)
                            }
                            else {//if adjacent symbol is not a match
                                if (rewards2.length < 2) {//if there is no previous match, replace
                                    rewards2.splice(0,1,symbol)
                                }
                                else {//if there is a previous match
                                    if (rewards3.length < 1 || symbol == rewards2[0]) {rewards3.push(symbol)}//if there is no previous match in array3, or the adjacent symbol is the same, add to array3
                                    else {rewards3.splice(0,1,symbol)}//if no match
                                }
                            } 
                        }
                    }
                }
                console.log(rewards1)
                console.log(rewards2)
                console.log(rewards3)
                console.log('-------------------------------')
            })//'oneCoin','twoCoins','threeCoins','moneyBag','moneyChest','grenade','twoGrenades','oneHeart','twoHearts','armor'
            if (rewards1.length < 2) {setTimeout(() => {
                spinning = false; light1 = true; light2 = true; light3 = true; light4 = true; light5 = true; lit = 1;
            },1000)}
            else {
                showingHud = 4; console.log('you got '+rewards1.length+' '+rewards1[0]+'!')
                
                if (rewards1[0] == 'oneCoin') {addedCoins += 5 * rewards1.length - 5}
                else if (rewards1[0] == 'twoCoins') {addedCoins += 10 * rewards1.length - 10}
                else if (rewards1[0] == 'threeCoins') {addedCoins += 15 * rewards1.length - 15}
                else if (rewards1[0] == 'moneyBag') {addedCoins += 20 * rewards1.length - 20}
                else if (rewards1[0] == 'moneyChest') {addedCoins += 30 * rewards1.length - 30}
                else if (rewards1[0] == 'grenade') {addedGrenades += 1 * rewards1.length - 1}
                else if (rewards1[0] == 'twoGrenades') {addedGrenades += 2 * rewards1.length - 2}
                else if (rewards1[0] == 'oneHeart') {addedHealth += 15 * rewards1.length - 15}
                else if (rewards1[0] == 'twoHearts') {addedHealth += 30 * rewards1.length - 30}
                else if (rewards1[0] == 'armor') {addedArmor += 10 * rewards1.length - 10}

                if (rewards2.length >= 2) {
                    console.log('you also got '+rewards2.length+' '+rewards2[0]+'!')
                    if (rewards2[0] == 'oneCoin') {addedCoins += 5 * rewards2.length - 5}
                    else if (rewards2[0] == 'twoCoins') {addedCoins += 10 * rewards2.length - 10}
                    else if (rewards2[0] == 'threeCoins') {addedCoins += 15 * rewards2.length - 15}
                    else if (rewards2[0] == 'moneyBag') {addedCoins += 20 * rewards2.length - 20}
                    else if (rewards2[0] == 'moneyChest') {addedCoins += 30 * rewards2.length - 30}
                    else if (rewards2[0] == 'grenade') {addedGrenades += 1 * rewards2.length - 1}
                    else if (rewards2[0] == 'twoGrenades') {addedGrenades += 2 * rewards2.length - 2}
                    else if (rewards2[0] == 'oneHeart') {addedHealth += 15 * rewards2.length - 15}
                    else if (rewards2[0] == 'twoHearts') {addedHealth += 30 * rewards2.length - 30}
                    else if (rewards2[0] == 'armor') {addedArmor += 10 * rewards2.length - 10}
                }
                
                if (rewards3.length >= 2) {
                    console.log('you also got '+rewards3.length+' '+rewards3[0]+'!')
                    if (rewards3[0] == 'oneCoin') {addedCoins += 5 * rewards3.length - 5}
                    else if (rewards3[0] == 'twoCoins') {addedCoins += 10 * rewards3.length - 10}
                    else if (rewards3[0] == 'threeCoins') {addedCoins += 15 * rewards3.length - 15}
                    else if (rewards3[0] == 'moneyBag') {addedCoins += 20 * rewards3.length - 20}
                    else if (rewards3[0] == 'moneyChest') {addedCoins += 30 * rewards3.length - 30}
                    else if (rewards3[0] == 'grenade') {addedGrenades += 1 * rewards3.length - 1}
                    else if (rewards3[0] == 'twoGrenades') {addedGrenades += 2 * rewards3.length - 2}
                    else if (rewards3[0] == 'oneHeart') {addedHealth += 15 * rewards3.length - 15}
                    else if (rewards3[0] == 'twoHearts') {addedHealth += 30 * rewards3.length - 30}
                    else if (rewards3[0] == 'armor') {addedArmor += 10 * rewards3.length - 10}
                }

                setTimeout(() => {
                    points += addedCoins; grenades += addedGrenades; health += addedHealth; armor += addedArmor;
                    console.log('added '+addedCoins+' coins'); console.log('added '+addedGrenades+' grenades');
                    console.log('added '+addedHealth+' health'); console.log('added '+addedArmor+' armor');
                    addedCoins = 0; addedGrenades = 0; addedHealth = 0; addedArmor = 0;
                },2000)
                setTimeout(() => {spinning = false; light1 = true; light2 = true; light3 = true; light4 = true; light5 = true; lit = 1},4000)
            }
        }
    }


    if (showingHud > 0) {
        showingHud -= 0.02
        //console.log(showingHud)
        var healthPercentage = health / maxHealth;
        var armorPercentage = armor / maxArmor;
        ctx.fillStyle = 'white'
        ctx.fillRect(15,15,170,15)
        ctx.fillStyle = 'red';
        if (health <= maxHealth) {
            ctx.fillRect(45,20,140*healthPercentage,10)
        }
        else if (health > maxHealth) {
            ctx.fillRect(45,20,140,10)
            var overflowHealthPercentage = (health - maxHealth) / maxHealth
            ctx.fillStyle = 'maroon'; 
            ctx.fillRect(45,20,140*overflowHealthPercentage,10)
        }
        ctx.fillStyle = 'blue';
        if (armor <= maxArmor) {
            ctx.fillRect(45,15,140*armorPercentage,5)
        }
        else if (armor > maxArmor) {
            ctx.fillRect(45,15,140,5)
            var overflowArmorPercentage = (armor - maxArmor) / maxArmor
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(45,15,140*overflowArmorPercentage,5)
        }
        ctx.lineWidth = 2; ctx.strokeStyle = 'black'; ctx.strokeRect(15,15,170,15)
        ctx.font = '15px consolas'; ctx.fillStyle = 'black'; ctx.fillText(Math.round(health),17,28)
        //points counter
        ctx.fillText(points,17,45); ctx.fillStyle = 'gold'; 
        if (points.toString().length == 2) {ctx.fillRect(35,35,10,10);}
        else if (points.toString().length == 3) {ctx.fillRect(45,35,10,10)}
        else if (points.toString().length == 4) {ctx.fillRect(55,35,10,10)}
        //grenade counter
        ctx.fillStyle = 'black'
        ctx.fillText(grenades,17,60); ctx.fillStyle = 'darkslategray'; ctx.fillRect(27,50,10,10)

        if (spinning == true && (addedCoins > 0 || addedGrenades > 0 || addedHealth > 0 || addedArmor > 0)) {
            ctx.fillStyle = 'black'; 
            ctx.fillText('+'+addedArmor+'A +'+addedHealth+'H',190,28)
            ctx.fillText('+'+addedCoins,60,45); 
            ctx.fillText('+'+addedGrenades,40,60);
        }
    }


    if (keys && keys['q']) {
        clearInterval(levelInterval); gameState = states.level; console.log('exiting slot-man');
        for (var s = 0; s < 6; s++) {speeds[s] = 0; rolls[s][0] = []}; spinTime = 0; spinning = false; actuallySpinning = false;
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

    ctx.beginPath(); ctx.strokeStyle = 'white';
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