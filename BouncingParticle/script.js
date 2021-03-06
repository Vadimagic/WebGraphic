const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

let particleArray = [];
const numberOfParticles = 100;

const mouse = {
  x: null,
  y: null
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

setInterval(() => {
  mouse.x = undefined;
  mouse.y = undefined;
}, 200)

class Particle {
  constructor(x, y, size, color, weight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.weight = weight;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.size -= 0.1;
    if (this.size < 0) {
      this.x = mouse.x + Math.random() * 20 - 10;
      this.y = mouse.y + Math.random() * 20 - 10;
      this.size = Math.random() * 30 + 2;
      this.weight = Math.random() * 2 - 0.5;
    }
    this.y += this.weight;
    this.weight += 0.2;

    if ((this.y > canvas.height - this.size) && this.weight > 0) {
      this.weight *= -0.7;
    }
  }
}

function init() {
  particleArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 15 + 15;
    const color = 'rgb(254, 159, 0)';
    const weight = 2;
    particleArray.push(new Particle(x, y, size, color, weight));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'rgba(0, 0, 0, .4)';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
  }
  connect();
  requestAnimationFrame(animate);
}

init();
animate();

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = 0; b < particleArray.length; b++) {
      const dx = particleArray[a].x - particleArray[b].x;
      const dy = particleArray[a].y - particleArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 200) {
        opacityValue = distance < 100 ? 1 : 1 / (distance - 100);
        ctx.strokeStyle = ('rgba(0,0,0,' + opacityValue + ')');
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}