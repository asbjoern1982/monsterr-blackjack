import modelController from '../shared/controller/controller'
import model from '../shared/model/model'
import {serverSharedInterface as netframe} from '../lib/netframe'

let deck

// ---------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------

let init = (serverInstance) => {
  // Setup and initiate NetFrame
  netframe.shouldLog(true) // set logging
  netframe.addUpdateCallback(update) // add update callback
  netframe.addClientConnectedCallback(clientConnected) // add client connected callback
  netframe.init(serverInstance) // set server reference
  netframe.startLoop(10) // start server update with X ms interval - stop again with stopLoop()

  // server generates deck on startup
  deck = createDecks(1)
}

// Gets called from netframe after each update
let update = () => {}

let clientConnected = (client, networkIdentity) => {
  netframe.log('clientConnected() called on server-controller...')

  // Create player
  createPlayer(client, networkIdentity.name)

  // TODO start the game when the first player joins
  if (netframe.getNetworkIdentities().length >= 1) {
    // spawnBox()
  }
}

let createPlayer = (owner, name) => {
  let entityId = netframe.createNewEntityId()
  modelController.createHand(entityId, owner)
}

// ---------------------------------------------------------------
// Controller functions
// ---------------------------------------------------------------

let createDecks = (numberOfSets) => {
  let cards = []
  let ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k']
  let colors = ['c', 'd', 'h', 's']
  for (let d = 0; d < numberOfSets; d++) {
    for (let r in ranks) {
      for (let c in colors) {
        let entityId = netframe.createNewEntityId()
        let card = modelController.createCard(entityId, ranks[r] + colors[c])
        cards.push(card) // new model.Card(entityId, ranks[r] + colors[c]))
      }
    }
  }

  let entityId = netframe.createNewEntityId()
  let newDeck = modelController.createDeck(entityId, cards)
  newDeck.shuffle()
  return newDeck
}

let cmdOneMore = (hand) => {
  if (!hand.isStopped()) {
    let card = deck.drawCard()
    hand.addCard(card)
    if (hand.getPoints() > 21) {
      hand.stop()
      if (isTurnOver) {
        dealersTurn()
      }
    }
  }
}

let cmdStop = (hand) => {
  netframe.log('ash: client asked to stop, entity: ' + JSON.stringify(hand))
  hand.stop()

  if (isTurnOver()) {
    dealersTurn()
  }
}

let isTurnOver = () => {
  let turnover = netframe.getEntitiesKeys()
    .map(key => netframe.getEntity(key))
    .filter(e => e instanceof model.Hand)
    .filter(hand => !hand.stopped)
  console.log('ash> turnover: ' + JSON.stringify(turnover))
  return turnover.length === 0
}

let dealersTurn = () => {
  netframe.log('ash: dealers turn now!!')
  let maxPoints = netframe.getEntitiesKeys()
    .map(key => netframe.getEntity(key))
    .filter(e => e instanceof model.Hand)
    .filter(hand => hand.getPoints() <= 21)
    .reduce((max, hand) => Math.max(max, hand.getPoints()), 0)

  while (deck.getPoints() < maxPoints) {
    deck.drawnCards.push(deck.drawCard())
  }
  // gameover
  console.log('ash> max was: ' + maxPoints + ' and dealer drew: ' + deck.getPoints())
  if (deck.getPoints() > 21) {
    netframe.makeRPC('chatRPC', ['ash> GAMEOVER: players won'])
    console.log('ash> GAMEOVER: players won')
  } else {
    netframe.makeRPC('chatRPC', ['ash> GAMEOVER: dealer won'])
    console.log('ash> GAMEOVER: dealer won')
  }
  setTimeout(() => {
    console.log('ash> reset game')
    /* let count = deck.drawnCards.length
    for (let i = 0; i < count; i++) deck.cards.push(deck.drawnCards.pop())
    netframe.getEntitiesKeys()
      .map(key => netframe.getEntity(key))
      .filter(e => e instanceof model.Hand)
      .forEach((hand) => {
        let count = hand.cards.length
        for (let i = 0; i < count; i++) deck.cards.push(hand.cards.pop())
        hand.stopped = false
      }) */
  }, 2500)
}

// ---------------------------------------------------------------

const commands = {
  'cmdStop': cmdStop,
  'cmdOneMore': cmdOneMore
}

const api = {
  clientConnected: clientConnected,
  init: init,
  commands: commands
}

export default api
