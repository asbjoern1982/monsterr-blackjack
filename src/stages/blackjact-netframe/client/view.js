import {clientSharedInterface as netframe} from '../lib/netframe'

let boardSize = 500
let padding = 20

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
  deckView = null
  handViews = new Map()
}

let setDeck = (deck) => {
  deckView = new fabric.Text('count: ' + deck.getCount(), {
    left: padding + boardSize / 2 - 70,
    top: padding,
    fontSize: 12,
    selectable: false
  })
  netframe.getClient().getCanvas().add(deckView)
}

let addHand = (hand, name) => {
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
    cards = '[' + hand.cards[c].color + hand.cards[c].rank + ']'
    points += Math.floor(hand.cards[c].rank)
  }

  let handView = new fabric.Text('name: ' + name + '\ncards: ' + cards + '\ntotal: ' + points, {
    left: padding + 2 + handViews.size * 120,
    top: padding + 2 + 100,
    width: 100 - 1,
    height: 50 + 4,
    fontSize: 12,
    selectable: false
  })
  handViews.set(hand.id, handView)
  netframe.getClient().getCanvas().add(handBackground, handView)
}

let updateDeck = (deck) => {
  let cards = ''
  let points = 0
  for (let c in deck.drawnCards) {
    cards += '[' + deck.drawnCards[c].color + deck.drawnCards[c].rank + ']'
    points += Math.floor(deck.drawnCards[c].rank)
  }

  console.log('count: ' + deck.cards.length + '\ncards: ' + cards + '\ntotal: ' + points)

  deckView.text = 'count: ' + deck.cards.length + '\ncards: ' + cards + '\ntotal: ' + points

  netframe.getClient().getCanvas().renderAll()
}

let updatehand = (hand) => {
  if (handViews.get(hand.id)) { // FIXME defensive
    let cards = ''
    let points = 0
    for (let c in hand.cards) {
      cards += '[' + hand.cards[c].color + hand.cards[c].rank + ']'
      points += Math.floor(hand.cards[c].rank)
    }
    let text = 'name: ' + hand.owner + '\ncards: ' + cards + '\ntotal: ' + points
    handViews.get(hand.id).text = text

    if (hand.stopped) {
      // only the text area though
      console.log('stopped!! setting background color')
    } else {
      handViews.get(hand.id).set('backgroundColor', 'white')
    }
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
