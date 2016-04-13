const undo = document.getElementById('undo')
const undoBounds = undo.getBoundingClientRect()
// position the undo button prettily
undo.style.position = "absolute"
undo.style.top = 6*window.innerHeight/7 + "px"
undo.style.left = window.innerWidth/2 - undoBounds.width/2 + "px"
const canvas = document.getElementById('goboard')
// position the canvas
canvas.style.position = "absolute"
canvas.style.border = "solid"
canvas.height = 2*window.innerHeight/3
canvas.width = canvas.height
canvas.style.height =  canvas.height + "px"
canvas.style.width = canvas.style.height
canvas.style.top = window.innerHeight/6 + "px"
canvas.style.left = window.innerWidth/2 - canvas.width/2 + "px"

const ctx = canvas.getContext('2d')
ctx.textAlign = "center"
const wood = new Image()
const lineStep = canvas.height/20
const dotRadius = lineStep/7
const stoneDiameter = lineStep

function draw19x19(){
  // draw the lines
  for(var i = 1; i < 20; i++){
    ctx.moveTo(i*lineStep, lineStep)
    ctx.lineTo(i*lineStep, 19*lineStep)
    ctx.moveTo(lineStep, i*lineStep)
    ctx.lineTo(19*lineStep, i*lineStep)
  }
  // draw the line labels
  for(var i = 1, j = 1; i < 20; i++, j++){
    // numbers up the sides
    ctx.fillText(i.toString(), lineStep/2, (20 - i + 0.2)*lineStep)
    ctx.fillText(i.toString(), 19.5*lineStep, (20 - i + 0.2)*lineStep)
    // letters across top and bottom
    if((64 + j) == 73) j++
    ctx.fillText(String.fromCharCode(64 + j), i*lineStep, lineStep/2)
    ctx.fillText(String.fromCharCode(64 + j), i*lineStep, 19.5*lineStep)
  }
  // draw handicap dots
  for(var x of [4, 10, 16]){
    for(var y of [4, 10, 16]){
      ctx.moveTo(x*lineStep, y*lineStep)
      ctx.arc(x*lineStep, y*lineStep, dotRadius, 0, 2*Math.PI)
      ctx.fill()
    }
  }
  ctx.stroke()
}

wood.width = canvas.width
wood.height = canvas.height
wood.onload = function(){
  // draw the background wood image
  ctx.drawImage(wood, 0, 0, canvas.width, canvas.height)
  draw19x19()
}
wood.src = "wood4.jpg"
const blackStone = new Image()
blackStone.src = "blackstone.png"
const whiteStone = new Image()
whiteStone.src = "whitestone.png"

const moves = []
var color = "black"
canvas.onclick = function(e){
  var x = closestLine(e.layerX)
  var y = closestLine(e.layerY)
  ctx.save()
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x, y, (stoneDiameter*0.90)/2, 0, 2*Math.PI)
  ctx.fill()
  ctx.stroke()
  ctx.drawImage(getImage(color), x - stoneDiameter/2, y - stoneDiameter/2, stoneDiameter, stoneDiameter)
  moves.push({color: color, x: x, y: y})
  toggleColor()
}

function closestLine(pixel){
  var lowerLine = Math.floor(pixel/lineStep)*lineStep
  var upperLine = Math.ceil(pixel/lineStep)*lineStep
  if(pixel < (lowerLine + upperLine)/2)
    return lowerLine
  else
    return upperLine
}

function getImage(color){
  if(color == "white")
    return whiteStone
  else
    return blackStone
}

function toggleColor(){
  if(color == "black")
    color = "white"
  else
    color = "black"
}

undo.onclick = function(e){
  ctx.restore()
  toggleColor()
  moves.pop()
}
