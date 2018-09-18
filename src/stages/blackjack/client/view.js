import {clientSharedInterface as netframe} from '../lib/netframe'

let boardSize = 500
let padding = 20

let deck
let deckView
let hands
let handViews

let init = () => {
  reset()
  let deckBorder = new fabric.Reck({
    left: padding + boardSize / 2 - 75,
    top: padding,
    width: 150,
    height: 50,
    selectable: false
  })
  netframe.getClient().getCanvas().add(deckBorder)
}

let reset = () => {
  hands = []
  deck = null
  deckView = null
  handViews = new Map()
}

let setDeck = (deck) => {
  this.deck = deck
  deckView = new fabric.Text(deck.getCount, {
    left: padding + boardSize / 2 - 70,
    top: padding,
    fontSize: 12,
    selectable: false
  })
  netframe.getClient().getCanvas().add(deckView)
}

let addHand = (hand) => {
  hands.push(hand)
  // TODO move other hands to the side or clear it and rebuild it
  // hands should be shown in a circle around the deck
  // maybe hands can be transformed to simulate a table?

  let handView = new fabric.Text(hand.getPoints, {
    left: padding + boardSize / 2 - 70,
    top: padding,
    fontSize: 12,
    selectable: false
  })
  handViews.set(hand.id, handView)
}

let updateDeck = () => {
  deckView.setText(deck.getCount())
  netframe.getClient().getCanvas().renderAll()
}

let updatehand = (id) => {
  netframe.getClient().getCanvas().renderAll()
}

export default {
  init,
  reset,
  setDeck,
  updateDeck,
  addHand,
  updatehand
}
