let finishLine = 500; 
let finishCount = 0; 

let racer1, racer2;
let squareBullets = [];
let circleBullets = []; 
let shootInterval = 60;

function setup() {
  createCanvas(600, 200);
  startRace(); 
}

function draw() {
  background(50);
  drawCheckeredFinishLine();
  line(finishLine, 0, finishLine, height); 

  moveRacer(racer1);
  displayRacer(racer1);

  moveRacer(racer2);
  displayRacer(racer2);

  moveBullets(squareBullets);
  moveBullets(circleBullets);
  displayBullets(squareBullets);
  displayBullets(circleBullets);

  checkCollision(racer1, racer2);

  if (frameCount % shootInterval === 0) {
    fireCircleBullet();
  }

  if (finishCount === 2) {
    setTimeout(startRace, 2000); 
  }
}

function startRace() {
  finishCount = 0;
  squareBullets = [];
  circleBullets = [];

  racer1 = {
    x: 50,
    y: 60,
    speed: random(1, 5),
    color: [random(255), random(255), random(255)],
    shape: 'circle',
    finished: false,
    finishedOrder: 0,
  };

  racer2 = {
    x: 50,
    y: 120,
    speed: random(1, 5),
    color: [random(255), random(255), random(255)],
    shape: 'square',
    finished: false,
    finishedOrder: 0,
  };
}

function moveRacer(racer) {
  if (!racer.finished) {
    racer.x += racer.speed;

    if (racer.x >= finishLine) {
      racer.finished = true;
      finishCount++;
      
      racer.finishedOrder = finishCount;
      
      if (racer.finishedOrder === 1) {
        racer.color = [0, 255, 0];
      } else if (racer.finishedOrder === 2) {
        racer.color = [255, 0, 0];
      }
    }
  }
}

function displayRacer(racer) {
  fill(racer.color);
  if (racer.shape === 'circle') {
    ellipse(racer.x, racer.y, 20, 20);
  } else if (racer.shape === 'square') {
    rect(racer.x, racer.y, 20, 20);
  }
}

function checkCollision(racerA, racerB) {
  if (dist(racerA.x, racerA.y, racerB.x, racerB.y) < 20) {
    let tempSpeed = racerA.speed;
    racerA.speed = racerB.speed;
    racerB.speed = tempSpeed;

    racerA.color = [255, 0, 0];
    racerB.color = [255, 0, 0];

    setTimeout(() => {
      racerA.color = [random(255), random(255), random(255)];
      racerB.color = [random(255), random(255), random(255)];
    }, 500);
  }
}

function moveBullets(bullets) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    let target = bullet.from === 'square' ? racer1 : racer2;
    if (dist(bullet.x, bullet.y, target.x, target.y) < 10) {
      target.speed *= 0.5; 
      bullets.splice(i, 1);
      continue;
    }

    if (bullet.x > width || bullet.x < 0 || bullet.y > height || bullet.y < 0) {
      bullets.splice(i, 1); 
    }
  }
}

function displayBullets(bullets) {
  fill(220);
  for (let bullet of bullets) {
    ellipse(bullet.x, bullet.y, 10, 10);
  }
}

function mousePressed() {
  fireSquareBullet(mouseX, mouseY);
}

function fireSquareBullet(targetX, targetY) {
  let dx = targetX - racer2.x;
  let dy = targetY - racer2.y;
  let angle = atan2(dy, dx);

  let newBullet = {
    x: racer2.x,
    y: racer2.y,
    vx: 5 * cos(angle),
    vy: 5 * sin(angle),
    from: 'square', 
  };

  squareBullets.push(newBullet);
}

function drawCheckeredFinishLine() {
  let squareSize = 10;
  for (let i = 0; i < height; i += squareSize) {
    if ((i / squareSize) % 2 === 0) {
      fill(0); 
    } else {
      fill(255);
    }
    rect(finishLine, i, squareSize, squareSize);
  }
}

function fireCircleBullet() {
  let dx = racer2.x - racer1.x;
  let dy = racer2.y - racer1.y;
  let angle = atan2(dy, dx);

  let newBullet = {
    x: racer1.x,
    y: racer1.y,
    vx: 5 * cos(angle), 
    vy: 5 * sin(angle), 
    from: 'circle', 
  };
  circleBullets.push(newBullet);
}