import Card from '../shared/model/card'
import modelController from '../shared/controller/controller'
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
  deck = createDecks()
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
  netframe.log('createPlayer() called on server.')
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
  for (let d = 0; d < this.numberOfSets; d++) {
    for (let r in ranks) {
      for (let c in colors) {
        let entityId = netframe.createNewEntityId()
        cards.push(new Card(entityId, ranks[r] + colors[c]))
      }
    }
  }

  let deck = modelController.createDeck(cards)
  deck.shuffle()
  // TODO sync the clients?
  return deck
}

let cmdCardDelt = () => {

}

// ---------------------------------------------------------------

const commands = {
  'cmdCardDelt': cmdCardDelt
}

const api = {
  clientConnected: clientConnected,
  init: init,
  commands: commands
}

export default api
