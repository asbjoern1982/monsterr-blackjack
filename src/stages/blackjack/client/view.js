import {clientSharedInterface as netframe} from '../lib/netframe'

let boardSize = 500
let padding = 20

let deck
let deckView
let handViews

let init = () => {
  reset()
  let deckBorder = new fabric.Rect({
    left: padding + boardSize / 2 - 75,
    top: padding,
    width: 150,
    height: 50,
    fill: 'white',
    stroke: 'black',
    selectable: false
  })
  netframe.getClient().getCanvas().add(deckBorder)
}

let reset = () => {
  deck = null
  deckView = null
  handViews = new Map()
}

let setDeck = (newDeck) => {
  deck = newDeck
  deckView = new fabric.Text('count: ' + deck.getCount(), {
    left: padding + boardSize / 2 - 70,
    top: padding,
    fontSize: 12,
    selectable: false
  })
  netframe.getClient().getCanvas().add(deckView)
}

let addHand = (hand, name) => {
  console.log('ash: view>addhand ' + JSON.stringify(hand))
  // TODO move other hands to the side or clear it and rebuild it
  // hands should be shown in a circle around the deck
  // maybe hands can be transformed to simulate a table?

  let handBackground = new fabric.Rect({
    left: padding + handViews.size * 120,
    top: padding + 100,
    width: 100,
    height: 50,
    fill: 'white',
    stroke: 'black',
    selectable: false
  })

  let cards = ''

  let points = 0
  for (let c in hand.cards) {
    cards = '[' + hand.cards[c].getColor() + hand.cards[c].getRank() + ']'
    points += hand.cards[c].getRank()
  }

  let handView = new fabric.Text('name: ' + name + '\ncards: ' + cards + '\ntotal: ' + points, {
    left: padding + handViews.size * 120,
    top: padding + 100,
    fontSize: 12,
    selectable: false
  })
  handViews.set(hand.id, handView)
  netframe.getClient().getCanvas().add(handBackground, handView)
}

let updateDeck = () => {
  console.log('ash: view>updatedeck')
  if (deck) deckView.setText(deck.getCount())
  netframe.getClient().getCanvas().renderAll()
}

let updatehand = (hand) => {
  console.log('ash: view>updatehand ' + hand)
  if (handViews.get(hand.id)) {
    handViews.get(hand.id).setText(hand.getPoints())
  }
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
