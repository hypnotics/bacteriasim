
function HSLA (h, s, l, a) {
  this.h = h
  this.s = s
  this.l = l
  this.a = a === 0 ? 0 : (a ? a : 1)
}

HSLA.prototype = {
  clone: function () {
    return new HSLA(this.h, this.s, this.l, this.a)
  },

  toString: function () {
    var h = Math.round(((this.h % 360) + 360) % 360)
    var s = Math.round(this.s)
    var l = Math.round(this.l)
    return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + this.a + ')'
  }
}

function Particle () {
  this.x = this.y = 0
  this.vx = this.vy = 0
  this.scale = 1
}

function Line (color, id, polars) {
  this.pts = []
  this.color = color
  this.segment = 15 + Math.random() * 15
  this.nPts = 15 + Math.floor(Math.random() * 10)

  this.id = id
  this.polars = polars
  this.ratio = 0.5 + Math.random() * 0.5
  this.ratio = Math.random()

  for (var i = 0; i < this.nPts; i++) {
    var p = new Particle()
    p.x = 2 * (Math.random() * 2 - 1) * this.nPts * this.segment
    p.y = 2 * (Math.random() * 2 - 1) * this.nPts * this.segment
    this.pts[i] = p
  }

  this.pSpeed = 0.1
  this.friction = 0.99
  this.width = Math.pow(Math.random(), 2) * 4 + 0.5

  this.update()
}

Line.prototype = {

  update: function () {
    var p = this.pts[0]
    var r = this.polars[this.id]
    var a = this.polars[this.id + 1]
    p.x = this.ratio * r * Math.cos(a)
    p.y = this.ratio * r * Math.sin(a)
    for (var i = 1; i < this.nPts; i++) {
      p = this.pts[i]
      p.vx += this.pSpeed * (2 * Math.random() - 1)
      p.vy += this.pSpeed * (2 * Math.random() - 1)
      p.vx += 0.000025 * p.x
      p.vy += 0.000025 * p.y
      p.vx *= this.friction
      p.vy *= this.friction
      p.x += p.vx
      p.y += p.vy

      var p2 = this.pts[i - 1]
      var dx = p2.x - p.x
      var dy = p2.y - p.y
      var d = dx * dx + dy * dy
        // if(d < this.segment * this.segment) continue;
      var r = this.segment / Math.sqrt(d)
      p.x = p2.x - r * dx
      p.y = p2.y - r * dy
    }
  },

  draw: function (out) {
    out.beginPath()
    var p = this.pts[0]
    out.moveTo(p.x, p.y)
    for (var i = 1; i < this.nPts - 1; i++) {
      p = this.pts[i]
      var p2 = this.pts[i + 1]
      out.quadraticCurveTo(p.x, p.y, 0.5 * (p.x + p2.x), 0.5 * (p.y + p2.y))
    }
    out.lineWidth = this.width
    out.strokeStyle = this.color
    out.stroke()
  }
}

var stage = new tools.Stage(700, 700)
var out = stage.out

var temp = new tools.Stage(700, 700, false)

stage.autoSize(onResize)
var nCoords = 200
var step = 2 * Math.PI / nCoords
out.lineWidth = 2
var radius = 150
var coords = []
var polars = []

var particlesFriction = 0.99
var particlesSpeed = 0.05
var particles = []
var nParticles = 20
var radiusBoundaryForce = 0.00002
var separation = 0.0001

var hue = Math.random() * 360
var sat = 10

var bg = new HSLA(hue, 90, 2)

var border1 = new HSLA(hue, sat, 20, 0.5)
var border2 = new HSLA(hue, sat, 90, 0.5)
var cellBg1 = new HSLA(hue, sat, 0, 1)
var cellBg2 = new HSLA(hue, sat, 25, 1)
var cellBg = temp.out.createRadialGradient(0, 0, 0, 0, 0, 2 * radius)
cellBg.addColorStop(0, cellBg1.toString())
cellBg.addColorStop(1, cellBg2.toString())

var particleBg1 = new HSLA(hue, sat, 20, 0.8)
var particleBg2 = new HSLA(hue, sat, 17)
var particleBg3 = new HSLA(hue, sat, 23)
mutateColor(particleBg1)
mutateColor(particleBg2)
mutateColor(particleBg3)

var microParticlesColor = new HSLA(hue, sat, 35)

var lineColor = new HSLA(hue, sat, 90, 0.2)

for (var i = 0; i < nParticles; i++) {
  var p = new Particle()
  p.size = 40 * Math.pow(i / nParticles, 4) + 5
  var a = Math.random() * 2 * Math.PI
  var r = Math.random() * radius
  p.x = r * Math.cos(a)
  p.y = r * Math.sin(a)

  particles[i] = p
}

var nMicroParticles = 300
var microParticles = []
for (var i = 0; i < nMicroParticles; i++) {
  var p = new Particle()
  p.x = (Math.random() * 2 - 1) * radius
  p.y = (Math.random() * 2 - 1) * radius
  microParticles[i] = p
}

var time = 0

generateCoords()

var lines = []
var nLines = 20
for (var i = 0; i < nLines; i++) {
  var id = 2 * Math.floor(nCoords * Math.random())
  var l = new Line(lineColor.toString(), id, polars)
  lines[i] = l
}

function update () {
  var t = Date.now()
  stage.clear()
  temp.clear()
  out.fillStyle = bg.toString()
  out.fillRect(0, 0, stage.width, stage.height)

  generateCoords()

  out.save()
  out.translate(0.5 * stage.width, 0.5 * stage.height)

  drawOutline(out)
  out.fillStyle = cellBg
  out.fill()
  out.restore()

  temp.out.save()
  temp.out.translate(0.5 * stage.width, 0.5 * stage.height)

  drawOutline(temp.out)
  temp.out.fillStyle = cellBg
  temp.out.fill()

  updateParticles()
  drawParticles(temp.out)
  out.globalAlpha = 0.4
  out.drawImage(temp.canvas, 0, 0)
  temp.out.restore()
  out.globalAlpha = 1

  out.save()
  out.translate(0.5 * stage.width, 0.5 * stage.height)

  drawHair(out)

  out.strokeStyle = border1.toString()
  out.lineWidth = 15
  drawOutline(out)
  out.strokeStyle = border2.toString()
  out.lineWidth = 12
  drawOutline(out)
  out.strokeStyle = border1.toString()
  out.lineWidth = 5
  drawOutline(out)

  updateLines(out)

  out.restore()
  time += 0.5
}

function drawOutline (out) {
  out.beginPath()
  out.moveTo(coords[0], coords[1])
  for (var i = 1; i < nCoords; i++) {
    out.lineTo(coords[2 * i], coords[2 * i + 1])
  }
  out.lineTo(coords[0], coords[1])
  out.stroke()
}

function drawHair (out) {
  out.beginPath()
  out.fillStyle = border1.toString()
  c = border2.clone()
  c.a = 0.5
  out.fillStyle = c.toString()
  for (var i = 0; i < nCoords; i++) {
    if (!(i % 5)) continue

    var curr = 2 * i
    var posX = coords[curr]
    var posY = coords[curr + 1]
    var prev = 2 * (i ? i - 1 : nCoords - 1)
    var next = 2 * (i == nCoords - 1 ? 0 : i + 1)
    var dx1 = posX - coords[prev]
    var dy1 = posY - coords[prev + 1]
    var d1 = 1 / Math.sqrt(dx1 * dx1 + dy1 * dy1)
    dx1 *= d1
    dy1 *= d1

    var dx2 = posX - coords[next]
    var dy2 = posY - coords[next + 1]
    var d2 = 1 / Math.sqrt(dx2 * dx2 + dy2 * dy2)
    dx2 *= d2
    dy2 *= d2

    var scale = i % 3 ? 0.5 : 1.2
    var sign = dx1 * dy2 - dx2 * dy1 > 0 ? -1 : 1
    var dx = 0.5 * (dx1 + dx2)
    var dy = 0.5 * (dy1 + dy2)
    var length = 7 + 7 * (Math.cos(5 * i * step + 0.01 * Math.cos(time)) + 2)
    var d = scale * sign * length / Math.sqrt(dx * dx + dy * dy)
    dx *= d
    dy *= d

    out.moveTo(posX, posY)
    var a = 0.2 * time + 0.3 * i
    var cpx = posX + 0.5 * dx + 0.5 * dx * (Math.cos(a))
    var cpy = posY + 0.5 * dy + 0.5 * dy * (Math.sin(a))

    out.quadraticCurveTo(cpx, cpy, posX + dx, posY + dy)
    if (!(i % 3))out.fillRect(posX + dx - 1.5, posY + dy - 1.5, 3, 3)
  }
  out.strokeStyle = border2.toString()
  c = border2.clone()
  c.a = 0.5
  out.strokeStyle = c.toString()
  out.lineWidth = 1
  out.stroke()
}

function updateLines (out) {
  for (var i = 0; i < nLines; i++) {
    var l = lines[i]
    l.update()
    l.draw(out)
  }
}

function generateCoords () {
    // x, y
  var s = 0.6
  for (var i = 0; i < nCoords; i++) {
    var ang = i * step
    ang += 0.1 * Math.cos(0.01 * time + ang)
    ang += 0.25 * Math.cos(0.05 * time + ang)
    var r = radius
    r += s * 15 * Math.cos(5 * ang + 0.1 * time)
    r -= s * 15 * Math.cos(2 * ang - 0.1 * time)
    r += s * 10 * Math.sin(5 * ang + 0.02 * time)
    r -= s * 15 * Math.sin(2 * ang - 0.01 * time)
    r += s * 10 * Math.cos(2 * ang + 0.01 * time) * Math.sin(5 * ang + 0.1 * time)
    r += s * 10 * Math.sin(5 * ang - 0.1 * time) * Math.sin(ang + 0.1 * time)

    coords[2 * i] = r * Math.cos(ang)
    coords[2 * i + 1] = r * Math.sin(ang)
    polars[2 * i] = r
    polars[2 * i + 1] = ang
  }
}

function updateParticles () {
  for (var i = 0; i < nParticles; i++) {
    var p = particles[i]
    p.vx += particlesSpeed * (Math.random() * 2 - 1)
    p.vy += particlesSpeed * (Math.random() * 2 - 1)
    p.vx -= radiusBoundaryForce * p.x
    p.vy -= radiusBoundaryForce * p.y

    for (var j = i + 1; j < nParticles; j++) {
      var p2 = particles[j]
      var dx = p2.x - p.x
      var dy = p2.y - p.y
      var r = p.size + p2.size
      var d = dx * dx + dy * dy
      if (d < r * r) {
        p.vx -= separation * dx
        p.vy -= separation * dy
        p2.vx += separation * dx
        p2.vy += separation * dy
      }
    }
    p.vx *= particlesFriction
    p.vy *= particlesFriction
    p.x += p.vx
    p.y += p.vy
  }

  for (var i = 0; i < nMicroParticles; i++) {
    var p = microParticles[i]
    p.vx -= 0.00002 * p.x
    p.vy -= 0.00002 * p.y
    p.vx = 0.99 * p.vx + 0.1 * (Math.random() * 2 - 1)
    p.vy = 0.99 * p.vy + 0.1 * (Math.random() * 2 - 1)
    p.x += p.vx
    p.y += p.vy
  }
}

function drawParticles (out) {
  out.save()
  out.globalCompositeOperation = 'source-atop'

  out.fillStyle = microParticlesColor.toString()
  for (var i = 0; i < nMicroParticles; i++) {
    var p = microParticles[i]
    out.fillRect(p.x, p.y, 2, 2)
  }

  drawParticlesLayer(out, 20, particleBg1)
  drawParticlesLayer(out, 2, particleBg2)
  drawParticlesLayer(out, 0, particleBg3)

  out.restore()
}

function drawParticlesLayer (out, margin, color) {
  out.beginPath()
  for (var i = 0; i < nParticles; i++) {
    var p = particles[i]
    out.moveTo(p.x + p.size + margin, p.y)
    out.arc(p.x, p.y, p.size + margin, 0, 2 * Math.PI)
  }
  out.fillStyle = color.toString()
  out.fill()
}

function onResize () {
	  temp.resize(stage.width, stage.height)
}

function mutateColor (c) {
	  c.h += 50 * (Math.random() * 2 - 1)
}
new tools.Loop(update, this)
