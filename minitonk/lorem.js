var canvos = document.getElementById("canvos");
var ctx = canvos.getContext("2d");
var myGamePiece, myGamePiece2, heal; 
var myEnemis = [];
var myProjectiles = [];
var myPowerups = [];
var myScore, health1, health2, health3;
var dashCool = 0, hurtCool = 0, shootCool = 0, proteccdur = 0; 
var musx,musy,key,keyPress,canEnterName = false;
var score = 0, health = 3, time = 0;
var firstChar = false, secondChar = false, thirdChar = false, fourthChar = false;
var n,a,m,namer,NAMER
const NO_OF_HIGH_SCORES = 4;
const HIGH_SCORES = 'highScores';
var totW = canvos.width;
var totH = canvos.height;
function startGem() { document.getElementById("startbutt").style.display = "none"; if (health > 0) {gem()} else {window.location.reload()}}
function gem() { myGameArea.start();  myGamePiece = new component(32, 32, "tonk.ico", totW/2 - 10, totH/2 - 10, 'rotate'); 
myScore = new component("30px", "Consolas", "black", 180, 40, "text");
health1 = new component(24, 24, "health.ico", totW/2-42, totH/2, 'image');
health2 = new component(24, 24, "health.ico", totW/2-22, totH/2, 'image');
health3 = new component(24, 24, "health.ico", totW/2-2, totH/2, 'image');}


var myGameArea = {
  
  canvos : document.getElementById("canvos"),
  start : function() {
    this.canvos.width = 500;
    this.canvos.height = 350;
    this.canvos.style.cursor = "crosshair";
    this.canvos.style.backgroundColor = 'darkolivegreen';
    this.context = this.canvos.getContext("2d");
    
    this.interval = setInterval(updateGameArea, 20);
    this.spawnInterval = setInterval(spawnEnemis, 5000);
    this.powerInterval = setInterval(spawnPowerups, 10000)
    
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
      console.log(myGameArea.keys);
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = false;
    })
    canvos.addEventListener('mousemove', function(evt) {
      var rect = this.getBoundingClientRect();
      musx = evt.clientX - rect.left; 
      musy = evt.clientY - rect.top;  
    }, false);
    canvos.addEventListener('mousedown', function(evt) {
      if (evt && (0< musx <500) && (0< musy < 350))
      {shoot()}
    })                   
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvos.width, this.canvos.height);
  },
  stop : function() {
    clearInterval(this.interval,this.spawnInterval, this.powerInterval);
  }
}
  
function component(width, height, color, x, y, type) 
{
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.type = type;
  this.shooterval;
  this.timer = 0;
  this.shootTime = 1;

  if (type == "image" || type == 'rotate' || type == 'imageSpike' || type == 'imageShoot' || type == 'imageHeal' || type == 'imageShield') {
    this.image = new Image();
    this.image.src = color;
  }
  if (type == 'imageShoot')
  {
    // shooterval = setInterval(function(){
    //   ShootInterval(x,y);
    // }, 1000)
  }
  this.update = function()
  {
    ctx = myGameArea.context; 
   
    
    ctx.fillStyle = color
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    if (type == 'rotate')
    {this.angle = Math.atan2(musy - this.centerY, musx - this.centerX) + (Math.PI/2);}
    else if (type == 'imageShoot')
    {this.angle = Math.atan2(myGamePiece.y - this.centerY, myGamePiece.x - this.centerX) + (Math.PI/2)}

    
    if (type == 'image' || type == 'imageSpike' || type == 'imageHeal' || type == 'imageShield')
    {ctx.drawImage(this.image, this.x, this.y, this.width, this.height);}
    else if (type == 'text')
    {ctx.font = this.width + " " + this.height;
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);}
    else if (type == 'rotate' || type == 'imageShoot')
    {ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();}
    else 
    { ctx.fillRect(this.x, this.y, this.width, this.height);}
  }
  this.newPos = function()
  {
    if (this.x > totW)
    {this.x = totW-totW+20; }
    else if (this.x < totW-totW)  
    {this.x = totW-20; }
    else if (this.y > totH)
    { this.y = totH-totH+20}
    else if (this.y < totH-totH)
    { this.y = totH-20}
    else
    {this.x += this.speedX;
    this.y += this.speedY;}
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

function ShootInterval(x,y){
  myProjectiles.push(new projectile(10, 10, 'red', x, y, myGamePiece.x, myGamePiece.y))
}

function spawnEnemis() { var number = Math.floor(Math.random()*3); 
  if (number == 0) {myEnemis.push(new component(32, 32, "enemi.ico", Math.random()*500, Math.random()*350, 'imageSpike'))}
  if (number == 1) {myEnemis.push(new component(32, 32, "enemi2.ico", Math.random()*500, Math.random()*350, 'imageSpike'))}
  if (number == 2) {myEnemis.push(new component(32, 32, "enemi3.ico", Math.random()*500, Math.random()*350, 'imageShoot'))}
}

function spawnPowerups() { var number = Math.floor(Math.random()*3); 
  if (number == 1) { myPowerups.push( new component(24, 24, "heal.ico", Math.floor(Math.random()*500), Math.floor(Math.random()*350), 'imageHeal') ) }
  if (number == 2) { myPowerups.push( new component(24, 24, "protecc.ico", Math.floor(Math.random()*500), Math.floor(Math.random()*350), 'imageShield') ) }
}

function projectile(width, height, color, x, y, targetX, targetY, type) { 
  ctx = myGameArea.context; 
  this.width = width;
  this.height = height;
  ctx.fillStyle = color;
  this.x = x;
  this.y = y;
  this.targetX = targetX;
  this.targetY = targetY;
  this.centerX = this.x + this.width / 2;
  this.centerY = this.y + this.height / 2;
  this.angle = Math.atan2(targetY - this.centerY, targetX - this.centerX) ;
  this.dx = Math.cos(this.angle)
  this.dy = Math.sin(this.angle)
  this.type = type
  
  this.update = function()
  {
    ctx.fillStyle = color;
    this.x += this.dx * 4;
    this.y += this.dy * 4;
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

function shoot()
{if ( shootCool == 0) {myProjectiles.push(new projectile(10, 10, 'gold', myGamePiece.x, myGamePiece.y, musx, musy, 'frend'));shootCool = 25} }


function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES-1]?.score ?? 0;
  
  if (score > lowestScore) {
    canEnterName = true 
    console.log('can enter name')
  }
  else
  {
    console.log('no new highscore')
    showHighscores()
  }
}

function saveHighScore(score) {
  
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
  const newScore = { score, NAMER };
  
  // 1. Add to list
  highScores.push(newScore);

  // 2. Sort the list
  highScores.sort((a, b) => b.score-a.score);
  
  // 3. Select new list
  highScores.splice(NO_OF_HIGH_SCORES);
  
  console.log(highScores)
  console.log('new highscore saved')

  // 4. Save to local storage
  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
};


function updateGameArea() {
  myGameArea.clear();
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  health1.speedX = 0;
  health1.speedY = 0;
  health2.speedX = 0;
  health2.speedY = 0;
  health3.speedX = 0;
  health3.speedY = 0;
  if (dashCool > 0) {dashCool--}
  if (hurtCool > 0) {hurtCool--}
  if (shootCool > 0) {shootCool--}
  if (proteccdur > 0) {proteccdur--}
  if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; health1.speedX = -1; health2.speedX = -1; health3.speedX = -1 }
  if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; health1.speedX = 1; health2.speedX = 1; health3.speedX = 1}
  if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; health1.speedY = -1; health2.speedY = -1; health3.speedY = -1}
  if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; health1.speedY = 1; health2.speedY = 1; health3.speedY = 1}
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedX == 1 && myGamePiece.speedY == 0) 
  {myGamePiece.x += 75; dashCool = 50; health1.x += 75; health2.x += 75; health3.x += 75}
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedX == -1 && myGamePiece.speedY == 0) 
  {myGamePiece.x += -75; dashCool = 50; health1.x += -75; health2.x += -75; health3.x += -75;}    
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedY == 1 && myGamePiece.speedX == 0) 
  {myGamePiece.y += 75; dashCool = 50; health1.y += 75; health2.y += 75; health3.y += 75;}
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedY == -1 && myGamePiece.speedX == 0) 
  {myGamePiece.y += -75; dashCool = 50; health1.y += -75; health2.y += -75; health3.y += -75;}
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedX == 1 && myGamePiece.speedY == 1) 
  {myGamePiece.x += 75; myGamePiece.y += 75; dashCool = 50; health1.x += 75; health1.y += 75; health2.x += 75; health2.y += 75; health3.x += 75; health3.y += 75;}
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedX == 1 && myGamePiece.speedY == -1) 
  {myGamePiece.x += 75; myGamePiece.y += -75; dashCool = 50; health1.x += 75; health1.y += -75; health2.x += 75; health2.y += -75; health3.x += 75; health3.y += -75;}
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedX == -1 && myGamePiece.speedY == 1) 
  {myGamePiece.x += -75; myGamePiece.y += 75; dashCool = 50; health1.x += -75; health1.y += 75; health2.x += -75; health2.y += 75; health3.x += -75; health3.y += 75;}
  
  if (dashCool == 0 && myGameArea.keys && myGameArea.keys[16] && myGamePiece.speedX == -1 && myGamePiece.speedY == -1) 
  {myGamePiece.x += -75; myGamePiece.y += -75; dashCool = 50; health1.x += -75; health1.y += -75; health2.x += -75; health2.y += -75; health3.x += -75; health3.y += -75;}
  time += 0.02;
      
  health1.x = myGamePiece.x-32; health1.y = myGamePiece.y+10; 
  health2.x = myGamePiece.x-12; health2.y = myGamePiece.y+10; 
  health3.x = myGamePiece.x+8; health3.y = myGamePiece.y+10 
  
  myGamePiece.newPos();
  myGamePiece.update();
  
  //if (myGameArea.keys[16]) {myGameArea.stop()}
  
  myScore.text = "SCORE: " + score  + " TIME: " + Math.round(time);
  
  myScore.update();
  
  console.log('health = '+health)
  //console.log('score = '+score)

  
  for (i = 0; i < myEnemis.length; i += 1) {
    if (myEnemis[i].type == 'imageSpike')
    {
      if(myEnemis[i].x < myGamePiece.x)
      {myEnemis[i].x += 0.8;}
      if(myEnemis[i].y < myGamePiece.y)
      {myEnemis[i].y += 0.8;}
      if(myEnemis[i].x > myGamePiece.x)
      {myEnemis[i].x -= 0.8;}
      if(myEnemis[i].y > myGamePiece.y) 
      {myEnemis[i].y -= 0.8}
    }
    else if (myEnemis[i].type == 'imageShoot')
    {
      let enemy = myEnemis[i];
      myEnemis[i].timer = myEnemis[i].timer + 0.02;
      /*console.log(myEnemis[i].timer)*/
      if(enemy.timer > enemy.shootTime){
        enemy.timer = 0;
        myProjectiles.push(new projectile(10, 10, 'red', myEnemis[i].x, myEnemis[i].y, myGamePiece.x, myGamePiece.y, 'enemi'))
      }

      if (myEnemis[i].x < myGamePiece.x)
      {
        if(myGamePiece.x - myEnemis[i].x > 100)
        {myEnemis[i].x += 0.5;}
        else if(myGamePiece.x - myEnemis[i].x < 100)
        {myEnemis[i].x -= 0.5;}
      }
      else if (myEnemis[i].x > myGamePiece.x)
      {
        if(myEnemis[i].x - myGamePiece.x > 100)
        {myEnemis[i].x -= 0.5;}
        else if(myEnemis[i].x - myGamePiece.x < 100) 
        {myEnemis[i].x += 0.5}
      }
      if (myEnemis[i].y < myGamePiece.y)
      {
        if(myGamePiece.y - myEnemis[i].y > 100)
        {myEnemis[i].y += 0.5;}
        else if(myGamePiece.y - myEnemis[i].y < 100)
        {myEnemis[i].y -= 0.5;}
      }
      else if (myEnemis[i].y > myGamePiece.y)
      {
        if(myEnemis[i].y - myGamePiece.y > 100)
        {myEnemis[i].y -= 0.5;}
        else if(myEnemis[i].y - myGamePiece.y < 100) 
        {myEnemis[i].y += 0.5}
      }
    }
    myEnemis[i].update();
  }
  
  for (i = 0; i < myProjectiles.length; i += 1) {
    
    myProjectiles[i].update()
    if (myProjectiles[i].newPos() == true)
    {myProjectiles.splice(myProjectiles[i], 1)}
  }
  
  
  if ((health == 2 || health == 1) && proteccdur == 0)
  {health3.image.src = 'hurt.ico'; health2.image.src = 'health.ico'}
  if (health == 1 && proteccdur == 0)
  {health2.image.src = 'hurt.ico'}
  if (health == 3 && proteccdur == 0) 
  {health3.image.src = 'health.ico'; health2.image.src = 'health.ico'}
  if (proteccdur > 0)
  { health2.update(); health2.image.src = 'protecc.ico'}
  if (proteccdur == 0)
  {health1.update();
  health2.update();
  health3.update();}

  
  for (i = 0; i < myEnemis.length; i += 1) {
    if (myGamePiece.crashWith(myEnemis[i]) && myEnemis[i].type == 'imageSpike' && hurtCool == 0 && proteccdur == 0) {
      health--; hurtCool = 100; 
      return;
    }
  }
  
  for (p =0; p < myProjectiles.length; p += 1) {
    if (myGamePiece.crashWith(myProjectiles[p]) && myProjectiles[p].type == 'enemi' && hurtCool == 0 && proteccdur == 0) 
    {
      health--; hurtCool = 100; myProjectiles.splice(p,1)
    } 
  }

  for (i = 0; i < myProjectiles.length; i += 1) {
    for (e = 0; e < myEnemis.length; e += 1) {
      if (myEnemis[e].crashWith(myProjectiles[i]) && myProjectiles[i].type == 'frend')
      { 
        if (myEnemis[e].type == 'imageSpike')
        {score += 2}
        if (myEnemis[e].type == 'imageShoot')
        {score += 5}
        myProjectiles.splice(i, 1);
        myEnemis.splice(e, 1); 
      }
    }   
  }

  for (p = 0; p < myPowerups.length; p += 1)
  {
    myPowerups[p].update();
    if (myGamePiece.crashWith(myPowerups[p]) && myPowerups[p].type == 'imageHeal' && health < 3)
    {
      myPowerups.splice(p, 1)
      health++
    }
    if (myGamePiece.crashWith(myPowerups[p]) && myPowerups[p].type == 'imageShield')
    { myPowerups.splice(p,1); proteccdur = 250; }

  }
  
  if (health == 0) 
  { 
    myGameArea.stop(); myGameArea.clear(); canvos.style.cursor = "default";
    canvos.style.backgroundColor = "darkred"; myScore.x = 25; 
    myScore.y = totH/2-70; myScore.width = "18px" ; 
    myScore.text = "you survived for " + Math.round(time) + " seconds, your score was " + score; 
    myScore.update(); document.getElementById("startbutt").style.display = "block"; 
    document.getElementById("startbutt").innerText = 'restart gem';
    ctx.fillStyle = 'blue'; ctx.fillRect(totW/2 - 105, 180, 210, 120);
    ctx.fillStyle = 'green'; ctx.font = "30px Consolas"; ctx.fillText('submit score', totW/2- 100, 210);
    ctx.font = '50px Consolas'; ctx.fillText('NAME', totW/2 - 55, 260 )
    ctx.moveTo(totW/2 - 100, 220); ctx.lineTo(350, 220);  
    ctx.moveTo(totW/2 - 100, 220); ctx.lineTo(totW/2 - 100, 270); 
    ctx.moveTo(350, 220); ctx.lineTo(350, 270); 
    ctx.moveTo(totW/2 - 100, 270); ctx.lineTo(350, 270); ctx.stroke(); 
    window.addEventListener('keypress', function(e) {
      key = e.key
      keyPress = true
      console.log(key)
      if ( keyPress == true) {deeeed()}
    })
    checkHighScore(score);
  }
}

function showHighscores()
{
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
  const pos1 = highScores[0]; console.log(pos1); const pos1name = pos1.NAMER; const pos1score = pos1.score; console.log(pos1name+'  '+pos1score)
  const pos2 = highScores[1] ?? null; console.log(pos2); if (pos2 != null) {var pos2name = pos2.NAMER; var pos2score = pos2.score; console.log(pos2name+'  '+pos2score)}
  const pos3 = highScores[2] ?? null; console.log(pos3); if (pos3 != null) {var pos3name = pos3.NAMER; var pos3score = pos3.score; console.log(pos3name+'  '+pos3score)}
  const pos4 = highScores[3] ?? null; console.log(pos4); if (pos4 != null) {var pos4name = pos4.NAMER; var pos4score = pos4.score; console.log(pos4name+'  '+pos4score)}
  ctx.clearRect(totW/2 - 105, 180, 210, 120); ctx.fillStyle = 'blue'; ctx.fillRect(totW/2 - 100, 160, 200, 180);
  ctx.fillStyle = 'green'; ctx.font = "30px Consolas"; ctx.fillText('scoreboard', totW/2- 85, 190); ded = false

  ctx.font = '25px Consolas'; 
  ctx.fillText('1 '+pos1name+' - '+pos1score, totW/2-85, 225);
  if (pos2 == null)
  {
    ctx.fillText('2 NAME - NaN', totW/2 - 85, 255)
  }
  else
  {
    ctx.fillText('2 '+pos2name+' - '+pos2score, totW/2-85, 255);
  }
  if (pos3 == null)
  {
    ctx.fillText('3 NAME - NaN', totW/2-85, 285);
  } 
  else
  {
    ctx.fillText('3 '+pos3name+' - '+pos3score, totW/2-85, 285);
  }
  if (pos4 == null)
  {
    ctx.fillText('4 NAME - NaN', totW/2-85, 315)
  }
  else
  {
    ctx.fillText('4 '+pos4name+' - '+pos4score, totW/2-85, 315);
  }
  ctx.beginPath()
  ctx.moveTo(totW/2 - 90, 200); ctx.lineTo(340, 200); 
  ctx.moveTo(totW/2 - 90, 230); ctx.lineTo(340, 230); 
  ctx.moveTo(totW/2 - 90, 260); ctx.lineTo(340, 260); 
  ctx.moveTo(totW/2 - 90, 290); ctx.lineTo(340, 290); 
  ctx.moveTo(totW/2 - 90, 320); ctx.lineTo(340, 320); 
  ctx.stroke();
}

function deeeed()
{
  
  if (canEnterName == true)
  {  
    if ((key == 'a' || key == 'b' || key == 'c' || key == 'd' || key == 'e' || key == 'f' || key == 'g' || key == 'h' 
      || key == 'i' || key == 'j' || key == 'k' || key == 'l' || key == 'm' || key == 'n' || key == 'o' || key == 'p' 
      || key == 'q' || key == 'r' || key == 's' || key == 't' || key == 'u' || key == 'v' || key == 'w' || key == 'x' || key == 'y' || key == 'z'
    ) && firstChar == false)
    {
      ctx.clearRect(totW/2 -60, 223, 120, 45); ctx.fillStyle = 'blue'; ctx.fillRect(totW/2 -60, 223, 120, 45); ctx.font = '50px Consolas'; 
      ctx.fillStyle = 'green'; console.log(key); ctx.fillText(key.toUpperCase(), totW/2 - 55, 260); firstChar = true; n = key;
    }
    else if ((key == 'a' || key == 'b' || key == 'c' || key == 'd' || key == 'e' || key == 'f' || key == 'g' || key == 'h' 
    || key == 'i' || key == 'j' || key == 'k' || key == 'l' || key == 'm' || key == 'n' || key == 'o' || key == 'p' 
    || key == 'q' || key == 'r' || key == 's' || key == 't' || key == 'u' || key == 'v' || key == 'w' || key == 'x' || key == 'y' || key == 'z'
    ) && firstChar == true && secondChar == false)
    {
      ctx.font = '50px Consolas'; ctx.fillStyle = 'green'; ctx.fillText(key.toUpperCase(), totW/2 - 28, 260); secondChar = true; a = key; console.log(a)
    }
    else if ((key == 'a' || key == 'b' || key == 'c' || key == 'd' || key == 'e' || key == 'f' || key == 'g' || key == 'h' 
    || key == 'i' || key == 'j' || key == 'k' || key == 'l' || key == 'm' || key == 'n' || key == 'o' || key == 'p' 
    || key == 'q' || key == 'r' || key == 's' || key == 't' || key == 'u' || key == 'v' || key == 'w' || key == 'x' || key == 'y' || key == 'z'
    ) && secondChar == true && thirdChar == false)
    {
      ctx.fillText(key.toUpperCase(), totW/2 - 1, 260); thirdChar = true; m = key; console.log(m)
    }
    else if ((key == 'a' || key == 'b' || key == 'c' || key == 'd' || key == 'e' || key == 'f' || key == 'g' || key == 'h' 
    || key == 'i' || key == 'j' || key == 'k' || key == 'l' || key == 'm' || key == 'n' || key == 'o' || key == 'p' 
    || key == 'q' || key == 'r' || key == 's' || key == 't' || key == 'u' || key == 'v' || key == 'w' || key == 'x' || key == 'y' || key == 'z'
    ) && thirdChar == true && fourthChar == false)
    {
      ctx.fillText(key.toUpperCase(), totW/2 + 26, 260); fourthChar = true; namer = n+a+m+key; NAMER = namer.toUpperCase(); console.log('your name is = '+NAMER); saveHighScore(score)
    }
    
    
    if (key == 'Enter' && fourthChar == true)
    {
      showHighscores()
    }
  }  
  if (key == ' ')
  {
    localStorage.clear()    
  }   
  // invalid name    
  // ctx.fillStyle = 'red'; ctx.font = '20px Consolas'; ctx.fillText('name already exists', totW/2 - 104, 290); 
  // firstChar = false; secondChar = false; thirdChar = false; fourthChar = false
  
}

