const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const particleArray = []

const mouse = {
  x: null,
  y: null,
  radius: 100
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x + canvas.clientLeft/2
  mouse.y = e.y + canvas.clientTop/2
})

const drawImage = () => {
  let imageWidth = image.width
  let imageHeight = image.height
  const data = ctx.getImageData(0,0,imageWidth, imageHeight)
  ctx.clearRect(0,0,canvas.width, canvas.height)

  class Particle {
    constructor(x, y, color, size) {
      this.x = x + canvas.width/2 - image.width * 2
      this.y = y + canvas.height/2 - image.height * 2
      this.color = color
      this.size = size
      this.baseX = x + canvas.width/2 - image.width * 2
      this.baseY = y + canvas.height/2 - image.height * 2
      this.density = (Math.random() * 10) + 2
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    }

    update() {
      ctx.fillStyle = this.color

      let dx = mouse.x - this.x
      let dy = mouse.y - this.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      let forceDirectionX = dx / distance
      let forceDirectionY = dy / distance

      const maxDistance = 100;

      let force = (maxDistance - distance) / maxDistance

      if (force < 0) {
        force = 0
      }

      let directionX = (forceDirectionX * force * this.density * 0.6)
      let directionY = (forceDirectionY * force * this.density * 0.6)

      if (distance < mouse.radius + this.size) {
        this.x -= directionX
        this.y -= directionY
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX
          this.x -= dx/20
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY
          this.y -= dy/20
        }
      }
      this.draw()
    }
  }

  function init() {

    for (let y = 0, y2 = data.height; y < y2; y++) {
      for (let x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
          let positionX = x
          let positionY = y
          let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + ","
                               + data.data[(y * 4 * data.width) + (x * 4) + 1] + ","
                               + data.data[(y * 4 * data.width) + (x * 4) + 2] + ")"
          particleArray.push(new Particle(positionX * 4, positionY * 4, color, 2))
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0,0,0,.05)'
    ctx.fillRect(0,0,innerWidth, innerHeight)

    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update()
    }
  }
  init()
  animate()
}

const image = new Image()
image.src = "data:image/png;base64,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"
 
window.addEventListener('load', (e) => {
  ctx.drawImage(image, 0, 0)
  drawImage()
})