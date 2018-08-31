function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function Bacteria (id, shape, gram, p, c, o, f, g, s, x, y, pMin,pMed,pMax,tMin,tMed,tMax,oMin,oMed,oMax) {
  this.taxonomy = {
    'phylum': p,
    'class': c,
    'order': o,
    'family': f,
    'genus': g,
    'species': s
  }
  this.tolerance = {
    'ph': [pMin,pMed,pMax],
    'temp': [tMin,tMed,tMax],
    'oxygen': [oMin,oMed,oMax]
  }

  this.shape = shape
  this.position = {
    'x': x,
    'y': y
  }
  this.id = id
  this.name = g + ' ' + s
  this.gram = gram
  this.greeting = function () {
    window.alert('Hi! I\'m ' + this.name + '.')
  }
}

// var bact1 = new Bacteria(
//     uuidv4(), 
//     'bacillus', 
//     true, 
//     'Aquificae', 
//     'Aquificae', 
//     'Aquificales', 
//     'Hydrogenothermaceae', 
//     'Venenivibrio', 
//     'stagnispumantis',
//     Math.random()*100,
//     Math.random()*100,
//     4.8, 5.4, 5.8, // pH
//     45, 70, 75, // Celsius
//     1, 6, 10 // v/v Oxygen
//   )

// bact1.greeting()
