/* model */
let deckCount
let players = []

/* view */
let canvas
let deckText
let playerTexts = []

let initBoard = (newCanvas, newPlayers, newDeckCount) => {
  console.log('drawing board: players: ' + JSON.stringify(newPlayers) + ' deckcCount: ' + newDeckCount)
  canvas = newCanvas
  canvas.backgroundColor = 'rgb(58, 96, 63)'
  deckCount = newDeckCount
  let deckBox = new fabric.Rect({
    top: 10,
    stroke: 2,
    fill: 'white',
    selectable: false
  })
  deckText = new fabric.Text('Deck\nCount: ' + deckCount, {
    top: 20,
    fontSize: 20,
    selectable: false
  })
  canvas.add(deckBox, deckText)
  deckBox.width = deckText.width + 20
  deckBox.height = deckText.height + 20
  deckBox.centerH()
  deckText.centerH()

  if (newPlayers) newPlayers.forEach(player => players.push(player))
  let offset = 0
  if (players.length) offset = canvas.width / players.length

  for (let i = 0; i < players.length; i++) {
    let top = 10 + 150
    let left = 10 + (offset * i)
    let playerBox = new fabric.Rect({
      top: top,
      left: left,
      stroke: 2,
      fill: 'white',
      selectable: false
    })
    let playerText = new fabric.Text(players[i] + '\nCards:', {
      top: top + 10,
      left: left + 10,
      fontSize: 20,
      selectable: false
    })
    canvas.add(playerBox, playerText)
    playerTexts.push(playerText)
    playerBox.width = playerText.width + 20
    playerBox.height = playerText.height + 20
  }
}

let playerDrew = (clientId, card) => {

}

let playerStod = (clientId) => {

}

export default {
  initBoard,
  playerDrew,
  playerStod
}
