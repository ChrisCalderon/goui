function Strategy19x19(canvas, wood, blackStone, whiteStone){
  const ctx = canvas.getContext('2d')
  ctx.textAlign = "center"
  const lineStep = canvas.height/20
  const dotRadius = lineStep/7
  var moveCount = 0
  const moves = []
  const boardStates = []
  const boardStateUpdateInterval = 10

  this.getBoardStates = function(){
    return boardStates
  }

  this.getLineStep = function(){
    return lineStep
  }

  function initializeBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(wood, 0, 0, canvas.width, canvas.height)
  }

  this.setupBoard = function setupBoard(){
    initializeBoard()
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

  function _doMove(x, y, stone, color){
    //draw filled in circle and put the stone on top.
    //this is done because the stone has an alpha channel.
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, (lineStep*0.90)/2, 0, 2*Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.drawImage(stone, x - lineStep/2, y - lineStep/2, lineStep, lineStep)
  }

  function getClosestLine(pixel){
    var lowerLine = Math.floor(pixel/lineStep)*lineStep
    var upperLine = Math.ceil(pixel/lineStep)*lineStep
    if(pixel < (lowerLine + upperLine)/2){
      if(lowerLine == 0)
        return upperline
      else
        return lowerLine
    }
    else{
      if(lowerLine == 19)
        return lowerLine
      else
        return upperLine
    }
  }

  this.doMove = function doMove(x, y){
    if(moveCount%boardStateUpdateInterval==0)
      boardStates.push({data: ctx.getImageData(0, 0, canvas.width, canvas.height), moveCount: moveCount})
    x = getClosestLine(x)
    y = getClosestLine(y)
    const color = moveCount%2?"white":"black"
    const stone = moveCount%2?whiteStone:blackStone
    _doMove(x, y, stone, color)
    moves.push({color: color, stone: stone, x: x, y: y})
    moveCount++
  }

  this.undo = function undo(){
    moveCount--
    moves.pop()
    const last = boardStates.length - 1
    if(boardStates[last].moveCount > moveCount)
      boardStates.pop()
    ctx.putImageData(boardStates[last].data, 0, 0)
    for(var i = boardStates[last].moveCount; i < moveCount; i++){
      _doMove(moves[i].x, moves[i].y, moves[i].stone, moves[i].color)
    }
  }
}

function doStyle(canvas, undo){
  var undoBounds = undo.getBoundingClientRect()
  // position the undo button prettily
  undo.style.position = "absolute"
  undo.style.top = 6*window.innerHeight/7 + "px"
  undo.style.left = window.innerWidth/2 - undoBounds.width/2 + "px"
  // position the canvas
  canvas.style.position = "absolute"
  canvas.style.border = "solid"
  canvas.height = 2*window.innerHeight/3
  canvas.width = canvas.height
  canvas.style.height =  canvas.height + "px"
  canvas.style.width = canvas.style.height
  canvas.style.top = window.innerHeight/6 + "px"
  canvas.style.left = window.innerWidth/2 - canvas.width/2 + "px"
}

const undo = document.getElementById('undo')
const canvas = document.getElementById('goboard')
doStyle(canvas, undo)
const wood = new Image()
wood.src = "wood4.jpg"
wood.width = canvas.width
wood.height = canvas.height
const blackStone = new Image()
blackStone.src = "blackstone.png"
const whiteStone = new Image()
whiteStone.src = "whitestone.png"
const board = new Strategy19x19(canvas, wood, blackStone, whiteStone)
wood.onload = function(){
  // draw the background wood image
  board.setupBoard()
}

canvas.onclick = function(e){
  board.doMove(e.layerX, e.layerY)
}

undo.onclick = function(e){
  board.undo()
}
