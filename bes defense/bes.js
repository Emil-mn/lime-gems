var canvas = document.getElementById("canvos")
var ctx = canvas.getContext("2d")
var mainGun,auxGun1,auxGun2,auxRckt1,auxRckt2
var enemies = [];
var projectiles = [];
var fireInterval, shotsFired = 0, canFire = true
var keyPress
var stopit = false
var day = 0;
var maxHealth = 50, currentHealth, nextHealth = 75, healthPrice = 42
var maxShield = 25, currentShield, nextShield = 50, shieldPrice = 42
var money = 1000, newMoney = 0, totalMoney = 0
var kills = 0, carKills = 0, tonkKills = 0, droneKills = 0
var totW = canvas.width;
var totH = canvas.height;
var bgColor
var dayInterval,spawnerInterval
var clickX,clickY,musx,musy
var dayActive = false,gameActive = false
var upgradePrim = 1, upgradeSec = 1, upgradeTert = 1
var healthPercentage, shieldPercentage
var shieldTimeout, shieldJustHit = false
var activeWeapon = 1
var aCool1 = 0, aCool2 = 0, aCool3 = 0, aCool4 = 0
var airStrikeCooldownPercentage
var EMPCooldownPercentage
var minefieldCooldownPercentage
var laserCooldownPercentage 
var aDuration2 = 0, aDuration4 = 0

var mgLvl1 = { level:1, price:42, nextLevel:2, damageMin:2, damageMax:5, accuracy:4, critChance:2, critDmg:1.5, fireRate:300, image:'mg.png'}
var mgLvl2 = { level:2, price:42, nextLevel:3, damageMin:4, damageMax:8, accuracy:6, critChance:5, critDmg:1.7, fireRate:250, image:'mg.png'}
var mgLvl3 = { level:3, price:42, nextLevel:4, damageMin:7, damageMax:12, accuracy:8, critChance:8, critDmg:2, fireRate:150, image:'mgdouble.png'}
var mgLvl4 = { level:4, price:42, nextLevel:5, damageMin:10, damageMax:16, accuracy:10, critChance:11, critDmg:2.5, fireRate:100, image:'mgdouble.png'}
var mgLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:14, damageMax:22, accuracy:13, critChance:25, critDmg:3, fireRate:50, image:'mgmini.png'}

var sgLvl0 = { level:0, price:42, nextLevel:1, damageMin:0, damageMax:0, spread:0, critChance:0, critDmg:0, fireRate:0}
var sgLvl1 = { level:1, price:42, nextLevel:2, damageMin:1, damageMax:3, spread:13, critChance:2, critDmg:1.5, fireRate:1000, image:'sg.png'}
var sgLvl2 = { level:2, price:42, nextLevel:3, damageMin:3, damageMax:5, spread:11, critChance:5, critDmg:1.7, fireRate:800, image:'sg.png'}
var sgLvl3 = { level:3, price:42, nextLevel:4, damageMin:5, damageMax:7, spread:8, critChance:8, critDmg:2, fireRate:600, image:'sg2.png'}
var sgLvl4 = { level:4, price:42, nextLevel:5, damageMin:7, damageMax:9, spread:6, critChance:11, critDmg:2.5, fireRate:400, image:'sg2.png'}
var sgLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:10, damageMax:15, spread:3, critChance:25, critDmg:3, fireRate:200, image:'sg3.png'}

var cnLvl0 = { level:0, price:42, nextLevel:1, damageMin:0, damageMax:0, accuracy:0, penetrationDmg:0, penetrationCount:0, fireRate:0}
var cnLvl1 = { level:1, price:42, nextLevel:2, damageMin:8, damageMax:12, accuracy:4, penetrationDmg:0.2, penetrationCount:1, fireRate:999, image:'cnn.png'}
var cnLvl2 = { level:2, price:42, nextLevel:3, damageMin:10, damageMax:15, accuracy:3.5, penetrationDmg:0.4, penetrationCount:2, fireRate:800, image:'cnn.png'}
var cnLvl3 = { level:3, price:42, nextLevel:4, damageMin:13, damageMax:18, accuracy:3, penetrationDmg:0.6, penetrationCount:3, fireRate:700, image:'cnndouble.png'}
var cnLvl4 = { level:4, price:42, nextLevel:5, damageMin:16, damageMax:20, accuracy:2.5, penetrationDmg:0.8, penetrationCount:4, fireRate:600, image:'cnndouble.png'}
var cnLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:22, damageMax:27, accuracy:1, penetrationDmg:1, penetrationCount:5, fireRate:500, image:'cnntriple.png'}

var rktLvl0 = { level:0, price:42, nextLevel:1, damageMin:0, damageMax:0, accuracy:0, rocketSpeed:0, rocketCount:0, fireRate:0}
var rktLvl1 = { level:1, price:42, nextLevel:2, damageMin:8, damageMax:10, accuracy:6, rocketSpeed:5, rocketCount:1, fireRate:999, image:'rock.png'}
var rktLvl2 = { level:2, price:42, nextLevel:3, damageMin:10, damageMax:12, accuracy:6, rocketSpeed:7, rocketCount:1, fireRate:800, image:'rock.png'}
var rktLvl3 = { level:3, price:42, nextLevel:4, damageMin:13, damageMax:16, accuracy:4, rocketSpeed:10, rocketCount:2, fireRate:600, image:'rock2.png'}
var rktLvl4 = { level:4, price:42, nextLevel:5, damageMin:15, damageMax:18, accuracy:4, rocketSpeed:12, rocketCount:2, fireRate:400, image:'rock2.png'}
var rktLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:18, damageMax:21, accuracy:2, rocketSpeed:18, rocketCount:4, fireRate:100, image:'rock3.png'}

var canLeftLvl0 = { level:0, price:42, nextLevel:1, damageMin:0, damageMax:0, accuracy:0, fireRate:0}
var canLeftLvl1 = { level:1, price:42, nextLevel:2, damageMin:8, damageMax:12, accuracy:4, fireRate:999, image:'cnn.png'}
var canLeftLvl2 = { level:2, price:42, nextLevel:3, damageMin:10, damageMax:15, accuracy:3.5, fireRate:800, image:'cnn.png'}
var canLeftLvl3 = { level:3, price:42, nextLevel:4, damageMin:13, damageMax:18, accuracy:3, fireRate:700, image:'cnndouble.png'}
var canLeftLvl4 = { level:4, price:42, nextLevel:5, damageMin:16, damageMax:20, accuracy:2.5, fireRate:600, image:'cnndouble.png'}
var canLeftLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:22, damageMax:27, accuracy:1, fireRate:500, image:'cnntriple.png'}

var canRightLvl0 = { level:0, price:42, nextLevel:1, damageMin:0, damageMax:0, accuracy:0, fireRate:0}
var canRightLvl1 = { level:1, price:42, nextLevel:2, damageMin:8, damageMax:12, accuracy:4, fireRate:999, image:'cnn.png'}
var canRightLvl2 = { level:2, price:42, nextLevel:3, damageMin:10, damageMax:15, accuracy:3.5, fireRate:800, image:'cnn.png'}
var canRightLvl3 = { level:3, price:42, nextLevel:4, damageMin:13, damageMax:18, accuracy:3, fireRate:700, image:'cnndouble.png'}
var canRightLvl4 = { level:4, price:42, nextLevel:5, damageMin:16, damageMax:20, accuracy:2.5, fireRate:600, image:'cnndouble.png'}
var canRightLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:22, damageMax:27, accuracy:1, fireRate:500, image:'cnntriple.png'}

var rockLeftLvl0 = { level:0, price:42, nextLevel:1, damageMin:0, damageMax:0, accuracy:0, fireRate:0}
var rockLeftLvl1 = { level:1, price:42, nextLevel:2, damageMin:8, damageMax:10, accuracy:6, fireRate:999, image:'rock.png'}
var rockLeftLvl2 = { level:2, price:42, nextLevel:3, damageMin:10, damageMax:12, accuracy:6, fireRate:800, image:'rock.png'}
var rockLeftLvl3 = { level:3, price:42, nextLevel:4, damageMin:13, damageMax:16, accuracy:4, fireRate:600, image:'rock2.png'}
var rockLeftLvl4 = { level:4, price:42, nextLevel:5, damageMin:15, damageMax:18, accuracy:4, fireRate:400, image:'rock2.png'}
var rockLeftLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:18, damageMax:21, accuracy:2, fireRate:100, image:'rock3.png'}

var rockRightLvl0 = { level:0, price:42, nextLevel:1, damageMin:0, damageMax:0, accuracy:0, fireRate:0}
var rockRightLvl1 = { level:1, price:42, nextLevel:2, damageMin:8, damageMax:10, accuracy:6, fireRate:999, image:'rock.png'}
var rockRightLvl2 = { level:2, price:42, nextLevel:3, damageMin:10, damageMax:12, accuracy:6, fireRate:800, image:'rock.png'}
var rockRightLvl3 = { level:3, price:42, nextLevel:4, damageMin:13, damageMax:16, accuracy:4, fireRate:600, image:'rock2.png'}
var rockRightLvl4 = { level:4, price:42, nextLevel:5, damageMin:15, damageMax:18, accuracy:4, fireRate:400, image:'rock2.png'}
var rockRightLvl5 = { level:5, price:0, nextLevel:'Max', damageMin:18, damageMax:21, accuracy:2, fireRate:100, image:'rock3.png'}

var abltAStrikeLvl1 = { coolDown:30}
var abltEmpLvl1 = { coolDown:30, duration:10}
var abltMinefieldLvl1 = { coolDown:30}
var abltLaserLvl1 = { coolDown:30, duration:15}

var mg = mgLvl1
var mgNext = mgLvl2
var cannon = cnLvl0
var cannonNext = cnLvl1
var shotgun = sgLvl0
var shotgunNext = sgLvl1
var rcktLnchr = rktLvl0
var rcktLnchrNext = rktLvl1

var secCanL = canLeftLvl0
var secCanLNext = canLeftLvl1
var secCanR = canRightLvl0
var seCanRNext = canRightLvl1
var secRockL = rockLeftLvl0
var secRockLNext = rockLeftLvl1
var secRockR = rockRightLvl0
var secRockRNext = rockRightLvl1

var airStrike = abltAStrikeLvl1
var emp = abltEmpLvl1
var mineField = abltMinefieldLvl1
var laser = abltLaserLvl1

window.onload = startGem()

function startGem() 
{     
    
    ctx.fillStyle = 'lightslategrey'; ctx.fillRect(0,0,totW,totH);
    
    ctx.fillStyle = 'black' ; ctx.font = '50px Arial'; ctx.fillText('Beige Defense',200,100);
    ctx.font = '30px Arial'; ctx.fillText('The ultimate game!!!!111!',190,200)

    ctx.strokeStyle = 'black'; ctx.lineWidth = 4
    ctx.strokeRect(totW/2-50,300,100,50)
    ctx.fillStyle = 'green'; ctx.font = '40px Arial'
    ctx.fillText('Play',totW/2-40,335)

    canvas.addEventListener('mousedown', function (e) {
        var rect = canvas.getBoundingClientRect();
        clickX = e.pageX - rect.left;
        clickY = e.pageY - rect.top; console.log('click detected at '+ clickX + ' ' + clickY); checkButt();
    })
    
    canvas.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        musx = evt.pageX - rect.left; 
        musy = evt.pageY - rect.top;
        if (dayActive == false)
        {
            buttHoverCheck()
        }
    },false);

    window.addEventListener('mouseup', function (e) {
        clearInterval(fireInterval);
    });

    document.addEventListener('keydown', function(e) {
        if (!stopit)
        {stopit = true; keyPress = e.key; console.log(keyPress); checkKey()}
    })
    document.addEventListener('keyup', function() {
        keyPress = null; stopit = false
    })
}

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


function enemy(x,y,width,height,image,type) {
    this.x = x
    this.y = y
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = image;
    this.type = type
    this.shootCool = NaN
    this.health = NaN
    this.money = NaN
    if (type == 'dron') {this.shootCool = 1; this.health = 15; this.money = 20}

  

    this.render = function() {
        ctx.drawImage(this.image,this.x,this.y)
       //ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}





function gun(x,y,width,height,image,type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = image;
    this.type = type
    this.angle = 0;
    this.centerX = this.x + this.width/2;
    this.centerY = this.y + this.height/2;
    this.targetX
    this.targetY
    this.shootCool = 0
    
    this.distances = []
    
    this.findDistance = function() {
        enemies.forEach(anemi => {
            var distX = anemi.x - this.x
            var distY = anemi.y - this.y
            var dist = Math.hypot(distX,distY)
            var loc = {dist:dist, x:anemi.x, y:anemi.y}
            this.distances.push(loc)
        })
        this.distances.sort((a,b) => a.dist - b.dist)
        var dada = this.distances.shift()
        this.distances.splice(0,length)
        this.targetX = dada.x
        this.targetY = dada.y
    }
    
    this.angleToEnemy = function(enemyX,enemyY) {
        this.angle = Math.atan2(enemyY-this.centerY,enemyX-this.centerX) ?? 0
        this.dx = this.centerX+(Math.cos(this.angle)*60)
        this.dy = this.centerY+(Math.cos(this.angle)*50)
        ctx.save()
        ctx.translate(this.centerX,this.centerY)
        ctx.rotate(this.angle)
        ctx.drawImage(this.image,this.width/-2,this.height/-2,this.width,this.height)
        ctx.setTransform(1,0,0,1,0,0)
        ctx.restore()
    }
    
    this.update = function() {
        this.angle = Math.atan2(musy - (this.centerY) , musx - (this.centerX))
        this.dx = this.centerX+(Math.cos(this.angle)*60)
        this.dy = this.centerY+(Math.sin(this.angle)*50)
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
        //console.log('angle: '+Math.floor(this.angle)+' dx: '+Math.floor(this.dx)+' dy: '+Math.floor(this.dy))
    }
    
}


function mgProjectile(width, height, color, x, y, targetX, targetY, type) { 
    this.type = type 
    this.width = width;
    this.height = height;
    ctx.fillStyle = color;
    this.x = x;
    this.y = y;
    var crit = false
    this.targetX = targetX;
    this.targetY = targetY;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * mg.accuracy) - mg.accuracy) * Math.PI / 180;
    this.dx = Math.cos(this.angle)
    this.dy = Math.sin(this.angle)
    
    this.damage = Math.floor((Math.random() * (mg.damageMax - mg.damageMin + 1)) + mg.damageMin)
    
    var rand = Math.random() * 100

    if (rand < mg.critChance) { crit = true}

    console.log('damage: '+this.damage+' rand: '+rand+' crit: '+crit)

    if(crit == true) { this.damage*=mg.critDmg; console.log('crit damage: '+this.damage)}
    
    this.update = function()
    {
      if (crit == true) {ctx.fillStyle = 'red'}
      else {ctx.fillStyle = color}
      this.x += this.dx * 10
      this.y += this.dy * 10
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    this.newPos = function()
    {
      if (this.x > totW || this.x < totW-totW || this.y > totH || this.y < totH-totH)
      { return true }
      return false  
    }
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + otherobj.width;
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + otherobj.height;
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
      {
        crash = false;
      }
      return crash;
    }
}

function sgProjectile(width, height, color, x, y, targetX, targetY) {
    this.width = width
    this.height = height;
    ctx.fillStyle = color;
    this.x = x;
    this.y = y;
    var crit = false
    this.targetX = targetX;
    this.targetY = targetY;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * shotgun.spread) - shotgun.spread) * Math.PI / 180;
    this.dx = Math.cos(this.angle)
    this.dy = Math.sin(this.angle)
    
    this.damage = Math.floor((Math.random() * (shotgun.damageMax - shotgun.damageMin + 1)) + shotgun.damageMin)
    
    var rand = Math.random() * 100

    if (rand < shotgun.critChance) { crit = true}

    console.log('damage: '+this.damage+' rand: '+rand+' crit: '+crit)
    
    if(crit == true) { this.damage*=shotgun.critDmg; console.log('crit damage: '+this.damage)}
    
    this.update = function()
    {
      if (crit == true) {ctx.fillStyle = 'red'}
      else {ctx.fillStyle = color}
      this.x += this.dx * 10;
      this.y += this.dy * 10;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function()
    {
      if (this.x > totW || this.x < totW-totW || this.y > totH || this.y < totH-totH)
      { return true }
      return false  
    }
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + otherobj.width;
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + otherobj.height;
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
      {
        crash = false;
      }
      return crash;
    }
}

function cnnProjectile(width, height, color, x, y, targetX, targetY, type) {
    this.type = type
    this.width = width
    this.height = height;
    ctx.fillStyle = color;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * cannon.accuracy) - cannon.accuracy) * Math.PI / 180;
    this.dx = Math.cos(this.angle)
    this.dy = Math.sin(this.angle)
    
    this.damage = Math.floor((Math.random() * (cannon.damageMax - cannon.damageMin + 1)) + cannon.damageMin)
    
    console.log('damage: '+this.damage)
    
    this.update = function()
    {
      ctx.fillStyle = color;
      this.centerX += this.dx * 10;
      this.centerY += this.dy * 10;
      this.x = this.centerX - this.width/2
      this.y = this.centerY - this.height/2
 
      ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.angle);
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
    }
    this.newPos = function()
    {
      if (this.x > totW || this.x < totW-totW || this.y > totH || this.y < totH-totH)
      { return true }
      return false  
    }
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + otherobj.width;
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + otherobj.height;
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
      {
        crash = false;
      }
      return crash;
    }
}

function rktProjectile(width, height, color, x, y, targetX, targetY, type) {
    this.type = type
    this.width = width
    this.height = height;
    ctx.fillStyle = color;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) + (Math.random() * (2 * rcktLnchr.accuracy) - rcktLnchr.accuracy) * Math.PI / 180;
    this.dx = Math.cos(this.angle)
    this.dy = Math.sin(this.angle)
    
    this.damage = Math.floor((Math.random() * (rcktLnchr.damageMax - rcktLnchr.damageMin + 1)) + rcktLnchr.damageMin)
    
    console.log('damage: '+this.damage)
    
    this.update = function()
    {
      ctx.fillStyle = color;
      this.centerX += this.dx * 10;
      this.centerY += this.dy * 10;
      this.x = this.centerX - this.width/2
      this.y = this.centerY - this.height/2
 
      ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.angle);
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
      
    }
    this.newPos = function()
    {
      if (this.x > totW || this.x < totW-totW || this.y > totH || this.y < totH-totH)
      { return true }
      return false  
    }
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + otherobj.width;
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + otherobj.height;
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
      {
        crash = false;
      }
      return crash;
    }
}

function laserBeam(height, color, x, y, targetX, targetY) {
    
    this.height = height;
    ctx.fillStyle = color;
    this.x = x
    this.y = y
    this.targetX = targetX;
    this.targetY = targetY;
    // this.centerX = this.x + this.width / 2;
    // this.centerY = this.y + this.height / 2;
    this.angle = Math.atan2(targetY - this.y, targetX - this.x) 
    // this.dx = Math.cos(this.angle) 
    // this.dy = Math.sin(this.angle)
    this.xx = targetX-this.x
    this.yy = targetY-this.y
    this.width = 500//Math.hypot(this.xx,this.yy)
    console.log('angle: '+this.angle+' dx: '+this.dx+' dy: '+this.dy+' width: '+this.width)
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillRect(x-150, y-200, this.width, this.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();

    //this.damage = Math.floor((Math.random() * (rcktLnchr.damageMax - rcktLnchr.damageMin + 1)) + rcktLnchr.damageMin)
    
    //console.log('damage: '+this.damage)
    
    this.update = function()
    {
      
    //   this.centerX += this.dx * 10;
    //   this.centerY += this.dy * 10;
    //   this.x = this.centerX - this.width/2
    //   this.y = this.centerY - this.height/2
        
        
      
    }
    
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + otherobj.width;
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + otherobj.height;
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
      {
        crash = false;
      }
      return crash;
    }
}

function showUpgradeMenu()
{
    //background
    ctx.fillStyle = 'lightslategrey'; 
    ctx.fillRect(0,0,totW,totH);
    canvas.style.cursor = 'default' 
    
    //money counter
    ctx.beginPath()
    ctx.fillStyle = 'black' ; ctx.strokeStyle = 'black' 
    ctx.lineWidth = 5; 
    ctx.moveTo(totW-140,0); ctx.lineTo(totW-140,32.5); 
    ctx.moveTo(totW-140,30); ctx.lineTo(totW,30)
    ctx.font = '25px Arial'; ctx.fillText('money:'+money,totW-135,20);
    
    //day counter and play button
    ctx.moveTo(totW-180,totH-40); ctx.lineTo(totW,totH-40); 
    ctx.moveTo(totW-180,totH); ctx.lineTo(totW-180,totH-42.5)
    ctx.font = '30px Arial'; ctx.fillText('Day '+day,totW-170,totH-10); ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = 'green'; ctx.lineWidth = 3; ctx.strokeRect(totW-70,totH-33.5,60,30)
    ctx.stroke()
    ctx.font = '25px Arial'; ctx.fillText('Play',totW-65, totH-10)

    //primary weapons
    ctx.beginPath(); ctx.strokeStyle = 'black'; ctx.lineWidth = 5;
    ctx.strokeRect(20,20,350,180); ctx.font = '30px Arial';
    ctx.fillText('Primary weapons',25,50); ctx.moveTo(20,60); ctx.lineTo(370,60); 
    ctx.font = '16px Arial'; ctx.stroke()
    ctx.fillText('machine gun  shotgun  cannon  rocket launcher',25 ,78)
    ctx.beginPath(); ctx.lineWidth = 3; ctx.moveTo(121,60); ctx.lineTo(121,85); 
    ctx.moveTo(187,60); ctx.lineTo(187,85); 
    ctx.moveTo(248,60); ctx.lineTo(248,85); 
    ctx.moveTo(20,85); ctx.lineTo(370,85); ctx.stroke()
    

    //content for primary weapons
    
    if ( upgradePrim == 1) 
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(25,80); ctx.lineTo(117,80)
        ctx.stroke()
        
        ctx.fillText('level '+ mg.level,25,103)
        ctx.fillText('level '+ mg.nextLevel,155,103)
        
        ctx.fillText('damage: '+ mg.damageMin+'-'+mg.damageMax,25,130)
        ctx.fillText('fire rate: '+ mg.fireRate+' ms',25,145)
        ctx.fillText('accuracy: '+ mg.accuracy+' deg',25,160)
        ctx.fillText('critchance: '+ mg.critChance+'%',25,175)
        ctx.fillText('critdamage: '+ mg.critDmg+ 'x',25,190)

        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,85); ctx.lineTo(150,200);
        
        //next level stats
        ctx.fillText('damage: '+ mgNext.damageMin+'-'+mgNext.damageMax,155,130)
        ctx.fillText('fire rate: '+ mgNext.fireRate+' ms',155,145)
        ctx.fillText('accuracy: '+ mgNext.accuracy+' deg',155,160)
        ctx.fillText('critchnce: '+ mgNext.critChance+'%',155,175)
        ctx.fillText('critdmg: '+ mgNext.critDmg+ 'x',155,190) 
       
        //upgrade button
        ctx.moveTo(265,173); ctx.lineTo(370,173); 
        ctx.moveTo(265,171.5); ctx.lineTo(265,200)
        ctx.stroke()
        ctx.fillText('upgrade: '+mg.price,270,190)
    }
    
    else if ( upgradePrim == 2)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(125,80); ctx.lineTo(183,80)
        ctx.stroke()

        ctx.fillText('level '+ shotgun.level,25,103)
        ctx.fillText('level '+ shotgun.nextLevel,155,103)

        ctx.fillText('damage: '+ shotgun.damageMin+'-'+shotgun.damageMax,25,130)
        ctx.fillText('fire rate: '+ shotgun.fireRate+' ms',25,145)
        ctx.fillText('spread: '+ shotgun.spread+' deg',25,160)
        ctx.fillText('critchance: '+ shotgun.critChance+'%',25,175)
        ctx.fillText('critdamage: '+ shotgun.critDmg+ 'x',25,190)

        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,85); ctx.lineTo(150,200);
        
        //next level stats
        ctx.fillText('damage: '+ shotgunNext.damageMin+'-'+shotgunNext.damageMax,155,130)
        ctx.fillText('fire rate: '+ shotgunNext.fireRate+' ms',155,145)
        ctx.fillText('spread: '+ shotgunNext.spread+' deg',155,160)
        ctx.fillText('critchnce: '+ shotgunNext.critChance+'%',155,175)
        ctx.fillText('critdmg: '+ shotgunNext.critDmg+ 'x',155,190) 
       
        //upgrade button
        ctx.moveTo(265,173); ctx.lineTo(370,173); 
        ctx.moveTo(265,171.5); ctx.lineTo(265,200)
        ctx.stroke()
        ctx.fillText('upgrade: '+shotgun.price,270,190)
    }

    else if ( upgradePrim == 3)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(191,80); ctx.lineTo(244,80)
        ctx.stroke()

        ctx.fillText('level '+ cannon.level,25,103)
        ctx.fillText('level '+ cannon.nextLevel,155,103)
        
        ctx.fillText('damage: '+ cannon.damageMin+'-'+cannon.damageMax,25,130)
        ctx.fillText('fire rate: '+ cannon.fireRate+' ms',25,145)
        ctx.fillText('accuracy: '+ cannon.accuracy+' deg',25,160)
        ctx.fillText('pendmg: '+ cannon.penetrationDmg+'x',25,175)
        ctx.fillText('pencount: '+ cannon.penetrationCount+ 'x',25,190)

        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,85); ctx.lineTo(150,200);
        
        //next level stats
        ctx.fillText('damage: '+ cannonNext.damageMin+'-'+cannonNext.damageMax,155,130)
        ctx.fillText('fire rate: '+ cannonNext.fireRate+' ms',155,145)
        ctx.fillText('accuracy: '+ cannonNext.accuracy+' deg',155,160)
        ctx.fillText('pendmg: '+ cannonNext.penetrationDmg+'x',155,175)
        ctx.fillText('pencount: '+ cannonNext.penetrationCount+ 'x',155,190) 
       
        //upgrade button
        ctx.moveTo(265,173); ctx.lineTo(370,173); 
        ctx.moveTo(265,171.5); ctx.lineTo(265,200)
        ctx.stroke()
        ctx.fillText('upgrade: '+cannon.price,270,190)
    }

    else if ( upgradePrim == 4)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(252,80); ctx.lineTo(365,80)
        ctx.stroke()

        ctx.fillText('level '+ rcktLnchr.level,25,103)
        ctx.fillText('level '+ rcktLnchr.nextLevel,155,103)
        
        ctx.fillText('damage: '+ rcktLnchr.damageMin+'-'+rcktLnchr.damageMax,25,130)
        ctx.fillText('fire rate: '+ rcktLnchr.fireRate+' ms',25,145)
        ctx.fillText('accuracy: '+ rcktLnchr.accuracy+' deg',25,160)
        ctx.fillText('rktspeed: '+ rcktLnchr.rocketSpeed+'%',25,175)
        ctx.fillText('rktcount: '+ rcktLnchr.rocketCount+ 'x',25,190)

        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,85); ctx.lineTo(150,200);
        
        //next level stats
        ctx.fillText('damage: '+ rcktLnchrNext.damageMin+'-'+rcktLnchrNext.damageMax,155,130)
        ctx.fillText('fire rate: '+ rcktLnchrNext.fireRate+' ms',155,145)
        ctx.fillText('accuracy: '+ rcktLnchrNext.accuracy+' deg',155,160)
        ctx.fillText('rktspeed: '+ rcktLnchrNext.rocketSpeed+'%',155,175)
        ctx.fillText('rktcount: '+ rcktLnchrNext.rocketCount+ 'x',155,190) 
       
        //upgrade button
        ctx.moveTo(265,173); ctx.lineTo(370,173); 
        ctx.moveTo(265,171.5); ctx.lineTo(265,200)
        ctx.stroke()
        ctx.fillText('upgrade: '+rcktLnchr.price,270,190)
    }

    

    //secondary weapons
    ctx.beginPath(); ctx.strokeStyle = 'black'; ctx.lineWidth = 5;
    ctx.strokeRect(20,220,350,160); ctx.font = '30px Arial';        
    ctx.fillText('Secondary weapons',25,250); ctx.moveTo(20,260); ctx.lineTo(370,260); 
    ctx.font = '16px Arial'; ctx.stroke()
    ctx.fillText('left cannon  right cannon  left rocket  right rocket',24 ,278)
    ctx.beginPath(); ctx.lineWidth = 3; ctx.moveTo(107,260); ctx.lineTo(107,285); 
    ctx.moveTo(204,260); ctx.lineTo(204,285); 
    ctx.moveTo(283,260); ctx.lineTo(283,285); 
    ctx.moveTo(20,285); ctx.lineTo(370,285); ctx.stroke()


    //content for secondary weapons

    if ( upgradeSec == 1) 
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(25,280); ctx.lineTo(103,280)
        ctx.stroke()
        
        ctx.fillText('level '+ secCanL.level,25,303)
        ctx.fillText('level '+ secCanL.nextLevel,155,303)

        ctx.fillText('damage: '+ secCanL.damageMin+'-'+secCanL.damageMax,25,330)
        ctx.fillText('fire rate: '+ secCanL.fireRate+' ms',25,345)
        ctx.fillText('accuracy: '+ secCanL.accuracy+' deg',25,360)
        
        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,285); ctx.lineTo(150,380);
        
        //next level stats
        ctx.fillText('damage: '+ secCanLNext.damageMin+'-'+secCanLNext.damageMax,155,330)
        ctx.fillText('fire rate: '+ secCanLNext.fireRate+' ms',155,345)
        ctx.fillText('acc: '+ secCanLNext.accuracy+' deg',155,360)
        
       
        //upgrade button
        ctx.moveTo(265,353); ctx.lineTo(370,353); 
        ctx.moveTo(265,351.5); ctx.lineTo(265,380)
        ctx.stroke()
        ctx.fillText('upgrade: '+secCanL.price,270,370)
    }
    
    if ( upgradeSec == 2)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(111,280); ctx.lineTo(200,280)
        ctx.stroke()

        ctx.fillText('level '+ secCanR.level,25,303)
        ctx.fillText('level '+ secCanR.nextLevel,155,303)

        ctx.fillText('damage: '+ secCanR.damageMin+'-'+secCanR.damageMax,25,330)
        ctx.fillText('fire rate: '+ secCanR.fireRate+' ms',25,345)
        ctx.fillText('accuracy: '+ secCanR.accuracy+' deg',25,360)
        
        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,285); ctx.lineTo(150,380);
        
        //next level stats
        ctx.fillText('damage: '+ seCanRNext.damageMin+'-'+seCanRNext.damageMax,155,330)
        ctx.fillText('fire rate: '+ seCanRNext.fireRate+' ms',155,345)
        ctx.fillText('acc: '+ seCanRNext.accuracy+' deg',155,360)
        
       
        //upgrade button
        ctx.moveTo(265,353); ctx.lineTo(370,353); 
        ctx.moveTo(265,351.5); ctx.lineTo(265,380)
        ctx.stroke()
        ctx.fillText('upgrade: '+secCanR.price,270,370)
    }

    if ( upgradeSec == 3)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(208,280); ctx.lineTo(279,280)
        ctx.stroke()

        ctx.fillText('level '+ secRockL.level,25,303)
        ctx.fillText('level '+ secRockL.nextLevel,155,303)

        ctx.fillText('damage: '+ secRockL.damageMin+'-'+secRockL.damageMax,25,330)
        ctx.fillText('fire rate: '+ secRockL.fireRate+' ms',25,345)
        ctx.fillText('accuracy: '+ secRockL.accuracy+' deg',25,360)
        
        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,285); ctx.lineTo(150,380);
        
        //next level stats
        ctx.fillText('damage: '+ secRockLNext.damageMin+'-'+secRockLNext.damageMax,155,330)
        ctx.fillText('fire rate: '+ secRockLNext.fireRate+' ms',155,345)
        ctx.fillText('acc: '+ secRockLNext.accuracy+' deg',155,360)
        
       
        //upgrade button
        ctx.moveTo(265,353); ctx.lineTo(370,353); 
        ctx.moveTo(265,351.5); ctx.lineTo(265,380)
        ctx.stroke()
        ctx.fillText('upgrade: '+secRockL.price,270,370)
    }

    if ( upgradeSec == 4)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(287,280); ctx.lineTo(365,280)
        ctx.stroke()

        ctx.fillText('level '+ secRockR.level,25,303)
        ctx.fillText('level '+ secRockR.nextLevel,155,303)

        ctx.fillText('damage: '+ secRockR.damageMin+'-'+secRockR.damageMax,25,330)
        ctx.fillText('fire rate: '+ secRockR.fireRate+' ms',25,345)
        ctx.fillText('accuracy: '+ secRockR.accuracy+' deg',25,360)
        
        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = 'black'
        ctx.moveTo(150,285); ctx.lineTo(150,380);
        
        //next level stats
        ctx.fillText('damage: '+ secRockRNext.damageMin+'-'+secRockRNext.damageMax,155,330)
        ctx.fillText('fire rate: '+ secRockRNext.fireRate+' ms',155,345)
        ctx.fillText('acc: '+ secRockRNext.accuracy+' deg',155,360)
        
       
        //upgrade button
        ctx.moveTo(265,353); ctx.lineTo(370,353); 
        ctx.moveTo(265,351.5); ctx.lineTo(265,380)
        ctx.stroke()
        ctx.fillText('upgrade: '+secRockR.price,270,370)
    }


    //base & abilities top
    ctx.beginPath(); ctx.strokeStyle = 'black'; ctx.lineWidth = 5;
    ctx.strokeRect(390,50,290,290); ctx.font = '30px Arial';
    ctx.fillText('Base & abilities',395,80); ctx.moveTo(390,90); ctx.lineTo(680,90); 
    ctx.font = '16px Arial'; ctx.stroke()
    
    //base upgrades
    ctx.fillText('base health: '+maxHealth+' > '+nextHealth,395,108)
    ctx.beginPath(); ctx.lineWidth = 3;
    ctx.moveTo(565,90); ctx.lineTo(565,115)
    ctx.fillText('upgrade: '+healthPrice,570,108)
    ctx.moveTo(390,115); ctx.lineTo(680,115)
    ctx.fillText('shield health: '+maxShield+' > '+nextShield,395,133)
    ctx.moveTo(572,115); ctx.lineTo(572,140)
    ctx.fillText('upgrade: '+shieldPrice,578,133)
    ctx.moveTo(390,140); ctx.lineTo(680,140)    
        
    //abilities
    ctx.fillText('airstrike  EMP  minefield  laser',395 ,158)
     ctx.moveTo(455,140); ctx.lineTo(455,165); 
    ctx.moveTo(499,140); ctx.lineTo(499,165); 
    ctx.moveTo(572,140); ctx.lineTo(572,165); 
    ctx.moveTo(390,165); ctx.lineTo(680,165); ctx.stroke()

    if ( upgradeTert == 1)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(395,160); ctx.lineTo(451,160)
        ctx.stroke()
    }

    if ( upgradeTert == 2)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(459,160); ctx.lineTo(495,160)
        ctx.stroke()
    }

    if ( upgradeTert == 3)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(503,160); ctx.lineTo(568,160)
        ctx.stroke()
    }

    if ( upgradeTert == 4)
    {
        ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = 'red'
        ctx.moveTo(576,160); ctx.lineTo(675,160)
        ctx.stroke()
    }
}

function checkButt()
{
    if (gameActive == false && day == 0)
    {
        if (buttClicked(300,300,100,50)) { day = 1; showUpgradeMenu(); gameActive = true }
    }
    else if (gameActive == true)
    {
        if ( dayActive == false)
        {
            if ( buttClicked(totW-70,totH-33.5,60,30)) 
            { 
                console.log('starting day '+day); dayActive = true
                newMoney = 0
                
                console.log('current money: '+money)
                console.log('total money: '+totalMoney)
                canvas.style.cursor = 'crosshair';
                currentHealth = maxHealth
                currentShield = maxShield
                var color = Math.floor(Math.random() * 3)
                if (color == 0) {bgColor = 'darkgreen'}
                if (color == 1) {bgColor = 'darkkhaki'}
                if (color == 2) {bgColor = 'snow'}
                mainGun = new gun(20,totH/2-(61/2),121,61,'mg.png','prim');
                if (secCanL != canLeftLvl0)
                {auxGun1 = new gun(15,80,121,61,secCanL.image,'sec')}
                if (secCanR != canRightLvl0)
                {auxGun2 = new gun(15,totH-(80+61),121,61,secCanR.image,'sec')}
                if (secRockL != rockLeftLvl0)
                {auxRckt1 = new gun(10,20,121,61,secRockL.image,'sec')}
                if (secRockR != rockRightLvl0)
                {auxRckt2 = new gun(10,totH-(20+61),121,61,secRockR.image,'sec')}
                dayInterval = setInterval(dayFunc, 20);
                spawnerInterval = setInterval(enemySpawner,3000)                
            }
            //weapon select buttons
            if ( buttClicked(23,60,105,30) && upgradePrim != 1) 
            { 
                upgradePrim = 1; console.log('machine gun '+ upgradePrim); showUpgradeMenu()
            }
            if ( buttClicked(128,60,60,30) && upgradePrim != 2) 
            { 
                upgradePrim = 2; console.log('shotgun '+ upgradePrim); showUpgradeMenu()
            }
            if ( buttClicked(188,60,60,30) && upgradePrim != 3) 
            { 
                upgradePrim = 3; console.log('cannon '+ upgradePrim); showUpgradeMenu()
            }
            if ( buttClicked(255,60,120,30)&& upgradePrim != 4) 
            { 
                upgradePrim = 4; console.log('rocket launcher '+ upgradePrim); showUpgradeMenu()
            }

            //secondary
            if ( buttClicked(25,265,85,30) && upgradeSec != 1)
            {
                upgradeSec = 1; console.log('left cnn '+ upgradeSec); showUpgradeMenu()
            }
            if ( buttClicked(112,265,96,30) && upgradeSec != 2)
            {
                upgradeSec = 2; console.log('right cnn '+ upgradeSec); showUpgradeMenu()
            }
            if ( buttClicked(209,265,78,30) && upgradeSec != 3)
            {
                upgradeSec = 3; console.log('left rocket '+ upgradeSec); showUpgradeMenu()
            }
            if ( buttClicked(288,265,85,30) && upgradeSec != 4)
            {
                upgradeSec = 4; console.log('right rocket '+ upgradeSec); showUpgradeMenu()
            }

            //tertiary
            if ( buttClicked(397,147,60,20) && upgradeTert !=1)
            {
                upgradeTert = 1; console.log('airstrike'+ upgradeTert); showUpgradeMenu()
            }
            if ( buttClicked(460,147,40,20) && upgradeTert !=2)
            {
                upgradeTert = 2; console.log('EMP'+ upgradeTert); showUpgradeMenu()
            }
            if ( buttClicked(505,147,70,20) && upgradeTert !=3)
            {
                upgradeTert = 3; console.log('minefield'+ upgradeTert); showUpgradeMenu()
            }
            if ( buttClicked(580,147,100,20) && upgradeTert !=4)
            {
                upgradeTert = 4; console.log('laser'+ upgradeTert); showUpgradeMenu()
            }
             
             
            //primary upgrade button
            if ( buttClicked(275,180,95,20)) 
            { 
                if(upgradePrim == 1 && money >= mg.price)
                {
                    console.log('machine gun upgraded to level '+ mg.nextLevel);
                    money -= mg.price 
                    if (mg == mgLvl1) { mg = mgLvl2; mgNext = mgLvl3 }
                    else if (mg == mgLvl2) { mg = mgLvl3; mgNext = mgLvl4 }
                    else if (mg == mgLvl3) { mg = mgLvl4; mgNext = mgLvl5 }
                    else if (mg == mgLvl4) { mg = mgLvl5 }
                    showUpgradeMenu()
                }
                
                if(upgradePrim == 2 && money >= shotgun.price)
                {
                    console.log('shotgun upgraded to level '+ shotgun.nextLevel)
                    money -= shotgun.price
                    if (shotgun == sgLvl0) { shotgun = sgLvl1; shotgunNext = sgLvl2}
                    else if (shotgun == sgLvl1) { shotgun = sgLvl2; shotgunNext = sgLvl3}
                    else if (shotgun == sgLvl2) { shotgun = sgLvl3; shotgunNext = sgLvl4}
                    else if (shotgun == sgLvl3) { shotgun = sgLvl4; shotgunNext = sgLvl5}
                    else if (shotgun == sgLvl4) { shotgun = sgLvl5 }
                    showUpgradeMenu()
                }
                
                if (upgradePrim == 3 && money >= cannon.price)
                {
                    console.log('cannon upgraded to level '+ cannon.nextLevel)
                    money -= cannon.price
                    if (cannon == cnLvl0) { cannon = cnLvl1; cannonNext = cnLvl2} 
                    else if (cannon == cnLvl1) { cannon = cnLvl2; cannonNext = cnLvl3}
                    else if (cannon == cnLvl2) { cannon = cnLvl3; cannonNext = cnLvl4}
                    else if (cannon == cnLvl3) { cannon = cnLvl4; cannonNext = cnLvl5}
                    else if (cannon == cnLvl4) { cannon = cnLvl5 }
                    showUpgradeMenu()
                }

                if(upgradePrim == 4 && money >= rcktLnchr.price)
                {
                    console.log('rocket launcher upgraded to level '+ rcktLnchr.nextLevel)
                    money -= rcktLnchr.price
                    if (rcktLnchr == rktLvl0) { rcktLnchr = rktLvl1; rcktLnchrNext = rktLvl2} 
                    else if (rcktLnchr == rktLvl1) { rcktLnchr = rktLvl2; rcktLnchrNext = rktLvl3}
                    else if (rcktLnchr == rktLvl2) { rcktLnchr = rktLvl3; rcktLnchrNext = rktLvl4}
                    else if (rcktLnchr == rktLvl3) { rcktLnchr = rktLvl4; rcktLnchrNext = rktLvl5}
                    else if (rcktLnchr == rktLvl4) { rcktLnchr = rktLvl5 }
                    showUpgradeMenu()
                }
            }
            //secondary upgrade button
            if (buttClicked(275,360,95,20))
            {
                if(upgradeSec == 1 && money >= secCanL.price)
                {
                    console.log('left secondary cannon upgraded to level '+ secCanL.nextLevel)
                    money -= secCanL.price
                    if (secCanL == canLeftLvl0) { secCanL = canLeftLvl1; secCanLNext = canLeftLvl2}
                    else if (secCanL == canLeftLvl1) { secCanL = canLeftLvl2; secCanLNext = canLeftLvl3}
                    else if (secCanL == canLeftLvl2) { secCanL = canLeftLvl3; secCanLNext = canLeftLvl4}
                    else if (secCanL == canLeftLvl3) { secCanL = canLeftLvl4; secCanLNext = canLeftLvl5}
                    else if (secCanL == canLeftLvl4) { secCanL = canLeftLvl5}
                    showUpgradeMenu()
                }
                if(upgradeSec == 2 && money >= secCanR.price)
                {
                    console.log('right secondary cannon upgraded to level '+ secCanR.nextLevel)
                    money -= secCanR.price
                    if (secCanR == canRightLvl0) { secCanR = canRightLvl1; seCanRNext = canRightLvl2}
                    else if (secCanR == canRightLvl1) { secCanR = canRightLvl2; seCanRNext = canRightLvl3}
                    else if (secCanR == canRightLvl2) { secCanR = canRightLvl3; seCanRNext = canRightLvl4}
                    else if (secCanR == canRightLvl3) { secCanR = canRightLvl4; seCanRNext = canRightLvl5}
                    else if (secCanR == canRightLvl4) { secCanR = canRightLvl5}
                    showUpgradeMenu()
                }
                if(upgradeSec == 3 && money >= secRockL.price)
                {
                    console.log('left secondary rocket upgraded to level '+ secRockL.nextLevel)
                    money -= secRockL.price
                    if (secRockL == rockLeftLvl0) { secRockL = rockLeftLvl1; secRockLNext = rockLeftLvl2}
                    else if (secRockL == rockLeftLvl1) { secRockL = rockLeftLvl2; secRockLNext = rockLeftLvl3}
                    else if (secRockL == rockLeftLvl2) { secRockL = rockLeftLvl3; secRockLNext = rockLeftLvl4}
                    else if (secRockL == rockLeftLvl3) { secRockL = rockLeftLvl4; secRockLNext = rockLeftLvl5}
                    else if (secRockL == rockLeftLvl4) { secRockL = rockLeftLvl5}
                    showUpgradeMenu()
                }
                if(upgradeSec == 4 && money >= secRockR.price)
                {
                    console.log('right secondary rocket upgraded to level '+ secRockR.nextLevel)
                    money -= secRockR.price
                    if (secRockR == rockRightLvl0) { secRockR = rockRightLvl1; secRockRNext = rockRightLvl2}
                    else if (secRockR == rockRightLvl1) { secRockR = rockRightLvl2; secRockRNext = rockRightLvl3}
                    else if (secRockR == rockRightLvl2) { secRockR = rockRightLvl3; secRockRNext = rockRightLvl4}
                    else if (secRockR == rockRightLvl3) { secRockR = rockRightLvl4; secRockRNext = rockRightLvl5}
                    else if (secRockR == rockRightLvl4) { secRockR = rockRightLvl5}
                    showUpgradeMenu()
                }
            }
            
            //health/shield upgrade buttons
            if (buttClicked(565,95,115,23) && money >= healthPrice)
            {
                if (maxHealth < 275)
                {
                    console.log('health upgraded')
                    money -= healthPrice
                    maxHealth += 25; nextHealth += 25; healthPrice += 25
                    showUpgradeMenu()
                }
                else if (maxHealth == 275) { maxHealth += 25; nextHealth = 'Max'; healthPrice = 0; showUpgradeMenu()}
            }
            if (buttClicked(575,120,105,25) && money >= shieldPrice)
            {
                if (maxShield < 125)
                {
                    console.log('shield upgraded')
                    money -= shieldPrice
                    maxShield += 25; nextShield += 25; shieldPrice += 25
                    showUpgradeMenu()
                }
                else if (maxShield == 125) { maxShield += 25; nextShield = 'Max'; shieldPrice = 0; showUpgradeMenu()}
            }
        }
        if (dayActive == true)
        {
            if (aDuration4 == 0)
            {
                if (activeWeapon == 1)
                {
                    fireInterval = setInterval(function() {
                        projectiles.push(new mgProjectile(8,5,'gold',mainGun.dx,mainGun.dy,musx,musy,'frend')); shotsFired++
                        //projectiles.push(new mgProjectile(8,5,'gold',totW-50,totH/2,100,totH/2,'enemi'))//TEST
                        //projectiles.push(new mgProjectile(8,5,'gold',totW-50,50,100,50,'enemi'))//TEST
                        //projectiles.push(new mgProjectile(8,5,'gold',totW-50,300,100,350,'enemi'))//TEST
                    }, mg.fireRate);
                }
                if (activeWeapon == 2 && canFire == true)
                {
                    canFire = false; console.log(canFire); shotsFired++
                    for (f=0; f<7; f++)
                    {
                        projectiles.push(new sgProjectile(8,5,'gold',mainGun.dx,mainGun.dy,musx,musy,'frend')) 
                    }
                    setTimeout(function() {canFire = true; console.log(canFire)}, shotgun.fireRate)
                }
                if (activeWeapon == 3 && canFire == true)
                {
                    canFire = false; console.log(canFire)
                    projectiles.push(new cnnProjectile(16,8,'gray',mainGun.dx,mainGun.dy,musx,musy,'frend')); shotsFired++
                    setTimeout(function() {canFire = true; console.log(canFire)}, cannon.fireRate)
                }
                if (activeWeapon == 4 && canFire == true)
                {
                    canFire = false; console.log(canFire)
                    for (f=0; f<rcktLnchr.rocketCount; f++)
                    {
                        projectiles.push(new rktProjectile(50,7,'red',mainGun.dx,mainGun.dy,musx,musy,'frend')); shotsFired++
                    }
                    setTimeout(function() {canFire = true; console.log(canFire)}, rcktLnchr.fireRate)
                }
            }
            else 
            {
                fireInterval = setInterval(function() {
                    projectiles.push(new laserBeam(10,'red',mainGun.dx,mainGun.dy,musx,musy))
                },20)
                
            }
        }
    }
}

function buttHoverCheck() {
    if (gameActive == false && buttHovered(300,300,100,50) && day == 0) {canvas.style.cursor = 'pointer'}
    else {canvas.style.cursor = 'default'}
    
    if (gameActive == true)
    {
        if (buttHovered(totW-70,totH-33.5,60,30)) {canvas.style.cursor = 'pointer'}
        
        else if (buttHovered(23,60,105,30) && upgradePrim != 1) {canvas.style.cursor = 'pointer'}   
        else if (buttHovered(128,60,60,30) && upgradePrim != 2) {canvas.style.cursor = 'pointer'} 
        else if (buttHovered(188,60,60,30) && upgradePrim != 3) {canvas.style.cursor = 'pointer'} 
        else if (buttHovered(255,60,120,30) && upgradePrim != 4) {canvas.style.cursor = 'pointer'} 
        
        else if (buttHovered(25,265,85,30) && upgradeSec != 1) {canvas.style.cursor = 'pointer'}
        else if (buttHovered(112,265,96,30) && upgradeSec != 2) {canvas.style.cursor = 'pointer'}
        else if (buttHovered(209,265,78,30) && upgradeSec != 3) {canvas.style.cursor = 'pointer'}
        else if (buttHovered(288,265,85,30) && upgradeSec != 4) {canvas.style.cursor = 'pointer'}
        
        else if (buttHovered(397,147,60,20) && upgradeTert != 1) {canvas.style.cursor = 'pointer'}
        else if (buttHovered(460,147,40,20) && upgradeTert != 2) {canvas.style.cursor = 'pointer'}
        else if (buttHovered(505,147,70,20) && upgradeTert != 3) {canvas.style.cursor = 'pointer'}
        else if (buttHovered(580,147,100,20) && upgradeTert != 4) {canvas.style.cursor = 'pointer'}

        else if (buttHovered(275,180,95,20))
        {
            if (upgradePrim == 1)
            {
                if (mg != mgLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
            if (upgradePrim == 2)
            {
                if (shotgun != sgLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
            if (upgradePrim == 3)
            {
                if (cannon != cnLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
            if (upgradePrim == 4)
            {
                if (rcktLnchr != rktLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
        }
         
        else if (buttHovered(275,360,95,20))
        {
            if (upgradeSec == 1)
            {
                if (secCanL != canLeftLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
            if (upgradeSec == 2)
            {
                if (secCanR != canRightLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
            if (upgradeSec == 3)
            {
                if (secRockL != rockLeftLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
            if (upgradeSec == 4)
            {
                if (secRockR != rockRightLvl5) {canvas.style.cursor = 'pointer'}
                else {canvas.style.cursor = 'not-allowed'}
            }
        }
         
        else if (buttHovered(565,95,115,23)) {
            if (maxHealth < 300) {canvas.style.cursor = 'pointer'}
            else {canvas.style.cursor = 'not-allowed'}
        }
        else if (buttHovered(575,120,105,25)) {
            if (maxShield < 150) {canvas.style.cursor = 'pointer'}
            else {canvas.style.cursor = 'not-allowed'}
        }
        else {canvas.style.cursor = 'default'}
    }
    
}
        


function checkKey(){
    if(dayActive==true)
    {
        if(keyPress == 'e' && aDuration4 == 0)
        {
            if (activeWeapon<4)
            {activeWeapon++; console.log(activeWeapon)}
            else if (activeWeapon == 4) {activeWeapon=1; console.log(activeWeapon)}
            
            if (activeWeapon == 2 && shotgun == sgLvl0) {activeWeapon++; console.log('shotgun locked')}
            if (activeWeapon == 3 && cannon == cnLvl0) {activeWeapon++; console.log('cannon locked')}
            if (activeWeapon == 4 && rcktLnchr == rktLvl0) {activeWeapon = 1; console.log('rocket launcher locked')}    
        }
        
        
        if(keyPress == 'z' && aCool1 == 0)
        {
            console.log('1 airstrike')
            aCool1 = airStrike.coolDown
        }

        if(keyPress == 'x' && aCool2 == 0)
        {
            console.log('2 EMP')
            aCool2 = emp.coolDown
        }

        if(keyPress == 'c' && aCool3 == 0)
        {
            console.log('3 minefield')
            aCool3 = mineField.coolDown
        }
        
        if(keyPress == 'v' && aCool4 == 0)
        {
            console.log('4 laser')
            aCool4 = laser.coolDown
            aDuration4 = laser.duration
        }
    }
    else if (dayActive == false && gameActive == false)
    {
        if (keyPress == 'f') {showUpgradeMenu(); gameActive = true}
        if (keyPress == 'r') {window.location.reload()}
    }
}

function enemySpawner() {
    var x = totW+100
    var y = Math.random() * (300-40) + 40
    enemies.push(new enemy(x,y,80,80,'dron.png','dron'))
    console.log('created enemy with x: '+x+' and y: '+y)
}


function dayFunc() { 
    ctx.clearRect(0,0,totW,totH); 
    ctx.fillStyle = bgColor; 
    ctx.fillRect(0,0,totW,totH);
     
    if (aDuration4 > 0) {mainGun.image.src = 'lazer.png'} 
    else {
    if(activeWeapon==1) {mainGun.image.src = mg.image}
    if(activeWeapon==2) {mainGun.image.src = shotgun.image}
    if(activeWeapon==3) {mainGun.image.src = cannon.image}
    if(activeWeapon==4) {mainGun.image.src = rcktLnchr.image}
    }  
    airStrikeCooldownPercentage = aCool1/airStrike.coolDown
    EMPCooldownPercentage = aCool2/emp.coolDown
    minefieldCooldownPercentage = aCool3/mineField.coolDown
    laserCooldownPercentage = aCool4/laser.coolDown
 
    
    if (aCool1 > 0) {aCool1 -= 0.02}
    else if (aCool1 < 0) {aCool1 = 0}
    if (aCool2 > 0) {aCool2 -= 0.02}
    else if (aCool2 < 0) {aCool2 = 0}
    if (aCool3 > 0) {aCool3 -= 0.02}
    else if (aCool3 < 0) {aCool3 = 0}
    if (aCool4 > 0) {aCool4 -= 0.02}
    else if (aCool4 < 0) {aCool4 = 0}
    
    if (aDuration4 > 0) {aDuration4 -= 0.02}
    else if (aDuration4 < 0) {aDuration4 = 0}

    //base  
    ctx.fillStyle = 'darkslategray';
    ctx.fillRect(0,0,80,totH);
    ctx.fillRect(80,totH/2-120,80,240) 
    ctx.lineWidth = 4 
    ctx.beginPath(); ctx.moveTo(80,0); ctx.lineTo(160,totH/2-120); 
    ctx.lineTo(80,totH/2-120); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(80,totH); ctx.lineTo(160,totH/2+120)
    ctx.lineTo(80,totH/2+120); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = 'yellow'; ctx.strokeRect(45,totH/2-35,70,70)
    ctx.strokeRect(40,75,70,70); ctx.strokeRect(40,totH-(75+70),70,70)
    
    mainGun.update();
    if (secCanL != canLeftLvl0 && enemies.length == 0)
    {
        auxGun1.angleToEnemy()
    } 
    else if (secCanL != canLeftLvl0 && enemies.length != 0 ) 
    {
        auxGun1.findDistance()
        auxGun1.angleToEnemy(auxGun1.targetX,auxGun1.targetY) 
        
        if (auxGun1.shootCool == 0)
        {
            projectiles.push(new cnnProjectile(16,8,'gray',auxGun1.dx,auxGun1.dy,auxGun1.targetX,auxGun1.targetY,'frend'));
            auxGun1.shootCool = secCanL.fireRate
        }
        else {auxGun1.shootCool -= 20}
    } 
    
    if (secCanR != canRightLvl0 && enemies.length == 0)
    {
        auxGun2.angleToEnemy()
    }
    else if (secCanR != canRightLvl0 && enemies.length != 0 ) 
    {
        auxGun2.findDistance()
        auxGun2.angleToEnemy(auxGun2.targetX,auxGun2.targetY)
        
        if (auxGun2.shootCool == 0)
        {
            projectiles.push(new cnnProjectile(16,8,'gray',auxGun2.dx,auxGun2.dy,auxGun2.targetX,auxGun2.targetY,'frend'));
            auxGun2.shootCool = secCanR.fireRate
        }
        else {auxGun2.shootCool -= 20}
    }

    if (secRockL != rockLeftLvl0 && enemies.length == 0)
    {
        auxRckt1.angleToEnemy()
    }
    else if (secRockL != rockLeftLvl0 && enemies.length != 0 ) 
    {
        auxRckt1.findDistance()
        auxRckt1.angleToEnemy(auxRckt1.targetX,auxRckt1.targetY)
        
        if (auxRckt1.shootCool == 0)
        {
            projectiles.push(new rktProjectile(16,8,'red',auxRckt1.dx,auxRckt1.dy,auxRckt1.targetX,auxRckt1.targetY,'frend'));
            auxRckt1.shootCool = secRockL.fireRate
        }
        else {auxRckt1.shootCool -= 20}
    }

    if (secRockR != rockRightLvl0 && enemies.length == 0)
    {
        auxRckt2.angleToEnemy()
    }
    else if (secRockR != rockRightLvl0 && enemies.length != 0 )
    {
        auxRckt2.findDistance()
        auxRckt2.angleToEnemy(auxRckt2.targetX,auxRckt2.targetY)
        
        if (auxRckt2.shootCool == 0)
        {
            projectiles.push(new rktProjectile(16,8,'red',auxRckt2.dx,auxRckt2.dy,auxRckt2.targetX,auxRckt2.targetY,'frend'));
            auxRckt2.shootCool = secRockR.fireRate
        }
        else {auxRckt2.shootCool -= 20}
    } 
    
    enemies.forEach(e => { 
        e.render()
        if (e.type == 'dron')
        {
            if (e.x > 400) {e.x -= 1}
            if (e.x < 500)
            {
                e.shootCool -= 0.02
                if (e.shootCool < 0)
                {
                    projectiles.push(new mgProjectile(10,4,'red',e.x,e.y+40,100,e.y+40,'enemi'))
                    e.shootCool = 1
                }
            }
            
        }
        if (e.health <= 0) {enemies.splice(e,1); newMoney += e.money; console.log('looted '+e.money+' money')}
    })
    
    
    projectiles.forEach(bullet => {
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
    });
    
    //money counter
    ctx.beginPath(); ctx.lineWidth = 5; ctx.strokeStyle = 'black'
    ctx.moveTo(totW-140,0); ctx.lineTo(totW-140,32.5);     
    ctx.moveTo(totW-140,30); ctx.lineTo(totW,30)
    ctx.fillStyle = 'lightslategray'; ctx.fillRect(totW-140,0,140,30)
    ctx.stroke(); ctx.fillStyle = 'black'
    ctx.font = '25px Arial'; ctx.fillText('money:'+newMoney,totW-135,20);
    
    //abilities
    ctx.beginPath(); ctx.moveTo(totW,totH-55); ctx.lineTo(totW-187.5,totH-55); ctx.lineTo(totW-187.5,totH) //main border
    
    ctx.fillStyle = 'lightslategray'; ctx.fillRect(totW-187.5,totH-55,190,55); ctx.stroke(); //background

    ctx.fillStyle = 'darkcyan'; ctx.fillRect(totW-177.5,totH-44,35,35); ctx.fillRect(totW-132.5,totH-44,35,35) //green thingies
    ctx.fillRect(totW-87.5,totH-44,35,35); ctx.fillRect(totW-42.5,totH-44,35,35)

    ctx.fillStyle = 'lightslategray'; ctx.fillRect(totW-142.5,totH-44,35*-airStrikeCooldownPercentage,35) //gray/grey thingies
    ctx.fillRect(totW-97.5,totH-44,35*-EMPCooldownPercentage,35); ctx.fillRect(totW-52.5,totH-44,35*-minefieldCooldownPercentage,35); 
    ctx.fillRect(totW-7.5,totH-44,35*-laserCooldownPercentage,35); 

    ctx.lineWidth = 3; ctx.strokeRect(totW-177.5,totH-44,35,35); ctx.strokeRect(totW-132.5,totH-44,35,35) //little boxes
    ctx.strokeRect(totW-87.5,totH-44,35,35); ctx.strokeRect(totW-42.5,totH-44,35,35)

    ctx.font = '13px Arial'; ctx.fillStyle = 'black'; ctx.fillText('z           x          c           v',totW-175,totH-34) //key thingies
    
    if (aCool1 == 0) {var bombs = new Image; bombs.src = 'plen.ico'; ctx.drawImage(bombs,totW-172.5,totH-37)} //pikturs
    if (aCool2 == 0) {var magno = new Image; magno.src = 'magnet.ico'; ctx.drawImage(magno,totW-126.5,totH-37)}
    if (aCool3 == 0) {var mines = new Image; mines.src = 'mines.ico'; ctx.drawImage(mines,totW-82.5,totH-37)}
    if (aCool4 == 0) {var lazer = new Image; lazer.src = 'laser.ico'; ctx.drawImage(lazer,totW-37.5,totH-33)}
    
    if (aCool1 > 0) {ctx.fillText(Math.round(aCool1*10)/10,totW-173,totH-15)} //timers
    if (aCool2 > 0) {ctx.fillText(Math.round(aCool2*10)/10,totW-128,totH-15)}
    if (aCool3 > 0) {ctx.fillText(Math.round(aCool3*10)/10,totW-83,totH-15)}
    if (aCool4 > 0) {ctx.fillText(Math.round(aCool4*10)/10,totW-38,totH-15)}

    //shield
    if (shieldTimeout > 0) {shieldTimeout -= 0.02; console.log('time to shield recharge'+Math.round(shieldTimeout))}
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
    {ctx.beginPath(); ctx.arc(10,totH/2,230,-1,1); ctx.stroke()}

    //day counter and healthbar
    ctx.beginPath(); ctx.lineWidth = 5; ctx.strokeStyle = 'black'
    ctx.moveTo(0,totH-40); ctx.lineTo(290,totH-40); 
    ctx.moveTo(290,totH); ctx.lineTo(290,totH-42.5)
    ctx.fillStyle = 'lightslategray'; ctx.fillRect(0,totH-38.5,290,40)
    ctx.font = '30px Arial'; ctx.fillStyle = 'black'; ctx.fillText('Day '+day,10,totH-10); ctx.stroke()   
    healthPercentage = currentHealth / maxHealth    
    if (healthPercentage > 0.25) {ctx.fillStyle = 'green'}
    if (healthPercentage < 0.25) {ctx.fillStyle = 'red'}
    ctx.fillRect(111.5,totH-27.5,167.5*healthPercentage,8.5)
    if (shieldPercentage > 0.25) {ctx.fillStyle = 'blue'}
    if (shieldPercentage < 0.25) {ctx.fillStyle = 'darkorange'}
    ctx.fillRect(111.5,totH-19,167.5*shieldPercentage,8.5)
    ctx.lineWidth = 3; ctx.strokeRect(110,totH-29,170,20)
    ctx.font = '16px Arial'; ctx.fillStyle = 'black'; ctx.fillText('h:'+Math.round(currentHealth)+' s:'+Math.round(currentShield),(111.5+167.5/2)-30,totH-13)
    
    
    if (currentHealth <= 0) 
    { 
        clearInterval(dayInterval); clearInterval(spawnerInterval); dayActive = false; gameActive = false; console.log('dead on day '+day) 
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'black'
        ctx.font = '45px Arial'; ctx.fillText('your base was destroyed',100,50); ctx.strokeStyle = 'black'
        setTimeout(function() {ctx.font = '30px Arial'; ctx.fillStyle = 'black'; ctx.fillText('you reached day '+day,225,100)},1000)
        setTimeout(function() {ctx.font = '25px Arial'; ctx.fillText('statistics',300,150); ctx.beginPath(); ctx.moveTo(175,155); ctx.lineTo(525,155); ctx.stroke()},2000)
        setTimeout(function() {ctx.fillText('total money collected: '+totalMoney, 175, 180)},2500)
        setTimeout(function() {ctx.fillText('total shots fired: '+shotsFired, 175, 205)},3000)
        setTimeout(function() {ctx.fillText('total enemies defeated: '+kills, 175, 230)},3500)
        setTimeout(function() {ctx.fillText('cars defeated: '+carKills,185,255)},3600)
        setTimeout(function() {ctx.fillText('tonks defeated: '+tonkKills,185,280)},3700)
        setTimeout(function() {ctx.fillText('drones defeated: '+droneKills,185,305)},3800)
        setTimeout(function() {ctx.font = '45px Arial'; ctx.fillText('press r to restart',180,350)}, 5000)
    }

    if (keyPress == 'w')
    {
        clearInterval(dayInterval); clearInterval(spawnerInterval); enemies.splice(0,enemies.length); dayActive = false; gameActive = false; console.log('completed day '+day)
        var dayReward; if (day < 5) { dayReward = 20} else if (day < 10) { dayReward = 50} else if (day < 25) { dayReward = 100}
  
        ctx.fillStyle = 'lightslategray'; ctx.fillRect(0,0,totW,totH); ctx.fillStyle = 'black'
        ctx.font = '45px Arial'; ctx.fillText('you completed day '+day,150,50); 
        setTimeout(function() {ctx.strokeStyle = 'black'; ctx.font = '25px Arial'; ctx.fillText('day completed: '+dayReward,175,100)},1000)
        setTimeout(function() {ctx.fillText('enemies defeated: '+newMoney,175,125)},1500)

        setTimeout(function() {newMoney += dayReward; ctx.fillText('day total: '+newMoney,175,150); ctx.beginPath(); ctx.moveTo(175,160); ctx.lineTo(500,160); ctx.stroke()},2000)
        setTimeout(function() {ctx.font = '30px Arial'; ctx.fillText('old total money: '+money,175,190)},3000)
        setTimeout(function() {money += newMoney; ctx.fillText('new total money: '+money,175,220); totalMoney += money},4000)
        setTimeout(function() {day++; ctx.font = '45px Arial'; ctx.fillText('press f to continue', 170,300)},5000)
    }
}