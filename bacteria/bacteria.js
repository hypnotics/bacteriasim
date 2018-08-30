function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function Bacteria (id, shape, gram, p, c, o, f, g, s, x, y) {
  this.taxonomy = {
    'phylum': p,
    'class': c,
    'order': o,
    'family': f,
    'genus': g,
    'species': s
  }
  this.shape = shape
  this.position = {
    'x': x,
    'y': y
  }
  this.id = id
  this.name = g + ' ' + s
  this.gram_positive = gram
  this.greeting = function () {
    window.alert('Hi! I\'m ' + this.name + '.')
  }
}

var bact1 = new Bacteria(uuidv4(), 'Bacillus', true, null, null, null, null, 'Venenivibrio', 'stagnispumantis')
bact1.greeting()
